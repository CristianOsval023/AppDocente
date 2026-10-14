'use strict';
/* Simulador: radiación del calor */
/* ====== SIMULADOR: Radiación del calor ====== */
function radiacionCalor(box){
  var SURF=[['negro','Negra mate'],['blanco','Blanca'],['plata','Plateada brillante']];
  box.innerHTML=simShell('rdS','0 0 800 470','Una lámpara emite radiación hacia dos latas de distinta superficie; se compara cómo sube la temperatura de cada una',
    '<div class="fc-box"><h4>Lámpara</h4>'+RG('rdP','Potencia',100,800,50,500,' W')+RG('rdD','Distancia a las latas',30,100,5,40,' cm')+'</div>'+
    '<div class="fc-box"><h4>Latas</h4>'+SL('rdA','Superficie de la lata A',SURF,'negro')+SL('rdB','Superficie de la lata B',SURF,'blanco')+CK('rdVac','Sacar el aire (vacío)',false)+RG('rdV','Velocidad',1,8,1,3,'×')+'</div>'+
    '<div class="fc-btns"><button class="btn2 fc-go" id="rdGo">Apagar lámpara</button><button class="btn2" id="rdR">Reiniciar</button></div>');
  var svg=box.querySelector('#rdS'), msg=box.querySelector('.fc-status');
  var ABS={negro:.95,blanco:.25,plata:.1}, NAME={negro:'negra',blanco:'blanca',plata:'plateada'};
  var LX=88, LY=150, CANW=84, CANH=80, YA=56, YB=190, TAMB=20;
  var st={on:true,P:500,d:40,sa:'negro',sb:'blanco',vac:false,sp:3,t:0,TA:TAMB,TB:TAMB,hist:[]};
  var defs=SV('defs',{},svg), gl=SV('radialGradient',{id:'rdGl'},defs); SV('stop',{offset:0,'stop-color':'#fff3bf'},gl); SV('stop',{offset:1,'stop-color':'#fab005','stop-opacity':0},gl);
  var sg=SV('linearGradient',{id:'rdSil',x1:0,x2:1,y1:0,y2:0},defs); [[0,'#adb5bd'],[.3,'#f1f3f5'],[.5,'#ced4da'],[.8,'#ffffff'],[1,'#868e96']].forEach(function(s){ SV('stop',{offset:s[0],'stop-color':s[1]},sg); });
  var air=SV('g',{},svg), airD=[]; for(var a=0;a<80;a++) airD.push({x:130+Math.random()*650,y:12+Math.random()*290,el:SV('circle',{r:2,fill:'#74c0fc',opacity:.35},air)});
  var vacLab=SV('text',{x:450,y:300,'text-anchor':'middle','class':'fc-eqlab'},svg); vacLab.textContent='';
  SV('rect',{x:20,y:296,width:760,height:6,rx:3,'class':'fc-table'},svg);
  /* lámpara */
  var halo=SV('circle',{cx:LX-6,cy:LY,fill:'url(#rdGl)'},svg);
  SV('rect',{x:24,y:128,width:44,height:44,rx:6,fill:'#495057'},svg); SV('path',{d:'M68 122 L92 108 L92 192 L68 178 Z',fill:'#868e96'},svg);
  var bulb=SV('circle',{cx:LX-8,cy:LY,r:13,fill:'#ffd43b',stroke:'#e67700','stroke-width':2},svg); SV('text',{x:48,y:200,'text-anchor':'middle','class':'fc-note'},svg).textContent='Lámpara';
  /* latas */
  function can(y,lbl){
    var g=SV('g',{},svg), body=SV('rect',{y:y,width:CANW,height:CANH,rx:8,stroke:'#495057','stroke-width':2},g), glow=SV('rect',{y:y,width:CANW,height:CANH,rx:8,fill:'#ff6b00',opacity:0},g);
    var l=SV('text',{y:y+CANH/2+6,'text-anchor':'middle','class':'fc-olab'},g); l.textContent=lbl;
    var th=SV('g',{},svg), tube=SV('rect',{width:12,height:CANH+4,rx:6,'class':'fc-tube'},th), liq=SV('rect',{width:5,rx:2.5,'class':'fc-liq'},th), bulbT=SV('circle',{r:9,'class':'fc-bulb'},th), tt=SV('text',{'text-anchor':'middle','class':'fc-tval'},th), sh=SV('rect',{y:y+CANH,height:5,rx:2,'class':'fc-table'},svg);
    return {g:g,body:body,glow:glow,lab:l,tube:tube,liq:liq,bulb:bulbT,tt:tt,sh:sh,y:y};
  }
  var CA=can(YA,'A'), CB=can(YB,'B');
  function setSurf(c,s){ c.body.setAttribute('fill',s==='negro'?'#212529':s==='blanco'?'#f8f9fa':'url(#rdSil)'); c.lab.style.fill=(s==='negro'?'#f1f3f5':'#212529'); }
  function xcan(){ return 230+(st.d-30)*5.5; }
  function place(){
    var x=xcan(); [CA,CB].forEach(function(c,k){ c.body.setAttribute('x',x); c.glow.setAttribute('x',x); c.lab.setAttribute('x',x+CANW/2); c.sh.setAttribute('x',x-8); c.sh.setAttribute('width',CANW+16);
      var tx=x+CANW+24; c.tube.setAttribute('x',tx-6); c.tube.setAttribute('y',c.y-2); c.bulb.setAttribute('cx',tx); c.bulb.setAttribute('cy',c.y+CANH+8); c.liq.setAttribute('x',tx-2.5); c.tt.setAttribute('x',tx); c.tt.setAttribute('y',c.y-10); });
  }
  function therm(c,T){ var h=Math.max(2,CANH*Math.min(1,(T-TAMB+8)/110)); c.liq.setAttribute('y',c.y+CANH+4-h); c.liq.setAttribute('height',h+4); c.tt.textContent=fnum(T,1)+' °C'; c.glow.setAttribute('opacity',Math.min(.5,Math.max(0,(T-TAMB)/90*.5)).toFixed(2)); }
  /* gráfico */
  var GX=90, GY=332, GW=640, GH=86, YMAX=120;
  var gG=SV('g',{},svg);
  function graph(){
    gG.innerHTML=''; var tmax=Math.max(60,Math.ceil(st.t/30)*30);
    for(var v=0;v<=YMAX;v+=40){ var y=GY+GH-GH*v/YMAX; SV('line',{x1:GX,x2:GX+GW,y1:y,y2:y,'class':'fc-grid'},gG); SV('text',{x:GX-8,y:y+4,'text-anchor':'end','class':'fc-ax'},gG).textContent=v; }
    for(var t=0;t<=tmax;t+=tmax/6) SV('text',{x:GX+GW*t/tmax,y:GY+GH+15,'text-anchor':'middle','class':'fc-ax'},gG).textContent=Math.round(t);
    SV('text',{x:GX+GW/2,y:GY+GH+34,'text-anchor':'middle','class':'fc-axt'},gG).textContent='Tiempo (segundos)';
    SV('text',{x:20,y:GY+GH/2,'text-anchor':'middle','class':'fc-axt',transform:'rotate(-90 20 '+(GY+GH/2)+')'},gG).textContent='Temperatura (°C)';
    SV('line',{x1:GX,x2:GX,y1:GY,y2:GY+GH,'class':'fc-axl'},gG); SV('line',{x1:GX,x2:GX+GW,y1:GY+GH,y2:GY+GH,'class':'fc-axl'},gG);
    [1,2].forEach(function(c){ var d=st.hist.map(function(h,i){ return (i?'L':'M')+(GX+GW*h[0]/tmax).toFixed(1)+' '+(GY+GH-GH*Math.min(YMAX,h[c])/YMAX).toFixed(1); }).join(' '); if(d) SV('path',{d:d,'class':c===1?'fc-la':'fc-lb'},gG); });
    var lg=SV('g',{transform:'translate('+(GX+12)+','+(GY+8)+')'},gG); SV('line',{x1:0,x2:18,y1:0,y2:0,'class':'fc-la'},lg); SV('text',{x:24,y:4,'class':'fc-ax'},lg).textContent='Lata A ('+NAME[st.sa]+')';
    SV('line',{x1:150,x2:168,y1:0,y2:0,'class':'fc-lb'},lg); SV('text',{x:174,y:4,'class':'fc-ax'},lg).textContent='Lata B ('+NAME[st.sb]+')';
  }
  function reset(){ st.sa=box.querySelector('#rdA').value; st.sb=box.querySelector('#rdB').value; st.t=0; st.TA=st.TB=TAMB; st.hist=[[0,TAMB,TAMB]]; setSurf(CA,st.sa); setSurf(CB,st.sb); photons.forEach(function(p){ p.el.remove(); }); photons=[]; graph(); }
  var photons=[], acc=0, gAcc=0, spawnA=0, spawnB=0;
  function rate(){ return st.on?Math.min(70,4+34*(st.P/500)*Math.pow(40/st.d,2)):0; }
  function loop(now){
    raf=requestAnimationFrame(loop); var dt=Math.min((now-last)/1000,.05); last=now;
    var x=xcan(), h=dt*st.sp;
    if(st.on){ var I=(st.P/500)*Math.pow(40/st.d,2); var sub=Math.ceil(h/.5), hh=h/sub;
      for(var s=0;s<sub;s++){ st.TA+=(.9*I*ABS[st.sa]-.03*(st.TA-TAMB))*hh; st.TB+=(.9*I*ABS[st.sb]-.03*(st.TB-TAMB))*hh; } st.t+=h; }
    else { var sub2=Math.ceil(h/.5), h2=h/sub2; for(var s2=0;s2<sub2;s2++){ st.TA-=.03*(st.TA-TAMB)*h2; st.TB-=.03*(st.TB-TAMB)*h2; } }
    gAcc+=h; if(gAcc>.5){ gAcc=0; if(st.on||st.t>0){ if(st.on) st.hist.push([st.t,st.TA,st.TB]); graph(); } }
    /* fotones */
    var r=rate(); spawnA+=r*dt; spawnB+=r*dt;
    [[CA,'A'],[CB,'B']].forEach(function(cc,k){ var sp=k?spawnB:spawnA; while(sp>=1){ sp--; var ty=cc[0].y+8+Math.random()*(CANH-16), dx=x-LX, dy=ty-LY, L=Math.hypot(dx,dy), v=330;
        photons.push({x:LX,y:LY+(Math.random()-.5)*14,vx:dx/L*v,vy:(dy+ (Math.random()-.5)*14)/L*v,can:k,refl:false,t:0,el:SV('circle',{r:3,fill:'#fab005'},svg)}); }
      if(k) spawnB=sp; else spawnA=sp; });
    for(var i=photons.length-1;i>=0;i--){ var p=photons[i]; p.x+=p.vx*dt; p.y+=p.vy*dt; p.t+=dt;
      if(!p.refl && p.x>=x){ var sf=p.can?st.sb:st.sa; if(Math.random()<ABS[sf]){ p.el.remove(); photons.splice(i,1); continue; } p.refl=true; p.t=0; p.vx=-p.vx*.55; p.vy=(Math.random()-.5)*260; p.el.setAttribute('fill','#f1f3f5'); p.el.setAttribute('stroke','#adb5bd'); p.x=x-1; }
      if(p.refl && p.t>.9 || p.y<5 || p.y>300 || p.x<LX-5){ p.el.remove(); photons.splice(i,1); continue; }
      p.el.setAttribute('cx',p.x.toFixed(1)); p.el.setAttribute('cy',p.y.toFixed(1)); p.el.setAttribute('opacity',p.refl?(1-p.t/.9).toFixed(2):1); }
    halo.setAttribute('r',st.on?26+st.P/18:0); bulb.setAttribute('fill',st.on?'#ffd43b':'#adb5bd');
    air.setAttribute('display',st.vac?'none':''); airD.forEach(function(q){ q.x+=(Math.random()-.5)*2.4; q.y+=(Math.random()-.5)*2.4; q.x=Math.max(130,Math.min(780,q.x)); q.y=Math.max(12,Math.min(290,q.y)); q.el.setAttribute('cx',q.x.toFixed(1)); q.el.setAttribute('cy',q.y.toFixed(1)); });
    vacLab.textContent=st.vac?'Vacío: no hay aire, pero la radiación llega igual':'';
    therm(CA,st.TA); therm(CB,st.TB);
    var dT=st.TA-st.TB;
    if(!st.on && st.t===0) msg.textContent='La lámpara está apagada: no llega radiación a las latas.';
    else if(st.t<4) msg.textContent='La lámpara emite radiación (luz e infrarrojo) que viaja hasta las latas, incluso por el vacío. Observa cuál se calienta más.';
    else if(st.sa===st.sb) msg.textContent='Las dos latas tienen la misma superficie: absorben igual y se calientan igual. Cambia la superficie de una.';
    else msg.textContent='La lata '+(dT>0?'A ('+NAME[st.sa]+')':'B ('+NAME[st.sb]+')')+' está '+fnum(Math.abs(dT),1)+' °C más caliente: absorbe más radiación y refleja menos.';
  }
  var raf,last=performance.now(), goBtn=box.querySelector('#rdGo');
  bindRg(box,'rdP',function(v){ st.P=v; }); bindRg(box,'rdD',function(v){ st.d=v; place(); }); bindRg(box,'rdV',function(v){ st.sp=v; });
  box.querySelector('#rdA').onchange=reset; box.querySelector('#rdB').onchange=reset;
  box.querySelector('#rdVac').onchange=function(e){ st.vac=e.target.checked; };
  goBtn.onclick=function(){ st.on=!st.on; goBtn.textContent=st.on?'Apagar lámpara':'Encender lámpara'; };
  box.querySelector('#rdR').onclick=reset;
  place(); reset(); raf=requestAnimationFrame(loop);
  return function stop(){ cancelAnimationFrame(raf); };
}

