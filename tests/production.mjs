// Audita o artefato estático. Não acessa WhatsApp nem Instagram.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { productionUrl, productionHtml } from '../scripts/production.mjs';
const base = process.argv[2] || 'http://127.0.0.1:4180/';
const html = readFileSync('dist/index.html', 'utf8');
const paths = new Set(['/']);
const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map(m => m[0]);
const orders = anchors.filter(tag => /\bdata-order(?:=|\s|>)/.test(tag));
assert.equal(orders.length, 9, 'CTAs de pedido ausentes');
for (const tag of orders) {
  const link = new URL(/href="([^"]+)"/.exec(tag)[1]);
  assert.equal(link.origin + link.pathname, 'https://wa.me/5511940596498');
  assert.ok(link.searchParams.get('text').includes('gostaria de fazer um pedido de ímãs personalizados.'));
}
const instagram = anchors.filter(tag => /\bdata-instagram(?:=|\s|>)/.test(tag));
assert.equal(instagram.length, 2);
for (const tag of instagram) {
  assert.equal(/href="([^"]+)"/.exec(tag)[1], 'https://www.instagram.com/_encantopersonalizados_26/');
  assert.ok(tag.includes('target="_blank"') && tag.includes('rel="noopener noreferrer"'));
}
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const [, path] of html.matchAll(/(?:src|href|poster)="([^"]+)"/g)) {
  if (path.startsWith('#')) assert.ok(ids.has(path.slice(1)), path);
  else if (!path.includes(':')) paths.add(new URL(path, base).pathname);
}
for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const entry of srcset.split(',')) paths.add(new URL(entry.trim().split(/\s+/)[0], base).pathname);
}
for (const file of ['css/style.css', 'css/fonts.css']) {
  for (const [, path] of readFileSync(resolve('dist', file), 'utf8').matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    if (!path.includes(':')) paths.add(new URL(path, new URL(file, base)).pathname);
  }
}
paths.add('/public/assets/encanto-social.jpg');
paths.add('/robots.txt');
if (existsSync('dist/sitemap.xml')) paths.add('/sitemap.xml');
await Promise.all([...paths].map(async path => {
  const response = await fetch(new URL(path, base), { method: 'HEAD' });
  assert.equal(response.status, 200, `Asset quebrado: ${path}`);
  if (/\.(?:css|js|woff2|webp|png|jpg|mp4)$/.test(path)) assert.ok(!response.headers.get('content-type').includes('text/html'), `MIME incorreto: ${path}`);
}));
assert.ok(!html.includes('noindex'), 'Indexação bloqueada');
assert.ok(!/Informação em revisão|WhatsApp ainda não informado|estão sendo preparados para este espaço|lorem ipsum/i.test(html), 'Conteúdo provisório visível');
assert.ok(html.includes('preload="none"') && html.includes('poster='), 'O vídeo deve aguardar interação e usar poster');
assert.ok(!/<video[^>]*autoplay/.test(html), 'Vídeo não deve usar autoplay');
assert.ok(!existsSync('dist/public/images/originais') && !existsSync('dist/.agents'), 'Fontes e intermediários não devem ser publicados');
assert.ok(statSync('dist/public/videos/imas-personalizados.mp4').size < 4 * 1024 * 1024);
// Domínio reservado usado apenas em memória, sem inserir URL fictícia nos artefatos.
const fixture = productionUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'encanto.example' });
const tagged = productionHtml(html, fixture);
assert.ok(tagged.includes('rel="canonical" href="https://encanto.example/"'));
assert.ok(tagged.includes('property="og:url" content="https://encanto.example/"'));
assert.ok(tagged.includes('property="og:image" content="https://encanto.example/public/assets/encanto-social.jpg"'));
assert.throws(() => productionUrl({ VERCEL: '1' }));
assert.throws(() => productionUrl({ SITE_URL: 'http://localhost:4180/' }));
assert.equal(productionUrl({ SITE_URL: 'https://custom.example/', VERCEL_PROJECT_PRODUCTION_URL: 'encanto.example' }).hostname, 'custom.example');
const response = await fetch(new URL('public/videos/imas-personalizados.mp4', base), { headers: { Range: 'bytes=0-1023' } });
assert.equal(response.status, 206);
assert.equal((await response.arrayBuffer()).byteLength, 1024);
console.log(`Produção: ${paths.size} URLs locais responderam HTTP 200; SEO dinâmico, indexação, ausência de provisórios e vídeo parcial aprovados.`);
