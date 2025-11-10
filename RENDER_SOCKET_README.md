
# Render Socket Fix Notes

This package was automatically patched to ensure Socket.IO works on Render.
Changes:
- Added `"start": "node ./bin/www"` script in `package.json` so Render starts the correct server.
- Made Socket.IO CORS origins configurable via `CORS_ORIGINS` env var in `bin/www`.
- Ensured the HTTP server logs `Server listening on port: <PORT>` on boot.
- Added Express CORS fallback in `app.js` if it was missing.

## Render Environment
Set env var:
```
CORS_ORIGINS=https://lesociety.com,https://production.lesociety.com,https://<your-preview-domain>,http://localhost:3000
```

## Start
```bash
npm start   # runs node ./bin/www
```
