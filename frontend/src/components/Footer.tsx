import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import { company } from '../data/company'

export default function Footer() {
  return <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-brand"><Logo/><p>{company.description}</p></div>
      <div><h4>دسترسی سریع</h4><Link to="/products">محصولات</Link><Link to="/certificates">گواهینامه‌ها و مدارک</Link><Link to="/about">درباره ما</Link><Link to="/contact">تماس</Link></div>
      <div><h4>حوزه‌های فعالیت</h4>{company.areas.map(x => <span key={x}>{x}</span>)}</div>
      <div><h4>ارتباط با آمارد</h4><span><Phone size={16}/>{company.phones[0]}</span><span><Mail size={16}/>{company.email}</span><span><MapPin size={16}/>{company.address}</span></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} تحلیلگران آمارد نوین</span></div>
  </footer>
}
