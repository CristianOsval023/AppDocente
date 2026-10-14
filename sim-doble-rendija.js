'use strict';
/* Experimento mecano-cuántico: doble rendija */
/* ---------- MECANO-CUÁNTICO: doble rendija con electrones ---------- */
function dobleRendija(box){
  box.innerHTML=expShell('dqC','Electrones disparados contra una barrera con dos rendijas; se acumulan en una pantalla formando un patrón de interferencia',
   '<div class="fc-box"><h4>Rendijas</h4>'+SL('dqO','Rendijas abiertas',[['both','Ambas (A y B)'],['A','Solo A (superior)'],['B','Solo B (inferior)']],'both')+RG('dqD','Separación entre rendijas',30,90,5,60,' u')+CK('dqDet','Detector: observar por cuál pasa',false)+'</div>'+
   '<div class="fc-box"><h4>Electrones</h4>'+RG('dqV','Energía (tensión de aceleración)',50,400,10,150,' V')+RG('dqR','Electrones por segundo',2,60,2,12,'')+CK('dqP','Mostrar curva de probabilidad',false)+'</div>'+
   '<div class="fc-btns"><button class="btn2 fc-go" id="dqGo">⏸ Pausar</button><button class="btn2" id="dqBu">Ráfaga ×200</button><button class="btn2" id="dqCl">Limpiar pantalla</button></div>',
   [['¿En qué consistió?','Se disparan electrones, uno a la vez, contra una barrera con dos rendijas (Jönsson 1961; Tonomura 1989), siguiendo la idea de onda de materia de De Broglie y la difracción de electrones de Davisson y Germer (1927).'],
    ['¿Qué se observó?','Cada electrón llega como un punto, pero al acumularse forman franjas de interferencia, como una onda. Si un detector «mira» por cuál rendija pasa, las franjas desaparecen.'],
    ['Conclusión → modelo mecano-cuántico (1926)','El electrón no sigue una trayectoria definida: se describe con una onda de probabilidad. Por eso hoy se habla de orbitales (zonas de probabilidad) y no de órbitas.']]);
  var cv=box.querySelector('#dqC'), cx=cv.getContext('2d'), msg=box.querySelector('.fc-status'), msgS=msg.appendChild(document.createElement('span'));
  var sel=box.querySelector('#dqO'), ckD=box.querySelector('#dqDet'), ckP=box.querySelector('#dqP'), bGo=box.querySelector('#dqGo');
  var Dd=60,Vv=150,Rr=12; 
  var C=rfCanvas(cv), SCX=610, SCW=80, YC=220, HY=180, NB=90, bins, total=0, els=[], acc=0, burst=0, run=true, raf=0, last=performance.now(), off=document.createElement('canvas');
  off.width=SCW; off.height=2*HY; var ox=off.getContext('2d');
  function sinc(x){ return Math.abs(x)<1e-6?1:Math.sin(x)/x; }
  function prob(y){ var lam=1.226/Math.sqrt(Vv), A=13200*lam, a=12, s=Dd/2, o=sel.value, sc=function(yy){ var q=sinc(Math.PI*a*yy/A); return q*q; };
    if(o==='A') return sc(y-s); if(o==='B') return sc(y+s);
    if(ckD.checked) return .5*(sc(y-s)+sc(y+s)); var c=Math.cos(Math.PI*Dd*y/A); return c*c*sc(y); }
  function clearAll(){ bins=new Array(NB).fill(0); total=0; els=[]; ox.clearRect(0,0,SCW,2*HY); note(); }
  function note(){ var o=sel.value, d=ckD.checked; msgS.innerHTML=total===0?'<b>Pantalla vacía:</b>&nbsp;pulsa «Ráfaga ×200» y observa cómo se va formando el patrón.':(o!=='both'?'<b>Una sola rendija:</b>&nbsp;los electrones se agrupan frente a ella, sin franjas.':(d?'<b>Con detector:</b>&nbsp;saber por cuál rendija pasa cada electrón destruye la interferencia: se comportan como partículas.':'<b>Ambas rendijas, sin mirar:</b>&nbsp;aparecen franjas de interferencia aunque los electrones lleguen de a uno. Total: '+total+'.')); }
  sel.onchange=clearAll; ckD.onchange=clearAll;
  bGo.onclick=function(){ run=!run; bGo.textContent=run?'⏸ Pausar':'▶ Disparar'; }; box.querySelector('#dqBu').onclick=function(){ burst+=200; }; box.querySelector('#dqCl').onclick=clearAll;
  function sample(){ for(var i=0;i<400;i++){ var y=(Math.random()*2-1)*HY; if(Math.random()<prob(y)) return y; } return 0; }
  function fire(fast){ var o=sel.value, y=sample(), sl=o==='A'?1:(o==='B'?-1:(Math.random()<.5?1:-1)); els.push({t:0,y:y,sl:sl,fast:fast,wave:!ckD.checked,done:false}); }
  function frame(now){
    raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now; C.begin(cx); var INK=C.INK, MUT=C.MUT, i, s=Dd/2, o=sel.value, det=ckD.checked;
    if(run){ acc+=Rr*dt; while(acc>=1){ acc-=1; fire(false); } } if(burst>0){ var k=Math.min(burst,Math.ceil(dt*220)); for(i=0;i<k;i++) fire(true); burst-=k; }
    /* cañón */
    cx.fillStyle='#495057'; cx.fillRect(24,200,60,40); cx.fillStyle='#adb5bd'; cx.fillRect(84,216,12,8); rfTxt(cx,'Cañón de electrones',54,262,INK,12,'center'); rfTxt(cx,'λ = '+fnum(1.226/Math.sqrt(Vv),3)+' nm',54,278,MUT,11,'center');
    /* barrera */
    var gaps=[[YC-s,'A'],[YC+s,'B']]; cx.fillStyle='#343a40'; var segs=[[40,YC-s-6],[YC-s+6,YC+s-6],[YC+s+6,400]]; segs.forEach(function(g){ cx.fillRect(296,g[0],8,g[1]-g[0]); });
    if(o==='A') cx.fillRect(296,YC+s-6,8,12); if(o==='B') cx.fillRect(296,YC-s-6,8,12);
    rfTxt(cx,'A',284,YC-s+4,INK,13,'right',700); rfTxt(cx,'B',284,YC+s+4,INK,13,'right',700); rfTxt(cx,'Barrera con dos rendijas',300,30,INK,13,'center');
    if(det){ cx.font='18px system-ui'; cx.fillText('👁',308,YC-s-8); cx.fillText('👁',308,YC+s+22); }
    /* pantalla */
    cx.fillStyle='#10201a'; cx.fillRect(SCX,YC-HY,SCW,2*HY); cx.drawImage(off,SCX,YC-HY); cx.strokeStyle=MUT; cx.lineWidth=2; cx.strokeRect(SCX,YC-HY,SCW,2*HY); rfTxt(cx,'Pantalla',SCX+SCW/2,YC-HY-10,INK,12,'center');
    /* electrones */
    for(i=els.length-1;i>=0;i--){ var e=els[i], v1=e.fast?1500:520, T1=210/v1, T2=e.fast?.12:.55; e.t+=dt;
      if(e.t<T1){ cx.fillStyle='#74c0fc'; cx.beginPath(); cx.arc(90+e.t*v1,YC,3,0,6.2832); cx.fill(); }
      else { var f=(e.t-T1)/T2, sy=YC-e.sl*s;
        if(e.wave){ if(f<1&&!e.fast){ cx.lineWidth=2; cx.strokeStyle='rgba(116,192,252,'+(.55*(1-f))+')'; [o!=='B'?YC-s:null,o!=='A'?YC+s:null].forEach(function(cy){ if(cy===null) return; cx.beginPath(); cx.arc(300,cy,f*310,-1.45,1.45); cx.stroke(); }); } }
        else if(f<1){ var px=300+(SCX-300)*f, py=sy+(YC-e.y-sy)*f; cx.fillStyle='#ffa94d'; cx.beginPath(); cx.arc(px,py,3,0,6.2832); cx.fill(); if(f<.12){ cx.strokeStyle='#e03131'; cx.lineWidth=2; cx.beginPath(); cx.arc(300,sy,14,0,6.2832); cx.stroke(); } }
        if(f>=1&&!e.done){ e.done=true; var bx=Math.floor((e.y+HY)/(2*HY)*NB); if(bx>=0&&bx<NB){ bins[bx]++; total++; } ox.fillStyle='rgba(140,255,170,.9)'; ox.fillRect(Math.floor(Math.random()*(SCW-2)),Math.round(HY-e.y)-1,2,2); }
        if(f>1.1){ els.splice(i,1); } } }
    if(Math.random()<.15) note();
    /* histograma y curva de probabilidad */
    var mx=1; for(i=0;i<NB;i++) mx=Math.max(mx,bins[i]); rfTxt(cx,'Cantidad',748,YC-HY-10,INK,12,'center');
    cx.fillStyle='#f08c00'; for(i=0;i<NB;i++){ var w=bins[i]/mx*60, yy=YC-HY+i*(2*HY/NB); cx.fillRect(700,yy,w,2*HY/NB-.6); }
    if(ckP.checked){ var tot=0, pr=[]; for(i=0;i<NB;i++){ var p=prob((i+.5)*(2*HY/NB)-HY); pr.push(p); tot+=p; } var pm=Math.max.apply(null,pr)||1; cx.strokeStyle='#e03131'; cx.lineWidth=2; cx.beginPath(); for(i=0;i<NB;i++){ var xx=700+pr[i]/pm*60, y3=YC-HY+(i+.5)*(2*HY/NB); if(i) cx.lineTo(xx,y3); else cx.moveTo(xx,y3); } cx.stroke(); rfTxt(cx,'curva de probabilidad',700,YC+HY+34,'#e03131',12,'left',700); }
    rfTxt(cx,'Cada punto es un electrón',SCX,YC+HY+16,MUT,12,'left');
    rfTxt(cx,'Entre la barrera y la pantalla se dibuja la onda de probabilidad',300,430,MUT,12,'center');
  }
  bindRg(box,'dqD',function(v){ Dd=v; clearAll(); }); bindRg(box,'dqV',function(v){ Vv=v; clearAll(); }); bindRg(box,'dqR',function(v){ Rr=v; });
  clearAll(); raf=requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(raf); C.stop(); };
}

