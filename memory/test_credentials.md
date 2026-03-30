# Test Credentials

## Admin Account
- **Email:** dott.giuseppinafelaco@gmail.com
- **Password:** FelacAdmin2026!
- **Role:** admin

## Auth Endpoints
- POST /api/admin/login (email + password)
- GET /api/admin/verify (Bearer token)
- GET /api/admin/articles (Bearer token, admin only)
- POST /api/admin/articles (Bearer token, admin only)
- PUT /api/admin/articles/{id} (Bearer token, admin only)
- DELETE /api/admin/articles/{id} (Bearer token, admin only)

## Public Endpoints
- GET /api/articles (published articles)
- GET /api/articles/{slug} (single article by slug)
- GET /api/health

## Frontend Routes
- / (main website)
- /admin or /admin/login (admin login page)
- /admin/dashboard (admin dashboard, requires token)
