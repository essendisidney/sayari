-- Snapshot + relational foundation for Sayari.
-- Apply via Supabase SQL editor or: supabase db push

create extension if not exists pgcrypto;

create table if not exists public.app_store (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_store enable row level security;
