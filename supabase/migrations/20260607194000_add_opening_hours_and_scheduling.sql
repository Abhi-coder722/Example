create extension if not exists pgcrypto;

create table if not exists public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_closed boolean not null default false,
  opens_at time,
  closes_at time,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (day_of_week),
  constraint opening_hours_time_window_chk check (
    is_closed = true
    or (
      opens_at is not null
      and closes_at is not null
      and closes_at > opens_at
    )
  )
);

insert into public.opening_hours (day_of_week, is_closed, opens_at, closes_at)
values
  (1, false, '11:30', '20:00'),
  (2, false, '11:30', '20:00'),
  (3, false, '11:30', '20:00'),
  (4, false, '11:30', '20:00'),
  (5, false, '11:30', '20:00'),
  (6, false, '13:00', '20:00'),
  (0, true, null, null)
on conflict (day_of_week) do update
set
  is_closed = excluded.is_closed,
  opens_at = excluded.opens_at,
  closes_at = excluded.closes_at,
  updated_at = timezone('utc', now());

create index if not exists idx_opening_hours_day on public.opening_hours (day_of_week);

alter table public.opening_hours enable row level security;

drop policy if exists "Public read opening hours" on public.opening_hours;
create policy "Public read opening hours"
on public.opening_hours
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated manage opening hours" on public.opening_hours;
create policy "Authenticated manage opening hours"
on public.opening_hours
for all
to authenticated
using (true)
with check (true);

grant select on table public.opening_hours to anon, authenticated;
grant insert, update, delete on table public.opening_hours to authenticated;

drop trigger if exists trg_opening_hours_updated_at on public.opening_hours;
create trigger trg_opening_hours_updated_at
before update on public.opening_hours
for each row
execute function public.touch_updated_at();

alter table public.orders
  add column if not exists is_scheduled boolean not null default false,
  add column if not exists scheduled_for timestamptz;

alter table public.orders
  drop constraint if exists orders_scheduled_columns_chk;

alter table public.orders
  add constraint orders_scheduled_columns_chk
  check (
    (is_scheduled = false and scheduled_for is null)
    or (is_scheduled = true and scheduled_for is not null)
  );

create index if not exists idx_orders_scheduled_for on public.orders (scheduled_for);
create index if not exists idx_orders_is_scheduled on public.orders (is_scheduled);
