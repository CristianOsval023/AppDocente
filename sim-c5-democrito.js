'use strict';
/* Clase 5 · Estación 1: Leucipo y Demócrito (idea del átomo) */
function c5HistDemocrito(box){
  var W=1600,H=620,G=500, LEU={tun:'#f8f9fa',trim:'#4c6ef5',barba:true}, DEM={tun:'#ffd8a8',trim:'#e8590c',barba:true,hair:'#6c757d'};
  function templo(){
    var x0=560, o='<rect x="'+(x0-20)+'" y="'+(G-34)+'" width="520" height="34" fill="#e6d7b0" stroke="#b79f6a" stroke-width="4"/>';
    for(var k=0;k<6;k++) o+='<rect x="'+(x0+k*84)+'" y="'+(G-200)+'" width="40" height="166" fill="#f3ead2" stroke="#b79f6a" stroke-width="4"/>';
    return o+'<polygon points="'+(x0-30)+','+(G-196)+' '+(x0+510)+','+(G-196)+' '+(x0+240)+','+(G-300)+'" fill="#f3ead2" stroke="#b79f6a" stroke-width="4"/>';
  }
  function s1(t){
    var a=hcEz(t/4.5), w=t<4.5?t:0;
    var o=hcFondoExterior(W,H,G)+templo()+hcPersona({x:170+a*300,y:G+34,tun:LEU.tun,trim:LEU.trim,barba:true,hair:'#adb5bd',face:1,walk:w,name:'Leucipo',sub:'siglo V a. C.',sc:.95})+hcPersona({x:1430-a*300,y:G+34,tun:DEM.tun,trim:DEM.trim,barba:true,hair:'#6c757d',face:-1,walk:w,name:'Demócrito',sub:'c. 460 – 370 a. C.',sc:.95});
    var b=hcEz((t-4.6)/.8); if(b>0) o+='<g transform="translate(800,150) scale('+b+')"><ellipse rx="170" ry="92" fill="#fff" stroke="#14213d" stroke-width="6"/>'+hcT(0,40,120,HC.org,'?','middle',800)+'</g>';
    return o;
  }
  function s2(t){
    var lv=Math.min(6,Math.floor(t/1.35)), t0=lv*1.35, cols=Math.pow(2,Math.ceil(lv/2)), rows=Math.pow(2,Math.floor(lv/2));
    var WW=420,HH=260,gap=lv>0?hcEz((t-t0)/.5)*10:0, cxm=800, cym=300, pw=(WW-gap*(cols-1))/cols, ph=(HH-gap*(rows-1))/rows;
    var o=hcFondoExterior(W,H,G)+hcPersona({x:260,y:G+34,tun:LEU.tun,trim:LEU.trim,barba:true,hair:'#adb5bd',sc:.9,name:'Leucipo'})+hcPersona({x:1340,y:G+34,tun:DEM.tun,trim:DEM.trim,barba:true,hair:'#6c757d',face:-1,sc:.9,name:'Demócrito'});
    o+='<rect x="'+(cxm-250)+'" y="'+(cym+HH/2+10)+'" width="500" height="30" rx="8" fill="#c8b98e" stroke="#9c8a5a" stroke-width="4"/>';
    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++) o+='<rect x="'+(cxm-WW/2+c*(pw+gap)).toFixed(1)+'" y="'+(cym-HH/2+r*(ph+gap)).toFixed(1)+'" width="'+pw.toFixed(1)+'" height="'+ph.toFixed(1)+'" rx="'+Math.min(10,pw/4).toFixed(1)+'" fill="#adb5bd" stroke="#14213d" stroke-width="'+(lv>3?2:4)+'"/>';
    if(lv>0&&t-t0<.45){ var k=1-(t-t0)/.45; o+=(lv%2===1)?'<line x1="'+cxm+'" y1="'+(cym-HH/2-34)+'" x2="'+cxm+'" y2="'+(cym+HH/2+34)+'" stroke="#e03131" stroke-width="8" stroke-dasharray="16 10" opacity="'+k+'"/>':'<line x1="'+(cxm-WW/2-34)+'" y1="'+cym+'" x2="'+(cxm+WW/2+34)+'" y2="'+cym+'" stroke="#e03131" stroke-width="8" stroke-dasharray="16 10" opacity="'+k+'"/>'; }
    var n=Math.pow(2,lv); return o+hcT(800,70,64,HC.ink,n===1?'1 piedra':n+' trozos','middle',800);
  }
  function s3(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#eef2f7"/>';
    for(var i=1;i<=5;i++) o+='<circle cx="800" cy="260" r="'+(i*90+((t*28)%90))+'" fill="none" stroke="#c3cddb" stroke-width="3" opacity="'+(.9-i*.14)+'"/>';
    var g=hcEz(t/3), r=14+g*90, p=1+Math.sin(t*3)*.04*g;
    o+='<circle cx="800" cy="260" r="'+(r*1.6*p)+'" fill="#ffa94d" opacity=".25"/>'+hcModelo('democrito',800,260,r*p);
    o+=hcT(800,455,100,HC.ink,'ÁTOMO','middle',800,'opacity="'+hcEz((t-3.2)/.7)+'"');
    o+=hcT(800,525,44,HC.org,'«a» = sin  ·  «tomo» = corte','middle',800,'opacity="'+hcEz((t-5)/.7)+'"');
    o+=hcT(800,590,56,HC.ink,'= indivisible','middle',800,'opacity="'+hcEz((t-6.5)/.7)+'"');
    return o;
  }
  function s4(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fffaf0"/>', rn=hcRnd(3), C=['#ffa94d','#74c0fc','#8ce99a','#ff8787','#da77f2','#ffd43b'];
    for(var i=0;i<26;i++){ var bx=90+rn()*1420, by=80+rn()*440, ax=40+rn()*60, ay=30+rn()*50, w=.6+rn()*.9, ph=rn()*6;
      var x=bx+ax*Math.sin(t*w+ph), y=by+ay*Math.sin(t*w*.8+ph*1.7), r=22+rn()*16, k=i%4, col=C[i%6];
      if(k===0) o+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+col+'" stroke="#14213d" stroke-width="3"/>';
      else if(k===1) o+='<rect x="'+(x-r).toFixed(1)+'" y="'+(y-r).toFixed(1)+'" width="'+(2*r).toFixed(1)+'" height="'+(2*r).toFixed(1)+'" rx="5" fill="'+col+'" stroke="#14213d" stroke-width="3" transform="rotate('+(t*30*w).toFixed(0)+' '+x.toFixed(1)+' '+y.toFixed(1)+')"/>';
      else if(k===2) o+='<polygon points="'+x.toFixed(1)+','+(y-r*1.2).toFixed(1)+' '+(x+r*1.1).toFixed(1)+','+(y+r*.8).toFixed(1)+' '+(x-r*1.1).toFixed(1)+','+(y+r*.8).toFixed(1)+'" fill="'+col+'" stroke="#14213d" stroke-width="3"/>';
      else o+='<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(r*1.3).toFixed(1)+'" ry="'+(r*.75).toFixed(1)+'" fill="'+col+'" stroke="#14213d" stroke-width="3"/>'; }
    var lab=['Eternos','Indivisibles','Distintas formas','En el vacío'], x2=60;
    lab.forEach(function(L,j){ var a=hcEz((t-.6-j*1.5)/.5), wd=L.length*22+60; o+='<g opacity="'+a+'"><rect x="'+x2+'" y="22" width="'+wd+'" height="62" rx="31" fill="#fff" stroke="#e8590c" stroke-width="5"/>'+hcT(x2+wd/2,65,32,HC.ink,L,'middle',800)+'</g>'; x2+=wd+22; });
    return o;
  }
  function s5(t){
    var o=hcFondoLab(W,H,G)+hcPersona({x:300,y:G+34,tun:LEU.tun,trim:LEU.trim,barba:true,hair:'#adb5bd',gest:t,sc:.9,name:'Leucipo'})+hcPersona({x:1300,y:G+34,tun:DEM.tun,trim:DEM.trim,barba:true,hair:'#6c757d',face:-1,gest:t+1,sc:.9,name:'Demócrito'});
    var k=hcEz(t/1);
    o+='<g transform="translate(800,330) scale('+k+')"><polygon points="-30,-130 30,-130 30,-50 130,100 -130,100 -30,-50" fill="#e7f5ff" stroke="#14213d" stroke-width="7" stroke-linejoin="round"/><polygon points="-72,40 72,40 130,100 -130,100" fill="#74c0fc"/></g>';
    var x=hcEz((t-1.6)/.6); if(x>0) o+='<g opacity="'+x+'" stroke="#e03131" stroke-width="22" stroke-linecap="round"><line x1="680" y1="210" x2="920" y2="450"/><line x1="920" y1="210" x2="680" y2="450"/></g>';
    return o+hcT(800,590,48,HC.ink,'Sin experimentos','middle',800,'opacity="'+hcEz((t-3)/.7)+'"');
  }
  return hcHistoria(box,{titulo:'Demócrito · Antigua Grecia · siglo V a. C.',W:W,H:H,escenas:[
    {d:8,c:'Grecia, hace 2400 años: ¿de qué está hecha la materia?',f:s1},
    {d:9,c:'Imaginaron cortar una piedra una y otra vez…',f:s2},
    {d:9,c:'…hasta llegar a algo que ya no se puede cortar: el átomo.',f:s3},
    {d:8,c:'Todo estaría hecho de átomos que se mueven en el vacío.',f:s4},
    {d:8,c:'Era solo una idea: nadie podía comprobarla con experimentos.',f:s5}]});
}

function c5SimDemocrito(box){
  var M=hcMarco(box,'Demócrito: corta la piedra','Toca «Cortar» y mira qué pasa'), L=hcLienzo(M.esc,1000,520), cx=L.cx, n=0, tc=-9, raf=0, alive=true, bc, br;
  bc=hcBtn(M.ctrl,'Cortar',function(){ if(n<13){ n++; tc=performance.now(); upd(); } },'go'); br=hcBtn(M.ctrl,'Empezar de nuevo',function(){ n=0; tc=-9; upd(); });
  function upd(){
    bc.disabled=(n>=13);
    if(n===0) M.msg('Una piedra. ¿Se podrá cortar <b>para siempre</b>?');
    else if(n<6) M.msg('Cada corte la parte por la mitad: <b>'+Math.pow(2,n)+' trozos</b>.');
    else if(n<10) M.msg('Los trozos ya son muy pequeños… <b>'+Math.pow(2,n)+' trozos</b>.','warn');
    else if(n<13) M.msg('¿Y si seguimos cortando? <b>'+Math.pow(2,n).toLocaleString('es-CL')+' trozos</b>.','warn');
    else M.msg('¡Ya no se puede! Demócrito lo llamó <b>átomo</b>: «indivisible».','ok');
  }
  function frame(now){
    if(!alive) return; raf=requestAnimationFrame(frame); L.begin(); cx.fillStyle='#fff'; cx.fillRect(0,0,1000,520);
    var age=(now-tc)/1000;
    if(n<13){
      var cols=Math.pow(2,Math.ceil(n/2)), rows=Math.pow(2,Math.floor(n/2)), WW=640, HH=400, gap=n>0?Math.max(1.2,10-n*.7)*hcEz(age/.35)+0.6:0;
      var pw=(WW-gap*(cols-1))/cols, ph=(HH-gap*(rows-1))/rows, x0=500-WW/2, y0=260-HH/2;
      cx.fillStyle='#adb5bd'; cx.strokeStyle='#14213d'; cx.lineWidth=n>7?0:3;
      for(var r=0;r<rows;r++) for(var c=0;c<cols;c++){ var px=x0+c*(pw+gap), py=y0+r*(ph+gap); cx.fillRect(px,py,pw,ph); if(n<=7) cx.strokeRect(px,py,pw,ph); }
      if(n===0){ cx.strokeRect(x0,y0,WW,HH); }
      if(n>0&&age<.4){ cx.globalAlpha=1-age/.4; cx.strokeStyle='#e03131'; cx.lineWidth=7; cx.setLineDash([16,10]); cx.beginPath();
        if(n%2===1){ cx.moveTo(500,y0-24); cx.lineTo(500,y0+HH+24); } else { cx.moveTo(x0-24,260); cx.lineTo(x0+WW+24,260); } cx.stroke(); cx.setLineDash([]); cx.globalAlpha=1; }
    } else {
      var p=1+Math.sin(now/300)*.06; cx.fillStyle='rgba(255,169,77,.28)'; cx.beginPath(); cx.arc(500,250,130*p,0,6.2832); cx.fill();
      hcBola(cx,500,250,60*p,'#adb5bd','',null); hcTxtC(cx,'ÁTOMO',500,420,'#14213d',72,'center',800); hcTxtC(cx,'= indivisible',500,480,'#e8590c',44,'center',800);
    }
    hcTxtC(cx,n<13?(Math.pow(2,n)===1?'1 piedra':Math.pow(2,n).toLocaleString('es-CL')+' trozos'):'1 partícula',500,36,'#14213d',40,'center',800);
  }
  upd(); raf=requestAnimationFrame(frame);
  return function stop(){ alive=false; cancelAnimationFrame(raf); L.stop(); M.off(); };
}
