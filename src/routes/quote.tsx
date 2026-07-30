import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { site } from "@/data/site";
import { formatMoney, quoteRates } from "@/lib/quote-rates";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/quote")({
  component: QuotePage,
  head: () => ({
    meta: [
      {
        title: `Service call calculator | ${site.brandName}`,
      },
      {
        name: "description",
        content: `Estimate a FAFO Petro service call: ${formatMoney(quoteRates.laborPerHour)}/hr labor, ${formatMoney(quoteRates.mileagePerMile)}/mi one-way, travel time at labor rate, minimum 1 hour on site.`,
      },
    ],
  }),
});

function QuotePage() {
  return (
    <>
      <Section className="pb-6 pt-14">
        <Badge className="mb-4">Transparent pricing</Badge>
        <SectionHeading
          title="Service call calculator."
          description={`${formatMoney(quoteRates.laborPerHour)}/hour labor and travel time · ${formatMoney(quoteRates.mileagePerMile)}/mile one-way · minimum ${quoteRates.minOnSiteHours} hour on site. Enter your info and site address — we’ll show the minimum before you call, and keep the lead so we already know who you are.`}
        />
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
          <span className="rounded-full border border-border bg-surface px-3 py-1">
            One-way travel only
          </span>
          <span className="rounded-full border border-border bg-surface px-3 py-1">
            From Siler City, NC
          </span>
          <span className="rounded-full border border-border bg-surface px-3 py-1">
            Leads saved for follow-up
          </span>
        </div>
      </Section>

      <Section className="pt-0 pb-16">
        <QuoteCalculator />
        <p className="mt-8 text-center text-sm text-subtle">
          Prefer to talk first?{" "}
          <a
            href={`sms:${site.phoneRaw}`}
            className="font-medium text-primary hover:underline"
          >
            Text {site.phone}
          </a>{" "}
          or{" "}
          <Link to="/contact" className="font-medium text-primary hover:underline">
            contact page
            <ArrowRight className="ml-0.5 inline h-3.5 w-3.5" />
          </Link>
        </p>
      </Section>
    </>
  );
}
