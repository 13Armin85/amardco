import type { Config } from '@netlify/functions'
import {
  articleItems,
  certificateImages,
  company,
  contentItems,
  latestItems,
  newsItems,
  productGroups,
  products,
} from '../../backend/data.mjs'

function json(status: number, payload: unknown) {
  return new Response(payload === null ? null : JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function findBySlug<T extends { slug: string }>(items: T[], slug: string | undefined) {
  return slug ? items.find(item => item.slug === slug) : undefined
}

export default async (req: Request) => {
  const url = new URL(req.url)
  const segments = url.pathname.split('/').filter(Boolean)
  const resource = segments[1]
  const slug = segments[2]

  if (req.method === 'GET' && resource === 'health') {
    return json(200, { ok: true, service: 'amardco-backend' })
  }

  if (req.method === 'GET' && resource === 'routes') {
    return json(200, {
      routes: [
        '/api/health',
        '/api/routes',
        '/api/content',
        '/api/updates',
        '/api/updates/:slug',
        '/api/news',
        '/api/news/:slug',
        '/api/articles',
        '/api/articles/:slug',
        '/api/certificates',
        '/api/company',
        '/api/product-groups',
        '/api/products',
        '/api/products/:slug',
      ],
    })
  }

  if (req.method === 'GET' && resource === 'company') {
    return json(200, { data: company })
  }

  if (req.method === 'GET' && resource === 'product-groups') {
    return json(200, { data: productGroups })
  }

  if (req.method === 'GET' && resource === 'products') {
    if (!slug) return json(200, { data: products })
    const item = findBySlug(products, slug)
    return json(item ? 200 : 404, item ? { data: item } : { message: 'Product not found' })
  }

  if (req.method === 'GET' && resource === 'content') {
    return json(200, { data: contentItems })
  }

  if (req.method === 'GET' && resource === 'updates') {
    if (!slug) return json(200, { data: latestItems })
    const item = findBySlug(latestItems, slug)
    return json(item ? 200 : 404, item ? { data: item } : { message: 'Update not found' })
  }

  if (req.method === 'GET' && resource === 'news') {
    if (!slug) return json(200, { data: newsItems })
    const item = findBySlug(newsItems, slug)
    return json(item ? 200 : 404, item ? { data: item } : { message: 'News item not found' })
  }

  if (req.method === 'GET' && resource === 'articles') {
    if (!slug) return json(200, { data: articleItems })
    const item = findBySlug(articleItems, slug)
    return json(item ? 200 : 404, item ? { data: item } : { message: 'Article not found' })
  }

  if (req.method === 'GET' && resource === 'certificates') {
    return json(200, { data: certificateImages })
  }

  return json(404, { message: 'API route not found' })
}

export const config: Config = {
  path: '/api/*',
}
