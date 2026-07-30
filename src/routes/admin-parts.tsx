import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Lock,
  Package,
  Plus,
  Search,
  Unlock,
  Upload,
  DollarSign,
  Tag,
} from "lucide-react";
import { Section } from "@/components/Section";
import { site } from "@/data/site";
import {
  partsAddPrice,
  partsImportXero,
  partsSearch,
  partsUnlock,
  partsUpsert,
  type PartWithPrices,
} from "@/lib/parts";

export const Route = createFileRoute("/admin-parts")({
  component: AdminPartsPage,
  head: () => ({
    meta: [
      { title: `Parts price book (private) | ${site.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const SOURCES = [
  { id: "xero", label: "Xero (current books)" },
  { id: "sticky", label: "Sticky note / field scrap" },
  { id: "vendor", label: "Vendor quote" },
  { id: "ebay", label: "eBay / marketplace" },
  { id: "web", label: "Web list price" },
  { id: "sumran", label: "Sumran / investor stock" },
  { id: "quote", label: "Customer quote" },
  { id: "manual", label: "Manual entry" },
  { id: "other", label: "Other" },
] as const;

function money(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function AdminPartsPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [stats, setStats] = useState({ parts: 0, prices: 0, xero_tagged: 0 });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<PartWithPrices[]>([]);
  const [selected, setSelected] = useState<PartWithPrices | null>(null);

  const [pn, setPn] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [cost, setCost] = useState("");
  const [source, setSource] = useState("manual");
  const [sourceDetail, setSourceDetail] = useState("");
  const [priceType, setPriceType] = useState("observed");
  const [xeroFlag, setXeroFlag] = useState(false);
  const [observedAt, setObservedAt] = useState("");

  const [pAmount, setPAmount] = useState("");
  const [pCost, setPCost] = useState("");
  const [pSource, setPSource] = useState("sticky");
  const [pDetail, setPDetail] = useState("");
  const [pType, setPType] = useState("observed");
  const [pXero, setPXero] = useState(false);

  const [csv, setCsv] = useState("");
  const [csvDetail, setCsvDetail] = useState("");

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await partsUnlock({ data: { code } });
      setStats(res.stats);
      setUnlocked(true);
      await reload("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function reload(query: string) {
    setBusy(true);
    try {
      const res = await partsSearch({ data: { code, q: query } });
      setRows(res.rows);
      const st = await partsUnlock({ data: { code } });
      setStats(st.stats);
      if (selected) {
        const next = res.rows.find((r) => r.id === selected.id) || null;
        setSelected(next);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  async function savePart(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    setError("");
    try {
      await partsUpsert({
        data: {
          code,
          part_number: pn,
          name: name || undefined,
          brand: brand || undefined,
          category: category || undefined,
          amount: amount === "" ? undefined : amount,
          cost_amount: cost === "" ? undefined : cost,
          source,
          source_detail: sourceDetail || undefined,
          price_type: priceType,
          is_xero_current: xeroFlag || source === "xero",
          observed_at: observedAt || undefined,
        },
      });
      setMsg(`Saved part ${pn}`);
      setPn("");
      setName("");
      setBrand("");
      setAmount("");
      setCost("");
      setSourceDetail("");
      await reload(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function addPriceToSelected(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await partsAddPrice({
        data: {
          code,
          part_id: selected.id,
          amount: pAmount,
          cost_amount: pCost === "" ? undefined : pCost,
          source: pSource,
          source_detail: pDetail || undefined,
          price_type: pType,
          is_xero_current: pXero || pSource === "xero",
        },
      });
      setMsg(`Price logged for ${selected.part_number}`);
      setPAmount("");
      setPCost("");
      setPDetail("");
      await reload(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Price add failed");
    } finally {
      setBusy(false);
    }
  }

  async function importCsv(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await partsImportXero({
        data: {
          code,
          csv,
          detail:
            csvDetail ||
            `Xero CSV import ${new Date().toISOString().slice(0, 10)}`,
        },
      });
      setMsg(
        `Xero import: ${res.parts} parts, ${res.prices} price rows (tagged Xero current).`,
      );
      setCsv("");
      await reload(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  const marginHint = useMemo(() => {
    if (!selected) return null;
    if (selected.margin_pct != null) return `${selected.margin_pct}% margin`;
    return null;
  }, [selected]);

  if (!unlocked) {
    return (
      <Section className="flex min-h-[60dvh] items-center py-16">
        <form
          onSubmit={unlock}
          className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-fg">Parts price book</h1>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Private FAFO-only. Not on the public menu. Xero data stays yours —
            import exports here; no public Xero connection.
          </p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Admin code"
            className="mt-4 h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm text-fg"
            autoComplete="current-password"
          />
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-fg"
          >
            <Unlock className="h-4 w-4" />
            Unlock price book
          </button>
        </form>
      </Section>
    );
  }

  return (
    <Section className="py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Private · not public
          </p>
          <h1 className="text-2xl font-semibold text-fg">Parts & price book</h1>
          <p className="mt-1 text-sm text-muted">
            {stats.parts} parts · {stats.prices} price rows ·{" "}
            {stats.xero_tagged} Xero-tagged ·{" "}
            <Link to="/admin-access" className="text-primary hover:underline">
              Tech admin
            </Link>{" "}
            ·{" "}
            <Link to="/admin-media" className="text-primary hover:underline">
              Media
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setUnlocked(false);
            setCode("");
            setRows([]);
          }}
          className="h-10 rounded-xl border border-border px-3 text-sm text-muted"
        >
          Lock
        </button>
      </div>

      {msg ? <p className="mb-3 text-sm text-success">{msg}</p> : null}
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}

      <div className="mb-6 flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void reload(q);
            }}
            placeholder="Search part #, name, brand…"
            className="h-11 w-full rounded-xl border border-border bg-bg py-2 pl-10 pr-3 text-sm text-fg"
          />
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void reload(q)}
          className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
        >
          Search
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Package className="h-4 w-4 text-primary" />
            Catalog ({rows.length})
          </h2>
          <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {rows.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selected?.id === r.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface hover:border-border-strong"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-fg">
                    {r.part_number}
                  </span>
                  {r.xero_sell != null ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                      Xero {money(r.xero_sell)}
                    </span>
                  ) : null}
                  {r.latest_observed != null &&
                  r.latest_observed !== r.xero_sell ? (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
                      Observed {money(r.latest_observed)}
                    </span>
                  ) : null}
                  {r.margin_pct != null ? (
                    <span className="text-[10px] text-primary">
                      {r.margin_pct}% mgn
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-xs text-muted">
                  {[r.name, r.brand, r.category].filter(Boolean).join(" · ") ||
                    "No name yet"}
                </p>
              </button>
            ))}
            {!rows.length ? (
              <p className="text-sm text-muted">
                No parts yet — add one or import a Xero Items CSV.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          {selected ? (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-mono text-lg font-semibold text-fg">
                    {selected.part_number}
                  </h2>
                  <p className="text-sm text-muted">
                    {selected.name || "Unnamed"}
                    {selected.brand ? ` · ${selected.brand}` : ""}
                  </p>
                </div>
                <div className="text-right text-xs text-muted">
                  <div>
                    Xero sell:{" "}
                    <strong className="text-emerald-400">
                      {money(selected.xero_sell)}
                    </strong>
                  </div>
                  <div>Xero / cost: {money(selected.xero_cost)}</div>
                  <div>Latest other: {money(selected.latest_observed)}</div>
                  {marginHint ? (
                    <div className="text-primary">{marginHint}</div>
                  ) : null}
                </div>
              </div>

              <h3 className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-subtle">
                <Tag className="h-3.5 w-3.5" />
                Price history
              </h3>
              <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto">
                {selected.prices.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border/80 bg-bg px-2.5 py-1.5 text-xs"
                  >
                    <span className="font-semibold text-fg">
                      {money(p.amount)}
                    </span>
                    {p.cost_amount != null ? (
                      <span className="text-subtle">
                        cost {money(p.cost_amount)}
                      </span>
                    ) : null}
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase text-muted">
                      {p.price_type}
                    </span>
                    <span
                      className={
                        p.source === "xero" || p.is_xero_current
                          ? "font-semibold text-emerald-400"
                          : "text-muted"
                      }
                    >
                      {p.is_xero_current ? "XERO CURRENT · " : ""}
                      {p.source}
                    </span>
                    <span className="text-subtle">
                      {p.observed_at?.slice(0, 10)}
                    </span>
                    {p.source_detail ? (
                      <span className="w-full text-[10px] text-subtle">
                        {p.source_detail}
                      </span>
                    ) : null}
                  </li>
                ))}
                {!selected.prices.length ? (
                  <li className="text-xs text-muted">No prices logged yet.</li>
                ) : null}
              </ul>

              <form
                onSubmit={addPriceToSelected}
                className="mt-4 space-y-2 border-t border-border pt-4"
              >
                <p className="text-xs font-semibold text-fg">
                  Log another price (sticky, vendor, etc.)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    required
                    value={pAmount}
                    onChange={(e) => setPAmount(e.target.value)}
                    placeholder="Price $"
                    className="h-9 rounded-lg border border-border bg-bg px-2 text-xs text-fg"
                  />
                  <input
                    value={pCost}
                    onChange={(e) => setPCost(e.target.value)}
                    placeholder="Cost $ (optional)"
                    className="h-9 rounded-lg border border-border bg-bg px-2 text-xs text-fg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={pSource}
                    onChange={(e) => {
                      setPSource(e.target.value);
                      if (e.target.value === "xero") setPXero(true);
                    }}
                    className="h-9 rounded-lg border border-border bg-bg px-2 text-xs text-fg"
                  >
                    {SOURCES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={pType}
                    onChange={(e) => setPType(e.target.value)}
                    className="h-9 rounded-lg border border-border bg-bg px-2 text-xs text-fg"
                  >
                    <option value="observed">Observed</option>
                    <option value="sell">Sell</option>
                    <option value="cost">Cost</option>
                    <option value="list">List</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>
                <input
                  value={pDetail}
                  onChange={(e) => setPDetail(e.target.value)}
                  placeholder="Reference — sticky date, vendor name, screenshot note…"
                  className="h-9 w-full rounded-lg border border-border bg-bg px-2 text-xs text-fg"
                />
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={pXero}
                    onChange={(e) => setPXero(e.target.checked)}
                  />
                  Mark as current Xero books price
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-fg"
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  Add price row
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
              Select a part to see full price history and margins.
            </div>
          )}

          <form
            onSubmit={savePart}
            className="space-y-2 rounded-2xl border border-border bg-surface p-4"
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Plus className="h-4 w-4 text-primary" />
              Add / update part
            </h2>
            <input
              required
              value={pn}
              onChange={(e) => setPn(e.target.value)}
              placeholder="Part number *"
              className="h-10 w-full rounded-lg border border-border bg-bg px-3 font-mono text-sm text-fg"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name / description"
                className="h-9 rounded-lg border border-border bg-bg px-3 text-xs text-fg"
              />
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand (Gilbarco, Verifone…)"
                className="h-9 rounded-lg border border-border bg-bg px-3 text-xs text-fg"
              />
            </div>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (reader, board, nozzle…)"
              className="h-9 w-full rounded-lg border border-border bg-bg px-3 text-xs text-fg"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Price $ (optional)"
                className="h-9 rounded-lg border border-border bg-bg px-3 text-xs text-fg"
              />
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Cost $ (optional)"
                className="h-9 rounded-lg border border-border bg-bg px-3 text-xs text-fg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  if (e.target.value === "xero") setXeroFlag(true);
                }}
                className="h-9 rounded-lg border border-border bg-bg px-2 text-xs text-fg"
              >
                {SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="h-9 rounded-lg border border-border bg-bg px-2 text-xs text-fg"
              >
                <option value="observed">Observed</option>
                <option value="sell">Sell</option>
                <option value="cost">Cost</option>
                <option value="list">List</option>
                <option value="quote">Quote</option>
              </select>
            </div>
            <input
              value={sourceDetail}
              onChange={(e) => setSourceDetail(e.target.value)}
              placeholder="Source reference / where you found it"
              className="h-9 w-full rounded-lg border border-border bg-bg px-3 text-xs text-fg"
            />
            <input
              type="date"
              value={observedAt}
              onChange={(e) => setObservedAt(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-bg px-3 text-xs text-fg"
            />
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={xeroFlag}
                onChange={(e) => setXeroFlag(e.target.checked)}
              />
              This is the current Xero / books price
            </label>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
            >
              <BookOpen className="h-4 w-4" />
              Save part
            </button>
          </form>

          <form
            onSubmit={importCsv}
            className="space-y-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4"
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Upload className="h-4 w-4 text-emerald-400" />
              Import from Xero (CSV)
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              In Xero: Accounting → Items → Export. Paste the CSV here. Rows are
              tagged{" "}
              <strong className="text-emerald-400">Xero current</strong> and
              never overwrite sticky-note history — they stack so you can
              compare. No live Xero login on this site (keeps credentials off the
              public app).
            </p>
            <input
              value={csvDetail}
              onChange={(e) => setCsvDetail(e.target.value)}
              placeholder="Import label (e.g. Xero export 2026-07-30)"
              className="h-9 w-full rounded-lg border border-border bg-bg px-3 text-xs text-fg"
            />
            <textarea
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              rows={5}
              placeholder={
                "ItemCode,Name,SalesPrice,PurchasePrice\nM07679K001,Display,…"
              }
              className="w-full rounded-lg border border-border bg-bg p-3 font-mono text-[11px] text-fg"
            />
            <button
              type="submit"
              disabled={busy || !csv.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 text-sm font-semibold text-emerald-300 disabled:opacity-50"
            >
              Import Xero items
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
