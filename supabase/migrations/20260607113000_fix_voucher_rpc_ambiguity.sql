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

  select v.*
  into v_row
  from public.vouchers as v
  where upper(v.code) = v_code
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

  select v.*
  into v_row
  from public.vouchers as v
  where upper(v.code) = v_code
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

grant execute on function public.validate_voucher_code(text) to anon, authenticated;
grant execute on function public.redeem_voucher(text) to anon, authenticated;
