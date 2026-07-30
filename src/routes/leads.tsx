import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/Section";
import { site } from "@/data/site";
import { listQuoteLeads } from "@/lib/quote-leads";
import type { LeadRow } from "@/lib/quote-types";
import { formatMoney, formatHours } from "@/lib/quote-rates";
import { Lock, Unlock } from "lucide-react";

export const Route = createFileRoute("/leads")({
  component: LeadsPage,
  head: () => ({
    meta: [
      { title: `Quote leads | ${site.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function LeadsPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<LeadRow[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await listQuoteLeads({ data: { code } });
      setRows(res.rows);
    } catch (err) {
      setRows(null);
      setError(err instanceof Error ? err.message : "Could not load leads");
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
          <h1 className="text-xl font-semibold text-fg">Quote lead log</h1>
          <p className="mt-2 text-sm text-muted">
            Private — calculator submissions from the public quote page.
          </p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            className="mt-4 h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-primary"
          />
          {error ? (
            <p className="mt-2 text-sm text-danger">{error}</p>
          ) : (
            <p className="mt-2 text-xs text-subtle">
              Default code: FAFO-LEADS (override with QUOTE_LEADS_CODE env)
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-fg"
          >
            <Unlock className="h-4 w-4" />
            {busy ? "Loading…" : "Open log"}
          </button>
        </form>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Quote leads</h1>
          <p className="mt-1 text-sm text-muted">
            {rows.length} recent submissions
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRows(null)}
          className="h-10 rounded-xl border border-border px-4 text-sm text-muted"
        >
          Lock
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-[11px] uppercase tracking-wider text-subtle">
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Site</th>
              <th className="px-3 py-2">Trip</th>
              <th className="px-3 py-2">Minimum</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/80">
                <td className="px-3 py-2 font-mono text-xs text-subtle">
                  {String(r.created_at).slice(0, 19)}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-fg">{r.contact_name}</div>
                  <div className="text-xs text-muted">{r.phone}</div>
                  {r.store_name ? (
                    <div className="text-xs text-subtle">{r.store_name}</div>
                  ) : null}
                </td>
                <td className="max-w-xs px-3 py-2 text-xs text-muted">
                  {r.site_address}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted">
                  {r.miles_one_way != null
                    ? `${Number(r.miles_one_way).toFixed(1)} mi`
                    : "—"}
                  <br />
                  {r.travel_hours_one_way != null
                    ? formatHours(Number(r.travel_hours_one_way))
                    : ""}
                </td>
                <td className="px-3 py-2 font-mono text-sm text-fg">
                  {r.minimum_total != null
                    ? formatMoney(Number(r.minimum_total))
                    : "—"}
                  {r.savings_vs_round_trip != null ? (
                    <div className="text-[11px] text-success">
                      save {formatMoney(Number(r.savings_vs_round_trip))}
                    </div>
                  ) : null}
                </td>
                <td className="max-w-xs px-3 py-2 text-xs text-subtle">
                  {[r.equipment_notes, r.issue_notes].filter(Boolean).join(" · ") ||
                    "—"}
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted">
                  No leads yet — run a quote on /quote and save it.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
