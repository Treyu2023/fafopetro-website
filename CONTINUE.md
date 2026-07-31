# FAFO Petro website — continue here

**Last saved:** 2026-07-31  
**Owner:** Ryan W. Key / FAFO Petro Services LLC  
**Domain goal:** fafopetro.com (not Google Sites — this is the replacement app)  
**GitHub backup:** https://github.com/Treyu2023/fafopetro-website (private)

## How to pick this back up

1. Open this project in Grok Build / App Builder and say:  
   **“Continue FAFO Petro from CONTINUE.md and the GitHub repo Treyu2023/fafopetro-website”**
2. Or clone the GitHub repo and restore files into the workspace.
3. Run `sh /workspace/startup.sh` (or `npm run dev`) so the live preview is up on port 8080.
4. Do **not** re-scaffold from zero unless the workspace is empty — edit in place.

## What is already built

### Public site (TanStack Start + React + Tailwind)
- Night gas-station UI: canopy glow, fluorescent flicker, asphalt texture
- Brand: FAFO PETRO signage fonts (Bebas/Oswald/Barlow), pump badge (no third-party logo parody)
- Pages: Home, Services, AI Corner, Software, About, Contact, Request Service
- Private admin: `/admin/leads` (access code default `fafopetro-leads` — change via `LEADS_ACCESS_CODE`)

### Services / pricing
- Verifone onboarding: **$100 flat per site**
- Travel: **$65/hr** + **$0.75/mi**, zones step every **55 mi / +1 hour** from Siler City (1787 W 3rd St)
- Road-style zone map (not pure crow-flies circles) + sample route lines
- Multi-site same trip: **travel once**, onboarding × sites
- T&M caveat if work/travel exceeds zone allotment
- “Pricing is available” — map is a guide

### Other services listed
- Dispensers, POS, cable management, ATG, monthly walkthroughs
- Flip/startup testing, advocacy, PA-DSS / anti-theft guidance
- Local backups (Passport + Verifone)
- C-Store Management / C-Site Management (list both names)
- AI integration services
- Wayne electronics newer than Vista II: out of scope
- Experience: **26+ years** only (no “almost 27” wording)

### AI Corner (`/ai`)
- 3D spinning project ring, orbit map, terminal demo, tilt cards
- FAFO Progen, Local Media, Commander tools, site AI story
- “Play next” ideas for future prototypes

### Lead capture
- Form posts to DB table `service_requests` (migration `0002_service_requests.sql`)
- Appends `data/service-requests.jsonl` when filesystem allows
- Export CSV from admin leads page

### Contact (public)
- Phone/text: (972) 877-1848 (text preferred)
- Email: Rkey@FAFOPETRO.com
- Address: 1787 W 3rd St, Siler City, NC 27344

## Explicitly NOT on the public site
- Employer rants / old company drama
- Lawsuit-bait brand parodies
- Sticky notes / Windows files (not accessible from this environment)

## Next ideas (user-driven)
- Road zones more accurate / real routing later
- Google Maps site layouts for NC fuel database
- Wire leads into larger comb/gather software
- More AI gallery wow (photo intake, backup vault UI, etc.)
- Domain DNS point fafopetro.com at this deploy when ready
- Fee sheet / published package rates when Ryan is ready

## Dev notes for the agent
- Stack: Vite 8, TanStack Start, Tailwind v4, port **0.0.0.0:8080**
- `startup.sh` must stay idempotent and start `npm run dev`
- Do not import vendored `vite-tanstack-config` in vite.config (breaks standalone build)
- Gate nitro vercel preset on `command === "build"` only
- Verify with Playwright + `npm run build` before calling done
- Skills: `design-ui` for UI polish

## Access codes / secrets
- Admin leads default code: `fafopetro-leads` (set `LEADS_ACCESS_CODE` in production)
- Never commit real customer lead dumps publicly
