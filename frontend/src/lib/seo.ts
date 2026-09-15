export const SITE_URL = 'https://amardco.com'
export const SITE_NAME = 'تحلیلگران آمارد نوین'
export const DEFAULT_SOCIAL_IMAGE = '/city-hero-smaller-no-border.png'

export type JsonLd = Record<string, unknown>

const articleUpdateSlugs = new Set([
  'citizen-participation-in-smart-city',
  'construction-supervision-city-limits-and-boundaries',
  'comprehensive-urban-planning-laws-and-services-guide',
])

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}

export function contentPath(kind: 'update' | 'news' | 'article', slug: string) {
  if (kind === 'update' && articleUpdateSlugs.has(slug)) return `/articles/${slug}`
  const prefix = kind === 'update' ? 'updates' : kind === 'news' ? 'news' : 'articles'
  return `/${prefix}/${slug}`
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export const publisherSchema: JsonLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'آمارد',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/amard-logo.png'),
    width: 1774,
    height: 887,
  },
}
