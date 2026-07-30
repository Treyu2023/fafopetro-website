import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { RequireAuth } from "@/components/RequireAuth";
import { site } from "@/data/site";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import {
  getMyProfile,
  requestToolboxAccess,
  syncMyProfile,
  type AppProfile,
} from "@/lib/app-profiles";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: `Account | ${site.brandName}` },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AccountPage() {
  return (
    <RequireAuth>
      <AccountInner />
    </RequireAuth>
  );
}

function AccountInner() {
  const user = useCurrentUser();
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const session = await authClient.getSession();
        const u = session.data?.user;
        if (u) {
          await syncMyProfile({
            data: { email: u.email, name: u.name ?? undefined },
          });
        }
        const p = await getMyProfile();
        setProfile(p);
      } catch {
        setProfile(null);
      }
    })();
  }, []);

  async function requestAccess() {
    setBusy(true);
    setMsg("");
    try {
      const p = await requestToolboxAccess();
      setProfile(p);
      setMsg("Request submitted — FAFO will approve toolbox access for techs you authorize.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section className="py-14">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Account
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-fg">
            {user?.displayName || "Your account"}
          </h1>
          <p className="mt-1 text-sm text-muted">{user?.primaryEmail}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-semibold text-fg">Website access</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Signed in — you can use the site registry, contribution surveys, and other
            member tools. Public pages (home, services, quote calculator, contact)
            stay available without login.
          </p>
          <Link
            to="/sites"
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
          >
            Open site registry
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-semibold text-fg">Power Toolbox access</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            The desktop Power Toolbox is locked for everyone except approved tech
            accounts. Same email + password you use here.
          </p>
          {profile ? (
            <ul className="mt-3 space-y-1 text-sm text-muted">
              <li>
                Status:{" "}
                <strong className="text-fg">
                  {profile.toolbox_access
                    ? "Approved"
                    : profile.toolbox_status === "pending"
                      ? "Pending FAFO approval"
                      : profile.toolbox_status === "revoked"
                        ? "Revoked"
                        : "Not requested"}
                </strong>
              </li>
              <li>
                Role: <strong className="text-fg">{profile.role}</strong>
              </li>
            </ul>
          ) : (
            <p className="mt-3 text-sm text-subtle">Loading profile…</p>
          )}
          {!profile?.toolbox_access ? (
            <button
              type="button"
              disabled={busy || profile?.toolbox_status === "pending"}
              onClick={() => void requestAccess()}
              className="mt-4 h-10 rounded-xl border border-border bg-bg px-4 text-sm font-medium text-fg disabled:opacity-50"
            >
              {profile?.toolbox_status === "pending"
                ? "Request pending…"
                : "Request toolbox access"}
            </button>
          ) : (
            <p className="mt-4 text-sm text-success">
              You can sign in to the Power Toolbox with this email and password.
            </p>
          )}
          {msg ? <p className="mt-3 text-xs text-muted">{msg}</p> : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void signOut().then(() => (window.location.href = "/"))}
            className="h-10 rounded-xl border border-border px-4 text-sm text-muted"
          >
            Sign out
          </button>
          <Link to="/" className="inline-flex h-10 items-center text-sm text-primary">
            Home
          </Link>
        </div>
      </div>
    </Section>
  );
}
