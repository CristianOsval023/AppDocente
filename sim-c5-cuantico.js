'use strict';
/* Clase 5 · Estación 6: modelo mecano-cuántico (Schrödinger y Heisenberg) */
/* punto al azar según la probabilidad del orbital: 's' (esfera, 1s) o 'p' (mancuerna, 2p), en unidades del radio de Bohr */
function c5qMuestra(tipo,rnd){
  var f=rnd()*6.2832;
  if(tipo==='s'){ var r=-Math.log(Math.max(1e-9,rnd()*rnd()*rnd()))*.5, z=2*rnd()-1, q=Math.sqrt(1-z*z); return [r*q*Math.cos(f),r*z*0+r*q*Math.sin(f)]; }
  var r2=-Math.log(Math.max(1e-12,rnd()*rnd()*rnd()*rnd()*rnd())), c=(rnd()<.5?-1:1)*Math.cbrt(rnd()), sn=Math.sqrt(1-c*c);
  return [r2*sn*Math.cos(f),r2*c];
}
var C5Q_CACHE={};
function c5qPuntos(tipo,n){
  if(!C5Q_CACHE[tipo]){ var rn=hcRnd(tipo==='s'?21:37), a=[]; for(var i=0;i<700;i++) a.push(c5qMuestra(tipo,rn)); C5Q_CACHE[tipo]=a; }
  return C5Q_CACHE[tipo].slice(0,n);
}
function c5qNube(tipo,n,cx,cy,sc,rad){
  var o='', P=c5qPuntos(tipo,n);
  P.forEach(function(p){ o+='<circle cx="'+(cx+p[0]*sc).toFixed(1)+'" cy="'+(cy+p[1]*sc).toFixed(1)+'" r="'+(rad||6)+'" fill="#1c7ed6" opacity=".5"/>'; });
  return o;
}

function c5HistCuantico(box){
  var W=1600,H=620,G=500;
  function s1(t){
    var o=hcFondoLab(W,H,G)+hcPersona({x:520,y:G+34,tun:'#12b886',trim:'#087f5b',hair:'#adb5bd',gest:t,sc:1.05,name:'Erwin Schrödinger',sub:'Austria · 1887–1961'})+hcPersona({x:1080,y:G+34,tun:'#fab005',trim:'#e67700',hair:'#e9b872',face:-1,gest:t+1,sc:1.05,name:'Werner Heisenberg',sub:'Alemania · 1901–1976'});
    var b=hcEz((t-3.5)/.7); if(b>0) o+='<g transform="translate(800,150) scale('+b+')"><ellipse rx="170" ry="80" fill="#fff" stroke="#14213d" stroke-width="6"/>'+hcT(0,34,100,HC.org,'?','middle',800)+'</g>';
    return o;
  }
  var FOTOS=[[950,230],[650,390],[880,420]];
  function s2(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/><circle cx="800" cy="310" r="16" fill="'+HC.p+'" stroke="#14213d" stroke-width="3"/><circle cx="800" cy="310" r="230" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="10 12"/>';
    o+='<rect x="140" y="250" width="200" height="130" rx="16" fill="#dee2e6" stroke="#14213d" stroke-width="6"/><circle cx="270" cy="315" r="44" fill="#74c0fc" stroke="#14213d" stroke-width="6"/><rect x="170" y="232" width="70" height="24" rx="6" fill="#868e96"/>'+hcT(240,425,34,HC.ink,'Cámara','middle',800);
    FOTOS.forEach(function(f,i){ var t0=2+i*2.6, k=hcEz((t-t0)/.3);
      if(t>t0&&t<t0+.5) o+='<rect width="'+W+'" height="'+H+'" fill="#fff" opacity="'+(1-(t-t0)/.5)*.9+'"/>';
      if(k>0) o+='<g opacity="'+k+'"><circle cx="'+f[0]+'" cy="'+f[1]+'" r="20" fill="'+HC.e+'" stroke="#14213d" stroke-width="4"/>'+hcT(f[0],f[1]-34,34,HC.ink,'foto '+(i+1),'middle',800)+'</g>'; });
    var run=Math.floor((t-2)/2.6); if(t<9.6){ var a=t*7; o+='<circle cx="'+(800+Math.cos(a)*(120+Math.sin(t*3)*40)).toFixed(1)+'" cy="'+(310+Math.sin(a*1.3)*(110+Math.cos(t*2)*40)).toFixed(1)+'" r="16" fill="'+HC.e+'" opacity=".22"/>'; }
    return o;
  }
  function s3(t){
    var n=Math.floor(hcEz(t/8.5)*600), o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>'+c5qNube('s',n,800,310,125,7)+'<circle cx="800" cy="310" r="14" fill="'+HC.p+'" stroke="#14213d" stroke-width="3"/>';
    o+='<rect x="90" y="40" width="360" height="86" rx="20" fill="#fff" stroke="#14213d" stroke-width="5"/>'+hcT(270,96,50,HC.ink,'Fotos: '+n,'middle',800);
    return o;
  }
  function s4(t){
    var a=hcEz(t/1), o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/><g opacity="'+a+'">'+c5qNube('s',420,470,300,125,7)+'<circle cx="470" cy="300" r="12" fill="'+HC.p+'"/>'+hcT(470,560,44,HC.ink,'Orbital s (esfera)','middle',800)+'</g>';
    var b=hcEz((t-2.5)/1); o+='<g opacity="'+b+'">'+c5qNube('p',520,1130,300,38,7)+'<circle cx="1130" cy="300" r="12" fill="'+HC.p+'"/>'+hcT(1130,560,44,HC.ink,'Orbital p (mancuerna)','middle',800)+'</g>';
    return o;
  }
  function s5(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>'+hcModelo('bohr',450,300,230,t)+hcT(450,590,42,HC.ink,'Órbitas (Bohr)','middle',800);
    var a=hcEz((t-1)/.5); o+='<g opacity="'+a+'" stroke="#e03131" stroke-width="22" stroke-linecap="round"><line x1="320" y1="170" x2="580" y2="430"/><line x1="580" y1="170" x2="320" y2="430"/></g>';
    o+=hcModelo('cuantico',1150,300,230,t)+hcT(1150,590,42,HC.ink,'Nube de probabilidad','middle',800);
    var b=hcEz((t-3)/.5); o+='<g opacity="'+b+'"><circle cx="1360" cy="130" r="64" fill="#ebfbee" stroke="#2b8a3e" stroke-width="8"/><polyline points="1330,132 1352,156 1392,106" fill="none" stroke="#2b8a3e" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></g>';
    return o;
  }
  return hcHistoria(box,{titulo:'Schrödinger y Heisenberg · 1925–1927',W:W,H:H,escenas:[
    {d:8,c:'1925–1927: Schrödinger y Heisenberg estudian los electrones, diminutos y veloces.',f:s1},
    {d:10,c:'Cada vez que «fotografiamos» al electrón, aparece en un lugar distinto.',f:s2},
    {d:10,c:'Con muchas fotos aparece una nube: ahí es más probable encontrarlo.',f:s3},
    {d:9,c:'Esas nubes se llaman orbitales y tienen distintas formas.',f:s4},
    {d:9,c:'Modelo actual: una nube de probabilidad, ya no órbitas fijas.',f:s5}]});
}

/* ---------- Simulador: fotografía al electrón ---------- */
function c5SimCuantico(box){
  var M=hcMarco(box,'Mecano-cuántico: fotos del electrón','Toma fotos y mira dónde aparece'), L=hcLienzo(M.esc,1000,520), cx=L.cx;
  var tipo='s', pts=[], last1=null, q=0, raf=0, alive=true, last=0, acc=0, bS, bP, sc=105;
  bS=hcBtn(M.ctrl,'Orbital s (esfera)',function(){ setT('s'); }); bP=hcBtn(M.ctrl,'Orbital p (mancuerna)',function(){ setT('p'); });
  hcBtn(M.ctrl,'Tomar foto',function(){ add(); },'go'); hcBtn(M.ctrl,'Tomar 50 fotos',function(){ q+=50; }); hcBtn(M.ctrl,'Borrar',function(){ pts=[]; last1=null; q=0; msg(); });
  function setT(t){ tipo=t; sc=(t==='s')?105:38; bS.className='hc-btn'+(t==='s'?' on':''); bP.className='hc-btn'+(t==='p'?' on':''); pts=[]; last1=null; q=0; msg(); }
  function add(){ var p=c5qMuestra(tipo,Math.random); last1={x:p[0],y:p[1],t:performance.now()}; pts.push(last1); if(pts.length>1500) pts.shift(); if(pts.length%10===0||pts.length<12) msg(); }
  function msg(){ var n=pts.length;
    if(n===0) M.msg('Toma una foto: ¿dónde estará el electrón?');
    else if(n<8) M.msg('Cada foto lo muestra en un <b>lugar distinto</b>. No se puede predecir exacto.','warn');
    else if(n<60) M.msg('Sigue tomando fotos… ¿en qué zonas aparecen más puntos?','warn');
    else M.msg('Donde hay más puntos es <b>más probable</b> encontrarlo: es una <b>nube de probabilidad</b> (orbital '+(tipo==='s'?'s':'p')+').','ok'); }
  function frame(now){
    if(!alive) return; raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now;
    if(q>0){ acc+=dt; while(acc>.02&&q>0){ acc-=.02; q--; add(); } }
    L.begin(); cx.fillStyle='#fff'; cx.fillRect(0,0,1000,520);
    var X0=380, Y0=262;
    cx.strokeStyle='#e2e8f0'; cx.lineWidth=2; cx.beginPath(); cx.moveTo(X0,10); cx.lineTo(X0,510); cx.moveTo(10,Y0); cx.lineTo(750,Y0); cx.stroke();
    pts.forEach(function(p){ cx.fillStyle='rgba(28,126,214,.5)'; cx.beginPath(); cx.arc(X0+p.x*sc,Y0+p.y*sc,5,0,6.2832); cx.fill(); });
    hcBola(cx,X0,Y0,10,'#e03131','',null);
    if(last1){ var a=(now-last1.t)/700; if(a<1){ cx.strokeStyle='rgba(245,159,11,'+(1-a)+')'; cx.lineWidth=6; cx.beginPath(); cx.arc(X0+last1.x*sc,Y0+last1.y*sc,10+a*40,0,6.2832); cx.stroke(); cx.fillStyle='rgba(245,159,11,'+(1-a)+')'; cx.beginPath(); cx.arc(X0+last1.x*sc,Y0+last1.y*sc,8,0,6.2832); cx.fill(); } }
    cx.fillStyle='#fff'; cx.strokeStyle='#c3cddb'; cx.lineWidth=3; cx.fillRect(770,16,220,150); cx.strokeRect(770,16,220,150);
    hcTxtC(cx,'Fotos',880,48,'#475569',26,'center',700); hcTxtC(cx,pts.length,880,112,'#14213d',72,'center',800);
    hcTxtC(cx,'• núcleo',880,230,'#e03131',24,'center',800); hcTxtC(cx,'• electrón (una foto)',880,264,'#1c7ed6',22,'center',800);
  }
  setT('s'); raf=requestAnimationFrame(function(n){ last=n; frame(n); });
  return function stop(){ alive=false; cancelAnimationFrame(raf); L.stop(); M.off(); };
}
