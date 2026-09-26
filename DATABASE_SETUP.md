# JSON Database Setup

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

## Checkout Settings

These optional values are also read by `server.js`:

```bash
BAGO_WHATSAPP_NUMBER=+491234567890
BAGO_PAYPAL_EMAIL=owner@example.com
BAGO_PAYPAL_ENABLED=false
BAGO_PAYPAL_SANDBOX=false
BAGO_SITE_URL=https://example.com
```
