import assert from 'node:assert/strict';
import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
const browser=await Browser.launch();
const url='http://127.0.0.1:4180/';
let count=0;const check=(name,result)=>{assert.ok(result,name);count++};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
mkdirSync('../../work/cinema-preview',{recursive:true});
try {
 const page=await browser.newPage();
 await page.goto(url); await page.eval(()=>sessionStorage.clear());
 await page.goto(url,{settleMs:80});
 check('First session opening',await page.eval(()=>document.documentElement.classList.contains('intro-active')));
 await wait(1600);
 check('Opening releases reliably',await page.eval(()=>!document.documentElement.classList.contains('intro-active') && getComputedStyle(document.querySelector('.brand-intro')).display==='none'));
 await page.goto(url,{settleMs:80});
 check('No replay in session',await page.eval(()=>!document.documentElement.classList.contains('intro-active')));
 for(const width of [320,390,768,1024,1440,1920]) {
  await page.setViewport({width,height:900});
  await page.goto(url,{settleMs:1700});
  check(`No overflow ${width}`,await page.eval(()=>document.documentElement.scrollWidth<=innerWidth));
  check(`Main image loaded ${width}`,await page.eval(()=>document.querySelector('.cinema-photo').naturalWidth>0));
  check(`Photo and original oval ${width}`,await page.eval(()=>getComputedStyle(document.querySelector('.cinema-photo')).objectFit==='cover' && getComputedStyle(document.querySelector('.hero-photo img')).borderRadius==='50%'));
  for(const theme of ['light','dark']) {
   await page.eval(theme=>{document.documentElement.dataset.theme=theme;},theme);
   await page.screenshot({path:`../../work/cinema-preview/${theme}-${width}.jpg`});
  }
 }
 await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await page.eval(()=>sessionStorage.clear());await page.goto(url);
 check('Reduced motion skips opening',await page.eval(()=>!document.documentElement.classList.contains('intro-active') && document.getAnimations().length===0));
 await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await page.send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(window,'sessionStorage',{get(){throw new Error('blocked')}})"});
 await page.goto(url);await wait(1700);
 check('Blocked storage recovers',await page.eval(()=>!document.documentElement.classList.contains('intro-active')));
 await page.send('Network.setBlockedURLs',{urls:['*familia-hero*']});await page.send('Network.enable');
 await page.goto(url);await wait(1700);
 check('Failed image does not trap opening',await page.eval(()=>!document.documentElement.classList.contains('intro-active') && !!document.querySelector('#hero-title')));
 await page.send('Emulation.setScriptExecutionDisabled',{value:true});await page.goto(url);
 check('No JS: content and opening fallback',await page.eval(()=>getComputedStyle(document.querySelector('.brand-intro')).display==='none' && document.querySelector('.cinema-actions [data-order]').href.includes('5511940596498')));
 check('No JS exceptions',page.consoleErrors.length===0);
 console.log(`Entrance: ${count} checks passed.`);
} finally { await browser.close(); }
