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
  if (!fs.existsSync(envPath)) {
    return {};
  }

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
    menuTable: 'menu_items'
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

function loadMenuData(projectRoot) {
  const menuPath = path.join(projectRoot, 'menu-data.js');
  const code = fs.readFileSync(menuPath, 'utf8');
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(`${code}\n;globalThis.__menu = { venue: BAGO_VENUE, categories: BAGO_CATEGORIES };`, context);
  return context.__menu;
}

function buildRows(categories) {
  const rows = [];

  for (const category of categories || []) {
    for (const item of category.items || []) {
      rows.push({
        id: item.id,
        category: category.name,
        price: Number(item.price || 0),
        available: true,
        image_url: item.image || '',
        image: item.image || '',
        name: item.name || '',
        description: item.description || '',
        name_de: item.name || '',
        name_en: '',
        name_ru: '',
        name_ja: '',
        name_tr: '',
        description_de: item.description || '',
        description_en: '',
        description_ru: '',
        description_ja: '',
        description_tr: '',
        name_translations: {
          de: item.name || ''
        },
        description_translations: {
          de: item.description || ''
        }
      });
    }
  }

  return rows;
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

async function main() {
  const projectRoot = process.cwd();
  applyDotEnv(projectRoot);
  const config = loadSupabaseConfig(projectRoot);
  const menu = loadMenuData(projectRoot);
  const rows = buildRows(menu.categories);

  const url = String(config.url || '').trim();
  const anonKey = String(config.anonKey || '').trim();
  const table = String(config.menuTable || 'menu_items').trim();

  if (!url || !anonKey) {
    fail('Missing Supabase url or anonKey in supabase-config.js');
  }

  const serviceRole = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const ownerToken = serviceRole ? null : await getOwnerAccessToken(url, anonKey);
  const token = serviceRole || ownerToken;

  if (!token) {
    fail(
      'Auth token missing. Provide either SUPABASE_SERVICE_ROLE_KEY, or OWNER_EMAIL + OWNER_PASSWORD as environment variables.'
    );
  }

  const base = `${url}/rest/v1/${table}`;
  const headers = buildAuthHeaders(anonKey, token);

  console.log(`Seeding '${table}' with ${rows.length} rows from menu-data.js`);

  const del = await restJson(`${base}?id=not.is.null`, {
    method: 'DELETE',
    headers: {
      ...headers,
      Prefer: 'return=minimal'
    }
  });

  if (!del.ok) {
    fail('DELETE failed while clearing existing rows.', del);
  }

  const chunkSize = 50;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const ins = await restJson(base, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(chunk)
    });

    if (!ins.ok) {
      fail(`INSERT failed for chunk ${i / chunkSize + 1}.`, ins);
    }
  }

  const verify = await restJson(`${base}?select=id`, {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`
    }
  });

  if (!verify.ok || !Array.isArray(verify.body)) {
    fail('Verification query failed.', verify);
  }

  console.log(`Done. Database now has ${verify.body.length} rows in '${table}'.`);
}

main().catch((error) => fail('Unexpected seeding error.', error.message || String(error)));
