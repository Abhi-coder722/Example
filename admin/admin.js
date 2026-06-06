const config = window.BAGO_SUPABASE || {};
const SUPABASE_URL = config.url || '';
const SUPABASE_ANON_KEY = config.anonKey || '';
const MENU_TABLE = config.menuTable || 'menu_items';
const VOUCHERS_TABLE = config.vouchersTable || 'vouchers';
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
    statusNoMenuItems: 'Keine Menüeinträge vorhanden.',
    statusNoVouchers: 'Keine Voucher vorhanden.',
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
    langGerman: 'German',
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
    statusNoMenuItems: 'No menu items available.',
    statusNoVouchers: 'No vouchers available.',
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
    statusNoMenuItems: 'Позиции меню отсутствуют.',
    statusNoVouchers: 'Ваучеры отсутствуют.',
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
    statusNoMenuItems: 'メニュー項目がありません。',
    statusNoVouchers: 'クーポンがありません。',
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
    statusNoMenuItems: 'Menü öğesi yok.',
    statusNoVouchers: 'Kupon yok.',
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
  de: 'German',
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
const languageToggle = document.querySelector('#languageToggle');
const languageMenu = document.querySelector('#languageMenu');
const languageLabel = document.querySelector('#languageLabel');

const state = {
  items: [],
  vouchers: [],
  busy: false,
  voucherBusy: false,
  session: null,
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
  if (!state.items.length) {
    itemsTableBody.innerHTML = `<tr><td colspan="5">${escapeHtml(t('statusNoMenuItems'))}</td></tr>`;
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
              ${statusLive ? t('statusAvailable') : t('statusSoldOut')}
            </span>
          </td>
          <td>
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
    vouchersTableBody.innerHTML = `<tr><td colspan="5">${escapeHtml(t('statusNoVouchers'))}</td></tr>`;
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
              ${isActive ? t('statusActive') : t('statusInactive')}
            </span>
          </td>
          <td>${timesUsed}/${usageLimit}</td>
          <td>
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
    languageLabel.textContent = LANGUAGE_NAMES[state.language] || 'German';
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
  renderVouchers();
  setStatus(voucherStatus, formatT('statusVouchersLoaded', { count: state.vouchers.length }));
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
applyLanguage();
initializeAuth();
