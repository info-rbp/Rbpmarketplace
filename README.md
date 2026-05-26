# RBP Marketplace

RBP Marketplace is a React + Cloudflare application for showcasing and qualifying Business-In-A-Box opportunities. Visitors can browse the catalogue, compare concepts, complete a fit assessment, and submit secure enquiries. Administrators can sign in to review those enquiries through a server-backed portal.

## Current architecture

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Cloudflare Worker in `server/index.ts`
- Database: Cloudflare D1 with migrations in `migrations/`
- Security: server-side admin authentication, PBKDF2 password hashing, signed `HttpOnly` session cookies, and IP-based rate limiting
- Validation: shared Zod schemas reused by the frontend form and worker API
- Tests: Vitest coverage for catalogue logic, auth/session helpers, and worker API flows

Additional implementation notes live in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure local secrets

Copy `.dev.vars.example` to `.dev.vars` and replace each placeholder value.

Required variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `PUBLIC_APP_ORIGIN`

### 3. Create a local D1 database and apply migrations

```bash
npm run db:migrate:local
```

### 4. Start the frontend-only development server

```bash
npm run dev
```

This serves the React UI only. Public form submissions and admin login require the worker-backed preview below.

### 5. Preview the full worker-backed app

```bash
npm run preview
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

## Deployment

Production deployment uses Cloudflare Workers + D1.

1. Create the D1 database.
2. Replace the placeholder `database_id` in `wrangler.jsonc`.
3. Apply the remote migrations.
4. Set the Worker secrets.
5. Deploy with `npm run deploy`.

Detailed production steps are documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Important operational notes

- The admin portal is no longer backed by browser storage. Enquiries are stored in D1.
- Admin credentials are no longer shipped to the browser. Only the server sees the configured password hash.
- `wrangler.jsonc` intentionally contains a placeholder D1 `database_id`; replace it during environment provisioning.
- Local preview uses a non-`Secure` cookie for `http://localhost` so the admin flow can be tested locally. HTTPS deployments always use `Secure` cookies.
- Catalogue content is still source-controlled. If the business team needs non-developer editing, the next step is a real CMS integration.
