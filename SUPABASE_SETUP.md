# Supabase Setup (Bago Sushi & Asian)

## 1. Install and login (local machine)

```bash
npm install -g supabase
supabase --version
supabase login
```

## 2. Initialize and link project

Run inside this website folder:

```bash
supabase init
supabase link --project-ref YOUR_PROJECT_ID
```

## 3. Apply migration

```bash
supabase db push
```

This applies:

- `supabase/migrations/20260606170000_create_menu_items.sql`
- `supabase/migrations/20260606192000_add_orders_customers_vouchers.sql`
- `menu_items` table
- `customers`, `orders`, `order_items`, `vouchers` tables
- RLS policies
- voucher RPCs: `validate_voucher_code`, `redeem_voucher`
- `menu-images` public storage bucket + policies

## 4. Configure environment variables

1. Copy `.env.example` to `.env`
2. Fill your own values in `.env`
3. Generate local runtime config:

```bash
cd "/Users/abhishek.patel/Documents/New project-editable"
npm run config:build
```

This creates a local `supabase-config.js` from `.env` (ignored by git).

## 5. Owner login for /admin

In Supabase Dashboard:

- `Authentication -> Users`
- create owner user (email/password)

Then open:

- `/admin/`

Capabilities:

- login/logout
- add item
- edit item
- delete item
- sold-out toggle
- image upload to Supabase Storage
- voucher create/edit/delete
- voucher active/inactive toggle
- usage-limit management

## 6. Fallback behavior

`useStaticFallback` is set in the generated runtime config and is no longer read from `.env`.

## 7. One-shot clean import from menu-data.js

To clear old rows and import all current UberEats-derived menu entries:

Option A (recommended): put `SUPABASE_SERVICE_ROLE_KEY` in `.env` and run:

```bash
cd "/Users/abhishek.patel/Documents/New project-editable"
node scripts/seed-menu-items.js
```

Option B: owner login (authenticated RLS path). Put `OWNER_EMAIL` + `OWNER_PASSWORD` in `.env`, then:

```bash
cd "/Users/abhishek.patel/Documents/New project-editable"
node scripts/seed-menu-items.js
```

This script will:

- delete all rows in `menu_items`
- insert all items from `menu-data.js`
- print final row count

## 8. Run automated release checks

```bash
cd "/Users/abhishek.patel/Documents/New project-editable"
npm test
```

Covers:

- voucher logic (valid/invalid/inactive/usage limit)
- customer + order persistence logic
- image-first / compact menu layout rules
- end-to-end checkout flow simulation with returning-customer matching
