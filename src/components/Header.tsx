import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import Logo from './Logo'
import { products, productGroups } from '../data/products'
import type { ProductCategory } from '../types'

const links = [
  ['/', 'خانه'],
  ['/about', 'درباره ما'],
  ['/projects', 'پروژه‌ها'],
  ['/contact', 'تماس با ما'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('amard-theme') === 'light' ? 'light' : 'dark'
  })

  const groupedProducts = useMemo(() => {
    return productGroups.map(group => ({
      group,
      items: products.filter(product => product.category === group),
    }))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('amard-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(current => current === 'dark' ? 'light' : 'dark')

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" aria-label="صفحه اصلی"><Logo /></Link>

        <nav className="desktop-nav" aria-label="منوی اصلی">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>خانه</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>درباره ما</NavLink>
          <div className="nav-dropdown">
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active nav-trigger' : 'nav-trigger'}>
              محصولات <ChevronDown size={15} />
            </NavLink>
            <div className="mega-menu" role="menu">
              <div className="mega-groups">
                {groupedProducts.map(({ group, items }) => (
                  <div className="mega-group" key={group}>
                    <Link to={`/products?category=${encodeURIComponent(group)}`} className="mega-group-title">
                      <span>{group}</span>
                      <ChevronDown size={15} />
                    </Link>
                    <div className="mega-products">
                      {items.map(item => (
                        <Link to={`/products/${item.slug}`} key={item.id}>
                          <strong>{item.title}</strong>
                          <small>{item.shortDescription}</small>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>پروژه‌ها</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>تماس با ما</NavLink>
        </nav>

        <a href="tel:01143270941" className="header-phone"><Phone size={16} /> 011-43270941</a>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="تغییر حالت روشن و تیره" title="تغییر حالت روشن و تیره">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="menu-btn" onClick={() => setOpen(true)} aria-label="باز کردن منو"><Menu /></button>
      </div>

      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu-head">
            <Logo />
            <div>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="تغییر حالت روشن و تیره">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setOpen(false)} aria-label="بستن منو"><X /></button>
            </div>
          </div>
          <nav>
            {links.map(([to, label]) => <NavLink onClick={() => setOpen(false)} key={to} to={to}>{label}</NavLink>)}
            <NavLink onClick={() => setOpen(false)} to="/products">همه محصولات</NavLink>
            {groupedProducts.map(({ group, items }) => (
              <section className="mobile-products" key={group}>
                <span>{group}</span>
                {items.map(item => <NavLink onClick={() => setOpen(false)} key={item.id} to={`/products/${item.slug}`}>{item.title}</NavLink>)}
              </section>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
