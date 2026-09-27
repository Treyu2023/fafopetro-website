# Deploy FAFO Petro on Vercel

Production deploys from `main` through the Vercel Git integration for project `fafopetro-web`. Do not add a second GitHub Actions deploy.

Set these in the Vercel project environment (Production, and Preview if you use preview URLs). Names only — never commit values.

## Required

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string. The build migrator and the running app both refuse to start on Vercel without it. Local dev still uses embedded Postgres when this is unset. |
| `BETTER_AUTH_SECRET` | Long random secret for session cookies. Required on Vercel. |
| `BETTER_AUTH_URL` | Canonical public origin, including `https://` and no trailing path. Sign-in trusts this origin. |

## Origins

| Name | Purpose |
| --- | --- |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Optional comma-separated extra origins that may sign in, besides `BETTER_AUTH_URL`. Include every host that serves the site (the `vercel.app` alias and `https://www.fafopetro.com`). Spaces around commas are ignored. |

`fafopetro.com` redirects to `https://www.fafopetro.com` in `vercel.json`. DNS for those names is configured in Vercel by the owner; this repo does not change DNS.

## Private tools

These stay locked until the variable is set. There is no default code in the repo.

| Name | Purpose |
| --- | --- |
| `QUOTE_LEADS_CODE` | Quote lead log. |
| `SITES_ADMIN_CODE` | Sites review, parts, media slots, and toolbox grants. If unset, `QUOTE_LEADS_CODE` is accepted for those tools. |
| `SUMRAN_ACCESS_CODE` | Partner vault. |
| `FAFO_ADMIN_EMAILS` | Optional comma-separated emails that become toolbox admins on first sign-up. If unset, nobody is promoted automatically. |

## Optional broker sign-in

Email and password work without these. Google and X buttons stay hidden until both client variables are set.

| Name | Purpose |
| --- | --- |
| `GROK_AUTH_CLIENT_ID` | Per-app broker client id. |
| `GROK_AUTH_CLIENT_SECRET` | Per-app broker client secret. |
| `GROK_AUTH_ISSUER` | Broker issuer. Defaults to the shared broker only when the client id and secret are set. |

Do not put secrets in `VITE_*` variables. `VITE_AUTH_ENABLED=false` turns sign-in off.

## Setup

1. Create the Neon database and set `DATABASE_URL`.
2. Set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `BETTER_AUTH_TRUSTED_ORIGINS` for every origin that should accept sign-in.
3. Set the private-tool codes you actually want to use.
4. Push to `main`. Vercel runs `npm run build` (`vite build` and `npm run db:migrate`).
5. Confirm the deployment is Ready, then sign up with email on the `vercel.app` origin before pointing the custom domain at it.
