-- Field site registry: shared multi-tech database (Postgres / PGLite).
-- Status: approved = live, pending = awaiting Ryan review, ghosted = rejected/hidden.

create table if not exists field_sites (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  brand text,
  street text,
  city text,
  state text default 'NC',
  zip text,
  lat double precision,
  lon double precision,
  miles_from_base double precision,
  phone text,
  osm_id text,
  source text not null default 'manual',
  status text not null default 'approved',
  -- progressive survey / site intel (JSON bag — grows over time)
  survey_json text not null default '{}',
  completeness smallint not null default 0,
  notes text,
  created_by text,
  last_touched_by text
);

create index if not exists field_sites_status_idx on field_sites (status);
create index if not exists field_sites_name_idx on field_sites (lower(name));
create index if not exists field_sites_city_idx on field_sites (lower(coalesce(city, '')));
create index if not exists field_sites_geo_idx on field_sites (lat, lon);

create table if not exists site_contributions (
  id text primary key,
  created_at timestamptz not null default now(),
  site_id text references field_sites(id) on delete cascade,
  contributor_name text,
  contributor_phone text,
  contributor_email text,
  context text not null default 'general',
  answers_json text not null default '{}',
  terms_accepted boolean not null default false,
  status text not null default 'pending',
  review_note text,
  reviewed_at timestamptz,
  raw_json text
);

create index if not exists site_contributions_status_idx on site_contributions (status);
create index if not exists site_contributions_site_idx on site_contributions (site_id);

create table if not exists site_tech_sessions (
  id text primary key,
  created_at timestamptz not null default now(),
  tech_name text not null,
  tech_phone text,
  tech_email text,
  company text,
  terms_accepted_at timestamptz not null,
  terms_version text not null
);
