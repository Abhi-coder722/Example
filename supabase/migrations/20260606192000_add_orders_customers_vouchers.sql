create extension if not exists pgcrypto;

-- Shared trigger to keep updated_at in sync.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  phone_normalized text not null,
  email text,
  email_normalized text,
  created_at timestamptz not null default timezone('utc', now()),
  last_activity_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists idx_customers_phone_normalized_unique on public.customers (phone_normalized);
create unique index if not exists idx_customers_email_normalized_unique on public.customers (email_normalized)
where email_normalized is not null;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  order_total numeric(10, 2) not null check (order_total >= 0),
  payment_method text not null,
  order_status text not null default 'pending_confirmation',
  payment_reference text,
  voucher_code text,
  voucher_discount numeric(10, 2) not null default 0 check (voucher_discount >= 0),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  ordered_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_orders_customer_id on public.orders (customer_id);
create index if not exists idx_orders_ordered_at on public.orders (ordered_at desc);
create index if not exists idx_orders_status on public.orders (order_status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id text not null,
  item_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  discount_amount numeric(10, 2) not null check (discount_amount > 0),
  active boolean not null default true,
  usage_limit integer not null default 1 check (usage_limit > 0),
  times_used integer not null default 0 check (times_used >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists idx_vouchers_code_upper_unique on public.vouchers ((upper(code)));
create index if not exists idx_vouchers_active on public.vouchers (active);

create or replace function public.normalize_customer_contact_fields()
returns trigger
language plpgsql
as $$
begin
  new.phone_normalized = regexp_replace(
    coalesce(nullif(trim(new.phone_normalized), ''), coalesce(new.phone, '')),
    '[^0-9+]',
    '',
    'g'
  );
  new.email_normalized = nullif(lower(trim(coalesce(nullif(new.email_normalized, ''), new.email, ''))), '');
  return new;
end;
$$;

create or replace function public.normalize_voucher_code_field()
returns trigger
language plpgsql
as $$
begin
  new.code = upper(trim(coalesce(new.code, '')));
  if new.code = '' then
    raise exception 'Voucher code is required.';
  end if;
  return new;
end;
$$;

create or replace function public.set_order_item_line_total()
returns trigger
language plpgsql
as $$
begin
  new.quantity = greatest(1, coalesce(new.quantity, 1));
  new.unit_price = round(coalesce(new.unit_price, 0)::numeric, 2);
  new.line_total = round((new.unit_price * new.quantity)::numeric, 2);
  return new;
end;
$$;

drop trigger if exists trg_customers_normalize_contact on public.customers;
create trigger trg_customers_normalize_contact
before insert or update on public.customers
for each row
execute function public.normalize_customer_contact_fields();

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at
before update on public.customers
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_vouchers_normalize_code on public.vouchers;
create trigger trg_vouchers_normalize_code
before insert or update on public.vouchers
for each row
execute function public.normalize_voucher_code_field();

drop trigger if exists trg_vouchers_updated_at on public.vouchers;
create trigger trg_vouchers_updated_at
before update on public.vouchers
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_order_items_set_line_total on public.order_items;
create trigger trg_order_items_set_line_total
before insert or update on public.order_items
for each row
execute function public.set_order_item_line_total();

create or replace function public.validate_voucher_code(p_code text)
returns table (
  ok boolean,
  error_code text,
  voucher_id uuid,
  code text,
  discount_amount numeric,
  active boolean,
  usage_limit integer,
  times_used integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_row public.vouchers%rowtype;
begin
  if v_code = '' then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0;
    return;
  end if;

  select *
  into v_row
  from public.vouchers
  where upper(code) = v_code
  limit 1;

  if not found then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0;
    return;
  end if;

  if v_row.active is false then
    return query
      select false, 'inactive', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used;
    return;
  end if;

  if coalesce(v_row.times_used, 0) >= greatest(1, coalesce(v_row.usage_limit, 1)) then
    return query
      select false, 'usage_limit_reached', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used;
    return;
  end if;

  return query
    select true, '', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used;
end;
$$;

create or replace function public.redeem_voucher(p_code text)
returns table (
  ok boolean,
  error_code text,
  voucher_id uuid,
  code text,
  discount_amount numeric,
  active boolean,
  usage_limit integer,
  times_used integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_row public.vouchers%rowtype;
begin
  if v_code = '' then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0;
    return;
  end if;

  select *
  into v_row
  from public.vouchers
  where upper(code) = v_code
  for update;

  if not found then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0;
    return;
  end if;

  if v_row.active is false then
    return query
      select false, 'inactive', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used;
    return;
  end if;

  if coalesce(v_row.times_used, 0) >= greatest(1, coalesce(v_row.usage_limit, 1)) then
    return query
      select false, 'usage_limit_reached', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used;
    return;
  end if;

  update public.vouchers
  set times_used = coalesce(times_used, 0) + 1,
      updated_at = timezone('utc', now())
  where id = v_row.id
  returning * into v_row;

  return query
    select true, '', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used;
end;
$$;

grant usage on schema public to anon, authenticated;

grant select, insert, update on table public.customers to anon, authenticated;
grant select, insert, update on table public.orders to anon, authenticated;
grant insert on table public.order_items to anon, authenticated;
grant select on table public.vouchers to authenticated;
grant insert, update, delete on table public.vouchers to authenticated;

grant execute on function public.validate_voucher_code(text) to anon, authenticated;
grant execute on function public.redeem_voucher(text) to anon, authenticated;

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.vouchers enable row level security;

-- customers policies

drop policy if exists "Public read customers" on public.customers;
create policy "Public read customers"
on public.customers
for select
to anon, authenticated
using (true);

drop policy if exists "Public insert customers" on public.customers;
create policy "Public insert customers"
on public.customers
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public update customers" on public.customers;
create policy "Public update customers"
on public.customers
for update
to anon, authenticated
using (true)
with check (true);

-- orders policies

drop policy if exists "Public read orders" on public.orders;
create policy "Public read orders"
on public.orders
for select
to anon, authenticated
using (true);

drop policy if exists "Public insert orders" on public.orders;
create policy "Public insert orders"
on public.orders
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public update orders" on public.orders;
create policy "Public update orders"
on public.orders
for update
to anon, authenticated
using (true)
with check (true);

-- order_items policies

drop policy if exists "Public read order items" on public.order_items;
create policy "Public read order items"
on public.order_items
for select
to anon, authenticated
using (true);

drop policy if exists "Public insert order items" on public.order_items;
create policy "Public insert order items"
on public.order_items
for insert
to anon, authenticated
with check (true);

-- vouchers policies

drop policy if exists "Authenticated manage vouchers" on public.vouchers;
create policy "Authenticated manage vouchers"
on public.vouchers
for all
to authenticated
using (true)
with check (true);
