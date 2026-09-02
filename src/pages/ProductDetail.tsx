import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  ImagePlus,
  Layers3,
} from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import CTA from "../components/CTA";
import { useSEO } from "../hooks/useSEO";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);

  useSEO(
    product ? `${product.title} | آمارد` : "محصول | آمارد",
    product?.shortDescription || "جزئیات محصول آمارد",
  );

  if (!product) {
    return <div className="container page-space">محصول یافت نشد.</div>;
  }

  const related = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 3);

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
            <div className="product-image-slot">
              <ImagePlus />
              <strong>جای تصویر محصول</strong>
              <span>
                {product.imageHint ||
                  "تصویر رابط کاربری یا نمای محصول را اینجا قرار دهید."}
              </span>
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
              این بخش بر اساس متن فایل Word محصول تکمیل شده و برای معرفی کامل
              محصول در صفحه اختصاصی آماده است.
            </p>
          </div>
          <div className="detail-bento">
            {product.features.map((feature, index) => (
              <article key={feature}>
                <CircleDot />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature}</h3>
                <p>
                  این قابلیت در ساختار یکپارچه محصول برای کاهش دوباره‌کاری،
                  افزایش شفافیت اطلاعات و تسریع دسترسی کاربران سازمانی در نظر
                  گرفته شده است.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
