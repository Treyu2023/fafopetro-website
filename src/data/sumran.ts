/**
 * Private partner vault — Sumran / SOME Run Guns.
 * Not linked from public nav. Access code gate on the page.
 *
 * Receipt emails: from Sumran Nasir <private.sumran.nasir@gmail.com>
 * (subjects often just "Invoices", "UX300…", "UPM…", "eBay" — not part serials)
 */

export const sumranVault = {
  brand: "SOME Run Guns",
  brandAlt: "Sumran Parts",
  partnerName: "Sumran",
  partnerFull: "Sumran Nasir (Muhammad) / inventory under FAFO & Muhammad",
  partnerEmail: "private.sumran.nasir@gmail.com",
  company: "FAFO PETRO SERVICES L.L.C.",
  /** Share this code with Sumran only — change anytime in this file */
  accessCode: "SUM-RUN",
  storageKey: "fafo-sumran-unlocked-v1",
  driveRoot:
    "https://drive.google.com/drive/folders/1575A1njagYR7Shdye2KMFeudn4Yi_Bka",
  driveReceipts:
    "https://drive.google.com/drive/folders/1Sg-yu5c1eXp1nnBIMoqlSmJHReTYHPkQ",
  driveStockWorking:
    "https://drive.google.com/drive/folders/1cQkcIhkX5fBAFVbGSwHTTsi6P1NBI91G",
  sheetInventory:
    "https://docs.google.com/spreadsheets/d/16_xWuRfdKMVzk1DXfnneieYp76Eck2PkrZee4BNZqhU/edit",
  sheetInventoryRecon:
    "https://docs.google.com/spreadsheets/d/1WQjl9c5ugtD7BKpWOh_xAep23pGkfIAKth8HpTmIzIA/edit",
  docAgreement:
    "https://docs.google.com/document/d/1YXcuu6PUNNcr1nPOokBBMTtG7VYE-jiPZE-0khFRPEI/edit",
  sheetCogs:
    "https://docs.google.com/spreadsheets/d/12FodYdlENYy2Yuc-oUb6RQtYGm1cOkbA5BsGXW85i_w/edit",
  sheetReimbursement:
    "https://docs.google.com/spreadsheets/d/11vVea-0Ru5L1NuG3bw7XRsgf2_fcgR2dYl6gD5t5RzA/edit",
  lastReviewed: "2026-07-30",
  blurb:
    "Partner stock board + receipt pairing — match eBay PDFs from Sumran’s emails to the card readers / UPMs / UX300 on the shelf. Not public.",
  agreementNote:
    "GAS STATION PUMP PARTS AGREEMENT dated May 25, 2025 lists Supplier as Shahid Nadeem and Reseller as Ryan Key. Exhibit A matches the Muhammad inventory sheet (card readers + keypad). Inventory sheet owner: private.sumran.nasir.",
  receiptNote:
    "All receipt emails below are from Sumran Nasir (private.sumran.nasir@gmail.com). Subjects are vague (Invoices / UX300 / UPM) — pairing uses cost, filename, and body text. Open Gmail links to grab the PDFs and file them in the eBay Receipts Drive folder for tax.",
};

export type StockStatus =
  | "in_stock"
  | "reserved"
  | "sold"
  | "ordered"
  | "core"
  | "unknown";

export type MatchConfidence = "exact" | "strong" | "likely" | "loose" | "unpaired";

export type ReceiptAttachment = {
  filename: string;
  mimeType: string;
  sizeBytes: number;
};

/** One PDF (or image) from a Sumran email, optionally linked to a stock part */
export type ReceiptItem = {
  id: string;
  /** Parent email */
  emailId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  /** Matched stock part id, if any */
  pairedPartId: string | null;
  confidence: MatchConfidence;
  matchWhy: string;
  /** Cost pulled from email body / inventory when known */
  costHint: string | null;
  sellHint: string | null;
  notes: string | null;
};

export type ReceiptEmail = {
  id: string;
  gmailMessageId: string;
  subject: string;
  date: string;
  /** Gmail deep link */
  gmailUrl: string;
  bodySnippet: string;
  attachments: ReceiptAttachment[];
};

export type StockPart = {
  id: string;
  name: string;
  category: string;
  qty: number | null;
  status: StockStatus;
  serial: string | null;
  costRef: string | null;
  sellRef: string | null;
  vendor: string | null;
  purchased: string | null;
  job: string | null;
  notes: string | null;
  receiptKept: boolean;
  source: string;
  /** Linked receipt item ids */
  receiptIds: string[];
};

/** Sumran receipt emails found in Gmail (from:private.sumran.nasir@gmail.com) */
export const receiptEmails: ReceiptEmail[] = [
  {
    id: "email-ux300-2026-07-28",
    gmailMessageId: "19faa1effa76b621",
    subject: "UX300 JULY 28TH SALE INVOICE FROM EBAY",
    date: "2026-07-28",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/19faa1effa76b621",
    bodySnippet: "(no body text — PDF only)",
    attachments: [
      {
        filename: "july 28 ux300 sale.pdf",
        mimeType: "application/pdf",
        sizeBytes: 58672,
      },
    ],
  },
  {
    id: "email-upm-june-2026",
    gmailMessageId: "19ef121b1924304f",
    subject: "UPM INVOICE FOR JUNE",
    date: "2026-06-22",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/19ef121b1924304f",
    bodySnippet: "(no body text — PDF only)",
    attachments: [
      {
        filename: "JUNE UPM.pdf",
        mimeType: "application/pdf",
        sizeBytes: 58206,
      },
    ],
  },
  {
    id: "email-card-readers-2026-04-29",
    gmailMessageId: "19ddbdf89be1245f",
    subject: "Invoices",
    date: "2026-04-29",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/19ddbdf89be1245f",
    bodySnippet:
      "First card reader 1800 - 1016.50 = 783.5 → 40% = 313.40 → total due 1329.9. Second card reader 1800 - 912.69 profit 40% = 354 → 1266. TOTAL 2595.",
    attachments: [
      {
        filename: "first card reader.pdf",
        mimeType: "application/pdf",
        sizeBytes: 122313,
      },
      {
        filename: "card reader 2.pdf",
        mimeType: "application/pdf",
        sizeBytes: 123805,
      },
      {
        filename: "image.png",
        mimeType: "image/png",
        sizeBytes: 530427,
      },
      {
        filename: "image.png",
        mimeType: "image/png",
        sizeBytes: 550879,
      },
    ],
  },
  {
    id: "email-upm-3pack-2025-11-19",
    gmailMessageId: "19a9da61a1fa7b8c",
    subject: "invoices",
    date: "2025-11-19",
    gmailUrl: "https://mail.google.com/mail/u/0/#inbox/19a9da61a1fa7b8c",
    bodySnippet:
      "UPM (1) sold already — payment received. UPM (2) sold last week. UPM (3) recently ordered — inventory, not sold yet.",
    attachments: [
      {
        filename: "UPM (1).pdf",
        mimeType: "application/pdf",
        sizeBytes: 148039,
      },
      {
        filename: "UPM(2).pdf",
        mimeType: "application/pdf",
        sizeBytes: 158544,
      },
      {
        filename: "UPM(3).pdf",
        mimeType: "application/pdf",
        sizeBytes: 158978,
      },
    ],
  },
];

/**
 * Pairing table — each attachment ↔ best stock part match.
 * Confidence: exact (cost+name), strong (serial/Exhibit A), likely (body order), loose, unpaired.
 */
export const receiptItems: ReceiptItem[] = [
  {
    id: "rcpt-reader-1",
    emailId: "email-card-readers-2026-04-29",
    filename: "first card reader.pdf",
    mimeType: "application/pdf",
    sizeBytes: 122313,
    pairedPartId: "reader-rebuilt-809-472-508",
    confidence: "exact",
    matchWhy:
      "Email body: first card reader cost $1,016.50 — exact match Exhibit A / inventory rebuilt reader SN 809-472-508. Sell ref $1,800 from body.",
    costHint: "$1,016.50",
    sellHint: "$1,800.00",
    notes: "Sumran calc: profit $783.50 · his 40% = $313.40 · total to him $1,329.90",
  },
  {
    id: "rcpt-reader-2",
    emailId: "email-card-readers-2026-04-29",
    filename: "card reader 2.pdf",
    mimeType: "application/pdf",
    sizeBytes: 123805,
    pairedPartId: "reader-new-809-490-500",
    confidence: "strong",
    matchWhy:
      "Email body: second card reader cost $912.69 (inventory/Exhibit A shows $930.69 — likely pre-tax vs with-tax). Only other paid reader on list. SN 809-490-500.",
    costHint: "$912.69 (email) / $930.69 (Exhibit A)",
    sellHint: "$1,800.00",
    notes: "Sumran calc: profit ~$887 · 40% ≈ $354 · total to him $1,266. Confirm tax line on PDF.",
  },
  {
    id: "rcpt-reader-img-1",
    emailId: "email-card-readers-2026-04-29",
    filename: "image.png (1)",
    mimeType: "image/png",
    sizeBytes: 530427,
    pairedPartId: "reader-rebuilt-809-472-508",
    confidence: "likely",
    matchWhy:
      "Same email as card reader invoices — likely eBay listing screenshot / serial photo. Open Gmail to confirm which reader.",
    costHint: null,
    sellHint: null,
    notes: "Visual support only — keep with tax packet.",
  },
  {
    id: "rcpt-reader-img-2",
    emailId: "email-card-readers-2026-04-29",
    filename: "image.png (2)",
    mimeType: "image/png",
    sizeBytes: 550879,
    pairedPartId: "reader-new-809-490-500",
    confidence: "likely",
    matchWhy:
      "Second image in same dual-reader email — pair with second reader pending visual check.",
    costHint: null,
    sellHint: null,
    notes: "Visual support only.",
  },
  {
    id: "rcpt-upm-1",
    emailId: "email-upm-3pack-2025-11-19",
    filename: "UPM (1).pdf",
    mimeType: "application/pdf",
    sizeBytes: 148039,
    pairedPartId: "upm-2025-06-02-sold",
    confidence: "strong",
    matchWhy:
      "Body: UPM (1) already sold + payment received. COGS has June 2, 2025 UPM $1,177 sold High Falls $2,250. Best match for first sold unit.",
    costHint: "$1,177.00 (COGS)",
    sellHint: "$2,250.00",
    notes: "Open PDF to confirm eBay order # / date vs COGS June 2 line.",
  },
  {
    id: "rcpt-upm-2",
    emailId: "email-upm-3pack-2025-11-19",
    filename: "UPM(2).pdf",
    mimeType: "application/pdf",
    sizeBytes: 158544,
    pairedPartId: "upm-sold-2-from-email",
    confidence: "likely",
    matchWhy:
      "Body: UPM (2) sold last week (as of Nov 19, 2025). Not a separate COGS row yet — tracked as second sold UPM.",
    costHint: null,
    sellHint: null,
    notes: "Pull cost from PDF and add to COGS sheet.",
  },
  {
    id: "rcpt-upm-3",
    emailId: "email-upm-3pack-2025-11-19",
    filename: "UPM(3).pdf",
    mimeType: "application/pdf",
    sizeBytes: 158978,
    pairedPartId: "keypad-new-MU244600409",
    confidence: "strong",
    matchWhy:
      "Body: UPM (3) recently ordered, still inventory. Inventory/Exhibit A keypad SN MU244600409 at $1,256.13 matches COGS May 3 eBay UPM.",
    costHint: "$1,256.13",
    sellHint: null,
    notes: "Should still be on shelf unless sold after Nov 2025 — confirm.",
  },
  {
    id: "rcpt-upm-june-2026",
    emailId: "email-upm-june-2026",
    filename: "JUNE UPM.pdf",
    mimeType: "application/pdf",
    sizeBytes: 58206,
    pairedPartId: "upm-june-2026-invoice",
    confidence: "loose",
    matchWhy:
      "Subject: UPM INVOICE FOR JUNE (email Jun 22, 2026). Could be purchase or sale invoice — PDF has no body text. Needs open + pair.",
    costHint: null,
    sellHint: null,
    notes: "Unconfirmed — open Gmail PDF, note serial/order #, then lock pair.",
  },
  {
    id: "rcpt-ux300-2026-07-28",
    emailId: "email-ux300-2026-07-28",
    filename: "july 28 ux300 sale.pdf",
    mimeType: "application/pdf",
    sizeBytes: 58672,
    pairedPartId: "ux300-2026-07-28-sale",
    confidence: "exact",
    matchWhy:
      "Subject + filename both say UX300 July 28 sale eBay invoice. New SKU not on original Exhibit A inventory.",
    costHint: null,
    sellHint: null,
    notes: "Sale receipt — extract sell price from PDF for COGS/profit split.",
  },
];

export const stockParts: StockPart[] = [
  {
    id: "reader-rebuilt-809-472-508",
    name: "Gilbarco M14330A001 (Rebuilt) VeriFone card reader",
    category: "Card readers",
    qty: 0,
    status: "sold",
    serial: "809-472-508",
    costRef: "$1,016.50",
    sellRef: "$1,800.00",
    vendor: "eBay (Sumran purchase)",
    purchased: null,
    job: null,
    notes:
      "Exhibit A + inventory. Apr 29 2026 email pairs first reader PDF at $1,016.50 cost / $1,800 sell. Status marked sold per settlement math — confirm still not on shelf.",
    receiptKept: true,
    source: "Exhibit A + Gmail Invoices 2026-04-29",
    receiptIds: ["rcpt-reader-1", "rcpt-reader-img-1"],
  },
  {
    id: "reader-new-809-490-500",
    name: "Gilbarco M14330A001 (Brand New) VeriFone card reader",
    category: "Card readers",
    qty: 0,
    status: "sold",
    serial: "809-490-500",
    costRef: "$930.69",
    sellRef: "$1,800.00",
    vendor: "eBay (Sumran purchase)",
    purchased: null,
    job: null,
    notes:
      "Exhibit A $930.69; email body used $912.69 for second reader. Paired to card reader 2.pdf. Marked sold per settlement — confirm.",
    receiptKept: true,
    source: "Exhibit A + Gmail Invoices 2026-04-29",
    receiptIds: ["rcpt-reader-2", "rcpt-reader-img-2"],
  },
  {
    id: "keypad-new-MU244600409",
    name: "Gilbarco M13888A165 Keypad / UPM (Brand New)",
    category: "Keypads / UPM",
    qty: 1,
    status: "in_stock",
    serial: "MU244600409 (04527310)",
    costRef: "$1,256.13",
    sellRef: null,
    vendor: "eBay",
    purchased: "2025-05-03",
    job: null,
    notes:
      "COGS May 3 + Exhibit A. Paired to UPM(3).pdf (still inventory as of Nov 19 2025 email).",
    receiptKept: true,
    source: "Exhibit A / COGS + Gmail UPM pack",
    receiptIds: ["rcpt-upm-3"],
  },
  {
    id: "core-keypad-IU171150520",
    name: "Gilbarco M13888A165 Keypad (Core)",
    category: "Cores",
    qty: 1,
    status: "core",
    serial: "IU171150520",
    costRef: "No cost (core)",
    sellRef: null,
    vendor: null,
    purchased: null,
    job: null,
    notes: "Numbers faded. No eBay purchase receipt expected.",
    receiptKept: false,
    source: "Inventory List (cores)",
    receiptIds: [],
  },
  {
    id: "core-keypad-IU1710052710",
    name: "Gilbarco M13888A165 Keypad (Core)",
    category: "Cores",
    qty: 1,
    status: "core",
    serial: "IU1710052710",
    costRef: "No cost (core)",
    sellRef: null,
    vendor: null,
    purchased: null,
    job: null,
    notes: "Numbers faded badly. No purchase receipt.",
    receiptKept: false,
    source: "Inventory List (cores)",
    receiptIds: [],
  },
  {
    id: "core-reader-986-209-916",
    name: "Gilbarco M14330A001 VeriFone card reader (Core)",
    category: "Cores",
    qty: 1,
    status: "core",
    serial: "986-209-916",
    costRef: "No cost (core)",
    sellRef: null,
    vendor: null,
    purchased: null,
    job: null,
    notes: "Yellow circle sticker on bottom. No purchase receipt.",
    receiptKept: false,
    source: "Inventory List (cores)",
    receiptIds: [],
  },
  {
    id: "upm-2025-06-02-sold",
    name: "UPM / keypad installation kit (sold — High Falls)",
    category: "Keypads / UPM",
    qty: 0,
    status: "sold",
    serial: null,
    costRef: "$1,177.00",
    sellRef: "$2,250.00",
    vendor: "eBay",
    purchased: "2025-06-02",
    job: "High Falls Oil Company",
    notes:
      "COGS row. Paired to UPM (1).pdf (payment already received per Nov email). Split 60/40 Sumran $429.20 · Ryan $643.80.",
    receiptKept: true,
    source: "Investor COGS + Gmail UPM pack",
    receiptIds: ["rcpt-upm-1"],
  },
  {
    id: "upm-sold-2-from-email",
    name: "UPM / keypad (sold — UPM 2 from Nov email)",
    category: "Keypads / UPM",
    qty: 0,
    status: "sold",
    serial: null,
    costRef: null,
    sellRef: null,
    vendor: "eBay",
    purchased: null,
    job: null,
    notes:
      "From Nov 19 2025 email UPM(2) — sold prior week. Cost/sell missing until PDF opened and COGS updated.",
    receiptKept: true,
    source: "Gmail UPM pack",
    receiptIds: ["rcpt-upm-2"],
  },
  {
    id: "upm-june-2026-invoice",
    name: "UPM — June 2026 invoice (confirm buy vs sell)",
    category: "Keypads / UPM",
    qty: null,
    status: "unknown",
    serial: null,
    costRef: null,
    sellRef: null,
    vendor: "eBay",
    purchased: "2026-06",
    job: null,
    notes: "JUNE UPM.pdf only — open email and classify.",
    receiptKept: true,
    source: "Gmail UPM INVOICE FOR JUNE",
    receiptIds: ["rcpt-upm-june-2026"],
  },
  {
    id: "ux300-2026-07-28-sale",
    name: "UX300 — eBay sale (July 28, 2026)",
    category: "UX300 / CRIND",
    qty: 0,
    status: "sold",
    serial: null,
    costRef: null,
    sellRef: null,
    vendor: "eBay",
    purchased: null,
    job: null,
    notes:
      "july 28 ux300 sale.pdf from Sumran. Extract sale price + which unit from PDF; add cost if we had a purchase receipt.",
    receiptKept: true,
    source: "Gmail UX300 JULY 28TH SALE",
    receiptIds: ["rcpt-ux300-2026-07-28"],
  },
];

export const statusLabel: Record<StockStatus, string> = {
  in_stock: "In stock",
  reserved: "Reserved",
  sold: "Sold",
  ordered: "On order",
  core: "Core",
  unknown: "Confirm",
};

export const confidenceLabel: Record<MatchConfidence, string> = {
  exact: "Exact match",
  strong: "Strong",
  likely: "Likely",
  loose: "Needs review",
  unpaired: "Unpaired",
};

export function emailById(id: string): ReceiptEmail | undefined {
  return receiptEmails.find((e) => e.id === id);
}

export function partById(id: string): StockPart | undefined {
  return stockParts.find((p) => p.id === id);
}

export function receiptsForPart(partId: string): ReceiptItem[] {
  return receiptItems.filter((r) => r.pairedPartId === partId);
}
