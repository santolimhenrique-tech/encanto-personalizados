import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
const html = readFileSync('index.html', 'utf8');
const requireAsset = (path) => {
  const full = resolve(path);
  const parts = relative(resolve('.'), full).split(sep);
  assert.ok(!parts.includes('..'), `Caminho fora do projeto: ${path}`);
  let parent = resolve('.');
  for (const part of parts) {
    assert.ok(readdirSync(parent).includes(part), `Asset ausente ou diferença de maiúsculas/minúsculas: ${path}`);
    parent = resolve(parent, part);
  }
};
for (const file of ['js/theme.js', 'js/config.js', 'js/main.js']) new Script(readFileSync(file, 'utf8'), { filename: file });
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs duplicados');
for (const [, path] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (path.startsWith('#')) assert.ok(ids.includes(path.slice(1)), `Âncora ausente: ${path}`);
  else if (!path.includes(':')) requireAsset(path);
}
for (const [,set] of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const entry of set.split(',')) requireAsset(entry.trim().split(/\s+/)[0]);
}
for (const file of ['css/fonts.css', 'css/style.css']) {
  for (const [, path] of readFileSync(file, 'utf8').matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    if (!path.includes(':')) requireAsset(resolve('css', path));
  }
}
requireAsset('public/assets/encanto-social.jpg');
assert.ok(!/content="noindex/.test(html), 'A página de produção não deve bloquear a indexação.');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Uma única h1');
JSON.parse(readFileSync('vercel.json', 'utf8'));
console.log('OK: sintaxe JavaScript, IDs, âncoras, assets locais, h1 e configuração Vercel.');
