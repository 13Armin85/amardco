import { useEffect } from 'react'
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE, SITE_NAME, type JsonLd } from '../lib/seo'

interface SEOOptions {
  path?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  noIndex?: boolean
  keywords?: string[]
  schemas?: JsonLd[]
}

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value))
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null

  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }

  element.href = href
}

export function useSEO(title: string, description: string, options: SEOOptions = {}) {
  const schemasJson = JSON.stringify(options.schemas || [])
  const keywords = options.keywords?.join(', ') || ''

  useEffect(() => {
    const path = options.path || window.location.pathname
    const canonical = absoluteUrl(path === '/' ? '/' : path.replace(/\/$/, ''))
    const image = absoluteUrl(options.image || DEFAULT_SOCIAL_IMAGE)
    const robots = options.noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

    document.title = title
    setMeta('meta[name="description"]', { name: 'description', content: description })
    setMeta('meta[name="robots"]', { name: 'robots', content: robots })
    setMeta('meta[name="googlebot"]', { name: 'googlebot', content: robots })
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'fa_IR' })
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: options.type || 'website' })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    setMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: options.imageAlt || SITE_NAME,
    })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    if (options.publishedTime) {
      setMeta('meta[property="article:published_time"]', {
        property: 'article:published_time',
        content: options.publishedTime,
      })
    } else {
      document.head.querySelector('meta[property="article:published_time"]')?.remove()
    }

    if (keywords) {
      setMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
    } else {
      document.head.querySelector('meta[name="keywords"]')?.remove()
    }

    setLink('canonical', canonical)

    document.head.querySelectorAll('script[data-seo-schema]').forEach(element => element.remove())
    JSON.parse(schemasJson).forEach((schema: JsonLd, index: number) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.seoSchema = String(index)
      script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c')
      document.head.appendChild(script)
    })
  }, [description, keywords, options.image, options.imageAlt, options.noIndex, options.path, options.publishedTime, options.type, schemasJson, title])
}
