# Advance Group

Production frontend + Cloudflare Worker for Advance Group.

# Advance Group
A static marketing site (property report form + quote request form) served
by a Cloudflare Worker, with a stub `/api/property-report` API endpoint.

**Current status:** frontend is live. The property report and quote request
forms are UI-only — no data is sent anywhere yet (quote form logs to
console; property report returns hardcoded placeholder data). Real API
integration is future work — see comments in `app.js`.

# Advance Group
- Vanilla HTML/CSS/JS frontend (`index.html`, `app.js`, `style.css`)
- Cloudflare Worker (`worker.js`) serving static assets + one API route
- Deployed via Cloudflare Workers (`wrangler.jsonc`)

# Advance Group
```bash
npx wrangler dev
```

# Advance Group
None required today. If/when external APIs are added, required variables
will be documented in `.env.example` and set as Cloudflare secrets — never
committed to this repo.

# Advance Group
Deployed to Cloudflare Workers. **Note:** as of Aug 2026, deployment access
is not yet transferred to the project owner — see internal notes.

# Advance Group
- `main` is protected — no direct pushes.
- Branch naming: `feature/...`, `fix/...`, `chore/...`
- Open a PR into `main`; CI must pass before merge.

# Advance Group
See `CONTRIBUTING.md`.

_Last verified: 2026-08-19_
