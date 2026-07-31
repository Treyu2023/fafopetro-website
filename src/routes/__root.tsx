import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { SiteShell } from "@/components/layout/SiteShell";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "FAFO Petro Services | C-Store Dispenser, POS & ATG Service — NC Triad",
      },
      {
        name: "description",
        content:
          "FAFO Petro Services LLC — independent field service for C-store dispensers, POS, and ATG equipment across the Triad and surrounding North Carolina. Founded by Ryan W. Key.",
      },
      { name: "theme-color", content: "#06080c" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=Bebas+Neue&family=Oswald:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <SiteShell>
          <Outlet />
        </SiteShell>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            className: "border border-primary/20 bg-surface text-fg",
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
