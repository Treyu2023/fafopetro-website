import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { SitesRegistry } from "@/components/SitesRegistry";
import { RequireAuth } from "@/components/RequireAuth";
import { site } from "@/data/site";

export const Route = createFileRoute("/sites")({
  component: SitesPage,
  head: () => ({
    meta: [
      { title: `Site registry | ${site.brandName}` },
      {
        name: "description",
        content:
          "Shared multi-tech gas station / C-store site library near Siler City — search first, soft duplicate checks, progressive surveys.",
      },
    ],
  }),
});

function SitesPage() {
  return (
    <RequireAuth>
      <Section className="pb-6 pt-14">
        <Badge className="mb-4">Multi-tech database</Badge>
        <SectionHeading
          title="Site registry."
          description="Every tech who uses the tools helps build the same library. Search local stations first, never hard-fail on duplicates, and answer a few smart questions each visit so profiles fill in over time. Sign-in required so contributions are attributable."
        />
      </Section>
      <Section className="pt-0 pb-16">
        <SitesRegistry />
      </Section>
    </RequireAuth>
  );
}
