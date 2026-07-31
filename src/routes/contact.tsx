import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact | FAFO Petro Services" },
      {
        name: "description",
        content:
          "Contact FAFO Petro Services: (972) 877-1848 (text preferred), Rkey@FAFOPETRO.com, Siler City, NC.",
      },
    ],
  }),
});

function ContactPage() {
  return (
    <div>
      <section className="border-b border-border grid-bg py-14 md:py-20">
        <div className="container-site max-w-3xl">
          <Badge className="mb-4">Contact</Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Reach FAFO Petro Services
          </h1>
          <p className="mt-4 text-muted leading-relaxed">
            Texting is preferred for the fastest reply. Email works for service
            applications, software support, and longer write-ups.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container-site grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Phone</h2>
                <a
                  href="tel:+19728771848"
                  className="mt-1 block text-lg text-fg no-underline hover:text-primary"
                >
                  (972) 877-1848
                </a>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Texting preferred
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <a href="sms:+19728771848">Send a text</a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="tel:+19728771848">Call</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Email</h2>
                <a
                  href="mailto:Rkey@FAFOPETRO.com"
                  className="mt-1 block text-lg text-fg no-underline hover:text-primary break-all"
                >
                  Rkey@FAFOPETRO.com
                </a>
                <p className="mt-1 text-sm text-muted">
                  Service, software support, and general inquiries
                </p>
              </div>
              <Button asChild variant="secondary">
                <a href="mailto:Rkey@FAFOPETRO.com">Open email</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Location</h2>
                  <p className="mt-1 text-muted leading-relaxed">
                    FAFO Petro Services LLC
                    <br />
                    1787 W 3rd St
                    <br />
                    Siler City, NC 27344
                  </p>
                  <p className="mt-2 text-sm text-subtle">
                    Serving the Triad and surrounding North Carolina areas
                  </p>
                </div>
              </div>
              <Button asChild size="lg">
                <Link to="/request">
                  Request service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
