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

## 4. Configure frontend keys

Edit `supabase-config.js` and set:

- `url`
- `anonKey`
- optional `menuTable`
- optional `customersTable`
- optional `ordersTable`
- optional `orderItemsTable`
- optional `vouchersTable`
- optional `storageBucket`

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

## 6. Optional fallback behavior

`supabase-config.js` has:

```js
useStaticFallback: false
```

Set to `true` if you want temporary local fallback data when Supabase is unavailable.

## 7. One-shot clean import from menu-data.js

To clear old rows and import all current UberEats-derived menu entries:

Option A (recommended): service role key

```bash
cd "/Users/abhishek.patel/Documents/New project-editable"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" node scripts/seed-menu-items.js
```

Option B: owner login (authenticated RLS path)

```bash
cd "/Users/abhishek.patel/Documents/New project-editable"
OWNER_EMAIL="owner@restaurant.com" OWNER_PASSWORD="YOUR_PASSWORD" node scripts/seed-menu-items.js
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
