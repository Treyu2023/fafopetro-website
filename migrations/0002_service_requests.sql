-- Public service-request intake. Every form submission is persisted for CRM /
-- future NC site database work. No public read path — list/export is owner-gated.

create table if not exists service_requests (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  business text,
  phone text not null,
  email text,
  city text,
  equipment text,
  urgency text,
  details text,
  source text not null default 'web_form',
  user_agent text,
  ip_hint text,
  status text not null default 'new'
);

create index if not exists service_requests_created_at_idx
  on service_requests (created_at desc);

create index if not exists service_requests_phone_idx
  on service_requests (phone);

create index if not exists service_requests_status_idx
  on service_requests (status);
