import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { articleItems, certificateImages, contentItems, latestItems, newsItems } from './data.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'frontend', 'dist')
const port = Number(process.env.PORT || 4173)

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
])

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
}

function findBySlug(items, slug) {
  return items.find(item => item.slug === slug)
}

async function handleApi(req, res, url) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, null)
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const resource = segments[1]
  const slug = segments[2]

  if (req.method === 'GET' && resource === 'health') {
    return sendJson(res, 200, { ok: true, service: 'amardco-backend' })
  }

  if (req.method === 'GET' && resource === 'routes') {
    return sendJson(res, 200, {
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
      ],
    })
  }

  if (req.method === 'GET' && resource === 'content') {
    return sendJson(res, 200, { data: contentItems })
  }

  if (req.method === 'GET' && resource === 'updates') {
    const item = slug ? findBySlug(latestItems, slug) : null
    return slug
      ? sendJson(res, item ? 200 : 404, item ? { data: item } : { message: 'Update not found' })
      : sendJson(res, 200, { data: latestItems })
  }

  if (req.method === 'GET' && resource === 'news') {
    const item = slug ? findBySlug(newsItems, slug) : null
    return slug
      ? sendJson(res, item ? 200 : 404, item ? { data: item } : { message: 'News item not found' })
      : sendJson(res, 200, { data: newsItems })
  }

  if (req.method === 'GET' && resource === 'articles') {
    const item = slug ? findBySlug(articleItems, slug) : null
    return slug
      ? sendJson(res, item ? 200 : 404, item ? { data: item } : { message: 'Article not found' })
      : sendJson(res, 200, { data: articleItems })
  }

  if (req.method === 'GET' && resource === 'certificates') {
    return sendJson(res, 200, { data: certificateImages })
  }

  return sendJson(res, 404, { message: 'API route not found' })
}

async function serveStatic(res, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '')
  let filePath = path.join(publicDir, safePath)

  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
    filePath = path.join(publicDir, 'index.html')
  }

  try {
    const body = await readFile(filePath)
    const type = mimeTypes.get(path.extname(filePath)) || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': type })
    res.end(body)
  } catch {
    sendJson(res, 404, { message: 'Build output not found. Run npm run build first.' })
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)

    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url)
      return
    }

    await serveStatic(res, url.pathname)
  } catch (error) {
    sendJson(res, 500, { message: error instanceof Error ? error.message : 'Server error' })
  }
})

server.listen(port, () => {
  console.log(`Amardco backend listening on http://127.0.0.1:${port}`)
})
