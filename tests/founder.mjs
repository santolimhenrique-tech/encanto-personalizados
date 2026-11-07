import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const browser=await Browser.launch();let count=0;const check=(name,value)=>{assert.ok(value,name);count++};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
mkdirSync('../../work/founder-preview',{recursive:true});
try {
 const page=await browser.newPage();
 for(const width of [320,390,768,1024,1440,1920]) {
  await page.setViewport({width,height:1000});await page.goto('http://127.0.0.1:4173/',{settleMs:1800});
  await page.eval(()=>document.querySelector('#sobre-mim').scrollIntoView({behavior:'instant'}));
  await page.eval(()=>document.querySelector('.founder-portrait img').decode());await wait(900);
  check(`Responsive section ${width}`,await page.eval(()=>{
   const photo=document.querySelector('.founder-portrait img'),copy=document.querySelector('.founder-copy'),r=photo.getBoundingClientRect(),t=copy.getBoundingClientRect();
   return document.documentElement.scrollWidth<=innerWidth && Math.abs(r.width/r.height-photo.naturalWidth/photo.naturalHeight)<.01 && getComputedStyle(photo).borderRadius==='12px' && (innerWidth<=700?r.bottom<=t.top+1:r.right<t.left);
  }));
  for(const theme of ['light','dark']) {
   await page.eval(theme=>document.documentElement.dataset.theme=theme,theme);
   if([390,1440].includes(width)) await page.screenshot({path:`../../work/founder-preview/${theme}-${width}.jpg`});
   check(`Theme ${theme} ${width}`,await page.eval(()=>getComputedStyle(document.querySelector('.founder')).color===getComputedStyle(document.body).color));
  }
 }
 check('Navigation anchors and position',await page.eval(()=>[...document.querySelectorAll('header a,footer a')].filter(a=>a.textContent==='Sobre mim').length===2 && [...document.querySelectorAll('a[href="#sobre-mim"]')].length===2 && document.querySelector('#sobre-mim').nextElementSibling.matches('.order')));
 check('Three approved paragraphs and accessible image',await page.eval(()=>document.querySelectorAll('.founder-story p').length===3 && document.querySelector('.founder-story p:last-child').textContent.endsWith('lindas!') && document.querySelector('.founder-portrait img').alt.includes('Encanto Personalizados') && document.querySelector('.founder-portrait img').src.endsWith('/empreendedora-retrato.jpg') && document.querySelector('#sobre-mim').getAttribute('aria-labelledby')==='founder-title'));
 await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 check('Reduced motion',await page.eval(()=>getComputedStyle(document.querySelector('.founder-story')).animationName==='none'));
 check('No JavaScript errors',page.consoleErrors.length===0);
 await page.send('Emulation.setScriptExecutionDisabled',{value:true});await page.goto('http://127.0.0.1:4173/');
 check('No JS content visible',await page.eval(()=>getComputedStyle(document.querySelector('.founder-story')).opacity==='1' && document.querySelector('.founder-story').textContent.includes('Sou uma mulher cheia de sonhos')));
 console.log(`Founder: ${count} checks passed.`);
} finally { await browser.close(); }
