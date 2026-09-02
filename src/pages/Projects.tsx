import { Link } from "react-router-dom";
import { ArrowUpLeft } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import CTA from "../components/CTA";
import { projects } from "../data/projects";
import { useSEO } from "../hooks/useSEO";
export default function Projects() {
  useSEO(
    "پروژه‌ها | تحلیلگران آمارد نوین",
    "نمونه کاربرد راهکارهای شهرسازی و مالی و اداری آمارد.",
  );
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionTitle
            badge="پروژه‌ها"
            title="کاربرد واقعی"
            highlight="راهکارهای آمارد"
            description="نمونه‌های مستندشده در این نسخه صرفاً بر اساس حوزه‌های فعالیت و پروژه‌های عمومی قابل استناد نمایش داده شده‌اند."
          />
        </div>
      </section>
      <section className="section-pad compact-top">
        <div className="container projects-grid">
          {projects.map((p, i) => (
            <Link
              className="project-card"
              key={p.id}
              to={`/projects/${p.slug}`}
            >
              <div className="project-art">
                <span>0{i + 1}</span>
                <i />
                <i />
                <i />
              </div>
              <span className="chip">{p.category}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className="project-link">
                مشاهده جزئیات <ArrowUpLeft size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
