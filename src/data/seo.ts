import { SITE } from './site';

/**
 * Стабильные @id сущностей. Все страницы ссылаются на одного и того же
 * человека и на один и тот же сайт, а не создают новые сущности.
 */
export const PERSON_ID = `${SITE.url}/#person`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** Единое дефолтное изображение для соцсетей. Реальный файл из public/. */
export const DEFAULT_OG_IMAGE = {
  url: '/assets/images/avatar_ptaxen.webp',
  width: 1308,
  height: 1086,
  alt: 'Феофилакт Птахен',
} as const;

/**
 * Канонический формат URL проекта — со слешем на конце: GitHub Pages
 * отдаёт 301 с /works на /works/, поэтому именно версия со слешем
 * является фактической.
 */
export function canonicalPath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  return clean === '' ? '/' : `${clean}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).href;
}

export function canonicalUrl(pathname: string): string {
  return absoluteUrl(canonicalPath(pathname));
}

/**
 * Токены подтверждения прав в панелях вебмастеров.
 *
 * Сюда вставляются РЕАЛЬНЫЕ значения, выданные Google Search Console и
 * Яндекс Вебмастером. Пока строка пустая, соответствующий тег в <head>
 * не выводится вовсе — выдуманный токен только сломал бы подтверждение.
 */
export const VERIFICATION = {
  google: '',
  yandex: '',
} as const;

/** Реально подтверждённые публичные профили владельца сайта. */
const SAME_AS = [
  'https://t.me/itsptashka',
  'https://vk.com/itsptashka',
  'https://github.com/ovnanime',
];

/** Сущность человека. Используется всеми страницами через один @id. */
export const personSchema = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Илья Сергеевич Пушкин',
  alternateName: ['Феофилакт Птахен', 'Камергер Пушкин'],
  givenName: 'Илья',
  familyName: 'Пушкин',
  jobTitle: ['Актёр озвучивания', 'Звукорежиссёр'],
  description:
    'Актёр озвучивания и звукорежиссёр. Работает под псевдонимом Феофилакт Птахен: озвучивание, дубляж, закадровое озвучивание, локализация, саунд-дизайн и сведение.',
  birthDate: '2004-06-03',
  birthPlace: {
    '@type': 'Place',
    name: 'Гагарин, Смоленская область',
  },
  knowsAbout: [
    'Озвучивание',
    'Дубляж',
    'Закадровое озвучивание',
    'Локализация',
    'Звукорежиссура',
    'Саунд-дизайн',
    'Сведение и постпродакшн',
  ],
  url: `${SITE.url}/`,
  mainEntityOfPage: `${SITE.url}/about/`,
  image: {
    '@type': 'ImageObject',
    url: absoluteUrl(DEFAULT_OG_IMAGE.url),
    width: DEFAULT_OG_IMAGE.width,
    height: DEFAULT_OG_IMAGE.height,
  },
  sameAs: SAME_AS,
} as const;

/** Сущность сайта. */
export const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE.url}/`,
  name: SITE.name,
  alternateName: 'ptahen.ru',
  description:
    'Официальный персональный сайт Ильи Сергеевича Пушкина (Феофилакт Птахен).',
  inLanguage: 'ru-RU',
  publisher: { '@id': PERSON_ID },
  about: { '@id': PERSON_ID },
  copyrightHolder: { '@id': PERSON_ID },
} as const;
