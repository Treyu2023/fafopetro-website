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

## Deploy

**Source of truth:** this repo (`main`). Vercel project: `fafopetro-web`.  
Vercel’s Git integration is the only deploy path. Environment variable names and setup steps are in [DEPLOY.md](DEPLOY.md). Do not commit secret values.

Current download hub: Ultimate Tab **6.4.102**, Local Media **7.3.1**, Power Toolbox **3.5.06**.

| Setting | Value |
|---------|--------|
| Framework | TanStack Start (`vercel.json`) |
| Install | `npm ci` |
| Build | `npm run build` (`vite build` + database migrate) |
| Output | Nitro writes `.vercel/output` (leave Output Directory empty) |
| Node | 20+ |

`fafopetro.com` redirects to `https://www.fafopetro.com` from `vercel.json`. DNS stays in the Vercel project.

## Public highlights

- Service call quote calculator ($65/hr, $0.75/mi one-way)
- Field sites registry + progressive surveys
- Account login (toolbox access is approval-gated)
- Creative / gallery / toolbox download pages

## Google Sites

Do **not** paste this into Google Sites. Sites is for simple drag-and-drop pages. This project is a real web app with a database, auth, and admin tools. Point **www.fafopetro.com** at the Vercel deployment instead of (or instead of only) the old Sites page.
