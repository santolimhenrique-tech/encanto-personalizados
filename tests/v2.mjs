import assert from 'node:assert/strict';
import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
const browser = await Browser.launch();
const url = process.argv[2] || 'http://127.0.0.1:4180/';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let count = 0;
const check = (label, result) => { assert.ok(result, label); count++; };
mkdirSync('../../work/v2-preview', { recursive: true });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ width, height: 900 });
    await page.send('Page.addScriptToEvaluateOnNewDocument', { source: `
      window.motionLog=[]; window.revealLog=[]; window.shiftScore=0; window.shifts=[];
      document.addEventListener('animationstart',e=>{if(e.animationName==='section-enter')window.revealLog.push(e.target.className)});
      const original=Element.prototype.animate;
      Element.prototype.animate=function(frames,options){ window.motionLog.push({tag:this.id||this.className,frames,options}); return original.call(this,frames,options); };
      new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput){window.shiftScore+=e.value;window.shifts.push({value:e.value,sources:e.sources.map(s=>({tag:s.node?.tagName,cls:s.node?.className,prev:s.previousRect,next:s.currentRect}))})}})).observe({type:'layout-shift',buffered:true});
    ` });
    await page.goto(url, { settleMs: 3000 });
    check(`Hero choreographed ${width}`, await page.eval(() => {
      const log=window.motionLog;
      return log.some(x=>x.tag==='hero-title' && x.options.duration===550) && log.some(x=>x.tag==='cinema-description' && x.options.delay===500) && log.some(x=>x.frames[0].transform==='scale(1.05)');
    }));
    check(`Broches copy, alt and WhatsApp ${width}`, await page.eval(() => {
      const card=document.querySelector('[data-category="broches"]');
      const link=card.querySelector('[data-order]');
      const text=new URL(link.href).searchParams.get('text');
      return card.querySelector('h3').textContent==='Broches personalizados' && link.textContent==='Personalizar meu broche' && text.includes('Broches personalizados') && !text.includes('ímãs') && card.querySelector('video')?.preload==='none' && !card.querySelector('video').autoplay;
    }));
    check(`Initial layout stability ${width}`, await page.eval(() => window.shiftScore < .1));
    await page.eval(async () => { await document.fonts.ready; window.shiftScore = 0; });
    await page.eval(() => document.querySelector('#produtos').scrollIntoView({behavior:'instant'}));
    await pause(950);
    check(`Scroll reveal ${width}`, await page.eval(() => window.revealLog.some(x=>x.includes('section-heading'))));
    const before=await page.eval(() => window.revealLog.filter(x=>x.includes('section-heading')).length);
    await page.eval(() => scrollTo({top:0,behavior:'instant'}));
    await pause(100);
    await page.eval(() => document.querySelector('#produtos').scrollIntoView({behavior:'instant'}));
    await pause(200);
    check(`Scroll reveals only once ${width}`, before===await page.eval(() => window.revealLog.filter(x=>x.includes('section-heading')).length));
    check(`No entrance layout shift ${width}`,await page.eval(()=>window.shiftScore<.01));
    for(const category of ['broches','imas','chaveiros','all','broches','all']) {
      await page.eval(key=>document.querySelector(`[data-filter="${key}"]`).click(),category);
      check(`Filter ${category} ${width}`,await page.eval(key=>{
        const visible=[...document.querySelectorAll('.collection')].filter(el=>!el.hidden);
        return visible.length===(key==='all'?3:1) && (key==='all'||visible[0].dataset.category===key);
      },category));
    }
    await pause(1100);
    if(width===1440) {
      const point=await page.eval(()=>{const card=document.querySelector('.collection');card.scrollIntoView({behavior:'instant',block:'center'});const r=card.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+30};});
      await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
      await pause(700);
      check('Desktop hover raises card and zooms image',await page.eval(()=>getComputedStyle(document.querySelector('.collection')).transform!=='none' && getComputedStyle(document.querySelector('.product-photo img')).transform!=='none'));
      await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
    }
    for(const theme of ['light','dark']) {
      await page.eval(theme=>{localStorage.setItem('encanto-theme',theme);},theme);
      await page.goto(url,{settleMs:1000});
      await page.screenshot({path:`../../work/v2-preview/${theme}-${width}-hero.jpg`});
      await page.wheel(await page.eval(()=>document.documentElement.scrollHeight),{step:550,pauseMs:90});
      await pause(800);
      await page.screenshot({path:`../../work/v2-preview/${theme}-${width}-full.jpg`,fullPage:true});
      check(`No overflow ${theme} ${width}`,await page.eval(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await page.goto(url,{settleMs:200});
    await page.eval(()=>{document.querySelector('[data-filter="broches"]').click();document.querySelector('#sobre').scrollIntoView({behavior:'instant'});});
    await pause(150);
    check(`Reduced motion ${width}`,await page.eval(()=>window.motionLog.length===0 && document.getAnimations().length===0));
    check(`No JavaScript errors ${width}`,page.consoleErrors.length===0);
    await page.send('Emulation.setScriptExecutionDisabled',{value:true});
    await page.goto(url);
    check(`No JS fallback ${width}`,await page.eval(()=>[...document.querySelectorAll('.collection,.hero-copy,.hero-photo')].every(el=>getComputedStyle(el).opacity==='1') && new URL(document.querySelector('[data-order="broches"]').href).searchParams.get('text').includes('Broches personalizados')));
    await page.close();
  }
  console.log(`V2: ${count} checks passed (desktop/mobile, themes, scroll, filters, reduced motion, CLS, no JS fallback).`);
} finally { await browser.close(); }
