// Готовит страницы глав книги для чтения на сайте (/book/read/<id>/).
// Запуск (только на Mac): npm run book:pages — после того как PDF главы
// положен в public/book/ и глава отмечена "ready" в src/data/book/chapters.json.
//
// Для каждой готовой главы: PDF → PNG (PDFKit, scripts/pdf-pages.swift) →
// WebP в public/book/pages/<id>/001.webp… и запись числа страниц и их
// размеров в src/data/book/pages.json. Повторный запуск пересобирает всё.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const WIDTH = 1400;
const QUALITY = 80;

const chapters = JSON.parse(readFileSync('src/data/book/chapters.json', 'utf8'));
const manifest = {};

for (const chapter of chapters.filter((ch) => ch.status === 'ready' && ch.pdf)) {
  const tmp = mkdtempSync(join(tmpdir(), `book-${chapter.id}-`));
  const outDir = join('public/book/pages', chapter.id);

  try {
    execFileSync('swift', ['scripts/pdf-pages.swift', join('public', chapter.pdf), tmp, String(WIDTH)], {
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

    manifest[chapter.id] = { pages: pngs.length, ...size };
    console.log(`${chapter.id}: ${pngs.length} стр., ${(bytes / 1024 / 1024).toFixed(1)} МБ`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

writeFileSync('src/data/book/pages.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Готово: src/data/book/pages.json');
