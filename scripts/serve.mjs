// Servidor estático local: somente recursos nativos do Node.js.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = process.argv.includes('--dist') ? resolve(projectRoot, 'dist') : projectRoot;
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Porta inválida. Use: npm start -- --port 4173');
  process.exit(1);
}
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8'
};
const server = createServer(async (request, response) => {
  const reply = (status, text) => { response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end(text); };
  if (!['GET', 'HEAD'].includes(request.method)) { response.setHeader('Allow', 'GET, HEAD'); return reply(405, 'Método não permitido.'); }
  let path;
  try { path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); }
  catch { return reply(400, 'Endereço inválido.'); }
  if (path === '/') path = '/index.html';
  if (!['/index.html', '/robots.txt', '/sitemap.xml'].includes(path) && !/^\/(css|js|public)\//.test(path)) return reply(404, 'Arquivo não encontrado.');
  const file = resolve(root, '.' + path);
  if (!file.startsWith(root + sep)) return reply(403, 'Acesso negado.');
  try {
    const info = await stat(file);
    if (!info.isFile()) return reply(404, 'Arquivo não encontrado.');
    const range = request.headers.range;
    let start = 0, end = info.size - 1;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        response.setHeader('Content-Range', `bytes */${info.size}`);
        return reply(416, 'Intervalo inválido.');
      }
      start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
      if (start > end || start >= info.size || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) {
        response.setHeader('Content-Range', `bytes */${info.size}`);
        return reply(416, 'Intervalo indisponível.');
      }
    }
    response.writeHead(range ? 206 : 200, {
      'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': end - start + 1,
      'Accept-Ranges': 'bytes',
      ...(range ? { 'Content-Range': `bytes ${start}-${end}/${info.size}` } : {}),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method === 'HEAD') return response.end();
    const stream = createReadStream(file, { start, end });
    stream.on('error', (error) => { console.error('Erro ao ler arquivo:', error.message); response.destroy(); });
    stream.pipe(response);
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) return reply(404, 'Arquivo não encontrado.');
    console.error('Erro ao servir arquivo:', error.message);
    reply(500, 'Erro ao carregar arquivo.');
  }
});
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? `A porta ${port} já está em uso. Use outra: npm start -- --port ${port + 1}`
    : `Não foi possível iniciar o servidor: ${error.message}`);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Encanto Personalizados: http://127.0.0.1:${port}/`);
  console.log(`Arquivos: ${root}`);
  console.log('Mantenha este terminal aberto. Para encerrar: Ctrl+C.');
});
