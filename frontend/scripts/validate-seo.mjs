import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(scriptDir, '..', 'dist')
const failures = []

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? listHtmlFiles(target) : target.endsWith('.html') ? [target] : []
  }))
  return nested.flat()
}

function routeFromFile(file) {
  const relative = path.relative(distDir, file).replaceAll('\\', '/')
  if (relative === 'index.html') return '/'
  if (relative === '404.html') return '/404'
  return `/${relative.replace(/\/index\.html$/, '')}`
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)]
}

const htmlFiles = await listHtmlFiles(distDir)
const routeFiles = new Map(htmlFiles.map(file => [routeFromFile(file), file]))
const indexableCanonicals = new Map()
const indexableTitles = new Map()
const indexableDescriptions = new Map()

for (const file of htmlFiles) {
  const route = routeFromFile(file)
  const html = await readFile(file, 'utf8')
  const titles = matches(html, /<title>([\s\S]*?)<\/title>/gi)
  const descriptions = matches(html, /<meta\s+name="description"\s+content="([^"]+)"/gi)
  const canonicals = matches(html, /<link\s+rel="canonical"\s+href="([^"]+)"/gi)
  const robots = matches(html, /<meta\s+name="robots"\s+content="([^"]+)"/gi)
  const h1s = matches(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi)

  if (titles.length !== 1) failures.push(`${route}: expected one title, found ${titles.length}`)
  if (descriptions.length !== 1) failures.push(`${route}: expected one meta description, found ${descriptions.length}`)
  if (canonicals.length !== 1) failures.push(`${route}: expected one canonical, found ${canonicals.length}`)
  if (robots.length !== 1) failures.push(`${route}: expected one robots meta, found ${robots.length}`)
  if (h1s.length !== 1) failures.push(`${route}: expected one H1, found ${h1s.length}`)

  if (canonicals[0] && !robots[0]?.[1].includes('noindex')) {
    const canonical = canonicals[0][1]
    if (indexableCanonicals.has(canonical)) failures.push(`${route}: duplicate canonical ${canonical}`)
    indexableCanonicals.set(canonical, route)

    const title = titles[0]?.[1]
    const description = descriptions[0]?.[1]
    if (title && indexableTitles.has(title)) failures.push(`${route}: duplicate title also used by ${indexableTitles.get(title)}`)
    if (description && indexableDescriptions.has(description)) failures.push(`${route}: duplicate description also used by ${indexableDescriptions.get(description)}`)
    if (title) indexableTitles.set(title, route)
    if (description) indexableDescriptions.set(description, route)
    if (canonical !== `https://amardco.com${route}`) failures.push(`${route}: unexpected canonical ${canonical}`)
    if (!matches(html, /<script\s+type="application\/ld\+json"[^>]*>/gi).length) failures.push(`${route}: missing JSON-LD`)
  }

  for (const match of matches(html, /<script\s+type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!match[1].includes('data-seo-schema=')) failures.push(`${route}: JSON-LD cannot be replaced on client navigation`)
    try {
      const schema = JSON.parse(match[2])
      if (schema['@context'] !== 'https://schema.org') failures.push(`${route}: JSON-LD is missing schema.org context`)
    } catch {
      failures.push(`${route}: invalid JSON-LD`)
    }
  }

  if (!/<link\b[^>]*rel="stylesheet"[^>]*href="\/assets\/[^\"]+\.css"/i.test(html)) failures.push(`${route}: missing production stylesheet`)
  for (const match of matches(html, /<script[^>]+\ssrc="([^"]+)"/gi)) {
    const src = match[1]
    if (src.startsWith('/') && !existsSync(path.join(distDir, src.slice(1)))) failures.push(`${route}: missing JavaScript ${src}`)
  }

  for (const match of matches(html, /\shref="([^"]+)"/gi)) {
    const href = match[1]
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const pathname = decodeURIComponent(href.split(/[?#]/)[0]) || '/'
    const assetPath = path.join(distDir, pathname.slice(1))
    if (!routeFiles.has(pathname) && !existsSync(assetPath)) failures.push(`${route}: broken internal link ${href}`)
  }

  for (const match of matches(html, /<img[^>]+\ssrc="([^"]+)"/gi)) {
    const src = match[1]
    if (!src.startsWith('/') || src.startsWith('//')) continue
    const imagePath = path.join(distDir, decodeURIComponent(src).slice(1))
    if (!existsSync(imagePath)) failures.push(`${route}: missing image ${src}`)
  }
}

const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8')
const sitemapUrls = new Set(matches(sitemap, /<loc>([^<]+)<\/loc>/g).map(match => match[1]))

for (const canonical of indexableCanonicals.keys()) {
  if (!sitemapUrls.has(canonical)) failures.push(`sitemap: missing ${canonical}`)
}
for (const url of sitemapUrls) {
  if (!indexableCanonicals.has(url)) failures.push(`sitemap: non-canonical or unknown URL ${url}`)
}

const robotsText = await readFile(path.join(distDir, 'robots.txt'), 'utf8')
if (!robotsText.includes('Sitemap: https://amardco.com/sitemap.xml')) failures.push('robots.txt: sitemap declaration is missing')
if (!robotsText.includes('Allow: /')) failures.push('robots.txt: public pages are not explicitly allowed')

if (failures.length) {
  console.error(`SEO validation failed with ${failures.length} issue(s):`)
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`SEO validation passed for ${htmlFiles.length} HTML files and ${sitemapUrls.size} sitemap URLs.`)
}
