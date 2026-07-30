-- Private FAFO parts / price book (admin only — not public nav)
create table if not exists parts (
  id text primary key,
  part_number text not null,
  part_number_norm text not null,
  name text,
  brand text,
  category text,
  description text,
  unit text default 'ea',
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists parts_part_number_norm_uidx on parts (part_number_norm);
create index if not exists parts_brand_idx on parts (lower(coalesce(brand, '')));
create index if not exists parts_name_idx on parts (lower(coalesce(name, '')));

create table if not exists part_prices (
  id text primary key,
  part_id text not null references parts(id) on delete cascade,
  amount numeric not null,
  cost_amount numeric,
  currency text not null default 'USD',
  price_type text not null default 'observed',
  source text not null default 'manual',
  source_detail text,
  is_xero_current boolean not null default false,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists part_prices_part_idx on part_prices (part_id);
create index if not exists part_prices_xero_idx on part_prices (is_xero_current) where is_xero_current = true;
create index if not exists part_prices_observed_idx on part_prices (observed_at desc);
