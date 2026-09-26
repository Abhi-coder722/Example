import initialState from '../../data/db.json';

const SESSION_COOKIE = 'bago_admin_session';
const SESSION_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const defaultOpeningHours = () => [
  { day_of_week: 0, is_closed: true, opens_at: '', closes_at: '' },
  { day_of_week: 1, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
  { day_of_week: 2, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
  { day_of_week: 3, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
  { day_of_week: 4, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
  { day_of_week: 5, is_closed: false, opens_at: '11:30', closes_at: '20:00' },
  { day_of_week: 6, is_closed: false, opens_at: '13:00', closes_at: '20:00' }
];

const blankState = () => ({
  menuItems: [], customers: [], orders: [], orderItems: [], orderEvents: [], vouchers: [], openingHours: defaultOpeningHours()
});
const array = (value) => Array.isArray(value) ? value : [];
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();
const money = (value) => Math.round((Number.parseFloat(value) || 0) * 100) / 100;
const voucherCode = (value) => String(value || '').trim().toUpperCase();
const normalizedPhone = (value) => String(value || '').replace(/[^\d+]/g, '').replace(/\++/g, '+').trim();
const normalizedEmail = (value) => String(value || '').trim().toLowerCase();

function json(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });
}

function cookie(request, name) {
  return String(request.headers.get('cookie') || '').split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

function base64url(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

async function sessionFor(request, env) {
  const token = cookie(request, SESSION_COOKIE);
  const [body, signature] = token.split('.');
  if (!body || !signature || !env.BAGO_SESSION_SECRET) return null;
  const expected = await hmac(body, env.BAGO_SESSION_SECRET);
  const providedBytes = encoder.encode(signature);
  const expectedBytes = encoder.encode(expected);
  let difference = providedBytes.length ^ expectedBytes.length;
  for (let index = 0; index < Math.max(providedBytes.length, expectedBytes.length); index += 1) {
    difference |= (providedBytes[index] || 0) ^ (expectedBytes[index] || 0);
  }
  if (difference !== 0) return null;
  try {
    const payload = JSON.parse(decoder.decode(fromBase64url(body)));
    return payload.exp > Math.floor(Date.now() / 1000) && payload.email ? payload : null;
  } catch { return null; }
}

async function createSession(email, secret) {
  const body = base64url(encoder.encode(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })));
  return `${body}.${await hmac(body, secret)}`;
}

function requireAdmin(session) { return session ? null : json({ error: 'unauthorized' }, 401); }

async function loadState(db) {
  await db.prepare('CREATE TABLE IF NOT EXISTS bago_state (id INTEGER PRIMARY KEY CHECK (id = 1), value TEXT NOT NULL)').run();
  const row = await db.prepare('SELECT value FROM bago_state WHERE id = 1').first();
  if (row?.value) {
    try { return { ...blankState(), ...JSON.parse(row.value) }; } catch { /* replace corrupt state below */ }
  }
  const seeded = { ...blankState(), ...initialState };
  await db.prepare('INSERT OR REPLACE INTO bago_state (id, value) VALUES (1, ?)').bind(JSON.stringify(seeded)).run();
  return seeded;
}

async function saveState(db, state) {
  await db.prepare('INSERT OR REPLACE INTO bago_state (id, value) VALUES (1, ?)').bind(JSON.stringify(state)).run();
}

function publicConfig(env) {
  const number = (name) => Number.isFinite(Number.parseFloat(env[name])) ? Number.parseFloat(env[name]) : '';
  const truthy = (name) => ['1', 'true', 'yes', 'on'].includes(String(env[name] || '').toLowerCase());
  return { venue: {
    name: String(env.BAGO_VENUE_NAME || '').trim(), city: String(env.BAGO_VENUE_CITY || '').trim(),
    address: String(env.BAGO_VENUE_ADDRESS || '').trim(), heroImage: String(env.BAGO_VENUE_HERO_IMAGE || '').trim(),
    logoImage: String(env.BAGO_VENUE_LOGO_IMAGE || '').trim(), pickupLat: number('BAGO_PICKUP_LAT'), pickupLng: number('BAGO_PICKUP_LNG'),
    orderMinimum: number('BAGO_ORDER_MINIMUM'), preparationTime: String(env.BAGO_PREPARATION_TIME || '').trim(),
    serviceFeePercent: number('BAGO_SERVICE_FEE_PERCENT'), serviceFeeMin: number('BAGO_SERVICE_FEE_MIN'), serviceFeeMax: number('BAGO_SERVICE_FEE_MAX'),
    legalProviderName: String(env.BAGO_LEGAL_PROVIDER_NAME || env.BAGO_VENUE_NAME || '').trim(), legalAddress: String(env.BAGO_LEGAL_ADDRESS || env.BAGO_VENUE_ADDRESS || '').trim(),
    legalContact: String(env.BAGO_LEGAL_CONTACT || '').trim(), legalRepresentative: String(env.BAGO_LEGAL_REPRESENTATIVE || '').trim(),
    whatsappNumber: String(env.BAGO_WHATSAPP_NUMBER || '').trim(), paypalEmail: String(env.BAGO_PAYPAL_EMAIL || '').trim(),
    paypalEnabled: truthy('BAGO_PAYPAL_ENABLED'), paypalSandbox: truthy('BAGO_PAYPAL_SANDBOX'),
    paypalReturnBaseUrl: String(env.BAGO_PAYPAL_RETURN_BASE_URL || env.BAGO_SITE_URL || '').trim(), siteUrl: String(env.BAGO_SITE_URL || '').trim()
  }};
}

function cleanMenu(input, existing = {}) {
  const stamp = now();
  return { ...existing, ...input, id: String(existing.id || input.id || id()), category: String(input.category ?? existing.category ?? 'Menu').trim() || 'Menu',
    price: Number.parseFloat(input.price ?? existing.price) || 0, available: input.available !== undefined ? input.available !== false : existing.available !== false,
    is_popular: input.is_popular === true, image_url: String(input.image_url ?? input.image ?? existing.image_url ?? '').trim(),
    image: String(input.image ?? input.image_url ?? existing.image ?? '').trim(), name: String(input.name ?? input.name_de ?? existing.name ?? '').trim(),
    description: String(input.description ?? input.description_de ?? existing.description ?? '').trim(), created_at: existing.created_at || input.created_at || stamp, updated_at: stamp };
}

function cleanVoucher(input, existing = {}) {
  const stamp = now();
  return { ...existing, ...input, id: String(existing.id || input.id || id()), code: voucherCode(input.code ?? existing.code),
    discount_amount: money(input.discount_amount ?? existing.discount_amount), usage_limit: Math.max(1, Number.parseInt(input.usage_limit ?? existing.usage_limit, 10) || 1),
    times_used: Math.max(0, Number.parseInt(input.times_used ?? existing.times_used, 10) || 0), active: input.active !== undefined ? input.active !== false : existing.active !== false,
    min_order_value: Math.max(0, Number.parseFloat(input.min_order_value ?? existing.min_order_value) || 0), created_at: existing.created_at || input.created_at || stamp, updated_at: stamp };
}

function validateVoucher(row, orderValue) {
  if (!row) return { ok: false, error: 'not_found' };
  if (row.active === false) return { ok: false, error: 'inactive' };
  const minimumOrderValue = Math.max(0, Number.parseFloat(row.min_order_value) || 0, ['DEUTSCHLAND5', 'DE5'].includes(voucherCode(row.code)) ? 45 : 0);
  const usageLimit = Math.max(1, Number.parseInt(row.usage_limit, 10) || 1), timesUsed = Math.max(0, Number.parseInt(row.times_used, 10) || 0);
  if (timesUsed >= usageLimit) return { ok: false, error: 'usage_limit_reached' };
  if (orderValue != null && (Number.parseFloat(orderValue) || 0) + 0.000001 < minimumOrderValue) return { ok: false, error: 'minimum_not_reached', minimumOrderValue, orderValue: Number.parseFloat(orderValue) || 0 };
  return { ok: true, error: '', voucher: { id: row.id, code: voucherCode(row.code), discountAmount: money(row.discount_amount), minimumOrderValue, usageLimit, timesUsed } };
}

function orderFor(body, customerId) {
  const stamp = now();
  return { id: id(), customer_id: customerId, order_total: money(body.orderTotal), payment_method: String(body.paymentMethod || 'cash'), order_status: String(body.orderStatus || 'pending_confirmation'),
    payment_reference: body.paymentReference || null, voucher_code: body.voucherCode || null, voucher_discount: money(body.voucherDiscount), customer_name: String(body.customerName || ''),
    customer_phone: String(body.customerPhone || ''), customer_email: body.customerEmail || null, is_scheduled: Boolean(body.isScheduled), scheduled_for: body.scheduledForIso || null, ordered_at: stamp, created_at: stamp };
}

function addEvent(state, orderId, eventType, payload = {}, source = 'web') {
  const event = { id: id(), order_id: String(orderId), event_type: String(eventType || '').trim(), source: String(source || 'web').trim() || 'web', event_payload: payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {}, created_at: now() };
  state.orderEvents.push(event); return event;
}

export async function onRequest(context) {
  const { request, env } = context;
  if (!env.BAGO_DB) return json({ error: 'database_not_configured' }, 503);
  const url = new URL(request.url), path = url.pathname.replace(/^\/api/, '') || '/';
  if (request.method === 'GET' && path === '/config') return json(publicConfig(env));
  const adminEmail = String(env.BAGO_ADMIN_EMAIL || '').trim(), adminPassword = String(env.BAGO_ADMIN_PASSWORD || '');
  if (request.method === 'POST' && path === '/admin/login') {
    const body = await request.json().catch(() => ({}));
    if (!adminEmail || !adminPassword || !env.BAGO_SESSION_SECRET) return json({ error: 'admin_not_configured' }, 503);
    if (String(body.email || '').trim() !== adminEmail || String(body.password || '') !== adminPassword) return json({ error: 'invalid_credentials' }, 401);
    const token = await createSession(adminEmail, env.BAGO_SESSION_SECRET);
    return json({ session: { email: adminEmail } }, 200, { 'set-cookie': `${SESSION_COOKIE}=${token}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${SESSION_SECONDS}` });
  }
  if (request.method === 'POST' && path === '/admin/logout') return json({ ok: true }, 200, { 'set-cookie': `${SESSION_COOKIE}=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0` });
  const session = await sessionFor(request, env);
  if (request.method === 'GET' && path === '/admin/session') return json({ session: session ? { email: session.email } : null });
  const state = await loadState(env.BAGO_DB);
  const body = async () => request.json().catch(() => ({}));
  if (request.method === 'GET' && path === '/menu-items') return json({ data: [...state.menuItems].sort((a, b) => Number(b.is_popular) - Number(a.is_popular) || String(a.category).localeCompare(String(b.category)) || String(a.name_de || a.name).localeCompare(String(b.name_de || b.name))) });
  if (request.method === 'POST' && path === '/menu-items') { const denied = requireAdmin(session); if (denied) return denied; const row = cleanMenu(await body()); if (row.is_popular) state.menuItems.forEach((item) => { item.is_popular = false; }); state.menuItems.push(row); await saveState(env.BAGO_DB, state); return json({ data: row }, 201); }
  let match = path.match(/^\/menu-items\/([^/]+)$/);
  if (match) { const denied = requireAdmin(session); if (denied) return denied; const index = state.menuItems.findIndex((item) => String(item.id) === decodeURIComponent(match[1])); if (index < 0) return json({ error: 'not_found' }, 404); if (request.method === 'PATCH') { const row = cleanMenu(await body(), state.menuItems[index]); if (row.is_popular) state.menuItems.forEach((item) => { item.is_popular = item.id === row.id; }); state.menuItems[index] = row; await saveState(env.BAGO_DB, state); return json({ data: row }); } if (request.method === 'DELETE') { state.menuItems.splice(index, 1); await saveState(env.BAGO_DB, state); return json({ ok: true }); } }
  if (request.method === 'GET' && path === '/vouchers/validate') { const result = validateVoucher(state.vouchers.find((row) => voucherCode(row.code) === voucherCode(url.searchParams.get('code'))), url.searchParams.get('orderValue')); return json(result, result.ok ? 200 : 400); }
  if (request.method === 'POST' && path === '/vouchers/redeem') { const input = await body(), index = state.vouchers.findIndex((row) => voucherCode(row.code) === voucherCode(input.code)), result = validateVoucher(state.vouchers[index], input.orderValue); if (!result.ok) return json(result, 400); state.vouchers[index].times_used = result.voucher.timesUsed + 1; state.vouchers[index].updated_at = now(); await saveState(env.BAGO_DB, state); return json({ ...result, voucher: { ...result.voucher, timesUsed: state.vouchers[index].times_used }, row: state.vouchers[index] }); }
  if (request.method === 'GET' && path === '/vouchers') { const denied = requireAdmin(session); if (denied) return denied; return json({ data: [...state.vouchers].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))) }); }
  if (request.method === 'POST' && path === '/vouchers') { const denied = requireAdmin(session); if (denied) return denied; const row = cleanVoucher(await body()); state.vouchers.push(row); await saveState(env.BAGO_DB, state); return json({ data: row }, 201); }
  match = path.match(/^\/vouchers\/([^/]+)$/);
  if (match) { const denied = requireAdmin(session); if (denied) return denied; const index = state.vouchers.findIndex((row) => String(row.id) === decodeURIComponent(match[1])); if (index < 0) return json({ error: 'not_found' }, 404); if (request.method === 'PATCH') { const row = cleanVoucher(await body(), state.vouchers[index]); state.vouchers[index] = row; await saveState(env.BAGO_DB, state); return json({ data: row }); } if (request.method === 'DELETE') { state.vouchers.splice(index, 1); await saveState(env.BAGO_DB, state); return json({ ok: true }); } }
  if (request.method === 'GET' && path === '/opening-hours') return json({ data: state.openingHours });
  if (request.method === 'PUT' && path === '/opening-hours') { const denied = requireAdmin(session); if (denied) return denied; const input = await body(); state.openingHours = array(input.data || input); await saveState(env.BAGO_DB, state); return json({ data: state.openingHours }); }
  if (request.method === 'GET' && path === '/orders') { const denied = requireAdmin(session); if (denied) return denied; return json({ data: [...state.orders].sort((a, b) => String(b.ordered_at).localeCompare(String(a.ordered_at))) }); }
  if (request.method === 'POST' && path === '/orders') { const input = await body(), phone = normalizedPhone(input.customerPhone), email = normalizedEmail(input.customerEmail); let customer = state.customers.find((row) => (phone && normalizedPhone(row.phone_normalized || row.phone) === phone) || (email && normalizedEmail(row.email_normalized || row.email) === email)); if (customer) { customer.name = String(input.customerName || customer.name || ''); customer.phone = String(input.customerPhone || customer.phone || ''); customer.email = input.customerEmail || customer.email || null; customer.phone_normalized = phone || customer.phone_normalized; customer.email_normalized = email || customer.email_normalized; customer.last_activity_at = now(); } else { customer = { id: id(), name: String(input.customerName || ''), phone: String(input.customerPhone || ''), email: input.customerEmail || null, phone_normalized: phone, email_normalized: email, created_at: now(), last_activity_at: now() }; state.customers.push(customer); } const order = orderFor(input, customer.id); const items = array(input.lines).map((line, index) => { const quantity = Math.max(1, Number.parseInt(line.quantity, 10) || 1), unitPrice = money(line.unitPrice ?? line.price); return { id: `${order.id}-item-${index + 1}`, order_id: order.id, item_id: String(line.itemId || line.id || ''), item_name: String(line.itemName || line.name || ''), quantity, unit_price: unitPrice, line_total: money(quantity * unitPrice) }; }); state.orders.push(order); state.orderItems.push(...items); addEvent(state, order.id, 'order_created', input.eventPayload || {}, 'web'); await saveState(env.BAGO_DB, state); return json({ data: { order, items } }, 201); }
  match = path.match(/^\/orders\/([^/]+)\/status$/);
  if (match && request.method === 'PATCH') { const order = state.orders.find((row) => String(row.id) === decodeURIComponent(match[1])); if (!order) return json({ error: 'not_found' }, 404); const input = await body(); order.order_status = String(input.status || order.order_status); if (input.paymentReference) order.payment_reference = String(input.paymentReference); await saveState(env.BAGO_DB, state); return json({ data: order }); }
  match = path.match(/^\/orders\/([^/]+)\/events$/);
  if (match) { const orderId = decodeURIComponent(match[1]); if (request.method === 'GET') { const denied = requireAdmin(session); if (denied) return denied; return json({ data: state.orderEvents.filter((row) => String(row.order_id) === orderId).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))) }); } if (request.method === 'POST') { const input = await body(), event = addEvent(state, orderId, input.eventType, input.payload, input.source); await saveState(env.BAGO_DB, state); return json({ data: event }, 201); } }
  match = path.match(/^\/orders\/([^/]+)\/items$/);
  if (match && request.method === 'GET') { const denied = requireAdmin(session); if (denied) return denied; const orderId = decodeURIComponent(match[1]); return json({ data: state.orderItems.filter((row) => String(row.order_id) === orderId).sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || ''))) }); }
  return json({ error: 'not_found' }, 404);
}
