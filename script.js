let orderedCategories = [];
let menuItems = [];
let itemById = new Map();
let popularIds = [];

const TRANSLATIONS = {
  de: {
    navPopular: 'Beliebt',
    navMenu: 'Menü',
    navDetails: 'Details',
    cartLabel: 'Warenkorb',
    floatingCartLabel: 'Warenkorb',
    floatingCartAria: 'Warenkorb öffnen',
    heroCopy: 'Frisch, schnell und mit Liebe zubereitet in der Sample Street 12 in Demo City.',
    promoFootballTitle: 'Deutschland-Fussballrabatt',
    promoFootballBody:
      'Zur Unterstützung der deutschen Fussballnationalmannschaft: Nutze DEUTSCHLAND5 oder DE5 und erhalte 5 EUR Sofortrabatt ab 45 EUR Bestellwert.',
    startOrder: 'Jetzt bestellen',
    viewCart: 'Warenkorb anzeigen',
    heroStatItems: 'Menüeinträge',
    heroStatMinimum: 'Mindestbestellwert',
    heroStatPreparationTime: 'Vorbereitungszeit',
    heroStatPreparationTimeValue: '25-35 Min',
    heroStatPickup: 'Bestellmodus',
    heroStatPickupValue: 'Nur Abholung',
    popularEyebrow: 'Schnelle Auswahl',
    popularTitle: 'Am häufigsten bestellt',
    menuEyebrow: 'Komplettes Menü',
    menuTitle: 'Rolls, Bowls, Burger, Pommes, Getränke',
    menuSynced: 'Menüeinträge',
    searchLabel: 'Menü durchsuchen',
    searchPlaceholder: 'Suche nach Lachs, Burrito, Pommes...',
    checkoutEyebrow: 'Checkout',
    cartTitle: 'Dein Warenkorb',
    emptyCart: 'Wähle eine Roll, Bowl, einen Burger oder eine Beilage, um zu starten.',
    pickupTitle: 'Abholung',
    pickupNote: 'Deine Bestellung wird zur Abholung in der Sample Street 12 vorbereitet.',
    contactTitle: 'Kontakt',
    nameLabel: 'Name',
    phoneLabel: 'Telefon',
    emailLabel: 'E-Mail (optional)',
    scheduleTitle: 'Bestellzeit',
    scheduleAsap: 'Sofort',
    scheduleLater: 'Später planen',
    scheduleDateLabel: 'Abholdatum',
    scheduleTimeLabel: 'Abholzeit',
    scheduleHelpOpen: 'Geöffnet: Du kannst jetzt bestellen oder einen späteren Zeitpunkt wählen.',
    scheduleHelpLater: 'Wähle ein Datum und eine Uhrzeit innerhalb der Öffnungszeiten.',
    scheduleHelpClosed: 'Der Laden ist aktuell geschlossen. Bitte eine Abholzeit planen.',
    paymentTitle: 'Zahlung im Shop',
    paymentPaypal: 'PayPal',
    paymentCash: 'Barzahlung',
    paymentShopIntro: 'Zahlung im Shop, verfügbare Optionen:',
    paymentShopOptions: 'Bar oder Karte',
    paymentCardChip: 'Karte',
    paymentCardTypesLabel: 'Kartentypen',
    paymentCardAtShop: 'Kartenzahlung ist auch im Shop möglich.',
    paymentHelp: 'Klicke auf Bestellung aufgeben, um WhatsApp zu öffnen.',
    voucherTitle: 'Gutschein',
    voucherPlaceholder: 'Code eingeben',
    applyVoucher: 'Einlösen',
    voucherDiscountLabel: 'Gutschein',
    voucherApplied: 'Gutschein {code} angewendet (-{amount}).',
    voucherInvalid: 'Dieser Gutscheincode ist ungültig.',
    voucherInactive: 'Dieser Gutschein ist deaktiviert.',
    voucherLimitReached: 'Dieser Gutschein wurde bereits vollständig eingelöst.',
    voucherMinimumNotReached: 'Dieser Gutschein gilt ab {minimum}. Bitte noch {gap} hinzufügen.',
    voucherApplyFailed: 'Gutschein konnte aktuell nicht geprüft werden.',
    subtotalLabel: 'Zwischensumme',
    serviceFeeLabel: 'Service',
    minimumGapLabel: 'Fehlbetrag bis Mindestwert',
    totalLabel: 'Gesamt',
    buttonPlaceOrder: 'Bestellung aufgeben',
    buttonPayNow: 'Jetzt zahlen',
    cancelOrder: 'Abbrechen und zur Startseite',
    soldOut: 'Ausverkauft',
    loadingMenu: 'Menü wird geladen...',
    menuUnavailable: 'Menü ist gerade nicht verfügbar.',
    detailsEyebrow: 'Restaurantdetails',
    detailsAddress: 'Adresse: Sample Street 12, 12345 Demo City. Aktuell nur Abholung.',
    openMaps: 'In Google Maps öffnen',
    pickupOnlyNote: 'Alle Bestellungen werden aktuell zur Abholung im Laden vorbereitet.',
    hoursTitle: 'Öffnungszeiten',
    hoursOpenNow: 'Aktuell geöffnet',
    hoursClosedNow: 'Aktuell geschlossen',
    hoursWeekdays: 'Mo-Fr',
    hoursSaturday: 'Samstag',
    hoursSunday: 'Sonntag',
    dayMonday: 'Montag',
    dayTuesday: 'Dienstag',
    dayWednesday: 'Mittwoch',
    dayThursday: 'Donnerstag',
    dayFriday: 'Freitag',
    daySaturday: 'Samstag',
    daySunday: 'Sonntag',
    closedLabel: 'Geschlossen',
    legalEyebrow: 'Rechtliches',
    legalTitle: 'Rechtliche Informationen',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Datenschutz',
    legalStreitbeilegung: 'Verbraucherstreitbeilegung',
    closeButton: 'Schließen',
    aboutEyebrow: 'Über uns',
    aboutTitle: 'Entdecke neue Geschmäcker bei Demo Sushi House',
    aboutBody1: 'Sushi, Burger, Burritos und mehr - probiere unsere frisch zubereiteten Lieblingsgerichte.',
    aboutBody2:
      'Wir sind ein Beispielrestaurant im Herzen von Demo City in der Sample Street 12. Geführt von einem Beispielteam mit mehr als fünf Jahren Praxiserfahrung in Sushi, Burgern, Burritos und weiteren Spezialitäten.',
    aboutBody3:
      'Jedes Gericht entsteht mit Leidenschaft, Sorgfalt und Fokus auf Qualität. Wir setzen auf frische Zutaten, ehrlichen Geschmack und eine Bestellung, die für unsere Gäste schnell, zuverlässig und unkompliziert ist.',
    aboutBody4:
      'Unser Ziel ist es, unsere Nachbarschaft mit kreativen Gerichten, fairen Preisen und echter Gastfreundschaft zu begeistern.',
    allergensEyebrow: 'Zusatzstoffe & Allergene',
    allergensTitle: 'Zusatzstoffe & Allergene',
    allergensAdditives:
      'Zusatzstoffe: 1=mit Farbstoff, 2=mit Konservierungsstoffen, 3=mit Antioxidationsmitteln, 4=mit Geschmacksverstärker, 5=geschwefelt, 6=geschwärzt, 7=mit Phosphat, 8=mit Süßungsmittel, 11=mit Nitritpökelsalz, 13=koffeinhaltig, 19=Laktose, 22=mit Zucker und Süßungsmitteln.',
    allergensAllergens:
      'Allergene: A=Gluten, A1=Weizen, A2=Roggen, A4=Hafer, B=Krebstiere, C=Eier, D=Fisch, F=Sojabohnen, G=Milch, L=Sellerie, M=Senf, N=Sesamsamen, O=Schwefeldioxid, R=Weichtiere.',
    allergensDisclaimer:
      'Alle Preise in EUR inkl. MwSt. und Bedienung. Für die Kennzeichnung der Speisen mit Zusatzstoffen und Allergenen übernehmen wir keine Haftung. Bei Fragen wenden Sie sich bitte an das Servicepersonal.',
    allLabel: 'Alle',
    itemSingle: 'Eintrag',
    itemPlural: 'Einträge',
    noMenuMatch: 'Keine passenden Menüeinträge gefunden.',
    itemDescriptionFallback: 'Frisch zubereitet bei Demo Sushi House.',
    addItemsToCheckout: 'Artikel hinzufügen',
    addMoreAmount: 'Noch {amount} hinzufügen',
    nameValidation: 'Bitte den vollständigen Namen eingeben.',
    phoneValidationEmpty: 'Bitte eine Telefonnummer eingeben.',
    phoneValidationInvalid: 'Bitte eine gültige Telefonnummer mit 8 bis 15 Ziffern eingeben.',
    emailValidationInvalid: 'Bitte eine gültige E-Mail-Adresse eingeben.',
    scheduleValidationRequired: 'Bitte Datum und Uhrzeit für die geplante Abholung auswählen.',
    scheduleValidationFuture: 'Die geplante Abholzeit muss in der Zukunft liegen.',
    scheduleValidationWithinHours: 'Bitte eine Zeit innerhalb der Öffnungszeiten wählen.',
    statusAddItemFirst: 'Bitte zuerst mindestens einen Artikel hinzufügen.',
    statusMinimumGap: 'Mindestbestellwert {minimum}. Bitte noch {gap} hinzufügen.',
    statusClosedScheduleRequired: 'Der Laden ist aktuell geschlossen. Bitte eine geplante Abholzeit wählen.',
    statusVoucherRequired: 'Bitte den Gutschein erst anwenden, bevor du fortfährst.',
    statusVoucherRecheckFailed: 'Gutschein konnte nicht eingelöst werden. Bitte erneut prüfen.',
    statusOrderSaveFailed: 'Bestellung konnte nicht gespeichert werden. Bitte erneut versuchen.',
    statusWhatsappOpening: 'WhatsApp wird mit deiner Bestellnachricht geöffnet...',
    statusWhatsappBlocked: 'WhatsApp konnte nicht automatisch geöffnet werden. Bitte erneut versuchen.',
    statusRedirectingPaypal: 'Weiterleitung zu PayPal Checkout...',
    statusPaypalCancelled: 'PayPal-Zahlung wurde abgebrochen.',
    statusPaypalOrderMissing: 'PayPal-Rückkehr erkannt, aber keine gespeicherten Bestelldaten gefunden.',
    statusPaypalReturnPending: 'PayPal-Rückkehr erkannt. Zahlungsstatus nicht bestätigt.',
    statusPaypalCheckoutFailed: 'PayPal Checkout konnte nicht geöffnet werden. Bitte erneut versuchen.',
    whatsappConfirmTitle: 'Hast du die Bestellung bereits aufgegeben?',
    whatsappConfirmBody: 'Wenn du die Bestellung in WhatsApp gesendet hast, können wir den Warenkorb jetzt leeren.',
    whatsappConfirmYes: 'Ja',
    whatsappConfirmNo: 'Nein',
    whatsappConfirmThanks: 'Deine Bestellung wird bearbeitet, danke :)',
    waHeader: 'Neue Bestellung',
    waBusiness: 'Restaurant',
    waCustomer: 'Name',
    waPhone: 'Telefon',
    waPayment: 'Zahlung',
    waFulfillment: 'Abholung',
    waFulfillmentNow: 'Sofort',
    waFulfillmentScheduled: 'Geplant für {datetime}',
    waItems: 'Artikel',
    themeSwitchToLight: 'Zu hellem Design wechseln',
    themeSwitchToDark: 'Zu dunklem Design wechseln'
  },
  en: {
    navPopular: 'Popular',
    navMenu: 'Menu',
    navDetails: 'Details',
    cartLabel: 'Cart',
    floatingCartLabel: 'Cart',
    floatingCartAria: 'Open cart',
    heroCopy: 'Fresh, fast, and prepared with care in Sample Street 12, Demo City.',
    promoFootballTitle: 'Germany football discount',
    promoFootballBody:
      'To support the German national football team, use DEUTSCHLAND5 or DE5 and get a flat EUR 5 discount on orders of EUR 45 or more.',
    startOrder: 'Start Order',
    viewCart: 'View Cart',
    heroStatItems: 'Menu Items',
    heroStatMinimum: 'Minimum Order',
    heroStatPreparationTime: 'Preparation Time',
    heroStatPreparationTimeValue: '25-35 min',
    heroStatPickup: 'Order mode',
    heroStatPickupValue: 'Pickup only',
    popularEyebrow: 'Quick picks',
    popularTitle: 'Most ordered',
    menuEyebrow: 'Full menu',
    menuTitle: 'Rolls, bowls, burgers, fries, drinks',
    menuSynced: 'Menu items',
    searchLabel: 'Search menu',
    searchPlaceholder: 'Try salmon, burrito, fries...',
    checkoutEyebrow: 'Checkout',
    cartTitle: 'Your cart',
    emptyCart: 'Pick a roll, bowl, burger, or side to start your order.',
    pickupTitle: 'Pickup',
    pickupNote: 'Your order is prepared for pickup at Sample Street 12.',
    contactTitle: 'Contact',
    nameLabel: 'Name',
    phoneLabel: 'Phone',
    emailLabel: 'Email (optional)',
    scheduleTitle: 'Order time',
    scheduleAsap: 'As soon as possible',
    scheduleLater: 'Schedule for later',
    scheduleDateLabel: 'Pickup date',
    scheduleTimeLabel: 'Pickup time',
    scheduleHelpOpen: 'Open now: order immediately or schedule for later.',
    scheduleHelpLater: 'Choose a pickup date and time within opening hours.',
    scheduleHelpClosed: 'The restaurant is currently closed. Please schedule your pickup.',
    paymentTitle: 'Payment at the shop',
    paymentPaypal: 'PayPal',
    paymentCash: 'Cash',
    paymentShopIntro: 'Payment at the shop, available options:',
    paymentShopOptions: 'Cash or Card',
    paymentCardChip: 'Card',
    paymentCardTypesLabel: 'Card Types',
    paymentCardAtShop: 'Card payment is also possible at the shop.',
    paymentHelp: 'Click Place Order to open WhatsApp.',
    voucherTitle: 'Voucher',
    voucherPlaceholder: 'Enter code',
    applyVoucher: 'Apply',
    voucherDiscountLabel: 'Voucher',
    voucherApplied: 'Voucher {code} applied (-{amount}).',
    voucherInvalid: 'This voucher code is invalid.',
    voucherInactive: 'This voucher is inactive.',
    voucherLimitReached: 'This voucher has reached its usage limit.',
    voucherMinimumNotReached: 'This voucher is valid from {minimum}. Please add {gap} more.',
    voucherApplyFailed: 'Voucher validation is currently unavailable.',
    subtotalLabel: 'Subtotal',
    serviceFeeLabel: 'Service',
    minimumGapLabel: 'Minimum gap',
    totalLabel: 'Total',
    buttonPlaceOrder: 'Place Order',
    buttonPayNow: 'Pay Now',
    cancelOrder: 'Cancel and return home',
    soldOut: 'Sold out',
    loadingMenu: 'Loading menu...',
    menuUnavailable: 'Menu is currently unavailable.',
    detailsEyebrow: 'Restaurant details',
    detailsAddress: 'Address: Sample Street 12, 12345 Demo City. Pickup only at the moment.',
    openMaps: 'Open in Google Maps',
    pickupOnlyNote: 'All orders are currently prepared for pickup at our shop.',
    hoursTitle: 'Opening hours',
    hoursOpenNow: 'Open now',
    hoursClosedNow: 'Closed now',
    hoursWeekdays: 'Mon-Fri',
    hoursSaturday: 'Saturday',
    hoursSunday: 'Sunday',
    dayMonday: 'Monday',
    dayTuesday: 'Tuesday',
    dayWednesday: 'Wednesday',
    dayThursday: 'Thursday',
    dayFriday: 'Friday',
    daySaturday: 'Saturday',
    daySunday: 'Sunday',
    closedLabel: 'Closed',
    legalEyebrow: 'Legal',
    legalTitle: 'Legal information',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Privacy',
    legalStreitbeilegung: 'Consumer dispute resolution',
    closeButton: 'Close',
    aboutEyebrow: 'About Us',
    aboutTitle: 'Discover new tastes at Demo Sushi House',
    aboutBody1: 'Sushi, burgers, burritos, and more. Come and enjoy our fresh favorites.',
    aboutBody2:
      'We are a demo restaurant in the heart of Demo City at Sample Street 12. Run by a sample team with more than five years of proven expertise in sushi, burgers, burritos, and other specialties.',
    aboutBody3:
      'Every dish is made with passion, care, and attention to quality. We focus on fresh ingredients, authentic taste, and a smooth customer experience.',
    aboutBody4: 'Our goal is to serve our neighborhood with creativity, fair prices, and genuine hospitality.',
    allergensEyebrow: 'Additives & Allergens',
    allergensTitle: 'Additives & Allergens',
    allergensAdditives:
      'Additives: 1=with colorant, 2=with preservatives, 3=with antioxidants, 4=with flavor enhancer, 5=sulphured, 6=blackened, 7=with phosphate, 8=with sweetener, 11=with nitrite curing salt, 13=contains caffeine, 19=lactose, 22=with sugar and sweeteners.',
    allergensAllergens:
      'Allergens: A=gluten, A1=wheat, A2=rye, A4=oats, B=crustaceans, C=eggs, D=fish, F=soybeans, G=milk, L=celery, M=mustard, N=sesame seeds, O=sulphur dioxide, R=molluscs.',
    allergensDisclaimer:
      'All prices are in EUR incl. VAT and service. We assume no liability for the labeling of dishes with additives and allergens. For questions, please contact our service staff.',
    allLabel: 'All',
    itemSingle: 'item',
    itemPlural: 'items',
    noMenuMatch: 'No menu items match that search.',
    itemDescriptionFallback: 'Freshly prepared by Demo Sushi House.',
    addItemsToCheckout: 'Add items to checkout',
    addMoreAmount: 'Add {amount} more',
    nameValidation: "Please enter the customer's full name.",
    phoneValidationEmpty: 'Please enter a phone number.',
    phoneValidationInvalid: 'Enter a valid phone number with 8 to 15 digits.',
    emailValidationInvalid: 'Enter a valid email address.',
    scheduleValidationRequired: 'Please select a pickup date and time.',
    scheduleValidationFuture: 'Scheduled pickup time must be in the future.',
    scheduleValidationWithinHours: 'Please choose a time within opening hours.',
    statusAddItemFirst: 'Add at least one item first.',
    statusMinimumGap: 'Minimum order is {minimum}. Add {gap} more.',
    statusClosedScheduleRequired: 'The restaurant is currently closed. Please select a scheduled pickup time.',
    statusVoucherRequired: 'Apply the voucher first before checkout.',
    statusVoucherRecheckFailed: 'Voucher could not be redeemed. Please re-apply.',
    statusOrderSaveFailed: 'Could not save your order. Please try again.',
    statusWhatsappOpening: 'Opening WhatsApp with your order details...',
    statusWhatsappBlocked: 'Could not open WhatsApp automatically. Please try again.',
    statusRedirectingPaypal: 'Redirecting to PayPal Checkout...',
    statusPaypalCancelled: 'PayPal payment was canceled.',
    statusPaypalOrderMissing: 'PayPal returned but no saved order data was found.',
    statusPaypalReturnPending: 'PayPal returned, but payment status was not confirmed.',
    statusPaypalCheckoutFailed: 'Could not open PayPal Checkout. Please try again.',
    whatsappConfirmTitle: 'Did you already place the order?',
    whatsappConfirmBody: 'If you sent the order in WhatsApp, we can clear the cart now.',
    whatsappConfirmYes: 'Yes',
    whatsappConfirmNo: 'No',
    whatsappConfirmThanks: 'Your order is being processed, thanks :)',
    waHeader: 'New order',
    waBusiness: 'Restaurant',
    waCustomer: 'Name',
    waPhone: 'Phone',
    waPayment: 'Payment',
    waFulfillment: 'Pickup',
    waFulfillmentNow: 'As soon as possible',
    waFulfillmentScheduled: 'Scheduled for {datetime}',
    waItems: 'Items',
    themeSwitchToLight: 'Switch to light theme',
    themeSwitchToDark: 'Switch to dark theme'
  },
  ru: {
    navPopular: 'Популярное',
    navMenu: 'Меню',
    navDetails: 'Детали',
    cartLabel: 'Корзина',
    floatingCartLabel: 'Корзина',
    floatingCartAria: 'Открыть корзину',
    heroCopy: 'Свежо, быстро и с заботой. Sample Street 12, Demo City.',
    promoFootballTitle: 'Футбольная скидка Германия',
    promoFootballBody:
      'Скидка в поддержку футбольной сборной Германии. Используйте DEUTSCHLAND5 или DE5 и получите 5 EUR скидки при заказе от 45 EUR.',
    startOrder: 'Начать заказ',
    viewCart: 'Открыть корзину',
    heroStatItems: 'Позиции меню',
    heroStatMinimum: 'Минимальный заказ',
    heroStatPreparationTime: 'Время приготовления',
    heroStatPreparationTimeValue: '25-35 мин',
    heroStatPickup: 'Формат заказа',
    heroStatPickupValue: 'Только самовывоз',
    popularEyebrow: 'Быстрый выбор',
    popularTitle: 'Чаще всего заказывают',
    menuEyebrow: 'Полное меню',
    menuTitle: 'Роллы, боулы, бургеры, фри, напитки',
    menuSynced: 'Позиции меню',
    searchLabel: 'Поиск по меню',
    searchPlaceholder: 'Например: лосось, буррито, фри...',
    checkoutEyebrow: 'Оформление',
    cartTitle: 'Ваша корзина',
    emptyCart: 'Выберите товар, чтобы начать заказ.',
    pickupTitle: 'Самовывоз',
    pickupNote: 'Ваш заказ будет подготовлен для самовывоза по адресу Sample Street 12.',
    contactTitle: 'Контакты',
    nameLabel: 'Имя',
    phoneLabel: 'Телефон',
    emailLabel: 'E-mail (необязательно)',
    scheduleTitle: 'Время заказа',
    scheduleAsap: 'Как можно скорее',
    scheduleLater: 'Запланировать позже',
    scheduleDateLabel: 'Дата самовывоза',
    scheduleTimeLabel: 'Время самовывоза',
    scheduleHelpOpen: 'Сейчас открыто: можно заказать сразу или запланировать время.',
    scheduleHelpLater: 'Выберите дату и время в рамках часов работы.',
    scheduleHelpClosed: 'Сейчас закрыто. Пожалуйста, запланируйте время самовывоза.',
    paymentTitle: 'Оплата в магазине',
    paymentPaypal: 'PayPal',
    paymentCash: 'Наличные',
    paymentShopIntro: 'Оплата в магазине, доступные варианты:',
    paymentShopOptions: 'Наличные или карта',
    paymentCardChip: 'Карта',
    paymentCardTypesLabel: 'Типы карт',
    paymentCardAtShop: 'Оплата картой также возможна в магазине.',
    paymentHelp: 'Нажмите Place Order, чтобы открыть WhatsApp.',
    voucherTitle: 'Купон',
    voucherPlaceholder: 'Введите код',
    applyVoucher: 'Применить',
    voucherDiscountLabel: 'Купон',
    voucherApplied: 'Купон {code} применен (-{amount}).',
    voucherInvalid: 'Код купона недействителен.',
    voucherInactive: 'Этот купон деактивирован.',
    voucherLimitReached: 'Лимит использования купона достигнут.',
    voucherMinimumNotReached: 'Купон действует от {minimum}. Добавьте еще {gap}.',
    voucherApplyFailed: 'Сейчас не удалось проверить купон.',
    subtotalLabel: 'Промежуточный итог',
    serviceFeeLabel: 'Сервис',
    minimumGapLabel: 'До минимума осталось',
    totalLabel: 'Итого',
    buttonPlaceOrder: 'Оформить заказ',
    buttonPayNow: 'Оплатить сейчас',
    sendViaWhatsapp: 'Отправить заказ через WhatsApp',
    cancelOrder: 'Отменить и вернуться на главную',
    soldOut: 'Распродано',
    loadingMenu: 'Загрузка меню...',
    menuUnavailable: 'Меню временно недоступно.',
    detailsEyebrow: 'Информация о ресторане',
    detailsAddress: 'Адрес: Sample Street 12, 12345 Demo City. Сейчас доступен только самовывоз.',
    openMaps: 'Открыть в Google Maps',
    pickupOnlyNote: 'Сейчас все заказы подготавливаются для самовывоза из нашего магазина.',
    hoursTitle: 'Часы работы',
    hoursOpenNow: 'Сейчас открыто',
    hoursClosedNow: 'Сейчас закрыто',
    hoursWeekdays: 'Пн-Пт',
    hoursSaturday: 'Суббота',
    hoursSunday: 'Воскресенье',
    dayMonday: 'Понедельник',
    dayTuesday: 'Вторник',
    dayWednesday: 'Среда',
    dayThursday: 'Четверг',
    dayFriday: 'Пятница',
    daySaturday: 'Суббота',
    daySunday: 'Воскресенье',
    closedLabel: 'Закрыто',
    legalEyebrow: 'Юридическая информация',
    legalTitle: 'Юридическая информация',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Конфиденциальность',
    legalStreitbeilegung: 'Разрешение потребительских споров',
    closeButton: 'Закрыть',
    aboutEyebrow: 'О нас',
    aboutTitle: 'Откройте новые вкусы в Demo Sushi House',
    aboutBody1: 'Суши, бургеры, буррито и многое другое. Попробуйте наши свежие блюда.',
    aboutBody2:
      'Мы демонстрационный ресторан в центре Demo City по адресу Sample Street 12. Наша примерная команда готовит суши, бургеры, буррито и другие блюда.',
    aboutBody3:
      'Каждое блюдо готовится с вниманием и любовью к качеству. Мы используем свежие ингредиенты и заботимся о высоком уровне сервиса.',
    aboutBody4: 'Наша цель — радовать гостей креативными блюдами, честными ценами и настоящим гостеприимством.',
    allergensEyebrow: 'Добавки и аллергены',
    allergensTitle: 'Добавки и аллергены',
    allergensAdditives:
      'Добавки: 1=с красителем, 2=с консервантами, 3=с антиоксидантами, 4=с усилителем вкуса, 5=сульфитированные, 6=черненые, 7=с фосфатом, 8=с подсластителем, 11=с нитритной посолочной солью, 13=содержит кофеин, 19=лактоза, 22=с сахаром и подсластителями.',
    allergensAllergens:
      'Аллергены: A=глютен, A1=пшеница, A2=рожь, A4=овес, B=ракообразные, C=яйца, D=рыба, F=соевые бобы, G=молоко, L=сельдерей, M=горчица, N=кунжут, O=диоксид серы, R=моллюски.',
    allergensDisclaimer:
      'Все цены указаны в EUR, включая НДС и обслуживание. Мы не несем ответственности за маркировку блюд добавками и аллергенами. По вопросам обращайтесь к персоналу.',
    allLabel: 'Все',
    itemSingle: 'позиция',
    itemPlural: 'позиций',
    noMenuMatch: 'По вашему запросу ничего не найдено.',
    itemDescriptionFallback: 'Свежеприготовлено в Demo Sushi House.',
    addItemsToCheckout: 'Добавьте позиции',
    addMoreAmount: 'Добавьте еще на {amount}',
    nameValidation: 'Пожалуйста, укажите полное имя.',
    phoneValidationEmpty: 'Пожалуйста, укажите номер телефона.',
    phoneValidationInvalid: 'Введите корректный номер телефона (8-15 цифр).',
    emailValidationInvalid: 'Введите корректный адрес электронной почты.',
    scheduleValidationRequired: 'Выберите дату и время самовывоза.',
    scheduleValidationFuture: 'Запланированное время должно быть в будущем.',
    scheduleValidationWithinHours: 'Выберите время в рамках часов работы.',
    statusAddItemFirst: 'Сначала добавьте хотя бы одну позицию.',
    statusMinimumGap: 'Минимальный заказ: {minimum}. Добавьте еще {gap}.',
    statusClosedScheduleRequired: 'Сейчас закрыто. Пожалуйста, выберите запланированное время самовывоза.',
    statusVoucherRequired: 'Сначала примените купон перед оформлением заказа.',
    statusVoucherRecheckFailed: 'Купон не удалось списать. Примените заново.',
    statusOrderSaveFailed: 'Не удалось сохранить заказ. Попробуйте еще раз.',
    statusWhatsappOpening: 'Открываем WhatsApp с деталями заказа...',
    statusWhatsappBlocked: 'Не удалось автоматически открыть WhatsApp. Попробуйте еще раз.',
    statusRedirectingPaypal: 'Перенаправляем на PayPal Checkout...',
    statusPaypalCancelled: 'Оплата PayPal была отменена.',
    statusPaypalOrderMissing: 'PayPal вернул пользователя, но данные заказа не найдены.',
    statusPaypalReturnPending: 'PayPal вернул пользователя, но статус оплаты не подтвержден.',
    statusPaypalCheckoutFailed: 'Не удалось открыть PayPal Checkout. Попробуйте еще раз.',
    whatsappConfirmTitle: 'Вы уже отправили заказ?',
    whatsappConfirmBody: 'Если вы отправили заказ в WhatsApp, мы можем очистить корзину.',
    whatsappConfirmYes: 'Да',
    whatsappConfirmNo: 'Нет',
    whatsappConfirmThanks: 'Ваш заказ в обработке, спасибо :)',
    waHeader: 'Новый заказ',
    waBusiness: 'Ресторан',
    waCustomer: 'Имя',
    waPhone: 'Телефон',
    waPayment: 'Оплата',
    waFulfillment: 'Самовывоз',
    waFulfillmentNow: 'Как можно скорее',
    waFulfillmentScheduled: 'Запланировано на {datetime}',
    waItems: 'Позиции',
    themeSwitchToLight: 'Переключить на светлую тему',
    themeSwitchToDark: 'Переключить на тёмную тему'
  },
  ja: {
    navPopular: '人気',
    navMenu: 'メニュー',
    navDetails: '店舗情報',
    cartLabel: 'カート',
    floatingCartLabel: 'カート',
    floatingCartAria: 'カートを開く',
    heroCopy: '新鮮でスピーディー。Sample Street 12, Demo City。',
    promoFootballTitle: 'ドイツ代表応援割引',
    promoFootballBody:
      'ドイツ代表を応援するフットボール割引です。DEUTSCHLAND5 または DE5 を使うと、45 EUR以上のご注文で5 EUR割引になります。',
    startOrder: '注文を始める',
    viewCart: 'カートを見る',
    heroStatItems: 'メニュー項目',
    heroStatMinimum: '最低注文額',
    heroStatPreparationTime: '準備時間',
    heroStatPreparationTimeValue: '25-35 分',
    heroStatPickup: '注文方法',
    heroStatPickupValue: '店頭受け取りのみ',
    popularEyebrow: 'おすすめ',
    popularTitle: 'よく注文される商品',
    menuEyebrow: '全メニュー',
    menuTitle: 'ロール、ボウル、バーガー、フライ、ドリンク',
    menuSynced: 'メニュー項目',
    searchLabel: 'メニュー検索',
    searchPlaceholder: '例: サーモン、ブリトー、フライ...',
    checkoutEyebrow: 'チェックアウト',
    cartTitle: 'カート',
    emptyCart: '注文を始めるには商品を追加してください。',
    pickupTitle: '受け取り',
    pickupNote: 'ご注文はSample Street 12で店頭受け取り用に準備されます。',
    contactTitle: '連絡先',
    nameLabel: '名前',
    phoneLabel: '電話番号',
    emailLabel: 'メール（任意）',
    scheduleTitle: '受け取り時間',
    scheduleAsap: 'できるだけ早く',
    scheduleLater: '日時を指定',
    scheduleDateLabel: '受け取り日',
    scheduleTimeLabel: '受け取り時間',
    scheduleHelpOpen: '現在営業中です。今すぐ注文するか、後の時間を指定できます。',
    scheduleHelpLater: '営業時間内の受け取り日時を選択してください。',
    scheduleHelpClosed: '現在休業中です。受け取り日時を指定してください。',
    paymentTitle: '店舗でのお支払い',
    paymentPaypal: 'PayPal',
    paymentCash: '現金',
    paymentShopIntro: '店舗でのお支払い、利用可能な方法:',
    paymentShopOptions: '現金またはカード',
    paymentCardChip: 'カード',
    paymentCardTypesLabel: 'カード種類',
    paymentCardAtShop: '店舗でのカード決済も可能です。',
    paymentHelp: 'Place Orderを押すとWhatsAppが開きます。',
    voucherTitle: 'クーポン',
    voucherPlaceholder: 'コードを入力',
    applyVoucher: '適用',
    voucherDiscountLabel: 'クーポン',
    voucherApplied: 'クーポン {code} を適用しました (-{amount})。',
    voucherInvalid: 'このクーポンコードは無効です。',
    voucherInactive: 'このクーポンは無効化されています。',
    voucherLimitReached: 'このクーポンは利用上限に達しました。',
    voucherMinimumNotReached: 'このクーポンは {minimum} 以上で利用できます。あと {gap} 追加してください。',
    voucherApplyFailed: '現在クーポンを確認できません。',
    subtotalLabel: '小計',
    serviceFeeLabel: 'サービス料',
    minimumGapLabel: '最低注文まで',
    totalLabel: '合計',
    buttonPlaceOrder: '注文を確定',
    buttonPayNow: '今すぐ支払う',
    sendViaWhatsapp: 'WhatsAppで注文送信',
    cancelOrder: 'キャンセルしてホームへ戻る',
    soldOut: '売り切れ',
    loadingMenu: 'メニューを読み込み中...',
    menuUnavailable: '現在メニューを表示できません。',
    detailsEyebrow: '店舗情報',
    detailsAddress: '住所: Sample Street 12, 12345 Demo City。現在は店頭受け取りのみです。',
    openMaps: 'Google Mapsで開く',
    pickupOnlyNote: '現在すべてのご注文は店舗受け取りでご用意しています。',
    hoursTitle: '営業時間',
    hoursOpenNow: '現在営業中',
    hoursClosedNow: '現在休業中',
    hoursWeekdays: '月-金',
    hoursSaturday: '土曜日',
    hoursSunday: '日曜日',
    dayMonday: '月曜日',
    dayTuesday: '火曜日',
    dayWednesday: '水曜日',
    dayThursday: '木曜日',
    dayFriday: '金曜日',
    daySaturday: '土曜日',
    daySunday: '日曜日',
    closedLabel: '休業',
    legalEyebrow: '法的情報',
    legalTitle: '法的情報',
    legalImpressum: 'インプリント',
    legalDatenschutz: 'プライバシー',
    legalStreitbeilegung: '消費者紛争解決',
    closeButton: '閉じる',
    aboutEyebrow: '私たちについて',
    aboutTitle: 'Demo Sushi Houseで新しい味を発見',
    aboutBody1: '寿司、バーガー、ブリトーなど、できたての料理をお楽しみください。',
    aboutBody2:
      '私たちはDemo City中心部（Sample Street 12）にあるデモ用レストランです。サンプルチームが寿司・バーガー・ブリトーなどを用意します。',
    aboutBody3:
      'すべての料理を情熱と丁寧さを持って作り、品質を大切にしています。新鮮な食材と満足度の高いサービスを重視しています。',
    aboutBody4: '地域のお客様に、創造的な料理と適正価格、温かいおもてなしを届けることが目標です。',
    allergensEyebrow: '添加物とアレルゲン',
    allergensTitle: '添加物とアレルゲン',
    allergensAdditives:
      '添加物: 1=着色料使用, 2=保存料使用, 3=酸化防止剤使用, 4=調味料(うま味調味料)使用, 5=亜硫酸塩処理, 6=黒色化, 7=リン酸塩使用, 8=甘味料使用, 11=亜硝酸塩入り塩せき剤使用, 13=カフェイン含有, 19=乳糖, 22=砂糖と甘味料使用。',
    allergensAllergens:
      'アレルゲン: A=グルテン, A1=小麦, A2=ライ麦, A4=オーツ麦, B=甲殻類, C=卵, D=魚, F=大豆, G=乳, L=セロリ, M=マスタード, N=ごま, O=二酸化硫黄, R=軟体類。',
    allergensDisclaimer:
      '価格はすべてEUR表記で、付加価値税およびサービス料を含みます。添加物・アレルゲン表示の正確性について、当店は責任を負いかねます。ご不明点はスタッフまでお尋ねください。',
    allLabel: 'すべて',
    itemSingle: '件',
    itemPlural: '件',
    noMenuMatch: '条件に一致する商品が見つかりません。',
    itemDescriptionFallback: 'Demo Sushi Houseで新鮮に調理。',
    addItemsToCheckout: '商品を追加',
    addMoreAmount: '{amount} 追加してください',
    nameValidation: '氏名を入力してください。',
    phoneValidationEmpty: '電話番号を入力してください。',
    phoneValidationInvalid: '8〜15桁の有効な電話番号を入力してください。',
    emailValidationInvalid: '有効なメールアドレスを入力してください。',
    scheduleValidationRequired: '受け取り日時を選択してください。',
    scheduleValidationFuture: '受け取り日時は現在より後の時間を指定してください。',
    scheduleValidationWithinHours: '営業時間内の時間を選択してください。',
    statusAddItemFirst: 'まず商品を追加してください。',
    statusMinimumGap: '最低注文額は {minimum} です。あと {gap} 追加してください。',
    statusClosedScheduleRequired: '現在休業中です。受け取り日時を指定してください。',
    statusVoucherRequired: 'チェックアウト前にクーポンを適用してください。',
    statusVoucherRecheckFailed: 'クーポンを利用できませんでした。再度適用してください。',
    statusOrderSaveFailed: '注文を保存できませんでした。もう一度お試しください。',
    statusWhatsappOpening: '注文内容入りのWhatsAppを開いています...',
    statusWhatsappBlocked: 'WhatsAppを自動で開けませんでした。もう一度お試しください。',
    statusRedirectingPaypal: 'PayPal Checkoutへ移動しています...',
    statusPaypalCancelled: 'PayPal支払いがキャンセルされました。',
    statusPaypalOrderMissing: 'PayPalから戻りましたが、保存済み注文データが見つかりません。',
    statusPaypalReturnPending: 'PayPalから戻りましたが、支払い状況が確認できませんでした。',
    statusPaypalCheckoutFailed: 'PayPal Checkout を開けませんでした。もう一度お試しください。',
    whatsappConfirmTitle: '注文はすでに送信しましたか？',
    whatsappConfirmBody: 'WhatsAppで注文を送信済みなら、カートを空にできます。',
    whatsappConfirmYes: 'はい',
    whatsappConfirmNo: 'いいえ',
    whatsappConfirmThanks: 'ご注文を受け付けました。ありがとうございます :)',
    waHeader: '新規注文',
    waBusiness: '店舗',
    waCustomer: 'お名前',
    waPhone: '電話番号',
    waPayment: '支払い',
    waFulfillment: '受け取り',
    waFulfillmentNow: 'できるだけ早く',
    waFulfillmentScheduled: '{datetime} に受け取り予定',
    waItems: '注文商品',
    themeSwitchToLight: 'ライトテーマに切り替え',
    themeSwitchToDark: 'ダークテーマに切り替え'
  },
  tr: {
    navPopular: 'Popüler',
    navMenu: 'Menü',
    navDetails: 'Detaylar',
    cartLabel: 'Sepet',
    floatingCartLabel: 'Sepet',
    floatingCartAria: 'Sepeti aç',
    heroCopy: 'Taze, hızlı ve özenle hazırlanır. Sample Street 12, Demo City.',
    promoFootballTitle: 'Almanya futbol indirimi',
    promoFootballBody:
      'Almanya futbol takımını desteklemek için özel indirim. DEUTSCHLAND5 veya DE5 ile 45 EUR üzeri siparişlerde 5 EUR indirim alın.',
    startOrder: 'Siparişe Başla',
    viewCart: 'Sepeti Gör',
    heroStatItems: 'Menü Ürünü',
    heroStatMinimum: 'Minimum Sipariş',
    heroStatPreparationTime: 'Hazırlık Süresi',
    heroStatPreparationTimeValue: '25-35 dk',
    heroStatPickup: 'Sipariş Tipi',
    heroStatPickupValue: 'Sadece gel-al',
    popularEyebrow: 'Hızlı seçim',
    popularTitle: 'En çok sipariş edilenler',
    menuEyebrow: 'Tam menü',
    menuTitle: 'Roll, bowl, burger, patates, içecek',
    menuSynced: 'Menü ürünleri',
    searchLabel: 'Menüde ara',
    searchPlaceholder: 'Somon, burrito, patates ara...',
    checkoutEyebrow: 'Ödeme',
    cartTitle: 'Sepetin',
    emptyCart: 'Siparişe başlamak için ürün ekleyin.',
    pickupTitle: 'Gel-al',
    pickupNote: 'Siparişiniz Sample Street 12 adresinde teslim almak için hazırlanacaktır.',
    contactTitle: 'İletişim',
    nameLabel: 'Ad',
    phoneLabel: 'Telefon',
    emailLabel: 'E-posta (opsiyonel)',
    scheduleTitle: 'Sipariş zamanı',
    scheduleAsap: 'Mümkün olan en kısa sürede',
    scheduleLater: 'Daha sonra planla',
    scheduleDateLabel: 'Teslim alma tarihi',
    scheduleTimeLabel: 'Teslim alma saati',
    scheduleHelpOpen: 'Şu an açık: hemen sipariş verebilir veya ileri bir saat seçebilirsin.',
    scheduleHelpLater: 'Açılış saatleri içinde bir tarih ve saat seçin.',
    scheduleHelpClosed: 'Restoran şu an kapalı. Lütfen teslim alma zamanını planlayın.',
    paymentTitle: 'Mağazada ödeme',
    paymentPaypal: 'PayPal',
    paymentCash: 'Nakit',
    paymentShopIntro: 'Mağazada ödeme, mevcut seçenekler:',
    paymentShopOptions: 'Nakit veya Kart',
    paymentCardChip: 'Kart',
    paymentCardTypesLabel: 'Kart Türleri',
    paymentCardAtShop: 'Kart ile ödeme mağazada da mümkündür.',
    paymentHelp: 'WhatsApp açmak için Place Order tıklayın.',
    voucherTitle: 'Kupon',
    voucherPlaceholder: 'Kod girin',
    applyVoucher: 'Uygula',
    voucherDiscountLabel: 'Kupon',
    voucherApplied: '{code} kuponu uygulandı (-{amount}).',
    voucherInvalid: 'Bu kupon kodu geçersiz.',
    voucherInactive: 'Bu kupon pasif durumda.',
    voucherLimitReached: 'Bu kupon kullanım limitine ulaştı.',
    voucherMinimumNotReached: 'Bu kupon {minimum} ve üzeri siparişlerde geçerlidir. Lütfen {gap} daha ekleyin.',
    voucherApplyFailed: 'Kupon şu anda doğrulanamadı.',
    subtotalLabel: 'Ara toplam',
    serviceFeeLabel: 'Servis',
    minimumGapLabel: 'Minimum için kalan',
    totalLabel: 'Toplam',
    buttonPlaceOrder: 'Siparişi ver',
    buttonPayNow: 'Hemen öde',
    sendViaWhatsapp: 'Siparişi WhatsApp ile gönder',
    cancelOrder: 'İptal et ve ana sayfaya dön',
    soldOut: 'Tükendi',
    loadingMenu: 'Menü yükleniyor...',
    menuUnavailable: 'Menü şu anda kullanılamıyor.',
    detailsEyebrow: 'Restoran detayları',
    detailsAddress: 'Adres: Sample Street 12, 12345 Demo City. Şu anda sadece gel-al mevcut.',
    openMaps: 'Google Maps\'te aç',
    pickupOnlyNote: 'Şu anda tüm siparişler mağazamızdan teslim alınmak üzere hazırlanır.',
    hoursTitle: 'Açılış saatleri',
    hoursOpenNow: 'Şu anda açık',
    hoursClosedNow: 'Şu anda kapalı',
    hoursWeekdays: 'Pzt-Cuma',
    hoursSaturday: 'Cumartesi',
    hoursSunday: 'Pazar',
    dayMonday: 'Pazartesi',
    dayTuesday: 'Salı',
    dayWednesday: 'Çarşamba',
    dayThursday: 'Perşembe',
    dayFriday: 'Cuma',
    daySaturday: 'Cumartesi',
    daySunday: 'Pazar',
    closedLabel: 'Kapalı',
    legalEyebrow: 'Yasal',
    legalTitle: 'Yasal bilgiler',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Gizlilik',
    legalStreitbeilegung: 'Tüketici uyuşmazlık çözümü',
    closeButton: 'Kapat',
    aboutEyebrow: 'Hakkımızda',
    aboutTitle: 'Demo Sushi House ile yeni tatlar keşfedin',
    aboutBody1: 'Sushi, burger, burrito ve daha fazlası. Taze lezzetlerimizi deneyin.',
    aboutBody2:
      'Demo City merkezinde, Sample Street 12 adresinde bir demo restoranız. Örnek ekibimiz sushi, burger, burrito ve diğer spesiyaller hazırlar.',
    aboutBody3:
      'Her yemeği tutkuyla, özenle ve kalite odaklı hazırlıyoruz. Taze malzemeler ve müşteri memnuniyeti önceliğimizdir.',
    aboutBody4: 'Hedefimiz, mahallemize yaratıcı lezzetler, adil fiyatlar ve samimi misafirperverlik sunmaktır.',
    allergensEyebrow: 'Katkı Maddeleri ve Alerjenler',
    allergensTitle: 'Katkı Maddeleri ve Alerjenler',
    allergensAdditives:
      'Katkı maddeleri: 1=renklendirici içerir, 2=koruyucu içerir, 3=antioksidan içerir, 4=lezzet artırıcı içerir, 5=kükürtlenmiş, 6=siyahlaştırılmış, 7=fosfat içerir, 8=tatlandırıcı içerir, 11=nitritli kürleme tuzu içerir, 13=kafein içerir, 19=laktoz, 22=şeker ve tatlandırıcı içerir.',
    allergensAllergens:
      'Alerjenler: A=gluten, A1=buğday, A2=çavdar, A4=yulaf, B=kabuklular, C=yumurta, D=balık, F=soya fasulyesi, G=süt, L=kereviz, M=hardal, N=susam, O=kükürt dioksit, R=yumuşakçalar.',
    allergensDisclaimer:
      'Tüm fiyatlar EUR cinsindedir ve KDV ile servis dahildir. Yemeklerin katkı maddeleri ve alerjenlerle işaretlenmesine ilişkin sorumluluk kabul edilmez. Sorularınız için servis personeline başvurun.',
    allLabel: 'Tümü',
    itemSingle: 'ürün',
    itemPlural: 'ürün',
    noMenuMatch: 'Aramaya uygun menü ürünü bulunamadı.',
    itemDescriptionFallback: 'Demo Sushi House tarafından taze hazırlanır.',
    addItemsToCheckout: 'Ürün ekleyin',
    addMoreAmount: '{amount} daha ekleyin',
    nameValidation: 'Lütfen müşterinin tam adını girin.',
    phoneValidationEmpty: 'Lütfen telefon numarası girin.',
    phoneValidationInvalid: '8-15 haneli geçerli bir telefon numarası girin.',
    emailValidationInvalid: 'Lütfen geçerli bir e-posta adresi girin.',
    scheduleValidationRequired: 'Lütfen teslim alma tarihini ve saatini seçin.',
    scheduleValidationFuture: 'Planlanan teslim alma saati gelecekte olmalıdır.',
    scheduleValidationWithinHours: 'Lütfen açılış saatleri içinde bir zaman seçin.',
    statusAddItemFirst: 'Önce en az bir ürün ekleyin.',
    statusMinimumGap: 'Minimum sipariş {minimum}. Lütfen {gap} daha ekleyin.',
    statusClosedScheduleRequired: 'Restoran şu an kapalı. Lütfen planlı teslim alma zamanı seçin.',
    statusVoucherRequired: 'Ödeme öncesi kuponu uygulayın.',
    statusVoucherRecheckFailed: 'Kupon kullanılamadı. Lütfen yeniden uygulayın.',
    statusOrderSaveFailed: 'Sipariş kaydedilemedi. Lütfen tekrar deneyin.',
    statusWhatsappOpening: 'Sipariş detaylarıyla WhatsApp açılıyor...',
    statusWhatsappBlocked: 'WhatsApp otomatik açılamadı. Lütfen tekrar deneyin.',
    statusRedirectingPaypal: 'PayPal Checkout yönlendiriliyor...',
    statusPaypalCancelled: 'PayPal ödemesi iptal edildi.',
    statusPaypalOrderMissing: 'PayPal dönüşü alındı ancak kayıtlı sipariş bulunamadı.',
    statusPaypalReturnPending: 'PayPal dönüşü alındı ancak ödeme durumu doğrulanamadı.',
    statusPaypalCheckoutFailed: 'PayPal Checkout açılamadı. Lütfen tekrar deneyin.',
    whatsappConfirmTitle: 'Siparişi zaten gönderdin mi?',
    whatsappConfirmBody: 'Siparişi WhatsApp ile gönderdiysen sepeti şimdi temizleyebiliriz.',
    whatsappConfirmYes: 'Evet',
    whatsappConfirmNo: 'Hayır',
    whatsappConfirmThanks: 'Siparişin işleme alındı, teşekkürler :)',
    waHeader: 'Yeni sipariş',
    waBusiness: 'Restoran',
    waCustomer: 'Ad',
    waPhone: 'Telefon',
    waPayment: 'Ödeme',
    waFulfillment: 'Teslim alma',
    waFulfillmentNow: 'Mümkün olan en kısa sürede',
    waFulfillmentScheduled: '{datetime} için planlandı',
    waItems: 'Ürünler',
    themeSwitchToLight: 'Açık temaya geç',
    themeSwitchToDark: 'Koyu temaya geç'
  }
};

const LANGUAGE_NAMES = {
  de: 'DE',
  en: 'EN',
  ru: 'RU',
  ja: 'JA',
  tr: 'TR'
};

const LANGUAGE_LOCALES = {
  de: 'de-DE',
  en: 'en-GB',
  ru: 'ru-RU',
  ja: 'ja-JP',
  tr: 'tr-TR'
};

const CATEGORY_NAME_TRANSLATIONS = {
  'Burger-Menüs 🍔🍟🥤': {
    en: 'Burger Menus 🍔🍟🥤',
    ru: 'Бургер-меню 🍔🍟🥤',
    ja: 'バーガーセット 🍔🍟🥤',
    tr: 'Burger Menüleri 🍔🍟🥤'
  },
  'Sushi Menü 🍱': {
    en: 'Sushi Menus 🍱',
    ru: 'Суши-меню 🍱',
    ja: '寿司メニュー 🍱',
    tr: 'Suşi Menüleri 🍱'
  },
  'Vorspeisen 🧀': {
    en: 'Starters 🧀',
    ru: 'Закуски 🧀',
    ja: '前菜 🧀',
    tr: 'Başlangıçlar 🧀'
  },
  'Salate 🥗': {
    en: 'Salads 🥗',
    ru: 'Салаты 🥗',
    ja: 'サラダ 🥗',
    tr: 'Salatalar 🥗'
  },
  'Maki 🍣': {
    en: 'Maki 🍣',
    ru: 'Маки 🍣',
    ja: '巻き寿司 🍣',
    tr: 'Maki 🍣'
  },
  'Sushi Burrito 🍣': {
    en: 'Sushi Burrito 🍣',
    ru: 'Суши-буррито 🍣',
    ja: 'スシーブリトー 🍣',
    tr: 'Suşi Burrito 🍣'
  },
  'Rainbow Rolls 🍣': {
    en: 'Rainbow Rolls 🍣',
    ru: 'Рейнбоу роллы 🍣',
    ja: 'レインボーロール 🍣',
    tr: 'Rainbow Roll 🍣'
  },
  'Futo Maki 🍣': {
    en: 'Futo Maki 🍣',
    ru: 'Футо маки 🍣',
    ja: '太巻き 🍣',
    tr: 'Futo Maki 🍣'
  },
  'California Rolls 🍣': {
    en: 'California Rolls 🍣',
    ru: 'Калифорния роллы 🍣',
    ja: 'カリフォルニアロール 🍣',
    tr: 'California Roll 🍣'
  },
  'Nigiri Sushi 🍣': {
    en: 'Nigiri Sushi 🍣',
    ru: 'Нигири суши 🍣',
    ja: 'にぎり寿司 🍣',
    tr: 'Nigiri Suşi 🍣'
  },
  'Crunchy Rolls 🍣': {
    en: 'Crunchy Rolls 🍣',
    ru: 'Кранчи роллы 🍣',
    ja: 'クランチロール 🍣',
    tr: 'Çıtır Roll 🍣'
  },
  'Sushi Rice Bowls 🍚': {
    en: 'Sushi Rice Bowls 🍚',
    ru: 'Суши боулы 🍚',
    ja: '寿司ライスボウル 🍚',
    tr: 'Suşi Pirinç Bowlları 🍚'
  },
  'Gebratener Reis 🍚': {
    en: 'Fried Rice 🍚',
    ru: 'Жареный рис 🍚',
    ja: 'チャーハン 🍚',
    tr: 'Kızarmış Pilav 🍚'
  },
  'Burger und Pommes Frites🍔': {
    en: 'Burger and Fries 🍔',
    ru: 'Бургеры и картофель фри 🍔',
    ja: 'バーガーとフライドポテト 🍔',
    tr: 'Burger ve Patates 🍔'
  },
  'Alkoholfreie Getränke 🥤': {
    en: 'Soft Drinks 🥤',
    ru: 'Безалкогольные напитки 🥤',
    ja: 'ソフトドリンク 🥤',
    tr: 'Alkolsüz İçecekler 🥤'
  },
  Besteck: {
    en: 'Cutlery',
    ru: 'Приборы',
    ja: 'カトラリー',
    tr: 'Çatal Bıçak'
  }
};

const MENU_TEXT_RULES = {
  en: [
    [/Menü/gi, 'Menu'],
    [/\bmit\b/gi, 'with'],
    [/\bund\b/gi, 'and'],
    [/\bstück\b/gi, 'pcs'],
    [/Es werden jeweils/gi, 'Served as'],
    [/servier(?:t)?/gi, 'served'],
    [/außer/gi, 'except'],
    [/veganer/gi, 'vegan'],
    [/eingelegten/gi, 'pickled'],
    [/Lachs/gi, 'Salmon'],
    [/Thunfisch/gi, 'Tuna'],
    [/Gurke(?:n)?/gi, 'Cucumber'],
    [/Paprika(?:l)?/gi, 'Bell pepper'],
    [/Rettich/gi, 'Radish'],
    [/Frischkäse/gi, 'Cream cheese'],
    [/Garnelen/gi, 'Shrimp'],
    [/Eier omelett/gi, 'Egg omelet'],
    [/Getränk/gi, 'Drink'],
    [/getränk/gi, 'drink'],
    [/wahl/gi, 'choice'],
    [/Pommes frites/gi, 'fries'],
    [/Mini Frühlingsrollen/gi, 'Mini spring rolls'],
    [/Vegetarische Samosa/gi, 'Vegetarian samosa'],
    [/Gebratener Reis/gi, 'Fried rice']
  ],
  ru: [
    [/Menü/gi, 'меню'],
    [/\bmit\b/gi, 'с'],
    [/\bund\b/gi, 'и'],
    [/\bstück\b/gi, 'шт.'],
    [/Es werden jeweils/gi, 'Подается'],
    [/servier(?:t)?/gi, ''],
    [/außer/gi, 'кроме'],
    [/veganer/gi, 'веганский'],
    [/Lachs/gi, 'лосось'],
    [/Thunfisch/gi, 'тунец'],
    [/Gurke(?:n)?/gi, 'огурец'],
    [/Paprika(?:l)?/gi, 'паприка'],
    [/Rettich/gi, 'редька'],
    [/Frischkäse/gi, 'сливочный сыр'],
    [/Garnelen/gi, 'креветки'],
    [/Eier omelett/gi, 'омлет'],
    [/Getränk/gi, 'напиток'],
    [/Pommes frites/gi, 'картофель фри'],
    [/Gebratener Reis/gi, 'жареный рис']
  ],
  ja: [
    [/Menü/gi, 'メニュー'],
    [/\bmit\b/gi, '入り'],
    [/\bund\b/gi, 'と'],
    [/\bstück\b/gi, '個'],
    [/Es werden jeweils/gi, '提供数'],
    [/servier(?:t)?/gi, '提供'],
    [/außer/gi, '除く'],
    [/veganer/gi, 'ヴィーガン'],
    [/Lachs/gi, 'サーモン'],
    [/Thunfisch/gi, 'マグロ'],
    [/Gurke(?:n)?/gi, 'きゅうり'],
    [/Paprika(?:l)?/gi, 'パプリカ'],
    [/Rettich/gi, '大根'],
    [/Frischkäse/gi, 'クリームチーズ'],
    [/Garnelen/gi, 'エビ'],
    [/Eier omelett/gi, '玉子焼き'],
    [/Getränk/gi, 'ドリンク'],
    [/Pommes frites/gi, 'フライドポテト'],
    [/Gebratener Reis/gi, 'チャーハン']
  ],
  tr: [
    [/Menü/gi, 'Menü'],
    [/\bmit\b/gi, 'ile'],
    [/\bund\b/gi, 've'],
    [/\bstück\b/gi, 'adet'],
    [/Es werden jeweils/gi, 'Servis'],
    [/servier(?:t)?/gi, 'edilir'],
    [/außer/gi, 'hariç'],
    [/veganer/gi, 'vegan'],
    [/Lachs/gi, 'somon'],
    [/Thunfisch/gi, 'ton balığı'],
    [/Gurke(?:n)?/gi, 'salatalık'],
    [/Paprika(?:l)?/gi, 'biber'],
    [/Rettich/gi, 'turp'],
    [/Frischkäse/gi, 'krem peynir'],
    [/Garnelen/gi, 'karides'],
    [/Eier omelett/gi, 'yumurta omlet'],
    [/Getränk/gi, 'içecek'],
    [/Pommes frites/gi, 'patates kızartması'],
    [/Gebratener Reis/gi, 'kızarmış pilav']
  ]
};

const LEGAL_TEXT = {
  impressum: {
    de: {
      title: 'Impressum',
      paragraphs: [
        'Diensteanbieter: Demo Sushi House',
        'Anschrift: Sample Street 12, 12345 Demo City, Deutschland',
        'Kontakt: +49 123 4567890, hello@example.com',
        'Vertretungsberechtigte Person: Beispiel Betreiber'
      ]
    },
    en: {
      title: 'Impressum',
      paragraphs: [
        'Service provider: Demo Sushi House',
        'Address: Sample Street 12, 12345 Demo City, Germany',
        'Contact: +49 123 4567890, hello@example.com',
        'Authorized representative: Example Operator'
      ]
    },
    ru: {
      title: 'Impressum',
      paragraphs: [
        'Поставщик услуг: Demo Sushi House',
        'Адрес: Sample Street 12, 12345 Demo City, Германия',
        'Контакты: +49 123 4567890, hello@example.com',
        'Уполномоченный представитель: Example Operator'
      ]
    },
    ja: {
      title: 'Impressum',
      paragraphs: [
        '事業者: Demo Sushi House',
        '住所: Sample Street 12, 12345 Demo City, Germany',
        '連絡先: +49 123 4567890, hello@example.com',
        '代表者名: Example Operator'
      ]
    },
    tr: {
      title: 'Impressum',
      paragraphs: [
        'Hizmet sağlayıcı: Demo Sushi House',
        'Adres: Sample Street 12, 12345 Demo City, Almanya',
        'İletişim: +49 123 4567890, hello@example.com',
        'Yetkili temsilci: Example Operator'
      ]
    }
  },
  datenschutz: {
    de: {
      title: 'Datenschutz',
      paragraphs: [
        'Data Processing for Orders',
        'When you place an order through our website, we collect the information you provide (such as your name, telephone number, and optionally your email address) solely for the purpose of processing your order.',
        'The information entered into the order form is not stored in a separate customer database on our website. Instead, the order details are transmitted directly to us via WhatsApp so that we can verify and process your order.',
        'The data is used exclusively for order processing and customer communication relating to your order. We do not use your data for marketing purposes and do not sell or share it with third parties except where necessary for order processing.',
        "Please note that when you send an order via WhatsApp, your data is also processed by WhatsApp Ireland Limited and its affiliated companies in accordance with WhatsApp's own privacy policy. Further information can be found at: https://www.whatsapp.com/legal/privacy-policy",
        'You have the rights granted under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, and object to the processing of your personal data.'
      ]
    },
    en: {
      title: 'Privacy',
      paragraphs: [
        'Data Processing for Orders',
        'When you place an order through our website, we collect the information you provide (such as your name, telephone number, and optionally your email address) solely for the purpose of processing your order.',
        'The information entered into the order form is not stored in a separate customer database on our website. Instead, the order details are transmitted directly to us via WhatsApp so that we can verify and process your order.',
        'The data is used exclusively for order processing and customer communication relating to your order. We do not use your data for marketing purposes and do not sell or share it with third parties except where necessary for order processing.',
        "Please note that when you send an order via WhatsApp, your data is also processed by WhatsApp Ireland Limited and its affiliated companies in accordance with WhatsApp's own privacy policy. Further information can be found at: https://www.whatsapp.com/legal/privacy-policy",
        'You have the rights granted under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, and object to the processing of your personal data.'
      ]
    },
    ru: {
      title: 'Конфиденциальность',
      paragraphs: [
        'Data Processing for Orders',
        'When you place an order through our website, we collect the information you provide (such as your name, telephone number, and optionally your email address) solely for the purpose of processing your order.',
        'The information entered into the order form is not stored in a separate customer database on our website. Instead, the order details are transmitted directly to us via WhatsApp so that we can verify and process your order.',
        'The data is used exclusively for order processing and customer communication relating to your order. We do not use your data for marketing purposes and do not sell or share it with third parties except where necessary for order processing.',
        "Please note that when you send an order via WhatsApp, your data is also processed by WhatsApp Ireland Limited and its affiliated companies in accordance with WhatsApp's own privacy policy. Further information can be found at: https://www.whatsapp.com/legal/privacy-policy",
        'You have the rights granted under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, and object to the processing of your personal data.'
      ]
    },
    ja: {
      title: 'プライバシー',
      paragraphs: [
        'Data Processing for Orders',
        'When you place an order through our website, we collect the information you provide (such as your name, telephone number, and optionally your email address) solely for the purpose of processing your order.',
        'The information entered into the order form is not stored in a separate customer database on our website. Instead, the order details are transmitted directly to us via WhatsApp so that we can verify and process your order.',
        'The data is used exclusively for order processing and customer communication relating to your order. We do not use your data for marketing purposes and do not sell or share it with third parties except where necessary for order processing.',
        "Please note that when you send an order via WhatsApp, your data is also processed by WhatsApp Ireland Limited and its affiliated companies in accordance with WhatsApp's own privacy policy. Further information can be found at: https://www.whatsapp.com/legal/privacy-policy",
        'You have the rights granted under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, and object to the processing of your personal data.'
      ]
    },
    tr: {
      title: 'Gizlilik',
      paragraphs: [
        'Data Processing for Orders',
        'When you place an order through our website, we collect the information you provide (such as your name, telephone number, and optionally your email address) solely for the purpose of processing your order.',
        'The information entered into the order form is not stored in a separate customer database on our website. Instead, the order details are transmitted directly to us via WhatsApp so that we can verify and process your order.',
        'The data is used exclusively for order processing and customer communication relating to your order. We do not use your data for marketing purposes and do not sell or share it with third parties except where necessary for order processing.',
        "Please note that when you send an order via WhatsApp, your data is also processed by WhatsApp Ireland Limited and its affiliated companies in accordance with WhatsApp's own privacy policy. Further information can be found at: https://www.whatsapp.com/legal/privacy-policy",
        'You have the rights granted under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, and object to the processing of your personal data.'
      ]
    }
  },
  streitbeilegung: {
    de: {
      title: 'Verbraucherstreitbeilegung',
      paragraphs: [
        'Hinweis nach § 36 VSBG: Demo Sushi House ist derzeit nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        'Hinweis zur EU-OS-Plattform: Die europäische Online-Streitbeilegungsplattform wurde am 20. Juli 2025 eingestellt.'
      ]
    },
    en: {
      title: 'Consumer dispute resolution',
      paragraphs: [
        'Notice under Section 36 VSBG: Demo Sushi House is currently neither willing nor obliged to participate in dispute resolution before a consumer arbitration board.',
        'EU ODR platform notice: the European Online Dispute Resolution platform was discontinued on July 20, 2025.'
      ]
    },
    ru: {
      title: 'Разрешение потребительских споров',
      paragraphs: [
        'Согласно §36 VSBG, Demo Sushi House в настоящее время не обязана и не готова участвовать в процедурах урегулирования споров через потребительскую арбитражную организацию.',
        'Платформа ЕС ODR была закрыта 20 июля 2025 года.'
      ]
    },
    ja: {
      title: '消費者紛争解決',
      paragraphs: [
        'VSBG第36条に基づき、Demo Sushi Houseは現在、消費者仲裁機関での紛争解決手続きに参加する意思および義務はありません。',
        'EUのODRプラットフォームは2025年7月20日に終了しました。'
      ]
    },
    tr: {
      title: 'Tüketici uyuşmazlık çözümü',
      paragraphs: [
        '§36 VSBG uyarınca Demo Sushi House, tüketici hakem heyeti önündeki uyuşmazlık çözüm süreçlerine katılmaya hazır veya yükümlü değildir.',
        'AB Çevrim içi Uyuşmazlık Çözüm (ODR) platformu 20 Temmuz 2025 tarihinde kapatılmıştır.'
      ]
    }
  }
};

const state = {
  filter: 'all',
  search: '',
  cart: loadCart(),
  language: 'de',
  theme: 'dark',
  activeLegalKey: null,
  appliedVoucher: null,
  openingHours: {}
};

const THEME_STORAGE_KEY = 'bagoTheme';
const PENDING_PAYPAL_ORDER_KEY = 'bagoPendingPaypalOrder';
const LAST_SHARED_PAYPAL_TX_KEY = 'bagoLastSharedPaypalTx';
const WHATSAPP_CONFIRMATION_KEY = 'bagoWhatsappConfirmation';
const BAGO_PRIVATE = window.BAGO_PRIVATE && typeof window.BAGO_PRIVATE === 'object' ? window.BAGO_PRIVATE : {};
const BAGO_API = window.BagoApi || {};

const DEFAULT_VENUE_CONFIG = {
  name: 'Demo Sushi House',
  heroImage: 'assets/hero-table.png',
  address: 'Sample Street 12, 12345 Demo City',
  pickupLat: 48.76340717227785,
  pickupLng: 11.42234503860289,
  orderMinimum: 12,
  preparationTime: '25-35 Min',
  serviceFeePercent: 0,
  serviceFeeMin: 0,
  serviceFeeMax: 0,
  whatsappNumber: '+491234567890',
  paypalEnabled: false,
  paypalEmail: ''
};
const LEGACY_VENUE_CONFIG = typeof BAGO_VENUE !== 'undefined' ? BAGO_VENUE : {};
const mergedVenueConfig = {
  ...DEFAULT_VENUE_CONFIG,
  ...LEGACY_VENUE_CONFIG,
  ...(window.BAGO_VENUE || {}),
  ...((BAGO_PRIVATE.venue && typeof BAGO_PRIVATE.venue === 'object' ? BAGO_PRIVATE.venue : {}))
};
if (!mergedVenueConfig.preparationTime && mergedVenueConfig.deliveryTime) {
  mergedVenueConfig.preparationTime = mergedVenueConfig.deliveryTime;
}
const VENUE_CONFIG = mergedVenueConfig;

const STATIC_CATEGORIES = typeof BAGO_CATEGORIES !== 'undefined' && Array.isArray(BAGO_CATEGORIES) ? BAGO_CATEGORIES : [];
const STATIC_MOST_ORDERED = typeof BAGO_MOST_ORDERED !== 'undefined' && Array.isArray(BAGO_MOST_ORDERED) ? BAGO_MOST_ORDERED : [];
const BAGO_BIZ = window.BagoBusiness || {};
const CAMPAIGN_VOUCHER_MINIMUMS = {
  DEUTSCHLAND5: 45,
  DE5: 45
};
const OPENING_HOURS_DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_LABEL_KEYS = {
  0: 'daySunday',
  1: 'dayMonday',
  2: 'dayTuesday',
  3: 'dayWednesday',
  4: 'dayThursday',
  5: 'dayFriday',
  6: 'daySaturday'
};

const menuTextCache = new Map();
let money = buildMoneyFormatter(state.language);

const categoryTabs = document.querySelector('#categoryTabs');
const categoryScrollLeft = document.querySelector('#categoryScrollLeft');
const categoryScrollRight = document.querySelector('#categoryScrollRight');
const menuSections = document.querySelector('#menuSections');
const popularGrid = document.querySelector('#popularGrid');
const menuSearch = document.querySelector('#menuSearch');
const menuCount = document.querySelector('#menuCount');
const heroItemCount = document.querySelector('#heroItemCount');
const heroImage = document.querySelector('#heroImage');
const heroMinimumValue = document.querySelector('#heroMinimumValue');
const mapsLink = document.querySelector('#mapsLink');
const hoursList = document.querySelector('#hoursList');
const hoursStatusLine = document.querySelector('#hoursStatusLine');

const cartPanel = document.querySelector('#cartPanel');
const cartBackdrop = document.querySelector('#cartBackdrop');
const cartToggle = document.querySelector('#cartToggle');
const floatingCartReminder = document.querySelector('#floatingCartReminder');
const floatingCartCount = document.querySelector('#floatingCartCount');
const closeCart = document.querySelector('#closeCart');
const jumpCart = document.querySelector('#jumpCart');
const cancelOrderButton = document.querySelector('#cancelOrder');

const cartItems = document.querySelector('#cartItems');
const emptyCart = document.querySelector('#emptyCart');
const cartCount = document.querySelector('#cartCount');
const subtotalEl = document.querySelector('#subtotal');
const serviceFeeEl = document.querySelector('#serviceFee');
const voucherTotalRow = document.querySelector('#voucherTotalRow');
const voucherDiscountEl = document.querySelector('#voucherDiscount');
const minimumRow = document.querySelector('#minimumRow');
const minimumGapEl = document.querySelector('#minimumGap');
const totalEl = document.querySelector('#total');

const checkoutButton = document.querySelector('#checkoutButton');
const checkoutForm = document.querySelector('#checkoutForm');
const paymentMethods = document.querySelector('#paymentMethods');
const paymentPaypalOption = document.querySelector('#paymentPaypalOption');
const paymentPaypalInput = checkoutForm.querySelector('input[name="payment"][value="paypal"]');
const paymentCashInput = checkoutForm.querySelector('input[name="payment"][value="cash"]');
const fulfillmentMethods = document.querySelector('#fulfillmentMethods');
const formStatus = document.querySelector('#formStatus');
const nameInput = checkoutForm.elements.name;
const phoneInput = checkoutForm.elements.phone;
const emailInput = checkoutForm.elements.email;
const scheduledDateInput = checkoutForm.elements.scheduled_date;
const scheduledTimeInput = checkoutForm.elements.scheduled_time;
const scheduledAtField = document.querySelector('#scheduledAtField');
const scheduleHelp = document.querySelector('#scheduleHelp');
const fulfillmentAsapLabel = document.querySelector('#fulfillmentAsapLabel');
const fulfillmentScheduledLabel = document.querySelector('#fulfillmentScheduledLabel');
const voucherCodeInput = document.querySelector('#voucherCode');
const applyVoucherButton = document.querySelector('#applyVoucher');
const voucherStatus = document.querySelector('#voucherStatus');

const languageToggle = document.querySelector('#languageToggle');
const languageMenu = document.querySelector('#languageMenu');
const languageLabel = document.querySelector('#languageLabel');
const themeToggle = document.querySelector('#themeToggle');
const themeIcon = document.querySelector('#themeIcon');

const legalModal = document.querySelector('#legalModal');
const legalModalTitle = document.querySelector('#legalModalTitle');
const legalModalContent = document.querySelector('#legalModalContent');
const legalModalClose = document.querySelector('#legalModalClose');
const legalModalCancel = document.querySelector('#legalModalCancel');
const whatsappConfirmModal = document.querySelector('#whatsappConfirmModal');
const whatsappConfirmYes = document.querySelector('#whatsappConfirmYes');
const whatsappConfirmNo = document.querySelector('#whatsappConfirmNo');

function buildMoneyFormatter(language) {
  return new Intl.NumberFormat(LANGUAGE_LOCALES[language] || 'de-DE', {
    style: 'currency',
    currency: 'EUR'
  });
}

function t(key) {
  return TRANSLATIONS[state.language]?.[key] || TRANSLATIONS.de[key] || key;
}

function formatT(key, values = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, token) => (values[token] == null ? '' : values[token]));
}

function parseFeatureFlag(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  const normalized = String(value || '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalized);
}

function isPayPalEnabled() {
  return parseFeatureFlag(VENUE_CONFIG.paypalEnabled);
}

function normalizePhoneValue(value) {
  if (typeof BAGO_BIZ.normalizePhone === 'function') {
    return BAGO_BIZ.normalizePhone(value);
  }
  return String(value || '')
    .replace(/[^\d+]/g, '')
    .replace(/\++/g, '+')
    .trim();
}

function normalizeEmailValue(value) {
  if (typeof BAGO_BIZ.normalizeEmail === 'function') {
    return BAGO_BIZ.normalizeEmail(value);
  }
  return String(value || '').trim().toLowerCase();
}

function normalizeVoucherCodeValue(value) {
  if (typeof BAGO_BIZ.normalizeVoucherCode === 'function') {
    return BAGO_BIZ.normalizeVoucherCode(value);
  }
  return String(value || '').trim().toUpperCase();
}

function getVoucherMinimumValue(code, rawMinimum) {
  const parsedMinimum = Math.max(0, Number.parseFloat(rawMinimum) || 0);
  const fallbackMinimum = CAMPAIGN_VOUCHER_MINIMUMS[normalizeVoucherCodeValue(code)] || 0;
  return Math.max(parsedMinimum, fallbackMinimum);
}

function validateVoucherRowValue(row, options = {}) {
  if (typeof BAGO_BIZ.validateVoucherRow === 'function') {
    return BAGO_BIZ.validateVoucherRow(row, options);
  }
  if (!row) return { ok: false, error: 'not_found' };
  if (row.active === false) return { ok: false, error: 'inactive' };
  const usageLimit = Math.max(1, Number.parseInt(row.usage_limit, 10) || 1);
  const timesUsed = Math.max(0, Number.parseInt(row.times_used, 10) || 0);
  const minimumOrderValue = getVoucherMinimumValue(row.code, row.min_order_value);
  const rawOrderValue = Number.parseFloat(options.orderValue);
  const hasOrderValue = Number.isFinite(rawOrderValue);
  const orderValue = hasOrderValue ? Math.max(0, rawOrderValue) : 0;
  if (timesUsed >= usageLimit) return { ok: false, error: 'usage_limit_reached' };
  if (hasOrderValue && orderValue + 0.000001 < minimumOrderValue) {
    return {
      ok: false,
      error: 'minimum_not_reached',
      minimumOrderValue,
      orderValue
    };
  }
  return {
    ok: true,
    error: '',
    voucher: {
      id: row.id,
      code: normalizeVoucherCodeValue(row.code),
      discountAmount: Number.parseFloat(row.discount_amount) || 0,
      minimumOrderValue,
      usageLimit,
      timesUsed
    }
  };
}

function getVoucherOrderValue() {
  const subtotal = Object.entries(state.cart).reduce((sum, [id, quantity]) => {
    const item = itemById.get(id);
    const qty = Math.max(0, Number.parseInt(quantity, 10) || 0);
    const price = Number.parseFloat(item?.price) || 0;
    return sum + qty * price;
  }, 0);
  return Math.round(subtotal * 100) / 100;
}

function createSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeMatchKey(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function looksLikeUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || '').trim()
  );
}

function listHintValues(hint) {
  if (!hint) return [];
  if (typeof hint === 'string') return [hint];
  if (typeof hint !== 'object') return [];

  return [hint.id, hint.fallbackId, hint.name, hint.title]
    .filter((value) => value != null && String(value).trim())
    .map((value) => String(value).trim());
}

function itemBaseName(item) {
  return pickTranslation(item.nameTranslations, item.name || '');
}

function resolvePopularIds(visibleItems) {
  const resolved = [];
  const availableIds = new Set(visibleItems.map((item) => item.id));
  const normalizedItemNames = visibleItems.map((item) => ({
    id: item.id,
    normalized: normalizeMatchKey(itemBaseName(item))
  }));

  visibleItems.forEach((item) => {
    if (resolved.length >= 8) return;
    if (item.isPopular === true && !resolved.includes(item.id)) {
      resolved.push(item.id);
    }
  });

  if (resolved.length < 8 && STATIC_MOST_ORDERED.length) {
    STATIC_MOST_ORDERED.forEach((hint) => {
      if (resolved.length >= 8) return;
      const values = listHintValues(hint);
      let selectedId = '';

      for (const value of values) {
        if (looksLikeUuid(value) && availableIds.has(value)) {
          selectedId = value;
          break;
        }
      }

      if (!selectedId) {
        for (const value of values) {
          const normalizedValue = normalizeMatchKey(value);
          if (!normalizedValue) continue;

          const exactMatch = normalizedItemNames.find((entry) => entry.normalized === normalizedValue);
          if (exactMatch) {
            selectedId = exactMatch.id;
            break;
          }

          const looseMatch = normalizedItemNames.find(
            (entry) =>
              entry.normalized &&
              (entry.normalized.includes(normalizedValue) || normalizedValue.includes(entry.normalized))
          );
          if (looseMatch) {
            selectedId = looseMatch.id;
            break;
          }
        }
      }

      if (selectedId && !resolved.includes(selectedId)) {
        resolved.push(selectedId);
      }
    });
  }

  if (resolved.length < 8) {
    const withImages = visibleItems.filter((item) => item.image).map((item) => item.id);
    const seed = withImages.length >= 8 ? withImages : [...withImages, ...visibleItems.map((item) => item.id)];
    seed.forEach((id) => {
      if (resolved.length >= 8) return;
      if (!resolved.includes(id)) resolved.push(id);
    });
  }

  return resolved.slice(0, 8);
}

function buildPickupMapsUrl() {
  const lat = Number(VENUE_CONFIG.pickupLat);
  const lng = Number(VENUE_CONFIG.pickupLng);
  const query =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `${lat},${lng}`
      : String(VENUE_CONFIG.address || 'Sample Street 12, 12345 Demo City');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function normalizeTimeText(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '';
  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  if (!Number.isFinite(hour) || !Number.isFinite(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return '';
  }
  return `${pad2(hour)}:${pad2(minute)}`;
}

function getDefaultOpeningHours() {
  return {
    0: { dayOfWeek: 0, isClosed: true, opensAt: '', closesAt: '' },
    1: { dayOfWeek: 1, isClosed: false, opensAt: '11:30', closesAt: '20:00' },
    2: { dayOfWeek: 2, isClosed: false, opensAt: '11:30', closesAt: '20:00' },
    3: { dayOfWeek: 3, isClosed: false, opensAt: '11:30', closesAt: '20:00' },
    4: { dayOfWeek: 4, isClosed: false, opensAt: '11:30', closesAt: '20:00' },
    5: { dayOfWeek: 5, isClosed: false, opensAt: '11:30', closesAt: '20:00' },
    6: { dayOfWeek: 6, isClosed: false, opensAt: '13:00', closesAt: '20:00' }
  };
}

function coerceDayOfWeek(value) {
  const day = Number.parseInt(value, 10);
  if (!Number.isFinite(day) || day < 0 || day > 6) return null;
  return day;
}

function mergeOpeningHoursRows(rows) {
  const merged = getDefaultOpeningHours();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const day = coerceDayOfWeek(row?.day_of_week);
    if (day == null) return;
    const opensAt = normalizeTimeText(row?.opens_at);
    const closesAt = normalizeTimeText(row?.closes_at);
    const isClosed = row?.is_closed === true || !opensAt || !closesAt || closesAt <= opensAt;
    merged[day] = {
      dayOfWeek: day,
      isClosed,
      opensAt: isClosed ? '' : opensAt,
      closesAt: isClosed ? '' : closesAt
    };
  });
  return merged;
}

function getOpeningHoursForDay(dayOfWeek) {
  const day = coerceDayOfWeek(dayOfWeek);
  if (day == null) return null;
  return state.openingHours?.[day] || getDefaultOpeningHours()[day];
}

function timeToMinutes(timeText) {
  const normalized = normalizeTimeText(timeText);
  if (!normalized) return null;
  const [hourText, minuteText] = normalized.split(':');
  return Number.parseInt(hourText, 10) * 60 + Number.parseInt(minuteText, 10);
}

function isDateWithinOpeningHours(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  const entry = getOpeningHoursForDay(date.getDay());
  if (!entry || entry.isClosed) return false;

  const openMinutes = timeToMinutes(entry.opensAt);
  const closeMinutes = timeToMinutes(entry.closesAt);
  if (openMinutes == null || closeMinutes == null || closeMinutes <= openMinutes) return false;

  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= openMinutes && minutes < closeMinutes;
}

function isRestaurantOpenNow() {
  return isDateWithinOpeningHours(new Date());
}

function formatOpeningWindow(entry) {
  if (!entry || entry.isClosed) {
    return t('closedLabel');
  }
  return `${entry.opensAt}-${entry.closesAt}`;
}

function formatDateTimeLocalValue(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}T${pad2(value.getHours())}:${pad2(
    value.getMinutes()
  )}`;
}

function parseDateTimeLocalValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatDateInputValue(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
}

function formatTimeInputValue(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  return `${pad2(value.getHours())}:${pad2(value.getMinutes())}`;
}

function parseDateInputValue(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10) - 1;
  const day = Number.parseInt(match[3], 10);
  const parsed = new Date(year, month, day, 0, 0, 0, 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseScheduledDateTimeFromInputs() {
  if (!scheduledDateInput || !scheduledTimeInput) return null;
  const datePart = parseDateInputValue(scheduledDateInput.value);
  const timePart = normalizeTimeText(scheduledTimeInput.value);
  if (!datePart || !timePart) return null;
  const [hourText, minuteText] = timePart.split(':');
  const combined = new Date(datePart);
  combined.setHours(Number.parseInt(hourText, 10), Number.parseInt(minuteText, 10), 0, 0);
  return combined;
}

function setScheduledDateTimeInputs(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime()) || !scheduledDateInput || !scheduledTimeInput) return;
  scheduledDateInput.value = formatDateInputValue(date);
  scheduledTimeInput.value = formatTimeInputValue(date);
}

function findNextAvailableScheduleDate(startDate = new Date()) {
  const base = new Date(startDate);
  base.setSeconds(0, 0);
  base.setMinutes(Math.ceil(base.getMinutes() / 15) * 15);
  if (base <= startDate) {
    base.setMinutes(base.getMinutes() + 15);
  }

  for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
    const probe = new Date(base);
    probe.setDate(base.getDate() + dayOffset);
    const entry = getOpeningHoursForDay(probe.getDay());
    if (!entry || entry.isClosed) continue;

    const openMinutes = timeToMinutes(entry.opensAt);
    const closeMinutes = timeToMinutes(entry.closesAt);
    if (openMinutes == null || closeMinutes == null || closeMinutes <= openMinutes) continue;

    const openDate = new Date(probe);
    openDate.setHours(Math.floor(openMinutes / 60), openMinutes % 60, 0, 0);
    const closeDate = new Date(probe);
    closeDate.setHours(Math.floor(closeMinutes / 60), closeMinutes % 60, 0, 0);

    let candidate = dayOffset === 0 ? new Date(base) : new Date(openDate);
    if (candidate < openDate) {
      candidate = new Date(openDate);
    }
    if (candidate >= closeDate) {
      continue;
    }
    return candidate;
  }

  return null;
}

function formatScheduledDateTime(date) {
  const formatter = new Intl.DateTimeFormat(LANGUAGE_LOCALES[state.language] || 'de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return formatter.format(date);
}

function getSelectedFulfillment() {
  return checkoutForm.elements.fulfillment?.value || 'asap';
}

function renderOpeningHoursCard() {
  if (!hoursList) return;
  hoursList.innerHTML = OPENING_HOURS_DISPLAY_ORDER.map((dayOfWeek) => {
    const label = t(DAY_LABEL_KEYS[dayOfWeek] || 'dayMonday');
    const entry = getOpeningHoursForDay(dayOfWeek);
    return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(formatOpeningWindow(entry))}</dd></div>`;
  }).join('');

  if (hoursStatusLine) {
    const openNow = isRestaurantOpenNow();
    hoursStatusLine.textContent = openNow ? t('hoursOpenNow') : t('hoursClosedNow');
    hoursStatusLine.classList.toggle('is-closed', !openNow);
  }
}

function refreshScheduleInputMinValue() {
  if (!scheduledDateInput) return;
  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() + 5);
  minDate.setSeconds(0, 0);
  scheduledDateInput.min = formatDateInputValue(minDate);
}

function syncFulfillmentControls() {
  if (!checkoutForm || !fulfillmentMethods) return;

  const asapInput = checkoutForm.querySelector('input[name="fulfillment"][value="asap"]');
  const scheduledInput = checkoutForm.querySelector('input[name="fulfillment"][value="scheduled"]');
  if (!asapInput || !scheduledInput) return;

  const openNow = isRestaurantOpenNow();

  if (openNow) {
    asapInput.disabled = false;
    fulfillmentAsapLabel?.classList.remove('is-disabled');
    if (!asapInput.checked && !scheduledInput.checked) {
      asapInput.checked = true;
    }
  } else {
    asapInput.checked = false;
    asapInput.disabled = true;
    scheduledInput.checked = true;
    fulfillmentAsapLabel?.classList.add('is-disabled');
  }

  const scheduledMode = scheduledInput.checked;
  if (scheduledAtField) {
    scheduledAtField.classList.toggle('is-hidden', !scheduledMode);
  }
  if (scheduledDateInput) {
    scheduledDateInput.required = scheduledMode;
  }
  if (scheduledTimeInput) {
    scheduledTimeInput.required = scheduledMode;
  }

  refreshScheduleInputMinValue();
  if (scheduledMode && (!scheduledDateInput?.value || !scheduledTimeInput?.value)) {
    const nextSlot = findNextAvailableScheduleDate(new Date());
    if (nextSlot) {
      setScheduledDateTimeInputs(nextSlot);
    }
  }

  if (scheduleHelp) {
    if (!openNow) {
      scheduleHelp.textContent = t('scheduleHelpClosed');
    } else if (scheduledMode) {
      scheduleHelp.textContent = t('scheduleHelpLater');
    } else {
      scheduleHelp.textContent = t('scheduleHelpOpen');
    }
  }
}

function syncPaymentControls() {
  const paypalAvailable = isPayPalEnabled();

  if (paymentPaypalOption) {
    paymentPaypalOption.hidden = !paypalAvailable;
  }

  if (paymentPaypalInput) {
    paymentPaypalInput.disabled = !paypalAvailable;
    if (!paypalAvailable) {
      paymentPaypalInput.checked = false;
    }
  }

  if (paymentCashInput) {
    if (!paymentCashInput.checked || !paypalAvailable) {
      paymentCashInput.checked = true;
    }
  }
}

function updateCategoryScrollButtons() {
  if (!categoryTabs || !categoryScrollLeft || !categoryScrollRight) return;
  const maxScrollLeft = categoryTabs.scrollWidth - categoryTabs.clientWidth;
  const canScroll = maxScrollLeft > 4;

  categoryScrollLeft.hidden = !canScroll;
  categoryScrollRight.hidden = !canScroll;
  categoryScrollLeft.disabled = !canScroll || categoryTabs.scrollLeft <= 4;
  categoryScrollRight.disabled = !canScroll || categoryTabs.scrollLeft >= maxScrollLeft - 4;
}

function scrollCategoryTabs(direction) {
  if (!categoryTabs) return;
  const amount = Math.max(140, Math.round(categoryTabs.clientWidth * 0.7));
  categoryTabs.scrollBy({ left: direction * amount, behavior: 'smooth' });
}

function parseJsonObject(value) {
  if (!value) return null;
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeTranslationMap(raw) {
  if (!raw || typeof raw !== 'object') return {};
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([key, value]) => key && value != null && String(value).trim())
      .map(([key, value]) => [key.toLowerCase(), String(value).trim()])
  );
}

function extractTranslations(row, prefix) {
  const prefixed = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    if (!key.startsWith(`${prefix}_`)) return;
    if (key === `${prefix}_translations`) return;
    const lang = key.slice(prefix.length + 1).toLowerCase();
    if (!lang || value == null || String(value).trim() === '') return;
    prefixed[lang] = String(value).trim();
  });

  const nested = normalizeTranslationMap(parseJsonObject(row?.[`${prefix}_translations`]));
  return {
    ...nested,
    ...prefixed
  };
}

function pickTranslation(translations, fallback = '') {
  if (!translations || typeof translations !== 'object') return fallback;
  const preferred =
    translations[state.language] ||
    translations.de ||
    translations.en ||
    translations.ru ||
    translations.ja ||
    translations.tr;
  if (preferred) return preferred;
  const firstValue = Object.values(translations).find((value) => value && String(value).trim());
  return firstValue || fallback;
}

function normalizeImageUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw;
}

function sortMenuRows(rows) {
  return [...rows].sort((a, b) => {
    const categoryA = String(a.category || '').toLowerCase();
    const categoryB = String(b.category || '').toLowerCase();
    if (categoryA !== categoryB) return categoryA.localeCompare(categoryB);

    const nameA = String(a.name_de || a.name_en || a.name || '').toLowerCase();
    const nameB = String(b.name_de || b.name_en || b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

function buildCategoriesFromRows(rows) {
  const grouped = new Map();

  sortMenuRows(rows).forEach((row) => {
    const categoryName = String(row.category || row.category_de || row.category_en || 'Menu').trim() || 'Menu';
    const key = categoryName.toLowerCase();

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: createSlug(categoryName) || `category-${grouped.size + 1}`,
        name: categoryName,
        description: '',
        items: []
      });
    }

    const rowNameTranslations = extractTranslations(row, 'name');
    if (!rowNameTranslations.de && row.name) {
      rowNameTranslations.de = String(row.name).trim();
    }
    const rowDescriptionTranslations = extractTranslations(row, 'description');
    if (!rowDescriptionTranslations.de && row.description) {
      rowDescriptionTranslations.de = String(row.description).trim();
    }

    const defaultName = pickTranslation(rowNameTranslations, 'Menu item');
    const defaultDescription = pickTranslation(rowDescriptionTranslations, '');
    const price = Number.parseFloat(row.price);

    const bucket = grouped.get(key);
   bucket.items.push({
  id: String(row.id || `${key}-${bucket.items.length + 1}`),
  name: defaultName,
  description: defaultDescription,
  nameTranslations: rowNameTranslations,
  descriptionTranslations: rowDescriptionTranslations,
  price: Number.isFinite(price) ? price : 0,
  image: normalizeImageUrl(row.image_url || row.image || row.imageUrl || ''),
  available: row.available !== false,
  isPopular: row.is_popular === true || row.is_popular === 1 || row.is_popular === 'true'
});
  });

  return [...grouped.values()];
}

function refreshMenuIndexes(categories) {
  orderedCategories = categories.map((category) => ({
    ...category,
    items: (category.items || []).map((item) => ({
      ...item,
      image: normalizeImageUrl(item.image || item.image_url || item.imageUrl || ''),
      categoryId: category.id,
      categoryName: category.name
    }))
  }));

  menuItems = orderedCategories.flatMap((category) => category.items);
  itemById = new Map(menuItems.map((item) => [item.id, item]));

  const visibleItems = menuItems.filter((item) => item.available !== false);
  popularIds = resolvePopularIds(visibleItems);

  state.cart = loadCart();
  if (state.filter !== 'all' && !orderedCategories.some((category) => category.id === state.filter)) {
    state.filter = 'all';
  }
}

async function loadRuntimeConfig() {
  if (typeof BAGO_API.getConfig !== 'function') return;
  try {
    const config = await BAGO_API.getConfig();
    if (config?.venue && typeof config.venue === 'object') {
      Object.assign(VENUE_CONFIG, Object.fromEntries(Object.entries(config.venue).filter(([, value]) => value !== '')));
    }
  } catch (error) {
    console.error('Runtime config failed:', error);
  }
}

async function fetchMenuFromApi() {
  if (typeof BAGO_API.getMenuItems !== 'function') return null;
  try {
    const { data } = await BAGO_API.getMenuItems();
    return Array.isArray(data) && data.length ? buildCategoriesFromRows(data) : [];
  } catch (error) {
    console.error('Menu fetch failed:', error);
    return null;
  }
}

async function fetchOpeningHoursFromApi() {
  if (typeof BAGO_API.getOpeningHours !== 'function') return null;
  try {
    const { data } = await BAGO_API.getOpeningHours();
    return mergeOpeningHoursRows(data);
  } catch (error) {
    console.error('Opening hours fetch failed:', error);
    return null;
  }
}

async function initializeOpeningHours() {
  const remoteHours = await fetchOpeningHoursFromApi();
  state.openingHours = remoteHours || getDefaultOpeningHours();
}

async function initializeMenuData() {
  menuSections.innerHTML = `<p class="empty-cart">${escapeHtml(t('loadingMenu'))}</p>`;

  const remoteCategories = await fetchMenuFromApi();
  const hasRemoteData = Array.isArray(remoteCategories) && remoteCategories.length > 0;
  const fallbackAllowed = typeof BAGO_API.getMenuItems !== 'function';
  const fallbackCategories = fallbackAllowed ? STATIC_CATEGORIES : [];
  const chosenCategories = hasRemoteData ? remoteCategories : fallbackCategories;

  if (!chosenCategories.length) {
    orderedCategories = [];
    menuItems = [];
    itemById = new Map();
    popularIds = [];
    menuSections.innerHTML = `<p class="empty-cart">${escapeHtml(t('menuUnavailable'))}</p>`;
    return;
  }

  refreshMenuIndexes(chosenCategories);
}

function loadCart() {
  const saved = JSON.parse(localStorage.getItem('bagoCart') || '{}');
  return Object.fromEntries(
    Object.entries(saved).filter(([id, quantity]) => {
      const item = itemById.get(id);
      return Boolean(item) && item.available !== false && quantity > 0;
    })
  );
}

function saveCart() {
  localStorage.setItem('bagoCart', JSON.stringify(state.cart));
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function translateMenuText(text, language) {
  if (!text) return '';
  if (language === 'de') return text;

  const cacheKey = `${language}::${text}`;
  if (menuTextCache.has(cacheKey)) return menuTextCache.get(cacheKey);

  let translated = text;
  const rules = MENU_TEXT_RULES[language] || [];
  rules.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });

  menuTextCache.set(cacheKey, translated);
  return translated;
}

function getCategoryDisplayName(categoryName) {
  const mapped = CATEGORY_NAME_TRANSLATIONS[categoryName]?.[state.language];
  if (mapped) return mapped;
  return translateMenuText(categoryName, state.language);
}

function getItemDisplayName(item) {
  const baseName = pickTranslation(item.nameTranslations, item.name);
  return translateMenuText(baseName, state.language);
}

function itemDescription(item) {
  const base = pickTranslation(item.descriptionTranslations, item.description || t('itemDescriptionFallback'));
  return translateMenuText(base, state.language);
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

  languageLabel.textContent = LANGUAGE_NAMES[state.language] || 'DE';
  languageMenu.querySelectorAll('[data-language]').forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-checked', String(active));
  });
  if (floatingCartReminder) {
    floatingCartReminder.setAttribute('aria-label', t('floatingCartAria'));
  }
  updateThemeToggleLabel();

  if (heroMinimumValue) {
    heroMinimumValue.textContent = money.format(VENUE_CONFIG.orderMinimum || 0);
  }
  const prepTimeNode = document.querySelector('[data-i18n="heroStatPreparationTimeValue"]');
  if (prepTimeNode && VENUE_CONFIG.preparationTime) {
    prepTimeNode.textContent = VENUE_CONFIG.preparationTime;
  }
  renderOpeningHoursCard();
  syncFulfillmentControls();

  if (state.activeLegalKey) {
    renderLegalContent(state.activeLegalKey);
  }
}

function applyLanguage() {
  money = buildMoneyFormatter(state.language);
  applyStaticTranslations();
  if (state.appliedVoucher) {
    setVoucherStatusMessage(
      formatT('voucherApplied', {
        code: state.appliedVoucher.code,
        amount: money.format(state.appliedVoucher.discountAmount || 0)
      })
    );
  }
  renderCategoryTabs();
  renderOrderSurfaces();
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'dark';
}

function updateThemeToggleLabel() {
  if (!themeToggle || !themeIcon) return;
  const isDark = state.theme === 'dark';
  themeIcon.textContent = isDark ? '🌙' : '☀️';
  const label = isDark ? t('themeSwitchToLight') : t('themeSwitchToDark');
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
}

function applyTheme(theme) {
  const normalizedTheme = theme === 'light' ? 'light' : 'dark';
  state.theme = normalizedTheme;
  document.body.setAttribute('data-theme', normalizedTheme);
  updateThemeToggleLabel();
}

function toggleTheme() {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

function setupInspectGuard() {
  document.addEventListener('contextmenu', (event) => {
    // event.preventDefault();
  });

  document.addEventListener('keydown', (event) => {
    const key = String(event.key || '').toLowerCase();
    const blockedShortcut =
      event.key === 'F12' ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      (event.metaKey && event.altKey && ['i', 'j', 'c', 'u'].includes(key)) ||
      ((event.ctrlKey || event.metaKey) && key === 'u');

    if (blockedShortcut) {
      event.preventDefault();
    }
  });
}

function renderMedia(item) {
  if (!item.image) {
    return `
      <div class="food-media food-media-placeholder" aria-hidden="true">
        <div class="fallback-art">
          <span>${escapeHtml(getItemDisplayName(item).slice(0, 1) || 'B')}</span>
        </div>
      </div>
    `;
  }

  return `
      <div class="food-media">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(getItemDisplayName(item))}" loading="lazy" />
      </div>
    `;
}

function getQuantity(itemId) {
  return state.cart[itemId] || 0;
}

function renderStepper(item, label) {
  if (item.available === false) {
    return `<span class="sold-out-pill">${escapeHtml(t('soldOut'))}</span>`;
  }

  const quantity = getQuantity(item.id);

  if (!quantity) {
    return `<button class="add-button" type="button" data-add="${item.id}" aria-label="Add ${escapeHtml(label)}">+</button>`;
  }

  return `
    <div class="quantity-stepper" aria-label="${escapeHtml(label)} quantity">
      <button type="button" data-decrease="${item.id}" aria-label="Remove one ${escapeHtml(label)}">−</button>
      <span>${quantity}</span>
      <button type="button" data-increase="${item.id}" aria-label="Add one ${escapeHtml(label)}">+</button>
    </div>
  `;
}

function renderCategoryTabs() {
  const tabs = [
    `<button class="${state.filter === 'all' ? 'is-active' : ''}" type="button" data-filter="all">${escapeHtml(t('allLabel'))} ${menuItems.length}</button>`,
    ...orderedCategories.map((category) => {
      const count = category.items.length;
      return `
        <button class="${state.filter === category.id ? 'is-active' : ''}" type="button" data-filter="${category.id}">
          ${escapeHtml(getCategoryDisplayName(category.name))} ${count}
        </button>
      `;
    })
  ];

  categoryTabs.innerHTML = tabs.join('');
  requestAnimationFrame(updateCategoryScrollButtons);
}

function matchesSearch(item, category, query) {
  if (!query) return true;

  const translatedName = getItemDisplayName(item);
  const translatedDescription = itemDescription(item);
  const translatedCategory = getCategoryDisplayName(category.name);

  return [
    item.name,
    item.description,
    category.name,
    category.description,
    translatedName,
    translatedDescription,
    translatedCategory
  ]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

function renderMenuCard(item) {
  const hasMediaClass = item.image ? 'has-media' : '';
  const displayName = getItemDisplayName(item);
  const displayDescription = itemDescription(item);

  return `
    <article class="menu-card ${hasMediaClass}">
      ${renderMedia(item)}
      <div class="menu-card-body">
        <div class="menu-card-title">
          <h4>${escapeHtml(displayName)}</h4>
          <span class="price">${money.format(item.price)}</span>
        </div>
        <p>${escapeHtml(displayDescription)}</p>
        <div class="item-actions">
          <span>${escapeHtml(getCategoryDisplayName(item.categoryName))}</span>
          ${renderStepper(item, displayName)}
        </div>
      </div>
    </article>
  `;
}

function renderCompactMenuRow(item) {
  const displayName = getItemDisplayName(item);
  const description = itemDescription(item);

  return `
    <li class="compact-menu-row">
      <div class="compact-menu-copy">
        <h4>${escapeHtml(displayName)}</h4>
        <p>${escapeHtml(description)}</p>
      </div>
      <div class="compact-menu-actions">
        <span class="price">${money.format(item.price)}</span>
        ${renderStepper(item, displayName)}
      </div>
    </li>
  `;
}

function splitCategoryItems(items) {
  if (typeof BAGO_BIZ.splitItemsByImage === 'function') {
    return BAGO_BIZ.splitItemsByImage(items || []);
  }
  const withImage = (items || []).filter((item) => Boolean(item.image));
  const withoutImage = (items || []).filter((item) => !item.image);
  return { withImage, withoutImage };
}

function renderMenu() {
  const query = state.search.trim().toLowerCase();
  const categories = orderedCategories
    .filter((category) => state.filter === 'all' || state.filter === category.id)
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => matchesSearch(item, category, query))
    }))
    .filter((category) => category.items.length);

  if (!categories.length) {
    menuSections.innerHTML = `<p class="empty-cart">${escapeHtml(t('noMenuMatch'))}</p>`;
    return;
  }

  menuSections.innerHTML = categories
    .map((category) => {
      const countLabel = category.items.length === 1 ? t('itemSingle') : t('itemPlural');
      return `
        <section class="menu-category" id="${escapeHtml(category.id)}">
          <div class="category-heading">
            <div>
              <h3>${escapeHtml(getCategoryDisplayName(category.name))}</h3>
              ${category.description ? `<p>${escapeHtml(translateMenuText(category.description, state.language))}</p>` : ''}
            </div>
            <span>${category.items.length} ${escapeHtml(countLabel)}</span>
          </div>
          <div class="item-grid">${category.items.map(renderMenuCard).join('')}</div>
        </section>
      `;
    })
    .join('');
}

function renderPopular() {
  const popularItems = popularIds.map((id) => itemById.get(id)).filter(Boolean);

  popularGrid.innerHTML = popularItems
    .map((item) => {
      const hasMediaClass = item.image ? 'has-media' : '';
      const displayName = getItemDisplayName(item);
      return `
        <article class="popular-card ${hasMediaClass}">
          ${renderMedia(item)}
          <div class="popular-card-content">
            <div>
              <h3>${escapeHtml(displayName)}</h3>
              <p>${escapeHtml(itemDescription(item))}</p>
            </div>
            <div class="price-row">
              <span class="price">${money.format(item.price)}</span>
              ${renderStepper(item, displayName)}
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function getCartLines() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({ ...itemById.get(id), quantity }))
    .filter((item) => item.id && item.quantity > 0);
}

function getTotals() {
  const lines = getCartLines();
  const voucherDiscount = state.appliedVoucher?.discountAmount || 0;
  const voucherMinimum = Math.max(0, Number.parseFloat(state.appliedVoucher?.minimumOrderValue) || 0);

  if (typeof BAGO_BIZ.calculateTotals === 'function') {
    return BAGO_BIZ.calculateTotals({
      lines,
      orderMinimum: VENUE_CONFIG.orderMinimum,
      serviceFeePercent: VENUE_CONFIG.serviceFeePercent,
      serviceFeeMin: VENUE_CONFIG.serviceFeeMin,
      serviceFeeMax: VENUE_CONFIG.serviceFeeMax,
      voucherDiscount,
      voucherMinimum
    });
  }

  const subtotal = lines.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasItems = subtotal > 0;
  const rawService = subtotal * VENUE_CONFIG.serviceFeePercent;
  const service = hasItems
    ? Math.min(VENUE_CONFIG.serviceFeeMax, Math.max(VENUE_CONFIG.serviceFeeMin, rawService))
    : 0;
  const grossTotal = subtotal + service;
  const voucherQualified = subtotal + 0.000001 >= voucherMinimum;
  const safeVoucher = voucherQualified ? Math.min(grossTotal, Math.max(0, Number.parseFloat(voucherDiscount) || 0)) : 0;
  const minimumGap = Math.max(0, VENUE_CONFIG.orderMinimum - subtotal);

  return {
    subtotal,
    service,
    voucherDiscount: safeVoucher,
    minimumGap,
    total: Math.max(0, grossTotal - safeVoucher)
  };
}

function setFieldValidity(input, message) {
  if (!input) return;
  input.setCustomValidity(message);
  input.classList.toggle('has-error', checkoutForm.classList.contains('was-validated') && Boolean(message));
}

function validateName() {
  const value = nameInput.value.trim();
  const message = value.length >= 2 ? '' : t('nameValidation');
  setFieldValidity(nameInput, message);
  return !message;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  const digits = value.replace(/\D/g, '');
  let message = '';

  if (!value) {
    message = t('phoneValidationEmpty');
  } else if (!/^\+?[0-9\s().-]{7,20}$/.test(value) || digits.length < 8 || digits.length > 15) {
    message = t('phoneValidationInvalid');
  }

  setFieldValidity(phoneInput, message);
  return !message;
}

function validateEmail() {
  if (!emailInput) return true;
  const value = emailInput.value.trim();
  const message = !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : t('emailValidationInvalid');
  setFieldValidity(emailInput, message);
  return !message;
}

function validateScheduleSelection() {
  if (!scheduledDateInput || !scheduledTimeInput) return true;

  const openNow = isRestaurantOpenNow();
  const fulfillment = getSelectedFulfillment();
  let message = '';

  if (!openNow && fulfillment !== 'scheduled') {
    message = t('statusClosedScheduleRequired');
  } else if (fulfillment === 'scheduled') {
    const scheduledDate = parseScheduledDateTimeFromInputs();
    if (!scheduledDate) {
      message = t('scheduleValidationRequired');
    } else if (scheduledDate.getTime() <= Date.now()) {
      message = t('scheduleValidationFuture');
    } else if (!isDateWithinOpeningHours(scheduledDate)) {
      message = t('scheduleValidationWithinHours');
    }
  }

  setFieldValidity(scheduledDateInput, message);
  setFieldValidity(scheduledTimeInput, message);
  return !message;
}

function validateCheckoutFields() {
  const validators = [validateName, validatePhone, validateEmail, validateScheduleSelection];
  return validators.map((validate) => validate()).every(Boolean);
}

function getSelectedPayment() {
  if (!isPayPalEnabled()) return 'cash';
  const selected = String(checkoutForm.elements.payment?.value || '').toLowerCase();
  return selected === 'paypal' ? 'paypal' : 'cash';
}

function getWhatsAppBaseUrl() {
  const cleanPhone = String(VENUE_CONFIG.whatsappNumber || '').replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}`;
}

function openWhatsApp(url) {
  const popup = window.open(url, '_blank', 'noopener');
  if (!popup) {
    markWhatsappConfirmationAsLeftPage();
    window.location.href = url;
    return false;
  }
  return true;
}

function readPendingWhatsappConfirmation() {
  try {
    const raw = localStorage.getItem(WHATSAPP_CONFIRMATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const createdAt = Number(parsed.createdAt || 0);
    if (!Number.isFinite(createdAt) || Date.now() - createdAt > 1000 * 60 * 60 * 24) {
      localStorage.removeItem(WHATSAPP_CONFIRMATION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writePendingWhatsappConfirmation(payload) {
  localStorage.setItem(WHATSAPP_CONFIRMATION_KEY, JSON.stringify(payload));
}

function clearPendingWhatsappConfirmation() {
  localStorage.removeItem(WHATSAPP_CONFIRMATION_KEY);
}

function armWhatsappConfirmationPrompt(orderContext) {
  writePendingWhatsappConfirmation({
    orderNumber: orderContext?.orderNumber || null,
    orderId: orderContext?.orderId || null,
    createdAt: Date.now(),
    hasLeftPage: false
  });
}

function markWhatsappConfirmationAsLeftPage() {
  const pending = readPendingWhatsappConfirmation();
  if (!pending || pending.hasLeftPage) return;
  writePendingWhatsappConfirmation({
    ...pending,
    hasLeftPage: true
  });
}

function openWhatsappConfirmationModal() {
  if (!whatsappConfirmModal) return;
  whatsappConfirmModal.hidden = false;
  document.body.classList.add('legal-open');
}

function closeWhatsappConfirmationModal() {
  if (!whatsappConfirmModal) return;
  whatsappConfirmModal.hidden = true;
  document.body.classList.remove('legal-open');
}

function maybePromptWhatsappConfirmation() {
  const pending = readPendingWhatsappConfirmation();
  if (!pending || !pending.hasLeftPage || !whatsappConfirmModal || !whatsappConfirmModal.hidden) return;
  if (document.visibilityState !== 'visible') return;
  openWhatsappConfirmationModal();
}

function handleWhatsappConfirmationYes() {
  const pending = readPendingWhatsappConfirmation();
  if (pending?.orderId) {
    trackOrderEvent(pending.orderId, 'whatsapp_confirmation', {
      confirmed: true,
      orderNumber: pending.orderNumber || null
    });
  }
  clearPendingWhatsappConfirmation();
  closeWhatsappConfirmationModal();
  resetOrder();
  setCartOpen(true);
  formStatus.textContent = t('whatsappConfirmThanks');
}

function handleWhatsappConfirmationNo() {
  const pending = readPendingWhatsappConfirmation();
  if (pending?.orderId) {
    trackOrderEvent(pending.orderId, 'whatsapp_confirmation', {
      confirmed: false,
      orderNumber: pending.orderNumber || null
    });
  }
  clearPendingWhatsappConfirmation();
  closeWhatsappConfirmationModal();
  setCartOpen(true);
}

function clearPayPalReturnParams() {
  const url = new URL(window.location.href);
  ['paypal_success', 'paypal_cancel', 'tx', 'st', 'amt', 'cc', 'cm', 'item_number', 'item_name'].forEach((key) =>
    url.searchParams.delete(key)
  );
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, document.title, nextUrl);
}

function collectValidatedOrderContext() {
  checkoutForm.classList.add('was-validated');
  const totals = getTotals();
  const lines = getCartLines();

  if (!lines.length) {
    formStatus.textContent = t('statusAddItemFirst');
    return null;
  }

  if (totals.minimumGap > 0) {
    formStatus.textContent = formatT('statusMinimumGap', {
      minimum: money.format(VENUE_CONFIG.orderMinimum),
      gap: money.format(totals.minimumGap)
    });
    return null;
  }

  validateCheckoutFields();
  if (!checkoutForm.reportValidity()) {
    return null;
  }

  const typedVoucherCode = normalizeVoucherCodeValue(voucherCodeInput?.value || '');
  const appliedVoucherCode = state.appliedVoucher?.code || '';
  if (typedVoucherCode && typedVoucherCode !== appliedVoucherCode) {
    formStatus.textContent = t('statusVoucherRequired');
    return null;
  }

  const payment = getSelectedPayment();
  const paymentLabel = isPayPalEnabled()
    ? payment === 'cash'
      ? t('paymentCash')
      : t('paymentPaypal')
    : t('paymentShopOptions');
  const fulfillment = getSelectedFulfillment();
  if (!isRestaurantOpenNow() && fulfillment !== 'scheduled') {
    formStatus.textContent = t('statusClosedScheduleRequired');
    return null;
  }

  const scheduledDate = fulfillment === 'scheduled' ? parseScheduledDateTimeFromInputs() : null;
  if (fulfillment === 'scheduled' && !scheduledDate) {
    formStatus.textContent = t('scheduleValidationRequired');
    return null;
  }

  const scheduleLabel =
    fulfillment === 'scheduled' && scheduledDate
      ? formatT('waFulfillmentScheduled', { datetime: formatScheduledDateTime(scheduledDate) })
      : t('waFulfillmentNow');
  const orderNumber = Math.floor(1000 + Math.random() * 9000);

  return {
    orderNumber,
    payment,
    paymentLabel,
    lines,
    totals,
    customerName: nameInput.value.trim(),
    customerPhone: phoneInput.value.trim(),
    customerEmail: emailInput?.value.trim() || '',
    voucherCode: appliedVoucherCode,
    voucher: state.appliedVoucher,
    language: state.language,
    fulfillment,
    scheduleLabel,
    isScheduled: fulfillment === 'scheduled',
    scheduledForIso: scheduledDate ? scheduledDate.toISOString() : null
  };
}

function resolveVoucherErrorMessage(errorCode, details = {}) {
  if (errorCode === 'minimum_not_reached') {
    const minimum = Number.parseFloat(details.minimumOrderValue);
    const orderValue = Number.parseFloat(details.orderValue);
    const safeMinimum = Number.isFinite(minimum) ? Math.max(0, minimum) : 0;
    const safeOrderValue = Number.isFinite(orderValue) ? Math.max(0, orderValue) : getVoucherOrderValue();
    const gap = Math.max(0, safeMinimum - safeOrderValue);
    return formatT('voucherMinimumNotReached', {
      minimum: money.format(safeMinimum),
      gap: money.format(gap)
    });
  }
  if (errorCode === 'inactive') return t('voucherInactive');
  if (errorCode === 'usage_limit_reached' || errorCode === 'limit_reached') return t('voucherLimitReached');
  if (errorCode === 'not_found') return t('voucherInvalid');
  return t('voucherApplyFailed');
}

function setVoucherStatusMessage(message, isError = false) {
  if (!voucherStatus) return;
  voucherStatus.textContent = message || '';
  voucherStatus.classList.toggle('is-error', Boolean(message) && isError);
}

function clearAppliedVoucher() {
  state.appliedVoucher = null;
  if (voucherCodeInput && !voucherCodeInput.value.trim()) {
    setVoucherStatusMessage('');
  }
}

async function fetchVoucherForCode(voucherCode) {
  if (typeof BAGO_API.validateVoucher !== 'function') {
    return { ok: false, error: 'client_missing' };
  }

  const code = normalizeVoucherCodeValue(voucherCode);
  if (!code) {
    return { ok: false, error: 'not_found' };
  }

  const orderValue = getVoucherOrderValue();
  try {
    const result = await BAGO_API.validateVoucher(code, orderValue);
    return {
      ok: true,
      voucher: result.voucher
    };
  } catch (error) {
    const payload = error.payload || {};
    return {
      ok: false,
      error: payload.error || 'fetch_failed',
      minimumOrderValue: payload.minimumOrderValue,
      orderValue: payload.orderValue
    };
  }
}

async function applyVoucherCode() {
  const code = normalizeVoucherCodeValue(voucherCodeInput?.value || '');
  if (!code) {
    clearAppliedVoucher();
    setVoucherStatusMessage('');
    renderCart();
    return;
  }

  setVoucherStatusMessage(`${t('voucherTitle')}...`);
  const result = await fetchVoucherForCode(code);

  if (!result.ok) {
    clearAppliedVoucher();
    setVoucherStatusMessage(
      resolveVoucherErrorMessage(result.error, {
        minimumOrderValue: result.minimumOrderValue,
        orderValue: result.orderValue
      }),
      true
    );
    renderCart();
    return;
  }

  state.appliedVoucher = result.voucher;
  voucherCodeInput.value = result.voucher.code;
  setVoucherStatusMessage(
    formatT('voucherApplied', {
      code: result.voucher.code,
      amount: money.format(result.voucher.discountAmount)
    })
  );
  renderCart();
}

async function redeemVoucherIfNeeded(orderContext) {
  if (!orderContext.voucherCode) {
    return { ok: true, voucher: null };
  }

  if (typeof BAGO_API.redeemVoucher !== 'function') {
    return { ok: false, error: 'client_missing' };
  }

  try {
    const result = await BAGO_API.redeemVoucher(orderContext.voucherCode, orderContext.totals?.subtotal || 0);
    return {
      ok: true,
      voucher: result.voucher
    };
  } catch (error) {
    const payload = error.payload || {};
    return {
      ok: false,
      error: payload.error || 'fetch_failed',
      minimumOrderValue: payload.minimumOrderValue,
      orderValue: payload.orderValue
    };
  }
}

async function persistOrderInDatabase(orderContext, options = {}) {
  if (typeof BAGO_API.createOrder !== 'function') {
    throw new Error('API client missing');
  }

  const eventPayload = {
    orderNumber: orderContext.orderNumber,
    paymentMethod: orderContext.payment,
    orderTotal: orderContext.totals.total,
    voucherCode: orderContext.voucherCode || null,
    lineCount: orderContext.lines.length,
    isScheduled: orderContext.isScheduled === true,
    scheduledForIso: orderContext.scheduledForIso || null,
    orderStatus: options.orderStatus || 'pending_confirmation'
  };

  const result = await BAGO_API.createOrder({
    orderTotal: orderContext.totals.total,
    paymentMethod: orderContext.payment,
    orderStatus: options.orderStatus || 'pending_confirmation',
    paymentReference: options.paymentReference || null,
    voucherCode: orderContext.voucherCode || null,
    voucherDiscount: orderContext.totals.voucherDiscount || 0,
    customerName: orderContext.customerName,
    customerPhone: orderContext.customerPhone,
    customerEmail: orderContext.customerEmail || null,
    isScheduled: orderContext.isScheduled === true,
    scheduledForIso: orderContext.scheduledForIso || null,
    eventPayload,
    lines: orderContext.lines.map((item) => ({
      itemId: item.id,
      itemName: pickTranslation(item.nameTranslations, item.name || ''),
      quantity: item.quantity,
      unitPrice: item.price
    }))
  });

  return result.data.order.id;
}

function normalizeTrackingPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {};
  try {
    return JSON.parse(JSON.stringify(payload));
  } catch {
    return {};
  }
}

async function trackOrderEvent(orderId, eventType, payload = {}, options = {}) {
  if (!orderId || !eventType) return;
  const source = String(options.source || 'web').trim() || 'web';
  if (typeof BAGO_API.createOrderEvent !== 'function') return;

  try {
    await BAGO_API.createOrderEvent(orderId, String(eventType).trim(), normalizeTrackingPayload(payload), source);
  } catch (error) {
    console.error('Order event tracking failed:', error);
  }
}

async function updateOrderStatus(orderId, status, paymentReference = '') {
  if (!orderId) return;
  if (typeof BAGO_API.updateOrderStatus !== 'function') return;

  try {
    await BAGO_API.updateOrderStatus(orderId, status, paymentReference);
  } catch (error) {
    console.error('Order status update failed:', error);
  }
}

function buildCashWhatsAppUrl(orderContext) {
  const messageLines = [
    `${t('waHeader')} #${orderContext.orderNumber}`,
    `${t('waBusiness')}: ${VENUE_CONFIG.name}`,
    `${t('waCustomer')}: ${orderContext.customerName}`,
    `${t('waPhone')}: ${orderContext.customerPhone}`,
    ...(orderContext.customerEmail ? [`Email: ${orderContext.customerEmail}`] : []),
    `${t('waPayment')}: ${orderContext.paymentLabel}`,
    `${t('waFulfillment')}: ${orderContext.scheduleLabel}`,
    '',
    `${t('waItems')}:`,
    ...orderContext.lines.map(
      (item) => `- ${item.quantity}x ${getItemDisplayName(item)} (${money.format(item.price * item.quantity)})`
    ),
    '',
    `${t('subtotalLabel')}: ${money.format(orderContext.totals.subtotal)}`,
    `${t('serviceFeeLabel')}: ${money.format(orderContext.totals.service)}`,
    ...(orderContext.totals.voucherDiscount > 0
      ? [`${t('voucherDiscountLabel')}: -${money.format(orderContext.totals.voucherDiscount)}`]
      : []),
    `${t('totalLabel')}: ${money.format(orderContext.totals.total)}`
  ];

  return `${getWhatsAppBaseUrl()}?text=${encodeURIComponent(messageLines.join('\n'))}`;
}

function savePendingPayPalOrder(orderContext) {
  const pendingPayload = {
    orderNumber: orderContext.orderNumber,
    customerName: orderContext.customerName,
    customerPhone: orderContext.customerPhone,
    customerEmail: orderContext.customerEmail,
    orderId: orderContext.orderId || null,
    language: orderContext.language,
    scheduleLabel: orderContext.scheduleLabel || t('waFulfillmentNow'),
    isScheduled: orderContext.isScheduled === true,
    scheduledForIso: orderContext.scheduledForIso || null,
    totals: orderContext.totals,
    voucherCode: orderContext.voucherCode || '',
    items: orderContext.lines.map((item) => ({
      id: item.id,
      name: getItemDisplayName(item),
      quantity: item.quantity,
      lineTotal: item.price * item.quantity
    })),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(PENDING_PAYPAL_ORDER_KEY, JSON.stringify(pendingPayload));
}

function readPendingPayPalOrder() {
  try {
    const raw = localStorage.getItem(PENDING_PAYPAL_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isLocalHostName(hostname) {
  const normalized = String(hostname || '').toLowerCase();
  return normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1' || normalized.endsWith('.local');
}

function resolvePayPalReturnBaseUrl() {
  const runtimeUrl = new URL(window.location.href);
  const runtimeSecure = runtimeUrl.protocol === 'https:' && !isLocalHostName(runtimeUrl.hostname);
  if (runtimeSecure) {
    runtimeUrl.search = '';
    runtimeUrl.hash = '';
    return runtimeUrl.toString();
  }

  const configured = String(VENUE_CONFIG.paypalReturnBaseUrl || VENUE_CONFIG.siteUrl || '').trim();
  if (!configured) return '';

  try {
    const url = new URL(configured, runtimeUrl);
    if (url.protocol !== 'https:') return '';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

function buildPayPalCheckoutUrl(orderContext) {
  const merchant = String(VENUE_CONFIG.paypalEmail || '').trim();
  if (!merchant || !merchant.includes('@')) {
    throw new Error(t('statusPaypalCheckoutFailed'));
  }

  const params = new URLSearchParams({
    cmd: '_xclick',
    business: merchant,
    item_name: `${VENUE_CONFIG.name} Order #${orderContext.orderNumber}`,
    currency_code: 'EUR',
    amount: orderContext.totals.total.toFixed(2),
    no_shipping: '1',
    charset: 'UTF-8',
    lc: 'DE'
  });

  const returnBaseUrl = resolvePayPalReturnBaseUrl();
  if (returnBaseUrl) {
    const returnUrl = new URL('paypal-success.html', returnBaseUrl);
    returnUrl.searchParams.set('paypal_success', '1');
    const cancelUrl = new URL(returnBaseUrl);
    cancelUrl.searchParams.set('paypal_cancel', '1');
    params.set('return', returnUrl.toString());
    params.set('cancel_return', cancelUrl.toString());
  }

  const paypalHost = VENUE_CONFIG.paypalSandbox ? 'https://www.sandbox.paypal.com' : 'https://www.paypal.com';
  return `${paypalHost}/cgi-bin/webscr?${params.toString()}`;
}

function buildPaidWhatsAppUrlFromPayPalReturn(pendingOrder, transactionId) {
  const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' });
  const totals = pendingOrder.totals || { subtotal: 0, service: 0, voucherDiscount: 0, total: 0 };

  const messageLines = [
    `New order #${pendingOrder.orderNumber || ''}`.trim(),
    `Restaurant: ${VENUE_CONFIG.name}`,
    `Customer Name: ${pendingOrder.customerName || '-'}`,
    `Phone: ${pendingOrder.customerPhone || '-'}`,
    ...(pendingOrder.customerEmail ? [`Email: ${pendingOrder.customerEmail}`] : []),
    `Payment Method: PayPal`,
    `Pickup: ${pendingOrder.scheduleLabel || 'As soon as possible'}`,
    `Payment Status: PAID`,
    `PayPal Transaction ID: ${transactionId || 'N/A'}`,
    '',
    'Order Details:',
    ...(pendingOrder.items || []).map((item) => `- ${item.quantity}x ${item.name} (${formatter.format(item.lineTotal || 0)})`),
    '',
    `Subtotal: ${formatter.format(totals.subtotal || 0)}`,
    `Service: ${formatter.format(totals.service || 0)}`,
    ...(totals.voucherDiscount > 0 ? [`Voucher: -${formatter.format(totals.voucherDiscount || 0)}`] : []),
    `Order Total: ${formatter.format(totals.total || 0)}`
  ];

  return `${getWhatsAppBaseUrl()}?text=${encodeURIComponent(messageLines.join('\n'))}`;
}

async function sendCashOrderToWhatsApp() {
  const orderContext = collectValidatedOrderContext();
  if (!orderContext) {
    return false;
  }

  const voucherResult = await redeemVoucherIfNeeded(orderContext);
  if (!voucherResult.ok) {
    formStatus.textContent = t('statusVoucherRecheckFailed');
    setVoucherStatusMessage(
      resolveVoucherErrorMessage(voucherResult.error, {
        minimumOrderValue: voucherResult.minimumOrderValue,
        orderValue: voucherResult.orderValue
      }),
      true
    );
    return false;
  }
  if (voucherResult.voucher) {
    orderContext.voucherCode = voucherResult.voucher.code;
    state.appliedVoucher = voucherResult.voucher;
  }
  orderContext.totals = getTotals();

  try {
    orderContext.orderId = await persistOrderInDatabase(orderContext, {
      orderStatus: 'pending_confirmation'
    });
  } catch (error) {
    console.error('Order persistence failed:', error);
    formStatus.textContent = t('statusOrderSaveFailed');
    return false;
  }

  const url = buildCashWhatsAppUrl(orderContext);
  await trackOrderEvent(orderContext.orderId, 'cash_whatsapp_open_requested', {
    orderNumber: orderContext.orderNumber
  });
  armWhatsappConfirmationPrompt(orderContext);
  const opened = openWhatsApp(url);
  if (!opened) {
    trackOrderEvent(orderContext.orderId, 'cash_whatsapp_popup_blocked', {
      orderNumber: orderContext.orderNumber
    });
  }
  formStatus.textContent = opened ? t('statusWhatsappOpening') : t('statusWhatsappBlocked');
  return true;
}

async function startPayPalCheckoutFlow() {
  const orderContext = collectValidatedOrderContext();
  if (!orderContext) {
    return false;
  }

  const voucherResult = await redeemVoucherIfNeeded(orderContext);
  if (!voucherResult.ok) {
    formStatus.textContent = t('statusVoucherRecheckFailed');
    setVoucherStatusMessage(
      resolveVoucherErrorMessage(voucherResult.error, {
        minimumOrderValue: voucherResult.minimumOrderValue,
        orderValue: voucherResult.orderValue
      }),
      true
    );
    return false;
  }
  if (voucherResult.voucher) {
    orderContext.voucherCode = voucherResult.voucher.code;
    state.appliedVoucher = voucherResult.voucher;
  }
  orderContext.totals = getTotals();

  try {
    orderContext.orderId = await persistOrderInDatabase(orderContext, {
      orderStatus: 'payment_pending'
    });
  } catch (error) {
    console.error('Order persistence failed:', error);
    formStatus.textContent = t('statusOrderSaveFailed');
    return false;
  }

  savePendingPayPalOrder(orderContext);
  await trackOrderEvent(orderContext.orderId, 'paypal_checkout_redirect', {
    orderNumber: orderContext.orderNumber,
    amount: orderContext.totals.total
  });
  let paypalUrl = '';
  try {
    paypalUrl = buildPayPalCheckoutUrl(orderContext);
  } catch (error) {
    console.error('PayPal checkout URL failed:', error);
    localStorage.removeItem(PENDING_PAYPAL_ORDER_KEY);
    if (orderContext.orderId) {
      updateOrderStatus(orderContext.orderId, 'payment_failed');
      trackOrderEvent(orderContext.orderId, 'paypal_checkout_failed', {
        orderNumber: orderContext.orderNumber
      });
    }
    formStatus.textContent = t('statusPaypalCheckoutFailed');
    return false;
  }
  formStatus.textContent = t('statusRedirectingPaypal');
  window.location.href = paypalUrl;
  return true;
}

function handlePayPalReturn() {
  if (!isPayPalEnabled()) {
    return;
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const pendingOrder = readPendingPayPalOrder();

  if (params.get('paypal_cancel') === '1') {
    if (pendingOrder?.orderId) {
      updateOrderStatus(pendingOrder.orderId, 'cancelled');
      trackOrderEvent(pendingOrder.orderId, 'paypal_cancelled', {
        orderNumber: pendingOrder.orderNumber || null
      });
    }
    formStatus.textContent = t('statusPaypalCancelled');
    clearPayPalReturnParams();
    return;
  }

  const hasPayPalReturn = params.get('paypal_success') === '1' || params.has('tx') || params.has('st');
  if (!hasPayPalReturn) {
    return;
  }

  const transactionId = params.get('tx') || '';
  const statusRaw = (params.get('st') || '').toLowerCase();
  const isPaid =
    statusRaw === 'completed' ||
    statusRaw === 'paid' ||
    statusRaw === 'success' ||
    (Boolean(transactionId) && !statusRaw);
  clearPayPalReturnParams();

  if (!pendingOrder) {
    formStatus.textContent = t('statusPaypalOrderMissing');
    return;
  }

  if (!isPaid) {
    formStatus.textContent = t('statusPaypalReturnPending');
    return;
  }

  const lastSharedTx = localStorage.getItem(LAST_SHARED_PAYPAL_TX_KEY);
  if (transactionId && lastSharedTx === transactionId) {
    return;
  }

  const waUrl = buildPaidWhatsAppUrlFromPayPalReturn(pendingOrder, transactionId);
  if (pendingOrder?.orderId) {
    updateOrderStatus(pendingOrder.orderId, 'paid', transactionId);
    trackOrderEvent(pendingOrder.orderId, 'paypal_paid', {
      transactionId,
      paymentStatus: statusRaw || 'completed'
    });
  }
  if (transactionId) {
    localStorage.setItem(LAST_SHARED_PAYPAL_TX_KEY, transactionId);
  }

  localStorage.removeItem(PENDING_PAYPAL_ORDER_KEY);
  state.cart = {};
  saveCart();
  renderOrderSurfaces();
  formStatus.textContent = t('statusWhatsappOpening');
  trackOrderEvent(pendingOrder.orderId, 'paypal_whatsapp_open_requested', {
    transactionId
  });
  armWhatsappConfirmationPrompt(pendingOrder);
  const opened = openWhatsApp(waUrl);
  if (!opened) {
    trackOrderEvent(pendingOrder.orderId, 'paypal_whatsapp_popup_blocked', {
      transactionId
    });
  }
}

async function handleCheckoutSubmit() {
  if (getSelectedPayment() === 'paypal') {
    return startPayPalCheckoutFlow();
  }

  return sendCashOrderToWhatsApp();
}

function syncFloatingCartReminder(totalQuantity = 0, isCartOpen = false) {
  if (!floatingCartReminder || !floatingCartCount) return;
  const safeQuantity = Number.isFinite(totalQuantity) ? Math.max(0, totalQuantity) : 0;
  floatingCartCount.textContent = String(safeQuantity);
  floatingCartReminder.classList.toggle('has-items', safeQuantity > 0);
  floatingCartReminder.classList.toggle('is-hidden', isCartOpen);
}

function renderCart() {
  const lines = getCartLines();
  const totals = getTotals();
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  syncFulfillmentControls();
  syncPaymentControls();

  cartItems.innerHTML = lines
    .map(
      (item) => `
        <article class="cart-line">
          <div>
            <h3>${escapeHtml(getItemDisplayName(item))}</h3>
            <p>${money.format(item.price)} each</p>
          </div>
          ${renderStepper(item, getItemDisplayName(item))}
        </article>
      `
    )
    .join('');

  emptyCart.hidden = lines.length > 0;
  cartCount.textContent = totalQuantity;
  syncFloatingCartReminder(totalQuantity, cartPanel.classList.contains('is-open'));
  subtotalEl.textContent = money.format(totals.subtotal);
  serviceFeeEl.textContent = money.format(totals.service);
  if (voucherDiscountEl) {
    voucherDiscountEl.textContent = `-${money.format(totals.voucherDiscount || 0)}`;
  }
  if (voucherTotalRow) {
    voucherTotalRow.classList.toggle('is-hidden', !lines.length || !(totals.voucherDiscount > 0));
  }
  minimumGapEl.textContent = money.format(totals.minimumGap);
  minimumRow.classList.toggle('is-hidden', !lines.length || totals.minimumGap === 0);
  totalEl.textContent = money.format(totals.total);

  const scheduledMode = getSelectedFulfillment() === 'scheduled';
  const hasScheduledDateTime = Boolean(parseScheduledDateTimeFromInputs());
  const scheduleIncomplete = scheduledMode && !hasScheduledDateTime;

  checkoutButton.disabled = !lines.length || totals.minimumGap > 0 || scheduleIncomplete;
  if (!lines.length) {
    checkoutButton.textContent = t('addItemsToCheckout');
  } else if (totals.minimumGap > 0) {
    checkoutButton.textContent = formatT('addMoreAmount', { amount: money.format(totals.minimumGap) });
  } else {
    checkoutButton.textContent = getSelectedPayment() === 'paypal' ? t('buttonPayNow') : t('buttonPlaceOrder');
  }
}

function renderOrderSurfaces() {
  renderPopular();
  renderMenu();
  renderCart();
}

function addItem(id) {
  const item = itemById.get(id);
  if (!item || item.available === false) {
    return;
  }
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  renderOrderSurfaces();
}

function updateQuantity(id, change) {
  const nextQuantity = (state.cart[id] || 0) + change;

  if (nextQuantity <= 0) {
    delete state.cart[id];
  } else {
    state.cart[id] = nextQuantity;
  }

  saveCart();
  renderOrderSurfaces();
}

function setCartOpen(isOpen) {
  cartPanel.classList.toggle('is-open', isOpen);
  cartBackdrop.hidden = !isOpen;
  document.body.classList.toggle('cart-open', isOpen);
  cartToggle.setAttribute('aria-expanded', String(isOpen));
  syncFloatingCartReminder(Number.parseInt(cartCount.textContent, 10) || 0, isOpen);
}

function resetOrder() {
  state.cart = {};
  clearAppliedVoucher();
  saveCart();
  checkoutForm.reset();
  checkoutForm.classList.remove('was-validated');
  checkoutForm.elements.payment.value = isPayPalEnabled() ? 'paypal' : 'cash';
  if (checkoutForm.elements.fulfillment) {
    checkoutForm.elements.fulfillment.value = 'asap';
  }
  if (scheduledDateInput) {
    scheduledDateInput.value = '';
    setFieldValidity(scheduledDateInput, '');
  }
  if (scheduledTimeInput) {
    scheduledTimeInput.value = '';
    setFieldValidity(scheduledTimeInput, '');
  }
  formStatus.textContent = '';
  setVoucherStatusMessage('');
  syncFulfillmentControls();
  renderOrderSurfaces();
}

function renderLegalContent(legalKey) {
  const entry = LEGAL_TEXT[legalKey];
  if (!entry) return;
  const content = entry[state.language] || entry.de;

  legalModalTitle.textContent = content.title;
  legalModalContent.innerHTML = content.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('');
}

function openLegalModal(legalKey) {
  if (!LEGAL_TEXT[legalKey]) return;
  state.activeLegalKey = legalKey;
  renderLegalContent(legalKey);
  legalModal.hidden = false;
  document.body.classList.add('legal-open');
}

function closeLegalModal() {
  legalModal.hidden = true;
  document.body.classList.remove('legal-open');
}

function setLanguage(language) {
  if (!TRANSLATIONS[language]) return;
  state.language = language;
  applyLanguage();
}

function closeLanguageMenu() {
  languageMenu.hidden = true;
  languageToggle.setAttribute('aria-expanded', 'false');
}

function toggleLanguageMenu() {
  const shouldOpen = languageMenu.hidden;
  languageMenu.hidden = !shouldOpen;
  languageToggle.setAttribute('aria-expanded', String(shouldOpen));
}

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  const increaseButton = event.target.closest('[data-increase]');
  const decreaseButton = event.target.closest('[data-decrease]');
  const filterButton = event.target.closest('[data-filter]');
  const legalButton = event.target.closest('[data-legal-open]');
  const languageButton = event.target.closest('[data-language]');

  if (addButton) {
    addItem(addButton.dataset.add);
  }

  if (increaseButton) {
    updateQuantity(increaseButton.dataset.increase, 1);
  }

  if (decreaseButton) {
    updateQuantity(decreaseButton.dataset.decrease, -1);
  }

  if (filterButton) {
    state.filter = filterButton.dataset.filter;
    renderCategoryTabs();
    renderMenu();
  }

  if (legalButton) {
    openLegalModal(legalButton.dataset.legalOpen);
  }

  if (languageButton) {
    setLanguage(languageButton.dataset.language);
    closeLanguageMenu();
  }

  if (!event.target.closest('#languageSwitcher')) {
    closeLanguageMenu();
  }

  if (event.target === legalModal) {
    closeLegalModal();
  }
  if (event.target === whatsappConfirmModal) {
    handleWhatsappConfirmationNo();
  }
});

menuSearch.addEventListener('input', () => {
  state.search = menuSearch.value;
  renderMenu();
});

if (categoryScrollLeft) {
  categoryScrollLeft.addEventListener('click', () => scrollCategoryTabs(-1));
}

if (categoryScrollRight) {
  categoryScrollRight.addEventListener('click', () => scrollCategoryTabs(1));
}

if (categoryTabs) {
  categoryTabs.addEventListener('scroll', updateCategoryScrollButtons, { passive: true });
}

window.addEventListener('resize', updateCategoryScrollButtons);

cartToggle.addEventListener('click', () => setCartOpen(true));
if (floatingCartReminder) {
  floatingCartReminder.addEventListener('click', () => setCartOpen(true));
}
jumpCart.addEventListener('click', () => setCartOpen(true));
closeCart.addEventListener('click', () => setCartOpen(false));
cartBackdrop.addEventListener('click', () => setCartOpen(false));

cancelOrderButton.addEventListener('click', () => {
  resetOrder();
  setCartOpen(false);
  window.location.hash = '#home';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

checkoutForm.addEventListener('input', (event) => {
  validateCheckoutFields();
  if (event.target === scheduledDateInput || event.target === scheduledTimeInput) {
    renderCart();
  }
});

if (voucherCodeInput) {
  voucherCodeInput.addEventListener('input', () => {
    const code = normalizeVoucherCodeValue(voucherCodeInput.value);
    if (!code) {
      clearAppliedVoucher();
      setVoucherStatusMessage('');
      renderCart();
      return;
    }
    if (state.appliedVoucher?.code && state.appliedVoucher.code !== code) {
      clearAppliedVoucher();
      setVoucherStatusMessage('');
      renderCart();
    }
  });
}

if (applyVoucherButton) {
  applyVoucherButton.addEventListener('click', async () => {
    applyVoucherButton.disabled = true;
    try {
      await applyVoucherCode();
    } finally {
      applyVoucherButton.disabled = false;
    }
  });
}

paymentMethods.addEventListener('change', () => {
  formStatus.textContent = '';
  renderCart();
});

if (fulfillmentMethods) {
  fulfillmentMethods.addEventListener('change', () => {
    formStatus.textContent = '';
    validateCheckoutFields();
    renderCart();
  });
}

if (scheduledDateInput) {
  scheduledDateInput.addEventListener('change', () => {
    validateCheckoutFields();
    renderCart();
    scheduledDateInput.blur();
  });
}

if (scheduledTimeInput) {
  scheduledTimeInput.addEventListener('change', () => {
    validateCheckoutFields();
    renderCart();
    scheduledTimeInput.blur();
  });
}

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  checkoutButton.disabled = true;
  try {
    await handleCheckoutSubmit();
  } finally {
    renderCart();
  }
});

languageToggle.addEventListener('click', () => {
  toggleLanguageMenu();
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    toggleTheme();
  });
}

legalModalClose.addEventListener('click', closeLegalModal);
legalModalCancel.addEventListener('click', closeLegalModal);
if (whatsappConfirmYes) {
  whatsappConfirmYes.addEventListener('click', handleWhatsappConfirmationYes);
}
if (whatsappConfirmNo) {
  whatsappConfirmNo.addEventListener('click', handleWhatsappConfirmationNo);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (whatsappConfirmModal && !whatsappConfirmModal.hidden) {
      handleWhatsappConfirmationNo();
      return;
    }
    setCartOpen(false);
    closeLanguageMenu();
    closeLegalModal();
  }
});

window.addEventListener('blur', () => {
  markWhatsappConfirmationAsLeftPage();
});

window.addEventListener('focus', () => {
  maybePromptWhatsappConfirmation();
});

window.addEventListener('pageshow', () => {
  maybePromptWhatsappConfirmation();
});

window.addEventListener('pagehide', () => {
  markWhatsappConfirmationAsLeftPage();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    markWhatsappConfirmationAsLeftPage();
    return;
  }
  maybePromptWhatsappConfirmation();
});

if (heroImage && VENUE_CONFIG.heroImage) {
  heroImage.src = VENUE_CONFIG.heroImage;
}

if (mapsLink) {
  mapsLink.href = buildPickupMapsUrl();
}

async function initializeApp() {
  await loadRuntimeConfig();
  if (heroImage && VENUE_CONFIG.heroImage) {
    heroImage.src = VENUE_CONFIG.heroImage;
  }
  if (mapsLink) {
    mapsLink.href = buildPickupMapsUrl();
  }
  applyTheme(getInitialTheme());
  setupInspectGuard();
  await Promise.all([initializeMenuData(), initializeOpeningHours()]);
  menuCount.textContent = menuItems.length;
  heroItemCount.textContent = menuItems.length;
  applyLanguage();
  handlePayPalReturn();
  maybePromptWhatsappConfirmation();
  setInterval(() => {
    renderOpeningHoursCard();
    syncFulfillmentControls();
    renderCart();
  }, 60000);
}

initializeApp();
