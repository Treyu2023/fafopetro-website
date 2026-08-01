import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemePicker } from "@/components/ThemePicker";
import { PointerFx } from "@/components/PointerFx";
import appCss from "@/styles.css?url";
import { site } from "@/data/site";

const fontHref =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=IBM+Plex+Mono:wght@400;500&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: `${site.brandName} | Field Service, Tools & Creative Systems`,
      },
      {
        name: "description",
        content: `${site.legalName} — C-store dispenser, POS, and ATG field service in North Carolina. ${site.experience}. Custom toolbox apps and a music-video workflow: inference, edit, 4K upscale, final cut, social release.`,
      },
      { property: "og:title", content: site.brandName },
      {
        property: "og:description",
        content:
          "Field service · Custom AI toolbox · Track → inference → edit → 4K upscale → social release",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: fontHref },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" data-theme="amber-field">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <ThemeProvider>
          <SiteHeader />
          <main className="min-h-[60dvh]">
            <Outlet />
          </main>
          <SiteFooter />
          <PointerFx />
          <ThemePicker />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
