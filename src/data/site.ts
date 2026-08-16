export const SITE = {
  name: 'Феофилакт Птахен',
  url: 'https://ptahen.ru',
  defaultTitle: 'Феофилакт Птахен',
  defaultDescription: 'Актёр озвучивания и звукорежиссёр',
  copyrightStartYear: 2023,
} as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Главная' },
  { href: '/works', label: 'Работы' },
  { href: '/approach', label: 'Подход' },
  { href: '/about', label: 'Обо мне' },
  { href: '/journal', label: 'Публикации' },
  { href: '/contact', label: 'Контакты' },
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
