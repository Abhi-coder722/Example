# Local JSON Database Setup

This app now uses a local JSON file for CRUD instead of Supabase.

## Run

```bash
npm run dev
```

The server serves the site and API from the same origin. By default it runs at:

```text
http://localhost:3000
```

If that port is busy:

```bash
PORT=3123 npm run dev
```

## Data File

The database is stored at:

```text
data/db.json
```

On first API access, `server.js` creates the file and seeds menu items from `menu-data.js`.

## Admin Login

Admin credentials live in environment variables, not frontend JavaScript:

```bash
BAGO_ADMIN_EMAIL=owner@example.com
BAGO_ADMIN_PASSWORD=change-me
```

You can put them in `.env` for local development.

## Venue Settings

Public restaurant/site details are also read from environment variables:

```bash
BAGO_VENUE_NAME="Demo Sushi House"
BAGO_VENUE_CITY="Demo City"
BAGO_VENUE_ADDRESS="Sample Street 12, 12345 Demo City"
BAGO_VENUE_HERO_IMAGE="assets/hero-table.png"
BAGO_VENUE_LOGO_IMAGE="assets/demo-logo.svg"
BAGO_PICKUP_LAT=48.76340717227785
BAGO_PICKUP_LNG=11.42234503860289
BAGO_ORDER_MINIMUM=12
BAGO_PREPARATION_TIME="25-35 Min"
BAGO_SERVICE_FEE_PERCENT=0
BAGO_SERVICE_FEE_MIN=0
BAGO_SERVICE_FEE_MAX=0
BAGO_LEGAL_PROVIDER_NAME="Demo Sushi House"
BAGO_LEGAL_ADDRESS="Sample Street 12, 12345 Demo City"
BAGO_LEGAL_CONTACT="+491234567890, owner@example.com"
BAGO_LEGAL_REPRESENTATIVE="Example Owner"
```

## Checkout Settings

These optional values are also read by `server.js`:

```bash
BAGO_WHATSAPP_NUMBER=+491234567890
BAGO_PAYPAL_EMAIL=owner@example.com
BAGO_PAYPAL_ENABLED=false
BAGO_PAYPAL_SANDBOX=false
BAGO_SITE_URL=https://example.com
```

## Cloudflare Pages + D1 deployment

The production API is implemented in `functions/api/[[path]].js`. Cloudflare
Pages runs it automatically for every `/api/*` request; do not configure a
build command or a static API rewrite.

1. Create a **D1 database** in Cloudflare. In the Pages project's **Settings →
   Bindings**, add it with the variable name `BAGO_DB`.
2. In **Settings → Variables and secrets**, add `BAGO_ADMIN_EMAIL` and
   `BAGO_ADMIN_PASSWORD` as secrets. Add `BAGO_SESSION_SECRET` as a secret
   too, using a long random value (at least 32 characters).
3. Add the optional `BAGO_*` venue and checkout variables there if used.
4. Redeploy. On its first API request, the function creates its D1 table and
   imports the current `data/db.json` menu/opening-hour data once.

The D1 binding does not expose its credentials to the browser. Do not put the
admin password or session secret in frontend JavaScript.
