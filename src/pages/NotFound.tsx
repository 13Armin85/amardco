import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <section className="not-found">
      <div className="nf-orbit">
        <span>4</span>
        <i />
        <span>4</span>
      </div>
      <h1>مسیر پیدا نشد</h1>
      <p>صفحه‌ای که دنبالش هستید در اکوسیستم آمارد وجود ندارد.</p>
      <Link className="btn btn-primary" to="/">
        <ArrowRight size={18} /> بازگشت به صفحه اصلی
      </Link>
    </section>
  );
}
