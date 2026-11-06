import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const browser=await Browser.launch();let count=0;const check=(name,result)=>{assert.ok(result,name);count++};
const wait=ms=>new Promise(r=>setTimeout(r,ms));mkdirSync('../../work/hero-video-preview',{recursive:true});
try {
 for(const width of [390,768,1440]) {
 const page=await browser.newPage({width,height:900});
 await page.send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'connection',{value:{saveData:false,effectiveType:'4g',downlink:10,addEventListener(){}}})"});
 await page.goto('http://127.0.0.1:4180/',{settleMs:5000});
 for(let attempt=0;attempt<30 && !(await page.eval(()=>document.querySelector('.cinema-video').classList.contains('is-playing')));attempt++) await wait(500);
 check(`Plays muted ${width}`,await page.eval(()=>{const v=document.querySelector('.cinema-video');return v.currentTime>0&&!v.paused&&v.muted&&v.volume===0&&v.autoplay&&v.loop&&v.playsInline&&!v.controls&&v.classList.contains('is-playing')}));
 check(`Correct responsive file ${width}`,await page.eval(()=>document.querySelector('.cinema-video').currentSrc.includes(innerWidth<=700?'360.mp4':'720.mp4')));
 check(`Loading after essentials ${width}`,await page.eval(()=>{const resource=performance.getEntriesByType('resource').find(r=>r.name.includes('familia-hero-')&&r.name.endsWith('.mp4')),nav=performance.getEntriesByType('navigation')[0];return resource&&resource.startTime>=nav.loadEventStart}));
 check(`No overflow ${width}`,await page.eval(()=>document.documentElement.scrollWidth<=innerWidth));
 for(const theme of ['light','dark']){await page.eval(t=>document.documentElement.dataset.theme=t,theme);await page.screenshot({path:`../../work/hero-video-preview/${theme}-${width}.jpg`});}
 await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await wait(200);check(`Reduced motion unloads ${width}`,await page.eval(()=>{const v=document.querySelector('.cinema-video');return !v.hasAttribute('src')&&v.paused&&getComputedStyle(v).display==='none'}));
 await page.goto('http://127.0.0.1:4180/',{settleMs:1800});
 check(`Reduced motion never downloads ${width}`,await page.eval(()=>!performance.getEntriesByType('resource').some(r=>r.name.endsWith('.mp4'))));
 check(`No JavaScript errors ${width}`,page.consoleErrors.length===0);await page.close();
 }
 for(const mode of ['saveData','slow','blocked','noJS']){
 const page=await browser.newPage();
 if(mode==='saveData'||mode==='slow')await page.send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(navigator,'connection',{value:{saveData:${mode==='saveData'},effectiveType:'${mode==='slow'?'3g':'4g'}',downlink:10,addEventListener(){}}})`});
 if(mode==='blocked')await page.send('Page.addScriptToEvaluateOnNewDocument',{source:"const original=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){return this.classList.contains('cinema-video')?Promise.reject(new Error('Blocked')):original.call(this)}"});
 if(mode==='noJS')await page.send('Emulation.setScriptExecutionDisabled',{value:true});
 await page.goto('http://127.0.0.1:4180/',{settleMs:3500});
 check(`Fallback ${mode}`,await page.eval(()=>{const v=document.querySelector('.cinema-video'),img=document.querySelector('.cinema-photo');return !v.hasAttribute('src')&&!v.classList.contains('is-playing')&&img.naturalWidth>0}));
 await page.close();
 }
 console.log(`Hero video: ${count} checks passed.`);
}finally{await browser.close()}
