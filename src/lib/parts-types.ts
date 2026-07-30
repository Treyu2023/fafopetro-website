export type PartRow = {
  id: string;
  part_number: string;
  part_number_norm: string;
  name: string | null;
  brand: string | null;
  category: string | null;
  description: string | null;
  unit: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PartPriceRow = {
  id: string;
  part_id: string;
  amount: number;
  cost_amount: number | null;
  currency: string;
  price_type: string;
  source: string;
  source_detail: string | null;
  is_xero_current: boolean;
  observed_at: string;
  created_at: string;
};

export type PartWithPrices = PartRow & {
  prices: PartPriceRow[];
  xero_sell: number | null;
  xero_cost: number | null;
  latest_observed: number | null;
  margin_pct: number | null;
};

export type PriceSource =
  | "xero"
  | "sticky"
  | "vendor"
  | "manual"
  | "ebay"
  | "web"
  | "sumran"
  | "quote"
  | "other";

export type PriceType = "list" | "cost" | "sell" | "quote" | "observed";
