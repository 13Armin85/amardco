import { useEffect, useMemo, useState } from 'react'
import { Mail, MapPin, Navigation, Phone } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { getCompany } from '../lib/api'
import { useSEO } from '../hooks/useSEO'
import { absoluteUrl, breadcrumbSchema, publisherSchema } from '../lib/seo'
import type { Company } from '../types'

export default function Contact() {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useSEO(
    'تماس با آمارد | تلفن، ایمیل، آدرس و نقشه',
    'اطلاعات تماس شرکت تحلیلگران آمارد نوین شامل شماره تلفن، ایمیل، آدرس و موقعیت روی نقشه.',
    {
      path: '/contact',
      schemas: company ? [{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ContactPage',
            '@id': `${absoluteUrl('/contact')}#webpage`,
            url: absoluteUrl('/contact'),
            name: 'تماس با تحلیلگران آمارد نوین',
            inLanguage: 'fa-IR',
            about: { '@id': 'https://amardco.com/#organization' },
          },
          {
            ...publisherSchema,
            email: company.email,
            telephone: company.phones,
            address: {
              '@type': 'PostalAddress',
              streetAddress: company.address,
              addressCountry: 'IR',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: company.phones[0],
              contactType: 'customer support',
              availableLanguage: 'Persian',
            },
          },
          breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'تماس با ما', path: '/contact' }]),
        ],
      }] : [],
    },
  )

  useEffect(() => {
    let ignore = false

    async function loadCompany() {
      try {
        setLoading(true)
        setError('')
        const result = await getCompany()

        if (!ignore) {
          setCompany(result)
        }
      } catch {
        if (!ignore) {
          setCompany(null)
          setError('اطلاعات تماس از سرور دریافت نشد.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadCompany()

    return () => {
      ignore = true
    }
  }, [])

  const mapUrls = useMemo(() => {
    if (!company) return null

    const mapQuery = encodeURIComponent(company.address)
    return {
      embed: `https://maps.google.com/maps?q=${mapQuery}&output=embed`,
      link: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    }
  }, [company])

  if (loading) {
    return <div className="container page-space">در حال دریافت از سرور...</div>
  }

  if (!company || !mapUrls) {
    return <div className="container page-space">{error || 'اطلاعات تماس یافت نشد.'}</div>
  }

  return (
    <>
      <section className="contact-hero">
        <div className="container contact-hero-grid">
          <div>
            <SectionTitle
              as="h1"
              badge="تماس با ما"
              title="مسیر ارتباط با"
              highlight="آمارد"
              description="برای ارتباط مستقیم با تحلیلگران آمارد نوین از شماره تلفن، ایمیل، آدرس و موقعیت نقشه زیر استفاده کنید."
            />
            <div className="contact-hero-actions">
              <a className="btn btn-primary" href={`tel:${company.phones[0]}`}>
                <Phone size={18} />
                تماس مستقیم
              </a>
              <a className="btn btn-secondary" href={`mailto:${company.email}`}>
                <Mail size={18} />
                ارسال ایمیل
              </a>
            </div>
          </div>
          <div className="contact-map-shell">
            <iframe
              title="موقعیت شرکت تحلیلگران آمارد نوین روی نقشه"
              src={mapUrls.embed}
              loading="lazy"
              width="600"
              height="450"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={mapUrls.link} target="_blank" rel="noreferrer">
              <Navigation size={17} />
              باز کردن در نقشه
            </a>
          </div>
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container contact-detail-grid">
          <a className="contact-detail-card primary" href={`tel:${company.phones[0]}`}>
            <Phone />
            <span>شماره تلفن</span>
            <strong>{company.phones.join(' - ')}</strong>
          </a>
          <a className="contact-detail-card" href={`mailto:${company.email}`}>
            <Mail />
            <span>ایمیل</span>
            <strong>{company.email}</strong>
          </a>
          <div className="contact-detail-card address">
            <MapPin />
            <span>آدرس</span>
            <strong>{company.address}</strong>
          </div>
        </div>
      </section>
    </>
  )
}
