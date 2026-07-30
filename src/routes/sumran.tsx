import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Box,
  FileText,
  FolderOpen,
  KeyRound,
  Link2,
  Lock,
  Package,
  Receipt,
  Search,
  Shield,
  Unlock,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { site } from "@/data/site";
import {
  confidenceLabel,
  emailById,
  partById,
  receiptEmails,
  receiptItems,
  stockParts,
  statusLabel,
  sumranVault,
  type MatchConfidence,
  type ReceiptItem,
  type StockPart,
  type StockStatus,
} from "@/data/sumran";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sumran")({
  component: SumranPage,
  head: () => ({
    meta: [
      { title: `${sumranVault.brand} · Partner vault | ${site.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Private partner stock & tax-doc vault — not for public indexing.",
      },
    ],
  }),
});

function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(sumranVault.storageKey) === "1";
  } catch {
    return false;
  }
}

function SumranPage() {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
  const [showCosts, setShowCosts] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stockParts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [p.name, p.category, p.vendor, p.job, p.notes, p.purchased, p.serial, p.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, statusFilter]);

  const stats = useMemo(() => {
    const inStock = stockParts.filter((p) => p.status === "in_stock").length;
    const sold = stockParts.filter((p) => p.status === "sold").length;
    const confirm = stockParts.filter((p) => p.status === "unknown").length;
    return { total: stockParts.length, inStock, sold, confirm };
  }, []);

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    const normalized = code.trim().toUpperCase().replace(/\s+/g, "-");
    const expected = sumranVault.accessCode.toUpperCase();
    if (normalized === expected || code.trim().toUpperCase() === expected) {
      try {
        sessionStorage.setItem(sumranVault.storageKey, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
      setError("");
    } else {
      setError("That code doesn’t match. Ask Ryan for the partner code.");
    }
  }

  function lock() {
    try {
      sessionStorage.removeItem(sumranVault.storageKey);
    } catch {
      /* ignore */
    }
    setUnlocked(false);
    setCode("");
  }

  if (!unlocked) {
    return (
      <Section className="flex min-h-[70dvh] items-center py-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-primary">
              <Lock className="h-6 w-6" strokeWidth={2} />
            </div>
            <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Partner vault
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-fg">
              {sumranVault.brand}
            </h1>
            <p className="mt-1 text-sm text-muted">{sumranVault.brandAlt}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Private stock + docs for {sumranVault.partnerName} and Ryan — not
              listed on the public site. Enter the access code to continue.
            </p>
          </div>

          <form
            onSubmit={tryUnlock}
            className="rounded-2xl border border-border bg-surface p-5 shadow-lg"
          >
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-subtle">
              Access code
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Partner code"
                  className="h-11 w-full rounded-xl border border-border bg-bg px-10 text-sm text-fg outline-none ring-primary/40 placeholder:text-subtle focus:border-primary focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg transition hover:brightness-110"
              >
                <Unlock className="h-4 w-4" />
                Unlock
              </button>
            </div>
            {error ? (
              <p className="mt-3 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : (
              <p className="mt-3 text-xs text-subtle">
                Code is case-insensitive. Session unlock lasts until you close
                the tab (or hit Lock).
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-subtle">
            {sumranVault.company} · noindex · share URL only with partners
          </p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section className="pb-8 pt-12 sm:pt-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/15 text-primary border-primary/30">
                Partner only
              </Badge>
              <Badge className="border-border bg-surface text-muted">
                noindex
              </Badge>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              <span className="text-primary">{sumranVault.brand}</span>
              <span className="text-subtle"> · </span>
              {sumranVault.brandAlt}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
              {sumranVault.blurb} Wordplay for{" "}
              <strong className="font-medium text-fg">
                {sumranVault.partnerName}
              </strong>
              : SOME run guns, Sumran parts.
            </p>
            <p className="mt-2 text-xs text-subtle">
              Last reviewed {sumranVault.lastReviewed} · Full purchase prices
              stay behind this gate — not on public pages.
            </p>
          </div>
          <button
            type="button"
            onClick={lock}
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-muted transition hover:border-border-strong hover:text-fg"
          >
            <Lock className="h-4 w-4" />
            Lock vault
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Listed rows", value: stats.total, icon: Package },
            { label: "In stock", value: stats.inStock, icon: Box },
            { label: "Sold", value: stats.sold, icon: Receipt },
            { label: "Need confirm", value: stats.confirm, icon: Shield },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-subtle">
                <s.icon className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
              <p className="font-mono text-2xl font-semibold text-fg">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stock board */}
      <Section className="pt-0">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">
              Stock board
            </h2>
            <p className="mt-1 text-sm text-muted">
              What we have / had — costs are reference from your docs, not a
              public price list.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={showCosts}
              onChange={(e) => setShowCosts(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Show cost / sell refs
          </label>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, vendor, job…"
              className="h-11 w-full rounded-xl border border-border bg-surface px-10 text-sm text-fg outline-none ring-primary/40 placeholder:text-subtle focus:border-primary focus:ring-2"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StockStatus | "all")
            }
            className="h-11 rounded-xl border border-border bg-surface px-3 text-sm text-fg outline-none focus:border-primary"
          >
            <option value="all">All statuses</option>
            {(Object.keys(statusLabel) as StockStatus[]).map((k) => (
              <option key={k} value={k}>
                {statusLabel[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-[11px] uppercase tracking-wider text-subtle">
                <th className="px-4 py-3 font-semibold">Part</th>
                <th className="px-4 py-3 font-semibold">Serial</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                {showCosts ? (
                  <>
                    <th className="px-4 py-3 font-semibold">Cost ref</th>
                    <th className="px-4 py-3 font-semibold">Sell ref</th>
                  </>
                ) : null}
                <th className="px-4 py-3 font-semibold">Vendor</th>
                <th className="px-4 py-3 font-semibold">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <StockRow key={p.id} part={p} showCosts={showCosts} />
              ))}
              {!filtered.length ? (
                <tr>
                  <td
                    colSpan={showCosts ? 8 : 6}
                    className="px-4 py-10 text-center text-muted"
                  >
                    No rows match that filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-subtle">
          Stock rows linked to Gmail PDFs below. File copies into the eBay
          Receipts Drive folder for tax keep — Gmail alone is not a filing
          system.
        </p>
      </Section>

      {/* Receipt pairing */}
      <Section className="pt-0">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-fg">
              Receipt ↔ parts pairing
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              Emails from{" "}
              <span className="font-mono text-xs text-fg">
                {sumranVault.partnerEmail}
              </span>
              . Subjects are vague (Invoices / UX300 / UPM) — we match by cost,
              filename, and body text the same way a duplicate finder pairs
              before/after.
            </p>
          </div>
          <p className="font-mono text-xs text-subtle">
            {receiptItems.length} files · {receiptEmails.length} emails
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-warn/30 bg-warn/10 p-4 text-sm leading-relaxed text-muted">
          {sumranVault.receiptNote}
        </div>

        {/* Email cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {receiptEmails.map((em) => (
            <a
              key={em.id}
              href={em.gmailUrl}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-border bg-surface p-4 transition hover:border-primary/40 hover:bg-surface-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-fg group-hover:text-primary">
                  {em.subject}
                </p>
                <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
              </div>
              <p className="mt-1 font-mono text-[11px] text-subtle">{em.date}</p>
              <p className="mt-2 text-xs leading-snug text-muted">
                {em.bodySnippet}
              </p>
              <p className="mt-2 text-[11px] font-medium text-primary">
                {em.attachments.length} attachment
                {em.attachments.length === 1 ? "" : "s"} · open in Gmail →
              </p>
            </a>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-[11px] uppercase tracking-wider text-subtle">
                <th className="px-4 py-3 font-semibold">Receipt file</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Paired part</th>
                <th className="px-4 py-3 font-semibold">Match</th>
                <th className="px-4 py-3 font-semibold">Cost / sell</th>
                <th className="px-4 py-3 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {receiptItems.map((r) => (
                <ReceiptRow key={r.id} item={r} />
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Docs & tax */}

      <Section className="pt-0 pb-20">
        <h2 className="mb-2 text-xl font-semibold tracking-tight text-fg">
          Docs, receipts & tax keep
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          eBay purchase receipts for investor-funded parts should stay filed —
          they matter for cost of goods and taxes. Use the Drive folders below;
          keep originals (PDF/email) even if the row is marked sold.
        </p>

        <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Legal note
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {sumranVault.agreementNote}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DocCard
            icon={FileText}
            title="Gas Station Pump Parts Agreement"
            body="May 25, 2025 — Supplier/Reseller agreement with Exhibit A parts list (serials + costs). Keep signed copy for records."
            href={sumranVault.docAgreement}
            cta="Open agreement"
          />
          <DocCard
            icon={Box}
            title="FAFO & Muhammad Inventory List"
            body="Master stock sheet (Sumran-owned). Paid units + cores with serials and costs."
            href={sumranVault.sheetInventory}
            cta="Open inventory sheet"
          />
          <DocCard
            icon={Box}
            title="Inventory reconciliation (Ryan copy)"
            body="Your copy of the same inventory for markups / status notes."
            href={sumranVault.sheetInventoryRecon}
            cta="Open recon sheet"
          />
          <DocCard
            icon={FolderOpen}
            title="Sumran vault (Drive root)"
            body="Parts & tax docs home — share this folder with Sumran only."
            href={sumranVault.driveRoot}
            cta="Open Drive folder"
          />
          <DocCard
            icon={Receipt}
            title="eBay receipts (tax keep)"
            body="Drop every eBay order PDF / confirmation here. Name files with date + part."
            href={sumranVault.driveReceipts}
            cta="Open receipts folder"
          />
          <DocCard
            icon={FileText}
            title="Investor COGS / profits"
            body="Purchase dates, costs, sold jobs, and Sumran/Ryan profit splits."
            href={sumranVault.sheetCogs}
            cta="Open COGS sheet"
          />
          <DocCard
            icon={FileText}
            title="Reimbursement tracking"
            body="Blank-ready log for ticketed reimbursements against investor parts."
            href={sumranVault.sheetReimbursement}
            cta="Open reimbursement sheet"
          />
          <DocCard
            icon={Box}
            title="Stock list working folder"
            body="Park the master inventory list / photos / packing lists for sync into this board."
            href={sumranVault.driveStockWorking}
            cta="Open stock folder"
          />
          <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 p-5">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Link2 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                How to share
              </span>
            </div>
            <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed text-muted">
              <li>
                Send Sumran this page URL (not linked from the public menu).
              </li>
              <li>
                Share the access code separately (text/call) — currently set in
                code as partner code.
              </li>
              <li>
                Add him as a viewer/editor on the Drive vault folders only — not
                the whole company Drive.
              </li>
              <li>
                When you find his full stock Google Doc, put a copy in “Stock
                list working” and tell us to import it.
              </li>
            </ol>
          </div>
        </div>
      </Section>
    </>
  );
}

function statusTone(status: StockStatus) {
  switch (status) {
    case "in_stock":
      return "bg-success/15 text-success border-success/30";
    case "sold":
      return "bg-subtle/20 text-muted border-border";
    case "reserved":
      return "bg-accent/15 text-accent border-accent/30";
    case "ordered":
      return "bg-warn/15 text-warn border-warn/30";
    case "core":
      return "bg-surface-2 text-muted border-border";
    default:
      return "bg-primary/10 text-primary border-primary/25";
  }
}

function confTone(c: MatchConfidence): string {
  switch (c) {
    case "exact":
      return "bg-success/15 text-success border-success/30";
    case "strong":
      return "bg-primary/15 text-primary border-primary/30";
    case "likely":
      return "bg-warn/15 text-warn border-warn/30";
    case "loose":
      return "bg-surface-2 text-muted border-border";
    default:
      return "bg-danger/15 text-danger border-danger/30";
  }
}

function ReceiptRow({ item }: { item: ReceiptItem }) {
  const email = emailById(item.emailId);
  const part = item.pairedPartId ? partById(item.pairedPartId) : undefined;
  return (
    <tr className="border-b border-border/80 last:border-0">
      <td className="px-4 py-3">
        <div className="font-medium text-fg">{item.filename}</div>
        <div className="mt-0.5 font-mono text-[11px] text-subtle">
          {(item.sizeBytes / 1024).toFixed(0)} KB · {item.mimeType.split("/")[1]}
        </div>
        {item.notes ? (
          <div className="mt-1 max-w-xs text-xs text-subtle">{item.notes}</div>
        ) : null}
      </td>
      <td className="px-4 py-3">
        {email ? (
          <a
            href={email.gmailUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {email.subject}
          </a>
        ) : (
          "—"
        )}
        <div className="mt-0.5 font-mono text-[11px] text-subtle">
          {email?.date ?? ""}
        </div>
      </td>
      <td className="px-4 py-3">
        {part ? (
          <>
            <div className="font-medium text-fg">{part.name}</div>
            <div className="mt-0.5 font-mono text-[11px] text-subtle">
              {part.serial ?? "no serial"}
            </div>
          </>
        ) : (
          <span className="text-xs text-warn">Unpaired</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
            confTone(item.confidence),
          )}
        >
          {confidenceLabel[item.confidence]}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-muted">
        <div>{item.costHint ?? "—"}</div>
        {item.sellHint ? (
          <div className="mt-0.5 text-subtle">sell {item.sellHint}</div>
        ) : null}
      </td>
      <td className="px-4 py-3 max-w-sm text-xs leading-snug text-muted">
        {item.matchWhy}
      </td>
    </tr>
  );
}

function StockRow({
  part,
  showCosts,
}: {
  part: StockPart;
  showCosts: boolean;
}) {
  return (
    <tr className="border-b border-border/80 bg-bg-elevated/40 align-top last:border-0 hover:bg-surface/80">
      <td className="px-4 py-3">
        <div className="font-medium text-fg">{part.name}</div>
        <div className="mt-0.5 text-xs text-subtle">{part.category}</div>
        {part.job ? (
          <div className="mt-1 text-xs text-muted">Job: {part.job}</div>
        ) : null}
        {part.notes ? (
          <div className="mt-1 max-w-xs text-xs leading-snug text-subtle">
            {part.notes}
          </div>
        ) : null}
        {part.purchased ? (
          <div className="mt-1 font-mono text-[11px] text-subtle">
            Bought {part.purchased}
          </div>
        ) : null}
        {part.source ? (
          <div className="mt-1 text-[11px] text-subtle">Src: {part.source}</div>
        ) : null}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-muted">
        {part.serial ?? "—"}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
            statusTone(part.status),
          )}
        >
          {statusLabel[part.status]}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-fg">
        {part.qty == null ? "—" : part.qty}
      </td>
      {showCosts ? (
        <>
          <td className="px-4 py-3 font-mono text-fg">
            {part.costRef ?? "—"}
          </td>
          <td className="px-4 py-3 font-mono text-fg">
            {part.sellRef ?? "—"}
          </td>
        </>
      ) : null}
      <td className="px-4 py-3 text-muted">{part.vendor ?? "—"}</td>
      <td className="px-4 py-3">
        {part.receiptIds.length ? (
          <span className="text-xs font-medium text-success">
            {part.receiptIds.length} linked
            {part.receiptKept ? "" : " · file to Drive"}
          </span>
        ) : part.receiptKept ? (
          <span className="text-xs font-medium text-success">Filed</span>
        ) : (
          <span className="text-xs text-warn">No receipt</span>
        )}
      </td>
    </tr>
  );
}

function DocCard({
  icon: Icon,
  title,
  body,
  href,
  cta,
}: {
  icon: typeof FolderOpen;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:bg-surface-2"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-primary transition group-hover:border-primary/40">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        {cta}
        <Link2 className="h-3.5 w-3.5 opacity-70" />
      </span>
    </a>
  );
}
