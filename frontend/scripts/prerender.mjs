import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  articleItems,
  certificateImages,
  company,
  latestItems,
  newsItems,
  products,
} from '../../backend/data.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const frontendDir = path.resolve(scriptDir, '..')
const distDir = path.join(frontendDir, 'dist')
const siteUrl = company.website.replace(/\/$/, '')
const defaultImage = '/city-hero-smaller-no-border.png'
const canonicalArticles = new Set(articleItems.map(item => item.slug))
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim()

const imageDimensions = {
  "/city-hero-smaller-no-border.png": [836, 470],
  "/city-dark.png": [1672, 941],
  "/smart-city-hero.png": [1717, 916],
  "/shahrsazi.png": [1672, 941],
  "/urban-planning-legal-guide.webp": [1055, 1491],
  "/construction-supervision.webp": [1376, 768],
  "/smart-city-citizen-participation.webp": [1536, 1024],
  "/news-property-coefficient-1405.webp": [1376, 768],
  "/news-property-coefficient-1404.webp": [1024, 1024],
  "/news-renovation-rate-2-5.webp": [1536, 1024],
  "/product-article-77.jpg": [1333, 640],
  "/product-properties.png": [1143, 552],
  "/gis.png": [1477, 378],
  "/product-income.png": [1449, 698],
  "/product-article-100.jpg": [1424, 1505],
  "/product-guilds.png": [1323, 838],
  "/product-renovation.png": [1431, 910],
  "/product-payroll.png": [1346, 589],
  "/product-hr.png": [1325, 581],
  "/product-contracts.png": [1335, 604],
  "/product-accounting.png": [1339, 614],
  "/product-budget.png": [1332, 550],
  "/product-treasury.png": [1340, 593],
  "/hoghoghi.jpg": [1500, 843],
  "/daraeiha.jpg": [1500, 843],
  "/product-citizenyar.jpg": [1670, 872],
};

const productImages = {
  'article-77': '/product-article-77.jpg',
  properties: '/product-properties.png',
  gis: '/gis.png',
  income: '/product-income.png',
  'article-100': '/product-article-100.jpg',
  guilds: '/product-guilds.png',
  renovation: '/product-renovation.png',
  payroll: '/product-payroll.png',
  hr: '/product-hr.png',
  contracts: '/product-contracts.png',
  accounting: '/product-accounting.png',
  budget: '/product-budget.png',
  treasury: '/product-treasury.png',
  checks: '/smart-city-hero.png',
  legal: '/hoghoghi.jpg',
  'fixed-assets': '/daraeiha.jpg',
  warehouse: '/smart-city-hero.png',
  taxpayers: '/smart-city-hero.png',
  citizenyar: '/product-citizenyar.jpg',
}

const faqs = [
  ['آیا محصولات آمارد تحت وب هستند؟', 'بله، محصولات اصلی با رویکرد تحت وب و مناسب استفاده سازمانی طراحی شده‌اند.'],
  ['آیا نرم‌افزارهای شهرسازی و مالی به هم متصل می‌شوند؟', 'بله، ساختار محصولات برای کاهش ورود مجدد اطلاعات و ایجاد گردش داده یکپارچه طراحی شده است.'],
  ['امکان اتصال به GIS وجود دارد؟', 'بله، نرم‌افزار GIS آمارد می‌تواند اطلاعات مکانی را به پرونده‌ها و داده‌های توصیفی متصل کند.'],
  ['محصولات آمارد چه حوزه‌هایی را پوشش می‌دهند؟', 'محصولات آمارد فرایندهای شهرسازی، مالی و اداری، GIS و خدمات الکترونیکی شهروندی را پوشش می‌دهند.'],
  ['چطور می‌توان درخواست همکاری ثبت کرد؟', 'از صفحه تماس می‌توانید مسیر ارتباط و بررسی نیاز سازمان را شروع کنید.'],
]

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function absoluteUrl(value = '/') {
  return new URL(value, `${siteUrl}/`).toString()
}

function imageTag(src, alt, options = {}) {
  const [width, height] = imageDimensions[src] || []
  const loading = options.priority ? ' fetchpriority="high"' : ' loading="lazy"'
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${width ? ` width="${width}" height="${height}"` : ''}${loading} decoding="async">`
}

function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

const organization = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: company.name,
  alternateName: company.shortName,
  url: `${siteUrl}/`,
  description: company.description,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/amard-logo.png'),
    width: 1774,
    height: 887,
  },
  email: company.email,
  telephone: company.phones,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address,
    addressCountry: 'IR',
  },
}

function graph(...items) {
  return { '@context': 'https://schema.org', '@graph': items }
}

function pageShell(content) {
  const primaryLinks = [
    ['/', 'خانه'],
    ['/products', 'محصولات'],
    ['/about', 'درباره ما'],
    ['/certificates', 'گواهینامه‌ها و مدارک'],
    ['/contact', 'تماس با ما'],
  ]
  return `<div class="seo-snapshot">
    <a class="skip-link" href="#main-content">پرش به محتوای اصلی</a>
    <header><nav aria-label="منوی اصلی">${primaryLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join(' ')}</nav></header>
    <main id="main-content">${content}</main>
    <footer><address>${escapeHtml(company.address)} — <a href="tel:${company.phones[0]}">${company.phones[0]}</a> — <a href="mailto:${company.email}">${company.email}</a></address></footer>
  </div>`
}

function contentCards(items, prefix) {
  return `<ul>${items.map(item => `<li><a href="/${prefix}/${item.slug}">${escapeHtml(item.title)}</a><p>${escapeHtml(item.excerpt)}</p></li>`).join('')}</ul>`
}

const homeBody = pageShell(`
  <section><h1>تحول دیجیتال در مدیریت شهری</h1><p>${escapeHtml(company.description)}</p>${imageTag(defaultImage, 'شهر هوشمند و سامانه‌های یکپارچه آمارد', { priority: true })}<p><a href="/products">مشاهده محصولات نرم‌افزاری آمارد</a> <a href="/contact">ارتباط با آمارد</a></p></section>
  <section><h2>محصولات شهرسازی، مالی و اداری آمارد</h2><ul>${products.map(product => `<li><a href="/products/${product.slug}">${escapeHtml(product.title)}</a> — ${escapeHtml(product.shortDescription)}</li>`).join('')}</ul></section>
  <section><h2>تازه‌های آمارد</h2>${contentCards(latestItems.filter(item => !canonicalArticles.has(item.slug)), 'updates')}${contentCards(articleItems, 'articles')}</section>
  <section><h2>اخبار مدیریت شهری</h2>${contentCards(newsItems, 'news')}</section>
  <section><h2>سوالات متداول</h2>${faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</section>
`)

const homeSchema = graph(
  organization,
  {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: company.name,
    inLanguage: 'fa-IR',
    publisher: { '@id': `${siteUrl}/#organization` },
  },
  {
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name: 'تحلیلگران آمارد نوین | تحول دیجیتال در مدیریت شهری',
    description: company.description,
    inLanguage: 'fa-IR',
    isPartOf: { '@id': `${siteUrl}/#website` },
  },
  {
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  },
)

const pages = [{
  path: '/',
  title: 'تحلیلگران آمارد نوین | تحول دیجیتال در مدیریت شهری',
  description: company.description,
  image: defaultImage,
  imageAlt: 'شهر هوشمند و سامانه‌های یکپارچه آمارد',
  body: homeBody,
  schemas: [homeSchema],
}]

pages.push({
  path: '/about',
  title: 'درباره آمارد | تحلیلگران آمارد نوین',
  description: 'با شرکت تحلیلگران آمارد نوین، حوزه‌های فعالیت و رویکرد آن در طراحی، استقرار و پشتیبانی نرم‌افزارهای شهرسازی، مالی و اداری آشنا شوید.',
  body: pageShell(`<article><h1>درباره تحلیلگران آمارد نوین</h1><p>${escapeHtml(company.description)}</p><h2>حوزه‌های فعالیت</h2><ul>${company.areas.map(area => `<li>${escapeHtml(area)}</li>`).join('')}</ul><h2>رویکرد اجرایی</h2><p>فعالیت آمارد بر تحلیل نیاز، طراحی راهکار، پیاده‌سازی، استقرار و پشتیبانی نرم‌افزارهای سازمانی متمرکز است.</p></article>`),
  schemas: [graph(
    organization,
    { '@type': 'AboutPage', '@id': `${absoluteUrl('/about')}#webpage`, url: absoluteUrl('/about'), name: 'درباره تحلیلگران آمارد نوین', description: 'با شرکت تحلیلگران آمارد نوین، حوزه‌های فعالیت و رویکرد آن در طراحی، استقرار و پشتیبانی نرم‌افزارهای شهرسازی، مالی و اداری آشنا شوید.', about: { '@id': `${siteUrl}/#organization` }, inLanguage: 'fa-IR' },
    breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'درباره ما', path: '/about' }]),
  )],
})

pages.push({
  path: '/products',
  title: 'محصولات آمارد | راهکارهای شهرسازی، مالی و اداری',
  description: 'محصولات نرم‌افزاری تحلیلگران آمارد نوین در حوزه شهرسازی، مالی و اداری.',
  body: pageShell(`<section><h1>محصولات نرم‌افزاری آمارد</h1><p>راهکارهای تخصصی شهرسازی، مالی و اداری برای شهرداری‌ها و سازمان‌ها.</p>${products.map(product => `<article><h2><a href="/products/${product.slug}">${escapeHtml(product.title)}</a></h2><p>${escapeHtml(product.shortDescription)}</p><p>${escapeHtml(product.category)}</p></article>`).join('')}</section>`),
  schemas: [graph(
    { '@type': 'CollectionPage', '@id': `${absoluteUrl('/products')}#webpage`, url: absoluteUrl('/products'), name: 'محصولات نرم‌افزاری آمارد', inLanguage: 'fa-IR', mainEntity: { '@type': 'ItemList', itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, name: product.title, url: absoluteUrl(`/products/${product.slug}`) })) } },
    breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'محصولات', path: '/products' }]),
  )],
})

pages.push({
  path: '/certificates',
  title: 'گواهینامه‌ها و مدارک آمارد | تحلیلگران آمارد نوین',
  description: 'مشاهده گواهینامه‌ها و مدارک شرکت تحلیلگران آمارد نوین در قالب اسلایدر تصویری.',
  body: pageShell(`<section><h1>گواهینامه‌ها و مدارک آمارد</h1><p>مرور تصویری مدارک و گواهینامه‌های شرکت تحلیلگران آمارد نوین.</p>${certificateImages.map(item => `<figure><img src="${item.image}" alt="${escapeHtml(item.imageAlt)}" width="${item.width}" height="${item.height}" loading="lazy"><figcaption>${escapeHtml(item.title)}</figcaption></figure>`).join('')}</section>`),
  schemas: [graph(
    { '@type': 'CollectionPage', '@id': `${absoluteUrl('/certificates')}#webpage`, url: absoluteUrl('/certificates'), name: 'گواهینامه‌ها و مدارک آمارد', inLanguage: 'fa-IR' },
    breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'گواهینامه‌ها و مدارک', path: '/certificates' }]),
  )],
})

pages.push({
  path: '/contact',
  title: 'تماس با آمارد | تلفن، ایمیل، آدرس و نقشه',
  description: 'اطلاعات تماس شرکت تحلیلگران آمارد نوین شامل شماره تلفن، ایمیل، آدرس و موقعیت روی نقشه.',
  body: pageShell(`<section><h1>تماس با تحلیلگران آمارد نوین</h1><p>برای معرفی محصول، دریافت مشاوره یا شروع همکاری از راه‌های زیر با آمارد در ارتباط باشید.</p><address><h2>اطلاعات تماس</h2><p>تلفن: ${company.phones.map(phone => `<a href="tel:${phone}">${phone}</a>`).join(' — ')}</p><p>ایمیل: <a href="mailto:${company.email}">${company.email}</a></p><p>آدرس: ${escapeHtml(company.address)}</p></address></section>`),
  schemas: [graph(
    organization,
    { '@type': 'ContactPage', '@id': `${absoluteUrl('/contact')}#webpage`, url: absoluteUrl('/contact'), name: 'تماس با تحلیلگران آمارد نوین', about: { '@id': `${siteUrl}/#organization` }, inLanguage: 'fa-IR' },
    breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'تماس با ما', path: '/contact' }]),
  )],
})

for (const product of products) {
  const pagePath = `/products/${product.slug}`
  const image = productImages[product.id]
  pages.push({
    path: pagePath,
    title: `${product.title} | آمارد`,
    description: product.shortDescription,
    image,
    imageAlt: image ? `نمای محصول ${product.title}` : undefined,
    body: pageShell(`<article><p><a href="/products">محصولات</a></p><h1>${escapeHtml(product.title)}</h1><p>${escapeHtml(product.description)}</p>${image ? imageTag(image, `نمای محصول ${product.title}`, { priority: true }) : ''}<h2>قابلیت‌های کلیدی</h2><ul>${product.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>${(product.contentSections || []).map(section => `<section><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('')}<h2>دامنه محصول</h2><ul>${product.capabilities.map(capability => `<li>${escapeHtml(capability)}</li>`).join('')}</ul><p><a href="/contact">درخواست مشاوره درباره ${escapeHtml(product.title)}</a></p></article>`),
    schemas: [graph(
      { '@type': 'Product', '@id': `${absoluteUrl(pagePath)}#product`, url: absoluteUrl(pagePath), name: product.title, description: product.description, category: product.category, image: image ? absoluteUrl(image) : undefined, brand: organization, additionalProperty: product.capabilities.map(capability => ({ '@type': 'PropertyValue', name: 'قابلیت نرم‌افزار', value: capability })) },
      breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: 'محصولات', path: '/products' }, { name: product.title, path: pagePath }]),
    )],
  })
}

const contentGroups = [
  { items: latestItems.filter(item => !canonicalArticles.has(item.slug)), prefix: 'updates', label: 'تازه‌های آمارد', schemaType: 'Article' },
  { items: newsItems, prefix: 'news', label: 'اخبار', schemaType: 'NewsArticle' },
  { items: articleItems, prefix: 'articles', label: 'مقالات', schemaType: 'Article' },
]

for (const group of contentGroups) {
  for (const item of group.items) {
    const pagePath = `/${group.prefix}/${item.slug}`
    pages.push({
      path: pagePath,
      title: item.seoTitle || `${item.title} | آمارد`,
      description: item.seoDescription || item.excerpt,
      image: item.image,
      imageAlt: item.imageAlt,
      type: 'article',
      publishedAt: item.publishedAtISO,
      lastmod: item.publishedAtISO,
      body: pageShell(`<article><p><a href="/">خانه</a> / ${group.label}</p><h1>${escapeHtml(item.title)}</h1><p>${escapeHtml(item.excerpt)}</p><time datetime="${item.publishedAtISO || ''}">${escapeHtml(item.publishedAt)}</time>${imageTag(item.image, item.imageAlt, { priority: true })}<h2>شرح موضوع و نکات کلیدی</h2>${item.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}<h2>راهکارهای نرم‌افزاری مرتبط</h2><p><a href="/products">مشاهده محصولات آمارد</a> — <a href="/contact">ارتباط با کارشناسان آمارد</a></p></article>`),
      schemas: [graph(
        { '@type': group.schemaType, '@id': `${absoluteUrl(pagePath)}#article`, url: absoluteUrl(pagePath), mainEntityOfPage: absoluteUrl(pagePath), headline: item.title, description: item.seoDescription || item.excerpt, image: absoluteUrl(item.image), datePublished: item.publishedAtISO, inLanguage: 'fa-IR', author: organization, publisher: organization },
        breadcrumbSchema([{ name: 'خانه', path: '/' }, { name: group.label, path: '/' }, { name: item.title, path: pagePath }]),
      )],
    })
  }
}

function renderMetadata(page) {
  const canonical = absoluteUrl(page.path)
  const image = absoluteUrl(page.image || defaultImage)
  const robots = page.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  return `
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="${robots}">
  <meta name="googlebot" content="${robots}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:locale" content="fa_IR">
  <meta property="og:type" content="${page.type || 'website'}">
  <meta property="og:site_name" content="${escapeHtml(company.name)}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${escapeHtml(page.imageAlt || company.name)}">
  ${page.publishedAt ? `<meta property="article:published_time" content="${page.publishedAt}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${image}">
  ${(page.schemas || []).map((schema, index) => `<script type="application/ld+json" data-seo-schema="${index}">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`).join('\n  ')}
  ${page.path === '/' ? `<link rel="preload" as="image" href="${defaultImage}" fetchpriority="high">` : ''}
  `
}

function renderPage(baseHtml, page) {
  let html = baseHtml
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+(?:name|property)="(?:description|robots|googlebot|og:[^"]+|twitter:[^"]+|article:published_time)"[^>]*>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, '')
  html = html.replace('</head>', `${renderMetadata(page)}\n</head>`)
  if (googleVerification) {
    html = html.replace('</head>', `  <meta name="google-site-verification" content="${escapeHtml(googleVerification)}">\n</head>`)
  }
  return html.replace('<div id="root"></div>', `<div id="root">${page.body}</div>`)
}

const baseHtml = await readFile(path.join(distDir, 'index.html'), 'utf8')

for (const page of pages) {
  const output = page.path === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, page.path.slice(1), 'index.html')
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, renderPage(baseHtml, page), 'utf8')
}

const notFoundPage = {
  path: '/404',
  title: 'صفحه پیدا نشد | تحلیلگران آمارد نوین',
  description: 'این نشانی در وب‌سایت تحلیلگران آمارد نوین وجود ندارد.',
  noIndex: true,
  body: pageShell('<section><h1>صفحه پیدا نشد</h1><p>نشانی درخواستی وجود ندارد.</p><p><a href="/">بازگشت به صفحه اصلی</a></p></section>'),
  schemas: [],
}
await writeFile(path.join(distDir, '404.html'), renderPage(baseHtml, notFoundPage), 'utf8')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url><loc>${absoluteUrl(page.path)}</loc>${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>\n`
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')
await writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8')

console.log(`Prerendered ${pages.length} indexable routes and generated sitemap.xml, robots.txt, and 404.html.`)
