// Сжимает постеры релизов до размера, в котором они реально показываются (карточка ~132–290 px).
// Запуск: node scripts/optimize-posters.mjs — безопасно повторять, уже сжатые файлы пропускаются.
// Оригиналы стоит хранить в source-assets/images/posters (папка не публикуется).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/assets/images/posters';
const MAX_WIDTH = 480;
const QUALITY = 80;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

let before = 0;
let after = 0;

for (const file of walk(ROOT).filter((path) => path.endsWith('.webp'))) {
  const input = readFileSync(file);
  const { width = 0 } = await sharp(input).metadata();
  before += input.length;

  if (width <= MAX_WIDTH) {
    after += input.length;
    continue;
  }

  const output = await sharp(input)
    .resize({ width: MAX_WIDTH })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  writeFileSync(file, output);
  after += output.length;
}

console.log(`Posters: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
