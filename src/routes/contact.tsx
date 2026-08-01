import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { publicSocials, site } from "@/data/site";
import { useMediaSlot } from "@/components/MediaSlot";
import {
  Mail,
  Phone,
  MapPin,
  Youtube,
  MessageSquare,
  Download,
  IdCard,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [{ title: `Contact | ${site.brandName}` }],
  }),
});

function ContactPage() {
  const card = useMediaSlot("contact.business_card");
  const cardSrc = card?.src || "/images/fafo-business-card.png";
  const socials = publicSocials();
  return (
    <>
      <Section className="pb-8 pt-14">
        <Badge className="mb-4">Contact</Badge>
        <SectionHeading
          title="Text first. Email for longer scopes."
          description={`Service applications, site issues, toolbox / Local Media feedback, and creative collabs for ${site.legalName}. Need a price first? Use the service call calculator — $65/hr, $0.75/mi one-way.`}
        />
        <Link
          to="/quote"
          className="mt-4 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg"
        >
          Open service call calculator
        </Link>
      </Section>

      {socials.length ? (
        <Section className="pt-0 pb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            Find us online
          </p>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-muted transition hover:border-border-strong hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          <a href={`mailto:${site.email}`} className="group">
            <Card className="h-full hover:border-border-strong">
              <CardHeader>
                <Mail className="mb-2 h-5 w-5 text-primary" />
                <CardTitle>Email</CardTitle>
                <CardDescription className="text-fg transition-colors group-hover:text-primary">
                  {site.email}
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href={`sms:${site.phoneRaw}`} className="group">
            <Card className="h-full hover:border-border-strong amber-glow border-primary/20">
              <CardHeader>
                <MessageSquare className="mb-2 h-5 w-5 text-primary" />
                <CardTitle>Text preferred</CardTitle>
                <CardDescription className="text-fg transition-colors group-hover:text-primary">
                  {site.phone}
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href={`tel:${site.phoneRaw}`} className="group">
            <Card className="h-full hover:border-border-strong">
              <CardHeader>
                <Phone className="mb-2 h-5 w-5 text-primary" />
                <CardTitle>Call</CardTitle>
                <CardDescription className="text-fg transition-colors group-hover:text-primary">
                  {site.phone}
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <Card>
            <CardHeader>
              <MapPin className="mb-2 h-5 w-5 text-primary" />
              <CardTitle>Service area</CardTitle>
              <CardDescription>
                {site.location}
                <br />
                {site.address}
              </CardDescription>
            </CardHeader>
          </Card>
          <a
            href={site.youtube}
            target="_blank"
            rel="noreferrer"
            className="group md:col-span-2"
          >
            <Card className="h-full hover:border-border-strong">
              <CardHeader>
                <Youtube className="mb-2 h-5 w-5 text-primary" />
                <CardTitle>YouTube {site.youtubeHandle}</CardTitle>
                <CardDescription className="text-fg transition-colors group-hover:text-primary">
                  Neon Ninja — visualizers, archives, and creative pipeline output
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
        </div>

        <div className="panel shine-border mt-8 grid gap-6 rounded-2xl p-6 sm:grid-cols-[1.1fr_0.9fr] sm:p-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-primary">
              <IdCard className="h-4 w-4" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                Business card
              </span>
            </div>
            <h2 className="text-lg font-semibold text-fg">
              One-sided magnetic print file
            </h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Single face with legal name, contact, address, site, and YouTube —
              sized for 3.5″ × 2″ cards with magnetic backs (no reverse side).
              Download the PNG for the print shop, or open the HTML for
              pixel-perfect print.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={cardSrc}
                download="FAFO-PETRO-SERVICES-LLC-business-card.png"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg transition hover:brightness-110"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </a>
              <a
                href="/business-card.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-fg transition hover:border-border-strong"
              >
                Open print layout
              </a>
            </div>
          </div>
          <a
            href={cardSrc}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden rounded-xl border border-border bg-bg-elevated"
          >
            <img
              src={cardSrc}
              alt={card?.alt || "FAFO PETRO SERVICES L.L.C. one-sided business card"}
              className="h-full w-full object-cover"
            />
          </a>
        </div>

        <div className="panel shine-border mt-8 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-fg">
            Service application tips
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Site name and city</li>
            <li>Equipment brand / model if known (dispenser, POS, ATG)</li>
            <li>What you're seeing (error, downtime, symptoms)</li>
            <li>Best callback number and windows</li>
          </ul>
          <p className="mt-6 text-sm text-subtle">
            {site.legalName} · founded {site.founded} by {site.founder}.
            Independent operator — competitive pricing, real field experience.
            Extension support for Local Media / Ultimate Tab / Progen also
            welcome at the same inbox.
          </p>
        </div>
      </Section>
    </>
  );
}
