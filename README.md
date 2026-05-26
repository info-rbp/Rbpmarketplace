# RBP Marketplace

RBP Marketplace is a React + Cloudflare application for showcasing and qualifying Business-In-A-Box opportunities. Visitors can browse the catalogue, compare concepts, complete a fit assessment, and submit secure enquiries. Administrators can sign in to review those enquiries through a server-backed portal.

## Current architecture

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Cloudflare Worker in `server/index.ts`
- Database: Cloudflare D1 with migrations in `migrations/`
- Security: server-side admin authentication, PBKDF2 password hashing, signed `HttpOnly` session cookies, and IP-based rate limiting
- Validation: shared Zod schemas reused by the frontend form and worker API
- White-label scaffold: frontend branding values now come from `src/config/brand.ts` and `.env` overrides
- Appwrite scaffold: runtime config, client helpers, and an auth provider shell are present for the intended rebuild target
- Tests: Vitest coverage for catalogue logic, auth/session helpers, and worker API flows

Additional implementation notes live in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Current state versus target rebuild

This repository is **not yet a full Appwrite + Cloudflare rebuild**. It still runs live enquiry capture and admin authentication through the Cloudflare Worker + D1 backend. The Appwrite pieces added here are scaffolding for the intended architecture, not a completed migration.

Use [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for the Appwrite-specific configuration and migration target.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure local secrets and frontend env

Copy `.dev.vars.example` to `.dev.vars` and replace each placeholder value.

Required worker variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `PUBLIC_APP_ORIGIN`

Copy `.env.example` to `.env` when you need white-label overrides or Appwrite configuration.

### 3. Validate environment configuration

```bash
npm run check:env
npm run check:env:worker
npm run check:env:appwrite
```

`npm run check:env:appwrite` will warn instead of failing when Appwrite has not been configured yet.

### 4. Create a local D1 database and apply migrations

```bash
npm run db:migrate:local
```

### 5. Start the frontend-only development server

```bash
npm run dev
```

This serves the React UI only. Public form submissions and admin login require the worker-backed preview below.

### 6. Preview the full worker-backed app

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

Production deployment currently uses Cloudflare Workers + D1.

1. Create the D1 database.
2. Replace the placeholder `database_id` in `wrangler.jsonc`.
3. Apply the remote migrations.
4. Set the Worker secrets.
5. Deploy with `npm run deploy`.

Detailed production steps are documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Important operational notes

- The admin portal is backed by D1, not browser storage.
- Admin credentials are not shipped to the browser. Only the server sees the configured password hash.
- `wrangler.jsonc` intentionally contains a placeholder D1 `database_id`; replace it during environment provisioning.
- Local preview uses a non-`Secure` cookie for `http://localhost` so the admin flow can be tested locally. HTTPS deployments always use `Secure` cookies.
- Catalogue content is still source-controlled. If the business team needs non-developer editing, the next step is a real CMS or Appwrite-driven content model.
- Cloudflare Pages deployment is not yet configured as the primary runtime. The current production path is Worker + assets.
