import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { services, site } from "@/data/site";
import { CheckCircle2, Fuel, MonitorSmartphone, Package } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [{ title: "Services | FAFO Petro Services" }],
  }),
});

const icons = [Fuel, MonitorSmartphone, Package];

function ServicesPage() {
  return (
    <>
      <Section className="pb-8 pt-14">
        <Badge className="mb-4">Field service</Badge>
        <SectionHeading
          title="Dispensers, POS, and ATG service."
          description="Independent C-store equipment service with clear scopes, competitive pricing, and boots-on-ground experience — not a call-center dispatch queue."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Card key={s.title}>
                <CardHeader>
                  <div className="mb-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{s.body}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elevated/40">
        <SectionHeading
          eyebrow="How we work"
          title="Quotes with buffers. Work that holds up."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Detailed scopes with realistic time buffers",
            "Experience across Gilbarco, Wayne, Verifone ecosystems",
            "Veeder-Root TLS-450 configuration familiarity",
            "Based in Siler City — Triad & surrounding NC",
            "Text-first communication for field speed",
            "Transparent labor and mileage rates on the quote tool",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/quote"
            className="inline-flex h-12 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-fg"
          >
            Estimate your service call
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-12 items-center rounded-xl border border-border bg-surface px-6 text-sm font-medium text-fg"
          >
            Contact — {site.phone}
          </Link>
          <a
            href={`mailto:${site.email}?subject=Service%20quote`}
            className="inline-flex h-12 items-center rounded-xl border border-border bg-surface px-6 text-sm font-medium text-fg"
          >
            Email a scope
          </a>
        </div>
      </Section>
    </>
  );
}
