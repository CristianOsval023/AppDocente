'use strict';
/* Clase 5 · Estación 5: Bohr (niveles de energía y luz emitida) */
var C5B_RYD=1.0968e7;
function c5bLambda(ni,nf){ return 1e9/(C5B_RYD*(1/(nf*nf)-1/(ni*ni))); }
function c5bColor(l){ if(l<380||l>750) return null; var r=0,g=0,b=0;
  if(l<440){ r=(440-l)/60; b=1; } else if(l<490){ g=(l-440)/50; b=1; } else if(l<510){ g=1; b=(510-l)/20; } else if(l<580){ r=(l-510)/70; g=1; } else if(l<645){ r=1; g=(645-l)/65; } else { r=1; }
  var f=l<420?.45+.55*(l-380)/40:(l>700?.45+.55*(750-l)/50:1); function c(v){ return Math.round(255*Math.pow(v*f,.8)*.82); } return 'rgb('+c(r)+','+c(g)+','+c(b)+')'; }
function c5bNombre(l){ return l>=620?'roja':(l>=570?'amarilla':(l>=495?'verde':(l>=465?'azul verdosa':(l>=430?'azul':'violeta')))); }

function c5HistBohr(box){
  var W=1600,H=620,G=500, LN=[['#8b5cf6',410],['#2563eb',434],['#0891b2',486],['#dc2626',656]];
  function s1(t){
    var o=hcFondoLab(W,H,G)+'<rect x="820" y="'+(G-150)+'" width="680" height="26" rx="6" fill="#b08a54" stroke="#6f5430" stroke-width="4"/><rect x="850" y="'+(G-124)+'" width="22" height="124" fill="#8a6a3c"/><rect x="1450" y="'+(G-124)+'" width="22" height="124" fill="#8a6a3c"/>';
    var g=.5+Math.sin(t*5)*.12;
    o+='<ellipse cx="1160" cy="'+(G-214)+'" rx="300" ry="90" fill="#ff8fab" opacity="'+(.35*g)+'"/><rect x="900" y="'+(G-260)+'" width="520" height="92" rx="46" fill="#ffe3ec" stroke="#14213d" stroke-width="6"/><rect x="940" y="'+(G-236)+'" width="440" height="44" rx="22" fill="#ff6b9a" opacity="'+(.55+g*.4)+'"/>';
    return o+hcPersona({x:520+Math.sin(t*.9)*6,y:G+34,tun:'#1c7ed6',trim:'#1864ab',hair:'#6f4a2d',gest:t,sc:1.05,name:'Niels Bohr',sub:'Dinamarca · 1885–1962'});
  }
  function s2(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>', a=hcEz(t/1);
    o+='<rect x="90" y="240" width="300" height="80" rx="40" fill="#ffe3ec" stroke="#14213d" stroke-width="6"/><rect x="120" y="258" width="240" height="44" rx="22" fill="#ff6b9a"/>'+hcT(240,380,38,HC.ink,'Gas de hidrógeno','middle',800);
    o+='<line x1="390" y1="280" x2="650" y2="280" stroke="#475569" stroke-width="12" opacity="'+a+'"/><polygon points="650,170 650,390 790,280" fill="#e7f5ff" stroke="#14213d" stroke-width="6" opacity="'+a+'"/>'+hcT(690,430,34,HC.mut,'Prisma','middle',800);
    o+='<rect x="960" y="140" width="560" height="280" rx="14" fill="#e9ecef" stroke="#14213d" stroke-width="6"/>';
    LN.forEach(function(L,i){ var x=1000+((L[1]-400)/260)*480, k=hcEz((t-1.6-i*1.2)/.5); if(k<=0) return; o+='<line x1="790" y1="280" x2="'+x+'" y2="280" stroke="'+L[0]+'" stroke-width="5" opacity="'+(.35*k)+'" /><line x1="'+x+'" y1="152" x2="'+x+'" y2="408" stroke="'+L[0]+'" stroke-width="16" opacity="'+k+'"/>'; });
    return o+hcT(1240,470,38,HC.ink,'Sus propios colores','middle',800,'opacity="'+hcEz((t-6)/.6)+'"');
  }
  function orbitas(t,cx,cy,k,jump){
    var R=[70,135,205,275], o='';
    for(var i=0;i<4;i++){ var a=hcEz((t-.4-i*1.5)/.6); if(a<=0||i>=k) continue; o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R[i]+'" fill="none" stroke="#64748b" stroke-width="5" opacity="'+a+'"/>'+'<g opacity="'+a+'"><circle cx="'+(cx+R[i]*.7)+'" cy="'+(cy-R[i]*.7)+'" r="26" fill="#fff" stroke="#14213d" stroke-width="3"/>'+hcT(cx+R[i]*.7,cy-R[i]*.7+10,28,HC.ink,'n='+(i+1),'middle',800)+'</g>'; }
    o+='<circle cx="'+cx+'" cy="'+cy+'" r="22" fill="'+HC.p+'" stroke="#14213d" stroke-width="4"/>';
    return o;
  }
  function s3(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>'+orbitas(t,800,310,4);
    var an=t*1.6; o+='<circle cx="'+(800+135*Math.cos(an)).toFixed(1)+'" cy="'+(310+135*Math.sin(an)).toFixed(1)+'" r="18" fill="'+HC.e+'" stroke="#14213d" stroke-width="3.5"/>';
    return o+hcT(260,200,48,HC.ink,'Niveles de energía','middle',800,'opacity="'+hcEz((t-6.5)/.6)+'"')+hcT(260,250,34,HC.mut,'(órbitas fijas)','middle',700,'opacity="'+hcEz((t-6.5)/.6)+'"');
  }
  function s4(t){
    var cx=700, cy=310, R=[70,135,205], an0=.3, an=t<2.4?an0-(2.4-t)*1.5:an0+(t-2.4)*1.5, up=hcEz((t-2.4)/.6), r=R[2]+(R[1]-R[2])*up, ex=cx+r*Math.cos(an), ey=cy+r*Math.sin(an);
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>';
    R.forEach(function(rr,i){ o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+rr+'" fill="none" stroke="#64748b" stroke-width="5"/><circle cx="'+(cx+rr*.7)+'" cy="'+(cy-rr*.7)+'" r="26" fill="#fff" stroke="#14213d" stroke-width="3"/>'+hcT(cx+rr*.7,cy-rr*.7+10,28,HC.ink,'n='+(i+1),'middle',800); });
    o+='<circle cx="'+cx+'" cy="'+cy+'" r="22" fill="'+HC.p+'" stroke="#14213d" stroke-width="4"/><circle cx="'+ex.toFixed(1)+'" cy="'+ey.toFixed(1)+'" r="18" fill="'+HC.e+'" stroke="#14213d" stroke-width="3.5"/>';
    if(t>2.4){
      var dx=Math.cos(an0), dy=Math.sin(an0), px=cx+R[2]*dx, py=cy+R[2]*dy, s=(t-2.4)*140, pts=[], k;
      for(k=0;k<=40;k++){ var u=-150+k*150/40; pts.push(u.toFixed(1)+','+(Math.sin(u/9)*14).toFixed(1)); }
      o+='<g transform="translate('+(px+dx*s).toFixed(1)+','+(py+dy*s).toFixed(1)+') rotate('+(an0*180/Math.PI).toFixed(1)+')"><polyline points="'+pts.join(' ')+'" fill="none" stroke="#dc2626" stroke-width="10" stroke-linecap="round" opacity="'+hcCl(s/40,0,1)+'"/></g>';
      o+=hcT(hcCl(px+dx*(s+60),160,1440),hcCl(py+dy*(s+60)-40,70,560),54,'#dc2626','Luz roja','middle',800,'opacity="'+hcEz((t-3.4)/.5)+'"');
    }
    return o+hcT(1180,540,36,HC.mut,'De un nivel alto a uno bajo: emite luz','middle',700,'opacity="'+hcEz((t-5)/.6)+'"');
  }
  function s5(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>', cx=430, cy=300;
    o+='<circle cx="'+cx+'" cy="'+cy+'" r="46" fill="#ffd43b" stroke="#14213d" stroke-width="5"/>';
    [[110,'#4dabf7',1.4],[170,'#51cf66',1.0],[235,'#ff922b',.7]].forEach(function(p){ o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+p[0]+'" fill="none" stroke="#adb5bd" stroke-width="4"/><circle cx="'+(cx+p[0]*Math.cos(t*p[2])).toFixed(1)+'" cy="'+(cy+p[0]*Math.sin(t*p[2])).toFixed(1)+'" r="20" fill="'+p[1]+'" stroke="#14213d" stroke-width="3.5"/>'; });
    o+=hcT(cx,590,44,HC.ink,'Sistema solar','middle',800)+hcT(800,330,110,HC.mut,'≈','middle',800)+hcModelo('bohr',1170,cy,245,t)+hcT(1170,590,44,HC.ink,'Átomo de Bohr','middle',800);
    return o;
  }
  return hcHistoria(box,{titulo:'Bohr · Dinamarca · 1913',W:W,H:H,escenas:[
    {d:8,c:'Dinamarca, 1913: Niels Bohr estudia la luz que emiten los átomos.',f:s1},
    {d:9,c:'Cada elemento brilla con sus propios colores, como una huella.',f:s2},
    {d:10,c:'Propuso que los electrones solo pueden estar en niveles de energía fijos.',f:s3},
    {d:9,c:'Al saltar a un nivel más bajo, el electrón emite luz.',f:s4},
    {d:9,c:'Su modelo: un núcleo y electrones en órbitas, como planetas.',f:s5}]});
}

/* ---------- Simulador: saltos del electrón del hidrógeno ---------- */
function c5SimBohr(box){
  var M=hcMarco(box,'Bohr: saltos del electrón','Toca una órbita o usa los botones'), L=hcLienzo(M.esc,1000,520), cx=L.cx;
  var R=[34,76,122,168,212,252], X0=330, Y0=262, n=1, r=R[0], ang=0, tw=null, pend=null, ph=[], found={}, raf=0, alive=true, last=0, bU, bD;
  var VIS=[[3,2],[4,2],[5,2],[6,2]];
  bU=hcBtn(M.ctrl,'Subir de nivel',function(){ go(n+1); },'go'); bD=hcBtn(M.ctrl,'Bajar de nivel',function(){ go(n-1); },''); hcBtn(M.ctrl,'Volver a n = 1',function(){ go(1); });
  function go(to){ if(to<1||to>6||to===n||tw||pend) return;
    if(to>n){ pend={to:to,from:n,t:0}; ph.push({kind:'in',t:0,col:'#f59f00',x:X0+R[n-1]*Math.cos(ang)+330,y:Y0+R[n-1]*Math.sin(ang)-90,tx:X0+R[n-1]*Math.cos(ang),ty:Y0+R[n-1]*Math.sin(ang)}); M.msg('Absorbe <b>energía</b> y sube al nivel <b>n = '+to+'</b>.','warn'); }
    else start(to,n); }
  function start(to,from){ tw={from:from,to:to,t:0};
    if(to<from){ var l=c5bLambda(from,to), col=c5bColor(l), vis=!!col, nm=vis?c5bNombre(l):(l<380?'ultravioleta':'infrarroja'), k=from+'-'+to;
      ph.push({kind:'out',t:0,col:col||(l<380?'#a78bfa':'#f87171'),x:X0+r*Math.cos(ang),y:Y0+r*Math.sin(ang),dx:Math.cos(ang),dy:Math.sin(ang),vis:vis});
      if(vis){ var first=!found[k]; found[k]=col; M.msg('Baja de n = '+from+' a n = '+to+': emite luz <b>'+nm+'</b> ('+Math.round(l)+' nm).'+(first?' ¡Color nuevo!':''),'ok'); }
      else M.msg('Baja de n = '+from+' a n = '+to+': emite luz <b>'+nm+'</b> ('+Math.round(l)+' nm). Es invisible para nuestros ojos.','warn');
      if(VIS.every(function(v){ return found[v[0]+'-'+v[1]]; })) M.msg('¡Encontraste los 4 colores del hidrógeno! Cada elemento tiene los suyos.','ok'); } }
  L.cv.addEventListener('pointerdown',function(e){ var p=L.pt(e), d=Math.hypot(p.x-X0,p.y-Y0), best=-1, bd=1e9; R.forEach(function(rr,i){ var dd=Math.abs(rr-d); if(dd<bd){ bd=dd; best=i; } }); if(bd<22) go(best+1); });
  function frame(now){
    if(!alive) return; raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now;
    ang+=dt*3/Math.pow(n,1.3);
    if(pend){ pend.t+=dt; if(pend.t>.55){ var q=pend; pend=null; start(q.to,q.from); } }
    if(tw){ tw.t+=dt/.4; var e=hcEz(tw.t); r=R[tw.from-1]+(R[tw.to-1]-R[tw.from-1])*e; if(tw.t>=1){ n=tw.to; r=R[n-1]; tw=null; } }
    bU.disabled=(n>=6||!!tw||!!pend); bD.disabled=(n<=1||!!tw||!!pend);
    L.begin(); cx.fillStyle='#fff'; cx.fillRect(0,0,1000,520);
    R.forEach(function(rr,i){ cx.strokeStyle=(i+1===n)?'#1971c2':'#94a3b8'; cx.lineWidth=(i+1===n)?5:3; cx.beginPath(); cx.arc(X0,Y0,rr,0,6.2832); cx.stroke(); var lx=X0+rr*.707, ly=Y0-rr*.707; cx.fillStyle='#fff'; cx.beginPath(); cx.arc(lx,ly,15,0,6.2832); cx.fill(); hcTxtC(cx,i+1,lx,ly+1,i+1===n?'#1971c2':'#475569',22,'center',800); });
    hcBola(cx,X0,Y0,14,'#e03131','',null);
    var ex=X0+r*Math.cos(ang), ey=Y0+r*Math.sin(ang); hcBola(cx,ex,ey,13,'#1c7ed6','',null);
    ph.forEach(function(p){ p.t+=dt;
      if(p.kind==='in'){ var u=hcCl(p.t/.5,0,1); p.cx2=p.x+(p.tx-p.x)*u; p.cy2=p.y+(p.ty-p.y)*u; if(u>=1) p.dead=true; drawPh(p.cx2,p.cy2,Math.atan2(p.ty-p.y,p.tx-p.x),p.col,true); }
      else { var s=p.t*330; if(s>720) p.dead=true; drawPh(p.x+p.dx*s,p.y+p.dy*s,Math.atan2(p.dy,p.dx),p.col,p.vis); } });
    ph=ph.filter(function(p){ return !p.dead; });
    /* panel derecho */
    cx.fillStyle='#fff'; cx.strokeStyle='#c3cddb'; cx.lineWidth=3; cx.fillRect(640,16,350,230); cx.strokeRect(640,16,350,230);
    hcTxtC(cx,'Nivel',815,48,'#475569',26,'center',700); hcTxtC(cx,'n = '+n,815,110,'#14213d',80,'center',800);
    hcTxtC(cx,n===1?'Energía más baja':(n<4?'Energía media':'Energía alta'),815,180,'#1971c2',28,'center',800); hcTxtC(cx,'Lejos del núcleo = más energía',815,218,'#475569',20,'center',700);
    cx.fillStyle='#fff'; cx.fillRect(640,270,350,230); cx.strokeRect(640,270,350,230);
    hcTxtC(cx,'Colores que has producido',815,298,'#14213d',22,'center',800);
    cx.fillStyle='#e9ecef'; cx.fillRect(660,330,310,110); cx.strokeStyle='#14213d'; cx.lineWidth=3; cx.strokeRect(660,330,310,110);
    VIS.forEach(function(v){ var l=c5bLambda(v[0],v[1]), x=660+((l-390)/300)*310, k=v[0]+'-'+v[1]; if(found[k]){ cx.fillStyle=found[k]; cx.fillRect(x-6,332,12,106); } else { cx.fillStyle='#cbd5e1'; cx.fillRect(x-1.5,332,3,106); } });
    hcTxtC(cx,Object.keys(found).length+' de 4 colores',815,474,'#475569',22,'center',800);
  }
  function drawPh(x,y,a,col,vis){
    cx.save(); cx.translate(x,y); cx.rotate(a); cx.strokeStyle=col; cx.lineWidth=7; cx.lineCap='round'; if(!vis) cx.setLineDash([8,8]); cx.beginPath();
    for(var i=0;i<=40;i++){ var u=i*2-80, yy=Math.sin(u/7)*9; if(i) cx.lineTo(u,yy); else cx.moveTo(u,yy); } cx.stroke(); cx.restore(); cx.setLineDash([]); }
  M.msg('El electrón está en <b>n = 1</b>. Sube de nivel y luego bájalo.'); raf=requestAnimationFrame(function(t){ last=t; frame(t); });
  return function stop(){ alive=false; cancelAnimationFrame(raf); L.stop(); M.off(); };
}
