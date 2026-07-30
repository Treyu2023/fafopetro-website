import { useMemo, useState } from "react";
import {
  Calculator,
  Clock,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Truck,
} from "lucide-react";
import { site } from "@/data/site";
import {
  computeQuote,
  formatHours,
  formatMoney,
  quoteRates,
  type QuoteBreakdown,
} from "@/lib/quote-rates";
import { estimateRouteTo } from "@/lib/quote-route";
import { submitQuoteLead } from "@/lib/quote-leads";
import { cn } from "@/lib/utils";

const LEADS_LS_KEY = "fafo-quote-leads-v1";

type FormState = {
  storeName: string;
  contactName: string;
  phone: string;
  email: string;
  siteAddress: string;
  city: string;
  state: string;
  zip: string;
  equipmentNotes: string;
  issueNotes: string;
  onSiteHours: string;
};

const empty: FormState = {
  storeName: "",
  contactName: "",
  phone: "",
  email: "",
  siteAddress: "",
  city: "",
  state: "NC",
  zip: "",
  equipmentNotes: "",
  issueNotes: "",
  onSiteHours: "1",
};

export function QuoteCalculator() {
  const [form, setForm] = useState<FormState>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [resolved, setResolved] = useState("");
  const [routeSource, setRouteSource] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  const fullAddress = useMemo(() => {
    const parts = [
      form.siteAddress.trim(),
      form.city.trim(),
      [form.state.trim(), form.zip.trim()].filter(Boolean).join(" "),
    ].filter(Boolean);
    return parts.join(", ");
  }, [form.siteAddress, form.city, form.state, form.zip]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSavedId(null);
    setSaveMsg("");
  }

  async function runEstimate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaveMsg("");
    setBusy(true);
    try {
      if (!form.contactName.trim() || !form.phone.trim()) {
        throw new Error("Contact name and phone are required so we can follow up.");
      }
      if (!fullAddress) {
        throw new Error("Enter the store / site street address.");
      }
      const route = await estimateRouteTo(fullAddress);
      const hours = Math.max(
        quoteRates.minOnSiteHours,
        Number(form.onSiteHours) || quoteRates.minOnSiteHours,
      );
      const q = computeQuote(
        route.milesOneWay,
        route.travelHoursOneWay,
        hours,
      );
      setQuote(q);
      setResolved(route.destination.displayName);
      setRouteSource(route.source);
    } catch (err) {
      setQuote(null);
      setError(err instanceof Error ? err.message : "Estimate failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveLead() {
    if (!quote) return;
    setBusy(true);
    setError("");
    setSaveMsg("");
    try {
      const payload = {
        storeName: form.storeName,
        contactName: form.contactName,
        phone: form.phone,
        email: form.email,
        siteAddress: fullAddress,
        city: form.city,
        state: form.state,
        zip: form.zip,
        equipmentNotes: form.equipmentNotes,
        issueNotes: form.issueNotes,
        milesOneWay: quote.milesOneWay,
        travelHoursOneWay: quote.travelHoursOneWay,
        onSiteHours: quote.onSiteHours,
        laborCost: quote.laborCost,
        travelTimeCost: quote.travelTimeCost,
        mileageCost: quote.mileageCost,
        minimumTotal: quote.minimumTotal,
        roundTripTotal: quote.roundTripTotal,
        savingsVsRoundTrip: quote.savingsVsRoundTrip,
        routeSource,
        resolvedAddress: resolved,
      };

      // Local mirror (always — survives if DB is cold)
      try {
        const prev = JSON.parse(localStorage.getItem(LEADS_LS_KEY) || "[]") as unknown[];
        prev.unshift({ ...payload, savedAt: new Date().toISOString() });
        localStorage.setItem(LEADS_LS_KEY, JSON.stringify(prev.slice(0, 100)));
      } catch {
        /* ignore */
      }

      const res = await submitQuoteLead({ data: payload });
      setSavedId(res.id);
      setSaveMsg("Saved to our lead log. You’re not charged until work is scheduled.");
    } catch (err) {
      // Still keep local copy; surface soft error
      setSaveMsg(
        err instanceof Error
          ? `Logged on this device. Server note: ${err.message}`
          : "Logged on this device.",
      );
    } finally {
      setBusy(false);
    }
  }

  function textRyan() {
    if (!quote) return;
    const body = [
      `Service quote request — ${site.shortName}`,
      `Name: ${form.contactName}`,
      form.storeName ? `Store: ${form.storeName}` : null,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Site: ${fullAddress}`,
      `Est. miles one-way: ${quote.milesOneWay.toFixed(1)}`,
      `Travel time one-way: ${formatHours(quote.travelHoursOneWay)}`,
      `On-site hours: ${quote.onSiteHours}`,
      `MINIMUM: ${formatMoney(quote.minimumTotal)}`,
      `You save vs round-trip billing: ${formatMoney(quote.savingsVsRoundTrip)}`,
      form.issueNotes ? `Issue: ${form.issueNotes}` : null,
      form.equipmentNotes ? `Equipment: ${form.equipmentNotes}` : null,
      savedId ? `Lead ID: ${savedId}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `sms:${site.phoneRaw}?body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        onSubmit={runEstimate}
        className="panel shine-border space-y-5 rounded-2xl p-5 sm:p-6"
      >
        <div>
          <div className="mb-1 inline-flex items-center gap-2 text-primary">
            <Calculator className="h-4 w-4" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              Service call estimator
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-fg">
            See your minimum before you call
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Labor{" "}
            <strong className="text-fg">
              {formatMoney(quoteRates.laborPerHour)}/hr
            </strong>
            · mileage{" "}
            <strong className="text-fg">
              {formatMoney(quoteRates.mileagePerMile)}/mi
            </strong>{" "}
            one way · travel time billed at labor rate · min{" "}
            {quoteRates.minOnSiteHours} hour on site. From{" "}
            {quoteRates.homeBase.address}.
          </p>
        </div>

        <Fieldset title="Who we should call">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Your name *"
              value={form.contactName}
              onChange={(v) => setField("contactName", v)}
              autoComplete="name"
              required
            />
            <Field
              label="Phone *"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
              autoComplete="tel"
              inputMode="tel"
              required
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => setField("email", v)}
              autoComplete="email"
              type="email"
            />
            <Field
              label="Store / company name"
              value={form.storeName}
              onChange={(v) => setField("storeName", v)}
              autoComplete="organization"
            />
          </div>
        </Fieldset>

        <Fieldset title="Site address">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                label="Street address *"
                value={form.siteAddress}
                onChange={(v) => setField("siteAddress", v)}
                autoComplete="street-address"
                placeholder="123 Main St"
                required
              />
            </div>
            <Field
              label="City"
              value={form.city}
              onChange={(v) => setField("city", v)}
              autoComplete="address-level2"
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="State"
                value={form.state}
                onChange={(v) => setField("state", v)}
                autoComplete="address-level1"
              />
              <Field
                label="ZIP"
                value={form.zip}
                onChange={(v) => setField("zip", v)}
                autoComplete="postal-code"
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset title="Optional job details">
          <Field
            label="Equipment (brand / model if known)"
            value={form.equipmentNotes}
            onChange={(v) => setField("equipmentNotes", v)}
            placeholder="e.g. Gilbarco Encore, Verifone reader"
          />
          <Field
            label="What’s going on?"
            value={form.issueNotes}
            onChange={(v) => setField("issueNotes", v)}
            placeholder="Brief description of the issue"
          />
          <Field
            label="Estimated hours on site"
            value={form.onSiteHours}
            onChange={(v) => setField("onSiteHours", v)}
            type="number"
            inputMode="decimal"
            min="1"
            step="0.5"
            hint={`Minimum ${quoteRates.minOnSiteHours} hour billed on site even if the fix is faster.`}
          />
        </Fieldset>

        {error ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg transition hover:brightness-110 disabled:opacity-60"
        >
          <MapPin className="h-4 w-4" />
          {busy ? "Calculating…" : "Calculate minimum service call"}
        </button>
      </form>

      <div className="space-y-4">
        <div className="panel shine-border rounded-2xl p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Estimate
          </p>
          {!quote ? (
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Fill in who you are and the site address. We’ll map the one-way
              drive from Siler City and show your{" "}
              <strong className="text-fg">minimum</strong> before you text or
              call.
            </p>
          ) : (
            <>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-fg">
                {formatMoney(quote.minimumTotal)}
              </p>
              <p className="mt-1 text-sm text-muted">
                Minimum for {quote.onSiteHours} hr on site + one-way trip
              </p>

              <ul className="mt-5 space-y-2.5 text-sm">
                <Line
                  icon={<Clock className="h-4 w-4" />}
                  label={`Labor (${quote.onSiteHours} hr × ${formatMoney(quote.laborRate)})`}
                  value={formatMoney(quote.laborCost)}
                />
                <Line
                  icon={<Truck className="h-4 w-4" />}
                  label={`Travel time one-way (${formatHours(quote.travelHoursOneWay)} × ${formatMoney(quote.laborRate)})`}
                  value={formatMoney(quote.travelTimeCost)}
                />
                <Line
                  icon={<MapPin className="h-4 w-4" />}
                  label={`Mileage one-way (${quote.milesOneWay.toFixed(1)} mi × ${formatMoney(quote.mileageRate)})`}
                  value={formatMoney(quote.mileageCost)}
                />
              </ul>

              <div className="mt-5 rounded-xl border border-success/30 bg-success/10 p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-fg">
                      You save {formatMoney(quote.savingsVsRoundTrip)}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      vs shops that bill round-trip time and miles. We only charge{" "}
                      <strong className="text-fg">one-way</strong> travel right
                      now. Round-trip would be{" "}
                      {formatMoney(quote.roundTripTotal)}.
                    </p>
                  </div>
                </div>
              </div>

              {resolved ? (
                <p className="mt-4 text-xs text-subtle">
                  Mapped to: {resolved}
                  {routeSource === "haversine" ? " (approx. distance)" : ""}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={saveLead}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-medium text-fg transition hover:border-border-strong disabled:opacity-60"
                >
                  <Save className="h-4 w-4 text-primary" />
                  Save lead & lock this estimate
                </button>
                <button
                  type="button"
                  onClick={textRyan}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-fg transition hover:brightness-110"
                >
                  <Phone className="h-4 w-4" />
                  Text this quote to {site.shortName}
                </button>
              </div>
              {saveMsg ? (
                <p className="mt-3 text-xs text-muted">{saveMsg}</p>
              ) : null}
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface-2/60 p-4 text-xs leading-relaxed text-subtle">
          {quoteRates.note} Rates shown for transparency — not a contract until
          we confirm the job by text or phone.
        </div>
      </div>
    </div>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold uppercase tracking-wider text-subtle">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-fg outline-none ring-primary/40 placeholder:text-subtle focus:border-primary focus:ring-2"
        {...rest}
      />
      {hint ? <span className="mt-1 block text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}

function Line({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-border/70 pb-2 last:border-0">
      <span className="flex min-w-0 items-start gap-2 text-muted">
        <span className="mt-0.5 text-primary">{icon}</span>
        <span className="text-xs sm:text-sm">{label}</span>
      </span>
      <span className={cn("shrink-0 font-mono text-sm text-fg")}>{value}</span>
    </li>
  );
}
