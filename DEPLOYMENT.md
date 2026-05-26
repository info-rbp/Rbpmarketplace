# Deployment Guide

## Current deployment path

The repository currently deploys as a **Cloudflare Worker + static assets + D1** application. Cloudflare Pages and Appwrite can be layered in later, but they are not the active production runtime in this codebase yet.

## 1. Provision Cloudflare D1

Create a D1 database for production and note the returned `database_id`.

```bash
wrangler d1 create rbpmarketplace
```

Update `wrangler.jsonc` with the production `database_id`. If you use a preview database, add `preview_database_id` to the same binding.

## 2. Apply the database migrations

```bash
npm run db:migrate:remote
```

## 3. Configure runtime values

Set these Worker secrets before deploying:

```bash
wrangler secret put ADMIN_EMAIL
wrangler secret put ADMIN_PASSWORD_HASH
wrangler secret put SESSION_SECRET
wrangler secret put PUBLIC_APP_ORIGIN
```

If you are also preparing the Appwrite rebuild path, copy `.env.example` to `.env` and validate the frontend Appwrite values locally with:

```bash
npm run check:env:appwrite
```

## 4. Generate the admin password hash

Use Node.js to generate a PBKDF2 hash in the format expected by the Worker.

```bash
node - <<'NODE'
const crypto = require('node:crypto');
const password = process.env.ADMIN_PASSWORD;
const salt = crypto.randomUUID();
const iterations = 120000;
const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
console.log(`pbkdf2$${iterations}$${salt}$${hash}`);
NODE
```

## 5. Run quality checks

```bash
npm run check:env
npm run check
```

## 6. Deploy

```bash
npm run deploy
```

## 7. Post-deploy validation

Check these flows on the deployed site:

1. Submit a public enquiry and confirm the record appears in the admin portal.
2. Sign in to the admin portal with the configured credentials.
3. Confirm `/api/health` returns a 200 response.
4. Confirm unknown routes render the custom 404 page.
5. Confirm session cookies are `HttpOnly`, `Secure`, and `SameSite=Strict`.
6. Confirm lint, typecheck, tests, and build all pass in CI.
7. Confirm white-label env overrides render correctly if `.env` branding values are in use.

## 8. Appwrite follow-up for the target rebuild

Before switching the system of record away from Worker + D1, complete these manual steps:

- create the Appwrite project, database, collections, storage bucket, and admin team
- wire the production auth flow to Appwrite instead of the current Worker-only admin login
- migrate enquiry persistence from D1 to Appwrite or define a deliberate split-responsibility model
- move white-label values from static env config to tenant-aware Appwrite content if runtime brand switching is required

## 9. Operational follow-up

- Rotate `SESSION_SECRET` if admin cookie signing credentials ever need to be invalidated.
- Back up or export D1 enquiry data on the cadence your sales or operations team requires.
- If multiple internal users will access the admin portal, move from environment-level credentials to a proper multi-user identity model.
