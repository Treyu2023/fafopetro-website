import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/Section";
import { site } from "@/data/site";
import {
  listPendingContributions,
  reviewContribution,
} from "@/lib/sites";
import type { ContributionRow } from "@/lib/sites-types";
import { Lock, Unlock } from "lucide-react";

export const Route = createFileRoute("/sites-review")({
  component: SitesReviewPage,
  head: () => ({
    meta: [
      { title: `Review site contributions | ${site.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function SitesReviewPage() {
  const [code, setCode] = useState("");
  const [rows, setRows] = useState<ContributionRow[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await listPendingContributions({ data: { code } });
      setRows(res.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setRows(null);
    } finally {
      setBusy(false);
    }
  }

  async function decide(id: string, decision: "approved" | "ghosted") {
    setBusy(true);
    try {
      await reviewContribution({ data: { code, id, decision } });
      const res = await listPendingContributions({ data: { code } });
      setRows(res.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setBusy(false);
    }
  }

  if (!rows) {
    return (
      <Section className="flex min-h-[60dvh] items-center py-16">
        <form
          onSubmit={unlock}
          className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-fg">Site contribution review</h1>
          <p className="mt-2 text-sm text-muted">
            Approve or ghost tech-submitted site intel.
          </p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            className="mt-4 h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm text-fg"
          />
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-fg"
          >
            <Unlock className="h-4 w-4" />
            Open queue
          </button>
        </form>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Pending contributions</h1>
          <p className="mt-1 text-sm text-muted">{rows.length} waiting</p>
        </div>
        <button
          type="button"
          onClick={() => setRows(null)}
          className="h-10 rounded-xl border border-border px-4 text-sm text-muted"
        >
          Lock
        </button>
      </div>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-fg">
                  {r.site_name || r.site_id || "Unknown site"}
                </p>
                <p className="text-xs text-subtle">
                  {r.context} · {r.contributor_name || "anon"} ·{" "}
                  {String(r.created_at).slice(0, 19)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void decide(r.id, "approved")}
                  className="h-9 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-fg"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void decide(r.id, "ghosted")}
                  className="h-9 rounded-lg border border-border px-3 text-xs text-muted"
                >
                  Ghost
                </button>
              </div>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-bg p-3 font-mono text-[11px] text-muted">
              {r.answers_json}
            </pre>
          </div>
        ))}
        {!rows.length ? (
          <p className="text-sm text-muted">Queue empty — database is clean.</p>
        ) : null}
      </div>
    </Section>
  );
}
