(function (root) {
  async function request(path, options = {}) {
    const response = await fetch(path, {
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {})
      },
      ...options,
      body: options.body == null ? undefined : JSON.stringify(options.body)
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};
    if (!response.ok) {
      const error = new Error(payload.error || payload.message || `Request failed (${response.status})`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  root.BagoApi = {
    getConfig: () => request('/api/config'),
    getMenuItems: () => request('/api/menu-items'),
    getOpeningHours: () => request('/api/opening-hours'),
    validateVoucher: (code, orderValue) =>
      request(`/api/vouchers/validate?code=${encodeURIComponent(code)}&orderValue=${encodeURIComponent(orderValue || 0)}`),
    redeemVoucher: (code, orderValue) => request('/api/vouchers/redeem', { method: 'POST', body: { code, orderValue } }),
    createOrder: (payload) => request('/api/orders', { method: 'POST', body: payload }),
    updateOrderStatus: (orderId, status, paymentReference) =>
      request(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        body: { status, paymentReference }
      }),
    createOrderEvent: (orderId, eventType, payload, source) =>
      request(`/api/orders/${encodeURIComponent(orderId)}/events`, {
        method: 'POST',
        body: { eventType, payload, source }
      }),
    adminSession: () => request('/api/admin/session'),
    adminLogin: (email, password) => request('/api/admin/login', { method: 'POST', body: { email, password } }),
    adminLogout: () => request('/api/admin/logout', { method: 'POST', body: {} }),
    adminMenuItems: () => request('/api/menu-items'),
    adminCreateMenuItem: (payload) => request('/api/menu-items', { method: 'POST', body: payload }),
    adminUpdateMenuItem: (id, payload) =>
      request(`/api/menu-items/${encodeURIComponent(id)}`, { method: 'PATCH', body: payload }),
    adminDeleteMenuItem: (id) => request(`/api/menu-items/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    adminVouchers: () => request('/api/vouchers'),
    adminCreateVoucher: (payload) => request('/api/vouchers', { method: 'POST', body: payload }),
    adminUpdateVoucher: (id, payload) =>
      request(`/api/vouchers/${encodeURIComponent(id)}`, { method: 'PATCH', body: payload }),
    adminDeleteVoucher: (id) => request(`/api/vouchers/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    adminOrders: () => request('/api/orders'),
    adminOrderEvents: (orderId) => request(`/api/orders/${encodeURIComponent(orderId)}/events`),
    adminOrderItems: (orderId) => request(`/api/orders/${encodeURIComponent(orderId)}/items`),
    adminSaveOpeningHours: (data) => request('/api/opening-hours', { method: 'PUT', body: { data } })
  };
})(window);
