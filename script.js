const orderedCategories = [...BAGO_CATEGORIES];

const menuItems = orderedCategories.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    categoryId: category.id,
    categoryName: category.name
  }))
);

const itemById = new Map(menuItems.map((item) => [item.id, item]));

const popularIds = (() => {
  const withImages = menuItems.filter((item) => item.image).map((item) => item.id);
  const seed = withImages.length >= 8 ? withImages : [...withImages, ...menuItems.map((item) => item.id)];
  return [...new Set(seed)].slice(0, 8);
})();

const TRANSLATIONS = {
  de: {
    navPopular: 'Beliebt',
    navMenu: 'Menü',
    navDetails: 'Details',
    cartLabel: 'Warenkorb',
    heroCopy: 'Live mit Uber-Eats-Daten synchronisiert, inklusive aktueller Preise und Bilder.',
    startOrder: 'Jetzt bestellen',
    viewCart: 'Warenkorb anzeigen',
    heroStatItems: 'Menüeinträge',
    heroStatMinimum: 'Mindestbestellwert',
    heroStatSource: 'Quelle synchronisiert',
    popularEyebrow: 'Schnelle Auswahl',
    popularTitle: 'Am häufigsten bestellt',
    menuEyebrow: 'Komplettes Menü',
    menuTitle: 'Rolls, Bowls, Burger, Pommes, Getränke',
    menuSynced: 'Einträge von Uber Eats synchronisiert',
    searchLabel: 'Menü durchsuchen',
    searchPlaceholder: 'Suche nach Lachs, Burrito, Pommes...',
    checkoutEyebrow: 'Checkout',
    cartTitle: 'Dein Warenkorb',
    emptyCart: 'Wähle eine Roll, Bowl, einen Burger oder eine Beilage, um zu starten.',
    deliveryTitle: 'Lieferung',
    deliveryNote: 'Bago Sushi liefert in Kürze zu dir nach Hause.',
    contactTitle: 'Kontakt',
    nameLabel: 'Name',
    phoneLabel: 'Telefon',
    paymentTitle: 'Zahlung',
    paymentHelp: 'Beim Checkout wirst du mit dem Gesamtbetrag in EUR zu PayPal weitergeleitet.',
    subtotalLabel: 'Zwischensumme',
    deliveryFeeLabel: 'Lieferung',
    serviceFeeLabel: 'Service',
    minimumGapLabel: 'Fehlbetrag bis Mindestwert',
    totalLabel: 'Gesamt',
    cancelOrder: 'Abbrechen und zur Startseite',
    detailsEyebrow: 'Restaurantdetails',
    detailsAddress: 'Adresse: Luftgasse 1, 85049 Ingolstadt. Lieferung verfügbar.',
    hoursTitle: 'Öffnungszeiten',
    hoursWeekdays: 'Mo-Fr',
    hoursSaturday: 'Samstag',
    hoursSunday: 'Sonntag',
    closedLabel: 'Geschlossen',
    legalEyebrow: 'Rechtliches',
    legalTitle: 'Rechtliche Informationen',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Datenschutz',
    legalStreitbeilegung: 'Verbraucherstreitbeilegung',
    closeButton: 'Schließen',
    aboutEyebrow: 'Über uns',
    aboutTitle: 'Entdecke neue Geschmäcker bei Bago Sushi & Asia ToGo',
    aboutBody1: 'Sushi, Burger, Burritos und mehr - probiere unsere frisch zubereiteten Lieblingsgerichte.',
    aboutBody2:
      'Wir sind ein kleines Startup im Herzen von Ingolstadt in der Luftgasse 1. Gegründet von Pyaye, einem erfahrenen Koch mit mehr als fünf Jahren Praxiserfahrung in Sushi, Burgern, Burritos und weiteren Spezialitäten.',
    aboutBody3:
      'Jedes Gericht entsteht mit Leidenschaft, Sorgfalt und Fokus auf Qualität. Wir setzen auf frische Zutaten, ehrlichen Geschmack und eine Bestellung, die für unsere Gäste schnell, zuverlässig und unkompliziert ist.',
    aboutBody4:
      'Unser Ziel ist es, unsere Nachbarschaft mit kreativen Gerichten, fairen Preisen und echter Gastfreundschaft zu begeistern.',
    allLabel: 'Alle',
    itemSingle: 'Eintrag',
    itemPlural: 'Einträge',
    noMenuMatch: 'Keine passenden Menüeinträge gefunden.',
    itemDescriptionFallback: 'Frisch zubereitet bei Bago Sushi & Asian To Go.',
    addItemsToCheckout: 'Artikel hinzufügen',
    addMoreAmount: 'Noch {amount} hinzufügen',
    payWithPaypal: 'Mit PayPal zahlen',
    nameValidation: 'Bitte den vollständigen Namen eingeben.',
    phoneValidationEmpty: 'Bitte eine Telefonnummer eingeben.',
    phoneValidationInvalid: 'Bitte eine gültige Telefonnummer mit 8 bis 15 Ziffern eingeben.',
    statusAddItemFirst: 'Bitte zuerst mindestens einen Artikel hinzufügen.',
    statusMinimumGap: 'Mindestbestellwert {minimum}. Bitte noch {gap} hinzufügen.',
    statusRedirecting: 'Weiterleitung zu PayPal...'
  },
  en: {
    navPopular: 'Popular',
    navMenu: 'Menu',
    navDetails: 'Details',
    cartLabel: 'Cart',
    heroCopy: 'Synced live with Uber Eats data, including current prices and images.',
    startOrder: 'Start Order',
    viewCart: 'View Cart',
    heroStatItems: 'menu items',
    heroStatMinimum: 'minimum order',
    heroStatSource: 'source synced',
    popularEyebrow: 'Quick picks',
    popularTitle: 'Most ordered',
    menuEyebrow: 'Full menu',
    menuTitle: 'Rolls, bowls, burgers, fries, drinks',
    menuSynced: 'items synced from Uber Eats',
    searchLabel: 'Search menu',
    searchPlaceholder: 'Try salmon, burrito, fries...',
    checkoutEyebrow: 'Checkout',
    cartTitle: 'Your cart',
    emptyCart: 'Pick a roll, bowl, burger, or side to start your order.',
    deliveryTitle: 'Delivery',
    deliveryNote: 'Bago Sushi will deliver to your home soon.',
    contactTitle: 'Contact',
    nameLabel: 'Name',
    phoneLabel: 'Phone',
    paymentTitle: 'Payment',
    paymentHelp: 'Checkout redirects to PayPal with your total in EUR.',
    subtotalLabel: 'Subtotal',
    deliveryFeeLabel: 'Delivery',
    serviceFeeLabel: 'Service',
    minimumGapLabel: 'Minimum gap',
    totalLabel: 'Total',
    cancelOrder: 'Cancel and return home',
    detailsEyebrow: 'Restaurant details',
    detailsAddress: 'Address: Luftgasse 1, 85049 Ingolstadt. Delivery available.',
    hoursTitle: 'Opening hours',
    hoursWeekdays: 'Mon-Fri',
    hoursSaturday: 'Saturday',
    hoursSunday: 'Sunday',
    closedLabel: 'Closed',
    legalEyebrow: 'Legal',
    legalTitle: 'Legal information',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Privacy',
    legalStreitbeilegung: 'Consumer dispute resolution',
    closeButton: 'Close',
    aboutEyebrow: 'About Us',
    aboutTitle: 'Discover new tastes at Bago Sushi & Asia ToGo',
    aboutBody1: 'Sushi, burgers, burritos, and more. Come and enjoy our fresh favorites.',
    aboutBody2:
      'We are a small startup in the heart of Ingolstadt at Luftgasse 1. Founded by Pyaye, an experienced chef with more than five years of proven expertise in sushi, burgers, burritos, and other specialties.',
    aboutBody3:
      'Every dish is made with passion, care, and attention to quality. We focus on fresh ingredients, authentic taste, and a smooth customer experience.',
    aboutBody4: 'Our goal is to serve our neighborhood with creativity, fair prices, and genuine hospitality.',
    allLabel: 'All',
    itemSingle: 'item',
    itemPlural: 'items',
    noMenuMatch: 'No menu items match that search.',
    itemDescriptionFallback: 'Freshly prepared by Bago Sushi & Asian To Go.',
    addItemsToCheckout: 'Add items to checkout',
    addMoreAmount: 'Add {amount} more',
    payWithPaypal: 'Pay with PayPal',
    nameValidation: "Please enter the customer's full name.",
    phoneValidationEmpty: 'Please enter a phone number.',
    phoneValidationInvalid: 'Enter a valid phone number with 8 to 15 digits.',
    statusAddItemFirst: 'Add at least one item first.',
    statusMinimumGap: 'Minimum order is {minimum}. Add {gap} more.',
    statusRedirecting: 'Redirecting to PayPal...'
  },
  ru: {
    navPopular: 'Популярное',
    navMenu: 'Меню',
    navDetails: 'Детали',
    cartLabel: 'Корзина',
    heroCopy: 'Меню синхронизировано с Uber Eats, включая актуальные цены и изображения.',
    startOrder: 'Начать заказ',
    viewCart: 'Открыть корзину',
    heroStatItems: 'позиций меню',
    heroStatMinimum: 'минимальный заказ',
    heroStatSource: 'синхронизировано',
    popularEyebrow: 'Быстрый выбор',
    popularTitle: 'Чаще всего заказывают',
    menuEyebrow: 'Полное меню',
    menuTitle: 'Роллы, боулы, бургеры, картофель фри, напитки',
    menuSynced: 'позиции синхронизированы с Uber Eats',
    searchLabel: 'Поиск по меню',
    searchPlaceholder: 'Например: лосось, буррито, фри...',
    checkoutEyebrow: 'Оформление',
    cartTitle: 'Ваша корзина',
    emptyCart: 'Выберите ролл, боул, бургер или гарнир, чтобы начать заказ.',
    deliveryTitle: 'Доставка',
    deliveryNote: 'Bago Sushi скоро доставит заказ к вам домой.',
    contactTitle: 'Контакты',
    nameLabel: 'Имя',
    phoneLabel: 'Телефон',
    paymentTitle: 'Оплата',
    paymentHelp: 'При оформлении вы будете перенаправлены в PayPal для оплаты в EUR.',
    subtotalLabel: 'Промежуточный итог',
    deliveryFeeLabel: 'Доставка',
    serviceFeeLabel: 'Сервис',
    minimumGapLabel: 'До минимума осталось',
    totalLabel: 'Итого',
    cancelOrder: 'Отменить и вернуться на главную',
    detailsEyebrow: 'Информация о ресторане',
    detailsAddress: 'Адрес: Luftgasse 1, 85049 Ingolstadt. Доставка доступна.',
    hoursTitle: 'Часы работы',
    hoursWeekdays: 'Пн-Пт',
    hoursSaturday: 'Суббота',
    hoursSunday: 'Воскресенье',
    closedLabel: 'Закрыто',
    legalEyebrow: 'Юридическая информация',
    legalTitle: 'Юридическая информация',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Конфиденциальность',
    legalStreitbeilegung: 'Разрешение потребительских споров',
    closeButton: 'Закрыть',
    aboutEyebrow: 'О нас',
    aboutTitle: 'Откройте новые вкусы в Bago Sushi & Asia ToGo',
    aboutBody1: 'Суши, бургеры, буррито и многое другое. Попробуйте наши свежие блюда.',
    aboutBody2:
      'Мы небольшой стартап в центре Ингольштадта по адресу Luftgasse 1. Проект основан Пьяе, опытным шефом с более чем 5-летней практикой в приготовлении суши, бургеров, буррито и других блюд.',
    aboutBody3:
      'Каждое блюдо готовится с вниманием и любовью к качеству. Мы используем свежие ингредиенты и заботимся о высоком уровне сервиса.',
    aboutBody4: 'Наша цель — радовать гостей креативными блюдами, честными ценами и настоящим гостеприимством.',
    allLabel: 'Все',
    itemSingle: 'позиция',
    itemPlural: 'позиций',
    noMenuMatch: 'По вашему запросу ничего не найдено.',
    itemDescriptionFallback: 'Свежеприготовлено в Bago Sushi & Asian To Go.',
    addItemsToCheckout: 'Добавьте позиции',
    addMoreAmount: 'Добавьте еще на {amount}',
    payWithPaypal: 'Оплатить через PayPal',
    nameValidation: 'Пожалуйста, укажите полное имя.',
    phoneValidationEmpty: 'Пожалуйста, укажите номер телефона.',
    phoneValidationInvalid: 'Введите корректный номер телефона (8-15 цифр).',
    statusAddItemFirst: 'Сначала добавьте хотя бы одну позицию.',
    statusMinimumGap: 'Минимальный заказ: {minimum}. Добавьте еще {gap}.',
    statusRedirecting: 'Переход в PayPal...'
  },
  ja: {
    navPopular: '人気',
    navMenu: 'メニュー',
    navDetails: '店舗情報',
    cartLabel: 'カート',
    heroCopy: 'Uber Eatsの最新データ（価格・画像）と同期しています。',
    startOrder: '注文を始める',
    viewCart: 'カートを見る',
    heroStatItems: 'メニュー項目',
    heroStatMinimum: '最低注文額',
    heroStatSource: '同期済み',
    popularEyebrow: 'おすすめ',
    popularTitle: 'よく注文される商品',
    menuEyebrow: '全メニュー',
    menuTitle: 'ロール、ボウル、バーガー、フライ、ドリンク',
    menuSynced: 'Uber Eatsから同期した商品',
    searchLabel: 'メニュー検索',
    searchPlaceholder: '例: サーモン、ブリトー、フライ...',
    checkoutEyebrow: 'チェックアウト',
    cartTitle: 'カート',
    emptyCart: '注文を始めるには商品を追加してください。',
    deliveryTitle: '配達',
    deliveryNote: 'Bago Sushiがまもなくお届けします。',
    contactTitle: '連絡先',
    nameLabel: '名前',
    phoneLabel: '電話番号',
    paymentTitle: '支払い',
    paymentHelp: 'チェックアウト後、EUR合計金額でPayPalに移動します。',
    subtotalLabel: '小計',
    deliveryFeeLabel: '配達料',
    serviceFeeLabel: 'サービス料',
    minimumGapLabel: '最低注文まで',
    totalLabel: '合計',
    cancelOrder: 'キャンセルしてホームへ戻る',
    detailsEyebrow: '店舗情報',
    detailsAddress: '住所: Luftgasse 1, 85049 Ingolstadt。配達対応。',
    hoursTitle: '営業時間',
    hoursWeekdays: '月-金',
    hoursSaturday: '土曜日',
    hoursSunday: '日曜日',
    closedLabel: '休業',
    legalEyebrow: '法的情報',
    legalTitle: '法的情報',
    legalImpressum: 'インプリント',
    legalDatenschutz: 'プライバシー',
    legalStreitbeilegung: '消費者紛争解決',
    closeButton: '閉じる',
    aboutEyebrow: '私たちについて',
    aboutTitle: 'Bago Sushi & Asia ToGoで新しい味を発見',
    aboutBody1: '寿司、バーガー、ブリトーなど、できたての料理をお楽しみください。',
    aboutBody2:
      '私たちはインゴルシュタット中心部（Luftgasse 1）にある小さなスタートアップです。創業者のPyayeは、寿司・バーガー・ブリトーなどで5年以上の経験を持つシェフです。',
    aboutBody3:
      'すべての料理を情熱と丁寧さを持って作り、品質を大切にしています。新鮮な食材と満足度の高いサービスを重視しています。',
    aboutBody4: '地域のお客様に、創造的な料理と適正価格、温かいおもてなしを届けることが目標です。',
    allLabel: 'すべて',
    itemSingle: '件',
    itemPlural: '件',
    noMenuMatch: '条件に一致する商品が見つかりません。',
    itemDescriptionFallback: 'Bago Sushi & Asian To Goで新鮮に調理。',
    addItemsToCheckout: '商品を追加',
    addMoreAmount: '{amount} 追加してください',
    payWithPaypal: 'PayPalで支払う',
    nameValidation: '氏名を入力してください。',
    phoneValidationEmpty: '電話番号を入力してください。',
    phoneValidationInvalid: '8〜15桁の有効な電話番号を入力してください。',
    statusAddItemFirst: 'まず商品を追加してください。',
    statusMinimumGap: '最低注文額は {minimum} です。あと {gap} 追加してください。',
    statusRedirecting: 'PayPalへ移動中...'
  },
  tr: {
    navPopular: 'Popüler',
    navMenu: 'Menü',
    navDetails: 'Detaylar',
    cartLabel: 'Sepet',
    heroCopy: 'Uber Eats verileriyle canlı senkron: güncel fiyatlar ve görseller.',
    startOrder: 'Siparişe Başla',
    viewCart: 'Sepeti Gör',
    heroStatItems: 'menü ürünü',
    heroStatMinimum: 'minimum sipariş',
    heroStatSource: 'kaynak senkron',
    popularEyebrow: 'Hızlı seçim',
    popularTitle: 'En çok sipariş edilenler',
    menuEyebrow: 'Tam menü',
    menuTitle: 'Roll, bowl, burger, patates, içecek',
    menuSynced: 'Uber Eats ile senkronlanan ürünler',
    searchLabel: 'Menüde ara',
    searchPlaceholder: 'Somon, burrito, patates ara...',
    checkoutEyebrow: 'Ödeme',
    cartTitle: 'Sepetin',
    emptyCart: 'Siparişe başlamak için ürün ekleyin.',
    deliveryTitle: 'Teslimat',
    deliveryNote: 'Bago Sushi siparişinizi yakında teslim edecek.',
    contactTitle: 'İletişim',
    nameLabel: 'Ad',
    phoneLabel: 'Telefon',
    paymentTitle: 'Ödeme',
    paymentHelp: 'Ödeme adımında toplam tutarla PayPal sayfasına yönlendirilirsiniz.',
    subtotalLabel: 'Ara toplam',
    deliveryFeeLabel: 'Teslimat',
    serviceFeeLabel: 'Servis',
    minimumGapLabel: 'Minimum için kalan',
    totalLabel: 'Toplam',
    cancelOrder: 'İptal et ve ana sayfaya dön',
    detailsEyebrow: 'Restoran detayları',
    detailsAddress: 'Adres: Luftgasse 1, 85049 Ingolstadt. Teslimat mevcut.',
    hoursTitle: 'Açılış saatleri',
    hoursWeekdays: 'Pzt-Cuma',
    hoursSaturday: 'Cumartesi',
    hoursSunday: 'Pazar',
    closedLabel: 'Kapalı',
    legalEyebrow: 'Yasal',
    legalTitle: 'Yasal bilgiler',
    legalImpressum: 'Impressum',
    legalDatenschutz: 'Gizlilik',
    legalStreitbeilegung: 'Tüketici uyuşmazlık çözümü',
    closeButton: 'Kapat',
    aboutEyebrow: 'Hakkımızda',
    aboutTitle: 'Bago Sushi & Asia ToGo ile yeni tatlar keşfedin',
    aboutBody1: 'Sushi, burger, burrito ve daha fazlası. Taze lezzetlerimizi deneyin.',
    aboutBody2:
      'Ingolstadt merkezinde, Luftgasse 1 adresinde küçük bir girişimiz. Kurucu şef Pyaye, sushi, burger, burrito ve diğer spesiyallerde 5+ yıllık deneyime sahip.',
    aboutBody3:
      'Her yemeği tutkuyla, özenle ve kalite odaklı hazırlıyoruz. Taze malzemeler ve müşteri memnuniyeti önceliğimizdir.',
    aboutBody4: 'Hedefimiz, mahallemize yaratıcı lezzetler, adil fiyatlar ve samimi misafirperverlik sunmaktır.',
    allLabel: 'Tümü',
    itemSingle: 'ürün',
    itemPlural: 'ürün',
    noMenuMatch: 'Aramaya uygun menü ürünü bulunamadı.',
    itemDescriptionFallback: 'Bago Sushi & Asian To Go tarafından taze hazırlanır.',
    addItemsToCheckout: 'Ürün ekleyin',
    addMoreAmount: '{amount} daha ekleyin',
    payWithPaypal: 'PayPal ile öde',
    nameValidation: 'Lütfen müşterinin tam adını girin.',
    phoneValidationEmpty: 'Lütfen telefon numarası girin.',
    phoneValidationInvalid: '8-15 haneli geçerli bir telefon numarası girin.',
    statusAddItemFirst: 'Önce en az bir ürün ekleyin.',
    statusMinimumGap: 'Minimum sipariş {minimum}. Lütfen {gap} daha ekleyin.',
    statusRedirecting: 'PayPal yönlendirmesi yapılıyor...'
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

const LEGAL_TEXT = {
  impressum: {
    de: {
      title: 'Impressum',
      paragraphs: [
        'Diensteanbieter: Bago Sushi & Asian To Go',
        'Anschrift: Luftgasse 1, 85049 Ingolstadt, Deutschland',
        'Kontakt: +49 1525 1003077, 072abhi@gmail.com',
        'Vertretungsberechtigte Person und Handelsregister/USt-ID bitte vor Live-Schaltung ergänzen.'
      ]
    },
    en: {
      title: 'Impressum',
      paragraphs: [
        'Service provider: Bago Sushi & Asian To Go',
        'Address: Luftgasse 1, 85049 Ingolstadt, Germany',
        'Contact: +49 1525 1003077, 072abhi@gmail.com',
        'Please complete authorized representative and register/VAT information before publishing.'
      ]
    },
    ru: {
      title: 'Impressum',
      paragraphs: [
        'Поставщик услуг: Bago Sushi & Asian To Go',
        'Адрес: Luftgasse 1, 85049 Ingolstadt, Германия',
        'Контакты: +49 1525 1003077, 072abhi@gmail.com',
        'Перед публикацией необходимо дополнить данные о представителе и регистрации/НДС.'
      ]
    },
    ja: {
      title: 'Impressum',
      paragraphs: [
        '事業者: Bago Sushi & Asian To Go',
        '住所: Luftgasse 1, 85049 Ingolstadt, Germany',
        '連絡先: +49 1525 1003077, 072abhi@gmail.com',
        '公開前に代表者名および登記/VAT情報を補完してください。'
      ]
    },
    tr: {
      title: 'Impressum',
      paragraphs: [
        'Hizmet sağlayıcı: Bago Sushi & Asian To Go',
        'Adres: Luftgasse 1, 85049 Ingolstadt, Almanya',
        'İletişim: +49 1525 1003077, 072abhi@gmail.com',
        'Yayın öncesinde yetkili kişi ve sicil/KDV bilgilerini tamamlayın.'
      ]
    }
  },
  datenschutz: {
    de: {
      title: 'Datenschutz',
      paragraphs: [
        'Diese Website verarbeitet personenbezogene Daten zur Bestellabwicklung (Name, Telefon, Warenkorb) auf Basis von Art. 6 Abs. 1 lit. b DSGVO.',
        'Technisch notwendige Speicherung: Der Warenkorb wird lokal im Browser gespeichert. Es werden keine Marketing- oder Tracking-Cookies gesetzt.',
        'Betroffenenrechte: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch sowie Beschwerde bei einer Aufsichtsbehörde.'
      ]
    },
    en: {
      title: 'Privacy',
      paragraphs: [
        'This website processes personal data for order handling (name, phone, cart) based on Art. 6(1)(b) GDPR.',
        'Technically required storage: the cart is stored in the local browser. No marketing or tracking cookies are set.',
        'Data subject rights include access, correction, deletion, restriction, objection, and complaint to a supervisory authority.'
      ]
    },
    ru: {
      title: 'Конфиденциальность',
      paragraphs: [
        'Сайт обрабатывает персональные данные для оформления заказа (имя, телефон, корзина) на основании ст. 6(1)(b) GDPR.',
        'Технически необходимое хранение: корзина сохраняется локально в браузере. Маркетинговые и трекинговые cookie не используются.',
        'Права субъекта данных: доступ, исправление, удаление, ограничение, возражение и жалоба в надзорный орган.'
      ]
    },
    ja: {
      title: 'プライバシー',
      paragraphs: [
        '本サイトは注文処理（氏名・電話番号・カート）のために個人データを処理します（GDPR 第6条1項b）。',
        '技術的に必要な保存: カートはブラウザ内に保存されます。マーケティング/トラッキングCookieは使用しません。',
        '利用者には、開示・訂正・削除・処理制限・異議申立て・監督機関への苦情申立ての権利があります。'
      ]
    },
    tr: {
      title: 'Gizlilik',
      paragraphs: [
        'Bu web sitesi, sipariş işlemleri için kişisel verileri (ad, telefon, sepet) GDPR Madde 6(1)(b) kapsamında işler.',
        'Teknik olarak gerekli depolama: sepet tarayıcıda yerel olarak saklanır. Pazarlama veya takip çerezi kullanılmaz.',
        'Veri sahibi hakları: erişim, düzeltme, silme, kısıtlama, itiraz ve denetim makamına şikayet.'
      ]
    }
  },
  streitbeilegung: {
    de: {
      title: 'Verbraucherstreitbeilegung',
      paragraphs: [
        'Hinweis nach § 36 VSBG: Bago Sushi & Asian To Go ist derzeit nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        'Hinweis zur EU-OS-Plattform: Die europäische Online-Streitbeilegungsplattform wurde am 20. Juli 2025 eingestellt.'
      ]
    },
    en: {
      title: 'Consumer dispute resolution',
      paragraphs: [
        'Notice under Section 36 VSBG: Bago Sushi & Asian To Go is currently neither willing nor obliged to participate in dispute resolution before a consumer arbitration board.',
        'EU ODR platform notice: the European Online Dispute Resolution platform was discontinued on July 20, 2025.'
      ]
    },
    ru: {
      title: 'Разрешение потребительских споров',
      paragraphs: [
        'Согласно §36 VSBG, Bago Sushi & Asian To Go в настоящее время не обязана и не готова участвовать в процедурах урегулирования споров через потребительскую арбитражную организацию.',
        'Платформа ЕС ODR была закрыта 20 июля 2025 года.'
      ]
    },
    ja: {
      title: '消費者紛争解決',
      paragraphs: [
        'VSBG第36条に基づき、Bago Sushi & Asian To Goは現在、消費者仲裁機関での紛争解決手続きに参加する意思および義務はありません。',
        'EUのODRプラットフォームは2025年7月20日に終了しました。'
      ]
    },
    tr: {
      title: 'Tüketici uyuşmazlık çözümü',
      paragraphs: [
        '§36 VSBG uyarınca Bago Sushi & Asian To Go, tüketici hakem heyeti önündeki uyuşmazlık çözüm süreçlerine katılmaya hazır veya yükümlü değildir.',
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
  activeLegalKey: null
};

let money = buildMoneyFormatter(state.language);

const categoryTabs = document.querySelector('#categoryTabs');
const menuSections = document.querySelector('#menuSections');
const popularGrid = document.querySelector('#popularGrid');
const menuSearch = document.querySelector('#menuSearch');
const menuCount = document.querySelector('#menuCount');
const heroItemCount = document.querySelector('#heroItemCount');
const heroImage = document.querySelector('#heroImage');

const cartPanel = document.querySelector('#cartPanel');
const cartBackdrop = document.querySelector('#cartBackdrop');
const cartToggle = document.querySelector('#cartToggle');
const closeCart = document.querySelector('#closeCart');
const jumpCart = document.querySelector('#jumpCart');
const cancelOrderButton = document.querySelector('#cancelOrder');

const cartItems = document.querySelector('#cartItems');
const emptyCart = document.querySelector('#emptyCart');
const cartCount = document.querySelector('#cartCount');
const subtotalEl = document.querySelector('#subtotal');
const deliveryFeeEl = document.querySelector('#deliveryFee');
const serviceFeeEl = document.querySelector('#serviceFee');
const minimumRow = document.querySelector('#minimumRow');
const minimumGapEl = document.querySelector('#minimumGap');
const totalEl = document.querySelector('#total');

const checkoutButton = document.querySelector('#checkoutButton');
const checkoutForm = document.querySelector('#checkoutForm');
const formStatus = document.querySelector('#formStatus');
const nameInput = checkoutForm.elements.name;
const phoneInput = checkoutForm.elements.phone;

const languageToggle = document.querySelector('#languageToggle');
const languageMenu = document.querySelector('#languageMenu');
const languageLabel = document.querySelector('#languageLabel');

const legalModal = document.querySelector('#legalModal');
const legalModalTitle = document.querySelector('#legalModalTitle');
const legalModalContent = document.querySelector('#legalModalContent');
const legalModalClose = document.querySelector('#legalModalClose');
const legalModalCancel = document.querySelector('#legalModalCancel');

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

  languageLabel.textContent = LANGUAGE_NAMES[state.language] || 'German';
  languageMenu.querySelectorAll('[data-language]').forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-checked', String(active));
  });

  if (state.activeLegalKey) {
    renderLegalContent(state.activeLegalKey);
  }
}

function applyLanguage() {
  money = buildMoneyFormatter(state.language);
  applyStaticTranslations();
  renderCategoryTabs();
  renderOrderSurfaces();
}

function loadCart() {
  const saved = JSON.parse(localStorage.getItem('bagoCart') || '{}');
  return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) => itemById.has(id) && quantity > 0));
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

function itemDescription(item) {
  return item.description || t('itemDescriptionFallback');
}

function renderMedia(item) {
  if (!item.image) return '';

  return `
      <div class="food-media">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" />
      </div>
    `;
}

function getQuantity(itemId) {
  return state.cart[itemId] || 0;
}

function renderStepper(itemId, label) {
  const quantity = getQuantity(itemId);

  if (!quantity) {
    return `<button class="add-button" type="button" data-add="${itemId}" aria-label="Add ${escapeHtml(label)}">+</button>`;
  }

  return `
    <div class="quantity-stepper" aria-label="${escapeHtml(label)} quantity">
      <button type="button" data-decrease="${itemId}" aria-label="Remove one ${escapeHtml(label)}">−</button>
      <span>${quantity}</span>
      <button type="button" data-increase="${itemId}" aria-label="Add one ${escapeHtml(label)}">+</button>
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
          ${escapeHtml(category.name)} ${count}
        </button>
      `;
    })
  ];

  categoryTabs.innerHTML = tabs.join('');
}

function matchesSearch(item, category, query) {
  if (!query) return true;
  return [item.name, item.description, category.name, category.description].join(' ').toLowerCase().includes(query);
}

function renderMenuCard(item) {
  const hasMediaClass = item.image ? 'has-media' : '';
  return `
    <article class="menu-card ${hasMediaClass}">
      ${renderMedia(item)}
      <div class="menu-card-body">
        <div class="menu-card-title">
          <h4>${escapeHtml(item.name)}</h4>
          <span class="price">${money.format(item.price)}</span>
        </div>
        <p>${escapeHtml(itemDescription(item))}</p>
        <div class="item-actions">
          <span>${escapeHtml(item.categoryName)}</span>
          ${renderStepper(item.id, item.name)}
        </div>
      </div>
    </article>
  `;
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
              <h3>${escapeHtml(category.name)}</h3>
              ${category.description ? `<p>${escapeHtml(category.description)}</p>` : ''}
            </div>
            <span>${category.items.length} ${escapeHtml(countLabel)}</span>
          </div>
          <div class="item-grid">
            ${category.items.map(renderMenuCard).join('')}
          </div>
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
      return `
        <article class="popular-card ${hasMediaClass}">
          ${renderMedia(item)}
          <div class="popular-card-content">
            <div>
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(itemDescription(item))}</p>
            </div>
            <div class="price-row">
              <span class="price">${money.format(item.price)}</span>
              ${renderStepper(item.id, item.name)}
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
  const subtotal = getCartLines().reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasItems = subtotal > 0;
  const delivery = hasItems ? BAGO_VENUE.deliveryBase : 0;
  const rawService = subtotal * BAGO_VENUE.serviceFeePercent;
  const service = hasItems ? Math.min(BAGO_VENUE.serviceFeeMax, Math.max(BAGO_VENUE.serviceFeeMin, rawService)) : 0;
  const minimumGap = Math.max(0, BAGO_VENUE.orderMinimum - subtotal);

  return {
    subtotal,
    delivery,
    service,
    minimumGap,
    total: subtotal + delivery + service
  };
}

function setFieldValidity(input, message) {
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

function validateCheckoutFields() {
  const validators = [validateName, validatePhone];
  return validators.map((validate) => validate()).every(Boolean);
}

function renderCart() {
  const lines = getCartLines();
  const totals = getTotals();
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);

  cartItems.innerHTML = lines
    .map(
      (item) => `
        <article class="cart-line">
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${money.format(item.price)} each</p>
          </div>
          ${renderStepper(item.id, item.name)}
        </article>
      `
    )
    .join('');

  emptyCart.hidden = lines.length > 0;
  cartCount.textContent = totalQuantity;
  subtotalEl.textContent = money.format(totals.subtotal);
  deliveryFeeEl.textContent = money.format(totals.delivery);
  serviceFeeEl.textContent = money.format(totals.service);
  minimumGapEl.textContent = money.format(totals.minimumGap);
  minimumRow.classList.toggle('is-hidden', !lines.length || totals.minimumGap === 0);
  totalEl.textContent = money.format(totals.total);

  checkoutButton.disabled = !lines.length || totals.minimumGap > 0;
  if (!lines.length) {
    checkoutButton.textContent = t('addItemsToCheckout');
  } else if (totals.minimumGap > 0) {
    checkoutButton.textContent = formatT('addMoreAmount', { amount: money.format(totals.minimumGap) });
  } else {
    checkoutButton.textContent = t('payWithPaypal');
  }
}

function renderOrderSurfaces() {
  renderPopular();
  renderMenu();
  renderCart();
}

function addItem(id) {
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
}

function resetOrder() {
  state.cart = {};
  saveCart();
  checkoutForm.reset();
  checkoutForm.classList.remove('was-validated');
  formStatus.textContent = '';
  renderOrderSurfaces();
}

function buildPaypalUrl(totalAmount, orderNumber) {
  const params = new URLSearchParams({
    cmd: '_xclick',
    business: BAGO_VENUE.paypalEmail,
    item_name: `Bago Sushi Order #${orderNumber}`,
    currency_code: 'EUR',
    amount: totalAmount.toFixed(2),
    no_shipping: '1',
    charset: 'UTF-8',
    lc: 'DE'
  });

  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
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
});

menuSearch.addEventListener('input', () => {
  state.search = menuSearch.value;
  renderMenu();
});

cartToggle.addEventListener('click', () => setCartOpen(true));
jumpCart.addEventListener('click', () => setCartOpen(true));
closeCart.addEventListener('click', () => setCartOpen(false));
cartBackdrop.addEventListener('click', () => setCartOpen(false));

cancelOrderButton.addEventListener('click', () => {
  resetOrder();
  setCartOpen(false);
  window.location.hash = '#home';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

checkoutForm.addEventListener('input', () => {
  validateCheckoutFields();
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  checkoutForm.classList.add('was-validated');
  const totals = getTotals();

  if (!getCartLines().length) {
    formStatus.textContent = t('statusAddItemFirst');
    return;
  }

  if (totals.minimumGap > 0) {
    formStatus.textContent = formatT('statusMinimumGap', {
      minimum: money.format(BAGO_VENUE.orderMinimum),
      gap: money.format(totals.minimumGap)
    });
    return;
  }

  validateCheckoutFields();
  if (!checkoutForm.reportValidity()) {
    return;
  }

  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const paypalUrl = buildPaypalUrl(totals.total, orderNumber);
  formStatus.textContent = t('statusRedirecting');
  window.location.href = paypalUrl;
});

languageToggle.addEventListener('click', () => {
  toggleLanguageMenu();
});

legalModalClose.addEventListener('click', closeLegalModal);
legalModalCancel.addEventListener('click', closeLegalModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setCartOpen(false);
    closeLanguageMenu();
    closeLegalModal();
  }
});

if (heroImage && BAGO_VENUE.heroImage) {
  heroImage.src = BAGO_VENUE.heroImage;
}

menuCount.textContent = menuItems.length;
heroItemCount.textContent = menuItems.length;
applyLanguage();
