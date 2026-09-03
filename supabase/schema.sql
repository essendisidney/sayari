-- Sayari identity foundation.
-- Phase 0 captures founding members. Closet / wishlist / loyalty
-- live on the same customer so commerce can sit on top later.
-- Apply in the Supabase SQL editor once the project is linked.
-- Writes go through the app server (service role). RLS stays on.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  sayari_id text not null unique,
  phone text not null unique,
  display_name text not null,
  shoe_size numeric(4, 1),
  gender_preference text,
  favourite_categories text[] not null default '{}',
  favourite_brands text[] not null default '{}',
  budget_min_kes integer,
  budget_max_kes integer,
  buy_frequency text,
  current_shops text,
  frustrations text,
  would_trade boolean,
  wants_recommendations boolean,
  founding_number integer unique,
  founding_tier text,
  points integer not null default 0,
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
  bought_on date,
  usage text,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
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

create index if not exists closet_items_profile_idx
  on public.closet_items (profile_id);

create index if not exists wishlists_profile_idx
  on public.wishlists (profile_id);

create index if not exists points_ledger_profile_idx
  on public.points_ledger (profile_id);

alter table public.profiles enable row level security;
alter table public.closet_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.points_ledger enable row level security;
