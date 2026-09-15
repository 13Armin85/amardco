import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import Logo from './Logo'
import { getCompany, getProductGroups, getProducts } from '../lib/api'
import type { Company, Product, ProductCategory } from '../types'

const links = [
  ['/', 'خانه'],
  ['/about', 'درباره ما'],
  ['/certificates', 'گواهینامه‌ها و مدارک'],
  ['/contact', 'تماس با ما'],
]

interface HeaderProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  const location = useLocation()
  const desktopProductsRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productGroups, setProductGroups] = useState<ProductCategory[]>([])
  const [company, setCompany] = useState<Company | null>(null)

  const groupedProducts = useMemo(() => {
    return productGroups.map(group => ({
      group,
      items: products.filter(product => product.category === group),
    }))
  }, [productGroups, products])

  useEffect(() => {
    let ignore = false

    async function loadNavigationData() {
      try {
        const [groups, productList, companyInfo] = await Promise.all([
          getProductGroups(),
          getProducts(),
          getCompany(),
        ])

        if (!ignore) {
          setProductGroups(groups)
          setProducts(productList)
          setCompany(companyInfo)
        }
      } catch {
        if (!ignore) {
          setProductGroups([])
          setProducts([])
          setCompany(null)
        }
      }
    }

    loadNavigationData()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDesktopProductsOpen(false)
    const focusedElement = document.activeElement
    if (focusedElement instanceof HTMLElement && desktopProductsRef.current?.contains(focusedElement)) {
      focusedElement.blur()
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!open) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" aria-label="صفحه اصلی"><Logo /></Link>

        <nav className="desktop-nav" aria-label="منوی اصلی">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>خانه</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>درباره ما</NavLink>
          <div
            ref={desktopProductsRef}
            className={`nav-dropdown${desktopProductsOpen ? ' open' : ''}`}
            onMouseEnter={() => setDesktopProductsOpen(true)}
            onMouseLeave={() => setDesktopProductsOpen(false)}
            onFocus={() => setDesktopProductsOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDesktopProductsOpen(false)
              }
            }}
          >
            <NavLink
              to="/products"
              className={({ isActive }) => isActive ? 'active nav-trigger' : 'nav-trigger'}
              onClick={(event) => {
                event.currentTarget.blur()
                setDesktopProductsOpen(false)
              }}
              aria-haspopup="true"
              aria-expanded={desktopProductsOpen}
            >
              محصولات <ChevronDown size={15} />
            </NavLink>
            <div className="mega-menu" role="menu">
              <div className="mega-groups">
                {groupedProducts.map(({ group, items }) => (
                  <div className="mega-group" key={group}>
                    <Link
                      to={`/products?category=${encodeURIComponent(group)}`}
                      className="mega-group-title"
                      onClick={(event) => {
                        event.currentTarget.blur()
                        setDesktopProductsOpen(false)
                      }}
                    >
                      <span>{group}</span>
                      <ChevronDown size={15} />
                    </Link>
                    <div className="mega-products">
                      {items.map(item => (
                        <Link
                          to={`/products/${item.slug}`}
                          key={item.id}
                          onClick={(event) => {
                            event.currentTarget.blur()
                            setDesktopProductsOpen(false)
                          }}
                        >
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
          <NavLink to="/certificates" className={({ isActive }) => isActive ? 'active' : ''}>گواهینامه‌ها و مدارک</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>تماس با ما</NavLink>
        </nav>

        {company && (
          <a href={`tel:${company.phones[0]}`} className="header-phone">
            <Phone size={16} /> {company.phones[0]}
          </a>
        )}
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="تغییر حالت روشن و تیره" title="تغییر حالت روشن و تیره">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="menu-btn" type="button" onClick={() => setOpen(true)} aria-label="باز کردن منو"><Menu /></button>
      </div>

      {open && createPortal(
        <div className="mobile-menu-backdrop" onClick={() => setOpen(false)}>
          <div className="mobile-menu open" role="dialog" aria-modal="true" aria-label="منوی موبایل" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-menu-head">
              <Logo />
              <div>
                <button type="button" onClick={() => setOpen(false)} aria-label="بستن منو"><X /></button>
              </div>
            </div>
            <nav>
              {links.map(([to, label]) => <NavLink onClick={() => setOpen(false)} key={to} to={to}>{label}</NavLink>)}
              <NavLink onClick={() => setOpen(false)} to="/products">همه محصولات</NavLink>
              {groupedProducts.map(({ group, items }) => (
                <div className="mobile-products" key={group}>
                  <span>{group}</span>
                  {items.map(item => <NavLink onClick={() => setOpen(false)} key={item.id} to={`/products/${item.slug}`}>{item.title}</NavLink>)}
                </div>
              ))}
            </nav>
          </div>
        </div>
        , document.body,
      )}
    </header>
  )
}
