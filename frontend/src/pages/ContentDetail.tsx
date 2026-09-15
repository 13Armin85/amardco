import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Newspaper, RefreshCw, ScrollText } from 'lucide-react'
import { getContentItem } from '../lib/api'
import { useSEO } from '../hooks/useSEO'
import { getImageMetadata } from '../lib/imageMetadata'
import { absoluteUrl, breadcrumbSchema, contentPath, publisherSchema } from '../lib/seo'
import type { ContentItem, ContentKind } from '../types'

interface ContentDetailProps {
  kind: ContentKind
}

const relatedProductLinks: Record<string, Array<{ to: string; label: string }>> = {
  'integrated-urban-planning-platform': [
    { to: '/products', label: 'مشاهده نرم‌افزارهای یکپارچه شهرسازی آمارد' },
    { to: '/products/gis', label: 'آشنایی با نرم‌افزار GIS آمارد' },
  ],
  'comprehensive-urban-planning-laws-and-services-guide': [
    { to: '/products/article-100', label: 'نرم‌افزار کمیسیون ماده ۱۰۰' },
    { to: '/products/gis', label: 'نرم‌افزار GIS و اطلاعات مکانی شهری' },
  ],
  'construction-supervision-city-limits-and-boundaries': [
    { to: '/products/article-100', label: 'مدیریت پرونده‌های کمیسیون ماده ۱۰۰' },
    { to: '/products/renovation', label: 'نرم‌افزار نوسازی و اطلاعات املاک' },
  ],
  'citizen-participation-in-smart-city': [
    { to: '/products/citizenyar', label: 'درگاه خدمات الکترونیکی شهروندیار' },
    { to: '/products', label: 'مشاهده راهکارهای مدیریت شهری آمارد' },
  ],
  'property-fees-calculation-coefficient-1405': [
    { to: '/products/income', label: 'نرم‌افزار درآمد و محاسبه عوارض شهرداری' },
    { to: '/products/renovation', label: 'نرم‌افزار عوارض نوسازی املاک' },
  ],
  'property-fees-calculation-coefficient-1404': [
    { to: '/products/income', label: 'نرم‌افزار درآمد شهرداری' },
    { to: '/products/renovation', label: 'نرم‌افزار نوسازی آمارد' },
  ],
  'renovation-duty-rate-after-sustainable-revenue-law': [
    { to: '/products/renovation', label: 'نرم‌افزار محاسبه عوارض نوسازی' },
    { to: '/products/income', label: 'مدیریت درآمدهای شهرداری' },
  ],
}

export default function ContentDetail({ kind }: ContentDetailProps) {
  const { slug } = useParams()
  const label = kind === 'update' ? 'آخرین‌های آمارِد' : kind === 'news' ? 'خبر' : 'مقاله'
  const backTo = kind === 'update' ? '/#latest-updates' : kind === 'news' ? '/#latest-news' : '/#articles'
  const backLabel = kind === 'update' ? 'آخرین‌های آمارِد' : kind === 'news' ? 'خبرها' : 'مقالات'
  const [item, setItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const canonicalPath = contentPath(kind, slug || '')
  const imageMetadata = item ? getImageMetadata(item.image) : undefined

  useSEO(
    item ? item.seoTitle || `${item.title} | آمارِد` : `${label} | آمارِد`,
    item?.seoDescription || item?.excerpt || `جزئیات ${label} آمارِد`,
    {
      path: canonicalPath,
      image: item?.image,
      imageAlt: item?.imageAlt,
      type: 'article',
      publishedTime: item?.publishedAtISO,
      noIndex: !loading && !item,
      keywords: item?.keywords,
      schemas: item ? [{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': kind === 'news' ? 'NewsArticle' : 'Article',
            '@id': `${absoluteUrl(canonicalPath)}#article`,
            url: absoluteUrl(canonicalPath),
            mainEntityOfPage: absoluteUrl(canonicalPath),
            headline: item.title,
            description: item.seoDescription || item.excerpt,
            image: absoluteUrl(item.image),
            datePublished: item.publishedAtISO,
            inLanguage: 'fa-IR',
            author: publisherSchema,
            publisher: publisherSchema,
          },
          breadcrumbSchema([
            { name: 'خانه', path: '/' },
            { name: backLabel, path: backTo },
            { name: item.title, path: canonicalPath },
          ]),
        ],
      }] : [],
    },
  )

  useEffect(() => {
    let ignore = false

    async function loadItem() {
      if (!slug) {
        setError(`${label} یافت نشد.`)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const result = await getContentItem(kind, slug)

        if (!ignore) {
          setItem(result)
        }
      } catch {
        if (!ignore) {
          setItem(null)
          setError(`${label} از سرور دریافت نشد.`)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadItem()

    return () => {
      ignore = true
    }
  }, [kind, label, slug])

  const Icon = kind === 'update' ? RefreshCw : kind === 'news' ? Newspaper : ScrollText

  if (loading) {
    return <div className="container page-space">در حال دریافت از سرور...</div>
  }

  if (!item) {
    return <div className="container page-space">{error || `${label} یافت نشد.`}</div>
  }

  return (
    <>
      <section className="content-hero">
        <div className="container">
          <Link className="back-link" to={backTo}>
            <ArrowRight size={17} /> بازگشت به {backLabel}
          </Link>
          <div className="content-hero-grid">
            <div>
              <span className="chip">
                <Icon size={14} /> {label}
              </span>
              <h1>{item.title}</h1>
              <p>{item.excerpt}</p>
              <time dateTime={item.publishedAtISO}>
                <CalendarDays size={17} />
                {item.publishedAt}
              </time>
            </div>
            <img
              src={item.image}
              alt={item.imageAlt}
              width={imageMetadata?.width}
              height={imageMetadata?.height}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="section-pad compact-top">
        <article className="container content-body">
          <h2>شرح موضوع و نکات کلیدی</h2>
          {item.body.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {(relatedProductLinks[item.slug] || []).length > 0 && (
            <aside className="content-related" aria-labelledby="related-products-title">
              <h2 id="related-products-title">راهکارهای مرتبط آمارد</h2>
              <div>
                {relatedProductLinks[item.slug].map(link => (
                  <Link key={link.to} to={link.to}>{link.label}</Link>
                ))}
              </div>
            </aside>
          )}
        </article>
      </section>
    </>
  )
}
