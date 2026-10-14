'use strict';
/* Simulador: temperatura y calor */
/* ====== SIMULADOR: Temperatura y calor (cubo en el aire) ====== */
function temperaturaCalor(box){
  box.innerHTML='<div class="fc-wrap"><div class="fc-main">'+
    '<div class="fc-scene"><svg id="cbS" viewBox="0 0 800 330" role="img" aria-label="Un cubo sólido rodeado de aire; se ven las partículas del cubo vibrando y las del aire chocando con él"></svg></div>'+
    '<p class="fc-status" aria-live="polite"></p>'+
    '<div style="display:flex;gap:8px;flex:1 1 0;min-height:0"><div class="fc-graph"><svg id="cbG1" viewBox="0 0 400 200" role="img" aria-label="Gráfico de la temperatura del cubo en el tiempo"></svg></div><div class="fc-graph"><svg id="cbG2" viewBox="0 0 400 200" role="img" aria-label="Gráfico del calor transferido en joules en el tiempo"></svg></div></div>'+
    '</div><aside class="fc-side">'+
    '<div class="fc-box"><h4>Cubo</h4>'+SL('cbMat','Material',[['cobre','Cobre'],['aluminio','Aluminio'],['hierro','Hierro'],['vidrio','Vidrio']],'cobre')+SL('cbM','Masa',[['0.2','0,2 kg'],['0.5','0,5 kg'],['1','1 kg']],'0.5')+RG('cbT','Temperatura inicial',-10,100,5,80,' °C')+'</div>'+
    '<div class="fc-box"><h4>Aire que lo rodea</h4>'+RG('cbA','Temperatura ambiente',-10,50,1,20,' °C')+RG('cbV','Velocidad',1,20,1,8,'×')+'</div>'+
    '<div class="fc-btns"><button class="btn2 fc-go" id="cbGo">❚❚ Pausar</button><button class="btn2" id="cbR">Reiniciar</button></div>'+
    '</aside></div>';
  var svg=box.querySelector('#cbS'), g1=box.querySelector('#cbG1'), g2=box.querySelector('#cbG2'), msg=box.querySelector('.fc-status');
  var CS={cobre:385,aluminio:900,hierro:450,vidrio:840}, SIDE={'0.2':100,'0.5':125,'1':150}, NN={'0.2':4,'0.5':5,'1':6};
  var CXc=400, CYc=196, TMIN=-10, TMAX=100;
  var st={mat:'cobre',m:.5,T0:80,T:80,Ta:20,sp:8,run:true,t:0,Q:0,side:125,hist:[]};
  var defs=SV('defs',{},svg), mk=SV('marker',{id:'cbArr',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'},defs); SV('path',{d:'M0 0 L10 5 L0 10 Z',fill:'#f08c00'},mk);
  var airBg=SV('rect',{x:8,y:76,width:784,height:246,rx:10,fill:'color-mix(in srgb,#74c0fc 9%,var(--panel))',stroke:'var(--line)'},svg);
  var infoT=SV('text',{x:20,y:316,'class':'fc-note'},svg);
  /* tarjetas */
  function card(x,w,title){ SV('rect',{x:x,y:6,width:w,height:64,rx:10,fill:'var(--chip)',stroke:'var(--line)'},svg); SV('text',{x:x+12,y:23,'class':'fc-axt'},svg).textContent=title;
    return {v:SV('text',{x:x+12,y:48,style:'font:700 22px system-ui;fill:var(--acc)'},svg), s:SV('text',{x:x+12,y:63,'class':'fc-note'},svg)}; }
  var cT=card(10,250,'TEMPERATURA del cubo'), cQ=card(540,250,'CALOR transferido (Q)');
  var cA={v:SV('text',{x:400,y:26,'text-anchor':'middle','class':'fc-tval'},svg), f:SV('text',{x:400,y:46,'text-anchor':'middle',style:'font:700 16px Georgia,serif;fill:var(--ink)'},svg), i:SV('text',{x:400,y:63,'text-anchor':'middle','class':'fc-note'},svg)};
  cT.s.textContent='mide qué tan rápido se mueven sus partículas';
  /* aire */
  var NA=170, air=[], flashes=[], gA=SV('g',{},svg), gF=SV('g',{},svg);
  for(var a=0;a<NA;a++){ var kb=.985+Math.random()*.03, an=Math.random()*6.283; air.push({x:20+Math.random()*760,y:86+Math.random()*226,vx:Math.cos(an),vy:Math.sin(an),kb:kb,k:kb,el:SV('circle',{r:3.8},gA)}); }
  /* cubo */
  var gC=SV('g',{},svg), body=SV('rect',{rx:8,'class':'fc-obj'},gC), bonds=[], nodes=[];
  var gArr=SV('g',{},svg), arr=[0,1,2,3].map(function(){ return SV('line',{'class':'fc-arrow','marker-end':'url(#cbArr)'},gArr); });
  
  function build(){ gC.innerHTML=''; body=SV('rect',{rx:8,'class':'fc-obj'},gC); bonds=[]; nodes=[]; var n=NN[String(st.m)], s=st.side, sp=(s-28)/(n-1);
    for(var r=0;r<n;r++) for(var c=0;c<n;c++) nodes.push({x:CXc-s/2+14+c*sp,y:CYc-s/2+14+r*sp,r:r,c:c});
    nodes.forEach(function(p,i){ if(p.c<n-1) bonds.push([i,i+1,SV('line',{stroke:'#495057','stroke-width':1.6,opacity:.55},gC)]); if(p.r<n-1) bonds.push([i,i+n,SV('line',{stroke:'#495057','stroke-width':1.6,opacity:.55},gC)]); });
    nodes.forEach(function(p){ p.el=SV('circle',{r:4.6,fill:'#343a40'},gC); });
    body.setAttribute('x',CXc-st.side/2); body.setAttribute('y',CYc-st.side/2); body.setAttribute('width',st.side); body.setAttribute('height',st.side);
  }
  function tc(T){ return ramp((T-TMIN)/(TMAX-TMIN),[[0,'#4dabf7'],[.3,'#f1f3f5'],[1,'#fa5252']]); }
  /* gráficos */
  var GX=56,GY=14,GW=330,GH=124;
  function lg(el,o){
    el.innerHTML=''; var tmax=Math.max(60,Math.ceil(st.t/30)*30), span=o.max-o.min;
    o.ticks.forEach(function(v){ var y=GY+GH-GH*(v-o.min)/span; SV('line',{x1:GX,x2:GX+GW,y1:y,y2:y,'class':'fc-grid'},el); SV('text',{x:GX-6,y:y+4,'text-anchor':'end','class':'fc-ax'},el).textContent=fj(v); });
    for(var t=0;t<=tmax;t+=tmax/3) SV('text',{x:GX+GW*t/tmax,y:GY+GH+14,'text-anchor':'middle','class':'fc-ax'},el).textContent=Math.round(t);
    SV('text',{x:GX+GW/2,y:GY+GH+32,'text-anchor':'middle','class':'fc-axt'},el).textContent='Tiempo (s)';
    SV('text',{x:12,y:GY+GH/2,'text-anchor':'middle','class':'fc-axt',transform:'rotate(-90 12 '+(GY+GH/2)+')'},el).textContent=o.yl;
    SV('line',{x1:GX,x2:GX,y1:GY,y2:GY+GH,'class':'fc-axl'},el); SV('line',{x1:GX,x2:GX+GW,y1:GY+GH,y2:GY+GH,'class':'fc-axl'},el);
    if(o.ref!=null){ var yr=GY+GH-GH*(o.ref-o.min)/span; SV('line',{x1:GX,x2:GX+GW,y1:yr,y2:yr,'class':'fc-eqline'},el); SV('text',{x:GX+GW-3,y:yr-5,'text-anchor':'end','class':'fc-eqlab'},el).textContent=o.rl; }
    var d=st.hist.map(function(h,i){ return (i?'L':'M')+(GX+GW*h[0]/tmax).toFixed(1)+' '+(GY+GH-GH*Math.max(0,Math.min(1,(h[o.i]-o.min)/span))).toFixed(1); }).join(' '); if(d) SV('path',{d:d,'class':o.cls},el);
    SV('text',{x:GX+8,y:GY+12,'class':'fc-axt'},el).textContent=o.title;
  }
  function fj(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
  function nice(x){ if(x<=0) return 100; var p=Math.pow(10,Math.floor(Math.log10(x))), f=x/p; return (f<=1?1:f<=2?2:f<=5?5:10)*p; }
  function graphs(){
    lg(g1,{min:TMIN,max:TMAX,ticks:[0,25,50,75,100],yl:'Temperatura (°C)',i:1,cls:'fc-la',ref:st.Ta,rl:'Aire: '+fnum(st.Ta)+' °C',title:'Temperatura del cubo (°C)'});
    var qm=0; st.hist.forEach(function(h){ if(h[2]>qm) qm=h[2]; }); var qmax=nice(Math.max(qm,CS[st.mat]*st.m*Math.abs(st.T0-st.Ta))*1.05);
    lg(g2,{min:0,max:qmax,ticks:[0,qmax/2,qmax],yl:'Calor Q (J)',i:2,cls:'fc-lb',title:'Calor transferido (J)'});
  }
  function reset(){
    st.mat=box.querySelector('#cbMat').value; st.m=+box.querySelector('#cbM').value; st.side=SIDE[box.querySelector('#cbM').value]; st.T0=st.T=+box.querySelector('#cbT').value; st.t=0; st.Q=0; st.hist=[[0,st.T,0]]; build(); graphs();
  }
  var raf,last=performance.now(),gAcc=0;
  function loop(now){
    raf=requestAnimationFrame(loop); var dt=Math.min((now-last)/1000,.05); last=now;
    var mc=CS[st.mat]*st.m, hA=2*Math.pow(st.side/125,2);
    if(st.run){ var h=dt*st.sp, T1=st.Ta+(st.T-st.Ta)*Math.exp(-h*hA/mc); st.Q+=mc*(T1-st.T); st.T=T1; st.t+=h; gAcc+=dt; }
    if(gAcc>.25){ gAcc=0; st.hist.push([st.t,st.T,Math.abs(st.Q)]); graphs(); }
    /* cubo */
    body.style.fill=tc(st.T); var amp=.5+Math.max(0,st.T-TMIN)/(TMAX-TMIN)*5.5;
    nodes.forEach(function(p){ p.px=p.x+(Math.random()-.5)*2*amp; p.py=p.y+(Math.random()-.5)*2*amp; p.el.setAttribute('cx',p.px.toFixed(1)); p.el.setAttribute('cy',p.py.toFixed(1)); });
    bonds.forEach(function(b){ var A=nodes[b[0]],B=nodes[b[1]]; b[2].setAttribute('x1',A.px.toFixed(1)); b[2].setAttribute('y1',A.py.toFixed(1)); b[2].setAttribute('x2',B.px.toFixed(1)); b[2].setAttribute('y2',B.py.toFixed(1)); });
    infoT.textContent='Cubo de '+st.mat+' · '+String(st.m).replace('.',',')+' kg · calor específico c = '+CS[st.mat]+' J/(kg·°C) · Puntos azules/rojos: partículas del aire (más rápidas = más rojas)';
    /* aire */
    var half=st.side/2+3, vb=80*Math.sqrt((st.Ta+273)/293), Tk=st.T+273, Ak=st.Ta+273;
    air.forEach(function(p){
      var v=vb*p.k*(st.run?Math.min(1.8,.5+st.sp*.12):0); p.x+=p.vx*v*dt; p.y+=p.vy*v*dt;
      if(p.x<14){ p.x=14; p.vx=Math.abs(p.vx); } if(p.x>786){ p.x=786; p.vx=-Math.abs(p.vx); } if(p.y<84){ p.y=84; p.vy=Math.abs(p.vy); } if(p.y>314){ p.y=314; p.vy=-Math.abs(p.vy); }
      var dx=p.x-CXc, dy=p.y-CYc;
      if(Math.abs(dx)<half&&Math.abs(dy)<half){
        if(half-Math.abs(dx)<half-Math.abs(dy)){ var sx=dx>=0?1:-1; p.x=CXc+sx*half; p.vx=sx*Math.abs(p.vx); } else { var sy=dy>=0?1:-1; p.y=CYc+sy*half; p.vy=sy*Math.abs(p.vy); }
        var kc=Math.sqrt(Math.max(.2,Tk/Ak))*(.85+.3*Math.random()); p.k+=(kc-p.k)*.7; p.k=Math.max(.6,Math.min(1.6,p.k));
        if(flashes.length<14) flashes.push({t:0,el:SV('circle',{cx:p.x,cy:p.y,r:3,fill:'none',stroke:'#f08c00','stroke-width':2},gF)});
      }
      p.k+=(p.kb-p.k)*Math.min(1,dt*.7);
      p.el.setAttribute('cx',p.x.toFixed(1)); p.el.setAttribute('cy',p.y.toFixed(1)); p.el.setAttribute('fill',ramp((p.k*p.k*Ak-273-TMIN)/(TMAX-TMIN),FLU));
    });
    for(var i=flashes.length-1;i>=0;i--){ var f=flashes[i]; f.t+=dt; f.el.setAttribute('r',(3+9*f.t/.3).toFixed(1)); f.el.setAttribute('opacity',(1-f.t/.3).toFixed(2)); if(f.t>.3){ f.el.remove(); flashes.splice(i,1); } }
    /* flechas de calor */
    var dT=st.T-st.Ta, show=Math.abs(dT)>.4, out=dT>0, len=14+36*Math.min(1,Math.abs(dT)/60), o=st.side/2+8;
    [[0,-1],[1,0],[0,1],[-1,0]].forEach(function(d,k){ var bx=CXc+d[0]*o, by=CYc+d[1]*o, s=out?1:-1, x1=bx-(out?0:d[0]*len)*1, y1=by-(out?0:d[1]*len);
      var xa=out?bx:bx+d[0]*len, ya=out?by:by+d[1]*len, xb=out?bx+d[0]*len:bx, yb=out?by+d[1]*len:by;
      arr[k].setAttribute('x1',xa); arr[k].setAttribute('y1',ya); arr[k].setAttribute('x2',xb); arr[k].setAttribute('y2',yb); arr[k].setAttribute('opacity',show?.9:0); });
    /* lecturas */
    var rem=mc*Math.abs(dT);
    cT.v.textContent=fnum(st.T,1)+' °C'; cQ.v.textContent=fj(Math.abs(st.Q))+' J';
    cQ.s.textContent=(show?(out?'cedido por el cubo al aire':'absorbido por el cubo desde el aire'):'')+(show?' · falta '+fj(rem)+' J':'se mide en joules (J)');
    cA.v.textContent='Aire'; cA.f.textContent=fnum(st.Ta,1)+' °C'; cA.i.textContent='Q = m · c · ΔT';
    if(!show) msg.textContent='Equilibrio térmico: el cubo y el aire tienen la misma temperatura ('+fnum(st.Ta)+' °C), por eso ya no hay flujo neto de calor. En total se transfirieron '+fj(Math.abs(st.Q))+' J.';
    else msg.textContent='El cubo está '+(out?'más caliente':'más frío')+' que el aire, así que '+(out?'cede':'absorbe')+' calor. La temperatura ('+fnum(st.T,1)+' °C) cambia más lento si la masa o el calor específico son mayores, pero el calor Q (J) transferido sigue la fórmula Q = m·c·ΔT.';
  }
  var goBtn=box.querySelector('#cbGo');
  bindRg(box,'cbT'); bindRg(box,'cbA',function(v){ st.Ta=v; }); bindRg(box,'cbV',function(v){ st.sp=v; });
  box.querySelector('#cbT').addEventListener('input',reset);
  box.querySelector('#cbMat').onchange=reset; box.querySelector('#cbM').onchange=reset;
  goBtn.onclick=function(){ st.run=!st.run; goBtn.textContent=st.run?'❚❚ Pausar':'▶ Continuar'; };
  box.querySelector('#cbR').onclick=reset;
  reset(); raf=requestAnimationFrame(loop);
  return function stop(){ cancelAnimationFrame(raf); };
}


