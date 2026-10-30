import './check.mjs';
import { mkdirSync, cpSync, rmSync, existsSync, lstatSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, basename, relative, sep } from 'node:path';
import { productionUrl, productionHtml } from './production.mjs';
const root = resolve('.');
const output = resolve(root, 'dist');
// A limpeza só pode atingir a saída conhecida do projeto, nunca links para outra pasta.
if (dirname(output) !== root || basename(output) !== 'dist' || (existsSync(output) && lstatSync(output).isSymbolicLink())) {
  throw new Error('Diretório de build inválido.');
}
const url = productionUrl();
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const path of ['index.html', 'css', 'js', 'public', 'robots.txt']) cpSync(path, resolve(output, path), {
  recursive: true,
  filter: (source) => {
    const parts = relative(root, source).split(sep);
    return !parts.includes('originais') && !source.endsWith('.md') && !/^cormorant/i.test(basename(source)) && basename(source) !== 'favicon.svg';
  }
});
writeFileSync(resolve(output, 'index.html'), productionHtml(readFileSync('index.html', 'utf8'), url));
if (url) {
  writeFileSync(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', url).href}\n`);
  writeFileSync(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.href}</loc></url></urlset>\n`);
  console.log('Canonical, Open Graph e sitemap usam o domínio real de produção.');
} else {
  console.log('Build local sem domínio público. Na Vercel, a URL de produção será aplicada automaticamente; SITE_URL permite indicar um domínio próprio.');
}
console.log('Build estático concluído em dist/. Sem dependências de runtime.');
