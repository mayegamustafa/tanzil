# Tanzeel Travels — Monorepo

A premium Hajj, Umrah, and Tours platform with a fully dynamic CMS, built as a Turborepo monorepo.

## Structure

```
tanzeel-travels/
├── apps/
│   ├── web/          # Public website (Next.js 14)
│   └── admin/        # Admin dashboard (Next.js 14)
├── packages/
│   └── types/        # Shared TypeScript interfaces
└── backend/          # Laravel 11 REST API
```

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- PHP >= 8.3
- Composer >= 2.7
- Docker + Docker Compose (for local dev)

## Getting Started

```bash
# 1. Install JS dependencies
pnpm install

# 2. Start local services (PostgreSQL, Redis, Mailhog)
docker compose up -d

# 3. Set up backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed

# 4. Start all apps
cd ..
pnpm dev
```

## Apps

| App | Port | Description |
|-----|------|-------------|
| web | 3000 | Public website |
| admin | 3001 | Admin dashboard |
| API | 8000 | Laravel backend |
| Mailhog | 8025 | Email testing UI |

## Environment Variables

Each app has its own `.env.local` (Next.js) or `.env` (Laravel).
See `.env.example` files in each directory.
