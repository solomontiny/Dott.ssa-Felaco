# PRD - Dott.ssa Felaco Nutrition & Wellness Website

## Original Problem Statement
Create a pixel-perfect clone of the "Dott.ssa Felaco" Lovable preview. The application is a multilingual (Italian, English, French, Spanish) nutrition and wellness consulting website with:
- Floating WhatsApp widget and appointment booking system
- Professional, SEO-optimized "What We Do" and "Free Consultation" sections
- Q&A section and clean, minimalist owner profile section
- Primary color theme: specific shades of blue
- Secure, admin-only article/blog management system restricted to `dott.giuseppinafelaco@gmail.com` with full CRUD and image upload capabilities

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn/UI, react-router-dom v7, react-i18next, axios
- **Backend**: FastAPI, Motor (async MongoDB), PyJWT, bcrypt
- **Database**: MongoDB
- **Auth**: JWT Bearer tokens, bcrypt password hashing, admin seeding on startup

## Core Requirements
1. Multilingual support (IT default, EN, FR, ES)
2. Sections: Hero, About, Services/WhatWeDo, Q&A, Consultation Form, Testimonials, Blog, Appointment Booking, Contact, Footer
3. WhatsApp widget (+39 3450503440)
4. Admin article management (CRUD + image upload)
5. Blue color theme throughout

## What's Been Implemented

### Completed (Session 1 - Previous Agent)
- Multilingual i18n setup (IT, EN, FR, ES)
- Hero, What We Do, About, Philosophy, Q&A, Testimonials, Contact sections
- Image updates and owner profile
- Contact info: +39 3450503440, dott.giuseppinafelaco@gmail.com
- WhatsApp widget
- Color scheme migration from Teal to Blue
- Kubernetes health endpoints (/health, /api/health)
- Initial backend auth file structure

### Completed (Session 2 - March 30, 2026)
- **Admin Auth System**: Password-based login with bcrypt + JWT (replaced insecure email-only magic link)
- **Admin Seed Script**: Auto-seeds admin user on startup (dott.giuseppinafelaco@gmail.com)
- **React Router Configuration**: Routes for /, /admin/login, /admin/dashboard with redirects
- **Admin Login Page**: Email + password form with error handling
- **Admin Dashboard**: Full CRUD for articles (create, edit, delete, publish/unpublish toggle)
- **Image Upload**: Backend endpoint for admin image uploads
- **Blog Section Integration**: Public blog section on homepage fetching real articles from API with static fallback
- **MongoDB _id Exclusion**: All article queries properly exclude _id field
- **Data-testid Attributes**: Added to all interactive admin elements
- **Testing**: 100% pass rate (17/17 backend, all frontend flows)

## Architecture
```
/app
├── frontend/
│   ├── src/
│   │   ├── components/ (Hero, About, Blog, QA, Services, etc.)
│   │   ├── pages/ (AdminLogin.jsx, AdminDashboard.jsx)
│   │   ├── i18n/ (locales: en, it, fr, es)
│   │   ├── App.js (Router config)
│   │   └── index.js
│   └── .env
├── backend/
│   ├── server.py (FastAPI routes + admin seed)
│   ├── auth.py (JWT + bcrypt auth)
│   ├── models.py (Pydantic models)
│   ├── utils.py (Slug helper)
│   ├── uploads/ (Article images)
│   └── .env
└── memory/
    ├── PRD.md
    └── test_credentials.md
```

## API Endpoints
- GET /health, GET /api/health (Kubernetes probes)
- POST /api/admin/login (email + password -> JWT)
- GET /api/admin/verify (token validation)
- GET/POST /api/admin/articles (admin CRUD)
- PUT/DELETE /api/admin/articles/{id}
- POST /api/admin/upload-image
- GET /api/articles (public, published only)
- GET /api/articles/{slug}
- POST /api/consultation, /api/appointment

## Backlog (P1/P2)
- P1: Connect Appointment/Consultation forms to send actual emails (currently logged only)
- P2: SEO metadata optimization
- P2: Additional content/copy refinements
