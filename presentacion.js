'use strict';
/* Motor de presentaciones de clase (cubo animado, unir conceptos, cronómetro, fecha) */
/* ====== CLASE 1 OA 10 (6° básico): presentación con simuladores y actividad ====== */
function cuboAnim(s,MODE){var dead=false;
var NS='http://www.w3.org/2000/svg',i,j;
function E(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);(p||s).appendChild(e);return e}
function hx(h){return[parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}
function ramp(u,st){u=Math.max(0,Math.min(1,u));for(var i=1;i<st.length;i++){if(u<=st[i][0]||i==st.length-1){var a=st[i-1],b=st[i],f=Math.max(0,Math.min(1,(u-a[0])/(b[0]-a[0]))),c=hx(a[1]),d=hx(b[1]);return'rgb('+[0,1,2].map(function(k){return Math.round(c[k]+(d[k]-c[k])*f)}).join()+')'}}}
var CU=[[0,'#4dabf7'],[.3,'#f1f3f5'],[1,'#fa5252']],AI=[[0,'#1c7ed6'],[.25,'#74c0fc'],[.5,'#ffd43b'],[.75,'#ff922b'],[1,'#e03131']];
function u(T){return(T+10)/110}
function fn(x,d){return x.toFixed(d||0).replace('.',',')}
function fj(x){return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
var Ta=20,T0=80,T=T0,Q=0,mc=192.5,hA=2,SP=32,hold=0;
var d=E('defs'),m=E('marker',{id:'a',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'},d);E('path',{d:'M0 0L10 5L0 10z',fill:'#e8590c'},m);
E('rect',{x:6,y:92,width:788,height:342,rx:12,fill:'#e7f1fb',stroke:'#c9d6e3'});
function card(x,w,t){E('rect',{x:x,y:6,width:w,height:76,rx:10,fill:'#ffffff',stroke:'#cfd8e3'});E('text',{x:x+14,y:30,'font-size':18,'font-weight':700,fill:'#44505c'}).textContent=t;return E('text',{x:x+14,y:68,'font-size':34,'font-weight':800,fill:'#1864ab'})}
var vT,vQ,vA,bC,bA,vt;
if(MODE=='full'){vT=card(8,330,'TEMPERATURA del cubo');vQ=card(462,330,'CALOR transferido (Q)');E('text',{x:400,y:34,'text-anchor':'middle','font-size':20,'font-weight':700,fill:'#44505c'}).textContent='Aire';vA=E('text',{x:400,y:66,'text-anchor':'middle','font-size':30,'font-weight':800,fill:'#1b2733'})}
else{E('rect',{x:6,y:6,width:788,height:80,rx:10,fill:'#ffffff',stroke:'#cfd8e3'});
E('text',{x:18,y:38,'font-size':26,'font-weight':800,fill:'#c2410c'}).textContent='CUBO';E('text',{x:18,y:76,'font-size':26,'font-weight':800,fill:'#1971c2'}).textContent='AIRE';

E('rect',{x:120,y:20,width:662,height:26,rx:6,fill:'#e9ecef'});E('rect',{x:120,y:54,width:662,height:26,rx:6,fill:'#e9ecef'});
bC=E('rect',{x:120,y:20,height:26,rx:6,fill:'#e8590c'});bA=E('rect',{x:120,y:54,height:26,rx:6,fill:'#1c7ed6'})}
vt=E('text',{x:400,y:424,'text-anchor':'middle','font-size':(MODE=='full'?22:28),'font-weight':800,fill:'#13233a'});
var air=[];for(i=0;i<150;i++){var an=Math.random()*6.283,kb=.985+Math.random()*.03;air.push({x:20+Math.random()*760,y:104+Math.random()*320,vx:Math.cos(an),vy:Math.sin(an),kb:kb,k:kb,el:E('circle',{r:4.2})})}
var gF=E('g');
var CX=400,CY=270,S=150,n=5,sp=(S-28)/(n-1),half=S/2+3;
var body=E('rect',{x:CX-S/2,y:CY-S/2,width:S,height:S,rx:10,stroke:'#495057','stroke-width':3}),nd=[],bd=[];
for(i=0;i<n;i++)for(j=0;j<n;j++)nd.push({x:CX-S/2+14+j*sp,y:CY-S/2+14+i*sp,r:i,c:j});
nd.forEach(function(p,k){if(p.c<n-1)bd.push([k,k+1,E('line',{stroke:'#495057','stroke-width':2,opacity:.55})]);if(p.r<n-1)bd.push([k,k+n,E('line',{stroke:'#495057','stroke-width':2,opacity:.55})])});
nd.forEach(function(p){p.el=E('circle',{r:5.4,fill:'#343a40'})});
var ar=[0,1,2,3].map(function(){return E('line',{stroke:'#e8590c','stroke-width':7,'stroke-linecap':'round','marker-end':'url(#a)'})});
var fl=[];
var last=performance.now();
function loop(now){if(dead)return;requestAnimationFrame(loop);var dt=Math.min((now-last)/1000,.05);last=now;
var dT=T-Ta,run=Math.abs(dT)>1.2;
if(run){var h=dt*SP,T1=Ta+dT*Math.exp(-h*hA/mc);Q+=mc*Math.abs(T1-T);T=T1}
else{hold+=dt;if(hold>3.5){hold=0;T=T0;Q=0}}
body.setAttribute('fill',ramp(u(T),CU));
var amp=1+u(T)*7;
nd.forEach(function(p){p.px=p.x+(Math.random()-.5)*2*amp;p.py=p.y+(Math.random()-.5)*2*amp;p.el.setAttribute('cx',p.px.toFixed(1));p.el.setAttribute('cy',p.py.toFixed(1))});
bd.forEach(function(b){var A=nd[b[0]],B=nd[b[1]];b[2].setAttribute('x1',A.px.toFixed(1));b[2].setAttribute('y1',A.py.toFixed(1));b[2].setAttribute('x2',B.px.toFixed(1));b[2].setAttribute('y2',B.py.toFixed(1))});
var Ak=Ta+273,Tk=T+273,vb=95*Math.sqrt(Ak/293);
air.forEach(function(p){var v=vb*p.k;p.x+=p.vx*v*dt;p.y+=p.vy*v*dt;
if(p.x<14){p.x=14;p.vx=Math.abs(p.vx)}if(p.x>786){p.x=786;p.vx=-Math.abs(p.vx)}if(p.y<100){p.y=100;p.vy=Math.abs(p.vy)}if(p.y>428){p.y=428;p.vy=-Math.abs(p.vy)}
var dx=p.x-CX,dy=p.y-CY;
if(Math.abs(dx)<half&&Math.abs(dy)<half){
if(half-Math.abs(dx)<half-Math.abs(dy)){var sx=dx>=0?1:-1;p.x=CX+sx*half;p.vx=sx*Math.abs(p.vx)}else{var sy=dy>=0?1:-1;p.y=CY+sy*half;p.vy=sy*Math.abs(p.vy)}
p.k+=(Math.sqrt(Math.max(.2,Tk/Ak))*(.85+.3*Math.random())-p.k)*.7;p.k=Math.max(.6,Math.min(1.6,p.k));
if(fl.length<14)fl.push({t:0,el:E('circle',{cx:p.x,cy:p.y,r:3,fill:'none',stroke:'#e8590c','stroke-width':2.5})})}
p.k+=(p.kb-p.k)*Math.min(1,dt*.7);
p.el.setAttribute('cx',p.x.toFixed(1));p.el.setAttribute('cy',p.y.toFixed(1));p.el.setAttribute('fill',ramp(u(p.k*p.k*Ak-273),AI))});
for(i=fl.length-1;i>=0;i--){var f=fl[i];f.t+=dt;f.el.setAttribute('r',3+10*f.t/.3);f.el.setAttribute('opacity',1-f.t/.3);if(f.t>.3){s.removeChild(f.el);fl.splice(i,1)}}
var L=16+34*Math.min(1,Math.abs(dT)/60),o=S/2+10;
[[0,-1],[1,0],[0,1],[-1,0]].forEach(function(q,k){var bx=CX+q[0]*o,by=CY+q[1]*o,a=ar[k];
a.setAttribute('x1',bx);a.setAttribute('y1',by);a.setAttribute('x2',bx+q[0]*L);a.setAttribute('y2',by+q[1]*L);a.setAttribute('opacity',run?.95:0)});
if(MODE=='full'){vT.textContent=fn(T,1)+' °C';vQ.textContent=fj(Q)+' J';vA.textContent=fn(Ta,1)+' °C';
vt.textContent=run?'El cubo cede calor al aire':'Equilibrio térmico: ambos a '+fn(Ta,0)+' °C'}
else{bC.setAttribute('width',662*Tk/373);bA.setAttribute('width',662*Ak/373);
vt.textContent=run?'Energía cinética media: cubo MAYOR que aire':'Equilibrio térmico: misma energía cinética media'}}
requestAnimationFrame(loop);return function(){dead=true};}

function unirConceptos(box,PAIRSX){
  var PAIRS=PAIRSX||[{c:'Temperatura',d:'Mide la energía cinética de las partículas de un cuerpo.'},{c:'Calor',d:'Energía que se transfiere entre cuerpos con distinta temperatura.'},{c:'Equilibrio térmico',d:'Estado en que dos cuerpos tienen la misma temperatura.'},{c:'Cinética molecular',d:'Energía que tienen las partículas por estar en movimiento.'}];
  box.innerHTML='<div class="un-board"><svg class="un-lines"></svg><div class="un-col un-cs"></div><div class="un-col un-ds"></div></div><div class="un-bar"><button class="un-btn" data-a="chk">Comprobar</button><button class="un-btn un-ghost" data-a="rst">Reiniciar</button><span class="un-msg" aria-live="polite"></span></div><p class="un-help">Arrastra desde el punto de cada concepto hasta su definición (o toca el concepto y luego la definición). Toca una línea para borrarla.</p>';
  var board=box.querySelector('.un-board'),cs=box.querySelector('.un-cs'),ds=box.querySelector('.un-ds'),svg=box.querySelector('.un-lines'),msg=box.querySelector('.un-msg');
  var NS='http://www.w3.org/2000/svg',links={},sel=null,checked=false,suppress=false,cEl=[],dEl=[];
  function sc(){ return board.getBoundingClientRect().width/board.offsetWidth||1; }
  function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)),t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function clearCheck(){ checked=false; msg.textContent=''; msg.className='un-msg'; }
  function connect(i,j){ for(var k in links) if(links[k]===j) delete links[k]; links[i]=j; clearCheck(); paint(); }
  function pt(e,side){ var r=e.getBoundingClientRect(),b=board.getBoundingClientRect(),k=sc(); return [((side==='r'?r.right:r.left)-b.left)/k,(r.top+r.height/2-b.top)/k]; }
  function path(a,b){ var dx=Math.max(40,Math.abs(b[0]-a[0])*.45); return 'M'+a[0]+' '+a[1]+' C'+(a[0]+dx)+' '+a[1]+' '+(b[0]-dx)+' '+b[1]+' '+b[0]+' '+b[1]; }
  function build(){
    cs.innerHTML=''; ds.innerHTML=''; cEl=[]; dEl=[]; links={}; sel=null; suppress=false; clearCheck();
    PAIRS.forEach(function(p,i){ var b=document.createElement('div'); b.className='un-item un-concept'; b.innerHTML='<span>'+p.c+'</span><i class="un-dot"></i>'; cs.appendChild(b); cEl[i]=b;
      b.addEventListener('pointerdown',function(e){ down(e,i); });
      b.addEventListener('click',function(){ if(suppress){ suppress=false; return; } sel=(sel===i?null:i); paint(); }); });
    shuffle(PAIRS.map(function(_,q){ return q; })).forEach(function(j){ var d=document.createElement('div'); d.className='un-item un-def'; d.dataset.j=j; d.innerHTML='<i class="un-dot"></i><span>'+PAIRS[j].d+'</span><b class="un-mark"></b>'; ds.appendChild(d); dEl[j]=d;
      d.addEventListener('click',function(){ if(sel!==null){ connect(sel,j); sel=null; } }); });
    paint();
  }
  function paint(){
    svg.innerHTML='';
    cEl.forEach(function(e,i){ e.className='un-item un-concept'+(sel===i?' sel':'')+(links[i]!==undefined?' linked':''); });
    dEl.forEach(function(e){ e.className='un-item un-def'; var m=e.querySelector('.un-mark'); m.textContent=''; m.className='un-mark'; });
    for(var i in links){ var j=links[i], p=document.createElementNS(NS,'path'); p.setAttribute('d',path(pt(cEl[i],'r'),pt(dEl[j],'l')));
      var d=dEl[j], m=d.querySelector('.un-mark'); d.classList.add('linked');
      if(checked){ var ok=(+i===j); p.setAttribute('class',ok?'good':'wrong'); d.classList.add(ok?'good':'wrong'); cEl[i].classList.add(ok?'good':'wrong'); m.className='un-mark '+(ok?'good':'wrong'); m.textContent=ok?'✓ Correcto':'✗ Revisa'; }
      (function(i){ p.addEventListener('click',function(){ delete links[i]; clearCheck(); paint(); }); })(i); svg.appendChild(p); }
  }
  function down(e,i){
    if(e.button>0) return; var start=[e.clientX,e.clientY], moved=false, tmp=document.createElementNS(NS,'path'); tmp.setAttribute('class','tmp'); svg.appendChild(tmp); var a=pt(cEl[i],'r');
    function target(ev){ var t=document.elementFromPoint(ev.clientX,ev.clientY); return t&&t.closest&&t.closest('.un-def'); }
    function mv(ev){ var b=board.getBoundingClientRect(),k=sc(); if(Math.hypot(ev.clientX-start[0],ev.clientY-start[1])>6) moved=true;
      if(moved){ tmp.setAttribute('d',path(a,[(ev.clientX-b.left)/k,(ev.clientY-b.top)/k])); dEl.forEach(function(x){ x.classList.remove('hot'); }); var d=target(ev); if(d) d.classList.add('hot'); } }
    function up(ev){ document.removeEventListener('pointermove',mv); document.removeEventListener('pointerup',up); tmp.remove(); dEl.forEach(function(x){ x.classList.remove('hot'); });
      if(moved){ suppress=true; setTimeout(function(){ suppress=false; },0); var d=target(ev); if(d) connect(i,+d.dataset.j); else paint(); } }
    document.addEventListener('pointermove',mv); document.addEventListener('pointerup',up);
  }
  box.querySelector('[data-a=chk]').onclick=function(){
    var n=Object.keys(links).length; if(n<PAIRS.length){ msg.textContent='Falta unir '+(PAIRS.length-n)+' concepto'+(PAIRS.length-n>1?'s':'')+'.'; msg.className='un-msg'; return; }
    checked=true; var ok=0; for(var i in links) if(+i===links[i]) ok++; paint();
    if(ok===PAIRS.length){ msg.textContent='¡Excelente! Las '+PAIRS.length+' uniones son correctas.'; msg.className='un-msg good'; } else { msg.textContent=ok+' de '+PAIRS.length+' correctas. Corrige las líneas con ✗: tócalas para borrarlas.'; msg.className='un-msg wrong'; }
  };
  box.querySelector('[data-a=rst]').onclick=build;
  build();
}




function cronometro(slide){
  var w=document.createElement('div'); w.className='sw';
  w.innerHTML='<div class="swc"><svg viewBox="0 0 24 24" width="64" height="64" aria-label="Lápiz" role="img" fill="none" stroke="#13233a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4.2L16.6 4.2a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19 4 20z"/><path d="M14.6 6.2l3.2 3.2"/><path d="M4 20l1-4.2 3.2 3.2L4 20z"/></svg></div><div class="swr"><input class="swt" type="text" value="05:00" inputmode="numeric" aria-label="Tiempo del temporizador (escribe minutos o mm:ss)" maxlength="6"><button class="swb" aria-label="Iniciar o pausar el temporizador">▶</button></div>';
  slide.appendChild(w);
  var inp=w.querySelector('.swt'), go=w.querySelector('.swb'), setMs=300000, left=setMs, run=false, last=0, iv=null, ac=null;
  function fmt(ms){ var s=Math.ceil(ms/1000), m=Math.floor(s/60); return (m<10?'0':'')+m+':'+((s%60)<10?'0':'')+(s%60); }
  function parse(v){ v=String(v).trim().replace(',','.'); if(!v) return null; var m=v.match(/^(\d{1,3}):([0-5]?\d)$/); if(m) return (+m[1]*60+ +m[2])*1000; if(/^\d+(\.\d+)?$/.test(v)) return Math.round(parseFloat(v)*60000); return null; }
  function beep(){ try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); [0,.35,.7].forEach(function(t){ var o=ac.createOscillator(),g=ac.createGain(); o.frequency.value=880; g.gain.value=.2; o.connect(g); g.connect(ac.destination); o.start(ac.currentTime+t); o.stop(ac.currentTime+t+.22); }); }catch(e){} }
  function setRun(r){ run=r; last=performance.now(); go.textContent=r?'❚❚':'▶'; if(r) w.classList.remove('done'); }
  function tick(){ var n=performance.now(); if(run){ left-=n-last; if(left<=0){ left=0; setRun(false); w.classList.add('done'); beep(); } } last=n; if(document.activeElement!==inp) inp.value=fmt(left); }
  function apply(){ var ms=parse(inp.value); if(ms!==null){ setMs=left=Math.min(ms,5999000); w.classList.remove('done'); } inp.value=fmt(left); }
  inp.addEventListener('focus',function(){ setRun(false); inp.select(); });
  inp.addEventListener('blur',apply);
  inp.addEventListener('keydown',function(e){ e.stopPropagation(); if(e.key==='Enter'){ apply(); inp.blur(); } });
  go.onclick=function(){ if(!run){ if(left<=0){ left=setMs; w.classList.remove('done'); } setRun(true); } else setRun(false); };
  w.addEventListener('pointerdown',function(e){ e.stopPropagation(); });
  inp.value=fmt(left); iv=setInterval(tick,200);
  return function(){ clearInterval(iv); };
}


var FECHA_PZ=null;
function montarFecha(el){
  var MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  if(!FECHA_PZ){ try{ FECHA_PZ=JSON.parse(localStorage.getItem('sc_fecha')||'null'); }catch(e){} }
  if(!FECHA_PZ){ var t=new Date(); FECHA_PZ={d:t.getDate(),m:t.getMonth(),y:t.getFullYear()}; }
  var st='font:700 38px Nunito Sans,Arial,sans-serif;color:#13233a;background:#fff;border:3px solid #cbd5e1;border-radius:12px;padding:4px 10px;text-align:center';
  el.style.cssText+=';display:flex;align-items:center;gap:12px;font-size:38px;font-weight:700;color:#475569';
  el.innerHTML='<span>Fecha:</span><input type="number" min="1" max="31" class="fd" style="'+st+';width:92px"><span>de</span><select class="fm" style="'+st+'">'+MES.map(function(n,i){return '<option value="'+i+'">'+n+'</option>';}).join('')+'</select><span>de</span><input type="number" min="2000" max="2100" class="fy" style="'+st+';width:132px">';
  var fd=el.querySelector('.fd'), fm=el.querySelector('.fm'), fy=el.querySelector('.fy');
  fd.value=FECHA_PZ.d; fm.value=FECHA_PZ.m; fy.value=FECHA_PZ.y;
  function sv(){ var d=parseInt(fd.value,10), y=parseInt(fy.value,10); if(d>=1&&d<=31) FECHA_PZ.d=d; if(y>=1900&&y<=2200) FECHA_PZ.y=y; FECHA_PZ.m=parseInt(fm.value,10); try{ localStorage.setItem('sc_fecha',JSON.stringify(FECHA_PZ)); }catch(e){} }
  fd.oninput=fm.onchange=fy.oninput=sv;
}
function presentacion(box,SLIDES,CFG){
  var N=SLIDES.length, idx=0, mounts=[], notesOn=false, hold=null;
  box.innerHTML='<div class="pz-stage"><div class="pz-wrap"><div class="pz-slide"></div></div></div><div class="pz-simbox" hidden></div><div class="pz-notes" hidden></div><div class="pz-bar"><button class="btn2" data-a="prev">‹ Anterior</button><span class="pz-count" aria-live="polite"></span><button class="btn2" data-a="next">Siguiente ›</button><span class="pz-sp"></span><button class="btn2" data-a="notes">Notas del docente</button><button class="btn2" data-a="fs">Pantalla completa</button><span class="pz-clock" title="Hora actual"></span></div>';
  var simBox=box.querySelector('.pz-simbox'), stage=box.querySelector('.pz-stage'), wrap=box.querySelector('.pz-wrap'), slide=box.querySelector('.pz-slide'), notes=box.querySelector('.pz-notes'), count=box.querySelector('.pz-count');
  function fit(){ var w=stage.clientWidth, h=stage.clientHeight, k=Math.min(w/1920,h/1080); wrap.style.width=(1920*k)+'px'; wrap.style.height=(1080*k)+'px'; slide.style.transform='scale('+k+')'; }
  function unmount(){ mounts.forEach(function(f){ try{ f(); }catch(e){} }); mounts=[]; }
  function show(n){
    unmount(); idx=Math.max(0,Math.min(N-1,n)); var s=SLIDES[idx]; stage.hidden=!!s.sim; simBox.hidden=!s.sim; simBox.innerHTML='';
    if(s.sim){ mounts.push(CFG.sim(simBox)); count.textContent=(idx+1)+' / '+N; notes.textContent=s.notes||''; box.querySelector('[data-a=prev]').disabled=idx===0; box.querySelector('[data-a=next]').disabled=idx===N-1; return; }
    slide.setAttribute('style',s.style+';position:relative;width:1920px;height:1080px;transform-origin:0 0;box-sizing:border-box;overflow:hidden'); slide.innerHTML=s.html;
    slide.querySelectorAll('.cubo').forEach(function(d){ var svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 800 440'); svg.setAttribute('style','width:100%;height:100%;display:block'); d.appendChild(svg); mounts.push(cuboAnim(svg,d.getAttribute('data-mode'))); });
    slide.querySelectorAll('.atomo').forEach(function(d){ mounts.push(lineaTiempoAtomica(d,{compact:true,only:[d.getAttribute('data-model')],el:d.getAttribute('data-el')||'Li',neutrons:true})); });
    slide.querySelectorAll('.fecha').forEach(montarFecha);
    slide.querySelectorAll('.hist').forEach(function(d){ mounts.push(historiaAtomismo(d)); });
    var u=slide.querySelector('.unir'); if(u) unirConceptos(u,CFG.pairs);
    if(s.timer) mounts.push(cronometro(slide));
    count.textContent=(idx+1)+' / '+N; notes.textContent=s.notes||'Sin notas para esta diapositiva.'; fit();
    box.querySelector('[data-a=prev]').disabled=idx===0; box.querySelector('[data-a=next]').disabled=idx===N-1;
  }
  function onKey(e){ var tg=e.target&&e.target.tagName; if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA') return; if(e.key==='ArrowRight'||e.key==='PageDown'){ show(idx+1); } else if(e.key==='ArrowLeft'||e.key==='PageUp'){ show(idx-1); } }
  box.querySelector('[data-a=prev]').onclick=function(){ show(idx-1); }; box.querySelector('[data-a=next]').onclick=function(){ show(idx+1); };
  box.querySelector('[data-a=notes]').onclick=function(){ notesOn=!notesOn; notes.hidden=!notesOn; fit(); };
  box.classList.add('pz-root'); box.querySelector('[data-a=fs]').onclick=function(){ try{ if(document.fullscreenElement) document.exitFullscreen(); else if(box.requestFullscreen) box.requestFullscreen(); }catch(e){} };
  document.addEventListener('keydown',onKey); window.addEventListener('resize',fit); document.addEventListener('fullscreenchange',fit);
  if(typeof ResizeObserver!=='undefined'){ hold=new ResizeObserver(fit); hold.observe(stage); }
  var clk=box.querySelector('.pz-clock'); function tick(){ clk.textContent=new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}); } tick(); var clkT=setInterval(tick,10000);
  show(0);
  return function stop(){ clearInterval(clkT); unmount(); document.removeEventListener('keydown',onKey); window.removeEventListener('resize',fit); document.removeEventListener('fullscreenchange',fit); if(hold) hold.disconnect(); };
}

