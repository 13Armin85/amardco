import { Mail, MapPin, Navigation, Phone } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { company } from '../data/company'
import { useSEO } from '../hooks/useSEO'

const mapQuery = encodeURIComponent(company.address)
const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`
const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

export default function Contact() {
  useSEO(
    'تماس با آمارد | تلفن، ایمیل، آدرس و نقشه',
    'اطلاعات تماس شرکت تحلیلگران آمارد نوین شامل شماره تلفن، ایمیل، آدرس و موقعیت روی نقشه.',
  )

  return (
    <>
      <section className="contact-hero">
        <div className="container contact-hero-grid">
          <div>
            <SectionTitle
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
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={mapLinkUrl} target="_blank" rel="noreferrer">
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
