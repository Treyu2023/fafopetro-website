import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Wrench,
  Music2,
  Cpu,
  Gamepad2,
  MapPin,
  Phone,
  ShieldCheck,
  Images,
  Sparkles,
  Github,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site, services } from "@/data/site";
import { useMediaSlot } from "@/components/MediaSlot";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const hero0 = useMediaSlot("home.hero.0");
  const hero1 = useMediaSlot("home.hero.1");
  const hero2 = useMediaSlot("home.hero.2");

  const explore: {
    icon: LucideIcon;
    title: string;
    body: string;
    to: "/services" | "/toolbox" | "/creative" | "/gallery" | "/field-tools" | "/fun" | "/quote";
  }[] = [
    {
      icon: Wrench,
      title: "Field service",
      body: "Dispenser, POS, ATG work across the Triad.",
      to: "/services",
    },
    {
      icon: Cpu,
      title: "Toolbox",
      body: "Local Media, Progen, Power Toolbox downloads.",
      to: "/toolbox",
    },
    {
      icon: Music2,
      title: "Creative",
      body: "Music videos end to end — inference, edit, 4K upscale, final cut, social release.",
      to: "/creative",
    },
    {
      icon: Images,
      title: "Gallery",
      body: "AI stills and product art — editable media slots.",
      to: "/gallery",
    },
    {
      icon: ShieldCheck,
      title: "Field tools",
      body: "Work hub: Verifone, sites DB, brands — manuals gated.",
      to: "/field-tools",
    },
    {
      icon: Gamepad2,
      title: "Fun zone",
      body: "Browser games when the truck is parked.",
      to: "/fun",
    },
    {
      icon: Sparkles,
      title: "Get a quote",
      body: "Service quotes, toolbox feedback, creative collabs — text preferred.",
      to: "/quote",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-lines opacity-50" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="fade-up">
            <Badge className="mb-5">
              Est. {site.founded} · {site.experience}
            </Badge>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-fg sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
              Field service that shows up.{" "}
              <span className="text-primary">Tools worth showing off.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted leading-relaxed sm:text-lg">
              {site.legalName} services C-store dispensers, POS, and ATG equipment
              across the NC Triad — and ships the creative + field toolbox
              behind the brand: Progen, Local Media, Ultimate Tab, Architect,
              Commander, and a music-video workflow from track to social release.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-fg transition hover:brightness-110 amber-glow"
              >
                View services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/toolbox"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-medium text-fg transition hover:border-border-strong"
              >
                Explore the toolbox
              </Link>
              <a
                href={site.githubExtensions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-medium text-muted transition hover:border-border-strong hover:text-fg"
              >
                <Github className="h-4 w-4" />
                Downloads
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-subtle">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {site.location}
              </span>
              <a
                href={`tel:${site.phoneRaw}`}
                className="inline-flex items-center gap-1.5 hover:text-fg"
              >
                <Phone className="h-4 w-4 text-primary" />
                {site.phone} · text preferred
              </a>
            </div>
          </div>

          <div className="relative hidden sm:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="row-span-2 overflow-hidden rounded-2xl border border-border amber-glow">
                {hero0?.src ? (
                  <img
                    src={hero0.src}
                    alt={hero0.alt}
                    className="img-cover min-h-[280px] max-h-[360px]"
                    loading="eager"
                  />
                ) : null}
              </div>
              <div className="overflow-hidden rounded-2xl border border-border">
                {hero1?.src ? (
                  <img
                    src={hero1.src}
                    alt={hero1.alt}
                    className="img-cover h-40"
                    loading="eager"
                  />
                ) : null}
              </div>
              <div className="overflow-hidden rounded-2xl border border-border">
                {hero2?.src ? (
                  <img
                    src={hero2.src}
                    alt={hero2.alt}
                    className="img-cover h-40"
                    loading="eager"
                  />
                ) : null}
              </div>
            </div>
            <div className="absolute -bottom-3 left-3 right-3 rounded-xl border border-border bg-bg/90 px-4 py-3 backdrop-blur-md sm:left-auto sm:right-3 sm:w-56">
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                From the vault
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Swap these stills anytime from Media admin — live, no redeploy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { k: "26", v: "Years field experience" },
            { k: "4K", v: "Upscale + music-video workflow" },
            { k: "NC", v: "Triad & surrounding service area" },
          ].map((stat) => (
            <div
              key={stat.k}
              className="rounded-2xl border border-border bg-surface px-5 py-4"
            >
              <p className="text-2xl font-semibold text-primary">{stat.k}</p>
              <p className="mt-1 text-sm text-muted">{stat.v}</p>
            </div>
          ))}
        </div>

        <SectionHeading
          title="What we do."
          description="Home base for FAFO Progen, Local Media, Ultimate Tab, Architect, a track-to-release music-video workflow, field-reference tools, and rebuilt browser games."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-y border-border bg-bg-elevated/30">
        <SectionHeading
          title="Explore the brand."
          description="Jump to the surfaces customers and techs actually use."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {explore.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="panel shine-border rounded-2xl p-5 transition-colors hover:border-border-strong"
              >
                <div className="mb-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.body}
                </p>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
