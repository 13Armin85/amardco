import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import CTA from "../components/CTA";
import { getProductGroups, getProducts } from "../lib/api";
import { useSEO } from "../hooks/useSEO";
import type { Product, ProductCategory } from "../types";

export default function Products() {
  const [params] = useSearchParams();
  const requested = params.get("category") as ProductCategory | null;
  const [products, setProducts] = useState<Product[]>([]);
  const [productGroups, setProductGroups] = useState<ProductCategory[]>([]);
  const [filter, setFilter] = useState<ProductCategory | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const list = useMemo(
    () => products.filter((product) => product.category === filter),
    [filter, products],
  );

  useSEO(
    "محصولات آمارد | راهکارهای شهرسازی، مالی و اداری",
    "محصولات نرم‌افزاری تحلیلگران آمارد نوین در حوزه شهرسازی، مالی و اداری.",
  );

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const [groups, productList] = await Promise.all([
          getProductGroups(),
          getProducts(),
        ]);

        if (!ignore) {
          setProductGroups(groups);
          setProducts(productList);
        }
      } catch {
        if (!ignore) {
          setError("محصولات از سرور دریافت نشد.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!productGroups.length) return;

    setFilter(requested && productGroups.includes(requested) ? requested : productGroups[0]);
  }, [productGroups, requested]);

  return (
    <>
      <section className="page-hero products-page-hero">
        <div className="container">
          <SectionTitle
            badge="محصولات"
            title="اکوسیستم نرم‌افزاری"
            highlight="آمارد"
            description="محصولات در سه گروه اصلی مرتب شده‌اند تا انتخاب راهکار برای شهرداری، سازمان و کسب‌وکار سریع‌تر و شفاف‌تر باشد."
          />
        </div>
      </section>
      <section className="section-pad compact-top">
        <div className="container">
          <div
            className="tabs product-tabs"
            role="tablist"
            aria-label="دسته‌بندی محصولات"
          >
            {productGroups.map((group) => (
              <button
                key={group}
                className={filter === group ? "active" : ""}
                onClick={() => setFilter(group)}
              >
                {group}
              </button>
            ))}
          </div>
          {loading && <div className="content-loading">در حال دریافت از سرور...</div>}
          {error && <div className="content-loading error">{error}</div>}
          <div className="products-grid">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
