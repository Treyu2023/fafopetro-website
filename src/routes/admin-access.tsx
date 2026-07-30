import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/Section";
import { site } from "@/data/site";
import {
  listToolboxRequests,
  setToolboxAccess,
  type AppProfile,
} from "@/lib/app-profiles";
import { Lock, Unlock } from "lucide-react";

export const Route = createFileRoute("/admin-access")({
  component: AdminAccessPage,
  head: () => ({
    meta: [
      { title: `Tech access admin | ${site.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminAccessPage() {
  const [code, setCode] = useState("");
  const [rows, setRows] = useState<AppProfile[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await listToolboxRequests({ data: { code } });
      setRows(res.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setRows(null);
    } finally {
      setBusy(false);
    }
  }

  async function setAllow(userId: string, allow: boolean) {
    setBusy(true);
    try {
      await setToolboxAccess({ data: { code, userId, allow } });
      const res = await listToolboxRequests({ data: { code } });
      setRows(res.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
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
          <h1 className="text-xl font-semibold text-fg">Toolbox access admin</h1>
          <p className="mt-2 text-sm text-muted">
            Approve which accounts can unlock the Power Toolbox.
          </p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Admin code"
            className="mt-4 h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm text-fg"
          />
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-fg"
          >
            <Unlock className="h-4 w-4" />
            Open
          </button>
        </form>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Tech / toolbox access</h1>
          <p className="mt-1 text-sm text-muted">
            Also:{" "}
            <Link to="/admin-media" className="text-primary hover:underline">
              Media slots
            </Link>
            {" · "}
            <Link to="/admin-parts" className="text-primary hover:underline">
              Parts price book
            </Link>
          </p>
          <p className="text-sm text-muted">{rows.length} profiles</p>
        </div>
        <button
          type="button"
          onClick={() => setRows(null)}
          className="h-10 rounded-xl border border-border px-4 text-sm text-muted"
        >
          Lock
        </button>
      </div>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.user_id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <div>
              <p className="font-medium text-fg">
                {r.display_name || r.email || r.user_id}
              </p>
              <p className="text-xs text-subtle">
                {r.email} · {r.role} · {r.toolbox_status}
                {r.toolbox_access ? " · ACCESS ON" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              {!r.toolbox_access ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void setAllow(r.user_id, true)}
                  className="h-9 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-fg"
                >
                  Approve toolbox
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void setAllow(r.user_id, false)}
                  className="h-9 rounded-lg border border-border px-3 text-xs text-muted"
                >
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
        {!rows.length ? (
          <p className="text-sm text-muted">No pending or approved tech profiles yet.</p>
        ) : null}
      </div>
    </Section>
  );
}
