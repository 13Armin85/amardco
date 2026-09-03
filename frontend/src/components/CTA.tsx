import { ArrowUpLeft, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="container cta-wrap">
      <div className="cta-panel">
        <div>
          <span className="eyebrow">شروع همکاری</span>
          <h2>برای تحول دیجیتال سازمان خود آماده‌اید؟</h2>
          <p>محصولات آمارد را بر اساس نیازهای سازمان، شهرداری و ساختار اجرایی خود بررسی کنید.</p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-primary" to="/contact">درخواست مشاوره <ArrowUpLeft size={18} /></Link>
          <a className="btn btn-secondary" href="tel:01143270941"><Phone size={18} /> تماس با ما</a>
        </div>
      </div>
    </section>
  )
}
