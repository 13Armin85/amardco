import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpLeft,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  Handshake,
  HelpCircle,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import CTA from "../components/CTA";
import { getCompany, getContentList, getProducts } from "../lib/api";
import { useSEO } from "../hooks/useSEO";
import type { Company, ContentItem, Product, ProductCategory } from "../types";

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

interface ContentShowcaseProps {
  id: string;
  variant: "updates" | "news";
  items: ContentItem[];
  loading: boolean;
  error: string;
  routePrefix: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  chip: string;
}

function ContentShowcase({
  id,
  variant,
  items,
  loading,
  error,
  routePrefix,
  badge,
  title,
  highlight,
  description,
  chip,
}: ContentShowcaseProps) {
  const featured = items[0];
  const sideItems = items.slice(1, 4);

  return (
    <section className={`section-pad content-showcase-section ${variant}`} id={id}>
      <div className="container content-showcase">
        <div className="showcase-head">
          <SectionTitle
            badge={badge}
            title={title}
            highlight={highlight}
            description={description}
          />
        </div>

        {loading && <div className="content-loading">در حال دریافت از سرور...</div>}
        {error && <div className="content-loading error">{error}</div>}
        {!loading && !error && featured && (
          <div className="showcase-layout">
            <Link className="showcase-feature" to={`/${routePrefix}/${featured.slug}`}>
              <img src={featured.image} alt={featured.imageAlt} />
              <div>
                <span className="chip">{chip}</span>
                <h3>{featured.title}</h3>
                <p>{featured.excerpt}</p>
                <time>
                  <CalendarDays size={16} />
                  {featured.publishedAt}
                </time>
              </div>
            </Link>

            <div className="showcase-side-list">
              {sideItems.map((item, index) => (
                <Link to={`/${routePrefix}/${item.slug}`} key={item.id}>
                  <span>{String(index + 2).padStart(2, "0")}</span>
                  <img src={item.image} alt={item.imageAlt} />
                  <div>
                    <h3>{item.title}</h3>
                    <time>{item.publishedAt}</time>
                  </div>
                  <ArrowUpLeft size={17} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [latestItems, setLatestItems] = useState<ContentItem[]>([]);
  const [newsItems, setNewsItems] = useState<ContentItem[]>([]);
  const [articleItems, setArticleItems] = useState<ContentItem[]>([]);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState("");
  const seoDescription = company?.description || "طراحی، تولید و پشتیبانی راهکارهای نرم‌افزاری تخصصی در حوزه شهرسازی، مالی و اداری.";

  useSEO(
    "تحلیلگران آمارد نوین | تحول دیجیتال در مدیریت شهری",
    seoDescription,
  );
  const urbanProducts = products
    .filter((product) => product.category === urbanCategory)
    .slice(0, 6);
  const financeProducts = products
    .filter((product) => product.category === financeCategory)
    .slice(0, 4);

  useEffect(() => {
    let ignore = false;

    async function loadContent() {
      try {
        setContentLoading(true);
        setContentError("");
        const [latest, news, articles, productList, companyInfo] = await Promise.all([
          getContentList("update"),
          getContentList("news"),
          getContentList("article"),
          getProducts(),
          getCompany(),
        ]);

        if (!ignore) {
          setLatestItems(latest);
          setNewsItems(news);
          setArticleItems(articles);
          setProducts(productList);
          setCompany(companyInfo);
        }
      } catch {
        if (!ignore) {
          setContentError("ارتباط با سرور برقرار نشد.");
        }
      } finally {
        if (!ignore) {
          setContentLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (activeArticleIndex >= articleItems.length) {
      setActiveArticleIndex(0);
    }
  }, [activeArticleIndex, articleItems.length]);

  const activeArticle = articleItems[activeArticleIndex];
  const showPreviousArticle = () => {
    setActiveArticleIndex(current => articleItems.length ? (current - 1 + articleItems.length) % articleItems.length : 0);
  };
  const showNextArticle = () => {
    setActiveArticleIndex(current => articleItems.length ? (current + 1) % articleItems.length : 0);
  };

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

      <ContentShowcase
        id="latest-updates"
        variant="updates"
        items={latestItems}
        loading={contentLoading}
        error={contentError}
        routePrefix="updates"
        badge="تازه‌های آمارِد"
        title="آخرین‌های"
        highlight="آمارِد"
        description="مروری سریع بر تمرکزهای محصولی و اجرایی آمارِد در مسیر هوشمندسازی مدیریت شهری."
        chip="تازه‌ترین آمارِد"
      />

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
        <div className="container contact-landing-stack">
          <div>
            <SectionTitle
              badge="ارتباط"
              title="با ما در"
              highlight="ارتباط باشید"
              description="برای دریافت مشاوره، معرفی محصول یا شروع همکاری، از مسیرهای زیر با ما تماس بگیرید."
            />
            {company ? (
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
            ) : (
              <div className="content-loading">در حال دریافت اطلاعات تماس از سرور...</div>
            )}
            <aside className="availability-banner">
              <div className="availability-icon">
                <Clock3 />
              </div>
              <div className="availability-copy">
                <span>ما در دسترس هستیم</span>
                <h3>ساعت پاسخگویی</h3>
              </div>
              <div className="availability-hours">
                <p>
                  <b>شنبه تا چهارشنبه:</b> ۷:۳۰ تا ۱۶
                </p>
                <p>
                  <b>پنجشنبه:</b> ۷:۳۰ تا ۱۲
                </p>
              </div>
              <Link to="/contact">
                تماس با ما <ArrowUpLeft size={17} />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <ContentShowcase
        id="latest-news"
        variant="news"
        items={newsItems}
        loading={contentLoading}
        error={contentError}
        routePrefix="news"
        badge="اخبار"
        title="آخرین خبرهای"
        highlight="سایت"
        description="مطالب و خبرهایی درباره تحول دیجیتال، شهر هوشمند و سامانه‌های سازمانی."
        chip="آخرین خبر"
      />

      <section className="section-pad compact-top article-slider-section" id="articles">
        <div className="container article-slider-wrap">
          <SectionTitle
            badge="مقالات"
            title="برترین"
            highlight="مقالات"
            center
            description="مطالب منتخب برای آشنایی با مسیر شهر هوشمند، مدیریت داده و یکپارچگی نرم‌افزارهای شهری."
          />
          {contentLoading && <div className="content-loading">در حال دریافت از سرور...</div>}
          {contentError && <div className="content-loading error">{contentError}</div>}
          {!contentLoading && !contentError && activeArticle && (
            <div className="article-slider">
              <button className="slider-btn" type="button" onClick={showPreviousArticle} aria-label="مقاله قبلی">
                <ChevronRight />
              </button>
              <Link className="article-slide" to={`/articles/${activeArticle.slug}`}>
                <img src={activeArticle.image} alt={activeArticle.imageAlt} />
                <div>
                  <span className="chip">مقاله منتخب</span>
                  <h3>{activeArticle.title}</h3>
                  <p>{activeArticle.excerpt}</p>
                  <time>
                    <CalendarDays size={16} />
                    {activeArticle.publishedAt}
                  </time>
                  <div className="card-read-more">
                    <BookOpen size={17} />
                    مطالعه کامل <ArrowUpLeft size={17} />
                  </div>
                </div>
              </Link>
              <button className="slider-btn" type="button" onClick={showNextArticle} aria-label="مقاله بعدی">
                <ChevronLeft />
              </button>

              <div className="article-slider-tabs">
                {articleItems.map((item, index) => (
                  <button
                    className={index === activeArticleIndex ? "active" : ""}
                    type="button"
                    key={item.id}
                    onClick={() => setActiveArticleIndex(index)}
                    aria-label={`نمایش مقاله ${index + 1}`}
                  >
                    <img src={item.image} alt="" />
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
            {faqs.map(([question, answer], index) => (
              <article className={`faq-item ${openFaqIndex === index ? "open" : ""}`} key={question}>
                <button
                  className="faq-question"
                  type="button"
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenFaqIndex(current => current === index ? null : index)}
                >
                  <HelpCircle /> {question} <ChevronDown />
                </button>
                {openFaqIndex === index && (
                  <p className="faq-answer" id={`faq-answer-${index}`}>
                    {answer}
                  </p>
                )}
              </article>
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
