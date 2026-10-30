// Testes locais. Nenhum link externo é aberto; nenhuma mensagem é enviada.
import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const browser = await Browser.launch();
const results = [];
const check = (name, value) => { assert.ok(value, name); results.push({ name, passed: true }); };
const url = process.argv[2] || 'http://127.0.0.1:4173';
const systemTheme = (page, value) => page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value }] });
mkdirSync('../../work/refinement-preview', { recursive: true });
try {
  const page = await browser.newPage();
  await systemTheme(page, 'dark');
  await page.goto(url);
  await page.eval(() => localStorage.removeItem('encanto-theme'));
  await page.goto(url);
  check('Primeira visita segue tema escuro do sistema', await page.eval(() => document.documentElement.dataset.theme === 'dark' && getComputedStyle(document.documentElement).colorScheme === 'dark'));
  await systemTheme(page, 'light');
  await page.eval(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
  check('Tema acompanha sistema antes da escolha manual', await page.eval(() => document.documentElement.dataset.theme === 'light'));
  await page.eval(() => { window.themeTestMarker = true; document.querySelector('.theme-toggle').click(); });
  check('Alterna sem recarregar, atualiza rótulo e persiste', await page.eval(() => window.themeTestMarker && document.documentElement.dataset.theme === 'dark' && localStorage.getItem('encanto-theme') === 'dark' && document.querySelector('.theme-toggle').getAttribute('aria-label') === 'Ativar tema claro' && document.querySelector('.theme-toggle').getAttribute('aria-pressed') === 'true'));
  await page.goto(url);
  check('Escolha salva prevalece após recarregar', await page.eval(() => document.documentElement.dataset.theme === 'dark'));
  await page.send('Page.bringToFront');
  await page.eval(() => document.querySelector('.theme-toggle').focus());
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  check('Botão de tema funciona por teclado', await page.eval(() => document.documentElement.dataset.theme === 'light' && localStorage.getItem('encanto-theme') === 'light'));
  for (const theme of ['light', 'dark']) {
    await page.eval(value => localStorage.setItem('encanto-theme', value), theme);
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewport({ width, height: 900 });
      await page.goto(url, { settleMs: 800 });
      check(`${theme}: sem overflow em ${width}px`, await page.eval(() => document.documentElement.scrollWidth <= innerWidth));
      check(`${theme}: navegação em ${width}px`, await page.eval(() => innerWidth <= 700 ? getComputedStyle(document.querySelector('#navigation')).display === 'none' : getComputedStyle(document.querySelector('.menu-toggle')).display === 'none'));
      if ([390,1440].includes(width)) {
        const distance = await page.eval(() => document.documentElement.scrollHeight);
        await page.wheel(distance, { step: 600, pauseMs: 45 });
        await page.eval(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))));
        check(`${theme}: fotos carregam após rolagem em ${width}px`, await page.eval(() => [...document.images].every(img => img.complete && img.naturalWidth > 0)));
    check(`${theme}: fotografias com raio de 12px e proporção preservada em ${width}px`, await page.eval(() => [...document.querySelectorAll('.product-photo img')].every(img => {
      const r = img.getBoundingClientRect();
      return getComputedStyle(img).borderRadius === '12px' && Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight) < .01;
    })));

        await page.wheel(-distance, { step: 600, pauseMs: 45 });
        await page.screenshot({ path: `../../work/refinement-preview/${theme}-${width}-fold.jpg` });
        await page.screenshot({ path: `../../work/refinement-preview/${theme}-${width}-full.jpg`, fullPage: true });
      }
    }
    check(`${theme}: contraste de corpo e botões >= 4.5:1`, await page.eval(() => {
      const luminance = rgb => {
        const c = rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(v => { v/=255; return v<=.04045 ? v/12.92 : ((v+.055)/1.055)**2.4; });
        return .2126*c[0]+.7152*c[1]+.0722*c[2];
      };
      return ['body','.button','.order','.order .button','.category-picker button[aria-pressed="true"]'].every(selector => {
        const s=getComputedStyle(document.querySelector(selector));
        const a=luminance(s.color), b=luminance(s.backgroundColor);
        return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5;
      });
    }));
    check(`${theme}: imagens intactas com contenção`, await page.eval(() => [...document.querySelectorAll('img')].every(img => getComputedStyle(img).filter === 'none') && getComputedStyle(document.querySelector('.hero-photo img')).objectFit === 'cover' && [...document.querySelectorAll('.product-photo img')].every(img => getComputedStyle(img).objectFit === 'contain')));
    check(`${theme}: DM Sans aplicada globalmente`, await page.eval(() => document.fonts.check('16px "DM Sans"') && [...document.querySelectorAll('h1,h2,h3,p,a,button,summary,small,.step-number')].filter(el => el.getClientRects().length > 0).every(el => getComputedStyle(el).fontFamily.startsWith('"DM Sans"'))));
    check(`${theme}: oval do Hero preservado`, await page.eval(() => {
      const img = document.querySelector('.hero-photo img'), r = img.getBoundingClientRect();
      return getComputedStyle(img).borderRadius === '50%' && Math.abs(r.width / r.height - .75) < .01;
    }));
  }
  check('Formulário, campos e avisos antigos removidos', await page.eval(() => !document.querySelector('form,textarea,#order-category,#order-notice,#contact-dialog') && document.querySelectorAll('#pedido [data-order]').length === 1));
  check('Todos os CTAs usam número e mensagem oficiais', await page.eval(() => {
    const expected='Olá! Conheci a Encanto Personalizados pelo site e gostaria de fazer um pedido de ímãs personalizados.';
    return [...document.querySelectorAll('[data-order]')].every(link => {
      const u=new URL(link.href);
      return u.hostname==='wa.me' && u.pathname==='/5511940596498' && u.searchParams.get('text').startsWith(expected) && link.target==='_blank' && link.rel.includes('noopener');
    }) && new URL(document.querySelector('#pedido [data-order]').href).searchParams.get('text')===expected;
  }));
  check('Mensagem da categoria preservada', await page.eval(() => new URL(document.querySelector('[data-order="fotos"]').href).searchParams.get('text').includes('Ímãs com fotos')));
  check('Links internos preservados', await page.eval(() => [...document.querySelectorAll('a[href^="#"]')].every(a => document.querySelector(a.getAttribute('href')))));
  await page.setViewport({ width:390, height:844 });
  await page.eval(() => document.querySelector('.menu-toggle').click());
  check('Menu abre no celular', await page.eval(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true' && getComputedStyle(document.querySelector('#navigation')).display!=='none'));
  await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
  await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});
  check('Escape fecha menu e devolve foco', await page.eval(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false' && document.activeElement.matches('.menu-toggle')));
  await page.eval(() => document.querySelector('[data-filter="viagens"]').click());
  check('Filtro seleciona viagens', await page.eval(() => document.querySelectorAll('.collection:not([hidden])').length===1 && !document.querySelector('[data-category="viagens"]').hidden));
  await page.eval(() => document.querySelector('[data-filter="all"]').click());
  check('Filtro restaura quatro categorias', await page.eval(() => document.querySelectorAll('.collection:not([hidden])').length===4));
  await page.eval(() => document.querySelector('summary').click());
  check('FAQ expande', await page.eval(() => document.querySelector('details').open));
  check('FAQ contém apenas as três perguntas aprovadas e a resposta de várias unidades', await page.eval(() => document.querySelectorAll('.faq details').length === 3 && [...document.querySelectorAll('.faq summary')].every(el => !/pagamento|entregas/.test(el.textContent)) && document.querySelector('.faq details:last-child p').textContent === 'Sim! Você pode encomendar várias unidades de ímãs personalizados. Entre em contato pelo WhatsApp para contar sua ideia e solicitar um orçamento.'));
  check('Texto provisório removido do Sobre', await page.eval(() => !document.querySelector('#sobre').textContent.includes('estão sendo preparados para este espaço') && !!document.querySelector('#sobre .about-brand-logo')));
  check('Localização correta antes do rodapé', await page.eval(() => document.querySelector('#localizacao h2').textContent === 'Onde estamos' && document.querySelector('#localizacao p').textContent === 'Estamos em Guarulhos, São Paulo, criando lembranças personalizadas para momentos especiais.' && document.querySelector('.location-name').textContent === 'Guarulhos — SP' && !!(document.querySelector('#localizacao').compareDocumentPosition(document.querySelector('footer')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  check('Movimento reduzido respeitado', await page.eval(() => getComputedStyle(document.documentElement).scrollBehavior==='auto' && getComputedStyle(document.querySelector('h1')).animationName==='none' && getComputedStyle(document.querySelector('.hero-photo img')).transitionDuration==='0s'));
  check('Sem exceções JavaScript', page.consoleErrors.length===0);
  const blocked=await browser.newPage({width:390,height:844});
  await blocked.send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}});"});
  await systemTheme(blocked,'dark');
  await blocked.goto(url);
  await blocked.eval(() => document.querySelector('.theme-toggle').click());
  check('Tema funciona com armazenamento bloqueado', await blocked.eval(() => document.documentElement.dataset.theme==='light') && blocked.consoleErrors.length===0);
  await blocked.close();
  await page.goto(pathToFileURL(resolve('index.html')).href);
  check('Projeto abre diretamente como arquivo', await page.eval(() => document.querySelectorAll('[data-filter]').length===5));
  await page.send('Emulation.setScriptExecutionDisabled',{value:true});
  await page.goto(url);
  check('Conteúdo, navegação e WhatsApp funcionam sem JS', await page.eval(() => document.querySelectorAll('.collection:not([hidden])').length===4 && getComputedStyle(document.querySelector('#navigation')).display!=='none' && [...document.querySelectorAll('[data-order]')].every(link => link.href.startsWith('https://wa.me/5511940596498?text='))));
  console.log(`${results.length} verificações aprovadas.`);
  mkdirSync('docs',{recursive:true});
  writeFileSync('docs/test-results.json',JSON.stringify(results,null,2));
} finally { await browser.close(); }
