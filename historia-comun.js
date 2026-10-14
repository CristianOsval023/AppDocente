'use strict';
/* Motor compartido de la Clase 5 (modelos atómicos): historias animadas y marco de simuladores en TEMA CLARO.
   Todo lo que empieza con "hc" es de este archivo. Lo usan los archivos sim-c5-*.js */
var HC={ink:'#14213d',mut:'#475569',bg:'#f3f5f7',card:'#ffffff',line:'#c3cddb',blue:'#1971c2',red:'#e03131',green:'#2b8a3e',org:'#e8590c',yel:'#f59f00',e:'#1c7ed6',p:'#e03131'};
var HC_DF="font-family:Domine,Georgia,serif", HC_NF="font-family:'Nunito Sans',Arial,sans-serif";

function hcEz(x){ x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); }
function hcCl(x,a,b){ return Math.max(a,Math.min(b,x)); }
function hcRnd(seed){ var s=seed>>>0||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function hcGauss(r){ var u=1-r(), v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.2832*v); }
function hcT(x,y,sz,col,txt,anc,wt,ex){ return '<text x="'+x+'" y="'+y+'" font-size="'+sz+'" fill="'+col+'" text-anchor="'+(anc||'middle')+'" font-weight="'+(wt||800)+'" style="'+HC_NF+'" '+(ex||'')+'>'+txt+'</text>'; }
function hcTD(x,y,sz,col,txt,anc,ex){ return '<text x="'+x+'" y="'+y+'" font-size="'+sz+'" fill="'+col+'" text-anchor="'+(anc||'middle')+'" font-weight="600" style="'+HC_DF+'" '+(ex||'')+'>'+txt+'</text>'; }

/* ---------- estilos (se inyectan una sola vez) ---------- */
function hcEstilo(){
  if(document.getElementById('hc-estilo')) return;
  var c=[
   '.hc-root{--u:1px;flex:1;min-height:0;height:100%;display:flex;flex-direction:column;gap:calc(var(--u)*10);padding:calc(var(--u)*10);box-sizing:border-box;background:#f3f5f7;color:#14213d;font-family:"Nunito Sans",Arial,sans-serif;user-select:none;-webkit-user-select:none}',
   '.hc-top{display:flex;align-items:center;gap:calc(var(--u)*16);flex-wrap:wrap}',
   '.hc-chip{background:#14213d;color:#fff;border-radius:calc(var(--u)*40);padding:calc(var(--u)*6) calc(var(--u)*26);font:800 calc(var(--u)*26)/1.2 "Nunito Sans",Arial,sans-serif}',
   '.hc-pista{font:700 calc(var(--u)*24)/1.2 "Nunito Sans",Arial,sans-serif;color:#14213d;background:#fff3bf;border:3px solid #f59f00;border-radius:calc(var(--u)*16);padding:calc(var(--u)*4) calc(var(--u)*20)}',
   '.hc-escena{flex:1;min-height:0;position:relative;background:#fff;border:3px solid #c3cddb;border-radius:calc(var(--u)*20);overflow:hidden;touch-action:none}',
   '.hc-cap{background:#fff;border:3px solid #14213d;border-radius:calc(var(--u)*18);padding:calc(var(--u)*8) calc(var(--u)*24);font:800 calc(var(--u)*30)/1.22 "Nunito Sans",Arial,sans-serif;min-height:calc(var(--u)*76);display:flex;align-items:center;color:#14213d}',
   '.hc-msg{background:#fff;border:3px solid #c3cddb;border-radius:calc(var(--u)*18);padding:calc(var(--u)*6) calc(var(--u)*24);font:800 calc(var(--u)*27)/1.25 "Nunito Sans",Arial,sans-serif;min-height:calc(var(--u)*52);display:block;color:#14213d}',
   '.hc-msg.ok{border-color:#2b8a3e;background:#ebfbee}.hc-msg.warn{border-color:#e8590c;background:#fff4e6}.hc-msg.bad{border-color:#c92a2a;background:#fff5f5}',
   '.hc-ctrl{display:flex;align-items:center;gap:calc(var(--u)*14);flex-wrap:wrap}',
   '.hc-btn{font:800 calc(var(--u)*25)/1 "Nunito Sans",Arial,sans-serif;color:#14213d;background:#fff;border:3px solid #14213d;border-radius:calc(var(--u)*14);padding:calc(var(--u)*10) calc(var(--u)*22);cursor:pointer;touch-action:manipulation;min-height:calc(var(--u)*30)}',
   '.hc-btn:active{transform:translateY(2px)}.hc-btn.on{background:#14213d;color:#fff}.hc-btn.go{background:#1971c2;border-color:#1971c2;color:#fff}.hc-btn:disabled{opacity:.35;cursor:default}',
   '.hc-sl{display:flex;align-items:center;gap:calc(var(--u)*14);font:800 calc(var(--u)*25) "Nunito Sans",Arial,sans-serif;flex:1;min-width:calc(var(--u)*380)}',
   '.hc-sl input{flex:1;min-width:0;height:calc(var(--u)*44);accent-color:#1971c2;cursor:pointer}',
   '.hc-sl b{min-width:calc(var(--u)*100);text-align:center;background:#fff;border:3px solid #c3cddb;border-radius:calc(var(--u)*12);padding:calc(var(--u)*2) calc(var(--u)*8)}',
   '.hc-pts{display:flex;gap:calc(var(--u)*10);margin-left:auto;align-items:center}',
   '.hc-dot{width:calc(var(--u)*24);height:calc(var(--u)*24);border-radius:50%;background:#c3cddb;border:3px solid #fff;box-shadow:0 0 0 2px #c3cddb;cursor:pointer;padding:0}.hc-dot.on{background:#1971c2;box-shadow:0 0 0 2px #1971c2}.hc-dot.past{background:#74c0fc;box-shadow:0 0 0 2px #74c0fc}'
  ].join('\n');
  var s=document.createElement('style'); s.id='hc-estilo'; s.textContent=c; document.head.appendChild(s);
}
/* mantiene la variable --u (1 unidad = 1/1000 del ancho) para que todo se vea grande en cualquier pantalla */
function hcEscala(root){
  function f(){ var w=root.clientWidth||root.parentNode.clientWidth||1000, h=root.clientHeight||640; root.style.setProperty('--u',Math.min(Math.max(520,w)/1000,Math.max(300,h)/640).toFixed(3)+'px'); }
  var ro=window.ResizeObserver?new ResizeObserver(f):null; if(ro) ro.observe(root); else window.addEventListener('resize',f); f();
  return function(){ if(ro) ro.disconnect(); else window.removeEventListener('resize',f); };
}
/* marco estándar de un simulador: título, pista, escena, mensaje y controles */
function hcMarco(box,titulo,pista){
  hcEstilo();
  box.innerHTML='<div class="hc-root"><div class="hc-top"><span class="hc-chip">'+titulo+'</span>'+(pista?'<span class="hc-pista">'+pista+'</span>':'')+'</div><div class="hc-escena"></div><div class="hc-msg">&nbsp;</div><div class="hc-ctrl"></div></div>';
  var root=box.firstChild, off=hcEscala(root), m=root.querySelector('.hc-msg');
  return {root:root, esc:root.querySelector('.hc-escena'), ctrl:root.querySelector('.hc-ctrl'),
    msg:function(t,cls){ m.className='hc-msg'+(cls?' '+cls:''); m.innerHTML=t||'&nbsp;'; }, off:off};
}
function hcBtn(par,txt,fn,cls){ var b=document.createElement('button'); b.className='hc-btn'+(cls?' '+cls:''); b.innerHTML=txt; b.addEventListener('click',fn); par.appendChild(b); return b; }
function hcSlider(par,lab,min,max,step,val,fn,fmt){
  var d=document.createElement('label'); d.className='hc-sl'; d.innerHTML='<span>'+lab+'</span><input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"><b></b>'; par.appendChild(d);
  var i=d.querySelector('input'), o=d.querySelector('b');
  function u(){ o.textContent=fmt?fmt(+i.value):i.value; fn(+i.value); } i.addEventListener('input',u); u();
  return {el:i,set:function(v){ i.value=v; u(); }};
}
/* lienzo con coordenadas lógicas fijas (LW×LH), centrado y nítido en cualquier pantalla */
function hcLienzo(host,LW,LH){
  var cv=document.createElement('canvas'); cv.style.cssText='width:100%;height:100%;display:block;touch-action:none'; host.appendChild(cv);
  var o={cv:cv,cx:cv.getContext('2d'),LW:LW,LH:LH,k:1,ox:0,oy:0,dpr:1};
  function size(){ var r=host.getBoundingClientRect(); o.dpr=window.devicePixelRatio||1; var w=Math.max(10,r.width), h=Math.max(10,r.height);
    cv.width=Math.round(w*o.dpr); cv.height=Math.round(h*o.dpr); o.k=Math.min(w/LW,h/LH); o.ox=(w-LW*o.k)/2; o.oy=(h-LH*o.k)/2; }
  var ro=window.ResizeObserver?new ResizeObserver(size):null; if(ro) ro.observe(host); else window.addEventListener('resize',size); size();
  o.begin=function(){ var cx=o.cx; cx.setTransform(1,0,0,1,0,0); cx.clearRect(0,0,cv.width,cv.height); cx.setTransform(o.dpr*o.k,0,0,o.dpr*o.k,o.dpr*o.ox,o.dpr*o.oy); cx.globalAlpha=1; };
  o.pt=function(e){ var r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left-o.ox)/o.k,y:(e.clientY-r.top-o.oy)/o.k}; };
  o.stop=function(){ if(ro) ro.disconnect(); else window.removeEventListener('resize',size); };
  return o;
}
function hcTxtC(cx,s,x,y,col,size,al,wt){ cx.fillStyle=col; cx.font=(wt||800)+' '+(size||26)+'px "Nunito Sans",Arial,sans-serif'; cx.textAlign=al||'center'; cx.textBaseline='middle'; cx.fillText(s,x,y); cx.textAlign='left'; cx.textBaseline='alphabetic'; }
function hcBola(cx,x,y,r,col,lab,tc){
  var g=cx.createRadialGradient(x-r*.35,y-r*.4,r*.08,x,y,r); g.addColorStop(0,'#ffffff'); g.addColorStop(.3,col); g.addColorStop(1,col);
  cx.fillStyle=g; cx.beginPath(); cx.arc(x,y,r,0,6.2832); cx.fill(); cx.strokeStyle='rgba(20,33,61,.55)'; cx.lineWidth=2.5; cx.stroke();
  if(lab) hcTxtC(cx,lab,x,y+1,tc||'#14213d',Math.round(r*.95),'center',800);
}

/* ---------- ilustraciones: persona y modelos atómicos (cadenas SVG) ---------- */
function hcPersona(o){
  var x=o.x,y=o.y,sc=o.sc||.85,f=o.face||1,w=o.walk?Math.sin(o.walk*9)*16:0,g=o.gest?Math.sin(o.gest*4)*14:0,
      tun=o.tun||'#4c6ef5',trim=o.trim||'#364fc7',hair=o.hair||'#868e96',sk=o.skin||'#f1c27d';
  var s='<g transform="translate('+x+','+y+') scale('+(f*sc)+','+sc+')">';
  s+='<line x1="-14" y1="-70" x2="'+(-14+w)+'" y2="0" stroke="#5c4033" stroke-width="14" stroke-linecap="round"/><line x1="14" y1="-70" x2="'+(14-w)+'" y2="0" stroke="#5c4033" stroke-width="14" stroke-linecap="round"/>';
  s+='<line x1="-32" y1="-176" x2="-46" y2="-114" stroke="'+sk+'" stroke-width="13" stroke-linecap="round"/>';
  s+='<polygon points="-38,-196 38,-196 54,-64 -54,-64" fill="'+tun+'" stroke="#14213d" stroke-width="3"/><rect x="-54" y="-84" width="108" height="18" fill="'+trim+'"/>';
  s+='<line x1="32" y1="-176" x2="'+(60+g)+'" y2="'+(-132-g)+'" stroke="'+sk+'" stroke-width="13" stroke-linecap="round"/>';
  s+='<circle cx="0" cy="-230" r="34" fill="'+sk+'" stroke="#14213d" stroke-width="3"/>';
  if(!o.calvo) s+='<path d="M-34,-234 Q-32,-272 0,-270 Q32,-272 34,-234 Q20,-252 0,-250 Q-20,-252 -34,-234Z" fill="'+hair+'"/>';
  if(o.barba) s+='<path d="M-26,-216 Q0,-168 26,-216 Q10,-202 0,-202 Q-10,-202 -26,-216Z" fill="'+hair+'"/>';
  if(o.bigote) s+='<path d="M-2,-214 Q14,-208 28,-216 Q16,-224 -2,-220Z" fill="'+hair+'"/>';
  s+='<circle cx="13" cy="-236" r="4" fill="#14213d"/></g>';
  if(o.name) s+=hcT(x,y+42,30,HC.ink,o.name,'middle',800);
  if(o.sub) s+=hcT(x,y+76,24,HC.mut,o.sub,'middle',600);
  return s;
}
/* modelo atómico dibujado en (cx,cy) con radio r. id: democrito|dalton|thomson|rutherford|bohr|cuantico */
function hcModelo(id,cx,cy,r,t){
  t=t||0; var s='', i, a, R;
  if(id==='democrito'){
    s+='<polygon points="'+[0,1,2,3,4,5].map(function(k){ var q=(k*60+15)*Math.PI/180, rr=r*(k%2?.82:1); return (cx+Math.cos(q)*rr).toFixed(1)+','+(cy+Math.sin(q)*rr).toFixed(1); }).join(' ')+'" fill="#adb5bd" stroke="#14213d" stroke-width="'+Math.max(3,r*.05)+'"/>';
    s+='<polygon points="'+(cx-r*.5)+','+(cy-r*.2)+' '+(cx-r*.1)+','+(cy-r*.6)+' '+(cx+r*.3)+','+(cy-r*.35)+'" fill="#dee2e6"/>';
  } else if(id==='dalton'){
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#ff922b" stroke="#14213d" stroke-width="'+Math.max(3,r*.05)+'"/><ellipse cx="'+(cx-r*.3)+'" cy="'+(cy-r*.35)+'" rx="'+(r*.3)+'" ry="'+(r*.2)+'" fill="#ffe8cc" transform="rotate(-30 '+(cx-r*.3)+' '+(cy-r*.35)+')"/>';
  } else if(id==='thomson'){
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#ffc9c9" stroke="#14213d" stroke-width="'+Math.max(3,r*.05)+'"/>';
    var rn=hcRnd(7); for(i=0;i<9;i++){ a=rn()*6.283; R=Math.sqrt(rn())*r*.74; s+='<circle cx="'+(cx+Math.cos(a)*R).toFixed(1)+'" cy="'+(cy+Math.sin(a)*R).toFixed(1)+'" r="'+(r*.11)+'" fill="'+HC.e+'" stroke="#fff" stroke-width="2"/>'; }
  } else if(id==='rutherford'){
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#adb5bd" stroke-width="3" stroke-dasharray="9 8"/>';
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.1)+'" fill="'+HC.p+'" stroke="#14213d" stroke-width="2"/>';
    [[.9,.35],[.7,2.6],[.95,4.4],[.6,5.5]].forEach(function(q){ var an=q[1]+t*.6; s+='<circle cx="'+(cx+Math.cos(an)*r*q[0]).toFixed(1)+'" cy="'+(cy+Math.sin(an)*r*q[0]).toFixed(1)+'" r="'+(r*.085)+'" fill="'+HC.e+'"/>'; });
  } else if(id==='bohr'){
    [.34,.62,.92].forEach(function(f,k){ s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*f)+'" fill="none" stroke="#868e96" stroke-width="3"/>'; var an=t*(1.6-k*.4)+k*2.1; s+='<circle cx="'+(cx+Math.cos(an)*r*f).toFixed(1)+'" cy="'+(cy+Math.sin(an)*r*f).toFixed(1)+'" r="'+(r*.09)+'" fill="'+HC.e+'" stroke="#fff" stroke-width="2"/>'; });
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.15)+'" fill="'+HC.p+'" stroke="#14213d" stroke-width="2"/>';
  } else if(id==='cuantico'){
    var rq=hcRnd(11); for(i=0;i<170;i++){ var rr=Math.abs(hcGauss(rq))*r*.42, an=rq()*6.283; if(rr>r) continue; s+='<circle cx="'+(cx+Math.cos(an)*rr).toFixed(1)+'" cy="'+(cy+Math.sin(an)*rr).toFixed(1)+'" r="'+(r*.045)+'" fill="'+HC.e+'" opacity=".45"/>'; }
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.1)+'" fill="'+HC.p+'" stroke="#14213d" stroke-width="2"/>';
  }
  return s;
}

/* ---------- motor de historias animadas ----------
   cfg: { titulo:'…', W:1600, H:620, escenas:[ { d:segundos, c:'texto breve', f:function(t){ return 'SVG interno'; } } ] } */
function hcHistoria(box,cfg){
  hcEstilo();
  var E=cfg.escenas, W=cfg.W||1600, H=cfg.H||620, s=0, t=0, play=true, raf=0, last=0, lastDraw=0, alive=true, i, dots='';
  for(i=0;i<E.length;i++) dots+='<button class="hc-dot" data-i="'+i+'" aria-label="Escena '+(i+1)+'"></button>';
  box.innerHTML='<div class="hc-root"><div class="hc-top"><span class="hc-chip">'+cfg.titulo+'</span></div><div class="hc-escena"><svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block"></svg></div><div class="hc-cap"></div><div class="hc-ctrl"><button class="hc-btn" data-h="prev" aria-label="Anterior">⏮</button><button class="hc-btn go" data-h="play" style="min-width:calc(var(--u)*170)">⏸ Pausa</button><button class="hc-btn" data-h="next" aria-label="Siguiente">⏭</button><span class="hc-pts">'+dots+'</span></div></div>';
  var root=box.firstChild, off=hcEscala(root), svg=root.querySelector('svg'), cap=root.querySelector('.hc-cap'), pb=root.querySelector('[data-h=play]'), ds=root.querySelectorAll('.hc-dot');
  function head(){ cap.textContent=E[s].c; for(var k=0;k<ds.length;k++) ds[k].className='hc-dot'+(k===s?' on':(k<s?' past':'')); }
  function pbl(){ pb.innerHTML=play?'⏸ Pausa':(t>=E[s].d&&s===E.length-1?'↻ Repetir':'▶ Seguir'); }
  function go(n){ s=hcCl(n,0,E.length-1); t=0; play=true; head(); pbl(); draw(); }
  function draw(){ svg.innerHTML=E[s].f(t); }
  function loop(now){ if(!alive) return; raf=requestAnimationFrame(loop); var dt=Math.min((now-last)/1000,.1); last=now;
    if(play){ t+=dt; if(t>=E[s].d){ if(s<E.length-1){ s++; t=0; head(); } else { t=E[s].d; play=false; pbl(); } } }
    if(now-lastDraw>30){ lastDraw=now; draw(); } }
  root.querySelector('[data-h=prev]').onclick=function(){ go(t>1.2?s:s-1); };
  root.querySelector('[data-h=next]').onclick=function(){ go(s+1); };
  pb.onclick=function(){ if(!play&&t>=E[s].d&&s===E.length-1){ go(0); return; } play=!play; pbl(); };
  root.querySelector('.hc-pts').addEventListener('click',function(e){ var d=e.target.closest&&e.target.closest('.hc-dot'); if(d) go(+d.getAttribute('data-i')); });
  head(); draw(); raf=requestAnimationFrame(function(n){ last=n; loop(n); });
  return function stop(){ alive=false; cancelAnimationFrame(raf); off(); };
}
/* fondos reutilizables para las historias */
function hcFondoExterior(W,H,G){
  return '<rect width="'+W+'" height="'+H+'" fill="#dff1fb"/><circle cx="'+(W-120)+'" cy="95" r="52" fill="#ffd43b"/><path d="M0,'+(G-60)+' Q300,'+(G-150)+' 620,'+(G-70)+' T1250,'+(G-100)+' T'+W+','+(G-50)+' L'+W+','+G+' L0,'+G+'Z" fill="#d3ecc0"/><rect y="'+G+'" width="'+W+'" height="'+(H-G)+'" fill="#f1e4b8"/><line x1="0" y1="'+G+'" x2="'+W+'" y2="'+G+'" stroke="#c9b27a" stroke-width="4"/>';
}
function hcFondoLab(W,H,G){
  return '<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/><rect y="'+G+'" width="'+W+'" height="'+(H-G)+'" fill="#e6d3ab"/><line x1="0" y1="'+G+'" x2="'+W+'" y2="'+G+'" stroke="#bfa56a" stroke-width="4"/><rect x="70" y="70" width="240" height="190" rx="10" fill="#dff1fb" stroke="#bfa56a" stroke-width="8"/><line x1="190" y1="70" x2="190" y2="260" stroke="#bfa56a" stroke-width="6"/><line x1="70" y1="165" x2="310" y2="165" stroke="#bfa56a" stroke-width="6"/>';
}
