import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CircuitBoard,
  Fuel,
  Gauge,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import { BrandMark, SignHeading } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const services = [
  {
    icon: CircuitBoard,
    title: "Verifone onboard",
    price: "ZONES",
    body: "Flat $100 onboarding plus published travel zones from Siler City — $65/hr and $0.75/mi, stepped by zone.",
  },
  {
    icon: Fuel,
    title: "Dispensers & POS",
    price: "LANE UP",
    body: "Dispensers, payment path, cable management, local Passport & Verifone backups kept on site.",
  },
  {
    icon: Gauge,
    title: "ATG & programs",
    price: "TANK OK",
    body: "Tank gauges, monthly walkthroughs, PA-DSS guidance, installation planning, AI site help.",
  },
];

const reasons = [
  {
    icon: BadgeCheck,
    title: "26+ years in the field",
    body: "Second-generation technician. Real site experience — practical diagnosis, not a call-center script.",
  },
  {
    icon: MapPin,
    title: "Triad & surrounding NC",
    body: "Based in Siler City, positioned to serve the Triad and nearby North Carolina markets.",
  },
  {
    icon: Shield,
    title: "Independent & clear pricing",
    body: "Owner-operator. Verifone travel zones published. Day rate, T&M projects, and walkthroughs available.",
  },
];

function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-primary/10 grid-bg">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-90"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--color-canopy) 22%, transparent), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(0deg, color-mix(in oklab, var(--color-primary) 8%, transparent), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full opacity-40 blur-3xl"
          aria-hidden="true"
          style={{
            background: "color-mix(in oklab, var(--color-fluoro) 35%, transparent)",
          }}
        />

        <div className="container-site relative py-16 md:py-24 lg:py-28">
          <div className="max-w-4xl fade-up">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="hero-tag">Text preferred · NC based</span>
              <span className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-muted">
                Est. 5/8/2025 · Siler City, NC
              </span>
            </div>

            <BrandMark size="hero" showTagline />

            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-muted sm:text-xl">
              Conveniently located to serve the{" "}
              <span className="font-display font-semibold text-fg">Triad</span> and
              surrounding NC.{" "}
              <span className="font-condensed text-xl font-bold uppercase tracking-wide text-primary">
                Verifone onboarding
              </span>
              , dispensers, POS, ATG — and an{" "}
              <Link to="/ai" className="text-primary no-underline hover:underline">
                AI Corner
              </Link>{" "}
              that shows how tech-savvy this shop really is.
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">
              Founded by{" "}
              <span className="font-display font-semibold text-fg">Ryan W. Key</span> —
              2nd generation field service technician with{" "}
              <span className="font-semibold text-primary">26+ years</span> of field
              experience. Competitive pricing. Brands you know and trust.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="font-condensed text-base uppercase tracking-[0.14em]">
                <Link to="/services">
                  View services & zones
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="font-condensed text-base uppercase tracking-[0.14em]"
              >
                <Link to="/ai">
                  <Sparkles className="h-4 w-4" />
                  AI Corner
                </Link>
              </Button>
            </div>
            <p className="mt-4 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
              $100 Verifone onboard · $65/hr · $0.75/mi · Zones from Siler City
            </p>
          </div>
        </div>
      </section>

      <section className="relative border-b border-primary/10 py-16 md:py-20">
        <div className="container-site">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SignHeading accent="What we service">Verifone · POS · Dispensers · More</SignHeading>
            <Button asChild variant="outline" className="font-condensed uppercase tracking-wider">
              <Link to="/services">
                Full services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <Card key={s.title}>
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="price-chip">{s.price}</span>
                  </div>
                  <CardTitle className="font-sign text-2xl tracking-wide uppercase">
                    {s.title}
                  </CardTitle>
                  <CardDescription className="text-base">{s.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-primary/10 py-16 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, color-mix(in oklab, var(--color-primary) 8%, transparent), transparent 70%)",
          }}
        />
        <div className="container-site relative">
          <div className="mb-10 max-w-2xl">
            <SignHeading accent="Why FAFO">Field-first service</SignHeading>
            <p className="mt-4 text-muted leading-relaxed">
              Independent support for stores that want a real technician who shows
              up and gets it done. Prefer text. Service applications stay on file
              so nothing slips through.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title} className="lit-panel rounded-[var(--radius-xl)] p-6">
                <r.icon className="relative z-[1] mb-3 h-5 w-5 text-primary drop-shadow-[0_0_10px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]" />
                <h3 className="relative z-[1] font-display text-lg font-semibold tracking-wide">
                  {r.title}
                </h3>
                <p className="relative z-[1] mt-2 text-sm text-muted leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-primary/10 py-16 md:py-20">
        <div className="container-site">
          <div className="lit-panel rounded-[var(--radius-2xl)] p-8 md:p-10">
            <div className="relative z-[1] flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  AI Corner · interactive
                </p>
                <h2 className="mt-1 font-sign text-3xl tracking-wide text-fg sign-outline sm:text-4xl">
                  3D galleries. Live demos. Real tools.
                </h2>
                <p className="mt-2 text-muted leading-relaxed">
                  Spinning project ring, orbit map, field-assist terminal demo,
                  Progen, Local Media, Commander utilities — show customers how
                  tech-savvy this company is.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="font-condensed uppercase tracking-wider">
                  <Link to="/ai">
                    Enter AI Corner
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="font-condensed uppercase tracking-wider"
                >
                  <Link to="/software">
                    <Wrench className="h-4 w-4" />
                    Software
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-site">
          <Card className="overflow-hidden border-primary/25">
            <CardContent className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                aria-hidden="true"
                style={{
                  background: "color-mix(in oklab, var(--color-primary) 30%, transparent)",
                }}
              />
              <div className="relative z-[1]">
                <p className="font-condensed text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Ready when you are
                </p>
                <h2 className="mt-1 font-sign text-3xl tracking-wide sign-outline-amber sm:text-4xl">
                  Need service? Reach out.
                </h2>
                <p className="mt-2 max-w-lg text-muted">
                  Check your travel zone on Services, request online, or text.
                </p>
              </div>
              <div className="relative z-[1] flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="font-condensed uppercase tracking-wider">
                  <Link to="/request">Fill out the form</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-condensed uppercase tracking-wider"
                >
                  <a href="tel:+19728771848">
                    <Phone className="h-4 w-4" />
                    (972) 877-1848
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
