#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseEnv(raw) {
  const values = {};

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value.replace(/\\n/g, '\n');
  });

  return values;
}

function readEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing .env file at ${envPath}`);
  }
  return parseEnv(fs.readFileSync(envPath, 'utf8'));
}

function pick(envValues, key, fallback = '') {
  if (Object.prototype.hasOwnProperty.call(envValues, key)) {
    return envValues[key];
  }
  return fallback;
}

function asBool(value, fallback = false) {
  if (value == null || String(value).trim() === '') return fallback;
  return /^(1|true|yes|on)$/i.test(String(value).trim());
}

function main() {
  const root = process.cwd();
  const envPath = path.join(root, '.env');
  const envValues = {
    ...readEnvFile(envPath),
    ...process.env
  };

  const supabaseConfig = {
    url: pick(envValues, 'BAGO_SUPABASE_URL', ''),
    anonKey: pick(envValues, 'BAGO_SUPABASE_ANON_KEY', ''),
    menuTable: pick(envValues, 'BAGO_SUPABASE_MENU_TABLE', 'menu_items'),
    customersTable: pick(envValues, 'BAGO_SUPABASE_CUSTOMERS_TABLE', 'customers'),
    ordersTable: pick(envValues, 'BAGO_SUPABASE_ORDERS_TABLE', 'orders'),
    orderItemsTable: pick(envValues, 'BAGO_SUPABASE_ORDER_ITEMS_TABLE', 'order_items'),
    vouchersTable: pick(envValues, 'BAGO_SUPABASE_VOUCHERS_TABLE', 'vouchers'),
    storageBucket: pick(envValues, 'BAGO_SUPABASE_STORAGE_BUCKET', 'menu-images'),
    useStaticFallback: asBool(pick(envValues, 'BAGO_SUPABASE_USE_STATIC_FALLBACK', 'false'), false)
  };

  const privateConfig = {
    venue: {
      whatsappNumber: pick(envValues, 'BAGO_WHATSAPP_NUMBER', ''),
      paypalEmail: pick(envValues, 'BAGO_PAYPAL_EMAIL', '')
    }
  };

  const output = [
    '// Auto-generated from .env via scripts/generate-supabase-config.js',
    `window.BAGO_SUPABASE = ${JSON.stringify(supabaseConfig, null, 2)};`,
    '',
    `window.BAGO_PRIVATE = ${JSON.stringify(privateConfig, null, 2)};`,
    ''
  ].join('\n');

  const outputPath = path.join(root, 'supabase-config.js');
  fs.writeFileSync(outputPath, output);
  console.log(`Generated ${outputPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.message || String(error));
  process.exit(1);
}
