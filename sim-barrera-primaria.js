'use strict';
/* Simulador 2D: barrera primaria (piel, mucosas y microbiota) */
/* ====== SIMULADOR 2D: Barrera primaria (piel, mucosas y microbiota) ====== */
function barreraPrimaria(box){
  var NS='http://www.w3.org/2000/svg';
  function sv(tag,attrs,parent){ var e=document.createElementNS(NS,tag); for(var k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; }
  /* curva suave (Catmull-Rom → Bézier) */
  function smooth(p){ var d='M'+p[0][0]+' '+p[0][1]; for(var i=0;i<p.length-1;i++){ var a=p[i-1]||p[i],b=p[i],c=p[i+1],e=p[i+2]||c;
    d+=' C'+(b[0]+(c[0]-a[0])/6).toFixed(1)+' '+(b[1]+(c[1]-a[1])/6).toFixed(1)+' '+(c[0]-(e[0]-b[0])/6).toFixed(1)+' '+(c[1]-(e[1]-b[1])/6).toFixed(1)+' '+c[0]+' '+c[1]; } return d; }

  /* ---------- silueta (mitad derecha en curvas; la izquierda es su espejo) ---------- */
  var S=[316,140], RH=[
    [[318,158],[320,170],[322,180]],[[334,192],[362,194],[390,202]],[[414,209],[426,228],[428,256]],[[431,300],[437,345],[441,385]],
    [[446,430],[452,468],[455,500]],[[458,522],[468,540],[462,562]],[[457,578],[444,582],[438,568]],[[434,556],[436,540],[432,522]],
    [[430,512],[430,506],[430,500]],[[426,465],[420,430],[414,392]],[[410,350],[404,305],[396,272]],[[392,262],[388,262],[384,268]],
    [[382,305],[374,345],[370,382]],[[367,410],[380,440],[384,470]],[[390,520],[384,600],[374,662]],[[369,705],[376,765],[366,820]],
    [[366,842],[390,852],[384,868]],[[380,878],[334,878],[328,868]],[[324,856],[332,836],[330,822]],[[326,762],[327,705],[322,662]],
    [[316,600],[312,540],[306,502]],[[304,494],[302,492],[300,492]]];
  var BODY=(function(){ var d='M'+S[0]+' '+S[1], i, pts=[S];
    RH.forEach(function(s){ d+=' C'+s[0]+' '+s[1]+' '+s[2]; pts.push(s[2]); });
    var mx=function(p){ return (600-p[0])+','+p[1]; };
    for(i=RH.length-1;i>=0;i--){ var s=RH[i], start=pts[i]; d+=' C'+mx(s[1])+' '+mx(s[0])+' '+mx(start); }
    return d+' Z'; })();
  var HEAD={cx:300,cy:92,rx:46,ry:58};

  /* ---------- órganos ---------- */
  var NASAL='M300 82 C292 82 289 88 289 98 L289 116 C289 122 293 125 300 125 C307 125 311 122 311 116 L311 98 C311 88 308 82 300 82 Z';
  var SEPT='M299 84 L301 84 L301.2 112 L298.8 112 Z';
  var TURB=[]; [-1,1].forEach(function(s){ [[92,4.2],[101,5],[110,4.4]].forEach(function(t){ var x0=300+s*11, x1=300+s*(11-t[1]);
    TURB.push('M'+x0+' '+(t[0]-2.6)+' C'+(x0-s*2)+' '+(t[0]-3.4)+' '+x1+' '+(t[0]-2.4)+' '+x1+' '+(t[0]+.2)+' C'+x1+' '+(t[0]+2.4)+' '+(x0-s*1.5)+' '+(t[0]+2.6)+' '+x0+' '+(t[0]+1.8)+' Z'); }); });
  var ORAL='M289 127 C289 124 311 124 311 127 L311 135 C311 139 289 139 289 135 Z';
  var PHARYNX=smooth([[300,121],[300,140],[300,160],[300,180]]);
  var ESO=smooth([[300,176],[299,220],[298,270],[300,312],[306,334],[314,340]]);
  var STOM='M306 330 C310 316 336 310 352 320 C366 330 368 354 360 370 C352 384 330 390 312 386 C304 384 298 382 292 378 L292 370 C298 372 306 374 314 374 C330 374 340 366 340 354 C340 344 332 338 324 340 C318 342 314 346 312 348 Z';
  var DUO=smooth([[300,376],[292,382],[286,394],[284,408],[288,418],[282,424]]);
  var SIpts=[[282,424]], rowsY=[426,439,452,465];
  rowsY.forEach(function(y,r){ var L=268,R=334,dir=r%2===0?1:-1;
    for(var k=0;k<=6;k++){ var x=dir>0?L+(R-L)*k/6:R-(R-L)*k/6; if(r===0&&k===0) continue; SIpts.push([+x.toFixed(1),+(y+2*Math.sin(k*1.7+r)).toFixed(1)]); }
    if(r<rowsY.length-1){ var xe=dir>0?R+6:L-6; SIpts.push([xe,y+6.5]); } });
  SIpts.push([262,474],[254,482]);
  var SI=smooth(SIpts);
  var COLON=smooth([[250,490],[249,470],[249,440],[250,412],[256,400],[270,398],[300,410],[330,398],[346,396],[353,408],[353,440],[352,466],[344,480],[324,486],[306,480],[300,484]]);
  var APPX=smooth([[250,490],[246,500],[249,510],[254,512]]);
  var FUN=[[540,64,50],[450,90,36],[380,104,22],[330,111,12],[304,114,7]];
  var FUNPOLY=(function(){ var up=[],dn=[]; for(var i=0;i<FUN.length;i++){ var a=FUN[Math.max(0,i-1)],b=FUN[Math.min(FUN.length-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],l=Math.hypot(tx,ty)||1,nx=-ty/l,ny=tx/l,p=FUN[i];
    up.push([p[0]+nx*p[2]/2,p[1]+ny*p[2]/2]); dn.push([p[0]-nx*p[2]/2,p[1]-ny*p[2]/2]); }
    var pts=up.concat(dn.reverse()); return 'M'+pts.map(function(q){return q[0].toFixed(1)+' '+q[1].toFixed(1);}).join(' L')+' Z'; })();
  var FUNC=smooth(FUN.map(function(p){return [p[0],p[1]];}));
  /* anchos: luz (por donde viajan los microorganismos) y pared */
  var W={pha:[10,16],eso:[6,11],duo:[6,10],si:[5,9.5],col:[10,19],app:[3.5,6.5]};

  /* ---------- DOM ---------- */
  box.innerHTML=
   '<div class="simstage2" id="bpstage">'+
    '<svg id="bpsvg" role="img" aria-label="Cuerpo humano de frente con la piel, las fosas nasales, el sistema digestivo y microorganismos que rebotan en la piel"></svg>'+
    '<div class="simhint" id="bphint">Toca la piel, la nariz o el intestino para acercarte</div>'+
    '<aside class="simcard" id="bpcard" hidden><button class="simx" id="bpx" aria-label="Cerrar descripción">×</button><h3 id="bph"></h3><p id="bpp"></p><button class="btn2" id="bpback">‹ Ver cuerpo completo</button></aside>'+
   '</div>'+
   '<div class="simctl2"><label>Microorganismos <input type="range" id="bpN" min="20" max="200" value="100"><output id="bpNo">100</output></label>'+
   '<label>Velocidad <input type="range" id="bpS" min="0.4" max="2" step="0.1" value="1"></label>'+
   '<button class="btn2" id="bpP">Pausar</button><button class="btn2" id="bpR">Reiniciar</button></div>';
  var svg=box.querySelector('#bpsvg'), stage=box.querySelector('#bpstage'), card=box.querySelector('#bpcard'), hint=box.querySelector('#bphint');
  var defs=sv('defs',{},svg);
  function grad(id,stops,x2,y2){ var g=sv('linearGradient',{id:id,x1:0,y1:0,x2:x2||0,y2:y2||1},defs); stops.forEach(function(s){ sv('stop',{offset:s[0],'stop-color':s[1],'stop-opacity':s[2]==null?1:s[2]},g); }); }
  grad('gSkin',[[0,'#f6e0cf'],[1,'#ecc9b0']]);
  grad('gAir',[[0,'#5b8def',.0],[1,'#5b8def',.55]],1,0);
  grad('gSto',[[0,'#f7c4b0'],[1,'#e9a08a']]);

  /* piel */
  var gSkin=sv('g',{'class':'part'},svg);
  sv('ellipse',{cx:254,cy:94,rx:7,ry:14,'class':'skin'},gSkin); sv('ellipse',{cx:346,cy:94,rx:7,ry:14,'class':'skin'},gSkin);
  sv('path',{d:BODY,'class':'skin'},gSkin);
  sv('ellipse',{cx:HEAD.cx,cy:HEAD.cy,rx:HEAD.rx,ry:HEAD.ry,'class':'skin'},gSkin);
  sv('path',{d:BODY,'class':'skin-f'},gSkin); sv('ellipse',{cx:HEAD.cx,cy:HEAD.cy,rx:HEAD.rx-1.2,ry:HEAD.ry-1.2,'class':'skin-f'},gSkin);
  sv('path',{d:'M254 96 C250 52 276 30 300 30 C324 30 350 52 346 96 C342 72 328 58 300 58 C272 58 258 72 254 96 Z','class':'hair'},gSkin);
  [-1,1].forEach(function(s){ var x=300+s*19;
    sv('path',{d:'M'+(x-8)+' 88 C'+(x-4)+' 83 '+(x+4)+' 83 '+(x+8)+' 88 C'+(x+4)+' 92 '+(x-4)+' 92 '+(x-8)+' 88 Z','class':'eye-w'},gSkin);
    sv('circle',{cx:x,cy:88,r:2.8,'class':'eye'},gSkin);
    sv('path',{d:'M'+(x-9)+' 79 C'+(x-4)+' 75 '+(x+4)+' 75 '+(x+9)+' 78','class':'brow'},gSkin);
    sv('ellipse',{cx:300+s*6,cy:115.5,rx:3,ry:1.7,'class':'nostril'},gSkin); });
  sv('path',{d:'M296 96 C295 104 292 110 291 113 C293 118 307 118 309 113 C308 110 305 104 304 96','class':'nose-l'},gSkin);
  sv('path',{d:'M290 130 C295 127 298 128 300 129 C302 128 305 127 310 130 C305 132 295 132 290 130 Z','class':'lip'},gSkin);
  sv('path',{d:'M290 130 C294 136 306 136 310 130','class':'lip-l'},gSkin);

  /* órganos de contexto (no interactivos) */
  var gCtx=sv('g',{'class':'ctx'},svg);
  sv('path',{d:'M290 214 C270 212 246 236 240 272 C236 298 238 316 246 322 C262 320 280 316 290 312 Z','class':'lung'},gCtx);
  sv('path',{d:'M310 214 C330 212 354 236 360 272 C364 298 362 316 354 322 C344 320 330 316 322 312 C326 300 318 292 310 290 Z','class':'lung'},gCtx);
  sv('path',{d:'M236 326 C262 316 300 318 314 328 C312 352 296 372 270 380 C252 384 238 372 234 352 Z','class':'liver'},gCtx);
  sv('path',{d:'M232 326 C260 308 340 308 368 326','class':'diaph'},gCtx);

  /* mucosas: cavidad nasal, boca, faringe, esófago y estómago */
  var gMuc=sv('g',{'class':'part'},svg);
  sv('path',{d:ORAL,'class':'oral'},gMuc); sv('path',{d:'M292 134 C296 129 304 129 308 134 C304 137 296 137 292 134 Z','class':'tongue'},gMuc);
  [['PHARYNX','pha'],['ESO','eso']].forEach(function(t){ var d=t[0]==='PHARYNX'?PHARYNX:ESO; sv('path',{d:d,'class':'tw-m','stroke-width':W[t[1]][1]},gMuc); sv('path',{d:d,'class':'tl','stroke-width':W[t[1]][0]},gMuc); });
  sv('path',{d:NASAL,'class':'nasal'},gMuc); sv('path',{d:SEPT,'class':'sept'},gMuc);
  TURB.forEach(function(d){ sv('path',{d:d,'class':'turb'},gMuc); });
  sv('path',{d:STOM,'class':'stom'},gMuc);
  [[312,330,340,326,352,334],[314,340,342,336,354,350],[320,356,340,352,356,364],[318,368,336,370,350,378],[300,380,312,380,324,382]].forEach(function(r){ sv('path',{d:'M'+r[0]+' '+r[1]+' Q'+r[2]+' '+r[3]+' '+r[4]+' '+r[5],'class':'ruga'},gMuc); });

  /* microbiota: intestino delgado y grueso */
  var gMic=sv('g',{'class':'part'},svg);
  sv('path',{d:DUO,'class':'tw-s','stroke-width':W.duo[1]},gMic); sv('path',{d:DUO,'class':'tl','stroke-width':W.duo[0]},gMic);
  sv('path',{d:SI,'class':'tw-s','stroke-width':W.si[1]},gMic); sv('path',{d:SI,'class':'tl','stroke-width':W.si[0]},gMic);
  sv('path',{d:APPX,'class':'tw-c','stroke-width':W.app[1]},gMic); sv('path',{d:APPX,'class':'tl','stroke-width':W.app[0]},gMic);
  sv('path',{d:COLON,'class':'tw-c','stroke-width':W.col[1]},gMic); sv('path',{d:COLON,'class':'haus','stroke-width':W.col[1]},gMic);
  sv('path',{d:COLON,'class':'tl','stroke-width':W.col[0]},gMic);

  /* corriente de aire inhalado */
  var gAir=sv('g',{'pointer-events':'none'},svg);
  sv('path',{d:FUNPOLY,fill:'url(#gAir)'},gAir);
  [-10,0,10].forEach(function(o,i){ sv('path',{d:smooth(FUN.map(function(p,k){ return [p[0],p[1]+o*p[2]/50]; })),'class':'flow','style':'animation-delay:'+(-i*.4)+'s'},gAir); });

  /* ---------- máscaras de colisión (rejilla) ---------- */
  var GX0=110,GY0=0,GW=500,GH=900,RES=.5, NX=Math.round(GW/RES), NY=Math.round(GH/RES);
  function canvasCtx(){ var c=document.createElement('canvas'); c.width=NX; c.height=NY; var x=c.getContext('2d'); x.setTransform(1/RES,0,0,1/RES,-GX0/RES,-GY0/RES); x.lineCap='round'; x.lineJoin='round'; return x; }
  var cb=canvasCtx(); cb.fillStyle='#000'; cb.fill(new Path2D(BODY)); cb.beginPath(); cb.ellipse(HEAD.cx,HEAD.cy,HEAD.rx,HEAD.ry,0,0,6.2832); cb.fill();
  [[254,94],[346,94]].forEach(function(e){ cb.beginPath(); cb.ellipse(e[0],e[1],7,14,0,0,6.2832); cb.fill(); });
  var cl=canvasCtx(), REG={mn:40,dg:80,si:120,li:160,fn:200};
  function stroke(d,w,r){ cl.globalCompositeOperation='source-over'; cl.strokeStyle='rgb('+r+',0,0)'; cl.lineWidth=w; cl.stroke(new Path2D(d)); }
  function fill(d,r){ cl.globalCompositeOperation='source-over'; cl.fillStyle='rgb('+r+',0,0)'; cl.fill(new Path2D(d)); }
  function erase(d,w){ cl.globalCompositeOperation='destination-out'; if(w){ cl.lineWidth=w; cl.strokeStyle='#000'; cl.stroke(new Path2D(d)); } else { cl.fillStyle='#000'; cl.fill(new Path2D(d)); } }
  stroke(COLON,W.col[0],REG.li); stroke(APPX,W.app[0],REG.li);
  erase(DUO,W.duo[0]+9);
  fill(STOM,REG.dg); erase(STOM,6);
  stroke(ESO,W.eso[0],REG.dg); stroke(DUO,W.duo[0],REG.si); stroke(SI,W.si[0],REG.si);
  stroke(PHARYNX,W.pha[0],REG.mn); fill(NASAL,REG.mn); erase(SEPT); TURB.forEach(function(d){ erase(d); }); fill(ORAL,REG.mn);
  fill(FUNPOLY,REG.fn);
  var bd=cb.getImageData(0,0,NX,NY).data, ld=cl.getImageData(0,0,NX,NY).data, N=NX*NY;
  var allow=new Uint8Array(N), reg=new Uint8Array(N), i;
  for(i=0;i<N;i++){ var inBody=bd[i*4+3]>127, lum=ld[i*4+3]>127; allow[i]=(!inBody||lum)?1:0; if(lum) reg[i]=Math.round(ld[i*4]/40); }
  /* distancia con signo (transformada de chaflán) */
  function chamfer(src){ var INF=1e9,d=new Float32Array(N),x,y,k,R2=1.4142;
    for(i=0;i<N;i++) d[i]=src[i]?INF:0;
    for(y=0;y<NY;y++) for(x=0;x<NX;x++){ k=y*NX+x; if(!d[k]) continue; var v=d[k];
      if(x>0) v=Math.min(v,d[k-1]+1); if(y>0){ v=Math.min(v,d[k-NX]+1); if(x>0) v=Math.min(v,d[k-NX-1]+R2); if(x<NX-1) v=Math.min(v,d[k-NX+1]+R2); } d[k]=v; }
    for(y=NY-1;y>=0;y--) for(x=NX-1;x>=0;x--){ k=y*NX+x; if(!d[k]) continue; var w=d[k];
      if(x<NX-1) w=Math.min(w,d[k+1]+1); if(y<NY-1){ w=Math.min(w,d[k+NX]+1); if(x<NX-1) w=Math.min(w,d[k+NX+1]+R2); if(x>0) w=Math.min(w,d[k+NX-1]+R2); } d[k]=w; }
    return d; }
  var dIn=chamfer(allow), notA=new Uint8Array(N); for(i=0;i<N;i++) notA[i]=allow[i]?0:1; var dOut=chamfer(notA);
  var SD=new Float32Array(N); for(i=0;i<N;i++) SD[i]=(allow[i]?dIn[i]-.5:-(dOut[i]-.5))*RES;
  /* distancia geodésica desde las fosas nasales (marca el sentido del recorrido) */
  var GEO=new Float32Array(N).fill(-1), q=new Int32Array(N), qh=0, qt=0, seed=Math.round((114-GY0)/RES)*NX+Math.round((300-GX0)/RES);
  if(reg[seed]){ GEO[seed]=0; q[qt++]=seed; }
  while(qh<qt){ var c=q[qh++], cx=c%NX, nb=[c-1,c+1,c-NX,c+NX]; for(var t=0;t<4;t++){ var n2=nb[t]; if(n2<0||n2>=N||(t<2&&Math.abs((n2%NX)-cx)!==1)) continue; if(reg[n2]&&GEO[n2]<0){ GEO[n2]=GEO[c]+1; q[qt++]=n2; } } }
  function cell(x,y){ var gx=Math.round((x-GX0)/RES), gy=Math.round((y-GY0)/RES); if(gx<0||gy<0||gx>=NX||gy>=NY) return -1; return gy*NX+gx; }
  function G(x,y){ var fx=(x-GX0)/RES, fy=(y-GY0)/RES; if(fx<1||fy<1||fx>=NX-2||fy>=NY-2) return 40; var x0=fx|0,y0=fy|0,ax=fx-x0,ay=fy-y0,k=y0*NX+x0;
    return (SD[k]*(1-ax)+SD[k+1]*ax)*(1-ay)+(SD[k+NX]*(1-ax)+SD[k+NX+1]*ax)*ay; }
  function nrm(x,y){ var e=.6,nx=G(x+e,y)-G(x-e,y),ny=G(x,y+e)-G(x,y-e),l=Math.hypot(nx,ny)||1; return [nx/l,ny/l]; }
  function flow(k){ var x=k%NX; if(GEO[k]<0) return null; function g(j){ return (j>=0&&j<N&&GEO[j]>=0)?GEO[j]:GEO[k]; }
    var gx=g(x<NX-1?k+1:k)-g(x>0?k-1:k), gy=g(k+NX)-g(k-NX), l=Math.hypot(gx,gy); return l?[gx/l,gy/l]:null; }
  var RESID=[]; for(i=0;i<N;i+=3){ if((reg[i]===3||reg[i]===4)&&SD[i]>1.8) RESID.push(i); }

  /* ---------- etiquetas ---------- */
  var gLab=sv('g',{},svg), selKey=null;
  function label(key,txt,tx,ty,px,py,anchor){
    var g=sv('g',{'class':'lab',tabindex:0,role:'button','aria-label':txt+': ver descripción'},gLab);
    sv('line',{x1:tx+(anchor==='end'?5:-5),y1:ty-4,x2:px,y2:py,'class':'lab-l'},g);
    sv('circle',{cx:px,cy:py,r:3.2,'class':'lab-d'},g);
    var t=sv('text',{x:tx,y:ty,'text-anchor':anchor},g); t.textContent=txt;
    g.onclick=function(e){ e.stopPropagation(); select(key); }; g.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); select(key); } };
  }
  label('skin','Piel',478,418,451,430,'start');
  label('muc','Membrana mucosa',350,40,306,96,'start');
  label('mic','Microbiota',128,470,250,456,'end');

  /* ---------- información y cámara ---------- */
  var INFO={
    skin:{t:'Piel',p:'La piel es una barrera física que evita el ingreso de agentes patógenos que pueden ocasionar enfermedades. El sudor producido por la piel también contribuye a evitar la proliferación de patógenos.',c:[438,440,230]},
    muc:{t:'Membrana mucosa',p:'Las membranas mucosas son delgadas capas de células que recubren algunos conductos del cuerpo, por ejemplo, la boca, las vías genitales y las vías respiratorias. Las mucosas producen secreciones que dificultan el crecimiento y la proliferación de bacterias y virus. Por ejemplo, las mucosas de las fosas nasales producen moco que, además de atrapar partículas extrañas (como polvo o polen), impide el crecimiento de agentes patógenos.',c:[302,112,110]},
    mic:{t:'Microbiota',p:'La microbiota colabora en la producción de vitaminas y en la absorción de algunas sales minerales. Esta población de bacterias «beneficiosas para la salud» tiene un papel muy importante en la barrera de defensa primaria, pues evita que se reproduzcan bacterias patógenas o perjudiciales.',c:[302,440,170]}
  };
  var HOME=[300,452,930], cam=HOME.slice(), camT=HOME.slice();
  function select(k){
    selKey=(selKey===k)?null:k;
    gSkin.classList.toggle('hl',selKey==='skin'); gMuc.classList.toggle('hl',selKey==='muc'); gMic.classList.toggle('hl',selKey==='mic');
    if(selKey){ var I=INFO[selKey]; box.querySelector('#bph').textContent=I.t; box.querySelector('#bpp').textContent=I.p; card.hidden=false; hint.style.display='none'; camT=I.c.slice(); }
    else { card.hidden=true; hint.style.display=''; camT=HOME.slice(); }
    gLab.style.display=selKey?'none':'';
  }
  gSkin.onclick=function(e){ e.stopPropagation(); select('skin'); };
  gMuc.onclick=function(e){ e.stopPropagation(); select('muc'); };
  gMic.onclick=function(e){ e.stopPropagation(); select('mic'); };
  svg.onclick=function(){ if(selKey) select(selKey); };
  box.querySelector('#bpx').onclick=box.querySelector('#bpback').onclick=function(){ if(selKey) select(selKey); };
  function onKey(e){ if(e.key==='Escape'&&selKey) select(selKey); }
  document.addEventListener('keydown',onKey);

  /* ---------- microorganismos ---------- */
  var X0=-140,X1=740,Y0=-40,Y1=940;
  var gP=sv('g',{'pointer-events':'none'},svg), gF=sv('g',{'pointer-events':'none'},svg), ps=[], fx=[], NP=100, NR=22, speed=1, paused=false, tClock=0;
  function place(p,mode){
    var a=Math.random()*6.283;
    if(mode==='res'){ var k=RESID[Math.floor(Math.random()*RESID.length)]; p.x=GX0+(k%NX)*RES; p.y=GY0+Math.floor(k/NX)*RES; }
    else if(mode==='near'||(mode==='edge'&&Math.random()<.25)){ p.x=360+Math.random()*200; p.y=30+Math.random()*170; a=Math.PI+(Math.random()-.5)*1.4; }
    else { var e=Math.floor(Math.random()*4); p.x=e===0?X0:e===1?X1:X0+Math.random()*(X1-X0); p.y=e===2?Y0:e===3?Y1:Y0+Math.random()*(Y1-Y0); a=Math.atan2(450-p.y,300-p.x)+(Math.random()-.5)*1.4; }
    p.vx=Math.cos(a)*30; p.vy=Math.sin(a)*30; p.cd=0; p.res=(mode==='res');
  }
  function mk(mode){ var p={el:sv('circle',{r:2.3,'class':'mb'},gP)}; place(p,mode); ps.push(p); return p; }
  function build(){ gP.innerHTML=''; ps=[]; for(var j=0;j<NP;j++) mk(j<NP*.3?'near':'edge'); for(var r=0;r<NR;r++) mk('res'); }
  function setN(n){ NP=n; var c=ps.filter(function(p){return !p.res;});
    while(c.length>NP){ var p=c.pop(); gP.removeChild(p.el); ps.splice(ps.indexOf(p),1); } while(c.length<NP) c.push(mk('edge')); }
  build();
  function inhale(){ var ph=(tClock%5)/5; return ph<.6?Math.sin(Math.PI*ph/.6):0; }
  var rP=1.1;
  function stepP(p,dt){
    var k=cell(p.x,p.y), rg=k>=0?reg[k]:0, inb=k>=0&&bd[k*4+3]>127, base=30, noise=80, ax=0, ay=0, f=null, s;
    if(rg&&rg!==5&&inb){ f=flow(k); noise=60;
      if(rg===1||rg===2){ base=42; if(f){ ax=f[0]*130; ay=f[1]*130; } }
      else if(rg===3){ base=24; if(f){ ax=f[0]*45; ay=f[1]*45; } }
      else base=15;
    } else if(rg===5){ s=inhale(); f=flow(k); base=30+50*s; if(f&&s>0){ ax=-f[0]*420*s; ay=-f[1]*420*s; } }
    else { s=inhale(); if(s>0){ var dx=520-p.x,dy=70-p.y,d=Math.hypot(dx,dy); if(d<220){ var kk=160*s*(1-d/200)/Math.max(d,1); ax=dx*kk; ay=dy*kk; } } }
    p.vx+=(ax+(Math.random()-.5)*2*noise)*dt; p.vy+=(ay+(Math.random()-.5)*2*noise)*dt;
    var sp=Math.hypot(p.vx,p.vy);
    if(sp<1){ var a=Math.random()*6.283; p.vx=Math.cos(a)*base; p.vy=Math.sin(a)*base; }
    else { var m=1+(base-sp)/sp*Math.min(1,dt*2); p.vx*=m; p.vy*=m; }
    var nx=p.x+p.vx*dt, ny=p.y+p.vy*dt;
    if(G(nx,ny)<rP){ var n=nrm(nx,ny), dn=p.vx*n[0]+p.vy*n[1]; if(dn<0){ p.vx-=2*dn*n[0]; p.vy-=2*dn*n[1]; }
      if(!inb&&p.cd<=0){ p.cd=.45; fx.push({t:0,el:sv('circle',{cx:p.x.toFixed(1),cy:p.y.toFixed(1),r:2.5,'class':'fx'},gF)}); } }
    else { p.x=nx; p.y=ny; }
    if(G(p.x,p.y)<rP-.3){ var mm=nrm(p.x,p.y); p.x+=mm[0]*.6; p.y+=mm[1]*.6; }
    p.cd-=dt;
    if(!inb&&(p.x<X0-60||p.x>X1+60||p.y<Y0-60||p.y>Y1+60)) place(p,'edge');
  }
  box._dbg=function(){ var bad=0,inside=0; ps.forEach(function(p){ var k=cell(p.x,p.y); if(k>=0&&bd[k*4+3]>127){ inside++; if(!reg[k]) bad++; } }); var fn=0,geo=0; ps.forEach(function(p){ var k=cell(p.x,p.y); if(k>=0&&reg[k]===5){ fn++; if(GEO[k]>=0) geo++; } }); return {bad:bad,inBody:inside,total:ps.length,fn:fn,fnGeo:geo,seedReg:reg[seed],reach:qt}; };

  /* ---------- controles ---------- */
  var nI=box.querySelector('#bpN'), nO=box.querySelector('#bpNo');
  nI.oninput=function(){ nO.textContent=nI.value; setN(+nI.value); };
  box.querySelector('#bpS').oninput=function(e){ speed=+e.target.value; };
  var pb=box.querySelector('#bpP'); pb.onclick=function(){ paused=!paused; pb.textContent=paused?'Reanudar':'Pausar'; };
  box.querySelector('#bpR').onclick=function(){ NP=+nI.value; build(); paused=false; pb.textContent='Pausar'; };

  /* ---------- bucle ---------- */
  var raf, last=performance.now();
  function loop(now){
    raf=requestAnimationFrame(loop);
    var dt=Math.min((now-last)/1000,.05); last=now;
    var sw=stage.clientWidth||900, sh=stage.clientHeight||700, kk=Math.min(1,dt*4.5);
    for(var c=0;c<3;c++) cam[c]+=(camT[c]-cam[c])*kk;
    var vh=cam[2], vw=vh*sw/sh, fx0=.5, fy0=.5; if(selKey){ if(sw>=820) fx0=(sw-380)/2/sw; else fy0=.3; }
    svg.setAttribute('viewBox',(cam[0]-fx0*vw).toFixed(1)+' '+(cam[1]-fy0*vh).toFixed(1)+' '+vw.toFixed(1)+' '+vh.toFixed(1));
    gAir.setAttribute('opacity',(.25+.75*inhale()).toFixed(2));
    if(!paused){
      tClock+=dt; var h=dt*speed/2;
      for(var j=0;j<ps.length;j++){ stepP(ps[j],h); stepP(ps[j],h); }
      for(var q2=0;q2<ps.length;q2++){ ps[q2].el.setAttribute('cx',ps[q2].x.toFixed(1)); ps[q2].el.setAttribute('cy',ps[q2].y.toFixed(1)); }
      for(var z=fx.length-1;z>=0;z--){ var e=fx[z]; e.t+=dt; if(e.t>.45){ gF.removeChild(e.el); fx.splice(z,1); } else { e.el.setAttribute('r',(2.5+7*e.t/.45).toFixed(1)); e.el.setAttribute('opacity',(1-e.t/.45).toFixed(2)); } }
    }
  }
  select(null);
  raf=requestAnimationFrame(loop);
  return function stop(){ cancelAnimationFrame(raf); document.removeEventListener('keydown',onKey); };
}
