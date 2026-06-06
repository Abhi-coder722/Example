const test = require('node:test');
const assert = require('node:assert/strict');

const biz = require('../shared/business-logic.js');

test('create new customer order', () => {
  const now = '2026-06-06T10:00:00.000Z';
  const created = biz.upsertCustomer([], {
    id: 'customer-1',
    name: 'Max Mustermann',
    phone: '+49 170 1234567',
    email: 'max@example.com'
  }, now);

  assert.equal(created.created, true);
  assert.equal(created.customers.length, 1);
  assert.equal(created.customer.id, 'customer-1');
  assert.equal(created.customer.phone_normalized, '+491701234567');
  assert.equal(created.customer.email_normalized, 'max@example.com');
});

test('associate order with existing customer via phone/email', () => {
  const existing = [{
    id: 'customer-1',
    name: 'Max',
    phone: '+49 170 1234567',
    phone_normalized: '+491701234567',
    email: 'max@example.com',
    email_normalized: 'max@example.com',
    created_at: '2026-06-05T10:00:00.000Z',
    last_activity_at: '2026-06-05T10:00:00.000Z'
  }];

  const updated = biz.upsertCustomer(existing, {
    name: 'Max Mustermann',
    phone: '+49 (170) 1234567',
    email: 'MAX@example.com'
  }, '2026-06-06T11:00:00.000Z');

  assert.equal(updated.created, false);
  assert.equal(updated.customers.length, 1);
  assert.equal(updated.customer.id, 'customer-1');
  assert.equal(updated.customer.created_at, '2026-06-05T10:00:00.000Z');
  assert.equal(updated.customer.last_activity_at, '2026-06-06T11:00:00.000Z');
});

test('save order and order items correctly', () => {
  const totals = biz.calculateTotals({
    lines: [
      { id: 'item-1', price: 8.9, quantity: 2 },
      { id: 'item-2', price: 3.5, quantity: 1 }
    ],
    orderMinimum: 12,
    serviceFeePercent: 0,
    serviceFeeMin: 0,
    serviceFeeMax: 0,
    voucherDiscount: 2
  });

  const order = biz.createOrderRecord({
    id: 'order-1',
    customerId: 'customer-1',
    orderTotal: totals.total,
    paymentMethod: 'cash',
    orderStatus: 'pending_confirmation',
    customerName: 'Max Mustermann',
    customerPhone: '+49 170 1234567',
    customerEmail: 'max@example.com',
    voucherCode: 'SAVE2',
    voucherDiscount: totals.voucherDiscount
  }, '2026-06-06T12:00:00.000Z');

  const items = biz.createOrderItems(order.id, [
    { id: 'item-1', name: 'Crunchyroll', quantity: 2, price: 8.9 },
    { id: 'item-2', name: 'Miso Soup', quantity: 1, price: 3.5 }
  ]);

  assert.equal(order.customer_id, 'customer-1');
  assert.equal(order.voucher_code, 'SAVE2');
  assert.equal(order.voucher_discount, totals.voucherDiscount);
  assert.equal(items.length, 2);
  assert.equal(items[0].line_total, 17.8);
  assert.equal(items[1].line_total, 3.5);
});

test('order totals are stored correctly', () => {
  const totals = biz.calculateTotals({
    lines: [
      { price: 10, quantity: 1 },
      { price: 5, quantity: 1 }
    ],
    orderMinimum: 12,
    serviceFeePercent: 0,
    serviceFeeMin: 0,
    serviceFeeMax: 0,
    voucherDiscount: 3
  });

  const order = biz.createOrderRecord({
    id: 'order-2',
    customerId: 'customer-2',
    orderTotal: totals.total,
    paymentMethod: 'paypal',
    orderStatus: 'payment_pending',
    voucherDiscount: totals.voucherDiscount
  }, '2026-06-06T13:00:00.000Z');

  assert.equal(totals.subtotal, 15);
  assert.equal(totals.voucherDiscount, 3);
  assert.equal(totals.total, 12);
  assert.equal(order.order_total, 12);
});
