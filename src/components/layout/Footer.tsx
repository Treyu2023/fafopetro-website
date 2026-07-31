import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/BrandMark";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/15 bg-bg-elevated/80 backdrop-blur-md">
      <div className="canopy-bar w-full opacity-60" aria-hidden="true" />
      <div className="container-site grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <BrandMark size="sm" />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            C-store dispenser, POS, and ATG service for the Triad and surrounding
            NC areas — plus AI tools and field software that sell the capability
            behind the wrench.
          </p>
        </div>

        <div>
          <p className="mb-3 font-condensed text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Home"],
              ["/services", "Services"],
              ["/ai", "AI Corner"],
              ["/software", "Software"],
              ["/about", "About"],
              ["/request", "Request Service"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="font-condensed text-[0.95rem] font-semibold uppercase tracking-wider text-muted no-underline hover:text-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-condensed text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Contact
          </p>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary drop-shadow-[0_0_8px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]" />
              <div>
                <a href="tel:+19728771848" className="text-fg no-underline hover:text-primary">
                  (972) 877-1848
                </a>
                <p className="text-xs text-subtle">Texting preferred</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary drop-shadow-[0_0_8px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]" />
              <a
                href="mailto:Rkey@FAFOPETRO.com"
                className="text-fg no-underline hover:text-primary"
              >
                Rkey@FAFOPETRO.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary drop-shadow-[0_0_8px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]" />
              <span>
                1787 W 3rd St
                <br />
                Siler City, NC 27344
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site flex flex-col gap-2 py-4 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FAFO Petro Services LLC. All rights reserved.</p>
          <p className="font-condensed uppercase tracking-wider">
            Est. May 8, 2025 · Founded by Ryan W. Key
          </p>
        </div>
      </div>
    </footer>
  );
}
