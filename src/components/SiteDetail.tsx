import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  MapPin,
} from "lucide-react";
import { contributeToSite, getSite } from "@/lib/sites";
import type { FieldSite, SurveyContext } from "@/lib/sites-types";
import {
  pickUnansweredQuestions,
  TERMS_VERSION,
  VIBE_SERVICE_TERMS,
} from "@/lib/survey-bank";
import { cn } from "@/lib/utils";

const TERMS_LS = "fafo-vibe-terms-v1";

const CONTEXTS: { id: SurveyContext; label: string; blurb: string }[] = [
  { id: "topography", label: "Topography / layout", blurb: "Tank farm side, grade, canopies" },
  { id: "tanks", label: "Tanks / ATG", blurb: "UST count, products, monitor brand" },
  { id: "forecourt", label: "Forecourt", blurb: "Dispensers, islands, readers" },
  { id: "networking", label: "Networking", blurb: "ISP, router, pump network" },
  { id: "pos", label: "POS / indoor", blurb: "Console brand, registers" },
  { id: "service_call", label: "Service call", blurb: "Access notes, today’s issue" },
  { id: "general", label: "General", blurb: "Hours, manager, chain" },
];

export function SiteDetail({ siteId }: { siteId: string }) {
  const [site, setSite] = useState<FieldSite | null>(null);
  const [error, setError] = useState("");
  const [context, setContext] = useState<SurveyContext>("forecourt");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contributorName, setContributorName] = useState("");
  const [termsOk, setTermsOk] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      setTermsOk(localStorage.getItem(TERMS_LS) === TERMS_VERSION);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void getSite({ data: { id: siteId } }).then((r) => {
      setSite(r.site);
      if (!r.site) setError("Site not found (may have been ghosted).");
    });
  }, [siteId]);

  const survey = useMemo(() => {
    if (!site) return {};
    try {
      return JSON.parse(site.survey_json || "{}") as Record<string, unknown>;
    } catch {
      return {};
    }
  }, [site]);

  const questions = useMemo(
    () => pickUnansweredQuestions(context, survey, 3),
    [context, survey],
  );

  async function submitAnswers() {
    setMsg("");
    setError("");
    if (!termsOk) {
      setShowTerms(true);
      return;
    }
    setBusy(true);
    try {
      const res = await contributeToSite({
        data: {
          siteId,
          context,
          answers,
          contributorName,
          termsAccepted: true,
        },
      });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setMsg(
        `Thanks — answers logged for review. Site profile now ~${res.completeness}% complete.`,
      );
      setAnswers({});
      const refreshed = await getSite({ data: { id: siteId } });
      setSite(refreshed.site);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!site && !error) {
    return <p className="text-sm text-muted">Loading site…</p>;
  }

  if (!site) {
    return (
      <div>
        <p className="text-sm text-danger">{error}</p>
        <Link to="/sites" className="mt-4 inline-flex text-sm text-primary">
          ← Back to registry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/sites"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        All sites
      </Link>

      <div className="panel shine-border rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              {site.status === "pending" ? "Pending review" : "Approved site"}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-fg">
              {site.name}
            </h1>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {[site.street, site.city, site.state, site.zip]
                .filter(Boolean)
                .join(", ") || "Address incomplete"}
            </p>
            {site.brand ? (
              <p className="mt-1 text-xs text-subtle">Brand: {site.brand}</p>
            ) : null}
          </div>
          <div className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-center">
            <div className="text-2xl font-semibold text-primary">
              {site.completeness}%
            </div>
            <div className="text-[11px] uppercase tracking-wide text-subtle">
              Profile filled
            </div>
          </div>
        </div>

        {Object.keys(survey).length > 0 ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {Object.entries(survey).map(([k, v]) => (
              <div
                key={k}
                className="rounded-lg border border-border/80 bg-bg/50 px-3 py-2 text-xs"
              >
                <div className="text-subtle">{k}</div>
                <div className="mt-0.5 font-medium text-fg">{String(v)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No survey intel yet — answer a few questions below when you’re on site.
          </p>
        )}
      </div>

      <div className="panel shine-border rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-2">
          <Database className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <h2 className="font-semibold text-fg">Grow this site while you work</h2>
            <p className="mt-1 text-sm text-muted">
              Pick what you’re doing. We’ll only ask a few missing questions — not a
              wall of forms. Every tech who uses the tools feeds the same database
              (subject to FAFO review).
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CONTEXTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setContext(c.id);
                setAnswers({});
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                context === c.id
                  ? "border-primary bg-primary/15 text-fg"
                  : "border-border text-muted hover:border-border-strong hover:text-fg",
              )}
              title={c.blurb}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted">Your name (optional)</span>
            <input
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg"
            />
          </label>

          {questions.length ? (
            questions.map((q) => (
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
                    {(q.kind === "yesno"
                      ? ["Yes", "No", "Not sure"]
                      : q.options || []
                    ).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
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
            ))
          ) : (
            <p className="rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-fg">
              Nice — no unanswered questions left for this context. Try another
              tool context.
            </p>
          )}
        </div>

        {!termsOk ? (
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="mt-4 text-sm text-primary underline-offset-2 hover:underline"
          >
            Accept contribution terms to save answers
          </button>
        ) : (
          <p className="mt-4 flex items-center gap-2 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Terms accepted
          </p>
        )}

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        {msg ? <p className="mt-3 text-sm text-success">{msg}</p> : null}

        <button
          type="button"
          disabled={busy || !questions.length}
          onClick={() => void submitAnswers()}
          className="mt-4 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save answers to site DB"}
        </button>
      </div>

      {showTerms ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[85dvh] w-full max-w-lg overflow-auto rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-lg font-semibold text-fg">Contribution terms</h3>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted">
              {VIBE_SERVICE_TERMS}
            </pre>
            <button
              type="button"
              onClick={() => {
                setTermsOk(true);
                try {
                  localStorage.setItem(TERMS_LS, TERMS_VERSION);
                } catch {
                  /* ignore */
                }
                setShowTerms(false);
              }}
              className="mt-4 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-fg"
            >
              I agree
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
