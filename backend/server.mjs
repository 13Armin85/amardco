import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliCompress, gzip } from 'node:zlib'
import { promisify } from 'node:util'
import {
  articleItems,
  certificateImages,
  company,
  contentItems,
  latestItems,
  newsItems,
  productGroups,
  products,
} from './data.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'frontend', 'dist')
const port = Number(process.env.PORT || 4173)
// Enable only behind a proxy that overwrites these headers and isolates Node.
const trustProxy = process.env.TRUST_PROXY === '1'
const compressBrotli = promisify(brotliCompress)
const compressGzip = promisify(gzip)

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.woff', 'font/woff'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
])

const indexableRoutes = new Set([
  '/',
  '/about',
  '/products',
  '/certificates',
  '/contact',
  ...products.map(item => `/products/${item.slug}`),
  ...latestItems
    .filter(item => !articleItems.some(article => article.slug === item.slug))
    .map(item => `/updates/${item.slug}`),
  ...newsItems.map(item => `/news/${item.slug}`),
  ...articleItems.map(item => `/articles/${item.slug}`),
])

const legacyRedirects = new Map(
  latestItems
    .filter(item => articleItems.some(article => article.slug === item.slug))
    .map(item => [`/updates/${item.slug}`, `/articles/${item.slug}`]),
)

function securityHeaders(isSecure = false) {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-src https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" + (isSecure ? '; upgrade-insecure-requests' : ''),
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    ...(isSecure ? { 'Strict-Transport-Security': 'max-age=31536000' } : {}),
  }
}

async function sendBody(req, res, status, body, headers = {}) {
  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body)
  const contentType = headers['Content-Type'] || ''
  const compressible = /^(?:text\/|application\/(?:json|javascript|xml))/.test(contentType)
  const acceptEncoding = req.headers['accept-encoding'] || ''
  let output = buffer
  const responseHeaders = { ...headers, Vary: 'Accept-Encoding' }

  if (compressible && buffer.length > 1024 && acceptEncoding.includes('br')) {
    output = await compressBrotli(buffer)
    responseHeaders['Content-Encoding'] = 'br'
  } else if (compressible && buffer.length > 1024 && acceptEncoding.includes('gzip')) {
    output = await compressGzip(buffer)
    responseHeaders['Content-Encoding'] = 'gzip'
  }

  responseHeaders['Content-Length'] = String(output.length)
  res.writeHead(status, responseHeaders)
  res.end(req.method === 'HEAD' ? undefined : output)
}

function sendJson(req, res, status, payload) {
  return sendBody(req, res, status, JSON.stringify(payload), {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
}

function redirect(res, location, isSecure) {
  res.writeHead(301, {
    ...securityHeaders(isSecure),
    'Cache-Control': 'public, max-age=86400',
    Location: location,
  })
  res.end()
}

function findBySlug(items, slug) {
  return items.find(item => item.slug === slug)
}

async function handleApi(req, res, url) {
  if (req.method === 'OPTIONS') {
    return sendJson(req, res, 204, null)
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const resource = segments[1]
  const slug = segments[2]

  if (req.method === 'GET' && resource === 'health') {
    return sendJson(req, res, 200, { ok: true, service: 'amardco-backend' })
  }

  if (req.method === 'GET' && resource === 'routes') {
    return sendJson(req, res, 200, {
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
    return sendJson(req, res, 200, { data: company })
  }

  if (req.method === 'GET' && resource === 'product-groups') {
    return sendJson(req, res, 200, { data: productGroups })
  }

  if (req.method === 'GET' && resource === 'products') {
    const item = slug ? findBySlug(products, slug) : null
    return slug
      ? sendJson(req, res, item ? 200 : 404, item ? { data: item } : { message: 'Product not found' })
      : sendJson(req, res, 200, { data: products })
  }

  if (req.method === 'GET' && resource === 'content') {
    return sendJson(req, res, 200, { data: contentItems })
  }

  if (req.method === 'GET' && resource === 'updates') {
    const item = slug ? findBySlug(latestItems, slug) : null
    return slug
      ? sendJson(req, res, item ? 200 : 404, item ? { data: item } : { message: 'Update not found' })
      : sendJson(req, res, 200, { data: latestItems })
  }

  if (req.method === 'GET' && resource === 'news') {
    const item = slug ? findBySlug(newsItems, slug) : null
    return slug
      ? sendJson(req, res, item ? 200 : 404, item ? { data: item } : { message: 'News item not found' })
      : sendJson(req, res, 200, { data: newsItems })
  }

  if (req.method === 'GET' && resource === 'articles') {
    const item = slug ? findBySlug(articleItems, slug) : null
    return slug
      ? sendJson(req, res, item ? 200 : 404, item ? { data: item } : { message: 'Article not found' })
      : sendJson(req, res, 200, { data: articleItems })
  }

  if (req.method === 'GET' && resource === 'certificates') {
    return sendJson(req, res, 200, { data: certificateImages })
  }

  return sendJson(req, res, 404, { message: 'API route not found' })
}

async function serveStatic(req, res, pathname, isSecure) {
  let decodedPath
  try {
    decodedPath = decodeURIComponent(pathname)
  } catch {
    return sendJson(req, res, 400, { message: 'Invalid URL encoding' })
  }

  const requestedPath = decodedPath === '/' ? '/index.html' : decodedPath
  let filePath = path.resolve(publicDir, `.${requestedPath}`)
  const withinPublicDir = filePath === publicDir || filePath.startsWith(`${publicDir}${path.sep}`)
  let status = 200

  if (!withinPublicDir) {
    return sendJson(req, res, 403, { message: 'Forbidden path' })
  }

  if (existsSync(filePath) && (await stat(filePath)).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }

  if (!existsSync(filePath) && indexableRoutes.has(decodedPath)) {
    filePath = path.join(publicDir, 'index.html')
  } else if (!existsSync(filePath)) {
    filePath = path.join(publicDir, '404.html')
    status = 404
    if (!existsSync(filePath)) filePath = path.join(publicDir, 'index.html')
  }

  try {
    const body = await readFile(filePath)
    const type = mimeTypes.get(path.extname(filePath)) || 'application/octet-stream'
    const isHashedAsset = /[/\\]assets[/\\].+-[A-Za-z0-9_-]{8,}\./.test(filePath)
    const isHtml = type.startsWith('text/html')
    const isDiscoveryFile = filePath.endsWith('sitemap.xml') || filePath.endsWith('robots.txt')
    const cacheControl = isHtml
      ? 'no-cache'
      : isHashedAsset
        ? 'public, max-age=31536000, immutable'
        : isDiscoveryFile
          ? 'public, max-age=3600'
          : 'public, max-age=604800'
    await sendBody(req, res, status, body, {
      ...securityHeaders(isSecure),
      'Content-Type': type,
      'Cache-Control': cacheControl,
    })
  } catch {
    await sendJson(req, res, 404, { message: 'Build output not found. Run npm run build first.' })
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    const forwardedHost = trustProxy ? String(req.headers['x-forwarded-host'] || '').split(',')[0].trim() : ''
    const hostname = forwardedHost ? new URL(`http://${forwardedHost}`).hostname.toLowerCase() : url.hostname.toLowerCase()
    const forwardedProto = trustProxy ? String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase() : ''
    const isSecure = forwardedProto === 'https' || Boolean(req.socket.encrypted)
    const isPublicHost = hostname === 'amardco.com' || hostname === 'www.amardco.com'
    let canonicalPath = url.pathname.replace(/\/+$/, '') || '/'
    const indexPath = canonicalPath.replace(/\/index\.html$/i, '') || '/'
    if (indexableRoutes.has(indexPath) || legacyRedirects.has(indexPath)) canonicalPath = indexPath
    canonicalPath = legacyRedirects.get(canonicalPath) || canonicalPath

    if ((isPublicHost && (!isSecure || hostname === 'www.amardco.com')) || canonicalPath !== url.pathname) {
      // Absolute public destinations also avoid scheme-relative redirects for // paths.
      const origin = isPublicHost ? 'https://amardco.com' : url.origin
      redirect(res, `${origin}${canonicalPath}${url.search}`, isSecure)
      return
    }

    if (url.pathname.startsWith('/api/')) {
      Object.entries(securityHeaders(isSecure)).forEach(([name, value]) => res.setHeader(name, value))
      await handleApi(req, res, url)
      return
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      await sendJson(req, res, 405, { message: 'Method not allowed' })
      return
    }

    await serveStatic(req, res, url.pathname, isSecure)
  } catch (error) {
    await sendJson(req, res, 500, { message: error instanceof Error ? error.message : 'Server error' })
  }
})

server.listen(port, process.env.HOST || '127.0.0.1', () => {
  console.log(`Amardco backend listening on http://127.0.0.1:${server.address().port}`)
})
