'use strict';
/* Ayudas compartidas por los experimentos atómicos */
/* ====== SIMULADORES: Experimento de Rutherford (lámina de oro) ====== */
var RF_MAT={'79':['Oro (Z = 79)','#f1c40f','oro'],'47':['Plata (Z = 47)','#ced4da','plata'],'13':['Aluminio (Z = 13)','#adb5bd','aluminio']};
function rfMats(){ return Object.keys(RF_MAT).map(function(k){ return [k,RF_MAT[k][0]]; }); }
function rfCanvas(cv){
  var o={w:1,h:1,dpr:1,sc:1,ox:0,oy:0,INK:'#222',MUT:'#666',PAN:'#fff',n:0};
  function size(){ var r=cv.parentNode.getBoundingClientRect(); o.dpr=window.devicePixelRatio||1; o.w=Math.max(10,r.width); o.h=Math.max(10,r.height); cv.width=Math.round(o.w*o.dpr); cv.height=Math.round(o.h*o.dpr);
    o.sc=Math.min(o.w/800,o.h/440); o.ox=(o.w-800*o.sc)/2; o.oy=(o.h-440*o.sc)/2; }
  var ro=window.ResizeObserver?new ResizeObserver(size):null; if(ro) ro.observe(cv.parentNode); else window.addEventListener('resize',size); size();
  o.begin=function(cx){ if(o.n++%45===0){ var cs=getComputedStyle(cv); o.INK=cs.getPropertyValue('--ink').trim()||o.INK; o.MUT=cs.getPropertyValue('--muted').trim()||o.MUT; o.PAN=cs.getPropertyValue('--panel').trim()||o.PAN; }
    cx.setTransform(o.dpr,0,0,o.dpr,0,0); cx.clearRect(0,0,o.w,o.h); cx.setTransform(o.dpr*o.sc,0,0,o.dpr*o.sc,o.dpr*o.ox,o.dpr*o.oy); cx.globalAlpha=1; };
  o.stop=function(){ if(ro) ro.disconnect(); else window.removeEventListener('resize',size); };
  return o;
}
function rfTxt(cx,s,x,y,col,size,al,wt){ cx.fillStyle=col; cx.font=(wt||600)+' '+(size||13)+'px system-ui,Arial'; cx.textAlign=al||'left'; cx.fillText(s,x,y); cx.textAlign='left'; }
function rfGauss(){ var u=1-Math.random(), v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.2832*v); }


/* ====== EXPERIMENTOS que sustentan cada modelo atómico ====== */
function expShell(id,aria,side,cards){
  return '<div class="fc-wrap"><div class="fc-main"><div class="fc-scene lt-scene rf-scene"><canvas id="'+id+'" role="img" aria-label="'+aria+'"></canvas></div><p class="fc-status" aria-live="polite"></p>'+
   '<div class="fc-graph lt-panel"><div class="lt-fic">'+cards.map(function(c){ return '<div><h5>'+c[0]+'</h5>'+c[1]+'</div>'; }).join('')+'</div></div></div><aside class="fc-side">'+side+'</aside></div>';
}
function rfBall(cx,x,y,r,col,lab,ink){ var g=cx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r); g.addColorStop(0,'#ffffff'); g.addColorStop(.35,col); g.addColorStop(1,shadeHex(col,-.4));
  cx.fillStyle=g; cx.beginPath(); cx.arc(x,y,r,0,6.2832); cx.fill(); cx.strokeStyle='rgba(0,0,0,.35)'; cx.lineWidth=1; cx.stroke();
  if(lab){ cx.fillStyle=ink||'#212529'; cx.font='800 '+Math.round(r*.95)+'px Georgia,serif'; cx.textAlign='center'; cx.textBaseline='middle'; cx.fillText(lab,x,y+1); cx.textAlign='left'; cx.textBaseline='alphabetic'; } }
function shadeHex(h,f){ var c=hx(h); return 'rgb('+c.map(function(v){ return Math.round(f>0?v+(255-v)*f:v*(1+f)); }).join(',')+')'; }
function wl2rgb(w){ var r=0,g=0,b=0,f;
  if(w>=380&&w<440){ r=-(w-440)/60; b=1; } else if(w<490){ g=(w-440)/50; b=1; } else if(w<510){ g=1; b=-(w-510)/20; } else if(w<580){ r=(w-510)/70; g=1; } else if(w<645){ r=1; g=-(w-645)/65; } else if(w<=780){ r=1; }
  f=w<420?.3+.7*(w-380)/40:(w>700?.3+.7*(780-w)/80:1); return [Math.round(255*Math.pow(r*f,.8)),Math.round(255*Math.pow(g*f,.8)),Math.round(255*Math.pow(b*f,.8))]; }
function rfArrow(cx,x1,y1,x2,y2,col,lw){ var a=Math.atan2(y2-y1,x2-x1); cx.strokeStyle=col; cx.fillStyle=col; cx.lineWidth=lw||2; cx.beginPath(); cx.moveTo(x1,y1); cx.lineTo(x2,y2); cx.stroke(); cx.beginPath(); cx.moveTo(x2,y2); cx.lineTo(x2-9*Math.cos(a-.4),y2-9*Math.sin(a-.4)); cx.lineTo(x2-9*Math.cos(a+.4),y2-9*Math.sin(a+.4)); cx.closePath(); cx.fill(); }

