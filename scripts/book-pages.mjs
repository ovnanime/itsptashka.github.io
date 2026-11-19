// Готовит страницы глав книги для чтения на сайте (/book/read/<id>/).
// Запуск (только на Mac): npm run book:pages — после того как PDF главы
// положен в public/book/ и глава отмечена "ready" в src/data/book/chapters.json.
//
// Для каждой готовой главы две вёрстки:
// - компьютер: PDF из public/book/ → WebP в public/book/pages/<id>/001.webp…
// - телефон: та же глава, собранная заново из исходников Typst на узкой
//   странице в одну колонку (scripts/book-mobile.py) → public/book/pages/<id>/m/001.webp…
// Число страниц и размеры пишутся в src/data/book/pages.json.
//
// Для телефонной вёрстки нужны исходники книги и Python с пакетом typst.
// Пути задаются в локальном .env (он не попадает в git):
//   BOOK_SOURCE=/путь/к/Монтаж звука/source
//   BOOK_PYTHON=.book-venv/bin/python
// Без них телефонная вёрстка пропускается, и на телефоне показываются обычные страницы.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const DESKTOP_WIDTH = 1400;
const MOBILE_WIDTH = 760;
const QUALITY = 80;

// Простое чтение .env: строки вида KEY=value.
const env = { ...process.env };
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (match && !(match[1] in process.env)) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}
const bookSource = env.BOOK_SOURCE;
const bookPython = env.BOOK_PYTHON || 'python3';
const mobileEnabled = Boolean(bookSource && existsSync(join(bookSource, 'template.typ')));
if (!mobileEnabled) {
  console.warn('Телефонная вёрстка пропущена: задайте BOOK_SOURCE (и BOOK_PYTHON) в .env.');
}

async function renderPdf(pdf, outDir, width) {
  const tmp = mkdtempSync(join(tmpdir(), 'book-pages-'));
  try {
    execFileSync('swift', ['scripts/pdf-pages.swift', pdf, tmp, String(width)], {
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });

    const pngs = readdirSync(tmp).filter((name) => name.endsWith('.png')).sort();
    let size = { width: 0, height: 0 };
    let bytes = 0;
    for (const name of pngs) {
      const info = await sharp(join(tmp, name))
        .webp({ quality: QUALITY })
        .toFile(join(outDir, name.replace('.png', '.webp')));
      size = { width: info.width, height: info.height };
      bytes += info.size;
    }
    return { pages: pngs.length, ...size, bytes };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

const chapters = JSON.parse(readFileSync('src/data/book/chapters.json', 'utf8'));
const manifest = {};
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

for (const chapter of chapters.filter((ch) => ch.status === 'ready' && ch.pdf)) {
  const outDir = join('public/book/pages', chapter.id);
  const desktop = await renderPdf(join('public', chapter.pdf), outDir, DESKTOP_WIDTH);
  const entry = { pages: desktop.pages, width: desktop.width, height: desktop.height };
  let line = `${chapter.id}: ${desktop.pages} стр. (${mb(desktop.bytes)} МБ)`;

  if (mobileEnabled && chapter.kind !== 'appendix' && chapter.kind !== 'references') {
    const tmp = mkdtempSync(join(tmpdir(), 'book-mobile-'));
    try {
      const pdf = join(tmp, 'mobile.pdf');
      execFileSync(bookPython, ['-I', resolve('scripts/book-mobile.py'), bookSource, String(chapter.number), pdf], {
        stdio: ['ignore', 'inherit', 'inherit'],
      });
      // m/ лежит внутри папки главы: рендер компьютерной версии выше уже очистил её.
      const mobile = await renderPdf(pdf, join(outDir, 'm'), MOBILE_WIDTH);
      entry.mobile = { pages: mobile.pages, width: mobile.width, height: mobile.height };
      line += `, телефон: ${mobile.pages} стр. (${mb(mobile.bytes)} МБ)`;
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }

  manifest[chapter.id] = entry;
  console.log(line);
}

writeFileSync('src/data/book/pages.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Готово: src/data/book/pages.json');
