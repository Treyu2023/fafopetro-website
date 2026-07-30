import { Link } from "@tanstack/react-router";
import { Fuel, Youtube, Github } from "lucide-react";
import { nav, publicSocials, site } from "@/data/site";

export function SiteFooter() {
  const socials = publicSocials();

  return (
    <footer className="mt-auto border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
              <Fuel className="h-4 w-4" />
            </span>
            <span className="font-semibold text-fg">{site.brandName}</span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            C-store equipment service across the NC Triad, plus custom AI
            tooling and a music-video workflow from track to 4K upscale to social
            release. {site.experience}.
          </p>
          <p className="mt-3 text-xs text-subtle">{site.legalName}</p>

          {socials.length ? (
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                Find us
              </p>
              <ul className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-muted transition hover:border-border-strong hover:text-fg"
                    >
                      {s.id === "youtube" ? (
                        <Youtube className="h-3.5 w-3.5 text-primary" />
                      ) : s.id === "github" ? (
                        <Github className="h-3.5 w-3.5 text-primary" />
                      ) : null}
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
            Explore
          </h4>
          <ul className="grid grid-cols-2 gap-2">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-muted transition hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a className="hover:text-fg" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="hover:text-fg" href={`tel:${site.phoneRaw}`}>
                {site.phone}
              </a>
            </li>
            <li>{site.address}</li>
            <li>{site.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Est. {site.founded}.
          </p>
          <p>Independent operator · not a Verifone ASC</p>
        </div>
      </div>
    </footer>
  );
}
