# Deployment Guide

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
```

Set the public application origin as a Worker variable or secret for the deployed domain, for example:

```bash
wrangler secret put PUBLIC_APP_ORIGIN
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

## 8. Operational follow-up

- Rotate `SESSION_SECRET` if admin cookie signing credentials ever need to be invalidated.
- Back up or export D1 enquiry data on the cadence your sales or operations team requires.
- If multiple internal users will access the admin portal, move from environment-level credentials to a proper multi-user identity model.
