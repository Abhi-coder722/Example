alter table public.menu_items
add column if not exists is_popular boolean not null default false;

update public.menu_items
set is_popular = false
where is_popular is null;

create index if not exists menu_items_is_popular_idx
on public.menu_items (is_popular);
