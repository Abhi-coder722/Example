(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.BagoBusiness = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function toNumber(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function roundMoney(value) {
    return Math.round(toNumber(value) * 100) / 100;
  }

  function hasImage(item) {
    return Boolean(String(item?.image || item?.image_url || item?.imageUrl || '').trim());
  }

  function splitItemsByImage(items) {
    const withImage = [];
    const withoutImage = [];

    (items || []).forEach((item) => {
      if (hasImage(item)) {
        withImage.push(item);
      } else {
        withoutImage.push(item);
      }
    });

    return { withImage, withoutImage };
  }

  function normalizePhone(value) {
    return String(value || '')
      .replace(/[^\d+]/g, '')
      .replace(/\++/g, '+')
      .trim();
  }

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function normalizeVoucherCode(value) {
    return String(value || '').trim().toUpperCase();
  }

  const campaignVoucherMinimums = {
    DEUTSCHLAND5: 45,
    DE5: 45
  };

  function getVoucherMinimumValue(code, rawMinimum) {
    const parsedMinimum = Math.max(0, toNumber(rawMinimum));
    const fallbackMinimum = campaignVoucherMinimums[normalizeVoucherCode(code)] || 0;
    return Math.max(parsedMinimum, fallbackMinimum);
  }

  function calculateTotals(config) {
    const lines = Array.isArray(config?.lines) ? config.lines : [];
    const orderMinimum = toNumber(config?.orderMinimum);
    const serviceFeePercent = Math.max(0, toNumber(config?.serviceFeePercent));
    const serviceFeeMin = Math.max(0, toNumber(config?.serviceFeeMin));
    const serviceFeeMax = Math.max(0, toNumber(config?.serviceFeeMax));
    const voucherDiscountRaw = Math.max(0, toNumber(config?.voucherDiscount));
    const voucherMinimum = Math.max(0, toNumber(config?.voucherMinimum));

    const subtotal = roundMoney(
      lines.reduce((sum, line) => {
        const quantity = Math.max(0, Number.parseInt(line?.quantity, 10) || 0);
        const unitPrice = toNumber(line?.price);
        return sum + unitPrice * quantity;
      }, 0)
    );

    const hasItems = subtotal > 0;
    const rawService = subtotal * serviceFeePercent;
    const boundedService =
      serviceFeeMax > 0 ? Math.min(serviceFeeMax, Math.max(serviceFeeMin, rawService)) : Math.max(serviceFeeMin, rawService);
    const service = hasItems ? roundMoney(boundedService) : 0;
    const grossTotal = roundMoney(subtotal + service);
    const voucherQualified = subtotal + 0.000001 >= voucherMinimum;
    const voucherDiscount = voucherQualified ? Math.min(grossTotal, roundMoney(voucherDiscountRaw)) : 0;
    const total = roundMoney(Math.max(0, grossTotal - voucherDiscount));
    const minimumGap = roundMoney(Math.max(0, orderMinimum - subtotal));

    return {
      subtotal,
      service,
      voucherDiscount,
      minimumGap,
      total
    };
  }

  function validateVoucherRow(row, options) {
    if (!row) {
      return { ok: false, error: 'not_found' };
    }
    if (row.active === false) {
      return { ok: false, error: 'inactive' };
    }

    const usageLimit = Math.max(1, Number.parseInt(row.usage_limit, 10) || 1);
    const timesUsed = Math.max(0, Number.parseInt(row.times_used, 10) || 0);
    const minimumOrderValue = getVoucherMinimumValue(row.code, row.min_order_value);
    const orderValueRaw = toNumber(options?.orderValue);
    const hasOrderValue = options && options.orderValue != null;
    if (timesUsed >= usageLimit) {
      return { ok: false, error: 'usage_limit_reached' };
    }
    if (hasOrderValue && orderValueRaw + 0.000001 < minimumOrderValue) {
      return {
        ok: false,
        error: 'minimum_not_reached',
        minimumOrderValue,
        orderValue: orderValueRaw
      };
    }

    return {
      ok: true,
      error: '',
      voucher: {
        id: row.id,
        code: normalizeVoucherCode(row.code),
        discountAmount: roundMoney(row.discount_amount),
        minimumOrderValue,
        usageLimit,
        timesUsed
      }
    };
  }

  function redeemVoucherRow(row, options) {
    const validation = validateVoucherRow(row, options);
    if (!validation.ok) {
      return validation;
    }

    const nextTimesUsed = validation.voucher.timesUsed + 1;
    return {
      ok: true,
      error: '',
      voucher: {
        ...validation.voucher,
        timesUsed: nextTimesUsed
      },
      row: {
        ...row,
        code: normalizeVoucherCode(row.code),
        times_used: nextTimesUsed
      }
    };
  }

  function findExistingCustomer(customers, contact) {
    const entries = Array.isArray(customers) ? customers : [];
    const phone = normalizePhone(contact?.phone_normalized || contact?.phone || '');
    const email = normalizeEmail(contact?.email_normalized || contact?.email || '');

    return (
      entries.find((entry) => {
        const entryPhone = normalizePhone(entry?.phone_normalized || entry?.phone || '');
        const entryEmail = normalizeEmail(entry?.email_normalized || entry?.email || '');
        return (phone && entryPhone && phone === entryPhone) || (email && entryEmail && email === entryEmail);
      }) || null
    );
  }

  function upsertCustomer(customers, payload, nowIso) {
    const now = nowIso || new Date().toISOString();
    const list = Array.isArray(customers) ? customers.map((entry) => ({ ...entry })) : [];
    const match = findExistingCustomer(list, payload || {});

    const phone = String(payload?.phone || '').trim();
    const email = String(payload?.email || '').trim();
    const name = String(payload?.name || '').trim();
    const phoneNormalized = normalizePhone(payload?.phone_normalized || phone);
    const emailNormalized = normalizeEmail(payload?.email_normalized || email);

    if (match) {
      const updated = {
        ...match,
        name: name || match.name || '',
        phone: phone || match.phone || '',
        phone_normalized: phoneNormalized || match.phone_normalized || '',
        email: email || match.email || null,
        email_normalized: emailNormalized || match.email_normalized || null,
        last_activity_at: now
      };

      const nextCustomers = list.map((entry) => (entry.id === match.id ? updated : entry));
      return {
        customers: nextCustomers,
        customer: updated,
        created: false
      };
    }

    const id = String(payload?.id || `customer-${list.length + 1}`);
    const created = {
      id,
      name,
      phone,
      phone_normalized: phoneNormalized,
      email: email || null,
      email_normalized: emailNormalized || null,
      created_at: now,
      last_activity_at: now
    };

    return {
      customers: [...list, created],
      customer: created,
      created: true
    };
  }

  function createOrderRecord(input, nowIso) {
    const now = nowIso || new Date().toISOString();
    const orderTotal = roundMoney(input?.order_total ?? input?.orderTotal);
    const voucherDiscount = roundMoney(input?.voucher_discount ?? input?.voucherDiscount);

    return {
      id: String(input?.id || `order-${Date.now()}`),
      customer_id: input?.customer_id || input?.customerId || '',
      order_total: orderTotal,
      payment_method: String(input?.payment_method || input?.paymentMethod || 'cash'),
      order_status: String(input?.order_status || input?.orderStatus || 'pending_confirmation'),
      payment_reference: input?.payment_reference || input?.paymentReference || null,
      voucher_code: input?.voucher_code || input?.voucherCode || null,
      voucher_discount: voucherDiscount,
      customer_name: String(input?.customer_name || input?.customerName || ''),
      customer_phone: String(input?.customer_phone || input?.customerPhone || ''),
      customer_email: input?.customer_email || input?.customerEmail || null,
      is_scheduled: Boolean(input?.is_scheduled ?? input?.isScheduled ?? false),
      scheduled_for: input?.scheduled_for || input?.scheduledFor || null,
      ordered_at: input?.ordered_at || now,
      created_at: input?.created_at || now
    };
  }

  function createOrderItems(orderId, lines) {
    return (Array.isArray(lines) ? lines : []).map((line, index) => {
      const quantity = Math.max(1, Number.parseInt(line?.quantity, 10) || 1);
      const unitPrice = roundMoney(line?.unit_price ?? line?.unitPrice ?? line?.price);
      return {
        id: String(line?.id || `${orderId}-item-${index + 1}`),
        order_id: orderId,
        item_id: String(line?.item_id || line?.itemId || line?.id || ''),
        item_name: String(line?.item_name || line?.itemName || line?.name || ''),
        quantity,
        unit_price: unitPrice,
        line_total: roundMoney(quantity * unitPrice)
      };
    });
  }

  return {
    toNumber,
    roundMoney,
    hasImage,
    splitItemsByImage,
    normalizePhone,
    normalizeEmail,
    normalizeVoucherCode,
    calculateTotals,
    validateVoucherRow,
    redeemVoucherRow,
    findExistingCustomer,
    upsertCustomer,
    createOrderRecord,
    createOrderItems
  };
});
