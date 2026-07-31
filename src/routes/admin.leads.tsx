import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Lock, RefreshCw } from "lucide-react";
import { SignHeading } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  exportServiceRequestsCsv,
  listServiceRequests,
  type ServiceRequestRow,
} from "@/lib/service-requests";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsAdminPage,
  head: () => ({
    meta: [
      { title: "Request log | FAFO Petro (private)" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function LeadsAdminPage() {
  const [code, setCode] = useState("");
  const [rows, setRows] = useState<ServiceRequestRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!code.trim()) {
      toast.error("Enter the access code.");
      return;
    }
    setLoading(true);
    try {
      const res = await listServiceRequests({ data: { code } });
      setRows(res.rows);
      toast.success(`${res.rows.length} request(s) loaded`);
    } catch {
      setRows(null);
      toast.error("Invalid code or could not load.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadCsv() {
    if (!code.trim()) {
      toast.error("Enter the access code.");
      return;
    }
    try {
      const res = await exportServiceRequestsCsv({ data: { code } });
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fafo-service-requests-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${res.count} row(s)`);
    } catch {
      toast.error("Export failed — check access code.");
    }
  }

  return (
    <div>
      <section className="border-b border-primary/10 grid-bg py-12 md:py-16">
        <div className="container-site max-w-3xl">
          <SignHeading as="h1" accent="Private · Owner only">
            Service request log
          </SignHeading>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Every web form submission is stored here for your records and future
            database work. Not linked from the public menu. Change the access
            code in production via the LEADS_ACCESS_CODE setting.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-site space-y-6">
          <div className="lit-panel flex flex-col gap-4 rounded-[var(--radius-xl)] p-5 sm:flex-row sm:items-end">
            <div className="relative z-[1] flex-1 space-y-2">
              <Label htmlFor="code">Access code</Label>
              <Input
                id="code"
                type="password"
                autoComplete="current-password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Access code"
                onKeyDown={(e) => {
                  if (e.key === "Enter") void load();
                }}
              />
            </div>
            <div className="relative z-[1] flex flex-wrap gap-2">
              <Button onClick={() => void load()} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Unlock log
              </Button>
              <Button variant="secondary" onClick={() => void downloadCsv()}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {rows ? (
            <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-surface font-condensed uppercase tracking-wider text-xs text-muted">
                  <tr>
                    <th className="px-3 py-3">When</th>
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Business</th>
                    <th className="px-3 py-3">City</th>
                    <th className="px-3 py-3">Need</th>
                    <th className="px-3 py-3">Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-muted">
                        No requests yet.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t border-border/80 odd:bg-bg-elevated/40 align-top"
                      >
                        <td className="px-3 py-3 text-xs text-subtle whitespace-nowrap">
                          {r.created_at?.replace("T", " ").slice(0, 19)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-fg">{r.name}</div>
                          {r.email ? (
                            <div className="text-xs text-muted">{r.email}</div>
                          ) : null}
                          {r.details ? (
                            <div className="mt-1 max-w-xs text-xs text-subtle line-clamp-3">
                              {r.details}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <a href={`tel:${r.phone}`} className="text-primary no-underline">
                            {r.phone}
                          </a>
                        </td>
                        <td className="px-3 py-3 text-muted">{r.business || "—"}</td>
                        <td className="px-3 py-3 text-muted">{r.city || "—"}</td>
                        <td className="px-3 py-3 text-muted">{r.equipment || "—"}</td>
                        <td className="px-3 py-3 text-muted">{r.urgency || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
