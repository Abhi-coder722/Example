const config = window.BAGO_SUPABASE || {};
const SUPABASE_URL = config.url || '';
const SUPABASE_ANON_KEY = config.anonKey || '';
const MENU_TABLE = config.menuTable || 'menu_items';
const VOUCHERS_TABLE = config.vouchersTable || 'vouchers';
const STORAGE_BUCKET = config.storageBucket || 'menu-images';
const SUPABASE_PLACEHOLDER = /YOUR_PROJECT|YOUR_ANON/i.test(`${SUPABASE_URL} ${SUPABASE_ANON_KEY}`);

const loginCard = document.querySelector('#loginCard');
const adminCard = document.querySelector('#adminCard');
const loginForm = document.querySelector('#loginForm');
const itemForm = document.querySelector('#itemForm');
const logoutButton = document.querySelector('#logoutButton');
const refreshItemsButton = document.querySelector('#refreshItems');
const resetFormButton = document.querySelector('#resetForm');
const voucherForm = document.querySelector('#voucherForm');
const refreshVouchersButton = document.querySelector('#refreshVouchers');
const resetVoucherFormButton = document.querySelector('#resetVoucherForm');
const loginStatus = document.querySelector('#loginStatus');
const adminStatus = document.querySelector('#adminStatus');
const voucherStatus = document.querySelector('#voucherStatus');
const itemsTableBody = document.querySelector('#itemsTableBody');
const vouchersTableBody = document.querySelector('#vouchersTableBody');

const state = {
  items: [],
  vouchers: [],
  busy: false,
  voucherBusy: false,
  session: null
};

const supabaseClient = window.supabase?.createClient && SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_PLACEHOLDER
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalize(value) {
  return String(value || '').trim();
}

function formatEuro(value) {
  const amount = Number.parseFloat(value);
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(safe);
}

function setStatus(target, message, isError = false) {
  target.textContent = message;
  target.style.color = isError ? '#ffb8b1' : '';
}

function setFormMode(editing) {
  const saveButton = document.querySelector('#saveItem');
  if (saveButton) {
    saveButton.textContent = editing ? 'Änderungen speichern' : 'Eintrag speichern';
  }
}

function clearItemForm() {
  itemForm.reset();
  itemForm.elements.id.value = '';
  itemForm.elements.available.checked = true;
  setFormMode(false);
}

function setVoucherFormMode(editing) {
  const saveButton = document.querySelector('#saveVoucher');
  if (saveButton) {
    saveButton.textContent = editing ? 'Voucher aktualisieren' : 'Voucher speichern';
  }
}

function clearVoucherForm() {
  if (!voucherForm) return;
  voucherForm.reset();
  voucherForm.elements.id.value = '';
  voucherForm.elements.active.checked = true;
  voucherForm.elements.usage_limit.value = '1';
  setVoucherFormMode(false);
}

function getTranslations(prefix) {
  return {
    de: normalize(itemForm.elements[`${prefix}_de`].value),
    en: normalize(itemForm.elements[`${prefix}_en`].value),
    ru: normalize(itemForm.elements[`${prefix}_ru`].value),
    ja: normalize(itemForm.elements[`${prefix}_ja`].value),
    tr: normalize(itemForm.elements[`${prefix}_tr`].value)
  };
}

function compactObject(values) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => normalize(value)));
}

function buildPayload(imageUrl) {
  const category = normalize(itemForm.elements.category.value);
  const price = Number.parseFloat(itemForm.elements.price.value);
  const names = getTranslations('name');
  const descriptions = getTranslations('description');

  if (!names.de) {
    throw new Error('Der deutsche Name ist erforderlich.');
  }

  return {
    category,
    price: Number.isFinite(price) ? price : 0,
    available: itemForm.elements.available.checked,
    image_url: imageUrl,
    image: imageUrl,
    name: names.de,
    description: descriptions.de,
    name_de: names.de,
    name_en: names.en,
    name_ru: names.ru,
    name_ja: names.ja,
    name_tr: names.tr,
    description_de: descriptions.de,
    description_en: descriptions.en,
    description_ru: descriptions.ru,
    description_ja: descriptions.ja,
    description_tr: descriptions.tr,
    name_translations: compactObject(names),
    description_translations: compactObject(descriptions),
    updated_at: new Date().toISOString()
  };
}

function populateForm(item) {
  itemForm.elements.id.value = item.id || '';
  itemForm.elements.category.value = item.category || '';
  itemForm.elements.price.value = Number.parseFloat(item.price || 0).toFixed(2);
  itemForm.elements.available.checked = item.available !== false;
  itemForm.elements.image_url.value = item.image_url || item.image || '';

  itemForm.elements.name_de.value = item.name_de || item.name || '';
  itemForm.elements.name_en.value = item.name_en || item.name_translations?.en || '';
  itemForm.elements.name_ru.value = item.name_ru || item.name_translations?.ru || '';
  itemForm.elements.name_ja.value = item.name_ja || item.name_translations?.ja || '';
  itemForm.elements.name_tr.value = item.name_tr || item.name_translations?.tr || '';

  itemForm.elements.description_de.value = item.description_de || item.description || '';
  itemForm.elements.description_en.value = item.description_en || item.description_translations?.en || '';
  itemForm.elements.description_ru.value = item.description_ru || item.description_translations?.ru || '';
  itemForm.elements.description_ja.value = item.description_ja || item.description_translations?.ja || '';
  itemForm.elements.description_tr.value = item.description_tr || item.description_translations?.tr || '';

  itemForm.elements.image_file.value = '';
  setFormMode(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderItems() {
  if (!state.items.length) {
    itemsTableBody.innerHTML = '<tr><td colspan="5">Keine Menüeinträge vorhanden.</td></tr>';
    return;
  }

  itemsTableBody.innerHTML = state.items
    .map((item) => {
      const name = item.name_de || item.name || '-';
      const statusLive = item.available !== false;

      return `
        <tr>
          <td>${escapeHtml(item.category || '-')}</td>
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(formatEuro(item.price))}</td>
          <td>
            <span class="status-pill ${statusLive ? 'is-live' : 'is-sold'}">
              ${statusLive ? 'Verfügbar' : 'Sold Out'}
            </span>
          </td>
          <td>
            <div class="row-actions">
              <button type="button" data-edit="${escapeHtml(item.id)}">Bearbeiten</button>
              <button type="button" data-toggle="${escapeHtml(item.id)}">${statusLive ? 'Sold Out setzen' : 'Aktivieren'}</button>
              <button type="button" data-delete="${escapeHtml(item.id)}">Löschen</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function populateVoucherForm(voucher) {
  if (!voucherForm) return;
  voucherForm.elements.id.value = voucher.id || '';
  voucherForm.elements.code.value = voucher.code || '';
  voucherForm.elements.discount_amount.value = Number.parseFloat(voucher.discount_amount || 0).toFixed(2);
  voucherForm.elements.usage_limit.value = String(Math.max(1, Number.parseInt(voucher.usage_limit, 10) || 1));
  voucherForm.elements.active.checked = voucher.active !== false;
  setVoucherFormMode(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderVouchers() {
  if (!vouchersTableBody) return;
  if (!state.vouchers.length) {
    vouchersTableBody.innerHTML = '<tr><td colspan="5">Keine Voucher vorhanden.</td></tr>';
    return;
  }

  vouchersTableBody.innerHTML = state.vouchers
    .map((voucher) => {
      const isActive = voucher.active !== false;
      const usageLimit = Math.max(1, Number.parseInt(voucher.usage_limit, 10) || 1);
      const timesUsed = Math.max(0, Number.parseInt(voucher.times_used, 10) || 0);
      return `
        <tr>
          <td>${escapeHtml(voucher.code || '-')}</td>
          <td>${escapeHtml(formatEuro(voucher.discount_amount))}</td>
          <td>
            <span class="status-pill ${isActive ? 'is-live' : 'is-sold'}">
              ${isActive ? 'Aktiv' : 'Inaktiv'}
            </span>
          </td>
          <td>${timesUsed}/${usageLimit}</td>
          <td>
            <div class="row-actions">
              <button type="button" data-voucher-edit="${escapeHtml(voucher.id)}">Bearbeiten</button>
              <button type="button" data-voucher-toggle="${escapeHtml(voucher.id)}">${
                isActive ? 'Deaktivieren' : 'Aktivieren'
              }</button>
              <button type="button" data-voucher-delete="${escapeHtml(voucher.id)}">Löschen</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

async function uploadImage(file) {
  if (!file) return '';

  const safeName = normalize(file.name)
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';

  const path = `menu/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const { error } = await supabaseClient.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false });
  if (error) {
    throw new Error(`Upload fehlgeschlagen: ${error.message}`);
  }

  const { data } = supabaseClient.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data?.publicUrl || '';
}

async function fetchItems() {
  let result = await supabaseClient.from(MENU_TABLE).select('*').order('category', { ascending: true }).order('name_de', {
    ascending: true
  });

  if (result.error && /name_de/i.test(result.error.message || '')) {
    result = await supabaseClient.from(MENU_TABLE).select('*').order('category', { ascending: true }).order('name', {
      ascending: true
    });
  }

  return result;
}

async function refreshItems() {
  if (!state.session) return;
  setStatus(adminStatus, 'Menü wird geladen...');

  const { data, error } = await fetchItems();
  if (error) {
    setStatus(adminStatus, `Fehler beim Laden: ${error.message}`, true);
    return;
  }

  state.items = Array.isArray(data) ? data : [];
  renderItems();
  setStatus(adminStatus, `${state.items.length} Einträge geladen.`);
}

async function fetchVouchers() {
  return supabaseClient
    .from(VOUCHERS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .order('code', { ascending: true });
}

async function refreshVouchers() {
  if (!state.session || !voucherForm || !vouchersTableBody) return;
  setStatus(voucherStatus, 'Voucher werden geladen...');

  const { data, error } = await fetchVouchers();
  if (error) {
    setStatus(voucherStatus, `Fehler beim Laden: ${error.message}`, true);
    return;
  }

  state.vouchers = Array.isArray(data) ? data : [];
  renderVouchers();
  setStatus(voucherStatus, `${state.vouchers.length} Voucher geladen.`);
}

function setAuthState(session) {
  state.session = session;
  const loggedIn = Boolean(session);

  loginCard.hidden = loggedIn;
  adminCard.hidden = !loggedIn;
  logoutButton.hidden = !loggedIn;

  if (loggedIn) {
    setStatus(loginStatus, '');
    refreshItems();
    refreshVouchers();
  } else {
    state.items = [];
    state.vouchers = [];
    renderItems();
    renderVouchers();
    clearVoucherForm();
  }
}

async function saveItem(event) {
  event.preventDefault();
  if (!state.session || state.busy) return;

  state.busy = true;
  setStatus(adminStatus, 'Speichere Menüeintrag...');

  try {
    const currentId = normalize(itemForm.elements.id.value);
    const file = itemForm.elements.image_file.files?.[0] || null;
    let imageUrl = normalize(itemForm.elements.image_url.value);

    if (file) {
      imageUrl = await uploadImage(file);
    }

    const payload = buildPayload(imageUrl);
    let response;

    if (currentId) {
      response = await supabaseClient.from(MENU_TABLE).update(payload).eq('id', currentId);
    } else {
      response = await supabaseClient.from(MENU_TABLE).insert(payload);
    }

    if (response.error) {
      throw new Error(response.error.message);
    }

    setStatus(adminStatus, currentId ? 'Eintrag aktualisiert.' : 'Eintrag hinzugefügt.');
    clearItemForm();
    await refreshItems();
  } catch (error) {
    setStatus(adminStatus, error.message || 'Unbekannter Fehler beim Speichern.', true);
  } finally {
    state.busy = false;
  }
}

async function toggleAvailability(id) {
  const item = state.items.find((entry) => String(entry.id) === String(id));
  if (!item) return;

  const { error } = await supabaseClient
    .from(MENU_TABLE)
    .update({ available: item.available === false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    setStatus(adminStatus, `Status konnte nicht geändert werden: ${error.message}`, true);
    return;
  }

  setStatus(adminStatus, 'Status aktualisiert.');
  await refreshItems();
}

async function deleteItem(id) {
  const item = state.items.find((entry) => String(entry.id) === String(id));
  const name = item?.name_de || item?.name || 'diesen Eintrag';
  const confirmed = window.confirm(`Soll ${name} wirklich gelöscht werden?`);
  if (!confirmed) return;

  const { error } = await supabaseClient.from(MENU_TABLE).delete().eq('id', id);
  if (error) {
    setStatus(adminStatus, `Löschen fehlgeschlagen: ${error.message}`, true);
    return;
  }

  if (normalize(itemForm.elements.id.value) === String(id)) {
    clearItemForm();
  }

  setStatus(adminStatus, 'Eintrag gelöscht.');
  await refreshItems();
}

function buildVoucherPayload() {
  const code = normalize(voucherForm.elements.code.value).toUpperCase();
  const discountAmount = Number.parseFloat(voucherForm.elements.discount_amount.value);
  const usageLimitRaw = Number.parseInt(voucherForm.elements.usage_limit.value, 10);
  const usageLimit = Number.isFinite(usageLimitRaw) ? Math.max(1, usageLimitRaw) : 1;

  if (!code) {
    throw new Error('Voucher-Code ist erforderlich.');
  }
  if (!Number.isFinite(discountAmount) || discountAmount <= 0) {
    throw new Error('Rabattbetrag muss größer als 0 sein.');
  }

  return {
    code,
    discount_amount: discountAmount,
    usage_limit: usageLimit,
    active: Boolean(voucherForm.elements.active.checked),
    updated_at: new Date().toISOString()
  };
}

async function saveVoucher(event) {
  event.preventDefault();
  if (!state.session || state.voucherBusy || !voucherForm) return;

  state.voucherBusy = true;
  setStatus(voucherStatus, 'Speichere Voucher...');

  try {
    const currentId = normalize(voucherForm.elements.id.value);
    const payload = buildVoucherPayload();
    let response;

    if (currentId) {
      response = await supabaseClient.from(VOUCHERS_TABLE).update(payload).eq('id', currentId);
    } else {
      response = await supabaseClient.from(VOUCHERS_TABLE).insert({
        ...payload,
        times_used: 0,
        created_at: new Date().toISOString()
      });
    }

    if (response.error) {
      throw new Error(response.error.message);
    }

    setStatus(voucherStatus, currentId ? 'Voucher aktualisiert.' : 'Voucher erstellt.');
    clearVoucherForm();
    await refreshVouchers();
  } catch (error) {
    setStatus(voucherStatus, error.message || 'Unbekannter Fehler beim Speichern.', true);
  } finally {
    state.voucherBusy = false;
  }
}

async function toggleVoucherActive(id) {
  const voucher = state.vouchers.find((entry) => String(entry.id) === String(id));
  if (!voucher) return;

  const { error } = await supabaseClient
    .from(VOUCHERS_TABLE)
    .update({ active: voucher.active === false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    setStatus(voucherStatus, `Status konnte nicht geändert werden: ${error.message}`, true);
    return;
  }

  setStatus(voucherStatus, 'Voucher-Status aktualisiert.');
  await refreshVouchers();
}

async function deleteVoucher(id) {
  const voucher = state.vouchers.find((entry) => String(entry.id) === String(id));
  const code = voucher?.code || 'diesen Voucher';
  const confirmed = window.confirm(`Soll ${code} wirklich gelöscht werden?`);
  if (!confirmed) return;

  const { error } = await supabaseClient.from(VOUCHERS_TABLE).delete().eq('id', id);
  if (error) {
    setStatus(voucherStatus, `Löschen fehlgeschlagen: ${error.message}`, true);
    return;
  }

  if (normalize(voucherForm?.elements.id.value) === String(id)) {
    clearVoucherForm();
  }

  setStatus(voucherStatus, 'Voucher gelöscht.');
  await refreshVouchers();
}

async function handleTableActions(event) {
  const editButton = event.target.closest('[data-edit]');
  const toggleButton = event.target.closest('[data-toggle]');
  const deleteButton = event.target.closest('[data-delete]');

  if (editButton) {
    const item = state.items.find((entry) => String(entry.id) === String(editButton.dataset.edit));
    if (item) {
      populateForm(item);
      setStatus(adminStatus, 'Eintrag zum Bearbeiten geladen.');
    }
  }

  if (toggleButton) {
    await toggleAvailability(toggleButton.dataset.toggle);
  }

  if (deleteButton) {
    await deleteItem(deleteButton.dataset.delete);
  }
}

async function handleVoucherTableActions(event) {
  const editButton = event.target.closest('[data-voucher-edit]');
  const toggleButton = event.target.closest('[data-voucher-toggle]');
  const deleteButton = event.target.closest('[data-voucher-delete]');

  if (editButton) {
    const voucher = state.vouchers.find((entry) => String(entry.id) === String(editButton.dataset.voucherEdit));
    if (voucher) {
      populateVoucherForm(voucher);
      setStatus(voucherStatus, 'Voucher zum Bearbeiten geladen.');
    }
  }

  if (toggleButton) {
    await toggleVoucherActive(toggleButton.dataset.voucherToggle);
  }

  if (deleteButton) {
    await deleteVoucher(deleteButton.dataset.voucherDelete);
  }
}

async function initializeAuth() {
  if (!supabaseClient) {
    setStatus(
      loginStatus,
      'Supabase ist nicht konfiguriert. Bitte URL und Anon Key in supabase-config.js eintragen.',
      true
    );
    loginForm.querySelectorAll('input,button').forEach((node) => {
      node.disabled = true;
    });
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    setStatus(loginStatus, `Session konnte nicht geladen werden: ${error.message}`, true);
  }

  setAuthState(data?.session || null);

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    setAuthState(session);
  });
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;

  const email = normalize(loginForm.elements.email.value);
  const password = loginForm.elements.password.value;
  setStatus(loginStatus, 'Login läuft...');

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    setStatus(loginStatus, `Login fehlgeschlagen: ${error.message}`, true);
    return;
  }

  loginForm.reset();
  setStatus(loginStatus, 'Login erfolgreich.');
});

logoutButton.addEventListener('click', async () => {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setStatus(adminStatus, `Logout fehlgeschlagen: ${error.message}`, true);
    return;
  }

  clearItemForm();
  clearVoucherForm();
  setStatus(adminStatus, '');
  setStatus(voucherStatus, '');
});

refreshItemsButton.addEventListener('click', () => {
  refreshItems();
});

resetFormButton.addEventListener('click', () => {
  clearItemForm();
  setStatus(adminStatus, 'Formular wurde zurückgesetzt.');
});

if (refreshVouchersButton) {
  refreshVouchersButton.addEventListener('click', () => {
    refreshVouchers();
  });
}

if (resetVoucherFormButton) {
  resetVoucherFormButton.addEventListener('click', () => {
    clearVoucherForm();
    setStatus(voucherStatus, 'Voucher-Form wurde zurückgesetzt.');
  });
}

itemForm.addEventListener('submit', saveItem);
itemsTableBody.addEventListener('click', (event) => {
  handleTableActions(event);
});

if (voucherForm) {
  voucherForm.addEventListener('submit', saveVoucher);
}

if (vouchersTableBody) {
  vouchersTableBody.addEventListener('click', (event) => {
    handleVoucherTableActions(event);
  });
}

clearItemForm();
clearVoucherForm();
initializeAuth();
