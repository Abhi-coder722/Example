create extension if not exists pgcrypto;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  price numeric(10,2) not null default 0,
  available boolean not null default true,
  image_url text,
  image text,

  -- Compatibility columns
  name text,
  description text,

  -- Multilingual fields
  name_de text not null,
  name_en text,
  name_ru text,
  name_ja text,
  name_tr text,

  description_de text,
  description_en text,
  description_ru text,
  description_ja text,
  description_tr text,

  -- Optional JSON mirrors for future language expansion
  name_translations jsonb not null default '{}'::jsonb,
  description_translations jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_menu_items_category on public.menu_items (category);
create index if not exists idx_menu_items_available on public.menu_items (available);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_menu_items_updated_at on public.menu_items;
create trigger trg_menu_items_updated_at
before update on public.menu_items
for each row
execute function public.touch_updated_at();

alter table public.menu_items enable row level security;

drop policy if exists "Public read menu" on public.menu_items;
create policy "Public read menu"
on public.menu_items
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated insert menu" on public.menu_items;
create policy "Authenticated insert menu"
on public.menu_items
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated update menu" on public.menu_items;
create policy "Authenticated update menu"
on public.menu_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated delete menu" on public.menu_items;
create policy "Authenticated delete menu"
on public.menu_items
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public read menu images" on storage.objects;
create policy "Public read menu images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'menu-images');

drop policy if exists "Authenticated upload menu images" on storage.objects;
create policy "Authenticated upload menu images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated update menu images" on storage.objects;
create policy "Authenticated update menu images"
on storage.objects
for update
to authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated delete menu images" on storage.objects;
create policy "Authenticated delete menu images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'menu-images');
