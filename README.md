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

**Source of truth:** this repo (`main`). Project name: `fafopetro-web`.  
**Production alias (until DNS cutover):** https://fafopetro-web.vercel.app  
**Keep Google Sites on fafopetro.com until this URL shows the real app (not Vercel `NOT_FOUND`).**

### Zero-config contract

| Setting | Value |
|---------|--------|
| Framework | **TanStack Start** (`vercel.json` → `"framework": "tanstack-start"`) |
| Install | `npm ci` |
| Build | `npm run build` (`vite build` + optional migrate) |
| Output | Nitro writes `.vercel/output` (do **not** set a static Output Directory) |
| Node | 20+ |

Nitro is enabled **only on `vite build`** (`preset: "vercel"` in `vite.config.ts`). Local `npm run build` must produce `.vercel/output/functions/__server.func` + `static/`.

### Fix production `NOT_FOUND` (platform 404)

If https://fafopetro-web.vercel.app returns Vercel’s gray **NOT_FOUND** page (not the FAFO UI):

1. **Deployment Protection** → Production: **Off** (or Only Preview). SSO protection can look like a dead alias depending on client.
2. **Settings → Build & Development**
   - Framework Preset: **TanStack Start** (not Other / Vite / Next)
   - Clear any custom **Output Directory** (must be empty — Nitro owns `.vercel/output`)
   - Build Command: `npm run build` (or leave default once framework is correct)
3. **Deployments** → open latest Production → confirm **Ready** and that **Building** logs include Nitro / `.vercel/output`
4. **Redeploy** with **Clear cache and redeploy**
5. Open the **deployment URL** (unique `*.vercel.app` hash URL), then the production alias
6. If still 404: project may be linked to the wrong repo/branch — reconnect to `Treyu2023/fafopetro-website` / `main`

### Env vars (optional until auth/leads need Postgres)

- `DATABASE_URL` — Neon Postgres (BetterAuth + leads). Without it, PGLite fallback is used at runtime; migrate step no-ops on build.
- `QUOTE_LEADS_CODE` / `SITES_ADMIN_CODE` — default `FAFO-LEADS`
- Never put secrets in `VITE_*` vars

### Custom domain (only after alias works)

1. Confirm https://fafopetro-web.vercel.app loads the real site
2. Vercel → Domains → add `fafopetro.com` and `www.fafopetro.com`
3. Point DNS at Vercel (A/CNAME as shown in dashboard)
4. Retire or redirect the old Google Sites property when ready

### Local verify before deploy

```bash
npm ci
npm run build
# expect: .vercel/output/config.json + functions/__server.func + static/
npx vite preview   # optional smoke
```

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
