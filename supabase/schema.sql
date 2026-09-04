-- Sayari core: identity, rail commerce, ReWear, community.
-- App server uses service role. RLS on; no anon policies for private tables.
-- Also includes app_store jsonb document for atomic snapshot persistence.

create extension if not exists pgcrypto;

-- Snapshot document (primary persistence bridge for the current store)
create table if not exists public.app_store (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_store enable row level security;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  sayari_id text not null unique,
  phone text not null unique,
  display_name text not null,
  shoe_size numeric(4, 1),
  gender_preference text,
  favourite_categories text[] not null default '{}',
  favourite_brands text not null default '',
  buy_frequency text,
  budget_band text,
  current_shops text,
  frustrations text,
  would_trade boolean not null default false,
  wants_recommendations boolean not null default true,
  founding_number integer unique,
  founding_tier text,
  points integer not null default 0,
  credit_kes integer not null default 0,
  phone_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.closet_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  brand text,
  size numeric(4, 1),
  category text,
  bought_on text,
  usage text,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  amount integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.otps (
  phone text primary key,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  token_hash text primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rail_pairs (
  id text primary key,
  brand text not null,
  model text not null,
  size numeric(4, 1) not null,
  category text not null,
  grade text not null,
  grade_score text not null,
  found text not null,
  price text not null,
  price_kes integer not null,
  last_seen text not null,
  image text not null,
  status text not null,
  story text not null default '',
  held_until timestamptz,
  held_by_profile_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.find_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  size numeric(4, 1) not null,
  budget_max_kes integer not null,
  category text not null,
  colours text,
  notes text,
  match_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.rewear_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  closet_item_id uuid,
  brand text not null,
  model text not null,
  size numeric(4, 1) not null,
  category text not null,
  grade_id text not null,
  grade_label text not null,
  grade_score text not null,
  usage text,
  found_neighbourhood text not null,
  image_url text,
  notes text,
  estimated_value_kes integer not null,
  credit_kes integer not null,
  resale_kes integer not null,
  status text not null,
  rail_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  amount integer not null,
  reason text not null,
  rewear_id uuid,
  order_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  rail_id text not null,
  brand text not null,
  model text not null,
  size numeric(4, 1) not null,
  image text,
  price_kes integer not null,
  credit_applied integer not null default 0,
  mpesa_due integer not null default 0,
  mpesa_ref text,
  payment_method text not null default 'NONE',
  pickup text not null,
  status text not null,
  reserved_until timestamptz not null,
  paid_at timestamptz,
  ready_at timestamptz,
  collected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spotted_posts (
  id uuid primary key default gen_random_uuid(),
  profile_id text not null,
  sayari_id text not null,
  display_name text not null,
  caption text not null,
  neighbourhood text not null,
  lane text not null,
  image_url text not null,
  rail_id text,
  votes integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.spotted_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.spotted_posts (id) on delete cascade,
  profile_id uuid not null,
  created_at timestamptz not null default now(),
  unique (post_id, profile_id)
);

create index if not exists closet_items_profile_idx on public.closet_items (profile_id);
create index if not exists wishlist_items_profile_idx on public.wishlist_items (profile_id);
create index if not exists points_ledger_profile_idx on public.points_ledger (profile_id);
create index if not exists sessions_profile_idx on public.sessions (profile_id);
create index if not exists rail_pairs_status_idx on public.rail_pairs (status);
create index if not exists orders_profile_idx on public.orders (profile_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists rewear_profile_idx on public.rewear_submissions (profile_id);
create index if not exists spotted_votes_count_idx on public.spotted_posts (votes desc);

alter table public.profiles enable row level security;
alter table public.closet_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.points_ledger enable row level security;
alter table public.otps enable row level security;
alter table public.sessions enable row level security;
alter table public.rail_pairs enable row level security;
alter table public.find_requests enable row level security;
alter table public.rewear_submissions enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.orders enable row level security;
alter table public.spotted_posts enable row level security;
alter table public.spotted_votes enable row level security;

-- Public read for rail + spotted (brand surface). Writes stay service-role only.
create policy "Public can read rail"
  on public.rail_pairs for select
  to anon, authenticated
  using (true);

create policy "Public can read spotted"
  on public.spotted_posts for select
  to anon, authenticated
  using (true);
