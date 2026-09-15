import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { request } from 'node:http'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

async function startServer(t, trustProxy) {
  const child = spawn(process.execPath, [fileURLToPath(new URL('../server.mjs', import.meta.url))], {
    env: { ...process.env, PORT: '0', HOST: '127.0.0.1', TRUST_PROXY: trustProxy ? '1' : '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  })
  t.after(async () => {
    if (child.exitCode === null) {
      const exited = once(child, 'exit')
      child.kill()
      await exited
    }
  })
  const port = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server startup timed out')), 10000)
    let output = ''
    child.stdout.on('data', data => {
      output += data
      const match = output.match(/127\.0\.0\.1:(\d+)/)
      if (match) { clearTimeout(timeout); resolve(Number(match[1])) }
    })
    child.once('error', error => { clearTimeout(timeout); reject(error) })
    child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Server exited: ${code}`)) })
  })
  return (pathname, headers = {}, method = 'GET') => new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port, path: pathname, headers, method }, res => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }))
    })
    req.setTimeout(10000, () => req.destroy(new Error('Request timed out')))
    req.on('error', reject)
    req.end()
  })
}

test('production discovery, assets and proxy redirects', async t => {
  const get = await startServer(t, true)
  const secure = { 'x-forwarded-host': 'amardco.com', 'x-forwarded-proto': 'https' }

  await t.test('HTTP stays usable locally without forced HTTPS asset upgrades', async () => {
    const home = await get('/')
    assert.equal(home.status, 200)
    assert.ok(!home.headers['content-security-policy'].includes('upgrade-insecure-requests'))
    assert.equal(home.headers['strict-transport-security'], undefined)
    const css = home.body.match(/href="([^\"]+\.css)"/)[1]
    const js = home.body.match(/<script[^>]+src="([^\"]+\.js)"/)[1]
    for (const [asset, type] of [[css, 'text/css'], [js, 'text/javascript'], ['/fonts/vazirmatn-arabic.woff2', 'font/woff2']]) {
      const result = await get(asset)
      assert.equal(result.status, 200, asset)
      assert.ok(result.headers['content-type'].startsWith(type), asset)
    }
  })

  await t.test('public HTTP and www redirect to canonical HTTPS in one hop', async () => {
    for (const headers of [
      { host: 'amardco.com' },
      { 'x-forwarded-host': 'amardco.com', 'x-forwarded-proto': 'http' },
      { 'x-forwarded-host': 'www.amardco.com', 'x-forwarded-proto': 'https' },
    ]) {
      const result = await get('/products/index.html?source=test', headers)
      assert.equal(result.status, 301)
      assert.equal(result.headers.location, 'https://amardco.com/products?source=test')
    }
  })

  await t.test('HTTPS is served without loops and aliases redirect', async () => {
    const home = await get('/', secure)
    assert.equal(home.status, 200)
    assert.ok(home.headers['content-security-policy'].includes('upgrade-insecure-requests'))
    assert.ok(home.headers['strict-transport-security'])
    for (const [source, target] of [
      ['/index.html', '/'], ['/about/', '/about'], ['/about/index.html', '/about'],
      ['/updates/citizen-participation-in-smart-city/', '/articles/citizen-participation-in-smart-city'],
    ]) {
      const result = await get(source, secure)
      assert.equal(result.status, 301, source)
      assert.equal(result.headers.location, `https://amardco.com${target}`)
    }
  })

  await t.test('all sitemap URLs serve indexable HTML and unknown routes return 404', async () => {
    const robots = await get('/robots.txt', secure)
    assert.equal(robots.status, 200)
    assert.ok(robots.body.includes('Sitemap: https://amardco.com/sitemap.xml'))
    const sitemap = await get('/sitemap.xml', secure)
    assert.equal(sitemap.status, 200)
    assert.ok(sitemap.headers['content-type'].startsWith('application/xml'))
    const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
    assert.ok(urls.length > 20)
    for (const url of urls) {
      const result = await get(new URL(url).pathname, secure)
      assert.equal(result.status, 200, url)
      assert.ok(result.body.includes(`rel="canonical" href="${url}"`), url)
      assert.ok(!/<meta name="robots" content="noindex/.test(result.body), url)
    }
    for (const pathname of ['/not-a-real-page', '/products/not-a-product', '/assets/missing.css']) {
      assert.equal((await get(pathname, secure)).status, 404, pathname)
    }
    assert.equal((await get('/about', secure, 'HEAD')).body, '')
  })
})

test('forwarded headers are ignored unless proxy trust is enabled', async t => {
  const get = await startServer(t, false)
  const response = await get('/', { host: 'amardco.com', 'x-forwarded-proto': 'https' })
  assert.equal(response.status, 301)
  assert.equal(response.headers.location, 'https://amardco.com/')
})
