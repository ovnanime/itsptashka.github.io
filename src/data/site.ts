export const SITE = {
  name: 'Феофилакт Птахен',
  url: 'https://ptahen.ru',
  defaultTitle: 'Феофилакт Птахен',
  defaultDescription: 'Актёр озвучивания и звукорежиссёр',
  copyrightStartYear: 2023,
} as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Главная' },
  { href: '/works/', label: 'Работы' },
  { href: '/about/', label: 'Обо мне' },
  { href: '/contact/', label: 'Контакты' },
] as const;

export const CONTACTS = [
  {
    label: 'Telegram',
    value: '@itsptashka',
    text: 'Самый быстрый способ связаться по проекту.',
    href: 'https://t.me/itsptashka',
    footerLabel: 'Telegram',
  },
  {
    label: 'ВКонтакте',
    value: '@itsptashka',
    text: 'Для сообщений, проектов и связи через VK.',
    href: 'https://vk.com/itsptashka',
    footerLabel: 'VK',
  },
  {
    label: 'Почта',
    value: 'pushkinilya2004@mail.ru',
    text: 'Рабочая почта для предложений, материалов и ТЗ.',
    href: 'mailto:pushkinilya2004@mail.ru',
    footerLabel: 'Email',
  },
] as const;

/**
 * Счётчики аналитики. Загружаются только после согласия в плашке cookie
 * (src/components/ConsentAnalytics.astro) и только на боевом домене.
 * Пустое значение — счётчик не подключается.
 */
export const ANALYTICS = {
  /** Номер счётчика Яндекс Метрики. */
  yandexMetrika: 114414164,
  /** Контейнер Google Tag Manager (GA4 и другие теги настраиваются внутри контейнера). */
  googleTagManager: 'GTM-KWHDF5HM',
  /** Идентификатор Google Analytics 4 вида G-XXXXXXXXXX — если подключать GA напрямую, без GTM. */
  googleAnalytics: '',
} as const;
