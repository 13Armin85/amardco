import { useEffect, useState } from 'react'
import { Building2, Database, Headphones, Layers3 } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import CTA from '../components/CTA'
import { getCompany } from '../lib/api'
import { useSEO } from '../hooks/useSEO'
import { absoluteUrl, breadcrumbSchema, publisherSchema } from '../lib/seo'
import type { Company } from '../types'

const fallbackDescription = 'طراحی، تولید و پشتیبانی راهکارهای نرم‌افزاری تخصصی در حوزه شهرسازی، مالی و اداری.'

export default function About() {
  const [company, setCompany] = useState<Company | null>(null)

  const description = company?.description || fallbackDescription
  const seoDescription = 'با شرکت تحلیلگران آمارد نوین، حوزه‌های فعالیت و رویکرد آن در طراحی، استقرار و پشتیبانی نرم‌افزارهای شهرسازی، مالی و اداری آشنا شوید.'
  const organization = company ? {
    ...publisherSchema,
    description: company.description,
    email: company.email,
    telephone: company.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressCountry: 'IR',
    },
  } : publisherSchema

  useSEO('درباره آمارد | تحلیلگران آمارد نوین', seoDescription, {
    path: '/about',
    schemas: [{
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        {
          '@type': 'AboutPage',
          '@id': `${absoluteUrl('/about')}#webpage`,
          url: absoluteUrl('/about'),
          name: 'درباره تحلیلگران آمارد نوین',
          description: seoDescription,
          about: { '@id': 'https://amardco.com/#organization' },
          inLanguage: 'fa-IR',
        },
        breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'درباره ما', path: '/about' }]),
      ],
    }],
  })

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

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionTitle
            as="h1"
            badge="درباره ما"
            title="تخصص نرم‌افزاری با تمرکز بر"
            highlight="مدیریت سازمانی"
            description={company?.description || fallbackDescription}
          />
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container about-story">
          <div className="story-main">
            <span className="eyebrow">{company?.name || 'تحلیلگران آمارد نوین'}</span>
            <h2>راهکارهایی برای شهر، سازمان و فرایندهای واقعی</h2>
            <p>
              حوزه فعالیت عمومی شرکت بر طراحی، تولید و پشتیبانی نرم‌افزارهای شهرسازی، مالی و اداری متمرکز است.
              راهکارهای آمارد با تمرکز بر شناخت فرایندهای واقعی سازمان، یکپارچگی اطلاعات و دسترسی منظم‌تر کاربران طراحی می‌شوند.
            </p>
          </div>
          <div className="story-cards">
            <article><Building2 /><h3>شهرسازی</h3><p>راهکارهای یکپارچه برای زیرسیستم‌های مدیریت شهری.</p></article>
            <article><Layers3 /><h3>مالی و اداری</h3><p>تمرکز داده و فرایندهای سازمانی در یک بستر منسجم.</p></article>
            <article><Headphones /><h3>پشتیبانی</h3><p>تولید و پشتیبانی نرم‌افزار بخشی از فعالیت تخصصی شرکت است.</p></article>
            <article><Database /><h3>یکپارچگی</h3><p>طراحی محصول با رویکرد کاهش پراکندگی اطلاعات.</p></article>
          </div>
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container process">
          <SectionTitle badge="رویکرد" title="از شناخت نیاز تا" highlight="راهکار اجرایی" />
          <div className="process-line">
            {['تحلیل نیاز', 'طراحی راهکار', 'پیاده‌سازی', 'استقرار', 'پشتیبانی'].map((item, index) => (
              <div key={item}>
                <span>0{index + 1}</span>
                <b>{item}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
