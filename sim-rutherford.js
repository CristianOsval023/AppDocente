'use strict';
/* Experimento de Rutherford (lámina de oro y un solo átomo) */
function rutherfordExperimento(box){
  var BINS=[['< 5°',0,5],['5° – 15°',5,15],['15° – 45°',15,45],['45° – 90°',45,90],['> 90°',90,181]];
  box.innerHTML=
   '<div class="fc-wrap"><div class="fc-main"><div class="fc-scene lt-scene rf-scene"><canvas id="rfC" role="img" aria-label="Experimento de la lámina de oro: partículas alfa disparadas contra una lámina delgada rodeada por una pantalla fluorescente"></canvas></div>'+
   '<p class="fc-status" aria-live="polite"></p><div class="fc-graph"><svg id="rfG" viewBox="0 0 800 170" role="img" aria-label="Gráfico de partículas detectadas según su ángulo de desviación"></svg></div></div>'+
   '<aside class="fc-side">'+
    '<div class="fc-box"><h4>Átomo y lámina</h4>'+SL('rfM','Modelo del átomo',[['th','Thomson (hipótesis)'],['ru','Rutherford (núcleo)']],'th')+SL('rfMat','Material de la lámina',rfMats(),'79')+RG('rfL','Grosor de la lámina',1,40,1,12,' capas')+'</div>'+
    '<div class="fc-box"><h4>Partículas α</h4>'+RG('rfE','Energía',3,9,.5,7.5,' MeV')+RG('rfR','Disparos por segundo',2,60,2,14,'')+CK('rfTr','Mostrar trayectorias',true)+'</div>'+
    '<div class="fc-btns"><button class="btn2 fc-go" id="rfGo">⏸ Pausar</button><button class="btn2" id="rfBu">Ráfaga ×100</button><button class="btn2" id="rfRs">Reiniciar conteo</button></div>'+
   '</aside></div>';
  var cv=box.querySelector('#rfC'), cx=cv.getContext('2d'), msg=box.querySelector('.fc-status'), msgS=msg.appendChild(document.createElement('span')), gsv=box.querySelector('#rfG');
  var sel=box.querySelector('#rfM'), mat=box.querySelector('#rfMat'), ckTr=box.querySelector('#rfTr'), bGo=box.querySelector('#rfGo'), bBu=box.querySelector('#rfBu'), bRs=box.querySelector('#rfRs');
  var L=12,E=7.5,R=14; bindRg(box,'rfL',function(v){ L=v; }); bindRg(box,'rfE',function(v){ E=v; }); bindRg(box,'rfR',function(v){ R=v; });
  var C=rfCanvas(cv), FX=400, FY=220, SR=190, SX=100;
  var run=true, acc=0, burst=0, parts=[], flashes=[], counts=[0,0,0,0,0], total=0, last=performance.now(), raf=0, lastMsg=0;
  function eps(){ return .0007*(+mat.value/79)*(7.7/E); }
  function scatter(){ var th=0, e=eps(), i; for(i=0;i<L;i++){ if(sel.value==='th') th+=rfGauss()*.006; else { var b=Math.random()-.5, ab=Math.max(Math.abs(b),1e-7); th+=(b<0?-1:1)*2*Math.atan(e/ab); } }
    th=((th+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI; return th; }
  function spawn(fast){ var y0=FY+(Math.random()-.5)*8, th=scatter(), yf=y0+(Math.random()-.5)*2;
    parts.push({x:SX,y:y0,pts:[[SX,y0],[FX,yf],[FX+SR*Math.cos(th),yf-SR*Math.sin(th)]],seg:0,th:th,v:fast?1100:430,age:0,done:false}); }
  function drawG(){
    gsv.innerHTML=''; var max=Math.max(10,total), ly=Math.log10(1+max), x0=60, bw=100, gap=36, base=134, hh=92;
    var t=SV('text',{x:400,y:16,'text-anchor':'middle','class':'fc-note'},gsv); t.textContent='Partículas detectadas según el ángulo de desviación (escala logarítmica)';
    SV('line',{x1:x0-10,x2:790,y1:base,y2:base,stroke:'var(--line)','stroke-width':2},gsv);
    BINS.forEach(function(b,i){ var n=counts[i], h=hh*Math.log10(1+n)/ly, x=x0+i*(bw+gap);
      SV('rect',{x:x,y:base-h,width:bw,height:Math.max(h,0),rx:4,fill:i===4?'#e03131':(i===0?'#1c7ed6':'#f08c00')},gsv);
      var nt=SV('text',{x:x+bw/2,y:base-h-5,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'var(--ink)'},gsv); nt.textContent=n+(total?'  ('+(100*n/total<.1&&n?'<0,1':fnum(100*n/total,1))+' %)':'');
      var lt=SV('text',{x:x+bw/2,y:base+17,'text-anchor':'middle','font-size':13,fill:'var(--muted)'},gsv); lt.textContent=b[0]+(i===4?' ¡rebotan!':''); });
  }
  function note(){ var m=sel.value==='th'?'<b>Thomson:</b>&nbsp;esperaba que casi todas las partículas α atravesaran la lámina sin desviarse.':'<b>Rutherford:</b>&nbsp;las que pasan lejos de un núcleo casi no se desvían; las que pasan muy cerca se desvían mucho o rebotan.';
    msgS.innerHTML=m+(total?' &nbsp;Detectadas: '+total+' · rebotan (> 90°): '+counts[4]+'.':' &nbsp;Pulsa «Ráfaga ×100» para acumular datos rápido.'); }
  function reset(){ counts=[0,0,0,0,0]; total=0; parts=[]; flashes=[]; drawG(); note(); }
  sel.onchange=reset; mat.onchange=reset; box.querySelector('#rfL').addEventListener('change',reset); box.querySelector('#rfE').addEventListener('change',reset);
  bGo.onclick=function(){ run=!run; bGo.textContent=run?'⏸ Pausar':'▶ Disparar'; };
  bBu.onclick=function(){ burst+=100; }; bRs.onclick=reset;
  function hit(p){ var a=Math.abs(p.th)*180/Math.PI, i=0; while(i<4&&a>=BINS[i][2]) i++; counts[i]++; total++; flashes.push({x:p.pts[2][0],y:p.pts[2][1],t:0,big:i===4}); drawG(); }
  function frame(now){
    raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now;
    if(run){ acc+=R*dt; while(acc>=1){ acc-=1; spawn(false); } }
    if(burst>0){ var k=Math.min(burst,Math.ceil(dt*140)); for(var q=0;q<k;q++) spawn(true); burst-=k; }
    C.begin(cx); var INK=C.INK, MUT=C.MUT, i;
    /* pantalla fluorescente */
    cx.lineWidth=14; cx.strokeStyle='#8ce99a'; cx.globalAlpha=.3; cx.beginPath(); cx.arc(FX,FY,SR,0,6.2832); cx.stroke(); cx.globalAlpha=1;
    rfTxt(cx,'Pantalla de sulfuro de cinc (ZnS): brilla donde llega una partícula α',FX,434,MUT,12,'center');
    /* fuente */
    cx.fillStyle='#495057'; cx.fillRect(24,186,76,68); cx.fillStyle='#212529'; cx.fillRect(96,214,10,12); cx.fillStyle='#ffd43b'; cx.beginPath(); cx.arc(46,220,6,0,6.2832); cx.fill();
    rfTxt(cx,'Fuente de partículas α',62,274,INK,12,'center'); rfTxt(cx,'(bloque de plomo con rendija)',62,289,MUT,11,'center');
    cx.strokeStyle=MUT; cx.globalAlpha=.35; cx.setLineDash([4,5]); cx.lineWidth=1; cx.beginPath(); cx.moveTo(106,220); cx.lineTo(FX,220); cx.stroke(); cx.setLineDash([]); cx.globalAlpha=1;
    /* lámina */
    cx.fillStyle=RF_MAT[mat.value][1]; cx.fillRect(FX-4,FY-90,8,180); cx.strokeStyle='#7f6a00'; cx.lineWidth=1; cx.strokeRect(FX-4,FY-90,8,180);
    rfTxt(cx,'Lámina de '+RF_MAT[mat.value][2]+' ('+L+' capas de átomos)',FX,FY-100,INK,13,'center');
    /* partículas */
    for(i=parts.length-1;i>=0;i--){ var p=parts[i];
      if(!p.done){ var a=p.pts[p.seg], b=p.pts[p.seg+1], dx=b[0]-a[0], dy=b[1]-a[1], d=Math.hypot(dx,dy)||1, st=p.v*dt, rem=d-(p.prog||0);
        if(st>=rem){ p.seg++; p.prog=0; if(p.seg>=2){ p.done=true; p.x=p.pts[2][0]; p.y=p.pts[2][1]; hit(p); } else { p.x=b[0]; p.y=b[1]; } }
        else { p.prog=(p.prog||0)+st; p.x=a[0]+dx*p.prog/d; p.y=a[1]+dy*p.prog/d; } }
      else p.age+=dt;
      if(p.age>1.1){ parts.splice(i,1); continue; }
      if(ckTr.checked){ cx.globalAlpha=Math.max(0,.75-p.age*.7); cx.strokeStyle=(Math.abs(p.th)>Math.PI/2)?'#e03131':'#f08c00'; cx.lineWidth=(Math.abs(p.th)>.26)?2.2:1.2; cx.beginPath(); cx.moveTo(p.pts[0][0],p.pts[0][1]); cx.lineTo(p.pts[1][0],p.pts[1][1]); if(p.seg>=1||p.done) cx.lineTo(p.x,p.y); cx.stroke(); }
      if(!p.done){ cx.globalAlpha=1; cx.fillStyle='#f08c00'; cx.beginPath(); cx.arc(p.x,p.y,3.4,0,6.2832); cx.fill(); } }
    /* destellos */
    for(i=flashes.length-1;i>=0;i--){ var f=flashes[i]; f.t+=dt; if(f.t>1.4){ flashes.splice(i,1); continue; } var al=1-f.t/1.4; var g=cx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.big?20:12); g.addColorStop(0,f.big?'rgba(255,107,107,'+al+')':'rgba(178,242,187,'+al+')'); g.addColorStop(1,'rgba(178,242,187,0)'); cx.globalAlpha=1; cx.fillStyle=g; cx.beginPath(); cx.arc(f.x,f.y,f.big?20:12,0,6.2832); cx.fill(); }
    cx.globalAlpha=1; if(now-lastMsg>400){ lastMsg=now; note(); }
  }
  reset(); raf=requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(raf); C.stop(); };
}

function rutherfordAtomo(box){
  box.innerHTML=
   '<div class="fc-wrap"><div class="fc-main"><div class="fc-scene lt-scene rf-scene"><canvas id="raC" role="img" aria-label="Trayectorias de partículas alfa que pasan cerca de un átomo, según el modelo de Thomson o el de Rutherford"></canvas></div>'+
   '<p class="fc-status" aria-live="polite"></p>'+
   '<div class="fc-graph lt-panel"><div class="lt-fic"><div><h5>Si el átomo fuera como Thomson</h5>La carga positiva está repartida y es poco intensa: todas las partículas α pasan casi derecho, con desviaciones muy pequeñas.</div><div><h5>Si el átomo tiene núcleo</h5>Toda la carga positiva está concentrada en un punto: cerca del núcleo la repulsión es enorme y la partícula α se desvía mucho o rebota.</div><div><h5>Qué se observó</h5>Unas pocas partículas α rebotaron (Geiger y Marsden, 1909): el átomo tiene un núcleo pequeño, denso y positivo.</div></div></div></div>'+
   '<aside class="fc-side">'+
    '<div class="fc-box"><h4>Átomo</h4>'+SL('raM','Modelo del átomo',[['th','Thomson (hipótesis)'],['ru','Rutherford (núcleo)']],'ru')+SL('raMat','Material',rfMats(),'79')+RG('raE','Energía de la partícula α',3,9,.5,7.5,' MeV')+'</div>'+
    '<div class="fc-box"><h4>Una partícula en particular</h4>'+RG('raB','Distancia al núcleo (parámetro de impacto)',-120,120,1,18,'')+CK('raAll','Mostrar todo el haz',true)+'</div>'+
    '<div class="fc-btns"><button class="btn2 fc-go" id="raGo">↻ Disparar de nuevo</button></div>'+
   '</aside></div>';
  var cv=box.querySelector('#raC'), cx=cv.getContext('2d'), msg=box.querySelector('.fc-status'), msgS=msg.appendChild(document.createElement('span'));
  var sel=box.querySelector('#raM'), mat=box.querySelector('#raMat'), ckAll=box.querySelector('#raAll'), E=7.5, B=18;
  bindRg(box,'raE',function(v){ E=v; build(); }); bindRg(box,'raB',function(v){ B=v; build(); });
  var C=rfCanvas(cv), CX=400, CY=220, RAD=140, paths=[], hi=null, t0=0, raf=0, last=performance.now(), el=[];
  var BL=[-120,-85,-58,-40,-27,-18,-11,-6,-2.5,-1,1,2.5,6,11,18,27,40,58,85,120];
  function trace(b){
    var K=2.5*(+mat.value/79)*(7.7/E), th=sel.value==='th', x=-360, y=b, vx=1, vy=0, pts=[[x,y]], len=[0], n=0, L=0;
    while(n++<20000){ var r2=x*x+y*y, r=Math.sqrt(r2)+1e-9, a=0, dt;
      if(th){ a=r<RAD?K*r/(RAD*RAD*RAD):0; dt=3; } else { var rr=Math.max(r,.3); a=K/(rr*rr); dt=Math.min(3,.03*rr); }
      vx+=a*x/r*dt; vy+=a*y/r*dt; var nx=x+vx*dt, ny=y+vy*dt; L+=Math.hypot(nx-x,ny-y); x=nx; y=ny; if(n%2===0||dt<3){ pts.push([x,y]); len.push(L); }
      if(x>380||Math.abs(y)>216||x<-380) break; }
    pts.push([x,y]); len.push(L); return {pts:pts,len:len,L:L,ang:Math.atan2(vy,vx)*180/Math.PI,b:b};
  }
  function build(){ if(!BL) return; paths=BL.map(trace); hi=trace(B); t0=0; el=[]; for(var i=0;i<14;i++) el.push({r:30+Math.random()*100,ph:Math.random()*6.28,w:(Math.random()<.5?-1:1)*(.6+Math.random()),u:Math.random()}); note(); }
  function note(){ if(!hi) return; var a=Math.abs(hi.ang); msgS.innerHTML='<b>Partícula marcada (naranja):</b>&nbsp;pasa a '+Math.abs(B)+' unidades del centro y se desvía <b>'+fnum(a,a<10?1:0)+'°</b>'+(a>90?' — ¡rebota hacia atrás!':a<1?' — prácticamente no se desvía.':'.')+' &nbsp;Más cerca del núcleo, mayor desviación.'; }
  sel.onchange=build; mat.onchange=build; box.querySelector('#raGo').onclick=function(){ t0=0; };
  function path(p,col,lw,s){ var i=1; cx.strokeStyle=col; cx.lineWidth=lw; cx.beginPath(); cx.moveTo(CX+p.pts[0][0],CY-p.pts[0][1]); while(i<p.pts.length&&p.len[i]<=s){ cx.lineTo(CX+p.pts[i][0],CY-p.pts[i][1]); i++; } cx.stroke();
    if(s<p.L){ var q=p.pts[Math.min(i,p.pts.length-1)]; cx.fillStyle=col; cx.beginPath(); cx.arc(CX+q[0],CY-q[1],lw+2.5,0,6.2832); cx.fill(); } }
  function frame(now){
    raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now; t0+=dt; var s=t0*320;
    C.begin(cx); var th=sel.value==='th', i;
    if(th){ var g=cx.createRadialGradient(CX,CY,0,CX,CY,RAD); g.addColorStop(0,'rgba(250,82,82,.30)'); g.addColorStop(1,'rgba(250,82,82,.12)'); cx.fillStyle=g; cx.beginPath(); cx.arc(CX,CY,RAD,0,6.2832); cx.fill(); cx.strokeStyle='#fa5252'; cx.lineWidth=1.5; cx.stroke();
      cx.font='700 15px system-ui'; cx.fillStyle='#e03131'; for(i=0;i<22;i++){ var a=i*2.4, r=RAD*.9*Math.sqrt((i+.5)/22); cx.globalAlpha=.55; cx.fillText('+',CX+Math.cos(a)*r-4,CY+Math.sin(a)*r+5); } cx.globalAlpha=1;
      rfTxt(cx,'Esfera de carga positiva (+) con electrones (−) incrustados',CX,CY-RAD-10,C.MUT,12,'center');
    } else { cx.strokeStyle=C.MUT; cx.globalAlpha=.5; cx.setLineDash([5,6]); cx.lineWidth=1.2; cx.beginPath(); cx.arc(CX,CY,RAD,0,6.2832); cx.stroke(); cx.setLineDash([]); cx.globalAlpha=1;
      rfTxt(cx,'Átomo: casi todo espacio vacío (tamaño del núcleo fuera de escala)',CX,CY-RAD-10,C.MUT,12,'center'); }
    el.forEach(function(e){ e.ph+=e.w*dt*.7; var r=th?e.r*.85:e.r+20, x=CX+Math.cos(e.ph)*r, y=CY+Math.sin(e.ph)*r*(th?1:.6); if(th){ x=CX+Math.cos(e.ph)*e.r*.4*(1+e.u); y=CY+Math.sin(e.ph*1.3)*e.r*.4*(1+e.u); }
      cx.fillStyle='#339af0'; cx.beginPath(); cx.arc(x,y,3,0,6.2832); cx.fill(); });
    if(!th){ cx.fillStyle='#e03131'; cx.beginPath(); cx.arc(CX,CY,4.5,0,6.2832); cx.fill(); rfTxt(cx,'Núcleo (+)',CX+9,CY+22,'#e03131',12); }
    if(ckAll.checked) paths.forEach(function(p){ cx.globalAlpha=.55; path(p,'#868e96',1.4,s); }); cx.globalAlpha=1;
    path(hi,'#f76707',3,s);
    rfTxt(cx,'Haz de partículas α →',18,24,C.INK,13); rfTxt(cx,'Cada trayectoria es una partícula α',18,42,C.MUT,12);
    cx.fillStyle='#f76707'; cx.beginPath(); cx.arc(CX-360,CY-B,5,0,6.2832); cx.fill();
  }
  build(); raf=requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(raf); C.stop(); };
}

