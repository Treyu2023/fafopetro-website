import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Cable,
  CalendarCheck,
  CircuitBoard,
  ClipboardCheck,
  Eye,
  Fuel,
  Gauge,
  HardHat,
  Phone,
  Rocket,
  ShieldCheck,
  HardDrive,
  Wrench,
} from "lucide-react";
import { SignHeading } from "@/components/BrandMark";
import { TravelZoneMap } from "@/components/TravelZoneMap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TRAVEL_RATES, formatUsd } from "@/lib/travel-zones";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      {
        title: "Services | FAFO Petro — Verifone, POS, Dispenser, ATG & More",
      },
      {
        name: "description",
        content:
          "Verifone onboarding with road-style travel zones, multi-site trip pricing, Passport & Verifone backups, POS, dispensers, ATG — Siler City, NC Triad.",
      },
    ],
  }),
});

const offerings = [
  {
    icon: CircuitBoard,
    title: "Verifone onboarding",
    blurb: "Flat per site + travel once per trip. Pricing available.",
    points: [
      `${formatUsd(TRAVEL_RATES.verifoneOnboardingFlat)} onboarding flat per site`,
      `Travel: ${formatUsd(TRAVEL_RATES.hourly)}/hr + ${formatUsd(TRAVEL_RATES.perMile)}/mi — once per day/trip to the area`,
      `Multi-site same trip: travel not stacked per store (see zone map)`,
      "If time runs past the zone allotment → time & materials for the overage",
    ],
  },
  {
    icon: HardDrive,
    title: "Local backup storage",
    blurb: "Push/pull backups you can actually trust on site.",
    points: [
      "Passport and Verifone registers — comfortable push/pull backups",
      "Keep copies on site; you cannot always rely on the last tech to leave one",
      "Verifone systems do not reliably back themselves up",
      "Simple, documented process so staff know where backups live",
    ],
  },
  {
    icon: Fuel,
    title: "Fuel dispensers",
    blurb: "Keep lanes open and product moving.",
    points: [
      "Repair, troubleshooting, and preventive maintenance",
      "Error diagnosis and parts replacement",
      "Field support on platforms and brands you already run",
      "Does not include Wayne electronics newer than Vista II",
    ],
  },
  {
    icon: CircuitBoard,
    title: "POS & payment systems",
    blurb: "When the register stops, sales stop.",
    points: [
      "Register and payment-path troubleshooting",
      "Hardware swaps, power, and connectivity issues",
      "Card readers — install, replace, and integrate",
      "Deep configuration of POS and related payment gear",
    ],
  },
  {
    icon: Cable,
    title: "Cable management & counter builds",
    blurb: "Kill the rat’s nest before it kills the hardware.",
    points: [
      "Cable management — clean, labeled, serviceable runs",
      "Custom cable work sized for your counter and devices",
      "Mount devices on walls / under cabinets for open counter space",
      "Neat setups staff will actually touch — not a dust-bunny mess that cooks equipment",
    ],
  },
  {
    icon: Gauge,
    title: "ATG & tank monitoring",
    blurb: "Tank-side gear that keeps compliance and peace of mind.",
    points: [
      "Automatic tank gauge service and support",
      "Sensor, probe, and alarm follow-up",
      "Site checks on monitoring equipment you already own",
      "Calibrations and preventative attention during walkthroughs",
    ],
  },
  {
    icon: CalendarCheck,
    title: "Monthly walkthroughs",
    blurb: "Catch problems before they strand a lane.",
    points: [
      "Scheduled inspections and preventative site assessments",
      "Calibrations and drift checks",
      "Documented notes so you know what needs attention next",
      "Steady cadence for busy stores that can’t wait for a breakdown",
    ],
  },
  {
    icon: Rocket,
    title: "Flip, startup & test requirements",
    blurb: "New site, remodel, or change of ownership — get it proven.",
    points: [
      "Flip / startup test requirements and support",
      "Installation service and theoretical installation planning",
      "Project oversight on multi-party jobs",
      "By-the-day project support when you need a tech on site for the stretch",
    ],
  },
  {
    icon: Eye,
    title: "On-site advocacy",
    blurb: "A second set of eyes when someone else is on your property.",
    points: [
      "For a small fee: show up when your service provider does",
      "Plain-language interpretation of what’s being done and why",
      "Help you understand scope, findings, and recommendations",
      "Direct and honest — quieter “observe only” presence available if you want it",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Security & compliance guidance",
    blurb: "Best practices — not a substitute for your QSA, but real-world help.",
    points: [
      "PA-DSS guidance and best practices for store operations",
      "Anti-theft best practices for POS / back-office exposure",
      "Hardening habits that reduce accidental data and cash risk",
      "Straight talk when a request would put the site in a bad place",
    ],
  },
  {
    icon: HardHat,
    title: "Back-office suites & deep config",
    blurb: "Commander, Passport, and the utilities around them.",
    points: [
      "Deep-level configuration, customization, and integration",
      "Back-office suites and utilities — price books, ports, status, backups",
      "Verifone Commander tooling experience (including custom utilities)",
      "C-Store Management / C-Site Management setup assistance (see below)",
    ],
  },
  {
    icon: Brain,
    title: "AI integration & assistance",
    blurb: "Practical AI help for site work — not buzzwords.",
    points: [
      "AI integration services for site workflows and complex tasks",
      "Help structuring reports and reconciliation processes",
      "Questions answered; what I can’t answer, I work to get answered",
      "Built real tools against Verifone Commander / price-book style workflows",
    ],
  },
];

function ServicesPage() {
  return (
    <div>
      <section className="border-b border-primary/10 grid-bg py-14 md:py-20">
        <div className="container-site max-w-3xl">
          <SignHeading as="h1" accent="Services">
            Equipment & services for real C-stores
          </SignHeading>
          <p className="mt-4 text-muted leading-relaxed">
            Verifone onboarding with road-style travel zones, Passport & Verifone
            local backups, dispensers, POS, ATG, cable work, monthly walkthroughs,
            installation planning, advocacy, PA-DSS guidance, and AI site
            assistance. Based in Siler City — serving the Triad and surrounding
            North Carolina.
          </p>
          <p className="mt-3 text-sm text-subtle leading-relaxed">
            Founded by Ryan W. Key — 2nd generation technician,{" "}
            <span className="font-display font-semibold text-primary">26+ years</span>{" "}
            in the industry. Independent so the quote and the work are both
            straight with you.
          </p>
        </div>
      </section>

      <section className="border-b border-primary/10 py-14 md:py-16">
        <div className="container-site space-y-6">
          <div className="max-w-3xl">
            <SignHeading accent="In demand right now">
              Verifone onboarding + travel zones
            </SignHeading>
            <p className="mt-3 text-muted leading-relaxed">
              Flat Verifone onboarding is{" "}
              <strong className="text-fg">
                {formatUsd(TRAVEL_RATES.verifoneOnboardingFlat)} per site
              </strong>
              . Travel from Siler City is{" "}
              <strong className="text-fg">{formatUsd(TRAVEL_RATES.hourly)}/hour</strong>{" "}
              and{" "}
              <strong className="text-fg">{formatUsd(TRAVEL_RATES.perMile)}/mile</strong>
              , stepped by zone —{" "}
              <strong className="text-fg">once per trip / day</strong> to that
              area, not multiplied by every store on the same run. Map bands are
              road-style (corridors, not perfect crow-flies circles).{" "}
              <strong className="text-fg">Pricing is available</strong> — use the
              map for an idea, then text for a firm number.
            </p>
          </div>
          <TravelZoneMap includeOnboarding />
          <div className="lit-panel overflow-hidden rounded-[var(--radius-xl)]">
            <div className="relative z-[1] border-b border-border px-5 py-3 md:px-6">
              <p className="font-condensed text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Your area map
              </p>
              <p className="mt-1 text-sm text-muted">
                Siler City home base with zone rings and key markets (Greensboro, Raleigh,
                Charlotte, Fayetteville). Interactive quote tool above — this map is the
                big-picture view you already use.
              </p>
            </div>
            <img
              src="/media/maps/service-area-map.png"
              alt="FAFO Petro service area map centered on Siler City, North Carolina"
              className="relative z-[1] w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-primary/10 py-14">
        <div className="container-site max-w-3xl">
          <SignHeading accent="Back office · Verifone">
            C-Store Management / C-Site Management
          </SignHeading>
          <p className="mt-3 text-muted leading-relaxed">
            You may still hear the older name{" "}
            <strong className="text-fg">C-Store Management</strong>; Verifone also
            markets{" "}
            <strong className="text-fg">C-Site Management</strong>. Until everyone
            settles on one label, we list{" "}
            <strong className="text-fg">both</strong> so nothing gets lost in
            translation.
          </p>
          <div className="mt-5 lit-panel rounded-[var(--radius-xl)] p-5 md:p-6">
            <p className="relative z-[1] text-sm text-muted leading-relaxed">
              <strong className="text-fg">Setup:</strong> the site can set up the
              web side themselves, or we can mock one up and swap to your
              information later. Truth is, it's usually{" "}
              <strong className="text-fg">easier if the site sets it up</strong> —
              it needs your passwords and email to complete links and account
              steps. We'll guide either path.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-site">
          <div className="mb-8 max-w-2xl">
            <SignHeading accent="Full menu">What we put on the truck</SignHeading>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {offerings.map((o) => (
              <Card key={o.title}>
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]">
                    <o.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-sign text-2xl uppercase tracking-wide">
                    {o.title}
                  </CardTitle>
                  <CardDescription className="text-base text-muted">{o.blurb}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {o.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm text-muted">
                        <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-primary/10 bg-bg-elevated/40 py-14 md:py-16">
        <div className="container-site max-w-3xl">
          <SignHeading accent="How we price">
            Pricing available · multi-site fair
          </SignHeading>
          <div className="mt-6 space-y-4 text-muted leading-relaxed">
            <p>
              Verifone onboarding travel is published on the zone map as a guide.
              <strong className="text-fg"> Pricing is available</strong> by text
              once we have addresses. Multi-site same area: travel for the{" "}
              <strong className="text-fg">trip</strong>, onboarding for{" "}
              <strong className="text-fg">each site</strong>.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2.5">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="text-fg">Zone allotment:</strong> covers the
                  travel band for that day/trip. Run past the included hour(s) or
                  the job expands on site → overage goes to time & materials.
                </span>
              </li>
              <li className="flex gap-2.5">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="text-fg">Projects:</strong> by the day when
                  I'm on site for the stretch (including advisory-only days).
                </span>
              </li>
              <li className="flex gap-2.5">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="text-fg">Project contracts:</strong> time and
                  materials. More people and moving parts make a single number
                  harder to peg — we stay transparent.
                </span>
              </li>
              <li className="flex gap-2.5">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="text-fg">Advocacy / walkthroughs / backups:</strong>{" "}
                  ask for current options for your store.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-primary/10 py-14">
        <div className="container-site">
          <div className="lit-panel rounded-[var(--radius-xl)] p-6 md:p-8">
            <h2 className="relative z-[1] font-sign text-2xl uppercase tracking-wide sign-outline">
              Scope notes
            </h2>
            <div className="relative z-[1] mt-4 grid gap-4 text-sm text-muted md:grid-cols-2">
              <p className="leading-relaxed">
                <strong className="text-fg">Experience:</strong> 26+ years in the
                industry, 2nd generation. Independent now as FAFO Petro Services
                LLC.
              </p>
              <p className="leading-relaxed">
                <strong className="text-fg">Wayne electronics:</strong> does not
                service Wayne units newer than Vista II. Not sure what you have?
                Text a photo of the dispenser or ID tag.
              </p>
              <p className="leading-relaxed md:col-span-2">
                <strong className="text-fg">How we talk:</strong> direct and honest.
                If something's a bad spend, you'll hear it. If the job is
                outside scope, you'll hear that too.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-primary/10 py-14">
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-sign text-2xl uppercase tracking-wide sign-outline">
              Ready to talk through a site?
            </h2>
            <p className="mt-1 text-sm text-muted">
              Text preferred — or use the service form. Pricing is available.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="font-condensed uppercase tracking-wider">
              <Link to="/request">
                Request service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="font-condensed uppercase tracking-wider">
              <a href="sms:+19728771848">
                <Phone className="h-4 w-4" />
                Text (972) 877-1848
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
