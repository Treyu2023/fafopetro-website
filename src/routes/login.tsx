import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/Section";
import { site } from "@/data/site";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { syncMyProfile } from "@/lib/app-profiles";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";

type LoginSearch = {
  next?: string;
  mode?: "signin" | "signup";
};

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    next: typeof s.next === "string" ? s.next : undefined,
    mode: s.mode === "signup" ? "signup" : undefined,
  }),
  head: () => ({
    meta: [{ title: `Sign in | ${site.brandName}` }],
  }),
});

function LoginPage() {
  const search = Route.useSearch();
  const next = search.next || "/";
  const [mode, setMode] = useState<"signin" | "signup">(
    search.mode === "signup" ? "signup" : "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();

  if (!isPending && user) {
    void navigate({ to: next });
  }

  async function afterAuth() {
    try {
      const session = await authClient.getSession();
      const u = session.data?.user;
      if (u) {
        await syncMyProfile({
          data: { email: u.email, name: u.name ?? undefined },
        });
      }
    } catch {
      /* best-effort */
    }
    void navigate({ to: next });
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0],
        });
        if (err) throw new Error(err.message || "Sign-up failed");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (err) throw new Error(err.message || "Sign-in failed");
      }
      await afterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section className="flex min-h-[70dvh] items-center py-14">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          Account
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-fg">
          {mode === "signup" ? "Create account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Public pages stay open. Site registry, field tools, and the Power Toolbox
          need an account. Toolbox access is approved by FAFO after you request it.
        </p>

        {!authEnabled ? (
          <p className="mt-6 text-sm text-muted">Sign-in is disabled on this deploy.</p>
        ) : (
          <>
            <div className="mt-6 space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void signIn(p.providerId, {
                      callbackURL: next,
                      errorCallbackURL: "/login",
                    })
                  }
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-border bg-bg text-sm font-medium text-fg transition hover:border-border-strong"
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>

            {emailAndPasswordEnabled ? (
              <>
                <div className="my-6 flex items-center gap-3 text-xs text-subtle">
                  <div className="h-px flex-1 bg-border" />
                  or email
                  <div className="h-px flex-1 bg-border" />
                </div>

                <form onSubmit={onEmailSubmit} className="space-y-3">
                  {mode === "signup" ? (
                    <label className="block text-sm">
                      <span className="mb-1.5 block text-muted">Name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg"
                        autoComplete="name"
                      />
                    </label>
                  ) : null}
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-muted">Email</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg"
                      autoComplete="email"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-muted">Password</span>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg"
                      autoComplete={
                        mode === "signup" ? "new-password" : "current-password"
                      }
                    />
                  </label>
                  {error ? <p className="text-sm text-danger">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={busy}
                    className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-fg disabled:opacity-60"
                  >
                    {busy
                      ? "Working…"
                      : mode === "signup"
                        ? "Create account"
                        : "Sign in with email"}
                  </button>
                </form>

                <p className="mt-4 text-center text-sm text-muted">
                  {mode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="font-medium text-primary"
                        onClick={() => setMode("signin")}
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      New here?{" "}
                      <button
                        type="button"
                        className="font-medium text-primary"
                        onClick={() => setMode("signup")}
                      >
                        Create account
                      </button>
                    </>
                  )}
                </p>
              </>
            ) : null}
          </>
        )}

        <p className="mt-6 text-center text-xs text-subtle">
          <Link to="/" className="hover:text-fg">
            ← Back home
          </Link>
        </p>
      </div>
    </Section>
  );
}
