/**
 * Общие сведения о книге «Монтаж звука в кино» для страницы /book/.
 * Главы лежат в src/data/book/chapters.json (коллекция bookChapters
 * в src/content.config.ts), страницы для чтения — в src/data/book/pages.json.
 */
export const BOOK = {
  title: 'Монтаж звука в кино',
  /** Автор — настоящее имя, не псевдоним сайта. */
  author: { name: 'Илья Пушкин', genitive: 'Ильи Пушкина' },
  description:
    'Книга о звуке в кинопроизводстве простым языком: от того, как звук устроен в цифре, до сведения и сдачи фонограммы. Для начинающих звукорежиссёров и монтажёров — объяснение механизма, затем пример из практики.',
  status: 'В работе — публикуется по главам',
  /** Постер книги (обложка, обрезанная под A4, 760×1075). */
  cover: { url: '/assets/images/book/cover-v2.webp', width: 760, height: 1075 },
  /** PDF всей книги. Пока пусто — кнопка «Скачать книгу» показана неактивной с пометкой «скоро». */
  fullPdf: '',
  /** Части книги в порядке оглавления; глава ссылается на часть полем part. */
  parts: [
    { id: 'I', numeral: 'I', title: 'Компьютер как студия' },
    { id: 'II', numeral: 'II', title: 'Слои фонограммы' },
    { id: 'III', numeral: 'III', title: 'Прослушивание, обработка, сведение' },
    { id: 'IV', numeral: 'IV', title: 'Озвучивание, новые средства и сдача' },
  ],
  license: {
    name: 'CC BY-NC-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.ru',
  },
  feedback: {
    telegram: { label: '@itsptashka', href: 'https://t.me/itsptashka' },
    email: { label: 'pushkinilya2004@mail.ru', href: 'mailto:pushkinilya2004@mail.ru' },
    /** Ссылка на форму обратной связи. Пока пусто — на странице выводится «скоро». */
    formUrl: '',
  },
} as const;

type ChapterLike = { number: number; title: string; kind?: string; label?: string };

/** Короткая метка в оглавлении: «01», «А», «—». */
export function chapterMark(ch: ChapterLike): string {
  if (ch.kind === 'appendix') return ch.label ?? '';
  if (ch.kind === 'references') return '—';
  return String(ch.number).padStart(2, '0');
}

/** Вид раздела: «Глава 1», «Приложение А» или пусто для списка источников. */
export function chapterKind(ch: ChapterLike): string {
  if (ch.kind === 'appendix') return `Приложение ${ch.label ?? ''}`.trim();
  if (ch.kind === 'references') return '';
  return `Глава ${ch.number}`;
}

/** Полное название: «Глава 1. Звук в цифре», «Приложение А. …», «Список …». */
export function chapterName(ch: ChapterLike): string {
  const kind = chapterKind(ch);
  return kind ? `${kind}. ${ch.title}` : ch.title;
}
