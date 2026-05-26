# Architecture Notes

## Frontend

- React + Vite single-page application
- React Router for client routing
- Tailwind CSS for styling
- Static catalogue content currently stored in source-controlled data files

## Backend

- Cloudflare Worker serves both static assets and the JSON API
- `/api/enquiries` stores validated enquiry submissions in Cloudflare D1
- `/api/admin/*` provides server-side login, session inspection, logout, and enquiry retrieval

## Security model

- Admin credentials are checked on the server only
- Passwords are stored as PBKDF2 hashes in Worker secrets
- Admin sessions are signed with `SESSION_SECRET` and stored in `HttpOnly` cookies
- Public form submissions are rate limited by hashed client IP
- The Worker adds secure default response headers to both API and asset responses

## Data model

### `enquiries`
- durable lead storage
- status tracking for future workflow expansion
- timestamped records for follow-up and reporting

### `rate_limits`
- per-window counters for login and public form abuse protection

## Remaining architectural considerations

- Catalogue content is still source-controlled rather than CMS-driven
- Admin users are currently environment-configured rather than database-managed
- The app is ready for operational deployment once Cloudflare resources and secrets are provisioned
