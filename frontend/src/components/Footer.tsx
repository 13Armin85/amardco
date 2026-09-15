import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import { getCompany } from '../lib/api'
import type { Company } from '../types'

export default function Footer() {
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadCompany() {
      try {
        const result = await getCompany()

        if (!ignore) {
          setCompany(result)
        }
      } catch {
        if (!ignore) {
          setCompany(null)
        }
      }
    }

    loadCompany()

    return () => {
      ignore = true
    }
  }, [])

  return <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-brand"><Logo/>{company && <p>{company.description}</p>}</div>
      <div><h2>دسترسی سریع</h2><Link to="/products">محصولات</Link><Link to="/certificates">گواهینامه‌ها و مدارک</Link><Link to="/about">درباره ما</Link><Link to="/contact">تماس</Link></div>
      {company && <div><h2>حوزه‌های فعالیت</h2>{company.areas.map(x => <span key={x}>{x}</span>)}</div>}
      {company && <address><h2>ارتباط با آمارد</h2><a href={`tel:${company.phones[0]}`}><Phone size={16}/>{company.phones[0]}</a><a href={`mailto:${company.email}`}><Mail size={16}/>{company.email}</a><span><MapPin size={16}/>{company.address}</span></address>}
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} تحلیلگران آمارد نوین</span></div>
  </footer>
}
