# Advance Paint — advance-paint-v2

Production frontend + Cloudflare Worker for Advance Paint.

## What this is
A static marketing site (property report form + quote request form) served
by a Cloudflare Worker, with a stub `/api/property-report` API endpoint.

**Current status:** frontend is live. The property report and quote request
forms are UI-only — no data is sent anywhere yet (quote form logs to
console; property report returns hardcoded placeholder data). Real API
integration is future work — see comments in `app.js`.

## Stack
- Vanilla HTML/CSS/JS frontend (`index.html`, `app.js`, `style.css`)
- Cloudflare Worker (`worker.js`) serving static assets + one API route
- Deployed via Cloudflare Workers (`wrangler.jsonc`)

## Run locally
```bash
npx wrangler dev
```

## Environment variables
None required today. If/when external APIs are added, required variables
will be documented in `.env.example` and set as Cloudflare secrets — never
committed to this repo.

## Deployment
Deployed to Cloudflare Workers. **Note:** as of Aug 2026, deployment access
is not yet transferred to the project owner — see internal notes.

## Git workflow
- `main` is protected — no direct pushes.
- Branch naming: `feature/...`, `fix/...`, `chore/...`
- Open a PR into `main`; CI must pass before merge.

## Contributing
See `CONTRIBUTING.md`.
