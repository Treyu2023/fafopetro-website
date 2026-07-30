# FAFO Petro Services — website

Public site for **FAFO PETRO SERVICES L.L.C.** (field service, toolbox, creative studio).

Built with TanStack Start (React + Vite) + Tailwind. **Not Google Sites** — Google Sites cannot host this app.

## Local

```bash
npm install
npm run dev      # http://0.0.0.0:8080
npm run build
npm run typecheck
```

## Deploy (recommended: Vercel)

1. Import this repo in [Vercel](https://vercel.com/new)
2. Framework preset: other / Vite — build command `npm run build`
3. Add env vars if using Postgres auth/leads:
   - `DATABASE_URL` (Neon recommended)
   - optional `QUOTE_LEADS_CODE` / `SITES_ADMIN_CODE` (default `FAFO-LEADS`)
4. Attach custom domain **fafopetro.com** (DNS → Vercel)

## Private admin pages (noindex)

| Path | Purpose | Code |
|------|---------|------|
| `/admin-media` | Media slots | FAFO-LEADS |
| `/admin-parts` | Parts price book | FAFO-LEADS |
| `/admin-access` | Tech toolbox grants | FAFO-LEADS |
| `/leads` | Quote leads | FAFO-LEADS |

## Public highlights

- Service call quote calculator ($65/hr, $0.75/mi one-way)
- Field sites registry + progressive surveys
- Account login (toolbox access is approval-gated)
- Creative / gallery / toolbox download pages

## Google Sites

Do **not** paste this into Google Sites. Sites is for simple drag-and-drop pages. This project is a real web app with a database, auth, and admin tools. Point **www.fafopetro.com** at the Vercel deployment instead of (or instead of only) the old Sites page.
