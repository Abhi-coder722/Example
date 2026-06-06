const test = require('node:test');
const assert = require('node:assert/strict');

const biz = require('../shared/business-logic.js');

function runCheckout(db, input) {
  const voucherRow = db.vouchers.find((entry) => biz.normalizeVoucherCode(entry.code) === biz.normalizeVoucherCode(input.voucherCode));
  const voucherValidation = input.voucherCode ? biz.redeemVoucherRow(voucherRow) : { ok: true, voucher: null, row: null };

  if (!voucherValidation.ok) {
    return { ok: false, error: voucherValidation.error, db };
  }

  if (voucherValidation.row) {
    db.vouchers = db.vouchers.map((entry) =>
      entry.id === voucherValidation.row.id ? { ...entry, times_used: voucherValidation.row.times_used } : entry
    );
  }

  const customerResult = biz.upsertCustomer(db.customers, {
    name: input.customerName,
    phone: input.customerPhone,
    email: input.customerEmail
  }, input.nowIso);

  const voucherDiscount = voucherValidation.voucher ? voucherValidation.voucher.discountAmount : 0;
  const totals = biz.calculateTotals({
    lines: input.lines,
    orderMinimum: input.orderMinimum,
    serviceFeePercent: 0,
    serviceFeeMin: 0,
    serviceFeeMax: 0,
    voucherDiscount
  });

  const order = biz.createOrderRecord({
    id: `order-${db.orders.length + 1}`,
    customerId: customerResult.customer.id,
    orderTotal: totals.total,
    paymentMethod: input.paymentMethod,
    orderStatus: input.paymentMethod === 'paypal' ? 'payment_pending' : 'pending_confirmation',
    voucherCode: voucherValidation.voucher?.code || null,
    voucherDiscount: totals.voucherDiscount,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail
  }, input.nowIso);

  const items = biz.createOrderItems(order.id, input.lines);

  db.customers = customerResult.customers;
  db.orders.push(order);
  db.orderItems.push(...items);

  return {
    ok: true,
    db,
    customer: customerResult.customer,
    order,
    items,
    totals
  };
}

test('complete checkout + voucher + order persistence + returning customer recognition', () => {
  let db = {
    customers: [],
    orders: [],
    orderItems: [],
    vouchers: [
      {
        id: 'voucher-1',
        code: 'WELCOME2',
        discount_amount: 2,
        active: true,
        usage_limit: 2,
        times_used: 0
      }
    ]
  };

  const firstOrder = runCheckout(db, {
    customerName: 'Pyaye',
    customerPhone: '+49 1774675823',
    customerEmail: 'pyaye@example.com',
    paymentMethod: 'cash',
    voucherCode: 'welcome2',
    orderMinimum: 12,
    nowIso: '2026-06-06T14:00:00.000Z',
    lines: [
      { id: 'item-1', name: 'Crunchyroll Vegetarisch', price: 8.9, quantity: 1 },
      { id: 'item-2', name: 'Mini Frühlingsrollen', price: 4.2, quantity: 1 }
    ]
  });

  assert.equal(firstOrder.ok, true);
  assert.equal(firstOrder.totals.total, 11.1);
  assert.equal(firstOrder.order.order_status, 'pending_confirmation');
  assert.equal(firstOrder.db.orders.length, 1);
  assert.equal(firstOrder.db.orderItems.length, 2);
  assert.equal(firstOrder.db.vouchers[0].times_used, 1);

  const secondOrder = runCheckout(db, {
    customerName: 'Pyaye Updated',
    customerPhone: '+49 1774675823',
    customerEmail: 'pyaye@example.com',
    paymentMethod: 'paypal',
    voucherCode: 'WELCOME2',
    orderMinimum: 12,
    nowIso: '2026-06-06T15:00:00.000Z',
    lines: [
      { id: 'item-3', name: 'L1 Futo Lachs Menü', price: 11.5, quantity: 1 },
      { id: 'item-4', name: 'Miso Suppe', price: 2.8, quantity: 1 }
    ]
  });

  assert.equal(secondOrder.ok, true);
  assert.equal(secondOrder.customer.id, firstOrder.customer.id);
  assert.equal(secondOrder.order.order_status, 'payment_pending');
  assert.equal(secondOrder.db.orders.length, 2);
  assert.equal(secondOrder.db.orderItems.length, 4);
  assert.equal(secondOrder.db.vouchers[0].times_used, 2);
});
