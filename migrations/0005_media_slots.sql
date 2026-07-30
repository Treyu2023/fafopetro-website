-- Live media slot overrides (admin-managed site graphics / videos)
create table if not exists media_slots (
  slot_key text primary key,
  kind text not null default 'image',
  src text,
  poster text,
  alt text,
  caption text,
  notes text,
  updated_at timestamptz not null default now()
);
