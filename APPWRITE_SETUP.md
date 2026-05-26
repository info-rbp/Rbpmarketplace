# Appwrite Setup Guide

This repository now includes an Appwrite client scaffold, environment typing, and a white-label configuration layer. It does **not** yet replace the existing Cloudflare Worker + D1 backend flows end to end.

## What is already in the repository

- Frontend Appwrite runtime config in `src/config/appwrite.ts`
- Appwrite client helpers in `src/lib/appwrite/client.ts`
- Appwrite auth provider scaffold in `src/app/auth/AppwriteAuthProvider.tsx`
- Frontend environment template in `.env.example`
- Environment validation script in `scripts/check-env.mjs`

## Required frontend environment variables

Copy `.env.example` to `.env` and set:

- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_ENQUIRIES_COLLECTION_ID`
- `VITE_APPWRITE_USERS_COLLECTION_ID`
- `VITE_APPWRITE_STORAGE_BUCKET_ID`
- `VITE_APPWRITE_ADMIN_TEAM_ID`
- `VITE_APPWRITE_WHITE_LABEL_COLLECTION_ID` when white-label branding will be managed from Appwrite

Run:

```bash
npm run check:env:appwrite
```

## Recommended Appwrite data model

### Collections

1. `enquiries`
- public lead capture records
- workflow fields such as `status`, `ownerId`, `notes`, and `source`

2. `users`
- internal user profile metadata that extends the built-in Appwrite auth account
- role, team, tenant, and white-label access metadata

3. `white_labels`
- brand name, initials, product label, support email, logo asset references, domain slug, and theme values

### Storage buckets

1. `brand-assets`
- logos
- favicons
- PDF or brochure assets

## Recommended permissions model

- Public users: create enquiry documents only through approved client or server actions
- Admin team members: read and update enquiries
- White-label admins: read and update only their own tenant records
- Brand assets: read access scoped to the matching tenant or published assets only

## Suggested auth flow

1. Use Appwrite email/password or magic URL for internal users.
2. Use Appwrite teams to represent admin groups or tenant-specific operators.
3. Resolve role and tenant access after session load.
4. Keep Cloudflare-side worker checks only where edge-only logic is still required.

## Current limitation

The live application still uses Cloudflare Worker session auth and D1-backed enquiry storage. Appwrite is scaffolded for the rebuild target, but migration work is still required before Appwrite can become the system of record.
