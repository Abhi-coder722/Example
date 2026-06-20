#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function fail(message, extra) {
  console.error(message);
  if (extra) {
    console.error(typeof extra === 'string' ? extra : JSON.stringify(extra, null, 2));
  }
  process.exit(1);
}

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

function applyDotEnv(projectRoot) {
  const envPath = path.join(projectRoot, '.env');
  if (!fs.existsSync(envPath)) return {};

  const parsed = parseEnv(fs.readFileSync(envPath, 'utf8'));
  Object.entries(parsed).forEach(([key, value]) => {
    if (process.env[key] == null || process.env[key] === '') {
      process.env[key] = value;
    }
  });

  return parsed;
}

function loadSupabaseConfig(projectRoot) {
  const fromEnv = {
    url: String(process.env.BAGO_SUPABASE_URL || process.env.SUPABASE_URL || '').trim(),
    anonKey: String(process.env.BAGO_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim(),
    vouchersTable: 'vouchers'
  };

  if (fromEnv.url && fromEnv.anonKey) {
    return fromEnv;
  }

  const configPath = path.join(projectRoot, 'supabase-config.js');
  if (!fs.existsSync(configPath)) {
    fail(
      'Missing Supabase config. Set BAGO_SUPABASE_URL and BAGO_SUPABASE_ANON_KEY in .env, then run npm run config:build.'
    );
  }

  const raw = fs.readFileSync(configPath, 'utf8');
  const match = raw.match(/window\.BAGO_SUPABASE\s*=\s*(\{[\s\S]*?\});?/);
  if (!match) fail('Could not parse supabase-config.js');
  return vm.runInNewContext(`(${match[1]})`);
}

async function restJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return {
    ok: response.ok,
    status: response.status,
    body
  };
}

async function getOwnerAccessToken(url, anonKey) {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    return null;
  }

  const authUrl = `${url}/auth/v1/token?grant_type=password`;
  const result = await restJson(authUrl, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!result.ok || !result.body?.access_token) {
    fail('Owner login failed. Check OWNER_EMAIL / OWNER_PASSWORD.', result);
  }

  return result.body.access_token;
}

function buildAuthHeaders(anonKey, token) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

async function detectMinimumOrderColumn(baseUrl, headers) {
  const result = await restJson(`${baseUrl}?select=id,min_order_value&limit=1`, {
    method: 'GET',
    headers
  });

  if (result.ok) return true;
  if (/min_order_value|column .* does not exist/i.test(JSON.stringify(result.body || ''))) {
    return false;
  }

  fail('Could not verify vouchers schema.', result);
}

async function findVoucher(baseUrl, headers, code) {
  const encodedCode = encodeURIComponent(code);
  const result = await restJson(`${baseUrl}?select=id,code,times_used&code=eq.${encodedCode}&limit=1`, {
    method: 'GET',
    headers
  });

  if (!result.ok) {
    fail(`Failed to lookup voucher ${code}.`, result);
  }

  return Array.isArray(result.body) && result.body.length ? result.body[0] : null;
}

async function upsertVoucher(baseUrl, headers, voucherPayload) {
  const existing = await findVoucher(baseUrl, headers, voucherPayload.code);

  if (existing) {
    const updateResult = await restJson(`${baseUrl}?id=eq.${encodeURIComponent(existing.id)}`, {
      method: 'PATCH',
      headers: {
        ...headers,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(voucherPayload)
    });

    if (!updateResult.ok) {
      fail(`Failed to update voucher ${voucherPayload.code}.`, updateResult);
    }
    return { code: voucherPayload.code, action: 'updated' };
  }

  const createResult = await restJson(baseUrl, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      ...voucherPayload,
      times_used: 0
    })
  });

  if (!createResult.ok) {
    fail(`Failed to create voucher ${voucherPayload.code}.`, createResult);
  }

  return { code: voucherPayload.code, action: 'created' };
}

async function main() {
  const projectRoot = process.cwd();
  applyDotEnv(projectRoot);
  const config = loadSupabaseConfig(projectRoot);

  const url = String(config.url || '').trim();
  const anonKey = String(config.anonKey || '').trim();
  const table = String(config.vouchersTable || 'vouchers').trim();

  if (!url || !anonKey) {
    fail('Missing Supabase url or anonKey in configuration.');
  }

  const serviceRole = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const ownerToken = serviceRole ? null : await getOwnerAccessToken(url, anonKey);
  const token = serviceRole || ownerToken;

  if (!token) {
    fail(
      'Auth token missing. Provide SUPABASE_SERVICE_ROLE_KEY, or OWNER_EMAIL + OWNER_PASSWORD in .env.'
    );
  }

  const base = `${url}/rest/v1/${table}`;
  const headers = buildAuthHeaders(anonKey, token);
  const supportsMinOrder = await detectMinimumOrderColumn(base, headers);

  const payloadCommon = {
    discount_amount: 5,
    active: true,
    usage_limit: 5000
  };

  const vouchers = ['DEUTSCHLAND5', 'DE5'].map((code) => ({
    ...payloadCommon,
    code,
    ...(supportsMinOrder ? { min_order_value: 45 } : {})
  }));

  const results = [];
  for (const voucher of vouchers) {
    const row = await upsertVoucher(base, headers, voucher);
    results.push(row);
  }

  console.log(`Campaign vouchers ensured in '${table}':`);
  results.forEach((row) => {
    console.log(`- ${row.code}: ${row.action}`);
  });

  if (!supportsMinOrder) {
    console.log(
      'Warning: min_order_value column not found yet. Apply latest migration to persist 45 EUR minimum in DB schema.'
    );
  }
}

main().catch((error) => fail('Unexpected voucher script error.', error.message || String(error)));
