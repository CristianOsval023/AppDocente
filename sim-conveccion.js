'use strict';
/* Simulador: convección del calor */
/* ====== SIMULADOR: Convección del calor ====== */
function cvShell(sideHtml){
  return '<div class="fc-wrap"><div class="fc-main"><div class="fc-scene"><svg id="cvS" viewBox="0 20 800 400" role="img" aria-label="Recipiente con un fluido calentado desde abajo: el fluido caliente sube, el frío baja y se forma una corriente"></svg></div><p class="fc-status" aria-live="polite"></p><div class="fc-graph"><svg id="cvG" viewBox="0 0 800 200" role="img" aria-label="Gráfico de la temperatura del fluido arriba y abajo en el tiempo"></svg></div></div><aside class="fc-side">'+sideHtml+'</aside></div>';
}
function conveccionCalor(box){
  box.innerHTML=cvShell(    '<div class="fc-box"><h4>Calentador y hielo</h4>'+SL('cvPos','Posición del calentador',[['L','Izquierda'],['C','Centro'],['R','Derecha']],'L')+RG('cvT','Temperatura del calentador',20,100,5,80,' °C')+CK('cvIce','Hielo en la superficie',false)+'</div>'+
    '<div class="fc-box"><h4>Fluido</h4>'+SL('cvF','Tipo de fluido',[['agua','Agua'],['aceite','Aceite (más viscoso)']],'agua')+RG('cvV','Velocidad',.5,3,.5,1,'×')+CK('cvAr','Mostrar flechas de la corriente',false)+'</div>'+
    '<div class="fc-btns"><button class="btn2 fc-go" id="cvH">Apagar calentador</button><button class="btn2" id="cvR">Reiniciar</button></div>');
  var svg=box.querySelector('#cvS'), msg=box.querySelector('.fc-status');
  var CX=160, CY=46, CW=480, CH=300, NP=260, PI=Math.PI;
  var st={heat:true,Th:80,pos:'L',ice:false,visc:1,sp:1,arrows:false};
  var defs=SV('defs',{},svg), lg=SV('linearGradient',{id:'cvLg',x1:0,x2:1,y1:0,y2:0},defs);
  [[0,'#1c7ed6'],[.25,'#74c0fc'],[.5,'#ffd43b'],[.75,'#ff922b'],[1,'#e03131']].forEach(function(s){ SV('stop',{offset:s[0],'stop-color':s[1]},lg); });
  SV('rect',{x:CX,y:CY,width:CW,height:CH,rx:6,'class':'cv-water'},svg);
  var iceG=SV('g',{},svg), flameG=SV('g',{},svg), plate=SV('rect',{height:12,rx:4},svg);
  var plateLab=SV('text',{'text-anchor':'middle','class':'fc-note'},svg); plateLab.textContent='Calentador';
  var pg=SV('g',{},svg), arG=SV('g',{},svg);
  SV('rect',{x:CX,y:CY,width:CW,height:CH,rx:6,fill:'none',stroke:'var(--muted)','stroke-width':4},svg);
  var ar=[]; for(var gx=0;gx<9;gx++) for(var gy=0;gy<5;gy++) ar.push({x:(gx+.5)/9,y:(gy+.5)/5,el:SV('line',{stroke:'var(--ink)','stroke-width':2.2,'marker-end':'url(#cvAh)',opacity:.7},arG)});
  var mk=SV('marker',{id:'cvAh',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'},defs); SV('path',{d:'M0 0 L10 5 L0 10 Z',fill:'var(--ink)'},mk);
  SV('rect',{x:440,y:394,width:200,height:10,rx:3,fill:'url(#cvLg)'},svg);
  SV('text',{x:440,y:420,'class':'fc-ax'},svg).textContent='frío'; SV('text',{x:640,y:420,'text-anchor':'end','class':'fc-ax'},svg).textContent='caliente'; SV('text',{x:540,y:420,'text-anchor':'middle','class':'fc-ax'},svg).textContent='Temperatura';
  var ps=[]; for(var n=0;n<NP;n++) ps.push({x:Math.random(),y:Math.random(),T:TAMB0(),el:SV('circle',{r:4.2,opacity:.9},pg)});
  function TAMB0(){ return 20; }
  /* termómetro y gráfico (mismo formato que el resto de los simuladores de calor) */
  var gS=box.querySelector('#cvG'), TX=715, TT=70, TH=250, thG=SV('g',{},svg);
  SV('rect',{x:TX-7,y:TT,width:14,height:TH+4,rx:7,'class':'fc-tube'},thG); SV('circle',{cx:TX,cy:TT+TH+22,r:13,'class':'fc-bulb'},thG);
  var liq=SV('rect',{x:TX-3,width:6,rx:3,'class':'fc-liq'},thG), tval=SV('text',{x:TX,y:TT-14,'text-anchor':'middle','class':'fc-tval'},thG);
  SV('text',{x:TX,y:TT+TH+52,'text-anchor':'middle','class':'fc-note'},thG).textContent='Temperatura media';
  var hist=[],tsim=0,gAcc=0;
  function drawG(){
    gS.innerHTML=''; var GX=60,GY=14,GW=715,GH=125,tmax=Math.max(60,Math.ceil(tsim/30)*30);
    for(var v=0;v<=100;v+=25){ var y=GY+GH-GH*v/100; SV('line',{x1:GX,x2:GX+GW,y1:y,y2:y,'class':'fc-grid'},gS); SV('text',{x:GX-8,y:y+4,'text-anchor':'end','class':'fc-ax'},gS).textContent=v; }
    for(var t=0;t<=tmax;t+=tmax/6) SV('text',{x:GX+GW*t/tmax,y:GY+GH+15,'text-anchor':'middle','class':'fc-ax'},gS).textContent=Math.round(t);
    SV('text',{x:GX+GW/2,y:GY+GH+34,'text-anchor':'middle','class':'fc-axt'},gS).textContent='Tiempo (segundos)';
    SV('text',{x:14,y:GY+GH/2,'text-anchor':'middle','class':'fc-axt',transform:'rotate(-90 14 '+(GY+GH/2)+')'},gS).textContent='Temperatura (°C)';
    SV('line',{x1:GX,x2:GX,y1:GY,y2:GY+GH,'class':'fc-axl'},gS); SV('line',{x1:GX,x2:GX+GW,y1:GY+GH,y2:GY+GH,'class':'fc-axl'},gS);
    [1,2].forEach(function(c){ var d=hist.map(function(q,i){ return (i?'L':'M')+(GX+GW*q[0]/tmax).toFixed(1)+' '+(GY+GH-GH*Math.max(0,Math.min(100,q[c]))/100).toFixed(1); }).join(' '); if(d) SV('path',{d:d,'class':c===1?'fc-la':'fc-lb'},gS); });
    var lg=SV('g',{transform:'translate('+(GX+12)+','+(GY+10)+')'},gS); SV('line',{x1:0,x2:18,y1:0,y2:0,'class':'fc-la'},lg); SV('text',{x:24,y:4,'class':'fc-ax'},lg).textContent='Mitad superior del fluido';
    SV('line',{x1:190,x2:208,y1:0,y2:0,'class':'fc-lb'},lg); SV('text',{x:214,y:4,'class':'fc-ax'},lg).textContent='Mitad inferior del fluido';
  }
  function xc(){ return st.pos==='L'?.2:st.pos==='C'?.5:.8; }
  function iceZones(){ return st.pos==='L'?[[.62,.95]]:st.pos==='R'?[[.05,.38]]:[[.05,.3],[.7,.95]]; }
  function layout(){
    var X=CX+xc()*CW; plate.setAttribute('x',X-80); plate.setAttribute('y',CY+CH+4); plate.setAttribute('width',160); plateLab.setAttribute('x',X); plateLab.setAttribute('y',CY+CH+68);
    flameG.innerHTML=''; for(var f=-2;f<=2;f++){ var fx=X+f*28; SV('path',{d:'M'+fx+' '+(CY+CH+46)+' C'+(fx-12)+' '+(CY+CH+36)+' '+(fx-3)+' '+(CY+CH+30)+' '+fx+' '+(CY+CH+18)+' C'+(fx+3)+' '+(CY+CH+30)+' '+(fx+12)+' '+(CY+CH+36)+' '+fx+' '+(CY+CH+46)+' Z',fill:'#ff922b'},flameG); }
    iceG.innerHTML=''; iceZones().forEach(function(z){ var w=(z[1]-z[0])*CW, n3=3; for(var c=0;c<n3;c++){ SV('rect',{x:CX+z[0]*CW+c*w/n3+2,y:CY+3+(c%2)*4,width:w/n3-6,height:24,rx:4,fill:'#d0ebff',stroke:'#fff','stroke-width':2,opacity:.95},iceG); } });
  }
  function field(x,y,A){ /* corriente prescrita: sube donde está el calentador y baja en el lado frío */
    var u,v;
    if(st.pos==='C'){ v=-Math.cos(2*PI*x)*Math.sin(PI*y); u=.5*Math.cos(PI*y)*Math.sin(2*PI*x); return [A*u,A*v]; }
    var xx=st.pos==='L'?x:1-x; u=-Math.sin(PI*xx)*Math.cos(PI*y); v=Math.cos(PI*xx)*Math.sin(PI*y); if(st.pos==='R') u=-u; return [A*u,A*v];
  }
  function strength(){ var heat=st.heat?Math.max(0,st.Th-20)/80:0, cool=st.ice?.5:0; return Math.min(1.2,heat+cool)*st.visc*st.sp*.32; }
  function reset(){ ps.forEach(function(p){ p.x=Math.random(); p.y=Math.random(); p.T=20; }); hist=[[0,20,20]]; tsim=0; drawG(); }
  var raf,last=performance.now();
  function loop(now){
    raf=requestAnimationFrame(loop); var dt=Math.min((now-last)/1000,.05); last=now;
    var A=strength(), xh=xc(), iz=iceZones();
    plate.setAttribute('fill',st.heat?ramp((st.Th-20)/80,[[0,'#adb5bd'],[.4,'#fab005'],[.75,'#f76707'],[1,'#e03131']]):'#adb5bd'); flameG.setAttribute('opacity',st.heat?Math.min(1,(st.Th-20)/60):0);
    ps.forEach(function(p){
      var v=field(p.x,p.y,A);
      p.x+=v[0]*dt+(Math.random()-.5)*.004; p.y+=v[1]*dt+(Math.random()-.5)*.004;
      if(p.x<.01){ p.x=.01; } if(p.x>.99){ p.x=.99; } if(p.y<.012){ p.y=.012; } if(p.y>.988){ p.y=.988; }
      if(st.heat && p.y<.12 && Math.abs(p.x-xh)<.17) p.T+=(st.Th-p.T)*Math.min(1,3*dt);
      if(st.ice && p.y>.88){ for(var z=0;z<iz.length;z++) if(p.x>iz[z][0]&&p.x<iz[z][1]) p.T+=(0-p.T)*Math.min(1,3*dt); }
      p.T+=(20-p.T)*.06*dt;
      p.el.setAttribute('cx',(CX+p.x*CW).toFixed(1)); p.el.setAttribute('cy',(CY+(1-p.y)*CH).toFixed(1)); p.el.setAttribute('fill',ramp(p.T/100,FLU));
    });
    tsim+=dt*st.sp; gAcc+=dt;
    var su=0,nu=0,sd=0,nd=0; ps.forEach(function(p){ if(p.y>.5){ su+=p.T; nu++; } else { sd+=p.T; nd++; } });
    var tu=nu?su/nu:20, td=nd?sd/nd:20, tm=(tu+td)/2;
    if(gAcc>.5){ gAcc=0; hist.push([tsim,tu,td]); drawG(); }
    var lh=TH*Math.max(0,Math.min(100,tm))/100; liq.setAttribute('y',TT+TH-lh+4); liq.setAttribute('height',lh+18); tval.textContent=fnum(tm,1)+' °C';
    arG.setAttribute('display',st.arrows?'':'none');
    if(st.arrows) ar.forEach(function(a){ var v=field(a.x,a.y,1), px=CX+a.x*CW, py=CY+(1-a.y)*CH, m=Math.hypot(v[0],v[1]), s=A>0.001?Math.min(1,A/.3)*34:0;
      a.el.setAttribute('x1',px-v[0]*s*.5); a.el.setAttribute('y1',py+v[1]*s*.5); a.el.setAttribute('x2',px+v[0]*s*.5); a.el.setAttribute('y2',py-v[1]*s*.5); a.el.setAttribute('opacity',m*s>3?.75:0); });
    if(A<.02) msg.textContent='No hay diferencia de temperatura: el fluido casi no se mueve. Enciende el calentador o agrega hielo.';
    else msg.textContent=(st.heat&&st.Th>20?'El fluido junto al calentador se calienta, se expande y pesa menos: sube. ':'')+(st.ice?'Junto al hielo se enfría, pesa más y baja. ':'Arriba se enfría y vuelve a bajar. ')+'Así se forma una corriente de convección.';
  }
  var hBtn=box.querySelector('#cvH');
  bindRg(box,'cvT',function(v){ st.Th=v; }); bindRg(box,'cvV',function(v){ st.sp=v; });
  box.querySelector('#cvPos').onchange=function(e){ st.pos=e.target.value; layout(); };
  box.querySelector('#cvIce').onchange=function(e){ st.ice=e.target.checked; iceG.setAttribute('display',st.ice?'':'none'); };
  box.querySelector('#cvF').onchange=function(e){ st.visc=e.target.value==='agua'?1:.5; };
  box.querySelector('#cvAr').onchange=function(e){ st.arrows=e.target.checked; };
  hBtn.onclick=function(){ st.heat=!st.heat; hBtn.textContent=st.heat?'Apagar calentador':'Encender calentador'; };
  box.querySelector('#cvR').onclick=reset;
  iceG.setAttribute('display','none'); layout(); reset(); raf=requestAnimationFrame(loop);
  return function stop(){ cancelAnimationFrame(raf); };
}

