alter table public.vouchers
add column if not exists min_order_value numeric(10, 2) not null default 0 check (min_order_value >= 0);

update public.vouchers
set min_order_value = 0
where min_order_value is null;

drop function if exists public.validate_voucher_code(text);
drop function if exists public.validate_voucher_code(text, numeric);

create or replace function public.validate_voucher_code(p_code text, p_order_total numeric)
returns table (
  ok boolean,
  error_code text,
  voucher_id uuid,
  code text,
  discount_amount numeric,
  active boolean,
  usage_limit integer,
  times_used integer,
  min_order_value numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_order_total numeric := coalesce(p_order_total, 0);
  v_row public.vouchers%rowtype;
  v_min_order numeric;
begin
  if v_code = '' then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0, 0::numeric;
    return;
  end if;

  select *
  into v_row
  from public.vouchers as v
  where upper(v.code) = v_code
  limit 1;

  if not found then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0, 0::numeric;
    return;
  end if;

  v_min_order := round(greatest(0, coalesce(v_row.min_order_value, 0))::numeric, 2);

  if v_row.active is false then
    return query
      select false, 'inactive', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
    return;
  end if;

  if coalesce(v_row.times_used, 0) >= greatest(1, coalesce(v_row.usage_limit, 1)) then
    return query
      select false, 'usage_limit_reached', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
    return;
  end if;

  if p_order_total is not null and v_order_total < v_min_order then
    return query
      select false, 'minimum_not_reached', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
    return;
  end if;

  return query
    select true, '', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
end;
$$;

create function public.validate_voucher_code(p_code text)
returns table (
  ok boolean,
  error_code text,
  voucher_id uuid,
  code text,
  discount_amount numeric,
  active boolean,
  usage_limit integer,
  times_used integer,
  min_order_value numeric
)
language sql
security definer
set search_path = public
as $$
  select * from public.validate_voucher_code(p_code, null::numeric);
$$;

drop function if exists public.redeem_voucher(text);
drop function if exists public.redeem_voucher(text, numeric);

create or replace function public.redeem_voucher(p_code text, p_order_total numeric)
returns table (
  ok boolean,
  error_code text,
  voucher_id uuid,
  code text,
  discount_amount numeric,
  active boolean,
  usage_limit integer,
  times_used integer,
  min_order_value numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_order_total numeric := coalesce(p_order_total, 0);
  v_row public.vouchers%rowtype;
  v_min_order numeric;
begin
  if v_code = '' then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0, 0::numeric;
    return;
  end if;

  select *
  into v_row
  from public.vouchers as v
  where upper(v.code) = v_code
  for update;

  if not found then
    return query select false, 'not_found', null::uuid, null::text, 0::numeric, false, 0, 0, 0::numeric;
    return;
  end if;

  v_min_order := round(greatest(0, coalesce(v_row.min_order_value, 0))::numeric, 2);

  if v_row.active is false then
    return query
      select false, 'inactive', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
    return;
  end if;

  if coalesce(v_row.times_used, 0) >= greatest(1, coalesce(v_row.usage_limit, 1)) then
    return query
      select false, 'usage_limit_reached', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
    return;
  end if;

  if p_order_total is not null and v_order_total < v_min_order then
    return query
      select false, 'minimum_not_reached', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
    return;
  end if;

  update public.vouchers as v
  set times_used = coalesce(v.times_used, 0) + 1,
      updated_at = timezone('utc', now())
  where v.id = v_row.id
  returning * into v_row;

  return query
    select true, '', v_row.id, v_row.code, v_row.discount_amount, v_row.active, v_row.usage_limit, v_row.times_used, v_min_order;
end;
$$;

create function public.redeem_voucher(p_code text)
returns table (
  ok boolean,
  error_code text,
  voucher_id uuid,
  code text,
  discount_amount numeric,
  active boolean,
  usage_limit integer,
  times_used integer,
  min_order_value numeric
)
language sql
security definer
set search_path = public
as $$
  select * from public.redeem_voucher(p_code, null::numeric);
$$;

grant execute on function public.validate_voucher_code(text) to anon, authenticated;
grant execute on function public.validate_voucher_code(text, numeric) to anon, authenticated;
grant execute on function public.redeem_voucher(text) to anon, authenticated;
grant execute on function public.redeem_voucher(text, numeric) to anon, authenticated;

insert into public.vouchers (code, discount_amount, min_order_value, active, usage_limit, times_used)
values
  ('DEUTSCHLAND5', 5, 45, true, 5000, 0),
  ('DE5', 5, 45, true, 5000, 0)
on conflict ((upper(code))) do update
set discount_amount = excluded.discount_amount,
    min_order_value = excluded.min_order_value,
    active = true,
    usage_limit = excluded.usage_limit,
    updated_at = timezone('utc', now());
