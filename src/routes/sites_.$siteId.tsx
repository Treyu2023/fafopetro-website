import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { SiteDetail } from "@/components/SiteDetail";
import { RequireAuth } from "@/components/RequireAuth";
import { site } from "@/data/site";

export const Route = createFileRoute("/sites_/$siteId")({
  component: SiteDetailPage,
  head: ({ params }) => ({
    meta: [
      { title: `Site ${params.siteId} | ${site.brandName}` },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SiteDetailPage() {
  const { siteId } = Route.useParams();
  return (
    <RequireAuth>
      <Section className="py-12">
        <SiteDetail siteId={siteId} />
      </Section>
    </RequireAuth>
  );
}
