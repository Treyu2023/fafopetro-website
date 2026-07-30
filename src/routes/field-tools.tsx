import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fieldTools } from "@/data/site";
import { AlertTriangle, Info, Terminal } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/field-tools")({
  component: FieldToolsPage,
  head: () => ({
    meta: [{ title: "Field Tools | FAFO Petro Services" }],
  }),
});

function FieldToolsPage() {
  return (
    <RequireAuth>
    <>
      <Section className="pb-8 pt-14">
        <Badge className="mb-4">Field tools</Badge>
        <SectionHeading
          title="Commander hub and equipment reference."
          description="Operational tools and educational notes for the field. Where OEM brands appear — especially Verifone — content is informational only. Site intel lives in the shared Sites registry — search before creating duplicates."
        />
      </Section>

      <Section className="pt-0">
        <a
          href="/sites"
          className="mb-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg"
        >
          Open site registry
        </a>
        <div className="mb-8 flex gap-3 rounded-2xl border border-warn/25 bg-warn/5 p-4 sm:p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div className="text-sm leading-relaxed text-muted">
            <p className="font-medium text-fg">Important disclaimer</p>
            <p className="mt-1">
              FAFO PETRO SERVICES L.L.C. is <strong className="text-fg">not</strong> a
              Verifone Authorized Service Contractor (ASC) and does not offer
              licensed Verifone programming tools, credentials, or brand-authorized
              service packages on this site. Any Verifone-related material
              (Commander, Ruby, fuel-panel concepts, etc.) is general field
              awareness and educational context only — not official documentation,
              training, endorsement, or a substitute for manufacturer procedures.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {fieldTools.map((t) => (
            <Card key={t.name}>
              <CardHeader>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>{t.name}</CardTitle>
                  <Badge
                    variant={
                      t.status === "In development" ? "default" : "outline"
                    }
                  >
                    {t.status}
                  </Badge>
                </div>
                <CardDescription>{t.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elevated/40">
        <SectionHeading
          eyebrow="Commander vision"
          title="A shell for live readings and guided procedures."
          description="Independent FAFO software direction — not a rebrand of any OEM console."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Select asset",
              body: "Choose vehicle or site context so the right command surface loads.",
              icon: Terminal,
            },
            {
              title: "Connect & read",
              body: "Status panel for adapter health and live parameters when hardware allows.",
              icon: Info,
            },
            {
              title: "Guided adjust",
              body: "Step-by-step flows — e.g. watch total advance while adjusting, then lock procedure notes.",
              icon: Info,
            },
          ].map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <div className="mb-2 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription>{s.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="What you will not find here"
          title="No proprietary OEM tool dumps."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "No Verifone ASC credentials, keys, or licensed programmer software",
            "No reverse-engineered manufacturer firmware or trade-secret procedures",
            "No claims of brand authorization or partnership",
            "Only general field awareness + FAFO-built Commander shell concepts",
          ].map((item) => (
            <li
              key={item}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </>
    </RequireAuth>
  );
}
