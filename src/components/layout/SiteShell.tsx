import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StationAtmosphere } from "./StationAtmosphere";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <StationAtmosphere />
      <div className="station-content flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
