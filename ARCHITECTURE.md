# Architecture Notes

## Frontend

- React + Vite single-page application
- React Router for client routing
- Tailwind CSS for styling
- Static catalogue content currently stored in source-controlled data files
- Shared Zod contracts keep form validation consistent between the browser and the worker API
- White-label branding defaults live in `src/config/brand.ts` and can be overridden with frontend env values
- `AppProviders` is now the shared provider shell for frontend runtime integrations, including Appwrite session scaffolding

## Backend

- Cloudflare Worker serves both static assets and the JSON API
- `/api/enquiries` stores validated enquiry submissions in Cloudflare D1
- `/api/admin/*` provides server-side login, session inspection, logout, and enquiry retrieval
- Worker entrypoint uses deploy-safe relative imports so build behavior does not depend on path alias support outside the frontend toolchain

## Security model

- Admin credentials are checked on the server only
- Passwords are stored as PBKDF2 hashes in Worker secrets
- Admin sessions are signed with `SESSION_SECRET` and stored in `HttpOnly` cookies
- Production cookies are `Secure` and `SameSite=Strict`; localhost preview relaxes that only enough to support local testing
- Public form submissions are rate limited by hashed client IP
- The Worker adds secure default response headers to both API and asset responses
- `/admin` is protected by a reusable route gate before the portal view renders

## Data model

### `enquiries`
- durable lead storage
- status tracking for future workflow expansion
- timestamped records for follow-up and reporting

### `rate_limits`
- per-window counters for login and public form abuse protection

## Appwrite scaffold status

- Frontend runtime configuration exists in `src/config/appwrite.ts`
- A reusable Appwrite client helper exists in `src/lib/appwrite/client.ts`
- `AppwriteAuthProvider` can load the current Appwrite account session when the required frontend env values are set
- The current production system of record is still Cloudflare Worker + D1, not Appwrite

## Validation and quality gates

- ESLint covers the frontend and worker TypeScript code paths
- Vitest covers catalogue logic, auth/session helpers, and core worker API flows
- GitHub Actions runs lint, typecheck, tests, and build on pushes and pull requests
- `scripts/check-env.mjs` validates Worker secrets and Appwrite/frontend runtime configuration

## Remaining architectural considerations

- Catalogue content is still source-controlled rather than CMS-driven
- Admin users are currently environment-configured rather than Appwrite- or database-managed
- White-label values are env-driven today; tenant-driven runtime branding still needs an Appwrite-backed model
- Cloudflare Pages is not yet configured as the primary runtime path for the rebuild
- The app is deployable on the current Worker + D1 architecture once Cloudflare resources and runtime secrets are provisioned for the target environment
