import assert from 'node:assert/strict';
import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
const browser=await Browser.launch();let count=0;const check=(n,r)=>{assert.ok(r,n);count++};
mkdirSync('../../work/product-media',{recursive:true});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:4180/',{settleMs:3000});
 check('Original brooch photographs restored once and before video',await page.eval(()=>{
 const card=document.querySelector('[data-category="broches"]'), images=[...card.querySelectorAll('.flag-photos img')],video=card.querySelector('video');
 return images.length===2 && images[0].src.includes('bandeiras-india-suica-640.webp') && images[1].src.includes('bandeiras-alemanha-640.webp') && card.querySelectorAll('video').length===1 && images.every(img=>Boolean(img.compareDocumentPosition(video)&Node.DOCUMENT_POSITION_FOLLOWING));
 }));
 check('Video not fetched before interaction',await page.eval(()=>!performance.getEntriesByType('resource').some(e=>e.name.includes('broches-personalizados.mp4'))));
 for(const width of [390,1440]){
 await page.setViewport({width,height:900});
 await page.eval(()=>document.querySelector('[data-filter="broches"]').click());
 await page.eval(()=>document.querySelector('[data-category="broches"]').scrollIntoView({behavior:'instant',block:'center'}));
 await new Promise(r=>setTimeout(r,900));
 check('Native responsive video '+width,await page.eval(()=>{const v=document.querySelector('[data-category="broches"] video'),r=v.getBoundingClientRect(),f=v.parentElement.getBoundingClientRect();return v.controls&&!v.autoplay&&v.preload==='none'&&v.paused&&getComputedStyle(v).borderRadius==='12px'&&r.width<=f.width+1&&r.height<=f.height+1}));
 await page.screenshot({path:`../../work/product-media/broches-${width}.jpg`});
 await page.eval(()=>document.querySelector('[data-filter="chaveiros"]').click());
 await page.eval(()=>document.querySelector('[data-category="chaveiros"] img').decode());
 check('Four keychains uncropped '+width,await page.eval(()=>{const img=document.querySelector('[data-category="chaveiros"] img'),r=img.getBoundingClientRect();return img.alt.includes('Quatro chaveiros')&&Math.abs(r.width/r.height-img.naturalWidth/img.naturalHeight)<.01&&getComputedStyle(img).objectFit==='contain'&&getComputedStyle(img).borderRadius==='12px'}));
 await new Promise(r=>setTimeout(r,700));await page.screenshot({path:`../../work/product-media/chaveiros-${width}.jpg`});
 }
 await page.eval(()=>document.querySelector('[data-filter="broches"]').click());
 check('Video plays after explicit request',await page.eval(async()=>{const v=document.querySelector('[data-category="broches"] video');v.muted=true;await v.play();await new Promise(r=>setTimeout(r,900));const ok=v.currentTime>0&&!v.paused;v.pause();return ok}));
 check('No JS errors',page.consoleErrors.length===0);
 console.log(`Media: ${count} checks passed.`);
}finally{await browser.close()}
