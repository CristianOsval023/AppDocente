'use strict';
/* Clase 5 · Inicio: ¿cómo se comportan los átomos al variar la temperatura? */
function c5Temperatura(box){
  var M=hcMarco(box,'Átomos y temperatura','Mueve el control y mira los átomos');
  var L=hcLienzo(M.esc,1000,520), cx=L.cx, T=25, raf=0, alive=true, last=0, rn=hcRnd(5), A=[], i;
  for(i=0;i<34;i++){ var a=rn()*6.283; A.push({x:70+rn()*580,y:70+rn()*370,dx:Math.cos(a),dy:Math.sin(a),k:.6+rn()*.8}); }
  var sl=hcSlider(M.ctrl,'Temperatura',-50,150,5,25,function(v){ T=v; txt(); },function(v){ return v+' °C'; });
  [['Frío',-40],['Tibio',25],['Caliente',130]].forEach(function(p){ hcBtn(M.ctrl,p[0],function(){ sl.set(p[1]); }); });
  function vel(){ return 22+250*Math.sqrt((T+50)/200); }
  function txt(){
    if(T<10) M.msg('Frío: los átomos se mueven <b>despacio</b>.');
    else if(T<70) M.msg('Tibio: los átomos se mueven a <b>velocidad media</b>.','warn');
    else M.msg('Caliente: los átomos se mueven <b>muy rápido</b>.','bad');
  }
  function hue(){ return Math.round(210+155*(T+50)/200); }
  function frame(now){
    if(!alive) return; raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now; var v=vel();
    L.begin();
    cx.fillStyle='#fff'; cx.fillRect(0,0,1000,520);
    cx.fillStyle='#f8fafc'; cx.strokeStyle='#14213d'; cx.lineWidth=6; cx.fillRect(40,40,640,440); cx.strokeRect(40,40,640,440);
    var col='hsl('+hue()+',80%,52%)';
    A.forEach(function(p){
      p.x+=p.dx*v*p.k*dt; p.y+=p.dy*v*p.k*dt;
      if(p.x<62){ p.x=62; p.dx=Math.abs(p.dx); } if(p.x>658){ p.x=658; p.dx=-Math.abs(p.dx); }
      if(p.y<62){ p.y=62; p.dy=Math.abs(p.dy); } if(p.y>458){ p.y=458; p.dy=-Math.abs(p.dy); }
      hcBola(cx,p.x,p.y,19,col,'',null);
    });
    /* termómetro */
    var f=(T+50)/200, x0=840, y0=40, hh=330;
    cx.fillStyle='#fff'; cx.strokeStyle='#14213d'; cx.lineWidth=6;
    cx.beginPath(); cx.moveTo(x0-24,y0+14); cx.arc(x0,y0+14,24,Math.PI,0); cx.lineTo(x0+24,y0+hh); cx.lineTo(x0-24,y0+hh); cx.closePath(); cx.fill(); cx.stroke();
    cx.beginPath(); cx.arc(x0,y0+hh+30,44,0,6.2832); cx.fill(); cx.stroke();
    cx.fillStyle=col; cx.beginPath(); cx.arc(x0,y0+hh+30,34,0,6.2832); cx.fill();
    var top=y0+hh-f*(hh-20); cx.fillRect(x0-13,top,26,y0+hh+4-top);
    cx.strokeStyle='#14213d'; cx.lineWidth=3; cx.fillStyle='#14213d';
    for(var tk=-50;tk<=150;tk+=50){ var yy=y0+hh-((tk+50)/200)*(hh-20); cx.beginPath(); cx.moveTo(x0+28,yy); cx.lineTo(x0+46,yy); cx.stroke(); hcTxtC(cx,tk,x0+88,yy,'#475569',24,'center',700); }
    hcTxtC(cx,T+' °C',x0,y0+hh+104,'#14213d',44,'center',800);
  }
  txt(); raf=requestAnimationFrame(function(n){ last=n; frame(n); });
  return function stop(){ alive=false; cancelAnimationFrame(raf); L.stop(); M.off(); };
}
