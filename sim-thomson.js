'use strict';
/* Experimento de Thomson: rayos catódicos */
/* ---------- THOMSON: tubo de rayos catódicos y relación carga/masa ---------- */
function thomsonExperimento(box){
  box.innerHTML=expShell('thC','Tubo de rayos catódicos con placas eléctricas y campo magnético que desvían un haz de electrones hacia una pantalla fluorescente',
   '<div class="fc-box"><h4>Tubo</h4>'+RG('thV','Tensión de aceleración',1000,4000,100,2000,' V')+SL('thCat','Material del cátodo',[['#c0763c','Cobre'],['#868e96','Hierro'],['#ced4da','Aluminio'],['#e9ecef','Platino']],'#c0763c')+'</div>'+
   '<div class="fc-box"><h4>Campo eléctrico (placas)</h4>'+RG('thE','Tensión entre las placas',0,400,10,200,' V')+SL('thP','Placa superior',[['p','Positiva (+)'],['n','Negativa (−)']],'p')+'</div>'+
   '<div class="fc-box"><h4>Campo magnético (bobinas)</h4>'+RG('thB','Intensidad',0,1.5,.05,0,' mT')+SL('thD','Dirección del campo',[['in','Hacia adentro (×)'],['out','Hacia afuera (•)']],'in')+'</div>',
   [['¿En qué consistió?','J. J. Thomson (1897) hizo pasar un haz de «rayos catódicos» por un tubo con vacío y lo desvió con un campo eléctrico y uno magnético, midiendo cuánto se curvaba.'],
    ['¿Qué se observó?','El haz se desvía hacia la placa positiva: tiene carga negativa. Ajustando E y B hasta que el haz va recto se calcula su carga/masa. El valor es el mismo con cualquier cátodo.'],
    ['Conclusión → modelo de Thomson (1904)','Existen partículas negativas mucho más livianas que un átomo (los electrones) en toda la materia: el átomo no es indivisible, tiene partes.']]);
  var cv=box.querySelector('#thC'), cx=cv.getContext('2d'), msg=box.querySelector('.fc-status'), msgS=msg.appendChild(document.createElement('span'));
  var V=2000,Ep=200,Bm=0;
  var selC=box.querySelector('#thCat'), selP=box.querySelector('#thP'), selD=box.querySelector('#thD'); selP.onchange=calc; selD.onchange=calc;
  var C=rfCanvas(cv), EM=1.76e11, PXM=1800, X0=150, path=[], yScr=0, off=false, raf=0, last=performance.now(), tt=0, info={};
  function calc(){
    if(!cv) return; var v=Math.sqrt(2*EM*V), E=Ep/.02*(selP.value==='p'?1:-1), B=Bm*1e-3*(selD.value==='in'?-1:1), xr0=(250-X0)/PXM, xr1=(340-X0)/PXM, xs=(620-X0)/PXM;
    var x=0,y=0,vx=v,vy=0,dt=2e-11,n=0; path=[[X0,220]]; var ax,ay;
    while(x<xs&&n++<4000){ ax=0; ay=0; if(x>=xr0&&x<=xr1){ ay+=EM*E; ay+=EM*vx*B; ax-=EM*vy*B; }
      /* electrón: F = -e(E + v×B); aquí E>0 = placa sup. positiva => fuerza hacia arriba; Bz<0 (hacia adentro) => hacia abajo */
      vx+=ax*dt; vy+=ay*dt; var sp=Math.hypot(vx,vy); vx*=v/sp; vy*=v/sp; x+=vx*dt; y+=vy*dt; if(n%4===0||x>xr0) path.push([X0+x*PXM,220-y*PXM]); }
    yScr=y; off=Math.abs(y*PXM)>100; info={v:v,E:E,B:B,y:y};
    var bal=Math.abs(y)<.0015&&Ep>0&&Bm>0; var vm=Math.abs(E/B)||0;
    if(bal) msgS.innerHTML='<b>¡El haz va recto!</b>&nbsp;Las fuerzas eléctrica y magnética se equilibran: v = E/B = '+fnum(vm/1e7,2)+' × 10⁷ m/s. Con eso, carga/masa = v²/(2V) ≈ <b>'+fnum(vm*vm/(2*V)/1e11,2)+' × 10¹¹ C/kg</b>.';
    else if(Ep===0&&Bm===0) msgS.innerHTML='<b>Sin campos:</b>&nbsp;el haz va recto y llega al centro de la pantalla. Aplica un campo eléctrico o magnético.';
    else msgS.innerHTML='<b>Desviación en la pantalla:</b>&nbsp;'+(off?'fuera de la pantalla':fnum(Math.abs(y)*100,1)+' cm '+(y>0?'hacia arriba':'hacia abajo'))+'. '+(Ep>0&&Bm===0?(y>0?'El haz es atraído por la placa positiva: tiene carga negativa.':'El haz es atraído por la placa positiva (abajo): tiene carga negativa.'):'Prueba equilibrar E y B para que vaya recto.');
  }
  selC.onchange=function(){};
  function frame(now){
    raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now; tt+=dt; C.begin(cx); var INK=C.INK, MUT=C.MUT, i;
    /* tubo */
    cx.fillStyle='rgba(120,160,200,.10)'; cx.strokeStyle=MUT; cx.lineWidth=3; cx.beginPath(); cx.roundRect?cx.roundRect(24,104,632,232,34):cx.rect(24,104,632,232); cx.fill(); cx.stroke();
    rfTxt(cx,'Tubo de vidrio con vacío',340,96,MUT,12,'center');
    /* cátodo y ánodo */
    cx.fillStyle=selC.value; cx.fillRect(62,200,12,40); rfTxt(cx,'Cátodo (−)',68,262,INK,12,'center'); rfTxt(cx,'material: '+selC.options[selC.selectedIndex].text,68,277,MUT,11,'center');
    cx.fillStyle='#495057'; cx.fillRect(138,128,10,80); cx.fillRect(138,232,10,80); rfTxt(cx,'Ánodo (+)',143,330+0,INK,12,'center'); rfTxt(cx,'con rendija',143,345,MUT,11,'center');
    /* placas */
    var pt=selP.value==='p'; cx.fillStyle=Ep>0?(pt?'#e03131':'#1c7ed6'):'#adb5bd'; cx.fillRect(250,182,90,7); cx.fillStyle=Ep>0?(pt?'#1c7ed6':'#e03131'):'#adb5bd'; cx.fillRect(250,251,90,7);
    rfTxt(cx,Ep>0?(pt?'+':'−'):'',295,177,Ep>0?(pt?'#e03131':'#1c7ed6'):MUT,16,'center',800); rfTxt(cx,Ep>0?(pt?'−':'+'):'',295,276,Ep>0?(pt?'#1c7ed6':'#e03131'):MUT,16,'center',800);
    if(Ep>0){ var dir=pt?1:-1; for(i=0;i<4;i++){ var ax=262+i*22; rfArrow(cx,ax,pt?208:232,ax,pt?232:208,'#f08c00',1.6); } }
    rfTxt(cx,'Placas (campo eléctrico E)',295,300,INK,12,'center');
    /* campo magnético */
    cx.strokeStyle='#845ef7'; cx.globalAlpha=.55; cx.setLineDash([3,4]); cx.lineWidth=1.2; cx.strokeRect(250,160,90,120); cx.setLineDash([]); cx.globalAlpha=1;
    if(Bm>0){ cx.fillStyle='#845ef7'; cx.font='700 13px system-ui'; cx.textAlign='center'; for(var gx=0;gx<4;gx++) for(var gy=0;gy<2;gy++){ cx.fillText(selD.value==='in'?'×':'•',262+gx*22,168+gy*104+(gy?10:0)); } cx.textAlign='left'; }
    rfTxt(cx,'Campo magnético (B)',295,152,'#7048e8',12,'center');
    /* pantalla */
    cx.fillStyle='#1b3a2a'; cx.fillRect(616,114,22,212); cx.strokeStyle='#8ce99a'; cx.lineWidth=1; for(i=-5;i<=5;i++){ var gy2=220+i*18; cx.beginPath(); cx.moveTo(616,gy2); cx.lineTo(i%5===0?628:622,gy2); cx.stroke(); }
    rfTxt(cx,'Pantalla',627,106+0,INK,12,'center'); rfTxt(cx,'fluorescente',627,346,MUT,11,'center');
    /* haz */
    var Lt=0, cum=[0]; for(i=1;i<path.length;i++){ Lt+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]); cum.push(Lt); }
    cx.strokeStyle='rgba(140,255,170,.55)'; cx.lineWidth=5; cx.lineCap='round'; cx.beginPath(); cx.moveTo(74,220); cx.lineTo(X0,220); path.forEach(function(p){ cx.lineTo(p[0],p[1]); }); cx.stroke(); cx.lineCap='butt';
    cx.fillStyle='#d3f9d8'; for(i=0;i<16;i++){ var s=((tt*260+i*(Lt+76)/16)%(Lt+76)); var px,py; if(s<76){ px=74+s; py=220; } else { var q=s-76,k=1; while(k<cum.length-1&&cum[k]<q) k++; var f=(q-cum[k-1])/Math.max(1e-6,cum[k]-cum[k-1]); px=path[k-1][0]+(path[k][0]-path[k-1][0])*f; py=path[k-1][1]+(path[k][1]-path[k-1][1])*f; } cx.beginPath(); cx.arc(px,py,2.6,0,6.2832); cx.fill(); }
    var sy=Math.max(116,Math.min(324,220-yScr*PXM)); var g=cx.createRadialGradient(627,sy,0,627,sy,off?10:22); g.addColorStop(0,'rgba(220,255,225,1)'); g.addColorStop(1,'rgba(120,255,150,0)'); cx.fillStyle=g; cx.beginPath(); cx.arc(627,sy,22,0,6.2832); cx.fill();
    /* lectura */
    rfTxt(cx,'Velocidad de los electrones: '+fnum(info.v/1e7,2)+' × 10⁷ m/s',24,50,INK,13,'left',700); rfTxt(cx,'E = '+fnum(Math.abs(info.E)/1000,1)+' kV/m   ·   B = '+fnum(Math.abs(info.B)*1000,2)+' mT',24,70,MUT,12);
  }
  bindRg(box,'thV',function(v){ V=v; calc(); }); bindRg(box,'thE',function(v){ Ep=v; calc(); }); bindRg(box,'thB',function(v){ Bm=v; calc(); });
  calc(); raf=requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(raf); C.stop(); };
}

