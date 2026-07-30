import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import appCss from "@/styles.css?url";
import { site } from "@/data/site";

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
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <SiteHeader />
        <main className="min-h-[60dvh]">
          <Outlet />
        </main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}
