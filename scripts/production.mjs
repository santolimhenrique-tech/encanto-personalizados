// URLs de produção são conhecidas durante o build, sem runtime ou framework.
export function productionUrl(env = process.env) {
  const host = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  const value = env.SITE_URL || (host ? `https://${host}` : '');
  if (!value) {
    if (env.VERCEL === '1') throw new Error('URL de produção ausente. Ative as variáveis de sistema da Vercel ou configure SITE_URL com a URL HTTPS real.');
    return null;
  }
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('SITE_URL deve ser a URL HTTPS pública da página inicial, sem credenciais, subpasta, query ou fragmento.');
  }
  return url;
}

export function productionHtml(html, url) {
  if (!url) return html;
  const image = new URL('public/assets/encanto-social.jpg', url).href;
  const tags = [
    `  <link rel="canonical" href="${url.href}">`,
    `  <meta property="og:url" content="${url.href}">`
  ].join('\n');
  return html.replace('<meta property="og:image" content="public/assets/encanto-social.jpg">', `<meta property="og:image" content="${image}">`)
    .replace('</head>', `${tags}\n</head>`);
}
