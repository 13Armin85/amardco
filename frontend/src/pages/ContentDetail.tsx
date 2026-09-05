import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Newspaper, RefreshCw, ScrollText } from 'lucide-react'
import { getContentItem } from '../lib/api'
import { useSEO } from '../hooks/useSEO'
import type { ContentItem, ContentKind } from '../types'

interface ContentDetailProps {
  kind: ContentKind
}

export default function ContentDetail({ kind }: ContentDetailProps) {
  const { slug } = useParams()
  const label = kind === 'update' ? 'آخرین‌های آمارِد' : kind === 'news' ? 'خبر' : 'مقاله'
  const backTo = kind === 'update' ? '/#latest-updates' : kind === 'news' ? '/#latest-news' : '/#articles'
  const backLabel = kind === 'update' ? 'آخرین‌های آمارِد' : kind === 'news' ? 'خبرها' : 'مقالات'
  const [item, setItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useSEO(
    item ? item.seoTitle || `${item.title} | آمارِد` : `${label} | آمارِد`,
    item?.seoDescription || item?.excerpt || `جزئیات ${label} آمارِد`,
    item?.keywords,
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
              <time>
                <CalendarDays size={17} />
                {item.publishedAt}
              </time>
            </div>
            <img src={item.image} alt={item.imageAlt} />
          </div>
        </div>
      </section>

      <section className="section-pad compact-top">
        <article className="container content-body">
          {item.body.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </section>
    </>
  )
}
