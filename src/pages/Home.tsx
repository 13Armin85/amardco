import { Link } from "react-router-dom";
import {
  ArrowUpLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Handshake,
  HelpCircle,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Newspaper,
  Phone,
  ReceiptText,
  ShieldCheck,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import CTA from "../components/CTA";
import { products } from "../data/products";
import { company } from "../data/company";
import { useSEO } from "../hooks/useSEO";
import type { ProductCategory } from "../types";

const urbanCategory: ProductCategory = "نرم‌افزار یکپارچه شهرسازی";
const financeCategory: ProductCategory = "نرم‌افزار یکپارچه مالی و اداری";

const offerCards = [
  {
    icon: Building2,
    title: "نرم‌افزارهای شهرسازی",
    text: "مدیریت یکپارچه نوسازی، درآمد، اصناف، کمیسیون‌ها، املاک و پرونده‌های شهری.",
  },
  {
    icon: Map,
    title: "خدمات نقشه و GIS",
    text: "نمایش، تحلیل و اتصال اطلاعات مکانی به پرونده‌ها و لایه‌های تخصصی شهری.",
  },
  {
    icon: ReceiptText,
    title: "مالی و اداری هوشمند",
    text: "حسابداری، بودجه، خزانه‌داری، چک، قراردادها، انبارداری و منابع انسانی در یک بستر.",
  },
];

const updates = [
  "سامانه یکپارچه شهرسازی آمارد برای شهرداری‌ها",
  "مدیریت الکترونیکی عوارض نوسازی و اصناف",
  "اتصال فرآیندهای مالی، شهرسازی و درگاه‌های پرداخت",
  "بهبود گردش پرونده‌ها با کارتابل‌های تخصصی",
];

const news = [
  "نقش سامانه‌های هوشمند در کاهش مراجعات حضوری شهروندان",
  "مدیریت درآمدهای شهری با گزارش‌های دقیق و قابل اتکا",
  "یکپارچگی اطلاعات املاک، معابر و پرونده‌های شهرسازی",
  "پرداخت الکترونیکی عوارض و پیگیری آنلاین درخواست‌ها",
];

const articles = [
  "مشارکت شهروندی در شهر هوشمند؛ مؤلفه‌ها و راهکارها",
  "چطور GIS تصمیم‌گیری شهری را دقیق‌تر می‌کند؟",
  "مزیت سامانه‌های یکپارچه برای شهرداری‌های متوسط و بزرگ",
];

const faqs = [
  [
    "آیا محصولات آمارد تحت وب هستند؟",
    "بله، محصولات اصلی با رویکرد تحت وب و مناسب استفاده سازمانی طراحی شده‌اند.",
  ],
  [
    "آیا نرم‌افزارهای شهرسازی و مالی به هم متصل می‌شوند؟",
    "بله، ساختار محصولات برای کاهش ورود مجدد اطلاعات و ایجاد گردش داده یکپارچه طراحی شده است.",
  ],
  [
    "امکان اتصال به GIS وجود دارد؟",
    "بله، نرم‌افزار GIS آمارد می‌تواند اطلاعات مکانی را به پرونده‌ها و داده‌های توصیفی متصل کند.",
  ],
  [
    "برای هر محصول صفحه اختصاصی داریم؟",
    "بله، هر محصول صفحه جداگانه دارد و جای تصویر محصول نیز در همان صفحه آماده شده است.",
  ],
  [
    "چطور می‌توان درخواست همکاری ثبت کرد؟",
    "از بخش همکاری با ما یا صفحه تماس می‌توانید مسیر ارتباط و بررسی نیاز سازمان را شروع کنید.",
  ],
];

export default function Home() {
  useSEO(
    "تحلیلگران آمارد نوین | تحول دیجیتال در مدیریت شهری",
    company.description,
  );
  const urbanProducts = products
    .filter((product) => product.category === urbanCategory)
    .slice(0, 6);
  const financeProducts = products
    .filter((product) => product.category === financeCategory)
    .slice(0, 4);

  return (
    <>
      <section className="landing-hero">
        <div className="container landing-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="landing-hero-copy"
          >
            <span className="eyebrow">
              <Star size={15} /> سیستم‌های یکپارچه مالی و شهرسازی
            </span>
            <h1>تحول دیجیتال در مدیریت شهری</h1>
            <p>
              راهکارهای یکپارچه برای هوشمندسازی شهر با تلفیق برنامه‌های مالی و
              اداری، شهرسازی و فناوری GIS برای شفافیت، بهره‌وری و ارائه خدمات
              بهتر به شهروندان.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                مشاهده محصولات <ArrowUpLeft size={18} />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                ارتباط با آمارد
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="smart-city-visual"
          >
            <img
              src="/smart-city-hero.png"
              alt="شهر هوشمند و سامانه‌های یکپارچه آمارد"
            />
            <div className="hero-orbit-pill p1">
              <Map /> GIS و نقشه‌ها
            </div>
            <div className="hero-orbit-pill p2">
              <Building2 /> شهرسازی
            </div>
            <div className="hero-orbit-pill p3">
              <Database /> مالی و اداری
            </div>
            <div className="hero-orbit-pill p4">
              <FileText /> فرآیندها
            </div>
          </motion.div>
        </div>

        <div className="container hero-service-strip">
          <span>
            <ShieldCheck /> امنیت اطلاعات
          </span>
          <span>
            <MessageCircle /> پشتیبانی حرفه‌ای
          </span>
          <span>
            <Database /> یکپارچگی داده‌ها
          </span>
          <span>
            <Map /> GIS و شهرسازی
          </span>
          <span>
            <CheckCircle2 /> پاسخگویی سازمانی
          </span>
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container">
          <SectionTitle
            badge="خدمات آمارد"
            title="آنچه ما"
            highlight="ارائه می‌دهیم"
            center
            description="راهکارهایی که هسته فرآیندهای شهری، مالی و اداری سازمان را منظم، شفاف و قابل پیگیری می‌کنند."
          />
          <div className="offer-grid">
            {offerCards.map(({ icon: Icon, title, text }) => (
              <article className="offer-card" key={title}>
                <div>
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad landing-split-section">
        <div className="container landing-split">
          <div>
            <SectionTitle
              badge="تازه‌های آمارد"
              title="آخرین‌های"
              highlight="آمارد"
              description="مروری سریع بر تمرکزهای محصولی و اجرایی آمارد در مسیر هوشمندسازی مدیریت شهری."
            />
            <div className="news-list">
              {updates.map((item, index) => (
                <Link to="/products" key={item}>
                  <span>{index + 1}</span>
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <article className="featured-news-card">
            <img
              src="/smart-city-hero.png"
              alt="سامانه یکپارچه شهرسازی آمارد"
            />
            <span className="chip">محصول شاخص</span>
            <h3>سامانه یکپارچه شهرسازی آمارد</h3>
            <p>
              پوشش فرآیندهای نوسازی، درآمد، اصناف، املاک، کمیسیون‌ها و GIS برای
              شهرداری‌ها.
            </p>
            <Link to="/products/article-77">
              مشاهده جزئیات <ArrowUpLeft size={17} />
            </Link>
          </article>
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container">
          <SectionTitle
            badge="همکاری"
            title="همکاری"
            highlight="با ما"
            center
            description="برای شهرداری‌ها، سازمان‌ها و مجموعه‌هایی که به دنبال استقرار، توسعه یا یکپارچه‌سازی سامانه‌های نرم‌افزاری هستند."
          />
          <div className="cooperation-panel">
            <div>
              <Handshake />
              <h3>مسیر همکاری را هدفمند شروع کنیم</h3>
              <p>
                نیاز سازمان، محصولات موردنظر و وضعیت فعلی سامانه‌ها بررسی می‌شود
                تا پیشنهاد اجرایی دقیق‌تری ارائه شود.
              </p>
            </div>
            <div className="cooperation-points">
              <span>
                <CheckCircle2 /> بررسی نیاز و ساختار سازمان
              </span>
              <span>
                <CheckCircle2 /> معرفی راهکار مناسب
              </span>
              <span>
                <CheckCircle2 /> برنامه‌ریزی استقرار و پشتیبانی
              </span>
            </div>
            <Link className="btn btn-primary" to="/contact">
              درخواست همکاری <ArrowUpLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad contact-landing-section">
        <div className="container contact-landing-grid">
          <div>
            <SectionTitle
              badge="ارتباط"
              title="با ما در"
              highlight="ارتباط باشید"
              description="برای دریافت مشاوره، معرفی محصول یا شروع همکاری، از مسیرهای زیر با ما تماس بگیرید."
            />
            <div className="contact-mini-grid">
              <a href={`mailto:${company.email}`}>
                <Mail /> <span>ایمیل</span>
                <b>{company.email}</b>
              </a>
              <a href={`tel:${company.phones[0]}`}>
                <Phone /> <span>شماره تماس</span>
                <b>{company.phones.join(" - ")}</b>
              </a>
              <div>
                <MapPin /> <span>آدرس</span>
                <b>{company.address}</b>
              </div>
            </div>
          </div>
          <aside className="availability-card">
            <Clock3 />
            <span>ما در دسترس هستیم</span>
            <h3>ساعت پاسخگویی</h3>
            <p>
              <b>شنبه تا چهارشنبه:</b> ۷:۳۰ تا ۱۶
            </p>
            <p>
              <b>پنجشنبه:</b> ۷:۳۰ تا ۱۲
            </p>
            <Link to="/contact">
              تماس با ما <ArrowUpLeft size={17} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section-pad landing-split-section compact-top">
        <div className="container landing-split">
          <div>
            <SectionTitle
              badge="اخبار"
              title="آخرین خبرهای"
              highlight="سایت"
              description="مطالب و خبرهایی درباره تحول دیجیتال، شهر هوشمند و سامانه‌های سازمانی."
            />
            <div className="news-list">
              {news.map((item, index) => (
                <Link to="/about" key={item}>
                  <span>{index + 1}</span>
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <article className="stat-card">
            <Newspaper />
            <strong>٪۹</strong>
            <h3>بهبود فرآیندهای شهری با داده دقیق</h3>
            <p>
              نمونه‌ای از تحلیل‌های قابل ارائه در داشبوردهای مدیریتی و گزارش‌های
              سازمانی.
            </p>
          </article>
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container article-grid-wrap">
          <SectionTitle
            badge="مقالات"
            title="برترین"
            highlight="مقالات"
            center
            description="مطالب منتخب برای آشنایی با مسیر شهر هوشمند، مدیریت داده و یکپارچگی نرم‌افزارهای شهری."
          />
          <div className="article-grid">
            {articles.map((item, index) => (
              <article className="article-card" key={item}>
                <BookOpen />
                <span>مقاله {index + 1}</span>
                <h3>{item}</h3>
                <Link to="/about">
                  مطالعه بیشتر <ArrowUpLeft size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad compact-top faq-section">
        <div className="container">
          <SectionTitle
            badge="پاسخ‌ها"
            title="سوالات"
            highlight="متداول"
            center
          />
          <div className="faq-grid">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  <HelpCircle /> {question}
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad compact-top">
        <div className="container product-family-preview">
          <div>
            <SectionTitle
              badge="خانواده محصولات"
              title="محصولات شهرسازی و"
              highlight="مالی اداری"
              description="دسترسی سریع به بخشی از محصولات اصلی آمارد در دو خانواده مهم سازمانی."
            />
            <Link className="btn btn-secondary" to="/products">
              مشاهده همه محصولات
            </Link>
          </div>
          <div className="family-columns">
            <div>
              <h3>شهرسازی</h3>
              {urbanProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`}>
                  {product.title}
                </Link>
              ))}
            </div>
            <div>
              <h3>مالی و اداری</h3>
              {financeProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`}>
                  {product.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
