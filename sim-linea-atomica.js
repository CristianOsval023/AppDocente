'use strict';
/* Simulador 3D: línea de tiempo de los modelos atómicos */
/* ====== SIMULADOR 3D: Línea de tiempo de los modelos atómicos ====== */
function lineaTiempoAtomica(box,opts){
  opts=opts||{};
  var MODELS=[
   {id:'dalton',y:'1803',who:'Dalton',nm:'Modelo de Dalton',
    st:'<b>Dalton (1803):</b>&nbsp;el átomo es una esfera maciza, indivisible y sin partes internas. Gira el modelo con el mouse.',
    prop:'Toda la materia está formada por átomos: esferas macizas e indivisibles. Los átomos de un elemento son iguales entre sí y distintos de los de otro elemento.',
    evi:'Explicó la conservación de la masa y la combinación de los elementos en proporciones fijas para formar compuestos.',
    lim:'No explica la electricidad ni que el átomo tenga partes: no hay protones, neutrones ni electrones.'},
   {id:'thomson',y:'1904',who:'Thomson',nm:'Modelo de Thomson',
    st:'<b>Thomson (1904):</b>&nbsp;esfera de carga positiva con electrones (−) incrustados, como un «budín de pasas». El átomo es neutro.',
    prop:'El átomo es una esfera con carga positiva repartida, y en su interior están los electrones, de carga negativa, que equilibran la carga total.',
    evi:'Con tubos de rayos catódicos (1897) descubrió el electrón: el átomo sí tiene partes y se puede dividir.',
    lim:'No explica por qué algunas partículas alfa rebotan al chocar con una lámina de oro (experimento de Rutherford).'},
   {id:'rutherford',y:'1911',who:'Rutherford',nm:'Modelo de Rutherford',
    st:'<b>Rutherford (1911):</b>&nbsp;núcleo diminuto, denso y positivo; los electrones giran a su alrededor en un espacio casi vacío (núcleo fuera de escala).',
    prop:'Toda la carga positiva y casi toda la masa están en un núcleo muy pequeño. Los electrones giran a su alrededor y el átomo es casi todo espacio vacío.',
    evi:'Experimento de la lámina de oro: la mayoría de las partículas alfa pasaba derecho y unas pocas rebotaban.',
    lim:'Un electrón que gira perdería energía y caería al núcleo. Tampoco explica los espectros de luz de los átomos.'},
   {id:'bohr',y:'1913',who:'Bohr',nm:'Modelo de Bohr',
    st:'<b>Bohr (1913):</b>&nbsp;los electrones están en niveles de energía definidos (n = 1, 2, 3…). Pulsa «Excitar electrón» para ver un salto de nivel.',
    prop:'Los electrones giran en órbitas con energía fija. Saltan a un nivel mayor al absorber un fotón y vuelven a uno menor emitiendo un fotón.',
    evi:'Explicó el espectro de emisión del hidrógeno: cada línea de color corresponde a un salto entre niveles.',
    lim:'Funciona bien para el hidrógeno, pero no para átomos con muchos electrones.'},
   {id:'quantum',y:'1926',who:'Schrödinger',nm:'Modelo mecano-cuántico',
    st:'<b>Modelo mecano-cuántico (1926):</b>&nbsp;no hay trayectorias; el electrón se describe como una nube de probabilidad (orbital). Cada punto es una posible ubicación. Elige un orbital (1s, 2s, 2p…) para ver su forma.',
    prop:'No se puede conocer a la vez la posición y la velocidad del electrón. Solo se calcula la probabilidad de encontrarlo en una región: el orbital.',
    evi:'Se apoya en las ondas de materia (De Broglie) y en el principio de incertidumbre (Heisenberg). Los neutrones se descubren en 1932.',
    lim:'Es el modelo vigente, pero su matemática es compleja: por eso se enseñan antes los modelos anteriores.'}];
  if(opts.only) MODELS=MODELS.filter(function(m){ return opts.only.indexOf(m.id)>=0; });
  var ELS={H:{n:'Hidrógeno',s:'H',Z:1,N:0,col:'#dee2e6',sh:[1]},He:{n:'Helio',s:'He',Z:2,N:2,col:'#ffc078',sh:[2]},Li:{n:'Litio',s:'Li',Z:3,N:4,col:'#da77f2',sh:[2,1]},C:{n:'Carbono',s:'C',Z:6,N:6,col:'#868e96',sh:[2,4]},Ne:{n:'Neón',s:'Ne',Z:10,N:10,col:'#ff8787',sh:[2,8]}};
  box.innerHTML=
   '<div class="fc-wrap"><div class="fc-main">'+
    '<div class="fc-scene lt-scene"><canvas id="ltC" role="img" aria-label="Modelo atómico en 3D que se puede girar con el mouse"></canvas></div>'+
    '<p class="fc-status" aria-live="polite"></p>'+
    '<div class="fc-graph lt-panel"><div class="lt-track" id="ltT"></div><div class="lt-fic" id="ltF"></div></div>'+
   '</div><aside class="fc-side">'+
    '<div class="fc-box"><h4>Átomo</h4>'+SL('ltEl','Elemento',[['H','Hidrógeno (Z = 1)'],['He','Helio (Z = 2)'],['Li','Litio (Z = 3)'],['C','Carbono (Z = 6)'],['Ne','Neón (Z = 10)']],opts.el||'He')+SL('ltOrb','Orbitales (modelo mecano-cuántico)',[['all','Átomo completo'],['1s','Orbital 1s'],['2s','Orbital 2s'],['2pz','Orbital 2pz'],['2px','Orbital 2px'],['2py','Orbital 2py'],['2p','Los tres orbitales 2p'],['3dz2','Orbital 3dz²'],['3dxy','Orbital 3dxy']],'all')+CK('ltNe','Mostrar neutrones (1932)',!!opts.neutrons)+CK('ltLb','Mostrar rótulos',true)+'</div>'+
    '<div class="fc-box"><h4>Vista 3D</h4>'+CK('ltRot','Giro automático',true)+RG('ltZ','Zoom',.6,1.8,.1,1,'×')+RG('ltS','Velocidad de los electrones',0,3,.5,1,'×')+'</div>'+
    '<div class="fc-btns"><button class="btn2 fc-go" id="ltPlay">▶ Recorrer la línea de tiempo</button><button class="btn2" id="ltEx" disabled>⚡ Excitar electrón</button><button class="btn2" id="ltRst">Restablecer vista</button></div>'+
   '</aside></div>';
  if(opts.compact){ box.classList.add('lt-compact'); }
  var cv=box.querySelector('#ltC'), cx=cv.getContext('2d'), msg=box.querySelector('.fc-status'), msgS=msg.appendChild(document.createElement('span')), trk=box.querySelector('#ltT'), fic=box.querySelector('#ltF');
  var bPlay=box.querySelector('#ltPlay'), bEx=box.querySelector('#ltEx'), bRst=box.querySelector('#ltRst');
  var selOrb=box.querySelector('#ltOrb'), selEl=box.querySelector('#ltEl'), ckNe=box.querySelector('#ltNe'), ckLb=box.querySelector('#ltLb'), ckRot=box.querySelector('#ltRot');
  var W=1,H=1,dpr=1,S=80,F=14,zoom=1,spd=1;
  var zi=bindRg(box,'ltZ',function(v){ zoom=v; }); bindRg(box,'ltS',function(v){ spd=v; });
  var mi=0, el=ELS[opts.el||'He'], yaw=.6, pitch=.35, fade=0, t=0, idle=0, playing=false, playT=0, autoEx=false;
  var INK='#222', MUT='#666', PAN='#fff', fr=0;
  var cYa=1,sYa=0,cPa=1,sPa=0, PX=0,PY=0,PK=1,PZ=0;
  function rnd(a,b){ return a+Math.random()*(b-a); }
  function unit(){ var u=rnd(-1,1), a=rnd(0,6.2832), s=Math.sqrt(1-u*u); return [s*Math.cos(a),u,s*Math.sin(a)]; }
  function cross(a,b){ return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]; }
  function norm(a){ var l=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2])||1; return [a[0]/l,a[1]/l,a[2]/l]; }
  function basis(n){ n=norm(n); var h=Math.abs(n[2])<.9?[0,0,1]:[1,0,0], u=norm(cross(n,h)), v=cross(n,u); return [u,v]; }
  function P(x,y,z){ var x1=x*cYa+z*sYa, z1=-x*sYa+z*cYa, y1=y*cPa-z1*sPa, z2=y*sPa+z1*cPa; PK=F/(F+z2); PX=W/2+x1*S*PK; PY=H/2-y1*S*PK; PZ=z2; }
  function shade(h,f){ var c=hx(h); return 'rgb('+c.map(function(v){ return Math.round(f>0?v+(255-v)*f:v*(1+f)); }).join(',')+')'; }
  var SPR={};
  function spr(col){ if(SPR[col]) return SPR[col]; var c=document.createElement('canvas'); c.width=c.height=96; var g=c.getContext('2d'), gr=g.createRadialGradient(36,32,4,48,48,46);
    gr.addColorStop(0,shade(col,.7)); gr.addColorStop(.45,col); gr.addColorStop(1,shade(col,-.45)); g.fillStyle=gr; g.beginPath(); g.arc(48,48,46,0,6.2832); g.fill(); return (SPR[col]=c); }
  /* ---- construcción de las partes del átomo ---- */
  var nuc=[], eOrb=[], eTh=[], posTh=[], eBo=[], rings=[], cloud=[[],[]], RB=[1,2,3];
  var RT=2.3, ER=.16, PR=.2;
  function nucleus(){
    var Z=el.Z, N=ckNe.checked?el.N:0, A=Z+N, Rn=A===1?0:PR*1.15*Math.cbrt(A)+.05, ga=Math.PI*(3-Math.sqrt(5)); nuc=[];
    for(var k=0;k<A;k++){ var yy=A===1?0:1-2*(k+.5)/A, rr=Math.sqrt(Math.max(0,1-yy*yy)), th=ga*k, d=A===1?0:Rn*Math.cbrt((k+.5)/A);
      nuc.push({x:Math.cos(th)*rr*d,y:yy*d,z:Math.sin(th)*rr*d,p:Math.floor((k+1)*Z/A)>Math.floor(k*Z/A)}); }
  }
  function relax(){ var Z=el.Z; posTh=[]; for(var i=0;i<Z;i++){ var u=unit(), r=Z===1?0:1.4*Math.cbrt(Math.random()); posTh.push([u[0]*r,u[1]*r,u[2]*r]); }
    for(var it=0;it<80&&Z>1;it++){ for(var a=0;a<Z;a++){ var f=[0,0,0]; for(var b=0;b<Z;b++){ if(a===b) continue; var d=[posTh[a][0]-posTh[b][0],posTh[a][1]-posTh[b][1],posTh[a][2]-posTh[b][2]], l=Math.sqrt(d[0]*d[0]+d[1]*d[1]+d[2]*d[2])+.01; for(var q=0;q<3;q++) f[q]+=d[q]/(l*l*l); }
      for(var q=0;q<3;q++) posTh[a][q]+=f[q]*.03; var m=Math.sqrt(posTh[a][0]*posTh[a][0]+posTh[a][1]*posTh[a][1]+posTh[a][2]*posTh[a][2]); if(m>1.5) for(var q=0;q<3;q++) posTh[a][q]*=1.5/m; } }
    eTh=posTh.map(function(p){ return {ph:[rnd(0,6.28),rnd(0,6.28),rnd(0,6.28)],w:[rnd(1.6,2.6),rnd(1.6,2.6),rnd(1.6,2.6)]}; }); }
  function build(){
    var Z=el.Z, i; nucleus(); relax();
    eOrb=[]; for(i=0;i<Z;i++){ var bs=basis(unit()); eOrb.push({r:1+.22*i+rnd(-.04,.04),u:bs[0],v:bs[1],ph:rnd(0,6.28),dir:Math.random()<.5?1:-1}); }
    var NRM=[[.3,1,.2],[-.4,1,.3],[.2,1,-.5]]; rings=NRM.map(function(n){ return basis(n); });
    eBo=[]; el.sh.forEach(function(c,k){ for(var j=0;j<c;j++) eBo.push({k:k,ph:6.2832*j/c+k*.7,r:RB[k],ex:0}); });
    cloud=[[],[]]; el.sh.forEach(function(c,k){ var n=Math.min(1400,c*(k?200:420)); for(var j=0;j<n;j++) cloud[k].push(samp(k)); });
  }
  function samp(k){ var u=unit(), r=0, kk=k?5:3, th=k?.45:.3/(1+.12*(el.Z-1)); for(var i=0;i<kk;i++) r-=Math.log(1-Math.random()); r=Math.min(4,r*th); return [u[0]*r,u[1]*r,u[2]*r]; }
  /* ---- Bohr: excitación ---- */

  /* ---- orbitales (nube de probabilidad de cada orbital) ---- */
  var OS=.22, orbSets=[], ORBI={'1s':'<b>Orbital 1s:</b>&nbsp;forma esférica; es el más cercano al núcleo y admite como máximo 2 electrones.','2s':'<b>Orbital 2s:</b>&nbsp;esférico y más grande que el 1s; tiene una capa intermedia casi sin electrones (cambio de color).','2pz':'<b>Orbital 2pz:</b>&nbsp;dos lóbulos a lo largo del eje z, como unas pesas. Hay tres orbitales 2p (px, py y pz), perpendiculares entre sí.','2px':'<b>Orbital 2px:</b>&nbsp;dos lóbulos a lo largo del eje x. Es igual al 2pz, pero orientado en otra dirección.','2py':'<b>Orbital 2py:</b>&nbsp;dos lóbulos a lo largo del eje y. Es igual al 2pz, pero orientado en otra dirección.','2p':'<b>Los tres orbitales 2p:</b>&nbsp;px (rojo), py (verde) y pz (azul) apuntan en direcciones perpendiculares. Cada uno admite 2 electrones.','3dz2':'<b>Orbital 3dz²:</b>&nbsp;dos lóbulos y un anillo central. Los orbitales d aparecen desde el tercer nivel de energía.','3dxy':'<b>Orbital 3dxy:</b>&nbsp;cuatro lóbulos entre los ejes x e y. Los orbitales d aparecen desde el tercer nivel de energía.'};
  function gam(k,th){ var r=0; for(var i=0;i<k;i++) r-=Math.log(1-Math.random()); return r*th; }
  function rejDir(f,mx){ for(var t=0;t<300;t++){ var u=unit(); if(Math.random()*mx<=f(u)) return u; } return unit(); }
  function sampOrb(kind){ var r,u,sg=1,AX={px:0,py:2,pz:1};
    if(kind==='1s'){ r=gam(3,.5); u=unit(); }
    else if(kind==='2s'){ for(var t=0;t<400;t++){ r=Math.random()*24; var f=r*r*Math.pow(1-r/2,2)*Math.exp(-r); if(Math.random()*.4<=f) break; } u=unit(); sg=(1-r/2)>=0?1:-1; }
    else if(kind==='3dz2'){ r=gam(7,1.5); u=rejDir(function(v){ var q=3*v[1]*v[1]-1; return q*q; },4); sg=(3*u[1]*u[1]-1)>=0?1:-1; }
    else if(kind==='3dxy'){ r=gam(7,1.5); u=rejDir(function(v){ var q=v[0]*v[2]; return q*q; },.25); sg=(u[0]*u[2])>=0?1:-1; }
    else { var ax=AX[kind.slice(1)]; r=gam(5,1); u=rejDir(function(v){ return v[ax]*v[ax]; },1); sg=u[ax]>=0?1:-1; }
    var s=(kind[0]==='3'?.15:OS)*r; return [u[0]*s,u[1]*s,u[2]*s,sg]; }
  function buildOrb(){ orbSets=[]; var v=selOrb.value; if(v==='all') return;
    var kinds=v==='2p'?['2px','2py','2pz']:[v], cols={'2px':['#f03e3e','#f03e3e'],'2py':['#37b24d','#37b24d'],'2pz':['#1c7ed6','#1c7ed6']}, n=v==='2p'?800:2400;
    kinds.forEach(function(k){ var pts=[]; for(var i=0;i<n;i++) pts.push(sampOrb(k)); orbSets.push({k:k,pts:pts,c:cols[k]||['#4c6ef5','#ff922b']}); }); }
  function orbMsg(){ if(MODELS[mi].id==='quantum'&&selOrb.value!=='all') msgS.innerHTML=ORBI[selOrb.value]; else msgS.innerHTML=MODELS[mi].st; }
  var ex=null, photons=[];
  function excite(){ if(MODELS[mi].id!=='bohr'||ex) return; var k=el.sh.length-1, e=null; eBo.forEach(function(q){ if(!e&&q.k===k) e=q; }); if(!e) return; ex={t:0,e:e,k:k,dir:unit(),emit:false}; }
  function sm(x){ x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); }
  function omega(r){ return 1.7/Math.pow(r,1.5); }
  /* ---- línea de tiempo (interfaz) ---- */
  MODELS.forEach(function(m,i){ var b=document.createElement('button'); b.className='lt-n'; b.innerHTML='<b>'+m.y+'</b><span>'+m.who+'</span>'; b.onclick=function(){ playing=false; syncPlay(); sel(i); }; trk.appendChild(b); m.btn=b; if(i<MODELS.length-1){ var a=document.createElement('i'); a.className='lt-ar'; a.textContent='›'; trk.appendChild(a); } });
  function syncPlay(){ bPlay.textContent=playing?'⏸ Detener recorrido':'▶ Recorrer la línea de tiempo'; }
  function sel(i){ mi=i; fade=0; ex=null; photons=[]; autoEx=false; playT=0; var m=MODELS[i];
    MODELS.forEach(function(q,j){ q.btn.classList.toggle('on',j===i); });
    ckNe.checked=!!opts.neutrons||(m.id==='quantum'); nucleus();
    fic.innerHTML='<div><h5>Qué propone</h5>'+m.prop+'</div><div><h5>Evidencia o aporte</h5>'+m.evi+'</div><div><h5>Limitación</h5>'+m.lim+'</div>';
    msgS.innerHTML=m.st; bEx.disabled=(m.id!=='bohr'); selOrb.disabled=(m.id!=='quantum'); orbMsg(); }
  selOrb.onchange=function(){ buildOrb(); orbMsg(); };
  selEl.onchange=function(){ el=ELS[selEl.value]; ex=null; photons=[]; build(); };
  ckNe.onchange=nucleus;
  bPlay.onclick=function(){ playing=!playing; syncPlay(); playT=0; if(playing&&mi===MODELS.length-1) sel(0); };
  bEx.onclick=excite;
  bRst.onclick=function(){ yaw=.6; pitch=.35; zi.value=1; zi.dispatchEvent(new Event('input')); };
  /* ---- interacción 3D ---- */
  var drag=null; if(opts.compact) cv.style.pointerEvents='none';
  cv.addEventListener('pointerdown',function(e){ drag={x:e.clientX,y:e.clientY}; idle=0; try{ cv.setPointerCapture(e.pointerId); }catch(_){} cv.style.cursor='grabbing'; });
  cv.addEventListener('pointermove',function(e){ if(!drag) return; yaw+=(e.clientX-drag.x)*.01; pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-drag.y)*.01)); drag={x:e.clientX,y:e.clientY}; idle=0; });
  function up(){ drag=null; cv.style.cursor='grab'; }
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',function(e){ e.preventDefault(); var v=Math.max(.6,Math.min(1.8,zoom*(e.deltaY<0?1.08:.925))); zi.value=v.toFixed(2); zi.dispatchEvent(new Event('input')); },{passive:false});
  /* ---- dibujo ---- */
  function size(){ var r=cv.parentNode.getBoundingClientRect(); dpr=window.devicePixelRatio||1; W=Math.max(10,r.width); H=Math.max(10,r.height); cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); }
  var ro=window.ResizeObserver?new ResizeObserver(size):null; if(ro) ro.observe(cv.parentNode); else window.addEventListener('resize',size); size();
  var items=[];
  function ball(x,y,z,r,col,a,sg){ P(x,y,z); items.push({z:PZ,X:PX,Y:PY,R:r*S*PK,c:col,a:a,s:sg}); }
  function ring(u,v,r,col,al,lw){ cx.strokeStyle=col; cx.globalAlpha=al*fade; cx.lineWidth=lw||1.2; cx.beginPath(); for(var i=0;i<=72;i++){ var a=i/72*6.2832, c=Math.cos(a)*r, s=Math.sin(a)*r; P(c*u[0]+s*v[0],c*u[1]+s*v[1],c*u[2]+s*v[2]); if(i) cx.lineTo(PX,PY); else cx.moveTo(PX,PY); } cx.stroke(); }
  var KF=1;
  function lab(txt,x,y,z,dx,dy){ if(!ckLb.checked) return; P(x,y,z); var X=PX,Y=PY; cx.globalAlpha=fade; cx.font='600 '+(13*KF)+'px system-ui,Arial'; var w=cx.measureText(txt).width+12*KF, bx=X+dx*KF, by=Y+dy*KF;
    if(bx+w>W-6) bx=W-6-w; if(bx<6) bx=6; if(by<18*KF) by=18*KF; if(by>H-8) by=H-8;
    cx.strokeStyle=MUT; cx.lineWidth=1; cx.beginPath(); cx.moveTo(X,Y); cx.lineTo(bx+(dx<0?w:0),by-6); cx.stroke();
    cx.fillStyle=PAN; cx.globalAlpha=.88*fade; cx.fillRect(bx,by-17*KF,w,22*KF); cx.globalAlpha=fade; cx.fillStyle=INK; cx.fillText(txt,bx+6*KF,by-1); }
  function frame(now){
    raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now; t+=dt; fade=Math.min(1,fade+dt*2.2); idle+=dt;
    if(fr++%45===0){ var cs=getComputedStyle(cv); INK=cs.getPropertyValue('--ink').trim()||INK; MUT=cs.getPropertyValue('--muted').trim()||MUT; PAN=cs.getPropertyValue('--panel').trim()||PAN; }
    if(ckRot.checked&&idle>2.5&&!drag) yaw+=.28*dt;
    if(playing){ playT+=dt; if(MODELS[mi].id==='bohr'&&playT>2&&!autoEx){ autoEx=true; excite(); } if(playT>(MODELS[mi].id==='bohr'?9:6.5)){ var nx=(mi+1)%MODELS.length; if(nx===0){ playing=false; syncPlay(); } else sel(nx); playT=0; } }
    cYa=Math.cos(yaw); sYa=Math.sin(yaw); cPa=Math.cos(pitch); sPa=Math.sin(pitch); S=Math.min(W,H)/(2*3.05)*zoom; KF=opts.compact?Math.max(1,W/400):1;
    cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,W,H); items.length=0; cx.globalAlpha=1;
    var id=MODELS[mi].id, Z=el.Z, i, k;
    if(id==='dalton'){ var rD=.9+.35*Math.cbrt(Z); ball(0,0,0,rD,el.col,1); }
    else if(id==='thomson'){
      ball(0,0,0,RT,'#ff6b6b',.3);
      for(i=0;i<20;i++){ var yy=1-2*(i+.5)/20, rr=Math.sqrt(1-yy*yy), th=i*2.39996, d=1.9*Math.cbrt(((i*7)%20+.5)/20); ball(Math.cos(th)*rr*d,yy*d,Math.sin(th)*rr*d,.09,'#fa5252',.7,'+'); }
      for(i=0;i<Z;i++){ var b=posTh[i], q=eTh[i], A=.14*(.3+.7*Math.min(1,spd/1.5)); ball(b[0]+A*Math.sin(t*q.w[0]*spd+q.ph[0]),b[1]+A*Math.sin(t*q.w[1]*spd+q.ph[1]),b[2]+A*Math.sin(t*q.w[2]*spd+q.ph[2]),ER,'#339af0',1,'−'); }
    } else if(id==='rutherford'){
      for(i=0;i<Z;i++){ var o=eOrb[i]; ring(o.u,o.v,o.r,MUT,.35,1); o.ph+=o.dir*omega(o.r)*dt*spd; var c=Math.cos(o.ph)*o.r, s=Math.sin(o.ph)*o.r; ball(c*o.u[0]+s*o.v[0],c*o.u[1]+s*o.v[1],c*o.u[2]+s*o.v[2],ER,'#339af0',1,'−'); }
    } else if(id==='bohr'){
      for(k=0;k<3;k++){ ring(rings[k][0],rings[k][1],RB[k],MUT,k<el.sh.length?.7:.25,k<el.sh.length?1.6:1); }
      if(ex){ ex.t+=dt; }
      eBo.forEach(function(e){ var r=e.r, ec='#339af0', isx=ex&&ex.e===e, bs=rings[e.k];
        if(isx){ var tt=ex.t; r=RB[ex.k]+(RB[ex.k+1]-RB[ex.k])*(sm((tt-.7)/.6)-sm((tt-3.5)/.6)); if(tt>.7&&tt<4.1) ec='#ff922b'; e.r=r; }
        if(!(isx&&ex.t<.7)||true) e.ph+=omega(r)*dt*spd;
        var c=Math.cos(e.ph)*r, s=Math.sin(e.ph)*r; ball(c*bs[0][0]+s*bs[1][0],c*bs[0][1]+s*bs[1][1],c*bs[0][2]+s*bs[1][2],ER,ec,1,'−'); e.pos=[c*bs[0][0]+s*bs[1][0],c*bs[0][1]+s*bs[1][1],c*bs[0][2]+s*bs[1][2]]; });
      if(ex){ var tt2=ex.t, ep=ex.e.pos;
        if(tt2<.7){ var f=1-tt2/.7; ball(ep[0]+ex.dir[0]*5*f,ep[1]+ex.dir[1]*5*f,ep[2]+ex.dir[2]*5*f,.15,'#ffd43b',1); msgS.innerHTML='<b>Absorbe un fotón</b>&nbsp;con la energía justa…'; }
        else if(tt2<3.5) msgS.innerHTML='<b>Estado excitado:</b>&nbsp;el electrón saltó al nivel n = '+(ex.k+2)+' al absorber un fotón.';
        else if(tt2<4.1) msgS.innerHTML='<b>Vuelve al nivel n = '+(ex.k+1)+'</b>&nbsp;y libera la energía…';
        if(tt2>=4.1&&!ex.emit){ ex.emit=true; var d=ex.dir; photons.push({p:[ep[0],ep[1],ep[2]],v:[d[0]*3.2,d[1]*3.2,d[2]*3.2],l:1.6}); }
        if(tt2>=4.1) msgS.innerHTML='<b>Emite un fotón</b>&nbsp;de luz: así se originan los espectros de emisión.';
        if(tt2>6){ ex=null; msgS.innerHTML=MODELS[mi].st; } }
      for(i=photons.length-1;i>=0;i--){ var ph=photons[i]; ph.l-=dt; if(ph.l<=0){ photons.splice(i,1); continue; } for(var q=0;q<3;q++) ph.p[q]+=ph.v[q]*dt; for(var tr=0;tr<4;tr++) ball(ph.p[0]-ph.v[0]*.05*tr,ph.p[1]-ph.v[1]*.05*tr,ph.p[2]-ph.v[2]*.05*tr,.14-.025*tr,'#ffd43b',Math.min(1,ph.l)*(1-tr*.22)); }
    } else {
      cx.globalAlpha=.55*fade; var sz=Math.max(2,S*.04);
      if(orbSets.length){
        cx.strokeStyle=MUT; cx.lineWidth=1; [[3.4,0,0,'x'],[0,0,3.4,'y'],[0,3.4,0,'z']].forEach(function(a){ P(0,0,0); var X0=PX,Y0=PY; P(a[0],a[1],a[2]); cx.globalAlpha=.35*fade; cx.beginPath(); cx.moveTo(X0,Y0); cx.lineTo(PX,PY); cx.stroke(); cx.globalAlpha=.85*fade; cx.fillStyle=MUT; cx.font=(12*KF)+'px system-ui'; cx.fillText(a[3],PX+4,PY-4); });
        cx.globalAlpha=.6*fade; orbSets.forEach(function(os){ for(i=0;i<os.pts.length;i++){ var q=os.pts[i]; if(Math.random()<.012) q=os.pts[i]=sampOrb(os.k); P(q[0],q[1],q[2]); cx.fillStyle=os.c[q[3]>0?0:1]; cx.fillRect(PX-sz/2,PY-sz/2,sz,sz); } });
      } else {
        for(k=0;k<2;k++){ var arr=cloud[k]; cx.fillStyle=k?'#15aabf':'#4c6ef5'; for(i=0;i<arr.length;i++){ if(Math.random()<.012) arr[i]=samp(k); P(arr[i][0],arr[i][1],arr[i][2]); cx.fillRect(PX-sz/2,PY-sz/2,sz,sz); } }
      }
    }
    if(id!=='dalton'&&id!=='thomson') nuc.forEach(function(n){ ball(n.x,n.y,n.z,PR,n.p?'#fa5252':'#adb5bd',1,n.p?'+':''); });
    items.sort(function(a,b){ return b.z-a.z; });
    items.forEach(function(it){ cx.globalAlpha=it.a*fade; cx.drawImage(spr(it.c),it.X-it.R,it.Y-it.R,2*it.R,2*it.R);
      if(it.s&&it.R>7){ cx.globalAlpha=fade*Math.min(1,it.a+.3); cx.fillStyle='#fff'; cx.font='700 '+Math.round(it.R*1.3)+'px system-ui,Arial'; cx.textAlign='center'; cx.textBaseline='middle'; cx.fillText(it.s,it.X,it.Y+it.R*.04); cx.textAlign='left'; cx.textBaseline='alphabetic'; } });
    cx.globalAlpha=fade;
    if(id==='dalton'){ P(0,0,0); cx.fillStyle=(el.s==='H'||el.s==='He')?'#212529':'#fff'; cx.font='800 '+Math.round(S*.7)+'px Georgia,serif'; cx.textAlign='center'; cx.textBaseline='middle'; cx.fillText(el.s,PX,PY); cx.textAlign='left'; cx.textBaseline='alphabetic'; lab('Esfera maciza: sin partes internas',.7,.9,0,70,-50); }
    if(id==='thomson'){ lab('Esfera positiva (+)',1.6,1.5,0,60,-40); if(Z) lab('Electrón (−)',posTh[0][0],posTh[0][1],posTh[0][2],-110,60); }
    if(id==='rutherford'){ lab('Núcleo (+): diminuto, ¡fuera de escala!',0,0,0,90,-70); lab('Electrón (−)',eOrb[0].r*eOrb[0].u[0],eOrb[0].r*eOrb[0].u[1],eOrb[0].r*eOrb[0].u[2],-130,70); lab('Espacio casi vacío',2.2,-1.2,0,40,50); }
    if(id==='bohr'){ lab('Núcleo (+)',0,0,0,-100,80); for(k=0;k<3;k++) lab('n = '+(k+1),RB[k]*rings[k][0][0],RB[k]*rings[k][0][1],RB[k]*rings[k][0][2],18,(k+1)*-5-14); }
    if(id==='quantum'){ lab('Núcleo (+)',0,0,0,90,-70); if(orbSets.length) lab('Orbital '+selOrb.value.replace('z2','z²'),1.2,.9,.5,60,-60); else lab('Nube de probabilidad',1.2,.9,.5,60,-60); }
    /* leyenda y ayuda */
    cx.globalAlpha=1; cx.font='600 '+(12*KF)+'px system-ui,Arial'; var lx=12*KF, ly=20*KF, LG=[['#339af0','Electrón (−)'],['#fa5252','Protón (+)']]; if(ckNe.checked&&id!=='dalton'&&id!=='thomson') LG.push(['#adb5bd','Neutrón (sin carga)']);
    if(id==='dalton') LG=[]; if(id==='thomson') LG[1]=['#fa5252','Carga positiva (+)']; if(id==='quantum') LG[0]=['#4c6ef5','Probabilidad del electrón (−)']; if(id==='quantum'&&orbSets.length){ LG=selOrb.value==='2p'?[['#f03e3e','2px'],['#37b24d','2py'],['#1c7ed6','2pz']]:[['#4c6ef5','Zona de fase (+)'],['#ff922b','Zona de fase (−)']]; }
    LG.forEach(function(g){ cx.fillStyle=g[0]; cx.beginPath(); cx.arc(lx+6*KF,ly-4*KF,6*KF,0,6.2832); cx.fill(); cx.fillStyle=INK; cx.fillText(g[1],lx+18*KF,ly); ly+=20*KF; });
    if(!opts.compact){ cx.fillStyle=MUT; cx.font='12px system-ui,Arial'; cx.fillText('Arrastra para girar · rueda para acercar',12,H-10); }
  }
  var raf=0, last=performance.now();
  build(); buildOrb(); sel(0); syncPlay(); raf=requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(raf); if(ro) ro.disconnect(); else window.removeEventListener('resize',size); };
}

