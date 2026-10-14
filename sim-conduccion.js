'use strict';
/* Simulador: conducción del calor */
/* ====== SIMULADOR: Conducción del calor (dos objetos en contacto) ====== */
function flujoCalor(box){
  var NS='http://www.w3.org/2000/svg';
  function sv(tag,a,p){ var e=document.createElementNS(NS,tag); for(var k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e; }
  box.innerHTML=
   '<div class="fc-wrap">'+
    '<div class="fc-main">'+
     '<div class="fc-scene"><svg id="fcS" viewBox="0 75 800 280" role="img" aria-label="Dos objetos en contacto con sus termómetros; el calor pasa del más caliente al más frío por conducción"></svg></div>'+
     '<p class="fc-status" id="fcMsg" aria-live="polite"></p>'+
     '<div class="fc-graph"><svg id="fcG" viewBox="0 0 800 230" role="img" aria-label="Gráfico de temperatura de ambos objetos en el tiempo"></svg></div>'+
    '</div>'+
    '<aside class="fc-side">'+
     '<div class="fc-box"><h4><span class="fc-dot fa"></span>Objeto A</h4>'+
      '<label>Temperatura inicial <output id="fcTAo"></output><input type="range" id="fcTA" min="0" max="100" value="80"></label>'+
      '<label class="row">Tamaño <select id="fcMA"><option value="1">Pequeño</option><option value="2" selected>Mediano</option><option value="3">Grande</option></select></label></div>'+
     '<div class="fc-box"><h4><span class="fc-dot fb"></span>Objeto B</h4>'+
      '<label>Temperatura inicial <output id="fcTBo"></output><input type="range" id="fcTB" min="0" max="100" value="20"></label>'+
      '<label class="row">Tamaño <select id="fcMB"><option value="1">Pequeño</option><option value="2" selected>Mediano</option><option value="3">Grande</option></select></label></div>'+
     '<div class="fc-box"><label class="row">Material <select id="fcMat"><option value="metal">Metal (rápido)</option><option value="madera">Madera (lento)</option></select></label>'+
      '<label>Velocidad <input type="range" id="fcV" min="0.5" max="4" step="0.5" value="1"></label>'+
      '<label class="fc-pred row">Predicción: ¿temperatura final? <span><input type="number" id="fcP" min="0" max="100" step="1" placeholder="°C"> °C</span></label></div>'+
     '<div class="fc-btns"><button class="btn2 fc-go" id="fcGo">▶ Juntar objetos</button><button class="btn2" id="fcSep">Separar</button><button class="btn2" id="fcR">Reiniciar</button></div>'+
    '</aside>'+
   '</div>';
  var S=box.querySelector('#fcS'), Gs=box.querySelector('#fcG'), msg=box.querySelector('#fcMsg');
  var defs=sv('defs',{},S); var mk=sv('marker',{id:'fcArr',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'},defs); sv('path',{d:'M0 0 L10 5 L0 10 Z',fill:'#f08c00'},mk);
  var glow=sv('radialGradient',{id:'fcGlow'},defs); sv('stop',{offset:0,'stop-color':'#ffd43b'},glow); sv('stop',{offset:1,'stop-color':'#f08c00','stop-opacity':0},glow);
  sv('rect',{x:20,y:300,width:760,height:14,rx:3,'class':'fc-table'},S);
  sv('text',{x:400,y:340,'text-anchor':'middle','class':'fc-note'},S).textContent='Los objetos están aislados del ambiente: solo intercambian calor entre ellos.';
  var SIZES={1:110,2:140,3:170};
  function objG(name){
    var g=sv('g',{},S), r=sv('rect',{rx:10,'class':'fc-obj'},g), pg=sv('g',{},g), lab=sv('text',{'text-anchor':'middle','class':'fc-olab'},g);
    lab.textContent='Objeto '+name;
    var th=sv('g',{},S), tube=sv('rect',{width:14,height:150,rx:7,'class':'fc-tube'},th), bulb=sv('circle',{r:13,'class':'fc-bulb'},th), liq=sv('rect',{width:6,rx:3,'class':'fc-liq'},th), tt=sv('text',{'text-anchor':'middle','class':'fc-tval'},th);
    var ticks=sv('g',{'class':'fc-ticks'},th);
    for(var v=0;v<=100;v+=25){ sv('line',{x1:0,x2:6,y1:0,y2:0,'data-v':v},ticks); sv('text',{'data-v':v,'class':'fc-tick'},ticks).textContent=v; }
    return {g:g,r:r,pg:pg,lab:lab,th:th,tube:tube,bulb:bulb,liq:liq,tt:tt,ticks:ticks,parts:[],x:0};
  }
  var A=objG('A'), B=objG('B');
  var gFlow=sv('g',{},S), packs=[];
  var arrows=[]; for(var i=0;i<3;i++) arrows.push(sv('line',{'class':'fc-arrow','marker-end':'url(#fcArr)'},gFlow));
  var calLab=sv('text',{'text-anchor':'middle','class':'fc-cal'},gFlow); calLab.textContent='calor';
  var st={TA:80,TB:20,mA:2,mB:2,mat:'metal',speed:1,contact:false,run:false,t:0,eq:false,hist:[]};
  var KMAT={metal:.34,madera:.07};
  function tColor(T){ var a=[77,171,247],m=[241,243,245],h=[250,82,82],u=Math.max(0,Math.min(1,T/100)),c0,c1,f; if(u<.5){ c0=a;c1=m;f=u/.5; } else { c0=m;c1=h;f=(u-.5)/.5; }
    return 'rgb('+[0,1,2].map(function(k){ return Math.round(c0[k]+(c1[k]-c0[k])*f); }).join(',')+')'; }
  function layoutParts(o,m){ o.pg.innerHTML=''; o.parts=[]; var n=m+3; for(var y=0;y<n;y++) for(var x=0;x<n;x++) o.parts.push({u:(x+.5)/n,v:(y+.5)/n,el:sv('circle',{r:3.4,'class':'fc-part'},o.pg)}); }
  function reset(){
    st.TA=+box.querySelector('#fcTA').value; st.TB=+box.querySelector('#fcTB').value; st.mA=+box.querySelector('#fcMA').value; st.mB=+box.querySelector('#fcMB').value; st.mat=box.querySelector('#fcMat').value;
    st.T0A=st.TA; st.T0B=st.TB; st.t=0; st.eq=false; st.run=false; st.contact=false; st.hist=[[0,st.TA,st.TB]];
    layoutParts(A,st.mA); layoutParts(B,st.mB); packs.forEach(function(p){ p.el.remove(); }); packs=[];
    box.querySelector('#fcTAo').textContent=st.TA+' °C'; box.querySelector('#fcTBo').textContent=st.TB+' °C';
    goBtn.textContent='▶ Juntar objetos'; status(); drawGraph();
  }
  function teq(){ return (st.mA*st.T0A+st.mB*st.T0B)/(st.mA+st.mB); }
  function f1(x){ return x.toFixed(1).replace('.',','); }
  function status(){
    var d=st.TA-st.TB;
    if(!st.contact){ msg.textContent=st.t===0?'Los objetos están separados. Presiona «Juntar objetos»: el calor se transmitirá por conducción, de partícula en partícula, en la zona de contacto.':'Los objetos están separados: sin contacto no hay conducción de calor.'; msg.className='fc-status'; return; }
    if(st.eq){ var p=box.querySelector('#fcP').value, txt='¡Equilibrio térmico! Ambos objetos están a '+f1(st.TA)+' °C y el calor dejó de fluir.';
      if(p!==''){ var df=Math.abs(+p-st.TA); txt+=' Tu predicción fue '+p+' °C ('+(df<1.5?'¡muy cerca!':'diferencia de '+f1(df)+' °C')+').'; }
      msg.textContent=txt; msg.className='fc-status ok'; return; }
    if(Math.abs(d)<.05){ msg.textContent='Ambos objetos tienen la misma temperatura: no hay flujo de calor.'; msg.className='fc-status'; return; }
    var hot=d>0?'A':'B', cold=d>0?'B':'A';
    msg.textContent='Por conducción, el calor fluye del objeto '+hot+' ('+f1(Math.max(st.TA,st.TB))+' °C) al objeto '+cold+' ('+f1(Math.min(st.TA,st.TB))+' °C). '+(st.run?'':'(En pausa)');
    msg.className='fc-status';
  }
  var GX=60,GY=20,GW=710,GH=170;
  function drawGraph(){
    Gs.innerHTML='';
    var tmax=Math.max(20,Math.ceil(st.t/10)*10);
    for(var v=0;v<=100;v+=20){ var y=GY+GH-GH*v/100; sv('line',{x1:GX,x2:GX+GW,y1:y,y2:y,'class':'fc-grid'},Gs); sv('text',{x:GX-8,y:y+4,'text-anchor':'end','class':'fc-ax'},Gs).textContent=v; }
    for(var t=0;t<=tmax;t+=tmax/10){ var x=GX+GW*t/tmax; sv('text',{x:x,y:GY+GH+18,'text-anchor':'middle','class':'fc-ax'},Gs).textContent=Math.round(t); }
    sv('text',{x:GX+GW/2,y:GY+GH+36,'text-anchor':'middle','class':'fc-axt'},Gs).textContent='Tiempo (minutos)';
    sv('text',{x:16,y:GY+GH/2,'text-anchor':'middle','class':'fc-axt',transform:'rotate(-90 16 '+(GY+GH/2)+')'},Gs).textContent='Temperatura (°C)';
    sv('line',{x1:GX,x2:GX,y1:GY,y2:GY+GH,'class':'fc-axl'},Gs); sv('line',{x1:GX,x2:GX+GW,y1:GY+GH,y2:GY+GH,'class':'fc-axl'},Gs);
    if(st.eq){ var ye=GY+GH-GH*st.TA/100; sv('line',{x1:GX,x2:GX+GW,y1:ye,y2:ye,'class':'fc-eqline'},Gs); sv('text',{x:GX+GW-4,y:ye-6,'text-anchor':'end','class':'fc-eqlab'},Gs).textContent='Equilibrio: '+f1(st.TA)+' °C'; }
    [1,2].forEach(function(c){ var d=st.hist.map(function(h,i){ return (i?'L':'M')+(GX+GW*h[0]/tmax).toFixed(1)+' '+(GY+GH-GH*h[c]/100).toFixed(1); }).join(' ');
      sv('path',{d:d,'class':c===1?'fc-la':'fc-lb'},Gs); });
    var lg=sv('g',{transform:'translate('+(GX+12)+','+(GY+8)+')'},Gs);
    sv('line',{x1:0,x2:18,y1:0,y2:0,'class':'fc-la'},lg); sv('text',{x:24,y:4,'class':'fc-ax'},lg).textContent='Objeto A';
    sv('line',{x1:92,x2:110,y1:0,y2:0,'class':'fc-lb'},lg); sv('text',{x:116,y:4,'class':'fc-ax'},lg).textContent='Objeto B';
  }
  var posA=0,posB=0;
  function drawObj(o,T,m,x,isA,t){
    var s=SIZES[m], y=300-s;
    o.r.setAttribute('x',x); o.r.setAttribute('y',y); o.r.setAttribute('width',s); o.r.setAttribute('height',s); o.r.style.fill=tColor(T);
    o.lab.setAttribute('x',x+s/2); o.lab.setAttribute('y',y-10);
    var amp=.4+T/100*4.2;
    o.parts.forEach(function(p){ p.el.setAttribute('cx',(x+10+(s-20)*p.u+(Math.random()-.5)*2*amp).toFixed(1)); p.el.setAttribute('cy',(y+10+(s-20)*p.v+(Math.random()-.5)*2*amp).toFixed(1)); });
    var tx=isA?x-40:x+s+26, top=110;
    o.tube.setAttribute('x',tx-7); o.tube.setAttribute('y',top); o.bulb.setAttribute('cx',tx); o.bulb.setAttribute('cy',top+160);
    var h=140*Math.max(0,Math.min(100,T))/100; o.liq.setAttribute('x',tx-3); o.liq.setAttribute('y',top+150-h); o.liq.setAttribute('height',h+12);
    o.tt.setAttribute('x',tx); o.tt.setAttribute('y',top-12); o.tt.textContent=f1(T)+' °C';
    var tk=o.ticks.children; for(var i=0;i<tk.length;i++){ var v=+tk[i].getAttribute('data-v'), yy=top+150-140*v/100;
      if(tk[i].tagName==='line'){ tk[i].setAttribute('x1',tx+7); tk[i].setAttribute('x2',tx+12); tk[i].setAttribute('y1',yy); tk[i].setAttribute('y2',yy); }
      else { tk[i].setAttribute('x',isA?tx-12:tx+15); tk[i].setAttribute('y',yy+3); tk[i].setAttribute('text-anchor',isA?'end':'start'); } }
  }
  var raf,last=performance.now(),gAcc=0,spawn=0;
  function loop(now){
    raf=requestAnimationFrame(loop);
    var dt=Math.min((now-last)/1000,.05); last=now;
    var sA=SIZES[st.mA], sB=SIZES[st.mB];
    var tgtA=st.contact?400-sA:370-sA, tgtB=st.contact?400:430;
    if(!posA){ posA=tgtA; posB=tgtB; }
    posA+=(tgtA-posA)*Math.min(1,dt*6); posB+=(tgtB-posB)*Math.min(1,dt*6);
    var touching=st.contact&&Math.abs(posB-posA-sA)<1.5;
    if(st.run&&touching&&!st.eq){
      var h=dt*st.speed, d=st.TA-st.TB, Q=KMAT[st.mat]*d*h;
      st.TA-=Q/st.mA; st.TB+=Q/st.mB; st.t+=h;
      if(Math.abs(st.TA-st.TB)<.25){ st.TA=st.TB=teq(); st.eq=true; st.run=false; goBtn.textContent='↺ Repetir'; }
      gAcc+=h; if(gAcc>.25||st.eq){ gAcc=0; st.hist.push([st.t,st.TA,st.TB]); drawGraph(); }
      status();
      spawn+=Math.abs(d)*dt*.12*KMAT[st.mat]/.34*st.speed;
      while(spawn>1){ spawn--; var dir=d>0?1:-1, yy=300-Math.min(sA,sB)*(.15+.7*Math.random());
        packs.push({x:400-dir*28,y:yy,dir:dir,t:0,el:sv('circle',{r:6,fill:'url(#fcGlow)'},gFlow)}); }
    }
    for(var i=packs.length-1;i>=0;i--){ var p=packs[i]; p.t+=dt; p.x+=p.dir*60*dt; p.el.setAttribute('cx',p.x.toFixed(1)); p.el.setAttribute('cy',p.y.toFixed(1)); p.el.setAttribute('opacity',(1-p.t/1).toFixed(2)); if(p.t>1){ p.el.remove(); packs.splice(i,1); } }
    drawObj(A,st.TA,st.mA,posA,true); drawObj(B,st.TB,st.mB,posB,false);
    var dd=st.TA-st.TB, show=touching&&!st.eq&&Math.abs(dd)>.3, hmin=Math.min(sA,sB);
    arrows.forEach(function(a,k){ var y=300-hmin*(.25+.25*k), dir=dd>0?1:-1, len=18+40*Math.min(1,Math.abs(dd)/80);
      a.setAttribute('x1',400-dir*len); a.setAttribute('x2',400+dir*len); a.setAttribute('y1',y); a.setAttribute('y2',y); a.setAttribute('opacity',show?(.35+.65*Math.min(1,Math.abs(dd)/60)).toFixed(2):0); });
    calLab.setAttribute('x',400); calLab.setAttribute('y',300-hmin-14); calLab.setAttribute('opacity',show?1:0);
  }
  var goBtn=box.querySelector('#fcGo');
  ['#fcTA','#fcTB'].forEach(function(id){ box.querySelector(id).oninput=reset; });
  ['#fcMA','#fcMB','#fcMat'].forEach(function(id){ box.querySelector(id).onchange=reset; });
  box.querySelector('#fcV').oninput=function(e){ st.speed=+e.target.value; };
  goBtn.onclick=function(){
    if(st.eq) reset();
    if(!st.contact){ st.contact=true; st.run=true; goBtn.textContent='❚❚ Pausar'; }
    else { st.run=!st.run; goBtn.textContent=st.run?'❚❚ Pausar':'▶ Continuar'; }
    status();
  };
  box.querySelector('#fcSep').onclick=function(){ st.contact=false; st.run=false; goBtn.textContent='▶ Juntar objetos'; status(); };
  box.querySelector('#fcR').onclick=reset;
  box.querySelector('#fcP').oninput=status;
  reset();
  raf=requestAnimationFrame(loop);
  return function stop(){ cancelAnimationFrame(raf); };
}

