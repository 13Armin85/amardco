import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  ImagePlus,
  Layers3,
} from "lucide-react";
import { getProduct, getProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import CTA from "../components/CTA";
import { useSEO } from "../hooks/useSEO";
import { getProductImage } from "../lib/productImages";
import { getImageMetadata } from "../lib/imageMetadata";
import { absoluteUrl, breadcrumbSchema, publisherSchema } from "../lib/seo";
import type { Product } from "../types";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useSEO(
    product ? `${product.title} | آمارد` : "محصول | آمارد",
    product?.shortDescription || "جزئیات محصول آمارد",
    {
      path: `/products/${slug || ""}`,
      image: product ? getProductImage(product.id) : undefined,
      imageAlt: product ? `نمای محصول ${product.title}` : undefined,
      noIndex: !loading && !product,
      schemas: product ? [{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
            url: absoluteUrl(`/products/${product.slug}`),
            name: product.title,
            description: product.description,
            category: product.category,
            image: getProductImage(product.id) ? absoluteUrl(getProductImage(product.id)) : undefined,
            brand: publisherSchema,
            additionalProperty: product.capabilities.map(capability => ({
              "@type": "PropertyValue",
              name: "قابلیت نرم‌افزار",
              value: capability,
            })),
          },
          breadcrumbSchema([
            { name: "خانه", path: "/" },
            { name: "محصولات", path: "/products" },
            { name: product.title, path: `/products/${product.slug}` },
          ]),
        ],
      }] : [],
    },
  );

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      if (!slug) {
        setProduct(null);
        setError("محصول یافت نشد.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const [selectedProduct, productList] = await Promise.all([
          getProduct(slug),
          getProducts(),
        ]);

        if (!ignore) {
          setProduct(selectedProduct);
          setProducts(productList);
        }
      } catch {
        if (!ignore) {
          setProduct(null);
          setError("محصول از سرور دریافت نشد.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const related = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) => item.category === product.category && item.id !== product.id,
      )
      .slice(0, 3);
  }, [product, products]);

  if (loading) {
    return <div className="container page-space">در حال دریافت از سرور...</div>;
  }

  if (!product) {
    return <div className="container page-space">{error || "محصول یافت نشد."}</div>;
  }

  const productImage = getProductImage(product.id);
  const productImageMetadata = productImage ? getImageMetadata(productImage) : undefined;

  return (
    <>
      <section className="product-hero">
        <div className="container">
          <Link className="back-link" to="/products">
            <ArrowRight size={17} /> بازگشت به محصولات
          </Link>
          <div className="product-hero-grid">
            <div>
              <span className="chip">{product.category}</span>
              <h1>{product.title}</h1>
              <p>{product.description}</p>
              <Link className="btn btn-primary" to="/contact">
                درخواست مشاوره
              </Link>
            </div>
            <div className={`product-image-slot${productImage ? " has-image" : ""}`}>
              {productImage ? (
                <img
                  src={productImage}
                  alt={`نمای محصول ${product.title}`}
                  width={productImageMetadata?.width}
                  height={productImageMetadata?.height}
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <>
                  <ImagePlus />
                  <strong>جای تصویر محصول</strong>
                  <span>
                    {product.imageHint ||
                      "تصویر رابط کاربری یا نمای محصول را اینجا قرار دهید."}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container detail-grid">
          <div>
            <span className="eyebrow">ویژگی‌ها</span>
            <h2>قابلیت‌های کلیدی</h2>
            <p className="detail-intro">
              مهم‌ترین امکانات این راهکار برای مکانیزه‌سازی فرایندها، افزایش
              دقت و دسترسی سریع‌تر به اطلاعات سازمانی.
            </p>
          </div>
          <div className="detail-bento">
            {product.features.map((feature, index) => (
              <article key={feature}>
                <CircleDot />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {product.contentSections && product.contentSections.length > 0 && (
        <section className="section-pad compact-top product-content-section">
          <div className="container product-content">
            <div className="product-content-heading">
              <span className="eyebrow">معرفی جامع محصول</span>
              <h2>راهکاری تخصصی برای مدیریت یکپارچه سازمان</h2>
            </div>
            <div className="product-content-body">
              {product.contentSections.map((section) => (
                <article key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad compact-top">
        <div className="container">
          <div className="capability-panel">
            <div>
              <span className="eyebrow">دامنه محصول</span>
              <h2>چه بخش‌هایی را پوشش می‌دهد؟</h2>
            </div>
            <div>
              {product.capabilities.map((item) => (
                <span key={item}>
                  <CheckCircle2 />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container">
          <div className="product-terminal">
            <div className="terminal-head">
              <span>AMARD PRODUCT</span>
              <span>READY</span>
            </div>
            <div className="terminal-core">
              <Layers3 />
              <strong>{product.title}</strong>
              <small>{product.category}</small>
            </div>
            {product.capabilities.slice(0, 5).map((item, index) => (
              <div className="terminal-row" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{item}</b>
                <i />
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad">
          <div className="container">
            <h2 className="related-title">راهکارهای مرتبط</h2>
            <div className="products-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CTA />
    </>
  );
}
