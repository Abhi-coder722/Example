create extension if not exists pgcrypto;

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  event_type text not null,
  source text not null default 'web',
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_order_events_order_id_created_at
on public.order_events (order_id, created_at desc);

create index if not exists idx_order_events_event_type
on public.order_events (event_type);

grant select, insert on table public.order_events to anon, authenticated;

alter table public.order_events enable row level security;

drop policy if exists "Public read order events" on public.order_events;
create policy "Public read order events"
on public.order_events
for select
to anon, authenticated
using (true);

drop policy if exists "Public insert order events" on public.order_events;
create policy "Public insert order events"
on public.order_events
for insert
to anon, authenticated
with check (true);
