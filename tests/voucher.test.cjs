const test = require('node:test');
const assert = require('node:assert/strict');

const biz = require('../shared/business-logic.js');

test('create and validate active voucher', () => {
  const voucher = {
    id: 'v-1',
    code: 'welcome10',
    discount_amount: 2.5,
    active: true,
    usage_limit: 1,
    times_used: 0
  };

  const result = biz.validateVoucherRow(voucher);
  assert.equal(result.ok, true);
  assert.equal(result.voucher.code, 'WELCOME10');
  assert.equal(result.voucher.discountAmount, 2.5);
});

test('redeem valid voucher increments usage', () => {
  const voucher = {
    id: 'v-2',
    code: 'SAVE5',
    discount_amount: 5,
    active: true,
    usage_limit: 2,
    times_used: 0
  };

  const redemption = biz.redeemVoucherRow(voucher);
  assert.equal(redemption.ok, true);
  assert.equal(redemption.voucher.timesUsed, 1);
  assert.equal(redemption.row.times_used, 1);
});

test('reject invalid voucher', () => {
  const result = biz.validateVoucherRow(null);
  assert.equal(result.ok, false);
  assert.equal(result.error, 'not_found');
});

test('reject inactive voucher', () => {
  const voucher = {
    id: 'v-3',
    code: 'OFF',
    discount_amount: 1,
    active: false,
    usage_limit: 1,
    times_used: 0
  };

  const result = biz.validateVoucherRow(voucher);
  assert.equal(result.ok, false);
  assert.equal(result.error, 'inactive');
});

test('reject voucher after usage limit reached', () => {
  const voucher = {
    id: 'v-4',
    code: 'LIMIT1',
    discount_amount: 1,
    active: true,
    usage_limit: 1,
    times_used: 1
  };

  const result = biz.validateVoucherRow(voucher);
  assert.equal(result.ok, false);
  assert.equal(result.error, 'usage_limit_reached');
});

test('reject voucher when minimum order value is not reached', () => {
  const voucher = {
    id: 'v-5',
    code: 'DEUTSCHLAND5',
    discount_amount: 5,
    min_order_value: 45,
    active: true,
    usage_limit: 1000,
    times_used: 0
  };

  const result = biz.validateVoucherRow(voucher, { orderValue: 32 });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'minimum_not_reached');
  assert.equal(result.minimumOrderValue, 45);
});
