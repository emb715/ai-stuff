const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const d of process.argv.slice(2)){const p=await b.newPage({viewport:{width:1280,height:800}});await p.goto('file://'+d+'/index.html');await p.waitForTimeout(800);await p.screenshot({path:d+'/shot.png',fullPage:true});
const m=await p.evaluate(()=>{const s=new Set(),f=new Set(),r=new Set(),sh=new Set(),c=new Set();let centered=0,paras=0;
for(const e of document.querySelectorAll('body *')){const cs=getComputedStyle(e);if(e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim())){s.add(cs.fontSize);f.add(cs.fontFamily.split(',')[0]);c.add(cs.color)}
if(cs.borderRadius!='0px')r.add(cs.borderRadius);if(cs.boxShadow!='none')sh.add(cs.boxShadow);
if(e.tagName=='P'&&e.textContent.length>120){paras++;if(cs.textAlign=='center')centered++}}
const g=[...document.querySelectorAll('*')].some(e=>getComputedStyle(e).backgroundImage.includes('gradient'));
return {fontSizes:[...s].sort((a,b)=>parseFloat(a)-parseFloat(b)),families:[...f],textColors:c.size,radii:[...r].length,shadows:sh.size,longParas:paras,centeredLongParas:centered,gradient:g,emoji:/\p{Extended_Pictographic}/u.test(document.body.innerText)}});
console.log(d.split('/').pop(),JSON.stringify(m));await p.close()}await b.close()})();
