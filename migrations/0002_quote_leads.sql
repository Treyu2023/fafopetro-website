-- Service quote calculator leads (public form submissions).
create table if not exists quote_leads (
  id text primary key,
  created_at timestamptz not null default now(),
  store_name text,
  contact_name text not null,
  phone text not null,
  email text,
  site_address text not null,
  city text,
  state text,
  zip text,
  equipment_notes text,
  issue_notes text,
  miles_one_way double precision,
  travel_hours_one_way double precision,
  on_site_hours double precision not null default 1,
  labor_rate double precision not null,
  mileage_rate double precision not null,
  labor_cost double precision,
  travel_time_cost double precision,
  mileage_cost double precision,
  minimum_total double precision,
  round_trip_total double precision,
  savings_vs_round_trip double precision,
  route_source text,
  raw_json text
);

create index if not exists quote_leads_created_at_idx on quote_leads (created_at desc);
