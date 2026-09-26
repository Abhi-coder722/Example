#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { URL } = require('node:url');

const biz = require('./shared/business-logic.js');

const root = __dirname;
const dataDir = path.join(root, 'data');
const dbPath = path.join(dataDir, 'db.json');
const sessions = new Map();

function parseEnv(raw) {
  const values = {};
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index <= 0) return;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value.replace(/\\n/g, '\n');
  });
  return values;
}

function loadEnv() {
  const envPath = path.join(root, '.env');
  const fileValues = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, 'utf8')) : {};
  return { ...fileValues, ...process.env };
}

const env = loadEnv();
const adminEmail = String(env.BAGO_ADMIN_EMAIL || env.OWNER_EMAIL || '').trim();
const adminPassword = String(env.BAGO_ADMIN_PASSWORD || env.OWNER_PASSWORD || '').trim();

function jsonResponse(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 15 * 1024 * 1024) {
        reject(new Error('Request body is too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function getDefaultOpeningHours() {
  return [
    { day_of_week: 0, is_closed: true, opens_at: '', closes_at: '' },
    { day_of_week: 1, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
    { day_of_week: 2, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
    { day_of_week: 3, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
    { day_of_week: 4, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
    { day_of_week: 5, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
    { day_of_week: 6, is_closed: false, opens_at: '13:00', closes_at: '20:00' }
  ];
}

function rowFromStaticItem(item, categoryName) {
  const name = String(item?.name || '').trim();
  const description = String(item?.description || '').trim();
  return {
    id: String(item?.id || crypto.randomUUID()),
    category: String(categoryName || 'Menu').trim() || 'Menu',
    price: Number.parseFloat(item?.price) || 0,
    available: item?.available !== false,
    is_popular: item?.isPopular === true || item?.is_popular === true,
    image_url: String(item?.image || item?.image_url || '').trim(),
    image: String(item?.image || item?.image_url || '').trim(),
    name,
    description,
    name_de: item?.nameTranslations?.de || name,
    name_en: item?.nameTranslations?.en || '',
    name_ru: item?.nameTranslations?.ru || '',
    name_ja: item?.nameTranslations?.ja || '',
    name_tr: item?.nameTranslations?.tr || '',
    description_de: item?.descriptionTranslations?.de || description,
    description_en: item?.descriptionTranslations?.en || '',
    description_ru: item?.descriptionTranslations?.ru || '',
    description_ja: item?.descriptionTranslations?.ja || '',
    description_tr: item?.descriptionTranslations?.tr || '',
    name_translations: item?.nameTranslations || (name ? { de: name } : {}),
    description_translations: item?.descriptionTranslations || (description ? { de: description } : {}),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function loadStaticMenuRows() {
  const menuPath = path.join(root, 'menu-data.js');
  if (!fs.existsSync(menuPath)) return [];
  const raw = fs.readFileSync(menuPath, 'utf8');
  const match = raw.match(/const\s+BAGO_CATEGORIES\s*=\s*(\[[\s\S]*?\]);\s*(?:const|$)/);
  if (!match) return [];
  try {
    const categories = Function(`"use strict"; return (${match[1]});`)();
    return ensureArray(categories).flatMap((category) =>
      ensureArray(category.items).map((item) => rowFromStaticItem(item, category.name))
    );
  } catch (error) {
    console.error('Could not import menu-data.js:', error.message);
    return [];
  }
}

function defaultDb() {
  return {
    menuItems: loadStaticMenuRows(),
    customers: [],
    orders: [],
    orderItems: [],
    orderEvents: [],
    vouchers: [],
    openingHours: getDefaultOpeningHours()
  };
}

function normalizeDb(db) {
  return {
    menuItems: ensureArray(db?.menuItems),
    customers: ensureArray(db?.customers),
    orders: ensureArray(db?.orders),
    orderItems: ensureArray(db?.orderItems),
    orderEvents: ensureArray(db?.orderEvents),
    vouchers: ensureArray(db?.vouchers),
    openingHours: ensureArray(db?.openingHours).length ? ensureArray(db.openingHours) : getDefaultOpeningHours()
  };
}

function readDb() {
  if (!fs.existsSync(dbPath)) {
    const seeded = defaultDb();
    writeDb(seeded);
    return seeded;
  }
  try {
    return normalizeDb(JSON.parse(fs.readFileSync(dbPath, 'utf8')));
  } catch (error) {
    throw new Error(`Could not read data/db.json: ${error.message}`);
  }
}

function writeDb(db) {
  fs.mkdirSync(dataDir, { recursive: true });
  const normalized = normalizeDb(db);
  const tmpPath = `${dbPath}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(normalized, null, 2)}\n`);
  fs.renameSync(tmpPath, dbPath);
}

function sortMenuItems(rows) {
  return [...ensureArray(rows)].sort((a, b) => {
    const popularDiff = Number(b.is_popular === true) - Number(a.is_popular === true);
    if (popularDiff) return popularDiff;
    const categoryDiff = String(a.category || '').localeCompare(String(b.category || ''));
    if (categoryDiff) return categoryDiff;
    return String(a.name_de || a.name || '').localeCompare(String(b.name_de || b.name || ''));
  });
}

function getCookie(req, name) {
  const raw = String(req.headers.cookie || '');
  return raw
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function getSession(req) {
  const token = getCookie(req, 'bago_admin_session');
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function requireAdmin(req, res) {
  if (getSession(req)) return true;
  jsonResponse(res, 401, { error: 'unauthorized' });
  return false;
}

function publicConfig() {
  return {
    venue: {
      whatsappNumber: String(env.BAGO_WHATSAPP_NUMBER || '').trim(),
      paypalEmail: String(env.BAGO_PAYPAL_EMAIL || '').trim(),
      paypalEnabled: ['1', 'true', 'yes', 'on'].includes(String(env.BAGO_PAYPAL_ENABLED || '').toLowerCase()),
      paypalSandbox: ['1', 'true', 'yes', 'on'].includes(String(env.BAGO_PAYPAL_SANDBOX || '').toLowerCase()),
      paypalReturnBaseUrl: String(env.BAGO_PAYPAL_RETURN_BASE_URL || env.BAGO_SITE_URL || '').trim(),
      siteUrl: String(env.BAGO_SITE_URL || '').trim()
    }
  };
}

function cleanMenuPayload(payload) {
  const now = new Date().toISOString();
  return {
    ...payload,
    id: String(payload.id || crypto.randomUUID()),
    category: String(payload.category || 'Menu').trim() || 'Menu',
    price: Number.parseFloat(payload.price) || 0,
    available: payload.available !== false,
    is_popular: payload.is_popular === true,
    image_url: String(payload.image_url || payload.image || '').trim(),
    image: String(payload.image || payload.image_url || '').trim(),
    name: String(payload.name || payload.name_de || '').trim(),
    description: String(payload.description || payload.description_de || '').trim(),
    created_at: payload.created_at || now,
    updated_at: now
  };
}

function cleanVoucherPayload(payload) {
  const now = new Date().toISOString();
  return {
    ...payload,
    id: String(payload.id || crypto.randomUUID()),
    code: biz.normalizeVoucherCode(payload.code),
    discount_amount: biz.roundMoney(payload.discount_amount),
    usage_limit: Math.max(1, Number.parseInt(payload.usage_limit, 10) || 1),
    times_used: Math.max(0, Number.parseInt(payload.times_used, 10) || 0),
    active: payload.active !== false,
    min_order_value: Math.max(0, Number.parseFloat(payload.min_order_value) || 0),
    created_at: payload.created_at || now,
    updated_at: now
  };
}

function addOrderEvent(db, orderId, eventType, payload = {}, source = 'web') {
  const event = {
    id: crypto.randomUUID(),
    order_id: String(orderId),
    event_type: String(eventType).trim(),
    source: String(source || 'web').trim() || 'web',
    event_payload: payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {},
    created_at: new Date().toISOString()
  };
  db.orderEvents.push(event);
  return event;
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/config') {
    jsonResponse(res, 200, publicConfig());
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/login') {
    const body = await readBody(req);
    const email = String(body.email || '').trim();
    const password = String(body.password || '');
    if (!adminEmail || !adminPassword) {
      jsonResponse(res, 503, { error: 'admin_not_configured' });
      return;
    }
    if (email !== adminEmail || password !== adminPassword) {
      jsonResponse(res, 401, { error: 'invalid_credentials' });
      return;
    }
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { email, expiresAt: Date.now() + 1000 * 60 * 60 * 12 });
    res.setHeader('set-cookie', `bago_admin_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=43200`);
    jsonResponse(res, 200, { session: { email } });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/admin/logout') {
    const token = getCookie(req, 'bago_admin_session');
    if (token) sessions.delete(token);
    res.setHeader('set-cookie', 'bago_admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');
    jsonResponse(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/admin/session') {
    const session = getSession(req);
    jsonResponse(res, 200, { session: session ? { email: session.email } : null });
    return;
  }

  const db = readDb();

  if (req.method === 'GET' && pathname === '/api/menu-items') {
    jsonResponse(res, 200, { data: sortMenuItems(db.menuItems) });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/menu-items') {
    if (!requireAdmin(req, res)) return;
    const payload = cleanMenuPayload(await readBody(req));
    if (payload.is_popular) {
      db.menuItems = db.menuItems.map((item) => ({ ...item, is_popular: false }));
    }
    db.menuItems.push(payload);
    writeDb(db);
    jsonResponse(res, 201, { data: payload });
    return;
  }

  const menuMatch = pathname.match(/^\/api\/menu-items\/([^/]+)$/);
  if (menuMatch) {
    if (!requireAdmin(req, res)) return;
    const id = decodeURIComponent(menuMatch[1]);
    const index = db.menuItems.findIndex((item) => String(item.id) === id);
    if (index < 0) {
      jsonResponse(res, 404, { error: 'not_found' });
      return;
    }
    if (req.method === 'PATCH') {
      const payload = cleanMenuPayload({ ...db.menuItems[index], ...(await readBody(req)), id });
      if (payload.is_popular) {
        db.menuItems = db.menuItems.map((item) => (String(item.id) === id ? item : { ...item, is_popular: false }));
      }
      db.menuItems[index] = payload;
      writeDb(db);
      jsonResponse(res, 200, { data: payload });
      return;
    }
    if (req.method === 'DELETE') {
      db.menuItems.splice(index, 1);
      writeDb(db);
      jsonResponse(res, 200, { ok: true });
      return;
    }
  }

  if (req.method === 'GET' && pathname === '/api/vouchers') {
    if (!requireAdmin(req, res)) return;
    jsonResponse(res, 200, {
      data: [...db.vouchers].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/vouchers') {
    if (!requireAdmin(req, res)) return;
    const payload = cleanVoucherPayload(await readBody(req));
    db.vouchers.push(payload);
    writeDb(db);
    jsonResponse(res, 201, { data: payload });
    return;
  }

  const voucherMatch = pathname.match(/^\/api\/vouchers\/([^/]+)$/);
  if (voucherMatch) {
    if (!requireAdmin(req, res)) return;
    const id = decodeURIComponent(voucherMatch[1]);
    const index = db.vouchers.findIndex((voucher) => String(voucher.id) === id);
    if (index < 0) {
      jsonResponse(res, 404, { error: 'not_found' });
      return;
    }
    if (req.method === 'PATCH') {
      const payload = cleanVoucherPayload({ ...db.vouchers[index], ...(await readBody(req)), id });
      db.vouchers[index] = payload;
      writeDb(db);
      jsonResponse(res, 200, { data: payload });
      return;
    }
    if (req.method === 'DELETE') {
      db.vouchers.splice(index, 1);
      writeDb(db);
      jsonResponse(res, 200, { ok: true });
      return;
    }
  }

  if (req.method === 'GET' && pathname === '/api/vouchers/validate') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = biz.normalizeVoucherCode(url.searchParams.get('code'));
    const orderValue = Number.parseFloat(url.searchParams.get('orderValue'));
    const row = db.vouchers.find((entry) => biz.normalizeVoucherCode(entry.code) === code);
    const validation = biz.validateVoucherRow(row, { orderValue });
    jsonResponse(res, validation.ok ? 200 : 400, validation);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/vouchers/redeem') {
    const body = await readBody(req);
    const code = biz.normalizeVoucherCode(body.code);
    const orderValue = Number.parseFloat(body.orderValue);
    const index = db.vouchers.findIndex((entry) => biz.normalizeVoucherCode(entry.code) === code);
    const redemption = biz.redeemVoucherRow(db.vouchers[index], { orderValue });
    if (!redemption.ok) {
      jsonResponse(res, 400, redemption);
      return;
    }
    db.vouchers[index] = redemption.row;
    writeDb(db);
    jsonResponse(res, 200, redemption);
    return;
  }

  if (req.method === 'GET' && pathname === '/api/opening-hours') {
    jsonResponse(res, 200, { data: db.openingHours });
    return;
  }

  if (req.method === 'PUT' && pathname === '/api/opening-hours') {
    if (!requireAdmin(req, res)) return;
    const body = await readBody(req);
    db.openingHours = ensureArray(body.data || body);
    writeDb(db);
    jsonResponse(res, 200, { data: db.openingHours });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/orders') {
    if (!requireAdmin(req, res)) return;
    jsonResponse(res, 200, {
      data: [...db.orders].sort((a, b) => String(b.ordered_at || '').localeCompare(String(a.ordered_at || '')))
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/orders') {
    const body = await readBody(req);
    const now = new Date().toISOString();
    const customerResult = biz.upsertCustomer(
      db.customers,
      {
        id: crypto.randomUUID(),
        name: body.customerName,
        phone: body.customerPhone,
        email: body.customerEmail
      },
      now
    );
    db.customers = customerResult.customers;

    const order = biz.createOrderRecord(
      {
        id: crypto.randomUUID(),
        customerId: customerResult.customer.id,
        orderTotal: body.orderTotal,
        paymentMethod: body.paymentMethod,
        orderStatus: body.orderStatus,
        paymentReference: body.paymentReference,
        voucherCode: body.voucherCode,
        voucherDiscount: body.voucherDiscount,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,
        isScheduled: body.isScheduled,
        scheduledFor: body.scheduledForIso
      },
      now
    );
    const items = biz.createOrderItems(
      order.id,
      ensureArray(body.lines).map((line) => ({
        itemId: line.itemId || line.id,
        itemName: line.itemName || line.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice ?? line.price
      }))
    );
    db.orders.push(order);
    db.orderItems.push(...items);
    addOrderEvent(db, order.id, 'order_created', body.eventPayload || {}, 'web');
    writeDb(db);
    jsonResponse(res, 201, { data: { order, items } });
    return;
  }

  const orderStatusMatch = pathname.match(/^\/api\/orders\/([^/]+)\/status$/);
  if (orderStatusMatch && req.method === 'PATCH') {
    const id = decodeURIComponent(orderStatusMatch[1]);
    const body = await readBody(req);
    const order = db.orders.find((entry) => String(entry.id) === id);
    if (!order) {
      jsonResponse(res, 404, { error: 'not_found' });
      return;
    }
    order.order_status = String(body.status || order.order_status);
    if (body.paymentReference) {
      order.payment_reference = String(body.paymentReference);
    }
    writeDb(db);
    jsonResponse(res, 200, { data: order });
    return;
  }

  const orderEventsMatch = pathname.match(/^\/api\/orders\/([^/]+)\/events$/);
  if (orderEventsMatch) {
    const orderId = decodeURIComponent(orderEventsMatch[1]);
    if (req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      jsonResponse(res, 200, {
        data: db.orderEvents
          .filter((entry) => String(entry.order_id) === orderId)
          .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
      });
      return;
    }
    if (req.method === 'POST') {
      const body = await readBody(req);
      const event = addOrderEvent(db, orderId, body.eventType, body.payload, body.source);
      writeDb(db);
      jsonResponse(res, 201, { data: event });
      return;
    }
  }

  const orderItemsMatch = pathname.match(/^\/api\/orders\/([^/]+)\/items$/);
  if (orderItemsMatch && req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const orderId = decodeURIComponent(orderItemsMatch[1]);
    jsonResponse(res, 200, {
      data: db.orderItems
        .filter((entry) => String(entry.order_id) === orderId)
        .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
    });
    return;
  }

  jsonResponse(res, 404, { error: 'not_found' });
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function serveStatic(req, res, pathname) {
  const safePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const filePath = path.normalize(path.join(root, decodeURIComponent(safePath)));
  if (!filePath.startsWith(root) || filePath.includes(`${path.sep}.git${path.sep}`) || filePath.includes(`${path.sep}data${path.sep}`)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'content-type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname).catch((error) => {
      console.error(error);
      jsonResponse(res, 500, { error: error.message || 'server_error' });
    });
    return;
  }
  serveStatic(req, res, pathname);
});

const port = Number.parseInt(env.PORT, 10) || 3000;
server.listen(port, () => {
  console.log(`Demo Sushi House server running at http://localhost:${port}`);
  console.log(`JSON database: ${dbPath}`);
});
