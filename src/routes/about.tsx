import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Building2, User } from "lucide-react";
import { SignHeading } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About | FAFO Petro Services LLC" },
      {
        name: "description",
        content:
          "FAFO Petro Services LLC was founded May 8, 2025 by Ryan W. Key — second-generation field service technician with 26+ years of experience.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div>
      <section className="border-b border-primary/10 grid-bg py-14 md:py-20">
        <div className="container-site max-w-3xl">
          <SignHeading as="h1" accent="About FAFO Petro">
            Independent field service. Second-gen roots.
          </SignHeading>
          <p className="mt-4 text-muted leading-relaxed">
            FAFO Petro Services LLC was established May 8, 2025 by Ryan W. Key —
            a 2nd generation field service technician with{" "}
            <span className="font-semibold text-primary">26+ years</span> of
            hands-on experience. Knowledgeable in most of the brands you know and
            trust, with competitive pricing and straightforward service.
          </p>
        </div>
      </section>

      <section className="border-b border-primary/10 py-10">
        <div className="container-site">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="lit-panel flex items-center justify-center rounded-[var(--radius-xl)] p-6">
              <img src="/media/brand/fafo-logo-primary.png" alt="FAFO Petro Services primary logo" className="max-h-40 w-auto object-contain" />
            </div>
            <div className="lit-panel flex items-center justify-center rounded-[var(--radius-xl)] p-4">
              <img src="/media/brand/fafo-unchained.png" alt="FAFO Petro unchained pumpjack mark" className="max-h-48 w-auto object-contain" />
            </div>
            <div className="lit-panel flex items-center justify-center rounded-[var(--radius-xl)] bg-black/40 p-6">
              <img src="/media/brand/fafo-drop-logo.png" alt="FAFO drop character logo" className="max-h-40 w-auto object-contain" />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-subtle">
            Brand kit — primary pumpjack, unchained mark (&ldquo;Forged Autonomy&rdquo;), and drop logo.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-site grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-3 p-6">
              <User className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Ryan W. Key</h2>
              <p className="text-sm text-muted leading-relaxed">
                Founder and field technician. Owner-operator service work for
                convenience-store petroleum equipment across North Carolina.
                Direct, honest, and focused on what actually keeps your site up.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Based in Siler City</h2>
              <p className="text-sm text-muted leading-relaxed">
                1787 W 3rd St, Siler City, NC 27344. Positioned to cover the
                Triad and surrounding North Carolina areas. Travel zones for
                Verifone onboarding radiate from here.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">26+ years field time</h2>
              <p className="text-sm text-muted leading-relaxed">
                Decades on sites — dispensers, POS, ATG, Verifone and Passport
                work — plus experience with major field service companies in the
                area. Independent now as FAFO Petro. Wayne electronics newer than
                Vista II are outside scope.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="container-site mt-10 max-w-3xl">
          <div className="lit-panel rounded-[var(--radius-xl)] p-6 md:p-8">
            <h2 className="relative z-[1] font-sign text-2xl uppercase tracking-wide sign-outline">
              How we work
            </h2>
            <p className="relative z-[1] mt-3 text-muted leading-relaxed">
              Competitive pricing and real service. Verifone onboarding travel is
              published on the zone map. Other work: day rates for projects,
              time-and-materials for larger contracts, monthly walkthroughs and
              local backups on request. Text or call and we'll sort it.
            </p>
            <div className="relative z-[1] mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="font-condensed uppercase tracking-wider">
                <Link to="/request">
                  Service application
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="font-condensed uppercase tracking-wider">
                <Link to="/services">Full services list</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
