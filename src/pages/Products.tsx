import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import ProductCard from "../components/ProductCard";
import CTA from "../components/CTA";
import { products, productGroups } from "../data/products";
import { useSEO } from "../hooks/useSEO";
import type { ProductCategory } from "../types";

const defaultGroup: ProductCategory = "نرم‌افزار یکپارچه شهرسازی";

export default function Products() {
  const [params] = useSearchParams();
  const requested = params.get("category") as ProductCategory | null;
  const initial =
    requested && productGroups.includes(requested) ? requested : defaultGroup;
  const [filter, setFilter] = useState<ProductCategory>(initial);
  const list = useMemo(
    () => products.filter((product) => product.category === filter),
    [filter],
  );

  useSEO(
    "محصولات آمارد | راهکارهای شهرسازی، مالی و اداری",
    "محصولات نرم‌افزاری تحلیلگران آمارد نوین در حوزه شهرسازی، مالی و اداری.",
  );

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
