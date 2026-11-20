// Картинки превью ссылок (Open Graph) для мессенджеров и соцсетей: JPG 1200×630.
// Запуск (на Mac — нужен шрифт Helvetica Neue): node scripts/og-images.mjs
// Пересобирать после смены фото или обложки книги.
//
// - public/assets/images/og/site.jpg — общее превью сайта (фото + имя);
// - public/assets/images/og/book.jpg — превью книги и её глав (обложка + название).
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const W = 1200;
const H = 630;
const BG = '#0a0a0a';
const FONT = 'Helvetica Neue';
const OUT = 'public/assets/images/og';
mkdirSync(OUT, { recursive: true });

const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const text = (x, y, size, weight, fill, value, spacing = 0) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" letter-spacing="${spacing}">${esc(value)}</text>`;
const svg = (body) => Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`);

// ---------- Сайт: текст слева, фото справа с мягким переходом в фон ----------
{
  const photoH = H;
  const photo = await sharp('public/assets/images/avatar_ptaxen.webp').resize({ height: photoH }).toBuffer();
  const { width: photoW } = await sharp(photo).metadata();
  const photoX = W - photoW;

  const fade = svg(`
    <defs><linearGradient id="f" x1="0" x2="1">
      <stop offset="0" stop-color="${BG}" stop-opacity="1"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient></defs>
    <rect x="${photoX}" y="0" width="260" height="${H}" fill="url(#f)"/>`);

  const copy = svg(`
    ${text(72, 196, 22, 700, '#969692', 'АКТЁР ОЗВУЧИВАНИЯ · ЗВУКОРЕЖИССЁР', 4)}
    ${text(68, 290, 76, 700, '#ffffff', 'Феофилакт')}
    ${text(68, 372, 76, 700, '#ffffff', 'Птахен')}
    ${text(72, 438, 28, 400, '#bdbdb8', 'Озвучивание, дубляж, звук для кино')}
    ${text(72, 548, 24, 700, '#ededeb', 'ptahen.ru')}`);

  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite([
      { input: photo, left: photoX, top: 0 },
      { input: fade, left: 0, top: 0 },
      { input: copy, left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/site.jpg`);
}

// ---------- Книга: обложка слева, название справа ----------
{
  const coverH = 530;
  const cover = await sharp('public/assets/images/book/cover-v2.webp').resize({ height: coverH }).toBuffer();
  const { width: coverW } = await sharp(cover).metadata();
  const coverX = 72;
  const coverY = (H - coverH) / 2;
  const tx = coverX + coverW + 64;

  const frame = svg(`<rect x="${coverX - 0.5}" y="${coverY - 0.5}" width="${coverW + 1}" height="${coverH + 1}" rx="6" fill="none" stroke="#2a2a2a"/>`);
  const copy = svg(`
    ${text(tx, 200, 22, 700, '#969692', 'КНИГА · ИЛЬЯ ПУШКИН', 4)}
    ${text(tx - 3, 292, 72, 700, '#ffffff', 'Монтаж звука')}
    ${text(tx - 3, 370, 72, 700, '#ffffff', 'в кино')}
    ${text(tx, 432, 28, 400, '#bdbdb8', 'Теория · Практика · Технологии')}
    ${text(tx, 540, 24, 700, '#ededeb', 'Читать по главам — ptahen.ru/book')}`);

  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite([
      { input: cover, left: coverX, top: coverY },
      { input: frame, left: 0, top: 0 },
      { input: copy, left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/book.jpg`);
}

console.log(`Готово: ${OUT}/site.jpg, ${OUT}/book.jpg`);
