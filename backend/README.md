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

After `npm run build` is run from the `frontend` folder, all non-API routes fall back to `frontend/dist/index.html`, so React routes like `/updates/:slug`, `/news/:slug`, `/articles/:slug`, and `/certificates` work from the server.
