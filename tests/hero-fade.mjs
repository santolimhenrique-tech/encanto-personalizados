import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
const browser=await Browser.launch();let count=0;const check=(n,r)=>{assert.ok(r,n);count++};const wait=ms=>new Promise(r=>setTimeout(r,ms));
try {
 for(const mode of ['empty-cache','throttled','failed','reduced']) {
 const page=await browser.newPage({width:1440,height:900});
 await page.send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:false,effectiveType:'4g',downlink:10,addEventListener(){}}});document.addEventListener('error',e=>{if(e.target?.classList?.contains('cinema-video'))window.heroMediaFailed=true},true)"});
 await page.send('Network.enable');await page.send('Network.setCacheDisabled',{cacheDisabled:true});await page.send('Network.clearBrowserCache');
 await page.send('Page.addScriptToEvaluateOnNewDocument',{source:`
 window.reveals=[];window.decodedFrame=false;
 const original=HTMLVideoElement.prototype.requestVideoFrameCallback;
 if(original)HTMLVideoElement.prototype.requestVideoFrameCallback=function(callback){return original.call(this,(...args)=>{if(this.classList.contains('cinema-video'))window.decodedFrame=true;callback(...args)})};
 document.addEventListener('DOMContentLoaded',()=>{const v=document.querySelector('.cinema-video');new MutationObserver(()=>{if(v.classList.contains('is-playing'))window.reveals.push({frame:window.decodedFrame,state:v.readyState,opacity:getComputedStyle(v).opacity})}).observe(v,{attributes:true,attributeFilter:['class']});});
 `});
 if(mode==='throttled') {
 await page.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:500*1024,uploadThroughput:100*1024});
 // Keep connection classified as 4G to exercise gradual playback on a throttled link.
 await page.send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(navigator,'connection',{value:{saveData:false,effectiveType:'4g',downlink:4,addEventListener(){}}})"});
 }
 if(mode==='failed')await page.send('Network.setBlockedURLs',{urls:['*familia-hero-*.mp4']});
 if(mode==='reduced')await page.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await page.goto('http://127.0.0.1:4173/',{settleMs:mode==='throttled'?9000:5000});
 if(mode==='empty-cache'||mode==='throttled'){
 for(let attempt=0;attempt<30 && !(await page.eval(()=>window.reveals.length>0));attempt++) await wait(500);
 check(mode+': decoded frame before reveal',await page.eval(()=>window.reveals.length>0&&window.reveals.every(x=>x.frame&&x.state>=2)));
 check(mode+': 650ms transition and fallback underneath',await page.eval(()=>{const v=document.querySelector('.cinema-video'),img=document.querySelector('.cinema-photo');return getComputedStyle(v).transitionDuration==='0.65s'&&img.naturalWidth>0&&getComputedStyle(img).display!=='none'&&v.currentTime>0&&v.muted&&v.loop&&v.playsInline}));
 await page.eval(()=>document.querySelector('.cinema-video').dispatchEvent(new Event('waiting')));
 check(mode+': buffering keeps video visible',await page.eval(()=>document.querySelector('.cinema-video').classList.contains('is-playing')));
 check(mode+': no JS exceptions',page.consoleErrors.length===0);
 }else{
 check(mode+': visible static fallback',await page.eval(()=>!document.querySelector('.cinema-video').classList.contains('is-playing')&&document.querySelector('.cinema-photo').naturalWidth>0));
 if(mode==='failed')check('failed: actual media error observed',await page.eval(()=>window.heroMediaFailed===true));
 if(mode==='reduced')check('reduced: no video request',await page.eval(()=>!performance.getEntriesByType('resource').some(r=>r.name.endsWith('.mp4'))));
 }
 console.log(mode+' passed');await page.close();
 }
 console.log(`Hero fade: ${count} checks passed.`);
}finally{await browser.close()}
