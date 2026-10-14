'use strict';
/* Experimento de Bohr: espectros de emisión */
/* ---------- BOHR: espectros de emisión ---------- */
function bohrExperimento(box){
  var SRC={white:{n:'Luz blanca (lámpara)',l:null},H:{n:'Hidrógeno',l:null},He:{n:'Helio',l:[[447.1,.5],[471.3,.3],[492.2,.3],[501.6,.6],[587.6,1],[667.8,.5],[706.5,.4]]},Ne:{n:'Neón',l:[[585.2,.9],[588.2,.6],[594.5,.5],[603.0,.5],[607.4,.7],[614.3,.8],[626.6,.7],[640.2,1],[650.6,.8],[692.9,.5],[703.2,.7]]},Na:{n:'Sodio',l:[[498.3,.2],[568.8,.3],[589.0,1],[589.6,1],[615.4,.25]]},Hg:{n:'Mercurio',l:[[404.7,.6],[435.8,.9],[546.1,1],[577.0,.7],[579.1,.7]]}};
  box.innerHTML=expShell('boC','Tubo de gas excitado cuya luz pasa por un prisma y forma un espectro de líneas; diagrama de niveles de energía del hidrógeno',
   '<div class="fc-box"><h4>Fuente de luz</h4>'+SL('boS','Fuente',Object.keys(SRC).map(function(k){ return [k,SRC[k].n]; }),'H')+RG('boI','Excitación (voltaje del tubo)',1,10,1,6,'')+'</div>'+
   '<div class="fc-box"><h4>Cómo leerlo</h4><div style="line-height:1.45">Elige <b>Hidrógeno</b> y observa cómo cada salto del electrón entre niveles emite un fotón de un color preciso. Luego compara con otros gases y con la luz blanca.</div></div>',
   [['¿En qué consistió?','Se hace pasar corriente por un gas a baja presión: brilla. Esa luz se descompone con un prisma o una rejilla y se observa su espectro.'],
    ['¿Qué se observó?','La luz blanca da un espectro continuo (todos los colores). Cada gas da solo algunas líneas de colores, siempre las mismas: una «huella digital» del elemento. El hidrógeno tiene 4 líneas visibles.'],
    ['Conclusión → modelo de Bohr (1913)','Los electrones solo pueden tener ciertas energías (niveles). Al bajar de un nivel a otro emiten un fotón con la energía exacta de la diferencia: por eso solo hay líneas.']]);
  var cv=box.querySelector('#boC'), cx=cv.getContext('2d'), msg=box.querySelector('.fc-status'), msgS=msg.appendChild(document.createElement('span')), selS=box.querySelector('#boS');
  var Iv=6; bindRg(box,'boI',function(v){ Iv=v; });
  var C=rfCanvas(cv), raf=0, last=performance.now(), tt=0, SX0=330, SW=440, SY=36, SH=52;
  var NI=[3,4,5,6], inten={}, photons=[], ev=null, acc=0, lastEv='', LV=function(n){ return -13.6/(n*n); };
  function lam(ni,nf){ return 91.13/(1/(nf*nf)-1/(ni*ni)); }
  function evtPick(){ var ni=3+Math.floor(Math.random()*4), r=Math.random(), nf=r<.72?2:(r<.9?1:(ni>3?3:2)); var steps=[[ni,nf]]; if(nf>1) steps.push([nf,1]); return steps; }
  function xOf(l){ return SX0+(l-380)/400*SW; }
  function note(){ var s=selS.value; msgS.innerHTML=s==='white'?'<b>Luz blanca:</b>&nbsp;espectro continuo. Contiene todos los colores.':(s==='H'?'<b>Hidrógeno:</b>&nbsp;solo 4 líneas visibles. '+(lastEv||'Cada línea corresponde a un salto del electrón hacia el nivel n = 2.'):'<b>'+SRC[s].n+':</b>&nbsp;líneas distintas a las del hidrógeno: cada elemento tiene su propia huella.'); }
  selS.onchange=function(){ inten={}; photons=[]; ev=null; lastEv=''; note(); }; note();
  function frame(now){
    raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now; tt+=dt; C.begin(cx); var INK=C.INK, MUT=C.MUT, s=selS.value, i;
    /* eventos de salto (hidrógeno) */
    if(s==='H'){ acc+=dt*Iv*1.1; if(!ev&&acc>=1){ acc=0; ev={steps:evtPick(),k:0,t:0,from:0}; ev.cur=ev.steps[0][0]; } }
    var evy=null; if(ev){ ev.t+=dt; var st=ev.steps[ev.k], hold=.5, jump=.45; if(ev.t<hold){ ev.n=st[0]; ev.yy=LV(st[0]); } else if(ev.t<hold+jump){ var f=(ev.t-hold)/jump; ev.yy=LV(st[0])+(LV(st[1])-LV(st[0]))*f*f*(3-2*f); }
      else { var l=lam(st[0],st[1]); var vis=l>=380&&l<=780; photons.push({l:l,sx:236,sy:ELY(ev.yy),tx:vis?xOf(l):SX0+SW+30,ty:vis?SY+SH:SY+SH+80,vis:vis,u:0,t:0}); lastEv='Último salto: n = '+st[0]+' → n = '+st[1]+' emite un fotón de '+fnum(l,0)+' nm'+(l<380?' (ultravioleta, no se ve).':l>780?' (infrarrojo, no se ve).':'.'); note(); ev.k++; ev.t=0; if(ev.k>=ev.steps.length) ev=null; } }
    function ELY(e){ return 425-(e+13.6)/13.6*215; }
    /* tubo y prisma */
    var lines=(s==='white')?null:(s==='H'?NI.slice(0,4).map(function(n){ return [lam(n,2),1]; }):SRC[s].l);
    var rr=0,gg=0,bb=0,w=0; if(s==='white'){ rr=255; gg=236; bb=190; w=1; } else lines.forEach(function(L){ var c=wl2rgb(L[0]), a=(s==='H'?(inten[Math.round(L[0])]||0):L[1]*(Iv/10)); rr+=c[0]*a; gg+=c[1]*a; bb+=c[2]*a; w+=a; });
    var gl=w>0?[rr/w,gg/w,bb/w]:[90,90,100], br=s==='white'?.9:Math.min(1,w*.8+.12);
    cx.fillStyle='rgba(120,120,130,.25)'; cx.strokeStyle=MUT; cx.lineWidth=2.5; cx.beginPath(); cx.roundRect?cx.roundRect(24,40,150,46,23):cx.rect(24,40,150,46); cx.fill(); cx.stroke();
    var tg=cx.createLinearGradient(30,0,170,0); tg.addColorStop(0,'rgba('+gl.map(Math.round)+','+(.25+.7*br)+')'); tg.addColorStop(.5,'rgba('+gl.map(Math.round)+','+(.35+.65*br)+')'); tg.addColorStop(1,'rgba('+gl.map(Math.round)+','+(.25+.7*br)+')'); cx.fillStyle=tg; cx.beginPath(); cx.roundRect?cx.roundRect(32,47,134,32,16):cx.rect(32,47,134,32); cx.fill();
    cx.fillStyle='#868e96'; cx.fillRect(16,56,10,14); cx.fillRect(172,56,10,14);
    rfTxt(cx,s==='white'?'Lámpara incandescente':'Tubo con '+SRC[s].n.toLowerCase(),99,106,INK,12,'center');
    cx.strokeStyle='rgba(255,255,255,.6)'; cx.strokeStyle='rgba(200,200,200,.8)'; cx.lineWidth=2; cx.beginPath(); cx.moveTo(180,63); cx.lineTo(236,63); cx.stroke(); rfTxt(cx,'rendija',208,52,MUT,11,'center');
    cx.fillStyle='rgba(170,200,230,.45)'; cx.strokeStyle='#74c0fc'; cx.lineWidth=2; cx.beginPath(); cx.moveTo(240,36); cx.lineTo(240,92); cx.lineTo(292,63); cx.closePath(); cx.fill(); cx.stroke(); rfTxt(cx,'prisma',266,106,INK,12,'center');
    cx.strokeStyle='rgba(200,200,200,.5)'; cx.lineWidth=1; cx.setLineDash([3,3]); cx.beginPath(); cx.moveTo(292,63); cx.lineTo(SX0-6,SY+SH/2); cx.stroke(); cx.setLineDash([]);
    /* espectro */
    cx.fillStyle='#0b0d12'; cx.fillRect(SX0,SY,SW,SH);
    if(s==='white'){ for(i=0;i<SW;i+=2){ var c=wl2rgb(380+i/SW*400); cx.fillStyle='rgb('+c+')'; cx.fillRect(SX0+i,SY,2,SH); } }
    else lines.forEach(function(L){ var c=wl2rgb(L[0]), a=s==='H'?Math.min(1,inten[Math.round(L[0])]||0):L[1]*(Iv/10)*(.88+.12*Math.sin(tt*9+L[0])); if(a<.02) return; var x=xOf(L[0]); var gr=cx.createLinearGradient(x-7,0,x+7,0); gr.addColorStop(0,'rgba('+c+',0)'); gr.addColorStop(.5,'rgba('+c+','+(.55*a)+')'); gr.addColorStop(1,'rgba('+c+',0)'); cx.fillStyle=gr; cx.fillRect(x-7,SY,14,SH); cx.fillStyle='rgba('+c+','+Math.min(1,a)+')'; cx.fillRect(x-1.2,SY,2.4,SH); });
    cx.strokeStyle=MUT; cx.lineWidth=1; for(var wv=400;wv<=750;wv+=50){ var xx=xOf(wv); cx.beginPath(); cx.moveTo(xx,SY+SH); cx.lineTo(xx,SY+SH+6); cx.stroke(); rfTxt(cx,String(wv),xx,SY+SH+19,MUT,11,'center'); }
    rfTxt(cx,'Longitud de onda (nm)',SX0+SW/2,SY+SH+34,INK,12,'center'); rfTxt(cx,'Espectro',SX0-12,SY-8,INK,13,'left',700);
    if(s==='H'){ for(var k in inten){ inten[k]=Math.max(0,inten[k]-dt*.22); } }
    /* niveles de energía (H) o lista de líneas */
    if(s==='H'){
      rfTxt(cx,'Niveles de energía del hidrógeno',30,176,INK,13,'left',700);
      for(var n=1;n<=6;n++){ var y=ELY(LV(n)); cx.strokeStyle=MUT; cx.lineWidth=2; cx.beginPath(); cx.moveTo(60,y); cx.lineTo(220,y); cx.stroke(); if(n<=4) rfTxt(cx,'n = '+n,28,y+4,INK,12,'left'); if(n<=3) rfTxt(cx,fnum(LV(n),2)+' eV',226,y+4,MUT,11,'left'); if(n===5) rfTxt(cx,'n = 5, 6…',226,y+3,MUT,11,'left'); }
      cx.setLineDash([4,4]); cx.strokeStyle=MUT; cx.beginPath(); cx.moveTo(60,ELY(0)); cx.lineTo(220,ELY(0)); cx.stroke(); cx.setLineDash([]); rfTxt(cx,'n = ∞ (0 eV)',28,ELY(0)-6,MUT,11,'left');
      [3,4,5,6].forEach(function(ni,j){ var c=wl2rgb(lam(ni,2)); rfArrow(cx,84+j*22,ELY(LV(ni)),84+j*22,ELY(LV(2))-2,'rgb('+c+')',2); });
      rfTxt(cx,'Visibles: caen a n = 2',140,ELY(LV(2))+22,INK,11,'center');
      if(ev){ var ey=ELY(ev.yy); cx.fillStyle='#339af0'; cx.beginPath(); cx.arc(150,ey,7,0,6.2832); cx.fill(); rfTxt(cx,'−',150,ey+4,'#fff',12,'center',800); } else { var e1=ELY(LV(1)); cx.fillStyle='#339af0'; cx.beginPath(); cx.arc(150,e1,7,0,6.2832); cx.fill(); rfTxt(cx,'−',150,e1+4,'#fff',12,'center',800); }
      /* fotones */
      for(i=photons.length-1;i>=0;i--){ var p=photons[i]; p.t+=dt; p.u+=dt/.9; var c2=p.vis?wl2rgb(p.l):[150,150,150], dx=p.tx-p.sx, dy=p.ty-p.sy, dl=Math.hypot(dx,dy), ux=dx/dl, uy=dy/dl, hx0=p.sx+dx*Math.min(1,p.u), hy0=p.sy+dy*Math.min(1,p.u);
        cx.strokeStyle='rgba('+c2+','+Math.max(0,Math.min(1,2-p.u*1.6))+')'; cx.lineWidth=3; cx.beginPath(); for(var q=0;q<=24;q++){ var wv=Math.sin(q*.9-p.t*30)*4, px=hx0-ux*q*3-uy*wv, py=hy0-uy*q*3+ux*wv; if(q) cx.lineTo(px,py); else cx.moveTo(px,py); } cx.stroke();
        if(p.u>=1){ if(p.vis){ var key=Math.round(p.l); inten[key]=Math.min(1.2,(inten[key]||0)+.9); } photons.splice(i,1); } }
      rfTxt(cx,'Cada fotón lleva la energía exacta de la diferencia entre niveles',SX0+SW/2,150,INK,12,'center');
      /* tabla Balmer */
      var ty=222; rfTxt(cx,'Línea',SX0,ty,MUT,11,'left',700); rfTxt(cx,'Salto',SX0+110,ty,MUT,11,'left',700); rfTxt(cx,'Energía del fotón',SX0+170,ty,MUT,11,'left',700); rfTxt(cx,'Longitud de onda',SX0+310,ty,MUT,11,'left',700); ty+=22;
      [['Roja',3],['Verde azulada',4],['Azul',5],['Violeta',6]].forEach(function(r){ var l=lam(r[1],2), c=wl2rgb(l); cx.fillStyle='rgb('+c+')'; cx.fillRect(SX0,ty-11,12,12); rfTxt(cx,r[0],SX0+18,ty,INK,12,'left'); rfTxt(cx,r[1]+' → 2',SX0+110,ty,INK,12,'left'); rfTxt(cx,fnum(13.6*(1/4-1/(r[1]*r[1])),2)+' eV',SX0+170,ty,INK,12,'left'); rfTxt(cx,fnum(l,0)+' nm',SX0+310,ty,INK,12,'left',700); ty+=24; });
      rfTxt(cx,'Mayor salto de energía → fotón de menor longitud de onda',SX0,ty+10,'#e8590c',12,'left',700);
    } else if(s==='white'){
      rfTxt(cx,'Espectro continuo',30,160,INK,15,'left',700); rfTxt(cx,'Un cuerpo muy caliente emite luz de todos los colores, sin huecos.',30,184,INK,13,'left'); rfTxt(cx,'Compara con un gas: solo emite algunos colores.',30,206,MUT,13,'left');
    } else {
      rfTxt(cx,'Líneas de emisión del '+SRC[s].n.toLowerCase(),30,160,INK,15,'left',700); var y2=188; SRC[s].l.forEach(function(L){ var c=wl2rgb(L[0]); cx.fillStyle='rgb('+c+')'; cx.fillRect(30,y2-11,14,12); rfTxt(cx,fnum(L[0],1)+' nm',54,y2,INK,13,'left'); y2+=22; });
      rfTxt(cx,'Cada elemento tiene su propia «huella digital».',230,188,'#e8590c',13,'left',700); rfTxt(cx,'Los niveles de energía de cada átomo son distintos.',230,210,MUT,12,'left');
    }
  }
  raf=requestAnimationFrame(frame);
  return function(){ cancelAnimationFrame(raf); C.stop(); };
}

