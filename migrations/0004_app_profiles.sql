-- App-level roles / toolbox entitlement (Better Auth owns identity).
create table if not exists app_profiles (
  user_id text primary key,
  email text,
  display_name text,
  toolbox_access boolean not null default false,
  toolbox_status text not null default 'none',
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_profiles_email_idx on app_profiles (lower(coalesce(email, '')));
create index if not exists app_profiles_toolbox_idx on app_profiles (toolbox_access);

create table if not exists toolbox_sessions (
  token text primary key,
  user_id text not null,
  email text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked boolean not null default false
);

create index if not exists toolbox_sessions_user_idx on toolbox_sessions (user_id);
