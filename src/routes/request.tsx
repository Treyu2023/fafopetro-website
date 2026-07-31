import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";

export const Route = createFileRoute("/request")({
  component: RequestPage,
  head: () => ({
    meta: [
      { title: "Request Service | FAFO Petro Services" },
      {
        name: "description",
        content:
          "Request C-store dispenser, POS, ATG, cable management, or walkthrough service from FAFO Petro Services. Text preferred: (972) 877-1848.",
      },
    ],
  }),
});

function RequestPage() {
  return (
    <div>
      <section className="border-b border-border grid-bg py-14 md:py-16">
        <div className="container-site max-w-2xl">
          <Badge className="mb-4">Service request</Badge>
          <h1 className="font-sign text-3xl uppercase tracking-wide sign-outline sm:text-4xl">
            Tell us what needs fixing
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Fill this out and we save your contact info to our private request log
            so nothing slips through. Prefer text?{" "}
            <a href="sms:+19728771848" className="text-primary no-underline">
              (972) 877-1848
            </a>
            .
          </p>
        </div>
      </section>
      <section className="py-10 md:py-14">
        <div className="container-site max-w-2xl">
          <ServiceRequestForm />
        </div>
      </section>
    </div>
  );
}
