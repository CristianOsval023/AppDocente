'use strict';
/* Experimento de Dalton: conservación de la masa */
/* ---------- DALTON: conservación de la masa y proporciones definidas ---------- */
function daltonExperimento(box){
  box.innerHTML=expShell('dtC','Recipiente sellado con átomos de hidrógeno y oxígeno que se combinan en moléculas de agua mientras se mide la masa',
   '<div class="fc-box"><h4>Reactivos en el recipiente</h4>'+RG('dtH','Átomos de hidrógeno (H)',2,24,2,8,'')+RG('dtO','Átomos de oxígeno (O)',1,12,1,4,'')+'</div>'+
   '<div class="fc-box"><h4>Masas relativas</h4><div style="line-height:1.5">Un átomo de H: <b>1 u</b><br>Un átomo de O: <b>16 u</b></div></div>'+
   '<div class="fc-btns"><button class="btn2 fc-go" id="dtGo">⚗ Reaccionar</button><button class="btn2" id="dtRs">Reiniciar</button></div>',
   [['¿En qué consistió?','Antoine Lavoisier y Joseph Proust pesaron las sustancias antes y después de reaccionar en recipientes cerrados y midieron en qué proporción se combinan los elementos.'],
    ['¿Qué se observó?','La masa total no cambia (se conserva). Y un mismo compuesto, como el agua, siempre tiene los mismos elementos en la misma proporción de masa (1 g de H por cada 8 g de O).'],
    ['Conclusión → modelo de Dalton (1803)','Los átomos son esferas indivisibles que no se crean ni se destruyen: solo se reordenan. Se combinan en proporciones fijas de números enteros.']]);
  var cv=box.querySelector('#dtC'), cx=cv.getContext('2d'), msg=box.querySelector('.fc-status'), msgS=msg.appendChild(document.createElement('span'));
  var NH=8,NO=4; var C=rfCanvas(cv), FL={x:40,y:80,w:440,h:310}, atoms=[], groups=[], reacted=false, raf=0, last=performance.now(), nW=0;
  function build(){ atoms=[]; groups=[]; reacted=false; nW=0; var i; for(i=0;i<NO;i++) atoms.push(mk('O')); for(i=0;i<NH;i++) atoms.push(mk('H')); note(); }
  function mk(t){ var r=t==='O'?17:11, a=Math.random()*6.283, v=45+Math.random()*30; return {t:t,r:r,x:FL.x+r+Math.random()*(FL.w-2*r),y:FL.y+r+Math.random()*(FL.h-2*r),vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:-1}; }
  bindRg(box,'dtH',function(v){ NH=v; build(); }); bindRg(box,'dtO',function(v){ NO=v; build(); });
  function note(){ msgS.innerHTML=reacted?'<b>Los átomos se reordenaron:</b>&nbsp;cada molécula de agua tiene 1 átomo de O y 2 de H. La masa total antes y después es la misma.':'<b>Antes de reaccionar:</b>&nbsp;átomos de hidrógeno y de oxígeno separados en un recipiente sellado. Pulsa «Reaccionar».'; }
  function react(){ if(reacted) return; reacted=true; var Hs=atoms.filter(function(a){return a.t==='H';}), Os=atoms.filter(function(a){return a.t==='O';}); nW=Math.min(Math.floor(Hs.length/2),Os.length);
    for(var k=0;k<nW;k++){ var o=Os[k], h1=Hs[2*k], h2=Hs[2*k+1]; o.g=k; h1.g=k; h2.g=k; h1.off=[-22,17]; h2.off=[22,17]; o.off=[0,0]; groups.push({x:o.x,y:o.y,vx:o.vx*.5,vy:o.vy*.5}); } note(); }
  box.querySelector('#dtGo').onclick=react; box.querySelector('#dtRs').onclick=build;
  function frame(now){
    raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now; C.begin(cx); var INK=C.INK, MUT=C.MUT;
    groups.forEach(function(g){ g.x+=g.vx*dt; g.y+=g.vy*dt; if(g.x<FL.x+40){ g.x=FL.x+40; g.vx=Math.abs(g.vx); } if(g.x>FL.x+FL.w-40){ g.x=FL.x+FL.w-40; g.vx=-Math.abs(g.vx); } if(g.y<FL.y+30){ g.y=FL.y+30; g.vy=Math.abs(g.vy); } if(g.y>FL.y+FL.h-45){ g.y=FL.y+FL.h-45; g.vy=-Math.abs(g.vy); } });
    atoms.forEach(function(a){ if(a.g>=0){ var g=groups[a.g], k=Math.min(1,dt*2.6); a.x+=(g.x+a.off[0]-a.x)*k; a.y+=(g.y+a.off[1]-a.y)*k; }
      else { a.x+=a.vx*dt; a.y+=a.vy*dt; if(a.x<FL.x+a.r){ a.x=FL.x+a.r; a.vx=Math.abs(a.vx); } if(a.x>FL.x+FL.w-a.r){ a.x=FL.x+FL.w-a.r; a.vx=-Math.abs(a.vx); } if(a.y<FL.y+a.r){ a.y=FL.y+a.r; a.vy=Math.abs(a.vy); } if(a.y>FL.y+FL.h-a.r){ a.y=FL.y+FL.h-a.r; a.vy=-Math.abs(a.vy); } } });
    /* recipiente */
    cx.fillStyle='rgba(116,192,252,.08)'; cx.fillRect(FL.x,FL.y,FL.w,FL.h); cx.strokeStyle=MUT; cx.lineWidth=4; cx.strokeRect(FL.x,FL.y,FL.w,FL.h); cx.fillStyle=MUT; cx.fillRect(FL.x-8,FL.y-14,FL.w+16,12);
    rfTxt(cx,'Recipiente cerrado (nada entra ni sale)',FL.x+FL.w/2,FL.y-24,INK,13,'center');
    atoms.forEach(function(a){ rfBall(cx,a.x,a.y,a.r,a.t==='O'?'#fa5252':'#e9ecef',a.t); });
    /* resultados */
    var mH=NH, mO=NO*16, tot=mH+mO, x0=520;
    rfTxt(cx,'Balanza',x0+130,46,INK,15,'center',700);
    cx.strokeStyle=INK; cx.lineWidth=3; cx.beginPath(); cx.moveTo(x0+130,62); cx.lineTo(x0+130,84); cx.stroke(); cx.beginPath(); cx.moveTo(x0+130,62); cx.lineTo(x0+130,62); cx.stroke();
    cx.beginPath(); cx.moveTo(x0+30,70); cx.lineTo(x0+230,70); cx.stroke(); cx.fillStyle=INK; cx.beginPath(); cx.moveTo(x0+130,62); cx.lineTo(x0+120,84); cx.lineTo(x0+140,84); cx.fill();
    cx.fillStyle=C.PAN; cx.strokeStyle=INK; cx.lineWidth=1.5; [[x0+30],[x0+230]].forEach(function(p){ cx.beginPath(); cx.moveTo(p[0]-24,86); cx.lineTo(p[0]+24,86); cx.lineTo(p[0]+14,98); cx.lineTo(p[0]-14,98); cx.closePath(); cx.fill(); cx.stroke(); cx.beginPath(); cx.moveTo(p[0],70); cx.lineTo(p[0]-24,86); cx.moveTo(p[0],70); cx.lineTo(p[0]+24,86); cx.stroke(); });
    rfTxt(cx,'ANTES',x0+30,118,MUT,12,'center'); rfTxt(cx,'DESPUÉS',x0+230,118,MUT,12,'center');
    rfTxt(cx,tot+' u',x0+30,142,'#1864ab',22,'center',800); rfTxt(cx,reacted?tot+' u':'—',x0+230,142,reacted?'#1864ab':MUT,22,'center',800);
    rfTxt(cx,reacted?'= La masa se conserva':'Pulsa «Reaccionar»',x0+130,172,reacted?'#2f9e44':MUT,14,'center',700);
    cx.fillStyle='rgba(120,120,120,.12)'; cx.fillRect(x0,190,260,200); cx.strokeStyle='rgba(120,120,120,.35)'; cx.lineWidth=1; cx.strokeRect(x0,190,260,200);
    var y=214, L=function(s,v,c){ rfTxt(cx,s,x0+12,y,INK,13); rfTxt(cx,v,x0+248,y,c||'#1864ab',14,'right',800); y+=24; };
    L('Moléculas de agua (H₂O)',reacted?String(nW):'—'); L('Masa de H en el agua',reacted?(2*nW)+' u':'—'); L('Masa de O en el agua',reacted?(16*nW)+' u':'—');
    L('Proporción O : H en masa',reacted&&nW?'8 : 1':'—','#e8590c');
    var hs=reacted?NH-2*nW:'—', os=reacted?NO-nW:'—'; L('Átomos de H sobrantes',String(hs),MUT); L('Átomos de O sobrantes',String(os),MUT);
    rfTxt(cx,'Siempre 8 g de O por 1 g de H',x0+130,y+8,'#e8590c',12,'center',700);
    cx.globalAlpha=1;
  }
  build(); raf=requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(raf); C.stop(); };
}

