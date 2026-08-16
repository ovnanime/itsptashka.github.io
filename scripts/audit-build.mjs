import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const distDir = resolve('dist');

if (!existsSync(distDir)) {
  console.error('Build audit failed: dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  });

const htmlFiles = walk(distDir).filter((path) => extname(path) === '.html');
const failures = [];

const report = (file, message) => {
  failures.push(`${relative(distDir, file)}: ${message}`);
};

const localTargetExists = (value) => {
  const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  const relativePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const exactPath = join(distDir, relativePath);

  if (existsSync(exactPath)) return true;
  if (existsSync(join(exactPath, 'index.html'))) return true;
  if (!extname(exactPath) && existsSync(`${exactPath}.html`)) return true;

  return false;
};

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');

  if (!/<html\b[^>]*\blang=["']ru["']/i.test(html)) report(file, 'missing html lang="ru"');
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) report(file, 'missing non-empty title');
  if (!/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']+["']/i.test(html)) {
    report(file, 'missing non-empty meta description');
  }
  if (!/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']+["']/i.test(html)) {
    report(file, 'missing robots directive');
  }
  if (!/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']https:\/\/ptahen\.ru\//i.test(html)) {
    report(file, 'missing absolute canonical URL');
  }

  for (const property of ['og:title', 'og:description', 'og:url']) {
    const escapedProperty = property.replace(':', '\\:');
    const pattern = new RegExp(`<meta\\b[^>]*\\bproperty=["']${escapedProperty}["'][^>]*\\bcontent=["'][^"']+["']`, 'i');
    if (!pattern.test(html)) report(file, `missing ${property} metadata`);
  }

  const mainCount = [...html.matchAll(/<main\b/gi)].length;
  if (mainCount !== 1) report(file, `expected exactly one main landmark, found ${mainCount}`);

  const headingCount = [...html.matchAll(/<h1\b/gi)].length;
  if (headingCount !== 1) report(file, `expected exactly one h1, found ${headingCount}`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) report(file, `duplicate id values: ${duplicateIds.join(', ')}`);

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    if (!/\balt=["'][^"']*["']/i.test(attributes)) report(file, 'image without alt attribute');
    if (!/\bdata-image-viewer-image\b/i.test(attributes)) {
      if (!/\bwidth=["']\d+["']/i.test(attributes) || !/\bheight=["']\d+["']/i.test(attributes)) {
        report(file, 'image without numeric width and height');
      }
    }
  }

  for (const match of html.matchAll(/\b(?:href|src|poster)=["']([^"']+)["']/gi)) {
    const value = match[1].trim();
    if (!value || /^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(value)) continue;
    if (!localTargetExists(value)) report(file, `missing local target: ${value}`);
  }

  for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attributes = match[1];
    if (/\btarget=["']_blank["']/i.test(attributes) && !/\brel=["'][^"']*\bnoopener\b[^"']*["']/i.test(attributes)) {
      report(file, 'target="_blank" link without rel="noopener"');
    }
  }
}

if (failures.length) {
  console.error(`Build audit failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Build audit passed: ${htmlFiles.length} HTML pages checked.`);
