# Amardco Backend

Node.js server for Amardco content APIs and production SPA routing.

## Run

From the backend folder:

```bash
cd backend
npm run dev
```

Backend URL:

```text
http://127.0.0.1:4173
```

## API Routes

- `GET /api/health`
- `GET /api/routes`
- `GET /api/content`
- `GET /api/updates`
- `GET /api/updates/:slug`
- `GET /api/news`
- `GET /api/news/:slug`
- `GET /api/articles`
- `GET /api/articles/:slug`
- `GET /api/certificates`

After `npm run build` is run from the `frontend` folder, public routes are served
from prerendered HTML. Unknown routes use the generated `404.html` with an HTTP
404 status. Duplicate content URLs and trailing-slash variants receive direct
301 redirects to their canonical URL.

## Reverse proxy deployment

The server binds to `127.0.0.1` by default; use `HOST` for a different interface.
Set `TRUST_PROXY=1` only behind a proxy that overwrites `X-Forwarded-Host` and
`X-Forwarded-Proto` and prevents direct public access to Node. These headers are
ignored by default. IIS/ARR must pass the original public hostname and protocol
even when its backend request uses HTTP and a loopback Host header.

Public HTTP and www requests redirect to `https://amardco.com`. Local HTTP does
not send `upgrade-insecure-requests`; HTTPS responses retain that directive and
HSTS for the current host. Known `index.html`, trailing slash and legacy article
URLs redirect to their canonical path. Install a valid public TLS certificate
before enabling the IIS HTTPS redirect.

See [deployment and Search Console instructions](../deploy/SEARCH-CONSOLE.fa.md)
and [IIS configuration example](../deploy/iis/web.config.example).

After the frontend build, run `npm test` to check redirects, proxy handling,
asset MIME types, all sitemap routes, and real 404 responses.
