# Dott.ssa Felaco Admin Dashboard

This repository includes a React frontend and a FastAPI backend for the Dott.ssa Felaco website.

## Environment

- `backend/.env.example` shows backend variables such as `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
- `frontend/.env.example` shows frontend variables such as `REACT_APP_BACKEND_URL`.

## Admin account

The backend seeds an administrator account on startup using environment variables when available.
If no admin environment variables are provided, the backend will create a local admin account with:

- Email: `sojirin.solomon@yahoo.com`
- Password: `Admin123`

The frontend admin login page now uses secure backend authentication and stores only a bearer token in `localStorage`.
