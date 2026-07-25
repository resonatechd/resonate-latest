# Resonate.Dubai LLC — Product Requirements Document

## Overview
Professional SPA for Resonate.Dubai LLC — UAE-registered business consultancy (trade license valid till March 2027, founded by Mr. Khanna).

## Architecture
- Backend: FastAPI + MongoDB (motor). Endpoints under /api. JWT auth for admin.
- Frontend: React + CRA + shadcn/ui + Tailwind. Cormorant Garamond + Manrope fonts.
- Storage: Emergent object storage (videos, passport uploads, update media).

## User Personas
- Prospect (India-based) exploring UAE visa/job/business options.
- UAE-based SME owner needing trade license, PRO, corporate tax.
- Admin (Mr. Khanna's team) publishing updates and managing vacancies.

## Core Requirements (static)
- Company info, services, taxi visa specialty, team, clients+partners.
- 5-step counselling survey (replaces contact form).
- Admin dashboard for submissions, updates, vacancies.
- Static Google-style reviews.

## Implemented (2026-07-25)
### v1 (initial)
- Site sections: Hero, About, 7 services, Sharjah Taxi Visa, Why Choose Us, Process, Industries, DynamicUpdates, Team (4 dummy), Reviews (6), FAQ, 5-step survey, Footer.
- Admin: JWT login, submissions table, updates CRUD with file upload.
- Object storage integration for updates media.

### v2 (2026-07-25)
- Services reduced to 5 (per user).
- Team → 5 real members with photos (Khanna, Sobti, Yasmeen, Rehman, Bhati). Sobti uses initials fallback.
- New ClientsPartners section: 8 clients (round logos + one-liner review) + 7 partner chips.
- Reviews updated to 8 curated (Virat, Kamal, Sobti, Aman, Shetij, Balwinder, Neha & Rajesh, Priya).
- Address updated to "Compass Co-Working Space, Al Jazeera Al Hamra Industry, Ras Al Khaimah, UAE".
- Survey redesigned: Name+Age+Phone+Email → State → Passport y/n + upload → Intent → Education+experience+industry+vacancy.
- Vacancies CRUD (admin) + public /api/vacancies feeds the survey vacancy dropdown.
- Admin submissions detail dialog.
- Passport upload via /api/survey/upload (public, multipart).
- Fixed: empty email 422; passport file serving via /api/files/.

## Backlog (P1)
- Email notification on new survey submission (Resend integration).
- Reviews CRUD in admin (currently hardcoded in backend).
- Multi-language (Arabic).
- Client PNG logos to be dropped in /app/frontend/public/clients/.

## Backlog (P2)
- Sitemap & SEO metadata (currently default title).
- Actual live Google reviews via Places API.
- Analytics.
