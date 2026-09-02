import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { projects } from "../data/projects";
import CTA from "../components/CTA";
import { useSEO } from "../hooks/useSEO";
export default function ProjectDetail() {
  const { slug } = useParams();
  const p = projects.find((x) => x.slug === slug);
  useSEO(
    p ? `${p.title} | پروژه‌های آمارد` : "پروژه | آمارد",
    p?.description || "پروژه‌های آمارد",
  );
  if (!p) return <div className="container page-space">پروژه یافت نشد.</div>;
  return (
    <>
      <section className="product-hero">
        <div className="container">
          <Link className="back-link" to="/projects">
            <ArrowRight size={17} /> بازگشت به پروژه‌ها
          </Link>
          <div className="project-detail-head">
            <span className="chip">{p.category}</span>
            <h1>{p.title}</h1>
            <p>{p.description}</p>
            {p.client && <span>مشتری: {p.client}</span>}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container">
          <div className="capability-panel">
            <div>
              <span className="eyebrow">محصولات مرتبط</span>
              <h2>اجزای راهکار</h2>
            </div>
            <div>
              {p.products.map((x) => (
                <span key={x}>
                  <CheckCircle2 />
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="source-note">
            <strong>شفافیت محتوا</strong>
            <p>
              در منبع عمومی در دسترس، جزئیات دقیق Challenge، Result و KPI برای
              این پروژه‌ها ارائه نشده؛ بنابراین در این صفحه عدد یا نتیجه ساختگی
              اضافه نشده است.
            </p>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
