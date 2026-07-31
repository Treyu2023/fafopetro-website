import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { SignHeading } from "@/components/BrandMark";
import { OrbitSkills } from "@/components/ai/OrbitSkills";
import { SpinGallery } from "@/components/ai/SpinGallery";
import { TerminalDemo } from "@/components/ai/TerminalDemo";
import { TiltGrid } from "@/components/ai/TiltGrid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ai")({
  component: AiShowcasePage,
  head: () => ({
    meta: [
      {
        title: "AI Corner | FAFO Petro — Tools, demos & field AI",
      },
      {
        name: "description",
        content:
          "FAFO Petro AI showcase: spinning project gallery, FAFO Progen, Local Media, Commander utilities, and AI integration for C-stores.",
      },
    ],
  }),
});

const tiltCards = [
  {
    badge: "Prompt engineering",
    title: "FAFO Progen",
    body: "A precision prompt console for image/video generators — modular sections, density control, surgical rerolls. Built for people who treat prompts like work product.",
  },
  {
    badge: "Media · local-first",
    title: "FAFO Local Media",
    body: "New Tab media center: local photos & video, playlists, cinema layouts, particle VFX. Your files stay on your machine.",
  },
  {
    badge: "Field software",
    title: "Commander-side utilities",
    body: "Custom tooling experience around Verifone Commander — price book drill-down, virtual/physical port status, backup pulls. Built because the truck needed it.",
  },
  {
    badge: "Site services",
    title: "AI integration assist",
    body: "Structure reports, reconciliation workflows, and complex multi-step tasks. When AI doesn’t know the answer, we still chase the answer.",
  },
  {
    badge: "Back office",
    title: "C-Store / C-Site Management",
    body: "Guidance setting up Verifone C-Store Management / C-Site Management — better when the site owns passwords and email, or we mock and hand off.",
  },
  {
    badge: "Ops brain",
    title: "Why this sells service",
    body: "Same person who wrenches dispensers can also automate the busywork. Tech savvy on the site and on the laptop — that’s the FAFO difference.",
  },
];

function AiShowcasePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-primary/10 grid-bg py-14 md:py-20">
        <div
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "color-mix(in oklab, var(--color-fluoro) 30%, transparent)" }}
        />
        <div className="container-site relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-condensed font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI Corner
          </div>
          <SignHeading as="h1" accent="Nerd lab · customer-ready">
            Built to show what “tech savvy” looks like
          </SignHeading>
          <p className="mt-4 text-muted leading-relaxed">
            Not a slide deck. Interactive galleries, live demos, and real tools —
            so stores see that FAFO Petro is as comfortable in software as under
            a canopy. That confidence is part of why people hire us.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="font-condensed uppercase tracking-wider">
              <Link to="/services">
                AI site services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="font-condensed uppercase tracking-wider">
              <Link to="/software">Chrome tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3D spin gallery */}
      <section className="border-b border-primary/10 py-14 md:py-16">
        <div className="container-site">
          <div className="mb-6 max-w-2xl">
            <SignHeading accent="Gallery · 3D">Spin the project ring</SignHeading>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Improved carousel energy — cards orbit in 3D. Hover pauses so you can
              read. This is the “wow the counter” moment.
            </p>
          </div>
          <SpinGallery />
        </div>
      </section>

      {/* Orbit + terminal */}
      <section className="border-b border-primary/10 py-14 md:py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SignHeading accent="Capability map">What orbits the work</SignHeading>
            <p className="mt-3 text-muted leading-relaxed">
              Prompt systems, Commander utilities, backups, reconciliation
              structure, PA-DSS habits — AI is the multiplier, field judgment is
              the core.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-primary">▸</span>
                Structure messy site data into reports people can act on
              </li>
              <li className="flex gap-2">
                <span className="text-primary">▸</span>
                Assist complex multi-step tasks without replacing your decisions
              </li>
              <li className="flex gap-2">
                <span className="text-primary">▸</span>
                Ship custom tools when the stock software leaves a gap
              </li>
            </ul>
          </div>
          <OrbitSkills />
        </div>
      </section>

      <section className="border-b border-primary/10 py-14 md:py-16">
        <div className="container-site grid items-start gap-8 lg:grid-cols-2">
          <div>
            <SignHeading accent="Live demo">Field-assist terminal</SignHeading>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              A looping demo of how AI can accelerate intake and reporting. It’s
              theater with a point: faster busywork, clearer next steps, human
              still owns the call.
            </p>
            <p className="mt-4 text-xs text-subtle">
              Want a real workflow wired to your store data later? That’s a
              conversation — text or request form.
            </p>
          </div>
          <TerminalDemo />
        </div>
      </section>

      {/* Tilt cards */}
      <section className="border-b border-primary/10 py-14 md:py-16">
        <div className="container-site">
          <div className="mb-8 max-w-2xl">
            <SignHeading accent="Deep dive">Projects & offers</SignHeading>
            <p className="mt-3 text-sm text-muted">
              Mouse over cards for a 3D tilt. Same story as the ring — more room
              to read.
            </p>
          </div>
          <TiltGrid cards={tiltCards} />
        </div>
      </section>

      {/* Ideas playground */}
      <section className="border-b border-primary/10 py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <SignHeading accent="Play next">Ideas we can build with you</SignHeading>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Site scoreboard", "Live lane-up / POS health tiles for multi-store owners."],
              ["Backup vault UI", "Visual “last good backup” for Passport & Verifone."],
              ["Zone quote embed", "Drop the travel map on a partner page."],
              ["Photo intake", "Text a pump photo → structured ticket for the truck."],
              ["Price-book explorer", "Safer drill-down UI over Commander-style data."],
              ["Training carousels", "3D how-to decks for new hires at the register."],
            ].map(([t, b]) => (
              <div key={t} className="lit-panel rounded-[var(--radius-lg)] p-4">
                <p className="relative z-[1] font-display font-semibold">{t}</p>
                <p className="relative z-[1] mt-1 text-sm text-muted">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted">
            Pick one that would wow your customers — we’ll prototype it here.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-sign text-2xl uppercase tracking-wide sign-outline">
              Hire the nerd with the wrench
            </h2>
            <p className="mt-1 text-sm text-muted max-w-lg">
              AI corner proves capability. Services keep sites online. Together
              they sell FAFO Petro.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="font-condensed uppercase tracking-wider">
              <a
                href="https://chromewebstore.google.com/detail/fafo-progen/epmbhjnfllakabbmoblbjbpjlimlaijl"
                target="_blank"
                rel="noreferrer"
              >
                FAFO Progen
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="secondary" className="font-condensed uppercase tracking-wider">
              <Link to="/request">Request service</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
