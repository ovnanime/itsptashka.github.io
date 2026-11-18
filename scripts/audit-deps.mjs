// Проверка зависимостей перед деплоем: падает на уязвимостях high и critical.
//
// ALLOWLIST — осознанные исключения. Добавлять сюда только уязвимость,
// для которой нет исправленной версии и которая не затрагивает опубликованный
// сайт. У каждой записи — причина и дата пересмотра. Как только выйдет
// исправление — обновить зависимость и удалить запись.
import { execFileSync } from 'node:child_process';

const ALLOWLIST = {
  // picomatch <= 4.0.7: ReDoS на специально составленной маске.
  // Исправленной версии нет (ноябрь 2026). picomatch работает только при
  // сборке на сервере GitHub с файлами самого проекта и в сайт не попадает.
  // Пересмотреть: при выходе picomatch 4.0.8+ или к 2027-02-01.
  'https://github.com/advisories/GHSA-fc5q-39xc-vjpf': 'picomatch ReDoS, нет исправления',
};

const BLOCKING = new Set(['high', 'critical']);

let raw;
try {
  raw = execFileSync('npm', ['audit', '--omit=dev', '--json'], { encoding: 'utf8' });
} catch (error) {
  // npm audit выходит с ненулевым кодом, когда находит уязвимости, но JSON всё равно печатает.
  raw = error.stdout;
}

const report = JSON.parse(raw || '{}');
const advisories = new Map();

for (const [name, vulnerability] of Object.entries(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via ?? []) {
    if (typeof via !== 'object') continue;
    advisories.set(via.url, { name, title: via.title, severity: via.severity });
  }
}

const blocking = [];
const allowed = [];

for (const [url, advisory] of advisories) {
  if (!BLOCKING.has(advisory.severity)) continue;
  (ALLOWLIST[url] ? allowed : blocking).push({ url, ...advisory });
}

for (const item of allowed) {
  console.log(`Allowed (${item.severity}): ${item.name} — ${item.title} — ${item.url}`);
}

for (const url of Object.keys(ALLOWLIST)) {
  if (!advisories.has(url)) {
    console.log(`Allowlist entry is no longer needed and can be removed: ${url}`);
  }
}

if (blocking.length) {
  console.error(`Dependency audit failed with ${blocking.length} blocking advisory(ies):`);
  for (const item of blocking) {
    console.error(`- ${item.severity}: ${item.name} — ${item.title} — ${item.url}`);
  }
  process.exit(1);
}

console.log('Dependency audit passed.');
