const config = window.BAGO_SUPABASE || {};
const SUPABASE_URL = config.url || '';
const SUPABASE_ANON_KEY = config.anonKey || '';
const MENU_TABLE = config.menuTable || 'menu_items';
const ORDERS_TABLE = config.ordersTable || 'orders';
const ORDER_EVENTS_TABLE = config.orderEventsTable || 'order_events';
const ORDER_ITEMS_TABLE = config.orderItemsTable || 'order_items';
const VOUCHERS_TABLE = config.vouchersTable || 'vouchers';
const OPENING_HOURS_TABLE = config.openingHoursTable || 'opening_hours';
const STORAGE_BUCKET = config.storageBucket || 'menu-images';
const SUPABASE_PLACEHOLDER = /YOUR_PROJECT|YOUR_ANON/i.test(`${SUPABASE_URL} ${SUPABASE_ANON_KEY}`);

const TRANSLATIONS = {
  de: {
    adminBack: '← Zur Website',
    adminEyebrow: 'Admin',
    adminTitle: 'Menü Verwaltung',
    logoutButton: 'Logout',
    loginTitle: 'Owner Login',
    loginIntro: 'Melde dich mit deinem Supabase Account an, um Menüeinträge zu verwalten.',
    emailLabel: 'Email',
    passwordLabel: 'Passwort',
    loginButton: 'Einloggen',
    menuEntriesTitle: 'Menüeinträge',
    menuEntriesIntro: 'Hinzufügen, bearbeiten, löschen, Sold-out setzen und Bilder hochladen.',
    refreshItems: 'Aktualisieren',
    categoryLabel: 'Kategorie',
    categoryPlaceholder: 'z. B. Maki',
    priceLabel: 'Preis (EUR)',
    imageUrlLabel: 'Bild-URL (optional)',
    imageUploadLabel: 'Bild hochladen (optional)',
    availabilityLabel: 'Verfügbar (deaktivieren = Sold Out)',
    namesTitle: 'Namen',
    descriptionsTitle: 'Beschreibungen',
    langGerman: 'Deutsch',
    langEnglish: 'English',
    langRussian: 'Russian',
    langJapanese: 'Japanese',
    langTurkish: 'Turkish',
    itemSaveButton: 'Eintrag speichern',
    itemSaveChangesButton: 'Änderungen speichern',
    resetItemForm: 'Formular zurücksetzen',
    tableCategory: 'Kategorie',
    tableNameDe: 'Name (DE)',
    tablePrice: 'Preis',
    tableStatus: 'Status',
    tableActions: 'Aktionen',
    itemSearchLabel: 'Einträge suchen',
    itemSearchPlaceholder: 'Nach Name, Kategorie oder Beschreibung suchen...',
    paginationPrev: 'Zurück',
    paginationNext: 'Weiter',
    paginationInfo: 'Seite {page} von {totalPages}',
    paginationSummary: '{from}-{to} von {total}',
    voucherTitle: 'Voucher Verwaltung',
    voucherIntro: 'Codes erstellen, aktivieren/deaktivieren und Nutzungslimit steuern.',
    refreshVouchers: 'Vouchers aktualisieren',
    voucherCodeLabel: 'Code',
    voucherAmountLabel: 'Rabattbetrag (EUR)',
    voucherUsageLimitLabel: 'Nutzungslimit',
    voucherActiveLabel: 'Aktiv',
    voucherSaveButton: 'Voucher speichern',
    voucherSaveChangesButton: 'Voucher aktualisieren',
    resetVoucherForm: 'Voucher-Form zurücksetzen',
    voucherTableCode: 'Code',
    voucherTableDiscount: 'Rabatt',
    voucherTableActive: 'Aktiv',
    voucherTableUsage: 'Verwendung',
    voucherTableActions: 'Aktionen',
    openingHoursTitle: 'Öffnungszeiten',
    openingHoursIntro: 'Lege Öffnungszeiten für Montag bis Sonntag fest.',
    refreshOpeningHours: 'Öffnungszeiten aktualisieren',
    saveOpeningHours: 'Öffnungszeiten speichern',
    openingHoursClosed: 'Geschlossen',
    openingHoursFrom: 'Von',
    openingHoursTo: 'Bis',
    orderTrackingTitle: 'Bestellverfolgung',
    orderTrackingIntro: 'Sieh dir Bestellungen und den Ereignisverlauf (Timeline) an.',
    refreshOrders: 'Bestellungen aktualisieren',
    orderSearchLabel: 'Bestellungen suchen',
    orderSearchPlaceholder: 'Nach Kunde, Telefon, Status oder Zahlungsart suchen...',
    orderTableId: 'Bestellung',
    orderTableDate: 'Datum',
    orderTableCustomer: 'Kunde',
    orderTablePayment: 'Zahlung',
    orderTableStatus: 'Status',
    orderTableTotal: 'Gesamt',
    orderTableActions: 'Aktionen',
    orderActionViewTimeline: 'Timeline',
    orderEventsTitle: 'Bestell-Timeline',
    orderEventsHint: 'Wähle eine Bestellung aus, um Ereignisse zu sehen.',
    orderEventsFor: 'Timeline für {orderId}',
    orderItemsTitle: 'Bestellpositionen',
    orderItemsHint: 'Wähle eine Bestellung aus, um Artikel zu sehen.',
    orderItemsFor: 'Artikel für {orderId}',
    itemTableName: 'Artikel',
    itemTableQty: 'Menge',
    itemTableUnitPrice: 'Einzelpreis',
    itemTableLineTotal: 'Zwischensumme',
    eventTableTime: 'Zeit',
    eventTableType: 'Typ',
    eventTableSource: 'Quelle',
    eventTablePayload: 'Details',
    dayMonday: 'Montag',
    dayTuesday: 'Dienstag',
    dayWednesday: 'Mittwoch',
    dayThursday: 'Donnerstag',
    dayFriday: 'Freitag',
    daySaturday: 'Samstag',
    daySunday: 'Sonntag',
    statusNoMenuItems: 'Keine Menüeinträge vorhanden.',
    statusNoMenuItemsFiltered: 'Keine Menüeinträge passend zur Suche.',
    statusNoVouchers: 'Keine Voucher vorhanden.',
    statusNoOrders: 'Keine Bestellungen vorhanden.',
    statusNoOrdersFiltered: 'Keine Bestellungen passend zur Suche.',
    statusNoOrderEvents: 'Für diese Bestellung gibt es noch keine Ereignisse.',
    statusNoOrderItems: 'Für diese Bestellung gibt es noch keine Artikel.',
    statusOrdersLoading: 'Bestellungen werden geladen...',
    statusOrdersLoaded: '{count} Bestellungen geladen.',
    statusOrderEventsLoading: 'Bestell-Timeline wird geladen...',
    statusOrderEventsLoaded: '{count} Ereignisse geladen.',
    statusOrderItemsLoading: 'Bestellpositionen werden geladen...',
    statusOrderItemsLoaded: '{count} Positionen geladen.',
    statusOrderEventsTableMissing:
      'Die Tabelle order_events fehlt noch. Bitte zuerst die neueste Supabase-Migration ausführen.',
    statusOrderItemsTableMissing:
      'Die Tabelle order_items fehlt noch. Bitte zuerst die neueste Supabase-Migration ausführen.',
    statusAvailable: 'Verfügbar',
    statusSoldOut: 'Sold Out',
    statusActive: 'Aktiv',
    statusInactive: 'Inaktiv',
    actionEdit: 'Bearbeiten',
    actionDelete: 'Löschen',
    actionSetSoldOut: 'Sold Out setzen',
    actionActivate: 'Aktivieren',
    actionDeactivate: 'Deaktivieren',
    errorNameDeRequired: 'Der deutsche Name ist erforderlich.',
    errorUploadFailed: 'Upload fehlgeschlagen: {message}',
    statusMenuLoading: 'Menü wird geladen...',
    statusLoadError: 'Fehler beim Laden: {message}',
    statusItemsLoaded: '{count} Einträge geladen.',
    statusVoucherLoading: 'Voucher werden geladen...',
    statusVouchersLoaded: '{count} Voucher geladen.',
    statusItemSaving: 'Speichere Menüeintrag...',
    statusItemUpdated: 'Eintrag aktualisiert.',
    statusItemAdded: 'Eintrag hinzugefügt.',
    statusUnknownSaveError: 'Unbekannter Fehler beim Speichern.',
    statusToggleError: 'Status konnte nicht geändert werden: {message}',
    statusUpdated: 'Status aktualisiert.',
    confirmDeleteItem: 'Soll {name} wirklich gelöscht werden?',
    statusDeleteFailed: 'Löschen fehlgeschlagen: {message}',
    statusDeleted: 'Eintrag gelöscht.',
    errorVoucherCodeRequired: 'Voucher-Code ist erforderlich.',
    errorVoucherDiscountPositive: 'Rabattbetrag muss größer als 0 sein.',
    statusVoucherSaving: 'Speichere Voucher...',
    statusVoucherUpdated: 'Voucher aktualisiert.',
    statusVoucherCreated: 'Voucher erstellt.',
    statusVoucherUnknownSaveError: 'Unbekannter Fehler beim Speichern.',
    statusVoucherToggleError: 'Status konnte nicht geändert werden: {message}',
    statusVoucherStatusUpdated: 'Voucher-Status aktualisiert.',
    confirmDeleteVoucher: 'Soll {code} wirklich gelöscht werden?',
    statusVoucherDeleteFailed: 'Löschen fehlgeschlagen: {message}',
    statusVoucherDeleted: 'Voucher gelöscht.',
    statusOpeningHoursLoading: 'Öffnungszeiten werden geladen...',
    statusOpeningHoursLoaded: 'Öffnungszeiten geladen.',
    statusOpeningHoursSaving: 'Öffnungszeiten werden gespeichert...',
    statusOpeningHoursSaved: 'Öffnungszeiten gespeichert.',
    errorOpeningHoursTimeRequired: 'Bitte für jeden geöffneten Tag Start- und Endzeit angeben.',
    errorOpeningHoursRange: 'Die Endzeit muss nach der Startzeit liegen.',
    statusEditLoaded: 'Eintrag zum Bearbeiten geladen.',
    statusVoucherEditLoaded: 'Voucher zum Bearbeiten geladen.',
    statusSupabaseMissing:
      'Supabase ist nicht konfiguriert. Bitte .env aktualisieren und npm run config:build ausführen.',
    statusSessionLoadFailed: 'Session konnte nicht geladen werden: {message}',
    statusLoginRunning: 'Login läuft...',
    statusLoginFailed: 'Login fehlgeschlagen: {message}',
    statusLoginSuccess: 'Login erfolgreich.',
    statusLogoutFailed: 'Logout fehlgeschlagen: {message}',
    statusFormReset: 'Formular wurde zurückgesetzt.',
    statusVoucherFormReset: 'Voucher-Form wurde zurückgesetzt.'
  },
  en: {
    adminBack: '← Back to website',
    adminEyebrow: 'Admin',
    adminTitle: 'Menu Management',
    logoutButton: 'Logout',
    loginTitle: 'Owner Login',
    loginIntro: 'Sign in with your Supabase account to manage menu items.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginButton: 'Sign in',
    menuEntriesTitle: 'Menu Items',
    menuEntriesIntro: 'Add, edit, delete, mark sold out, and upload images.',
    refreshItems: 'Refresh',
    categoryLabel: 'Category',
    categoryPlaceholder: 'e.g. Maki',
    priceLabel: 'Price (EUR)',
    imageUrlLabel: 'Image URL (optional)',
    imageUploadLabel: 'Upload image (optional)',
    availabilityLabel: 'Available (disable = Sold Out)',
    namesTitle: 'Names',
    descriptionsTitle: 'Descriptions',
    langGerman: 'Deutsch',
    langEnglish: 'English',
    langRussian: 'Russian',
    langJapanese: 'Japanese',
    langTurkish: 'Turkish',
    itemSaveButton: 'Save item',
    itemSaveChangesButton: 'Save changes',
    resetItemForm: 'Reset form',
    tableCategory: 'Category',
    tableNameDe: 'Name (DE)',
    tablePrice: 'Price',
    tableStatus: 'Status',
    tableActions: 'Actions',
    itemSearchLabel: 'Search entries',
    itemSearchPlaceholder: 'Search by name, category, or description...',
    paginationPrev: 'Previous',
    paginationNext: 'Next',
    paginationInfo: 'Page {page} of {totalPages}',
    paginationSummary: '{from}-{to} of {total}',
    voucherTitle: 'Voucher Management',
    voucherIntro: 'Create codes, activate/deactivate, and manage usage limits.',
    refreshVouchers: 'Refresh vouchers',
    voucherCodeLabel: 'Code',
    voucherAmountLabel: 'Discount amount (EUR)',
    voucherUsageLimitLabel: 'Usage limit',
    voucherActiveLabel: 'Active',
    voucherSaveButton: 'Save voucher',
    voucherSaveChangesButton: 'Update voucher',
    resetVoucherForm: 'Reset voucher form',
    voucherTableCode: 'Code',
    voucherTableDiscount: 'Discount',
    voucherTableActive: 'Active',
    voucherTableUsage: 'Usage',
    voucherTableActions: 'Actions',
    openingHoursTitle: 'Opening Hours',
    openingHoursIntro: 'Set opening hours for Monday through Sunday.',
    refreshOpeningHours: 'Refresh opening hours',
    saveOpeningHours: 'Save opening hours',
    openingHoursClosed: 'Closed',
    openingHoursFrom: 'From',
    openingHoursTo: 'To',
    orderTrackingTitle: 'Order Tracking',
    orderTrackingIntro: 'Review orders and their event timeline.',
    refreshOrders: 'Refresh orders',
    orderSearchLabel: 'Search orders',
    orderSearchPlaceholder: 'Search by customer, phone, status, or payment method...',
    orderTableId: 'Order',
    orderTableDate: 'Date',
    orderTableCustomer: 'Customer',
    orderTablePayment: 'Payment',
    orderTableStatus: 'Status',
    orderTableTotal: 'Total',
    orderTableActions: 'Actions',
    orderActionViewTimeline: 'Timeline',
    orderEventsTitle: 'Order Timeline',
    orderEventsHint: 'Select an order to view its events.',
    orderEventsFor: 'Timeline for {orderId}',
    orderItemsTitle: 'Order Items',
    orderItemsHint: 'Select an order to view its items.',
    orderItemsFor: 'Items for {orderId}',
    itemTableName: 'Item',
    itemTableQty: 'Qty',
    itemTableUnitPrice: 'Unit price',
    itemTableLineTotal: 'Line total',
    eventTableTime: 'Time',
    eventTableType: 'Type',
    eventTableSource: 'Source',
    eventTablePayload: 'Details',
    dayMonday: 'Monday',
    dayTuesday: 'Tuesday',
    dayWednesday: 'Wednesday',
    dayThursday: 'Thursday',
    dayFriday: 'Friday',
    daySaturday: 'Saturday',
    daySunday: 'Sunday',
    statusNoMenuItems: 'No menu items available.',
    statusNoMenuItemsFiltered: 'No menu entries match your search.',
    statusNoVouchers: 'No vouchers available.',
    statusNoOrders: 'No orders available.',
    statusNoOrdersFiltered: 'No orders match your search.',
    statusNoOrderEvents: 'No events found for this order yet.',
    statusNoOrderItems: 'No item rows found for this order yet.',
    statusOrdersLoading: 'Loading orders...',
    statusOrdersLoaded: '{count} orders loaded.',
    statusOrderEventsLoading: 'Loading order timeline...',
    statusOrderEventsLoaded: '{count} events loaded.',
    statusOrderItemsLoading: 'Loading order items...',
    statusOrderItemsLoaded: '{count} item rows loaded.',
    statusOrderEventsTableMissing: 'order_events table is missing. Run the latest Supabase migration first.',
    statusOrderItemsTableMissing: 'order_items table is missing. Run the latest Supabase migration first.',
    statusAvailable: 'Available',
    statusSoldOut: 'Sold Out',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    actionEdit: 'Edit',
    actionDelete: 'Delete',
    actionSetSoldOut: 'Set Sold Out',
    actionActivate: 'Activate',
    actionDeactivate: 'Deactivate',
    errorNameDeRequired: 'German name is required.',
    errorUploadFailed: 'Upload failed: {message}',
    statusMenuLoading: 'Loading menu...',
    statusLoadError: 'Loading failed: {message}',
    statusItemsLoaded: '{count} entries loaded.',
    statusVoucherLoading: 'Loading vouchers...',
    statusVouchersLoaded: '{count} vouchers loaded.',
    statusItemSaving: 'Saving menu item...',
    statusItemUpdated: 'Item updated.',
    statusItemAdded: 'Item added.',
    statusUnknownSaveError: 'Unknown error while saving.',
    statusToggleError: 'Could not change status: {message}',
    statusUpdated: 'Status updated.',
    confirmDeleteItem: 'Delete {name}?',
    statusDeleteFailed: 'Delete failed: {message}',
    statusDeleted: 'Item deleted.',
    errorVoucherCodeRequired: 'Voucher code is required.',
    errorVoucherDiscountPositive: 'Discount must be greater than 0.',
    statusVoucherSaving: 'Saving voucher...',
    statusVoucherUpdated: 'Voucher updated.',
    statusVoucherCreated: 'Voucher created.',
    statusVoucherUnknownSaveError: 'Unknown error while saving.',
    statusVoucherToggleError: 'Could not change status: {message}',
    statusVoucherStatusUpdated: 'Voucher status updated.',
    confirmDeleteVoucher: 'Delete voucher {code}?',
    statusVoucherDeleteFailed: 'Delete failed: {message}',
    statusVoucherDeleted: 'Voucher deleted.',
    statusOpeningHoursLoading: 'Loading opening hours...',
    statusOpeningHoursLoaded: 'Opening hours loaded.',
    statusOpeningHoursSaving: 'Saving opening hours...',
    statusOpeningHoursSaved: 'Opening hours saved.',
    errorOpeningHoursTimeRequired: 'Please set start and end time for every open day.',
    errorOpeningHoursRange: 'End time must be later than start time.',
    statusEditLoaded: 'Item loaded for editing.',
    statusVoucherEditLoaded: 'Voucher loaded for editing.',
    statusSupabaseMissing: 'Supabase is not configured. Update .env and run npm run config:build.',
    statusSessionLoadFailed: 'Could not load session: {message}',
    statusLoginRunning: 'Signing in...',
    statusLoginFailed: 'Login failed: {message}',
    statusLoginSuccess: 'Login successful.',
    statusLogoutFailed: 'Logout failed: {message}',
    statusFormReset: 'Form was reset.',
    statusVoucherFormReset: 'Voucher form was reset.'
  },
  ru: {
    adminBack: '← Назад на сайт',
    adminEyebrow: 'Админ',
    adminTitle: 'Управление меню',
    logoutButton: 'Выйти',
    loginTitle: 'Вход владельца',
    loginIntro: 'Войдите через Supabase, чтобы управлять позициями меню.',
    emailLabel: 'Email',
    passwordLabel: 'Пароль',
    loginButton: 'Войти',
    menuEntriesTitle: 'Позиции меню',
    menuEntriesIntro: 'Добавление, редактирование, удаление, sold out и загрузка изображений.',
    refreshItems: 'Обновить',
    categoryLabel: 'Категория',
    categoryPlaceholder: 'например, Maki',
    priceLabel: 'Цена (EUR)',
    imageUrlLabel: 'URL изображения (необязательно)',
    imageUploadLabel: 'Загрузить изображение (необязательно)',
    availabilityLabel: 'Доступно (выключить = Sold Out)',
    namesTitle: 'Названия',
    descriptionsTitle: 'Описания',
    langGerman: 'Немецкий',
    langEnglish: 'Английский',
    langRussian: 'Русский',
    langJapanese: 'Японский',
    langTurkish: 'Турецкий',
    itemSaveButton: 'Сохранить позицию',
    itemSaveChangesButton: 'Сохранить изменения',
    resetItemForm: 'Сбросить форму',
    tableCategory: 'Категория',
    tableNameDe: 'Название (DE)',
    tablePrice: 'Цена',
    tableStatus: 'Статус',
    tableActions: 'Действия',
    itemSearchLabel: 'Поиск записей',
    itemSearchPlaceholder: 'Поиск по названию, категории или описанию...',
    paginationPrev: 'Назад',
    paginationNext: 'Вперёд',
    paginationInfo: 'Страница {page} из {totalPages}',
    paginationSummary: '{from}-{to} из {total}',
    voucherTitle: 'Управление ваучерами',
    voucherIntro: 'Создавайте коды, включайте/выключайте и управляйте лимитом использования.',
    refreshVouchers: 'Обновить ваучеры',
    voucherCodeLabel: 'Код',
    voucherAmountLabel: 'Сумма скидки (EUR)',
    voucherUsageLimitLabel: 'Лимит использования',
    voucherActiveLabel: 'Активен',
    voucherSaveButton: 'Сохранить ваучер',
    voucherSaveChangesButton: 'Обновить ваучер',
    resetVoucherForm: 'Сбросить форму ваучера',
    voucherTableCode: 'Код',
    voucherTableDiscount: 'Скидка',
    voucherTableActive: 'Активен',
    voucherTableUsage: 'Использование',
    voucherTableActions: 'Действия',
    openingHoursTitle: 'Часы работы',
    openingHoursIntro: 'Настройте часы работы с понедельника по воскресенье.',
    refreshOpeningHours: 'Обновить часы работы',
    saveOpeningHours: 'Сохранить часы работы',
    openingHoursClosed: 'Закрыто',
    openingHoursFrom: 'С',
    openingHoursTo: 'До',
    orderTrackingTitle: 'Отслеживание заказов',
    orderTrackingIntro: 'Просматривайте заказы и их таймлайн событий.',
    refreshOrders: 'Обновить заказы',
    orderSearchLabel: 'Поиск заказов',
    orderSearchPlaceholder: 'Поиск по клиенту, телефону, статусу или оплате...',
    orderTableId: 'Заказ',
    orderTableDate: 'Дата',
    orderTableCustomer: 'Клиент',
    orderTablePayment: 'Оплата',
    orderTableStatus: 'Статус',
    orderTableTotal: 'Сумма',
    orderTableActions: 'Действия',
    orderActionViewTimeline: 'Таймлайн',
    orderEventsTitle: 'Таймлайн заказа',
    orderEventsHint: 'Выберите заказ, чтобы увидеть события.',
    orderEventsFor: 'Таймлайн для {orderId}',
    orderItemsTitle: 'Позиции заказа',
    orderItemsHint: 'Выберите заказ, чтобы увидеть позиции.',
    orderItemsFor: 'Позиции для {orderId}',
    itemTableName: 'Позиция',
    itemTableQty: 'Кол-во',
    itemTableUnitPrice: 'Цена за шт.',
    itemTableLineTotal: 'Сумма',
    eventTableTime: 'Время',
    eventTableType: 'Тип',
    eventTableSource: 'Источник',
    eventTablePayload: 'Детали',
    dayMonday: 'Понедельник',
    dayTuesday: 'Вторник',
    dayWednesday: 'Среда',
    dayThursday: 'Четверг',
    dayFriday: 'Пятница',
    daySaturday: 'Суббота',
    daySunday: 'Воскресенье',
    statusNoMenuItems: 'Позиции меню отсутствуют.',
    statusNoMenuItemsFiltered: 'По вашему запросу ничего не найдено.',
    statusNoVouchers: 'Ваучеры отсутствуют.',
    statusNoOrders: 'Заказы отсутствуют.',
    statusNoOrdersFiltered: 'Нет заказов по текущему поиску.',
    statusNoOrderEvents: 'Для этого заказа пока нет событий.',
    statusNoOrderItems: 'Для этого заказа позиции пока не найдены.',
    statusOrdersLoading: 'Загрузка заказов...',
    statusOrdersLoaded: 'Загружено заказов: {count}.',
    statusOrderEventsLoading: 'Загрузка таймлайна заказа...',
    statusOrderEventsLoaded: 'Загружено событий: {count}.',
    statusOrderItemsLoading: 'Загрузка позиций заказа...',
    statusOrderItemsLoaded: 'Загружено позиций: {count}.',
    statusOrderEventsTableMissing:
      'Таблица order_events отсутствует. Сначала примените последнюю миграцию Supabase.',
    statusOrderItemsTableMissing:
      'Таблица order_items отсутствует. Сначала примените последнюю миграцию Supabase.',
    statusAvailable: 'Доступно',
    statusSoldOut: 'Sold Out',
    statusActive: 'Активен',
    statusInactive: 'Неактивен',
    actionEdit: 'Редактировать',
    actionDelete: 'Удалить',
    actionSetSoldOut: 'Сделать Sold Out',
    actionActivate: 'Активировать',
    actionDeactivate: 'Деактивировать',
    errorNameDeRequired: 'Немецкое название обязательно.',
    errorUploadFailed: 'Не удалось загрузить: {message}',
    statusMenuLoading: 'Загрузка меню...',
    statusLoadError: 'Ошибка загрузки: {message}',
    statusItemsLoaded: 'Загружено записей: {count}.',
    statusVoucherLoading: 'Загрузка ваучеров...',
    statusVouchersLoaded: 'Загружено ваучеров: {count}.',
    statusItemSaving: 'Сохранение позиции меню...',
    statusItemUpdated: 'Позиция обновлена.',
    statusItemAdded: 'Позиция добавлена.',
    statusUnknownSaveError: 'Неизвестная ошибка при сохранении.',
    statusToggleError: 'Не удалось изменить статус: {message}',
    statusUpdated: 'Статус обновлен.',
    confirmDeleteItem: 'Удалить {name}?',
    statusDeleteFailed: 'Не удалось удалить: {message}',
    statusDeleted: 'Позиция удалена.',
    errorVoucherCodeRequired: 'Код ваучера обязателен.',
    errorVoucherDiscountPositive: 'Скидка должна быть больше 0.',
    statusVoucherSaving: 'Сохранение ваучера...',
    statusVoucherUpdated: 'Ваучер обновлен.',
    statusVoucherCreated: 'Ваучер создан.',
    statusVoucherUnknownSaveError: 'Неизвестная ошибка при сохранении.',
    statusVoucherToggleError: 'Не удалось изменить статус: {message}',
    statusVoucherStatusUpdated: 'Статус ваучера обновлен.',
    confirmDeleteVoucher: 'Удалить ваучер {code}?',
    statusVoucherDeleteFailed: 'Не удалось удалить: {message}',
    statusVoucherDeleted: 'Ваучер удален.',
    statusOpeningHoursLoading: 'Загрузка часов работы...',
    statusOpeningHoursLoaded: 'Часы работы загружены.',
    statusOpeningHoursSaving: 'Сохранение часов работы...',
    statusOpeningHoursSaved: 'Часы работы сохранены.',
    errorOpeningHoursTimeRequired: 'Для каждого открытого дня укажите время начала и окончания.',
    errorOpeningHoursRange: 'Время окончания должно быть позже времени начала.',
    statusEditLoaded: 'Запись загружена для редактирования.',
    statusVoucherEditLoaded: 'Ваучер загружен для редактирования.',
    statusSupabaseMissing: 'Supabase не настроен. Обновите .env и выполните npm run config:build.',
    statusSessionLoadFailed: 'Не удалось загрузить сессию: {message}',
    statusLoginRunning: 'Вход...',
    statusLoginFailed: 'Ошибка входа: {message}',
    statusLoginSuccess: 'Вход выполнен.',
    statusLogoutFailed: 'Ошибка выхода: {message}',
    statusFormReset: 'Форма сброшена.',
    statusVoucherFormReset: 'Форма ваучера сброшена.'
  },
  ja: {
    adminBack: '← サイトへ戻る',
    adminEyebrow: '管理',
    adminTitle: 'メニュー管理',
    logoutButton: 'ログアウト',
    loginTitle: 'オーナーログイン',
    loginIntro: 'Supabase アカウントでログインしてメニューを管理します。',
    emailLabel: 'Email',
    passwordLabel: 'パスワード',
    loginButton: 'ログイン',
    menuEntriesTitle: 'メニュー項目',
    menuEntriesIntro: '追加・編集・削除・売り切れ設定・画像アップロード。',
    refreshItems: '更新',
    categoryLabel: 'カテゴリ',
    categoryPlaceholder: '例: Maki',
    priceLabel: '価格 (EUR)',
    imageUrlLabel: '画像URL（任意）',
    imageUploadLabel: '画像アップロード（任意）',
    availabilityLabel: '販売中（無効=売り切れ）',
    namesTitle: '名前',
    descriptionsTitle: '説明',
    langGerman: 'ドイツ語',
    langEnglish: '英語',
    langRussian: 'ロシア語',
    langJapanese: '日本語',
    langTurkish: 'トルコ語',
    itemSaveButton: '項目を保存',
    itemSaveChangesButton: '変更を保存',
    resetItemForm: 'フォームをリセット',
    tableCategory: 'カテゴリ',
    tableNameDe: '名前 (DE)',
    tablePrice: '価格',
    tableStatus: 'ステータス',
    tableActions: '操作',
    itemSearchLabel: '項目を検索',
    itemSearchPlaceholder: '名前・カテゴリ・説明で検索...',
    paginationPrev: '前へ',
    paginationNext: '次へ',
    paginationInfo: '{totalPages} ページ中 {page} ページ',
    paginationSummary: '{total} 件中 {from}-{to}',
    voucherTitle: 'クーポン管理',
    voucherIntro: 'コード作成、有効/無効、利用上限を管理します。',
    refreshVouchers: 'クーポン更新',
    voucherCodeLabel: 'コード',
    voucherAmountLabel: '割引額 (EUR)',
    voucherUsageLimitLabel: '利用上限',
    voucherActiveLabel: '有効',
    voucherSaveButton: 'クーポン保存',
    voucherSaveChangesButton: 'クーポン更新',
    resetVoucherForm: 'クーポンフォームをリセット',
    voucherTableCode: 'コード',
    voucherTableDiscount: '割引',
    voucherTableActive: '有効',
    voucherTableUsage: '利用数',
    voucherTableActions: '操作',
    openingHoursTitle: '営業時間',
    openingHoursIntro: '月曜日から日曜日までの営業時間を設定します。',
    refreshOpeningHours: '営業時間を更新',
    saveOpeningHours: '営業時間を保存',
    openingHoursClosed: '休業',
    openingHoursFrom: '開始',
    openingHoursTo: '終了',
    orderTrackingTitle: '注文トラッキング',
    orderTrackingIntro: '注文一覧とイベントタイムラインを確認できます。',
    refreshOrders: '注文を更新',
    orderSearchLabel: '注文を検索',
    orderSearchPlaceholder: '顧客名・電話・ステータス・支払い方法で検索...',
    orderTableId: '注文',
    orderTableDate: '日時',
    orderTableCustomer: '顧客',
    orderTablePayment: '支払い',
    orderTableStatus: 'ステータス',
    orderTableTotal: '合計',
    orderTableActions: '操作',
    orderActionViewTimeline: 'タイムライン',
    orderEventsTitle: '注文タイムライン',
    orderEventsHint: '注文を選択するとイベントを表示します。',
    orderEventsFor: '{orderId} のタイムライン',
    orderItemsTitle: '注文商品',
    orderItemsHint: '商品を表示するには注文を選択してください。',
    orderItemsFor: '{orderId} の商品',
    itemTableName: '商品',
    itemTableQty: '数量',
    itemTableUnitPrice: '単価',
    itemTableLineTotal: '小計',
    eventTableTime: '時間',
    eventTableType: '種類',
    eventTableSource: 'ソース',
    eventTablePayload: '詳細',
    dayMonday: '月曜日',
    dayTuesday: '火曜日',
    dayWednesday: '水曜日',
    dayThursday: '木曜日',
    dayFriday: '金曜日',
    daySaturday: '土曜日',
    daySunday: '日曜日',
    statusNoMenuItems: 'メニュー項目がありません。',
    statusNoMenuItemsFiltered: '検索条件に一致する項目がありません。',
    statusNoVouchers: 'クーポンがありません。',
    statusNoOrders: '注文がありません。',
    statusNoOrdersFiltered: '検索条件に一致する注文がありません。',
    statusNoOrderEvents: 'この注文のイベントはまだありません。',
    statusNoOrderItems: 'この注文には商品がまだありません。',
    statusOrdersLoading: '注文を読み込み中...',
    statusOrdersLoaded: '{count} 件の注文を読み込みました。',
    statusOrderEventsLoading: '注文タイムラインを読み込み中...',
    statusOrderEventsLoaded: '{count} 件のイベントを読み込みました。',
    statusOrderItemsLoading: '注文商品を読み込み中...',
    statusOrderItemsLoaded: '{count} 件の商品を読み込みました。',
    statusOrderEventsTableMissing: 'order_events テーブルがありません。最新の Supabase マイグレーションを適用してください。',
    statusOrderItemsTableMissing: 'order_items テーブルがありません。最新の Supabase マイグレーションを適用してください。',
    statusAvailable: '販売中',
    statusSoldOut: '売り切れ',
    statusActive: '有効',
    statusInactive: '無効',
    actionEdit: '編集',
    actionDelete: '削除',
    actionSetSoldOut: '売り切れにする',
    actionActivate: '有効化',
    actionDeactivate: '無効化',
    errorNameDeRequired: 'ドイツ語名は必須です。',
    errorUploadFailed: 'アップロード失敗: {message}',
    statusMenuLoading: 'メニューを読み込み中...',
    statusLoadError: '読み込み失敗: {message}',
    statusItemsLoaded: '{count} 件を読み込みました。',
    statusVoucherLoading: 'クーポンを読み込み中...',
    statusVouchersLoaded: '{count} 件のクーポンを読み込みました。',
    statusItemSaving: 'メニュー項目を保存中...',
    statusItemUpdated: '項目を更新しました。',
    statusItemAdded: '項目を追加しました。',
    statusUnknownSaveError: '保存中に不明なエラーが発生しました。',
    statusToggleError: 'ステータス変更に失敗しました: {message}',
    statusUpdated: 'ステータスを更新しました。',
    confirmDeleteItem: '{name} を削除しますか？',
    statusDeleteFailed: '削除に失敗しました: {message}',
    statusDeleted: '項目を削除しました。',
    errorVoucherCodeRequired: 'クーポンコードは必須です。',
    errorVoucherDiscountPositive: '割引額は 0 より大きくしてください。',
    statusVoucherSaving: 'クーポンを保存中...',
    statusVoucherUpdated: 'クーポンを更新しました。',
    statusVoucherCreated: 'クーポンを作成しました。',
    statusVoucherUnknownSaveError: '保存中に不明なエラーが発生しました。',
    statusVoucherToggleError: 'ステータス変更に失敗しました: {message}',
    statusVoucherStatusUpdated: 'クーポンのステータスを更新しました。',
    confirmDeleteVoucher: 'クーポン {code} を削除しますか？',
    statusVoucherDeleteFailed: '削除に失敗しました: {message}',
    statusVoucherDeleted: 'クーポンを削除しました。',
    statusOpeningHoursLoading: '営業時間を読み込み中...',
    statusOpeningHoursLoaded: '営業時間を読み込みました。',
    statusOpeningHoursSaving: '営業時間を保存中...',
    statusOpeningHoursSaved: '営業時間を保存しました。',
    errorOpeningHoursTimeRequired: '営業日の開始時刻と終了時刻を入力してください。',
    errorOpeningHoursRange: '終了時刻は開始時刻より後にしてください。',
    statusEditLoaded: '編集用に読み込みました。',
    statusVoucherEditLoaded: 'クーポンを編集用に読み込みました。',
    statusSupabaseMissing: 'Supabase が未設定です。.env を更新し npm run config:build を実行してください。',
    statusSessionLoadFailed: 'セッションを読み込めませんでした: {message}',
    statusLoginRunning: 'ログイン中...',
    statusLoginFailed: 'ログイン失敗: {message}',
    statusLoginSuccess: 'ログイン成功。',
    statusLogoutFailed: 'ログアウト失敗: {message}',
    statusFormReset: 'フォームをリセットしました。',
    statusVoucherFormReset: 'クーポンフォームをリセットしました。'
  },
  tr: {
    adminBack: '← Siteye dön',
    adminEyebrow: 'Yönetim',
    adminTitle: 'Menü Yönetimi',
    logoutButton: 'Çıkış',
    loginTitle: 'Sahip Girişi',
    loginIntro: 'Menü öğelerini yönetmek için Supabase hesabınla giriş yap.',
    emailLabel: 'Email',
    passwordLabel: 'Şifre',
    loginButton: 'Giriş yap',
    menuEntriesTitle: 'Menü Öğeleri',
    menuEntriesIntro: 'Ekle, düzenle, sil, tükendi olarak işaretle ve görsel yükle.',
    refreshItems: 'Yenile',
    categoryLabel: 'Kategori',
    categoryPlaceholder: 'örn. Maki',
    priceLabel: 'Fiyat (EUR)',
    imageUrlLabel: 'Görsel URL (opsiyonel)',
    imageUploadLabel: 'Görsel yükle (opsiyonel)',
    availabilityLabel: 'Mevcut (kapat = Tükendi)',
    namesTitle: 'Adlar',
    descriptionsTitle: 'Açıklamalar',
    langGerman: 'Almanca',
    langEnglish: 'İngilizce',
    langRussian: 'Rusça',
    langJapanese: 'Japonca',
    langTurkish: 'Türkçe',
    itemSaveButton: 'Öğeyi kaydet',
    itemSaveChangesButton: 'Değişiklikleri kaydet',
    resetItemForm: 'Formu sıfırla',
    tableCategory: 'Kategori',
    tableNameDe: 'Ad (DE)',
    tablePrice: 'Fiyat',
    tableStatus: 'Durum',
    tableActions: 'İşlemler',
    itemSearchLabel: 'Kayıt ara',
    itemSearchPlaceholder: 'Ad, kategori veya açıklama ile ara...',
    paginationPrev: 'Önceki',
    paginationNext: 'Sonraki',
    paginationInfo: 'Sayfa {page}/{totalPages}',
    paginationSummary: '{from}-{to} / {total}',
    voucherTitle: 'Kupon Yönetimi',
    voucherIntro: 'Kod oluştur, aktif/pasif yap ve kullanım limitini yönet.',
    refreshVouchers: 'Kuponları yenile',
    voucherCodeLabel: 'Kod',
    voucherAmountLabel: 'İndirim tutarı (EUR)',
    voucherUsageLimitLabel: 'Kullanım limiti',
    voucherActiveLabel: 'Aktif',
    voucherSaveButton: 'Kupon kaydet',
    voucherSaveChangesButton: 'Kupon güncelle',
    resetVoucherForm: 'Kupon formunu sıfırla',
    voucherTableCode: 'Kod',
    voucherTableDiscount: 'İndirim',
    voucherTableActive: 'Aktif',
    voucherTableUsage: 'Kullanım',
    voucherTableActions: 'İşlemler',
    openingHoursTitle: 'Açılış saatleri',
    openingHoursIntro: 'Pazartesi’den Pazar’a kadar açılış saatlerini ayarlayın.',
    refreshOpeningHours: 'Açılış saatlerini yenile',
    saveOpeningHours: 'Açılış saatlerini kaydet',
    openingHoursClosed: 'Kapalı',
    openingHoursFrom: 'Başlangıç',
    openingHoursTo: 'Bitiş',
    orderTrackingTitle: 'Sipariş Takibi',
    orderTrackingIntro: 'Siparişleri ve olay zaman çizelgesini görüntüleyin.',
    refreshOrders: 'Siparişleri yenile',
    orderSearchLabel: 'Sipariş ara',
    orderSearchPlaceholder: 'Müşteri, telefon, durum veya ödeme yöntemi ile ara...',
    orderTableId: 'Sipariş',
    orderTableDate: 'Tarih',
    orderTableCustomer: 'Müşteri',
    orderTablePayment: 'Ödeme',
    orderTableStatus: 'Durum',
    orderTableTotal: 'Toplam',
    orderTableActions: 'İşlemler',
    orderActionViewTimeline: 'Zaman çizelgesi',
    orderEventsTitle: 'Sipariş Zaman Çizelgesi',
    orderEventsHint: 'Olayları görmek için bir sipariş seçin.',
    orderEventsFor: '{orderId} için zaman çizelgesi',
    orderItemsTitle: 'Sipariş Ürünleri',
    orderItemsHint: 'Ürünleri görmek için bir sipariş seçin.',
    orderItemsFor: '{orderId} için ürünler',
    itemTableName: 'Ürün',
    itemTableQty: 'Adet',
    itemTableUnitPrice: 'Birim fiyat',
    itemTableLineTotal: 'Ara toplam',
    eventTableTime: 'Saat',
    eventTableType: 'Tür',
    eventTableSource: 'Kaynak',
    eventTablePayload: 'Detaylar',
    dayMonday: 'Pazartesi',
    dayTuesday: 'Salı',
    dayWednesday: 'Çarşamba',
    dayThursday: 'Perşembe',
    dayFriday: 'Cuma',
    daySaturday: 'Cumartesi',
    daySunday: 'Pazar',
    statusNoMenuItems: 'Menü öğesi yok.',
    statusNoMenuItemsFiltered: 'Aramayla eşleşen kayıt bulunamadı.',
    statusNoVouchers: 'Kupon yok.',
    statusNoOrders: 'Sipariş yok.',
    statusNoOrdersFiltered: 'Aramayla eşleşen sipariş bulunamadı.',
    statusNoOrderEvents: 'Bu sipariş için henüz olay yok.',
    statusNoOrderItems: 'Bu sipariş için henüz ürün bulunamadı.',
    statusOrdersLoading: 'Siparişler yükleniyor...',
    statusOrdersLoaded: '{count} sipariş yüklendi.',
    statusOrderEventsLoading: 'Sipariş zaman çizelgesi yükleniyor...',
    statusOrderEventsLoaded: '{count} olay yüklendi.',
    statusOrderItemsLoading: 'Sipariş ürünleri yükleniyor...',
    statusOrderItemsLoaded: '{count} ürün satırı yüklendi.',
    statusOrderEventsTableMissing: 'order_events tablosu eksik. Önce en güncel Supabase migration çalıştırılmalı.',
    statusOrderItemsTableMissing: 'order_items tablosu eksik. Önce en güncel Supabase migration çalıştırılmalı.',
    statusAvailable: 'Mevcut',
    statusSoldOut: 'Tükendi',
    statusActive: 'Aktif',
    statusInactive: 'Pasif',
    actionEdit: 'Düzenle',
    actionDelete: 'Sil',
    actionSetSoldOut: 'Tükendi yap',
    actionActivate: 'Aktifleştir',
    actionDeactivate: 'Pasifleştir',
    errorNameDeRequired: 'Almanca ad zorunludur.',
    errorUploadFailed: 'Yükleme başarısız: {message}',
    statusMenuLoading: 'Menü yükleniyor...',
    statusLoadError: 'Yükleme hatası: {message}',
    statusItemsLoaded: '{count} kayıt yüklendi.',
    statusVoucherLoading: 'Kuponlar yükleniyor...',
    statusVouchersLoaded: '{count} kupon yüklendi.',
    statusItemSaving: 'Menü öğesi kaydediliyor...',
    statusItemUpdated: 'Öğe güncellendi.',
    statusItemAdded: 'Öğe eklendi.',
    statusUnknownSaveError: 'Kaydetme sırasında bilinmeyen hata.',
    statusToggleError: 'Durum değiştirilemedi: {message}',
    statusUpdated: 'Durum güncellendi.',
    confirmDeleteItem: '{name} silinsin mi?',
    statusDeleteFailed: 'Silme başarısız: {message}',
    statusDeleted: 'Öğe silindi.',
    errorVoucherCodeRequired: 'Kupon kodu zorunludur.',
    errorVoucherDiscountPositive: 'İndirim 0’dan büyük olmalı.',
    statusVoucherSaving: 'Kupon kaydediliyor...',
    statusVoucherUpdated: 'Kupon güncellendi.',
    statusVoucherCreated: 'Kupon oluşturuldu.',
    statusVoucherUnknownSaveError: 'Kaydetme sırasında bilinmeyen hata.',
    statusVoucherToggleError: 'Durum değiştirilemedi: {message}',
    statusVoucherStatusUpdated: 'Kupon durumu güncellendi.',
    confirmDeleteVoucher: '{code} kuponu silinsin mi?',
    statusVoucherDeleteFailed: 'Silme başarısız: {message}',
    statusVoucherDeleted: 'Kupon silindi.',
    statusOpeningHoursLoading: 'Açılış saatleri yükleniyor...',
    statusOpeningHoursLoaded: 'Açılış saatleri yüklendi.',
    statusOpeningHoursSaving: 'Açılış saatleri kaydediliyor...',
    statusOpeningHoursSaved: 'Açılış saatleri kaydedildi.',
    errorOpeningHoursTimeRequired: 'Her açık gün için başlangıç ve bitiş saatini girin.',
    errorOpeningHoursRange: 'Bitiş saati başlangıçtan sonra olmalıdır.',
    statusEditLoaded: 'Kayıt düzenleme için yüklendi.',
    statusVoucherEditLoaded: 'Kupon düzenleme için yüklendi.',
    statusSupabaseMissing: 'Supabase yapılandırılmadı. .env güncelle ve npm run config:build çalıştır.',
    statusSessionLoadFailed: 'Oturum yüklenemedi: {message}',
    statusLoginRunning: 'Giriş yapılıyor...',
    statusLoginFailed: 'Giriş başarısız: {message}',
    statusLoginSuccess: 'Giriş başarılı.',
    statusLogoutFailed: 'Çıkış başarısız: {message}',
    statusFormReset: 'Form sıfırlandı.',
    statusVoucherFormReset: 'Kupon formu sıfırlandı.'
  }
};

const LANGUAGE_NAMES = {
  de: 'Deutsch',
  en: 'English',
  ru: 'Russian',
  ja: 'Japanese',
  tr: 'Turkish'
};

const LANGUAGE_LOCALES = {
  de: 'de-DE',
  en: 'en-GB',
  ru: 'ru-RU',
  ja: 'ja-JP',
  tr: 'tr-TR'
};

const LANGUAGE_STORAGE_KEY = 'bagoAdminLanguage';
const ITEMS_PER_PAGE = 12;
const VOUCHERS_PER_PAGE = 10;
const ORDERS_PER_PAGE = 10;

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
const openingHoursForm = document.querySelector('#openingHoursForm');
const openingHoursRows = document.querySelector('#openingHoursRows');
const refreshOpeningHoursButton = document.querySelector('#refreshOpeningHours');
const refreshOrdersButton = document.querySelector('#refreshOrders');
const loginStatus = document.querySelector('#loginStatus');
const adminStatus = document.querySelector('#adminStatus');
const voucherStatus = document.querySelector('#voucherStatus');
const openingHoursStatus = document.querySelector('#openingHoursStatus');
const orderTrackingStatus = document.querySelector('#orderTrackingStatus');
const orderEventsStatus = document.querySelector('#orderEventsStatus');
const orderItemsStatus = document.querySelector('#orderItemsStatus');
const itemsTableBody = document.querySelector('#itemsTableBody');
const itemSearchInput = document.querySelector('#itemSearchInput');
const orderSearchInput = document.querySelector('#orderSearchInput');
const vouchersTableBody = document.querySelector('#vouchersTableBody');
const ordersTableBody = document.querySelector('#ordersTableBody');
const orderEventsTableBody = document.querySelector('#orderEventsTableBody');
const orderItemsTableBody = document.querySelector('#orderItemsTableBody');
const orderEventsMeta = document.querySelector('#orderEventsMeta');
const orderItemsMeta = document.querySelector('#orderItemsMeta');
const itemsPagination = document.querySelector('#itemsPagination');
const itemsPrevPageButton = document.querySelector('#itemsPrevPage');
const itemsNextPageButton = document.querySelector('#itemsNextPage');
const itemsPageInfo = document.querySelector('#itemsPageInfo');
const vouchersPagination = document.querySelector('#vouchersPagination');
const vouchersPrevPageButton = document.querySelector('#vouchersPrevPage');
const vouchersNextPageButton = document.querySelector('#vouchersNextPage');
const vouchersPageInfo = document.querySelector('#vouchersPageInfo');
const ordersPagination = document.querySelector('#ordersPagination');
const ordersPrevPageButton = document.querySelector('#ordersPrevPage');
const ordersNextPageButton = document.querySelector('#ordersNextPage');
const ordersPageInfo = document.querySelector('#ordersPageInfo');
const languageToggle = document.querySelector('#languageToggle');
const languageMenu = document.querySelector('#languageMenu');
const languageLabel = document.querySelector('#languageLabel');
const WEEK_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_LABEL_KEYS = {
  0: 'daySunday',
  1: 'dayMonday',
  2: 'dayTuesday',
  3: 'dayWednesday',
  4: 'dayThursday',
  5: 'dayFriday',
  6: 'daySaturday'
};

const state = {
  items: [],
  vouchers: [],
  orders: [],
  orderEvents: [],
  orderItems: [],
  openingHours: [],
  busy: false,
  voucherBusy: false,
  openingHoursBusy: false,
  session: null,
  itemSearch: '',
  orderSearch: '',
  itemsPage: 1,
  vouchersPage: 1,
  ordersPage: 1,
  selectedOrderId: '',
  language: getInitialLanguage()
};

let moneyFormatter = buildMoneyFormatter(state.language);

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

function getInitialLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return TRANSLATIONS[saved] ? saved : 'de';
}

function buildMoneyFormatter(language) {
  const locale = LANGUAGE_LOCALES[language] || 'de-DE';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
}

function t(key) {
  return TRANSLATIONS[state.language]?.[key] || TRANSLATIONS.de[key] || key;
}

function formatT(key, values = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, token) => (values[token] == null ? '' : String(values[token])));
}

function formatEuro(value) {
  const amount = Number.parseFloat(value);
  const safe = Number.isFinite(amount) ? amount : 0;
  return moneyFormatter.format(safe);
}

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '-';
  const locale = LANGUAGE_LOCALES[state.language] || 'de-DE';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatOrderId(orderId) {
  const raw = normalize(orderId);
  if (!raw) return '-';
  return `#${raw.slice(0, 8)}`;
}

function getOrderStatusClass(status) {
  const normalized = normalize(status).toLowerCase();
  if (['paid', 'completed', 'pending_confirmation', 'payment_pending'].includes(normalized)) {
    return 'is-live';
  }
  if (['cancelled', 'payment_failed', 'failed'].includes(normalized)) {
    return 'is-sold';
  }
  return 'is-neutral';
}

function formatOrderStatus(status) {
  const normalized = normalize(status).toLowerCase();
  if (!normalized) return '-';
  return normalized.replace(/_/g, ' ');
}

function formatOrderPayment(payment) {
  const normalized = normalize(payment).toLowerCase();
  if (normalized === 'paypal') return 'PayPal';
  if (normalized === 'cash') return 'Cash';
  return normalized || '-';
}

function stringifyPayload(payload) {
  if (typeof payload === 'string') {
    return payload.length > 280 ? `${payload.slice(0, 277)}...` : payload;
  }
  if (!payload || typeof payload !== 'object') return '-';
  try {
    const serialized = JSON.stringify(payload);
    return serialized.length > 280 ? `${serialized.slice(0, 277)}...` : serialized;
  } catch {
    return '-';
  }
}

function getTotalPages(totalCount, pageSize) {
  return Math.max(1, Math.ceil(Math.max(0, totalCount) / pageSize));
}

function clampPage(page, totalPages) {
  return Math.min(Math.max(1, page), Math.max(1, totalPages));
}

function paginateEntries(entries, currentPage, pageSize) {
  const total = entries.length;
  const totalPages = getTotalPages(total, pageSize);
  const page = clampPage(currentPage, totalPages);
  const startIndex = (page - 1) * pageSize;
  const pageEntries = entries.slice(startIndex, startIndex + pageSize);
  const from = total ? startIndex + 1 : 0;
  const to = total ? Math.min(startIndex + pageSize, total) : 0;

  return {
    entries: pageEntries,
    page,
    total,
    totalPages,
    from,
    to
  };
}

function renderTablePagination(elements, pagination) {
  const { container, prevButton, nextButton, infoNode } = elements;
  if (!container || !prevButton || !nextButton || !infoNode) return;

  if (!pagination.total) {
    container.hidden = true;
    infoNode.textContent = '';
    return;
  }

  container.hidden = false;
  prevButton.disabled = pagination.page <= 1;
  nextButton.disabled = pagination.page >= pagination.totalPages;
  infoNode.textContent = `${formatT('paginationInfo', {
    page: pagination.page,
    totalPages: pagination.totalPages
  })} · ${formatT('paginationSummary', {
    from: pagination.from,
    to: pagination.to,
    total: pagination.total
  })}`;
}

function setStatus(target, message, isError = false) {
  target.textContent = message;
  target.style.color = isError ? '#ffb8b1' : '';
}

function setFormMode(editing) {
  const saveButton = document.querySelector('#saveItem');
  if (saveButton) {
    saveButton.textContent = editing ? t('itemSaveChangesButton') : t('itemSaveButton');
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
    saveButton.textContent = editing ? t('voucherSaveChangesButton') : t('voucherSaveButton');
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

function normalizeTimeValue(value) {
  const raw = normalize(value);
  const match = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '';
  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  if (!Number.isFinite(hour) || !Number.isFinite(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return '';
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function buildDefaultOpeningHours() {
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

function normalizeOpeningHoursRows(rows) {
  const defaults = buildDefaultOpeningHours();
  const byDay = new Map(defaults.map((entry) => [entry.day_of_week, { ...entry }]));

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const day = Number.parseInt(row?.day_of_week, 10);
    if (!Number.isFinite(day) || day < 0 || day > 6) return;
    const opensAt = normalizeTimeValue(row?.opens_at);
    const closesAt = normalizeTimeValue(row?.closes_at);
    const isClosed = row?.is_closed === true || !opensAt || !closesAt || closesAt <= opensAt;
    byDay.set(day, {
      id: row?.id || null,
      day_of_week: day,
      is_closed: isClosed,
      opens_at: isClosed ? '' : opensAt,
      closes_at: isClosed ? '' : closesAt
    });
  });

  return [...byDay.values()].sort((a, b) => a.day_of_week - b.day_of_week);
}

function getOpeningHoursEntry(dayOfWeek) {
  return state.openingHours.find((entry) => Number.parseInt(entry.day_of_week, 10) === dayOfWeek) || null;
}

function renderOpeningHours() {
  if (!openingHoursRows) return;
  const defaults = normalizeOpeningHoursRows([]);

  openingHoursRows.innerHTML = WEEK_DAY_ORDER.map((dayOfWeek) => {
    const entry = getOpeningHoursEntry(dayOfWeek) || defaults.find((row) => row.day_of_week === dayOfWeek);
    const isClosed = entry?.is_closed === true;
    const fromLabel = escapeHtml(t('openingHoursFrom'));
    const toLabel = escapeHtml(t('openingHoursTo'));
    const closedLabel = escapeHtml(t('openingHoursClosed'));
    const dayLabel = escapeHtml(t(DAY_LABEL_KEYS[dayOfWeek] || 'dayMonday'));

    return `
      <article class="opening-hour-row" data-day="${dayOfWeek}">
        <h3 class="opening-hour-day">${dayLabel}</h3>
        <label class="toggle-field opening-hour-toggle">
          <input type="checkbox" data-hours-closed="${dayOfWeek}" ${isClosed ? 'checked' : ''} />
          <span>${closedLabel}</span>
        </label>
        <label class="opening-hour-time ${isClosed ? 'is-disabled' : ''}">
          <span>${fromLabel}</span>
          <input type="time" data-hours-open="${dayOfWeek}" value="${escapeHtml(entry?.opens_at || '')}" ${
      isClosed ? 'disabled' : ''
    } />
        </label>
        <label class="opening-hour-time ${isClosed ? 'is-disabled' : ''}">
          <span>${toLabel}</span>
          <input type="time" data-hours-close="${dayOfWeek}" value="${escapeHtml(entry?.closes_at || '')}" ${
      isClosed ? 'disabled' : ''
    } />
        </label>
      </article>
    `;
  }).join('');
}

function collectOpeningHoursPayload() {
  const payload = [];
  const nowIso = new Date().toISOString();

  WEEK_DAY_ORDER.forEach((dayOfWeek) => {
    const closedInput = openingHoursRows.querySelector(`[data-hours-closed="${dayOfWeek}"]`);
    const openInput = openingHoursRows.querySelector(`[data-hours-open="${dayOfWeek}"]`);
    const closeInput = openingHoursRows.querySelector(`[data-hours-close="${dayOfWeek}"]`);
    const isClosed = Boolean(closedInput?.checked);
    const opensAt = normalizeTimeValue(openInput?.value || '');
    const closesAt = normalizeTimeValue(closeInput?.value || '');

    if (!isClosed && (!opensAt || !closesAt)) {
      throw new Error(t('errorOpeningHoursTimeRequired'));
    }
    if (!isClosed && closesAt <= opensAt) {
      throw new Error(t('errorOpeningHoursRange'));
    }

    payload.push({
      day_of_week: dayOfWeek,
      is_closed: isClosed,
      opens_at: isClosed ? null : opensAt,
      closes_at: isClosed ? null : closesAt,
      updated_at: nowIso
    });
  });

  return payload;
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

function buildSearchBlob(item) {
  return [
    item.category,
    item.name,
    item.name_de,
    item.name_en,
    item.name_ru,
    item.name_ja,
    item.name_tr,
    item.description,
    item.description_de,
    item.description_en,
    item.description_ru,
    item.description_ja,
    item.description_tr
  ]
    .map((value) => normalize(value).toLowerCase())
    .filter(Boolean)
    .join(' ');
}

function getFilteredItems() {
  const query = normalize(state.itemSearch).toLowerCase();
  if (!query) return state.items;
  return state.items.filter((item) => buildSearchBlob(item).includes(query));
}

function buildPayload(imageUrl) {
  const category = normalize(itemForm.elements.category.value);
  const price = Number.parseFloat(itemForm.elements.price.value);
  const names = getTranslations('name');
  const descriptions = getTranslations('description');

  if (!names.de) {
    throw new Error(t('errorNameDeRequired'));
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
  if (!itemsTableBody) return;
  const filteredItems = getFilteredItems();
  const pagination = paginateEntries(filteredItems, state.itemsPage, ITEMS_PER_PAGE);
  state.itemsPage = pagination.page;

  if (!pagination.total) {
    itemsTableBody.innerHTML = `<tr class="table-empty"><td data-label="" colspan="5">${escapeHtml(
      state.items.length ? t('statusNoMenuItemsFiltered') : t('statusNoMenuItems')
    )}</td></tr>`;
    renderTablePagination(
      {
        container: itemsPagination,
        prevButton: itemsPrevPageButton,
        nextButton: itemsNextPageButton,
        infoNode: itemsPageInfo
      },
      pagination
    );
    return;
  }

  const categoryLabel = escapeHtml(t('tableCategory'));
  const nameLabel = escapeHtml(t('tableNameDe'));
  const priceLabel = escapeHtml(t('tablePrice'));
  const statusLabel = escapeHtml(t('tableStatus'));
  const actionsLabel = escapeHtml(t('tableActions'));

  itemsTableBody.innerHTML = pagination.entries
    .map((item) => {
      const name = item.name_de || item.name || '-';
      const statusLive = item.available !== false;

      return `
        <tr>
          <td data-label="${categoryLabel}">${escapeHtml(item.category || '-')}</td>
          <td data-label="${nameLabel}">${escapeHtml(name)}</td>
          <td data-label="${priceLabel}">${escapeHtml(formatEuro(item.price))}</td>
          <td data-label="${statusLabel}">
            <span class="status-pill ${statusLive ? 'is-live' : 'is-sold'}">
              ${statusLive ? t('statusAvailable') : t('statusSoldOut')}
            </span>
          </td>
          <td data-label="${actionsLabel}">
            <div class="row-actions">
              <button type="button" data-edit="${escapeHtml(item.id)}">${escapeHtml(t('actionEdit'))}</button>
              <button type="button" data-toggle="${escapeHtml(item.id)}">${escapeHtml(
                statusLive ? t('actionSetSoldOut') : t('actionActivate')
              )}</button>
              <button type="button" data-delete="${escapeHtml(item.id)}">${escapeHtml(t('actionDelete'))}</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  renderTablePagination(
    {
      container: itemsPagination,
      prevButton: itemsPrevPageButton,
      nextButton: itemsNextPageButton,
      infoNode: itemsPageInfo
    },
    pagination
  );
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
  const pagination = paginateEntries(state.vouchers, state.vouchersPage, VOUCHERS_PER_PAGE);
  state.vouchersPage = pagination.page;

  if (!pagination.total) {
    vouchersTableBody.innerHTML = `<tr class="table-empty"><td data-label="" colspan="5">${escapeHtml(
      t('statusNoVouchers')
    )}</td></tr>`;
    renderTablePagination(
      {
        container: vouchersPagination,
        prevButton: vouchersPrevPageButton,
        nextButton: vouchersNextPageButton,
        infoNode: vouchersPageInfo
      },
      pagination
    );
    return;
  }

  const codeLabel = escapeHtml(t('voucherTableCode'));
  const discountLabel = escapeHtml(t('voucherTableDiscount'));
  const activeLabel = escapeHtml(t('voucherTableActive'));
  const usageLabel = escapeHtml(t('voucherTableUsage'));
  const actionsLabel = escapeHtml(t('voucherTableActions'));

  vouchersTableBody.innerHTML = pagination.entries
    .map((voucher) => {
      const isActive = voucher.active !== false;
      const usageLimit = Math.max(1, Number.parseInt(voucher.usage_limit, 10) || 1);
      const timesUsed = Math.max(0, Number.parseInt(voucher.times_used, 10) || 0);
      return `
        <tr>
          <td data-label="${codeLabel}">${escapeHtml(voucher.code || '-')}</td>
          <td data-label="${discountLabel}">${escapeHtml(formatEuro(voucher.discount_amount))}</td>
          <td data-label="${activeLabel}">
            <span class="status-pill ${isActive ? 'is-live' : 'is-sold'}">
              ${isActive ? t('statusActive') : t('statusInactive')}
            </span>
          </td>
          <td data-label="${usageLabel}">${timesUsed}/${usageLimit}</td>
          <td data-label="${actionsLabel}">
            <div class="row-actions">
              <button type="button" data-voucher-edit="${escapeHtml(voucher.id)}">${escapeHtml(t('actionEdit'))}</button>
              <button type="button" data-voucher-toggle="${escapeHtml(voucher.id)}">${escapeHtml(
                isActive ? t('actionDeactivate') : t('actionActivate')
              )}</button>
              <button type="button" data-voucher-delete="${escapeHtml(voucher.id)}">${escapeHtml(t('actionDelete'))}</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  renderTablePagination(
    {
      container: vouchersPagination,
      prevButton: vouchersPrevPageButton,
      nextButton: vouchersNextPageButton,
      infoNode: vouchersPageInfo
    },
    pagination
  );
}

function buildOrderSearchBlob(order) {
  return [
    order.id,
    order.customer_name,
    order.customer_phone,
    order.customer_email,
    order.payment_method,
    order.order_status,
    order.payment_reference,
    order.order_total
  ]
    .map((value) => normalize(value).toLowerCase())
    .filter(Boolean)
    .join(' ');
}

function getFilteredOrders() {
  const query = normalize(state.orderSearch).toLowerCase();
  if (!query) return state.orders;
  return state.orders.filter((order) => buildOrderSearchBlob(order).includes(query));
}

function renderOrders() {
  if (!ordersTableBody) return;

  const filteredOrders = getFilteredOrders();
  const pagination = paginateEntries(filteredOrders, state.ordersPage, ORDERS_PER_PAGE);
  state.ordersPage = pagination.page;

  if (!pagination.total) {
    ordersTableBody.innerHTML = `<tr class="table-empty"><td data-label="" colspan="7">${escapeHtml(
      state.orders.length ? t('statusNoOrdersFiltered') : t('statusNoOrders')
    )}</td></tr>`;
    renderTablePagination(
      {
        container: ordersPagination,
        prevButton: ordersPrevPageButton,
        nextButton: ordersNextPageButton,
        infoNode: ordersPageInfo
      },
      pagination
    );
    return;
  }

  const idLabel = escapeHtml(t('orderTableId'));
  const dateLabel = escapeHtml(t('orderTableDate'));
  const customerLabel = escapeHtml(t('orderTableCustomer'));
  const paymentLabel = escapeHtml(t('orderTablePayment'));
  const statusLabel = escapeHtml(t('orderTableStatus'));
  const totalLabel = escapeHtml(t('orderTableTotal'));
  const actionsLabel = escapeHtml(t('orderTableActions'));

  ordersTableBody.innerHTML = pagination.entries
    .map((order) => {
      const isSelected = String(order.id) === String(state.selectedOrderId);
      const customerText = [normalize(order.customer_name), normalize(order.customer_phone)].filter(Boolean).join(' · ') || '-';
      const statusClass = getOrderStatusClass(order.order_status);
      return `
        <tr class="${isSelected ? 'is-selected' : ''}">
          <td data-label="${idLabel}">${escapeHtml(formatOrderId(order.id))}</td>
          <td data-label="${dateLabel}">${escapeHtml(formatDateTime(order.ordered_at))}</td>
          <td data-label="${customerLabel}">${escapeHtml(customerText)}</td>
          <td data-label="${paymentLabel}">${escapeHtml(formatOrderPayment(order.payment_method))}</td>
          <td data-label="${statusLabel}">
            <span class="status-pill ${statusClass}">
              ${escapeHtml(formatOrderStatus(order.order_status))}
            </span>
          </td>
          <td data-label="${totalLabel}">${escapeHtml(formatEuro(order.order_total))}</td>
          <td data-label="${actionsLabel}">
            <div class="row-actions">
              <button type="button" data-order-view="${escapeHtml(order.id)}">${escapeHtml(t('orderActionViewTimeline'))}</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  renderTablePagination(
    {
      container: ordersPagination,
      prevButton: ordersPrevPageButton,
      nextButton: ordersNextPageButton,
      infoNode: ordersPageInfo
    },
    pagination
  );
}

function renderOrderEvents() {
  if (!orderEventsTableBody) return;

  const selectedId = normalize(state.selectedOrderId);
  if (orderEventsMeta) {
    orderEventsMeta.textContent = selectedId
      ? formatT('orderEventsFor', { orderId: formatOrderId(selectedId) })
      : t('orderEventsHint');
  }

  if (!selectedId) {
    orderEventsTableBody.innerHTML = `<tr class="table-empty"><td data-label="" colspan="4">${escapeHtml(
      t('orderEventsHint')
    )}</td></tr>`;
    return;
  }

  if (!state.orderEvents.length) {
    orderEventsTableBody.innerHTML = `<tr class="table-empty"><td data-label="" colspan="4">${escapeHtml(
      t('statusNoOrderEvents')
    )}</td></tr>`;
    return;
  }

  const timeLabel = escapeHtml(t('eventTableTime'));
  const typeLabel = escapeHtml(t('eventTableType'));
  const sourceLabel = escapeHtml(t('eventTableSource'));
  const payloadLabel = escapeHtml(t('eventTablePayload'));

  orderEventsTableBody.innerHTML = state.orderEvents
    .map((eventRow) => {
      const payload = stringifyPayload(eventRow.event_payload);
      return `
        <tr>
          <td data-label="${timeLabel}">${escapeHtml(formatDateTime(eventRow.created_at))}</td>
          <td data-label="${typeLabel}">${escapeHtml(formatOrderStatus(eventRow.event_type))}</td>
          <td data-label="${sourceLabel}">${escapeHtml(normalize(eventRow.source) || '-')}</td>
          <td data-label="${payloadLabel}">
            <pre class="event-payload" title="${escapeHtml(payload)}">${escapeHtml(payload)}</pre>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderOrderItems() {
  if (!orderItemsTableBody) return;

  const selectedId = normalize(state.selectedOrderId);
  if (orderItemsMeta) {
    orderItemsMeta.textContent = selectedId
      ? formatT('orderItemsFor', { orderId: formatOrderId(selectedId) })
      : t('orderItemsHint');
  }

  if (!selectedId) {
    orderItemsTableBody.innerHTML = `<tr class="table-empty"><td data-label="" colspan="4">${escapeHtml(
      t('orderItemsHint')
    )}</td></tr>`;
    return;
  }

  if (!state.orderItems.length) {
    orderItemsTableBody.innerHTML = `<tr class="table-empty"><td data-label="" colspan="4">${escapeHtml(
      t('statusNoOrderItems')
    )}</td></tr>`;
    return;
  }

  const nameLabel = escapeHtml(t('itemTableName'));
  const qtyLabel = escapeHtml(t('itemTableQty'));
  const unitPriceLabel = escapeHtml(t('itemTableUnitPrice'));
  const lineTotalLabel = escapeHtml(t('itemTableLineTotal'));

  orderItemsTableBody.innerHTML = state.orderItems
    .map((orderItem) => {
      const quantity = Math.max(1, Number.parseInt(orderItem.quantity, 10) || 1);
      const unitPrice = Number.parseFloat(orderItem.unit_price);
      const lineTotalRaw = Number.parseFloat(orderItem.line_total);
      const lineTotal = Number.isFinite(lineTotalRaw) ? lineTotalRaw : unitPrice * quantity;
      return `
        <tr>
          <td data-label="${nameLabel}">${escapeHtml(normalize(orderItem.item_name) || normalize(orderItem.item_id) || '-')}</td>
          <td data-label="${qtyLabel}">${escapeHtml(String(quantity))}</td>
          <td data-label="${unitPriceLabel}">${escapeHtml(formatEuro(unitPrice))}</td>
          <td data-label="${lineTotalLabel}">${escapeHtml(formatEuro(lineTotal))}</td>
        </tr>
      `;
    })
    .join('');
}

function closeLanguageMenu() {
  if (!languageMenu || !languageToggle) return;
  languageMenu.hidden = true;
  languageToggle.setAttribute('aria-expanded', 'false');
}

function toggleLanguageMenu() {
  if (!languageMenu || !languageToggle) return;
  const shouldOpen = languageMenu.hidden;
  languageMenu.hidden = !shouldOpen;
  languageToggle.setAttribute('aria-expanded', String(shouldOpen));
}

function applyStaticTranslations() {
  document.documentElement.lang = state.language;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    node.placeholder = t(key);
  });

  if (languageLabel) {
    languageLabel.textContent = LANGUAGE_NAMES[state.language] || 'Deutsch';
  }

  if (languageMenu) {
    languageMenu.querySelectorAll('[data-language]').forEach((button) => {
      const active = button.dataset.language === state.language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-checked', String(active));
    });
  }

  setFormMode(Boolean(normalize(itemForm?.elements.id.value)));
  setVoucherFormMode(Boolean(normalize(voucherForm?.elements.id.value)));
}

function applyLanguage() {
  moneyFormatter = buildMoneyFormatter(state.language);
  applyStaticTranslations();
  renderItems();
  renderVouchers();
  renderOrders();
  renderOrderEvents();
  renderOrderItems();
  renderOpeningHours();
}

function setLanguage(language) {
  if (!TRANSLATIONS[language]) return;
  state.language = language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  applyLanguage();
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
    throw new Error(formatT('errorUploadFailed', { message: error.message }));
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
  setStatus(adminStatus, t('statusMenuLoading'));

  const { data, error } = await fetchItems();
  if (error) {
    setStatus(adminStatus, formatT('statusLoadError', { message: error.message }), true);
    return;
  }

  state.items = Array.isArray(data) ? data : [];
  state.itemsPage = clampPage(state.itemsPage, getTotalPages(getFilteredItems().length, ITEMS_PER_PAGE));
  renderItems();
  setStatus(adminStatus, formatT('statusItemsLoaded', { count: state.items.length }));
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
  setStatus(voucherStatus, t('statusVoucherLoading'));

  const { data, error } = await fetchVouchers();
  if (error) {
    setStatus(voucherStatus, formatT('statusLoadError', { message: error.message }), true);
    return;
  }

  state.vouchers = Array.isArray(data) ? data : [];
  state.vouchersPage = clampPage(state.vouchersPage, getTotalPages(state.vouchers.length, VOUCHERS_PER_PAGE));
  renderVouchers();
  setStatus(voucherStatus, formatT('statusVouchersLoaded', { count: state.vouchers.length }));
}

async function fetchOrders() {
  return supabaseClient
    .from(ORDERS_TABLE)
    .select(
      'id, ordered_at, customer_name, customer_phone, customer_email, payment_method, order_status, order_total, payment_reference, is_scheduled, scheduled_for'
    )
    .order('ordered_at', { ascending: false });
}

async function fetchOrderEvents(orderId) {
  return supabaseClient
    .from(ORDER_EVENTS_TABLE)
    .select('id, order_id, event_type, source, event_payload, created_at')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });
}

async function fetchOrderItems(orderId) {
  return supabaseClient
    .from(ORDER_ITEMS_TABLE)
    .select('id, order_id, item_id, item_name, quantity, unit_price, line_total, created_at')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
}

async function refreshOrderEvents(orderId, options = {}) {
  if (!state.session || !orderEventsTableBody) return;

  const selectedOrderId = normalize(orderId);
  state.selectedOrderId = selectedOrderId;
  if (!selectedOrderId) {
    state.orderEvents = [];
    renderOrderEvents();
    setStatus(orderEventsStatus, '');
    return;
  }

  if (!options.silentStatus) {
    setStatus(orderEventsStatus, t('statusOrderEventsLoading'));
  }

  const { data, error } = await fetchOrderEvents(selectedOrderId);
  if (error) {
    const missingTable =
      /relation .*order_events.* does not exist|table .*order_events.* does not exist|could not find the table/i.test(
        error.message || ''
      );
    setStatus(
      orderEventsStatus,
      missingTable ? t('statusOrderEventsTableMissing') : formatT('statusLoadError', { message: error.message }),
      true
    );
    state.orderEvents = [];
    renderOrderEvents();
    return;
  }

  state.orderEvents = Array.isArray(data) ? data : [];
  renderOrderEvents();
  if (!options.silentStatus) {
    setStatus(orderEventsStatus, formatT('statusOrderEventsLoaded', { count: state.orderEvents.length }));
  }
}

async function refreshOrderItems(orderId, options = {}) {
  if (!state.session || !orderItemsTableBody) return;

  const selectedOrderId = normalize(orderId);
  state.selectedOrderId = selectedOrderId;
  if (!selectedOrderId) {
    state.orderItems = [];
    renderOrderItems();
    setStatus(orderItemsStatus, '');
    return;
  }

  if (!options.silentStatus) {
    setStatus(orderItemsStatus, t('statusOrderItemsLoading'));
  }

  const { data, error } = await fetchOrderItems(selectedOrderId);
  if (error) {
    const missingTable =
      /relation .*order_items.* does not exist|table .*order_items.* does not exist|could not find the table/i.test(
        error.message || ''
      );
    setStatus(
      orderItemsStatus,
      missingTable ? t('statusOrderItemsTableMissing') : formatT('statusLoadError', { message: error.message }),
      true
    );
    state.orderItems = [];
    renderOrderItems();
    return;
  }

  state.orderItems = Array.isArray(data) ? data : [];
  renderOrderItems();
  if (!options.silentStatus) {
    setStatus(orderItemsStatus, formatT('statusOrderItemsLoaded', { count: state.orderItems.length }));
  }
}

async function refreshOrders() {
  if (!state.session || !ordersTableBody) return;
  setStatus(orderTrackingStatus, t('statusOrdersLoading'));

  const { data, error } = await fetchOrders();
  if (error) {
    setStatus(orderTrackingStatus, formatT('statusLoadError', { message: error.message }), true);
    return;
  }

  state.orders = Array.isArray(data) ? data : [];
  state.ordersPage = clampPage(state.ordersPage, getTotalPages(getFilteredOrders().length, ORDERS_PER_PAGE));

  if (!state.selectedOrderId || !state.orders.some((entry) => String(entry.id) === String(state.selectedOrderId))) {
    state.selectedOrderId = state.orders[0]?.id || '';
  }

  renderOrders();
  renderOrderEvents();
  renderOrderItems();
  setStatus(orderTrackingStatus, formatT('statusOrdersLoaded', { count: state.orders.length }));

  if (state.selectedOrderId) {
    await Promise.all([
      refreshOrderEvents(state.selectedOrderId, { silentStatus: true }),
      refreshOrderItems(state.selectedOrderId, { silentStatus: true })
    ]);
  } else {
    state.orderEvents = [];
    state.orderItems = [];
    renderOrderEvents();
    renderOrderItems();
    setStatus(orderEventsStatus, '');
    setStatus(orderItemsStatus, '');
  }
}

async function refreshOpeningHours() {
  if (!state.session || !openingHoursRows) return;
  setStatus(openingHoursStatus, t('statusOpeningHoursLoading'));

  const { data, error } = await supabaseClient.from(OPENING_HOURS_TABLE).select('*').order('day_of_week', { ascending: true });
  if (error) {
    setStatus(openingHoursStatus, formatT('statusLoadError', { message: error.message }), true);
    return;
  }

  state.openingHours = normalizeOpeningHoursRows(data);
  renderOpeningHours();
  setStatus(openingHoursStatus, t('statusOpeningHoursLoaded'));
}

async function saveOpeningHours(event) {
  event.preventDefault();
  if (!state.session || state.openingHoursBusy || !openingHoursRows) return;

  state.openingHoursBusy = true;
  setStatus(openingHoursStatus, t('statusOpeningHoursSaving'));

  try {
    const payload = collectOpeningHoursPayload();
    const { error } = await supabaseClient.from(OPENING_HOURS_TABLE).upsert(payload, { onConflict: 'day_of_week' });
    if (error) {
      throw new Error(error.message);
    }

    setStatus(openingHoursStatus, t('statusOpeningHoursSaved'));
    await refreshOpeningHours();
  } catch (error) {
    setStatus(openingHoursStatus, error.message || t('statusUnknownSaveError'), true);
  } finally {
    state.openingHoursBusy = false;
  }
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
    refreshOrders();
    refreshOpeningHours();
  } else {
    state.items = [];
    state.vouchers = [];
    state.orders = [];
    state.orderEvents = [];
    state.orderItems = [];
    state.openingHours = normalizeOpeningHoursRows([]);
    state.itemSearch = '';
    state.orderSearch = '';
    state.itemsPage = 1;
    state.vouchersPage = 1;
    state.ordersPage = 1;
    state.selectedOrderId = '';
    if (itemSearchInput) {
      itemSearchInput.value = '';
    }
    if (orderSearchInput) {
      orderSearchInput.value = '';
    }
    renderItems();
    renderVouchers();
    renderOrders();
    renderOrderEvents();
    renderOrderItems();
    renderOpeningHours();
    clearVoucherForm();
    setStatus(openingHoursStatus, '');
    setStatus(orderTrackingStatus, '');
    setStatus(orderEventsStatus, '');
    setStatus(orderItemsStatus, '');
  }
}

async function saveItem(event) {
  event.preventDefault();
  if (!state.session || state.busy) return;

  state.busy = true;
  setStatus(adminStatus, t('statusItemSaving'));

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

    setStatus(adminStatus, currentId ? t('statusItemUpdated') : t('statusItemAdded'));
    clearItemForm();
    await refreshItems();
  } catch (error) {
    setStatus(adminStatus, error.message || t('statusUnknownSaveError'), true);
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
    setStatus(adminStatus, formatT('statusToggleError', { message: error.message }), true);
    return;
  }

  setStatus(adminStatus, t('statusUpdated'));
  await refreshItems();
}

async function deleteItem(id) {
  const item = state.items.find((entry) => String(entry.id) === String(id));
  const name = item?.name_de || item?.name || t('tableActions');
  const confirmed = window.confirm(formatT('confirmDeleteItem', { name }));
  if (!confirmed) return;

  const { error } = await supabaseClient.from(MENU_TABLE).delete().eq('id', id);
  if (error) {
    setStatus(adminStatus, formatT('statusDeleteFailed', { message: error.message }), true);
    return;
  }

  if (normalize(itemForm.elements.id.value) === String(id)) {
    clearItemForm();
  }

  setStatus(adminStatus, t('statusDeleted'));
  await refreshItems();
}

function buildVoucherPayload() {
  const code = normalize(voucherForm.elements.code.value).toUpperCase();
  const discountAmount = Number.parseFloat(voucherForm.elements.discount_amount.value);
  const usageLimitRaw = Number.parseInt(voucherForm.elements.usage_limit.value, 10);
  const usageLimit = Number.isFinite(usageLimitRaw) ? Math.max(1, usageLimitRaw) : 1;

  if (!code) {
    throw new Error(t('errorVoucherCodeRequired'));
  }
  if (!Number.isFinite(discountAmount) || discountAmount <= 0) {
    throw new Error(t('errorVoucherDiscountPositive'));
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
  setStatus(voucherStatus, t('statusVoucherSaving'));

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

    setStatus(voucherStatus, currentId ? t('statusVoucherUpdated') : t('statusVoucherCreated'));
    clearVoucherForm();
    await refreshVouchers();
  } catch (error) {
    setStatus(voucherStatus, error.message || t('statusVoucherUnknownSaveError'), true);
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
    setStatus(voucherStatus, formatT('statusVoucherToggleError', { message: error.message }), true);
    return;
  }

  setStatus(voucherStatus, t('statusVoucherStatusUpdated'));
  await refreshVouchers();
}

async function deleteVoucher(id) {
  const voucher = state.vouchers.find((entry) => String(entry.id) === String(id));
  const code = voucher?.code || '-';
  const confirmed = window.confirm(formatT('confirmDeleteVoucher', { code }));
  if (!confirmed) return;

  const { error } = await supabaseClient.from(VOUCHERS_TABLE).delete().eq('id', id);
  if (error) {
    setStatus(voucherStatus, formatT('statusVoucherDeleteFailed', { message: error.message }), true);
    return;
  }

  if (normalize(voucherForm?.elements.id.value) === String(id)) {
    clearVoucherForm();
  }

  setStatus(voucherStatus, t('statusVoucherDeleted'));
  await refreshVouchers();
}

function changeItemsPage(delta) {
  const totalPages = getTotalPages(getFilteredItems().length, ITEMS_PER_PAGE);
  const nextPage = clampPage(state.itemsPage + delta, totalPages);
  if (nextPage === state.itemsPage) return;
  state.itemsPage = nextPage;
  renderItems();
}

function changeVouchersPage(delta) {
  const totalPages = getTotalPages(state.vouchers.length, VOUCHERS_PER_PAGE);
  const nextPage = clampPage(state.vouchersPage + delta, totalPages);
  if (nextPage === state.vouchersPage) return;
  state.vouchersPage = nextPage;
  renderVouchers();
}

function changeOrdersPage(delta) {
  const totalPages = getTotalPages(getFilteredOrders().length, ORDERS_PER_PAGE);
  const nextPage = clampPage(state.ordersPage + delta, totalPages);
  if (nextPage === state.ordersPage) return;
  state.ordersPage = nextPage;
  renderOrders();
}

async function handleTableActions(event) {
  const editButton = event.target.closest('[data-edit]');
  const toggleButton = event.target.closest('[data-toggle]');
  const deleteButton = event.target.closest('[data-delete]');

  if (editButton) {
    const item = state.items.find((entry) => String(entry.id) === String(editButton.dataset.edit));
    if (item) {
      populateForm(item);
      setStatus(adminStatus, t('statusEditLoaded'));
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
      setStatus(voucherStatus, t('statusVoucherEditLoaded'));
    }
  }

  if (toggleButton) {
    await toggleVoucherActive(toggleButton.dataset.voucherToggle);
  }

  if (deleteButton) {
    await deleteVoucher(deleteButton.dataset.voucherDelete);
  }
}

async function handleOrdersTableActions(event) {
  const timelineButton = event.target.closest('[data-order-view]');
  if (!timelineButton) return;

  const orderId = normalize(timelineButton.dataset.orderView);
  if (!orderId) return;

  await Promise.all([refreshOrderEvents(orderId), refreshOrderItems(orderId)]);
  renderOrders();
}

async function initializeAuth() {
  if (!supabaseClient) {
    setStatus(loginStatus, t('statusSupabaseMissing'), true);
    loginForm.querySelectorAll('input,button').forEach((node) => {
      node.disabled = true;
    });
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    setStatus(loginStatus, formatT('statusSessionLoadFailed', { message: error.message }), true);
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
  setStatus(loginStatus, t('statusLoginRunning'));

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    setStatus(loginStatus, formatT('statusLoginFailed', { message: error.message }), true);
    return;
  }

  loginForm.reset();
  setStatus(loginStatus, t('statusLoginSuccess'));
});

logoutButton.addEventListener('click', async () => {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setStatus(adminStatus, formatT('statusLogoutFailed', { message: error.message }), true);
    return;
  }

  clearItemForm();
  clearVoucherForm();
  setStatus(adminStatus, '');
  setStatus(voucherStatus, '');
  setStatus(orderTrackingStatus, '');
  setStatus(orderEventsStatus, '');
  setStatus(orderItemsStatus, '');
});

refreshItemsButton.addEventListener('click', () => {
  refreshItems();
});

resetFormButton.addEventListener('click', () => {
  clearItemForm();
  setStatus(adminStatus, t('statusFormReset'));
});

if (refreshVouchersButton) {
  refreshVouchersButton.addEventListener('click', () => {
    refreshVouchers();
  });
}

if (resetVoucherFormButton) {
  resetVoucherFormButton.addEventListener('click', () => {
    clearVoucherForm();
    setStatus(voucherStatus, t('statusVoucherFormReset'));
  });
}

if (refreshOpeningHoursButton) {
  refreshOpeningHoursButton.addEventListener('click', () => {
    refreshOpeningHours();
  });
}

if (refreshOrdersButton) {
  refreshOrdersButton.addEventListener('click', () => {
    refreshOrders();
  });
}

if (openingHoursRows) {
  openingHoursRows.addEventListener('change', (event) => {
    const closedInput = event.target.closest('[data-hours-closed]');
    if (!closedInput) return;
    const day = closedInput.dataset.hoursClosed;
    const openInput = openingHoursRows.querySelector(`[data-hours-open="${day}"]`);
    const closeInput = openingHoursRows.querySelector(`[data-hours-close="${day}"]`);
    const isClosed = closedInput.checked;

    if (openInput) {
      openInput.disabled = isClosed;
      openInput.closest('.opening-hour-time')?.classList.toggle('is-disabled', isClosed);
    }
    if (closeInput) {
      closeInput.disabled = isClosed;
      closeInput.closest('.opening-hour-time')?.classList.toggle('is-disabled', isClosed);
    }
  });
}

itemForm.addEventListener('submit', saveItem);

if (itemSearchInput) {
  itemSearchInput.addEventListener('input', () => {
    state.itemSearch = itemSearchInput.value;
    state.itemsPage = 1;
    renderItems();
  });
}

if (orderSearchInput) {
  orderSearchInput.addEventListener('input', () => {
    state.orderSearch = orderSearchInput.value;
    state.ordersPage = 1;
    renderOrders();
  });
}

itemsTableBody.addEventListener('click', (event) => {
  handleTableActions(event);
});

if (itemsPrevPageButton && itemsNextPageButton) {
  itemsPrevPageButton.addEventListener('click', () => {
    changeItemsPage(-1);
  });
  itemsNextPageButton.addEventListener('click', () => {
    changeItemsPage(1);
  });
}

if (voucherForm) {
  voucherForm.addEventListener('submit', saveVoucher);
}

if (openingHoursForm) {
  openingHoursForm.addEventListener('submit', saveOpeningHours);
}

if (vouchersTableBody) {
  vouchersTableBody.addEventListener('click', (event) => {
    handleVoucherTableActions(event);
  });
}

if (ordersTableBody) {
  ordersTableBody.addEventListener('click', (event) => {
    handleOrdersTableActions(event);
  });
}

if (vouchersPrevPageButton && vouchersNextPageButton) {
  vouchersPrevPageButton.addEventListener('click', () => {
    changeVouchersPage(-1);
  });
  vouchersNextPageButton.addEventListener('click', () => {
    changeVouchersPage(1);
  });
}

if (ordersPrevPageButton && ordersNextPageButton) {
  ordersPrevPageButton.addEventListener('click', () => {
    changeOrdersPage(-1);
  });
  ordersNextPageButton.addEventListener('click', () => {
    changeOrdersPage(1);
  });
}

if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    toggleLanguageMenu();
  });
}

if (languageMenu) {
  languageMenu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-language]');
    if (!button) return;
    setLanguage(button.dataset.language);
    closeLanguageMenu();
  });
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('#languageSwitcher')) {
    closeLanguageMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLanguageMenu();
  }
});

clearItemForm();
clearVoucherForm();
state.openingHours = normalizeOpeningHoursRows([]);
applyLanguage();
initializeAuth();
