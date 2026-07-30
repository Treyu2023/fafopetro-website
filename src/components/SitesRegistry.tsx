import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import {
  bootstrapSites,
  createSite,
  findDuplicates,
  searchSites,
} from "@/lib/sites";
import type { DuplicateMatch, SiteSuggestion } from "@/lib/sites-types";
import {
  pickUnansweredQuestions,
  TERMS_VERSION,
  VIBE_SERVICE_TERMS,
} from "@/lib/survey-bank";
import { cn } from "@/lib/utils";

const TERMS_LS = "fafo-vibe-terms-v1";

export function SitesRegistry() {
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SiteSuggestion[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // add form
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("NC");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [contributorPhone, setContributorPhone] = useState("");
  const [dupes, setDupes] = useState<DuplicateMatch[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  const createQuestions = useMemo(
    () => pickUnansweredQuestions("create_site", {}, 3),
    [],
  );

  useEffect(() => {
    try {
      setTermsOk(localStorage.getItem(TERMS_LS) === TERMS_VERSION);
    } catch {
      /* ignore */
    }
    void bootstrapSites().then((r) => {
      setCount(r.count);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      void (async () => {
        setBusy(true);
        try {
          const res = await searchSites({
            data: { query, limit: 16, includePending: true },
          });
          setSuggestions(res.suggestions);
          setCount(res.total);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Search failed");
        } finally {
          setBusy(false);
        }
      })();
    }, 220);
    return () => clearTimeout(t);
  }, [query, ready]);

  async function checkDupesLive() {
    if (!name.trim() && !street.trim()) {
      setDupes(null);
      return;
    }
    const res = await findDuplicates({
      data: { name, street, city },
    });
    setDupes(res.matches);
  }

  async function submitSite(forceCreate: boolean) {
    setError("");
    setMsg("");
    if (!termsOk) {
      setError("Accept the contribution terms first.");
      setShowTerms(true);
      return;
    }
    setBusy(true);
    try {
      const res = await createSite({
        data: {
          name,
          brand,
          street,
          city,
          state,
          zip,
          phone,
          forceCreate,
          contributorName,
          contributorPhone,
          termsAccepted: true,
          answers,
          context: "create_site",
        },
      });
      if (!res.ok) {
        if (res.code === "duplicate") {
          setDupes(res.matches);
          setError(res.message);
        } else {
          setError(res.message);
        }
        return;
      }
      setMsg(
        `Site submitted for review (pending approval). It won’t hard-error if similar sites exist — you used force=${forceCreate ? "yes" : "no"}.`,
      );
      setShowAdd(false);
      setName("");
      setStreet("");
      setDupes(null);
      const list = await searchSites({
        data: { query: name || "", limit: 16, includePending: true },
      });
      setSuggestions(list.suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save site");
    } finally {
      setBusy(false);
    }
  }

  function acceptTerms() {
    setTermsOk(true);
    try {
      localStorage.setItem(TERMS_LS, TERMS_VERSION);
    } catch {
      /* ignore */
    }
    setShowTerms(false);
  }

  return (
    <div className="space-y-6">
      <div className="panel shine-border rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Shared site library
            </p>
            <h2 className="mt-1 text-xl font-semibold text-fg">
              Find a site before you invent a new one
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Local C-stores, truck stops, and fuel sites within ~50 miles of
              Siler City are preloaded. Type to get suggestions. If it already
              exists, open it — no hard errors, no angry red screens. New tech
              entries go to pending review so the database grows cleanly.
            </p>
            <p className="mt-2 text-xs text-subtle">
              {ready ? `${count} sites on file` : "Loading registry…"} · Postgres
              multi-tech database
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAdd((v) => !v);
              setError("");
              setMsg("");
            }}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
          >
            <Plus className="h-4 w-4" />
            Add site
          </button>
        </div>

        <label className="relative mt-5 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, city, street…"
            className="h-12 w-full rounded-xl border border-border bg-bg pl-10 pr-10 text-sm text-fg outline-none ring-primary/40 placeholder:text-subtle focus:border-primary focus:ring-2"
          />
          {busy ? (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-subtle" />
          ) : null}
        </label>

        {error && !showAdd ? (
          <p className="mt-3 text-sm text-danger">{error}</p>
        ) : null}
        {msg ? (
          <p className="mt-3 flex items-start gap-2 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {msg}
          </p>
        ) : null}

        <ul className="mt-4 divide-y divide-border/80 overflow-hidden rounded-xl border border-border">
          {suggestions.map((s) => (
            <li key={s.id}>
              <Link
                to="/sites/$siteId"
                params={{ siteId: s.id }}
                className="flex items-start justify-between gap-3 px-4 py-3 transition hover:bg-surface-2"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Building2 className="h-4 w-4 shrink-0 text-primary" />
                    <span className="font-medium text-fg">{s.name}</span>
                    {s.status === "pending" ? (
                      <span className="rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warn">
                        Pending review
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {[s.street, s.city, s.state, s.zip].filter(Boolean).join(", ") ||
                      "Address incomplete — help fill it in"}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-subtle">
                  {s.miles_from_base != null ? (
                    <div>{s.miles_from_base.toFixed(1)} mi</div>
                  ) : null}
                  <div className="text-primary">{s.completeness}% filled</div>
                </div>
              </Link>
            </li>
          ))}
          {!suggestions.length && ready ? (
            <li className="px-4 py-8 text-center text-sm text-muted">
              No matches. Try fewer letters, or add the site — we’ll still soft-check
              for duplicates.
            </li>
          ) : null}
        </ul>
      </div>

      {showAdd ? (
        <div className="panel shine-border space-y-4 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <h3 className="font-semibold text-fg">Add a site</h3>
              <p className="mt-1 text-sm text-muted">
                We’ll suggest existing matches as you type. Duplicates never hard-crash —
                you get a friendly notice and links.
              </p>
            </div>
          </div>

          {!termsOk ? (
            <div className="rounded-xl border border-warn/30 bg-warn/10 p-4 text-sm">
              <p className="font-medium text-fg">Contribution terms required</p>
              <p className="mt-1 text-muted">
                Techs agree that FAFO isn’t liable for field damages, and that site
                intel you enter may be approved, edited, or ghosted after review.
              </p>
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="mt-3 h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg"
              >
                Read & accept terms
              </button>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Terms accepted ({TERMS_VERSION})
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Your name" value={contributorName} onChange={setContributorName} />
            <Field label="Your phone" value={contributorPhone} onChange={setContributorPhone} />
            <Field
              label="Store name *"
              value={name}
              onChange={(v) => {
                setName(v);
                setDupes(null);
              }}
              onBlur={() => void checkDupesLive()}
            />
            <Field label="Brand" value={brand} onChange={setBrand} placeholder="Sheetz, Circle K…" />
            <div className="sm:col-span-2">
              <Field
                label="Street"
                value={street}
                onChange={(v) => {
                  setStreet(v);
                  setDupes(null);
                }}
                onBlur={() => void checkDupesLive()}
              />
            </div>
            <Field label="City" value={city} onChange={setCity} onBlur={() => void checkDupesLive()} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="State" value={state} onChange={setState} />
              <Field label="ZIP" value={zip} onChange={setZip} />
            </div>
            <Field label="Site phone" value={phone} onChange={setPhone} />
          </div>

          {dupes && dupes.length > 0 ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg">
                    Possible existing site{dupes.length > 1 ? "s" : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Not an error — pick one below, or confirm this is truly new.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {dupes.map((d) => (
                      <li key={d.site.id}>
                        <Link
                          to="/sites/$siteId"
                          params={{ siteId: d.site.id }}
                          className="block rounded-lg border border-border bg-surface px-3 py-2 text-sm transition hover:border-primary"
                        >
                          <span className="font-medium text-fg">{d.site.name}</span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {d.reason}
                            {d.site.city ? ` · ${d.site.city}` : ""}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-border bg-surface-2/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Quick site intel (optional — builds the DB)
            </p>
            <div className="mt-3 space-y-3">
              {createQuestions.map((q) => (
                <label key={q.id} className="block text-sm">
                  <span className="mb-1.5 block text-muted">{q.prompt}</span>
                  {q.kind === "select" || q.kind === "yesno" ? (
                    <select
                      value={answers[q.fieldKey] || ""}
                      onChange={(e) =>
                        setAnswers((a) => ({ ...a, [q.fieldKey]: e.target.value }))
                      }
                      className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg"
                    >
                      <option value="">Select…</option>
                      {(q.kind === "yesno" ? ["Yes", "No", "Not sure"] : q.options || []).map(
                        (o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ),
                      )}
                    </select>
                  ) : (
                    <input
                      value={answers[q.fieldKey] || ""}
                      onChange={(e) =>
                        setAnswers((a) => ({ ...a, [q.fieldKey]: e.target.value }))
                      }
                      placeholder={q.placeholder}
                      className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          {error ? (
            <p className="flex items-start gap-2 text-sm text-danger">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void submitSite(false)}
              className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg disabled:opacity-60"
            >
              {busy ? "Checking…" : "Submit site"}
            </button>
            {dupes && dupes.length > 0 ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void submitSite(true)}
                className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-5 text-sm font-medium text-fg"
              >
                Yes — add as new site anyway
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="inline-flex h-11 items-center rounded-xl px-4 text-sm text-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {showTerms ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[85dvh] w-full max-w-lg overflow-auto rounded-2xl border border-border bg-surface p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-fg">Contribution terms</h3>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted">
              {VIBE_SERVICE_TERMS}
            </pre>
            <label className="mt-4 flex items-start gap-3 text-sm text-fg">
              <input
                type="checkbox"
                className="mt-1"
                checked={termsOk}
                onChange={(e) => {
                  if (e.target.checked) acceptTerms();
                  else setTermsOk(false);
                }}
              />
              <span>
                I agree to the FAFO Field Contribution Terms (including no-liability /
                damages language and that site data I enter may be approved or ghosted).
              </span>
            </label>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={acceptTerms}
                className="h-11 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-fg"
              >
                Accept & continue
              </button>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="h-11 rounded-xl border border-border px-4 text-sm text-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/40",
        )}
      />
    </label>
  );
}
