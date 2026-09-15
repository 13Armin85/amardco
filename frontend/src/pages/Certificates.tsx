import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { getCertificates } from '../lib/api'
import { useSEO } from '../hooks/useSEO'
import { absoluteUrl, breadcrumbSchema } from '../lib/seo'
import type { CertificateImage } from '../types'

const fallbackCertificates: CertificateImage[] = [
  { page: 1, width: 1700, height: 2338 },
  { page: 2, width: 1224, height: 1584 },
  { page: 3, width: 1654, height: 2338 },
  { page: 4, width: 1700, height: 1995 },
  { page: 5, width: 880, height: 607 },
].map(({ page, width, height }) => ({
  id: `certificate-${page}`,
  title: `گواهینامه و مدرک شماره ${page}`,
  image: `/page${page}.${page === 5 ? 'jpeg' : 'jpg'}`,
  imageAlt: `تصویر صفحه ${page} از گواهینامه‌ها و مدارک آمارد`,
  width,
  height,
}))

export default function Certificates() {
  const [items, setItems] = useState<CertificateImage[]>(fallbackCertificates)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useSEO(
    'گواهینامه‌ها و مدارک آمارد | تحلیلگران آمارد نوین',
    'مشاهده گواهینامه‌ها و مدارک شرکت تحلیلگران آمارد نوین در قالب اسلایدر تصویری.',
    {
      path: '/certificates',
      schemas: [{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${absoluteUrl('/certificates')}#webpage`,
            url: absoluteUrl('/certificates'),
            name: 'گواهینامه‌ها و مدارک آمارد',
            inLanguage: 'fa-IR',
          },
          breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'گواهینامه‌ها و مدارک', path: '/certificates' }]),
        ],
      }],
    },
  )

  useEffect(() => {
    let ignore = false

    async function loadCertificates() {
      try {
        setLoading(true)
        setError('')
        const result = await getCertificates()
        if (!ignore && result.length > 0) {
          setItems(result)
          setActiveIndex(0)
        }
      } catch {
        if (!ignore) {
          setError('داده‌های گواهینامه از سرور دریافت نشد؛ نسخه محلی نمایش داده می‌شود.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadCertificates()

    return () => {
      ignore = true
    }
  }, [])

  const activeItem = items[activeIndex]
  const previous = () => setActiveIndex(current => (current - 1 + items.length) % items.length)
  const next = () => setActiveIndex(current => (current + 1) % items.length)

  return (
    <>
      <section className="page-hero certificates-hero">
        <div className="container">
          <SectionTitle
            as="h1"
            badge="گواهینامه‌ها و مدارک"
            title="اعتبارنامه‌های"
            highlight="آمارد"
            description="مرور تصویری مدارک و گواهینامه‌های شرکت در یک اسلایدر خوانا و واکنش‌گرا."
          />
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container certificates-layout">
          <div className="certificates-viewer">
            <button className="slider-btn" type="button" onClick={previous} aria-label="مدرک قبلی">
              <ChevronRight />
            </button>
            <figure className="certificate-frame">
              {activeItem ? (
                <img
                  src={activeItem.image}
                  alt={activeItem.imageAlt}
                  width={activeItem.width}
                  height={activeItem.height}
                  decoding="async"
                />
              ) : (
                <div className="certificate-empty">
                  <ImageOff />
                  <span>تصویری برای نمایش وجود ندارد.</span>
                </div>
              )}
              <figcaption>
                <Award size={18} />
                {activeItem?.title || 'گواهینامه'}
              </figcaption>
            </figure>
            <button className="slider-btn" type="button" onClick={next} aria-label="مدرک بعدی">
              <ChevronLeft />
            </button>
          </div>

          <div className="certificate-thumbs">
            {items.map((item, index) => (
              <button
                key={item.id}
                className={index === activeIndex ? 'active' : ''}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`نمایش ${item.title}`}
              >
                <img src={item.image} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          {loading && <p className="content-loading">در حال دریافت گواهینامه‌ها از سرور...</p>}
          {error && <p className="content-loading error">{error}</p>}

          <Link className="back-link certificates-back" to="/products">
            <ArrowRight size={17} />
            بازگشت به محصولات
          </Link>
        </div>
      </section>
    </>
  )
}
