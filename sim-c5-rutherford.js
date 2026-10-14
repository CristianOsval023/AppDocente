'use strict';
/* Clase 5 · Estación 4: Rutherford (el núcleo atómico) */
function c5HistRutherford(box){
  var W=1600,H=620,G=500, NUC=[190,310,430];
  function s1(t){
    var o=hcFondoLab(W,H,G)+hcPersona({x:560,y:G+34,tun:'#845ef7',trim:'#5f3dc4',hair:'#868e96',bigote:true,gest:t,sc:1.05,name:'Ernest Rutherford',sub:'Inglaterra · 1871–1937'})
      +hcPersona({x:1030,y:G+34,tun:'#20c997',trim:'#087f5b',hair:'#6f4a2d',face:-1,gest:t+1,sc:.88,name:'Hans Geiger'})+hcPersona({x:1290,y:G+34,tun:'#fd7e14',trim:'#c2410c',hair:'#e9b872',face:-1,gest:t+2,sc:.82,name:'Ernest Marsden'});
    var b=hcEz((t-3.5)/.7); if(b>0) o+='<g transform="translate(760,140) scale('+b+')"><ellipse rx="190" ry="78" fill="#fff" stroke="#14213d" stroke-width="6"/>'+hcT(0,24,66,HC.org,'¿Thomson?','middle',800)+'</g>';
    return o;
  }
  function montaje(modelo){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/><rect x="110" y="250" width="170" height="120" rx="14" fill="#ced4da" stroke="#14213d" stroke-width="6"/><polygon points="280,285 340,305 340,315 280,335" fill="#868e96" stroke="#14213d" stroke-width="4"/>'+hcT(195,420,34,HC.ink,'Fuente de','middle',800)+hcT(195,458,34,HC.ink,'partículas α (+)','middle',800);
    o+='<rect x="1430" y="110" width="26" height="400" rx="8" fill="#b2f2bb" stroke="#14213d" stroke-width="5"/>';
    if(modelo==='thomson') NUC.forEach(function(y){ o+=hcModelo('thomson',800,y,52); });
    else NUC.forEach(function(y){ o+='<circle cx="800" cy="'+y+'" r="52" fill="none" stroke="#adb5bd" stroke-width="3" stroke-dasharray="9 8"/><circle cx="800" cy="'+y+'" r="7" fill="'+HC.p+'" stroke="#14213d" stroke-width="2"/>'; });
    o+='<rect x="788" y="100" width="24" height="420" fill="#f1c40f" opacity=".35"/>'+hcT(800,80,36,HC.ink,'Lámina de oro','middle',800);
    return o;
  }
  function alfa(x,y){ return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="11" fill="#fa5252" stroke="#14213d" stroke-width="3"/>'; }
  /* partícula i en el instante t: ciclo de 2.4 s. fate: 0 pasa, 1 se desvía, 2 rebota */
  function trayA(t,i,y0,fate,ang){
    var u=((t*.42+i*.137)%1), xF=800, x=330+u*1070*1, y=y0;
    var tf=(xF-330)/1070; if(u<tf) return [330+u/tf*(xF-330),y0];
    var d=(u-tf)/(1-tf)*600;
    if(fate===0) return [xF+d*1.0,y0];
    var a=ang*Math.PI/180; if(fate===2) return [xF-d*Math.cos(.35)*.9,y0-d*Math.sin(.35)*(ang>0?1:-1)*.9];
    return [xF+d*Math.cos(a),y0-d*Math.sin(a)];
  }
  function s2(t){ var o=montaje('thomson'); for(var i=0;i<6;i++){ var u=((t*.5+i/6)%1), x=340+u*1050; var y=[150,230,310,390,470,310][i]; o+=alfa(x,y);} return o; }
  function s3(t){
    var o=montaje('thomson')+hcT(800,590,42,HC.mut,'Lo que se esperaba','middle',800);
    for(var i=0;i<9;i++){ var u=((t*.45+i/9)%1), x=340+u*1090, y=130+i*44; o+='<line x1="'+(x-60)+'" y1="'+y+'" x2="'+x+'" y2="'+(y+(x>800?(i%3-1)*3:0))+'" stroke="#fa5252" stroke-width="5" opacity=".5"/>'+alfa(x,y+(x>800?(i%3-1)*3:0)); }
    return o;
  }
  function s4(t){
    var o=montaje('rutherford')+hcT(800,590,42,HC.red,'¡Algunas rebotaron!','middle',800);
    var F=[[130,0,0],[190,1,28],[250,0,0],[312,2,1],[372,0,0],[430,1,-24],[470,0,0],[308,2,-1],[160,0,0]];
    F.forEach(function(f,i){ var p=trayA(t,i,f[0],f[1],f[2]||1); var q=trayA(t-.12,i,f[0],f[1],f[2]||1);
      if(Math.hypot(p[0]-q[0],p[1]-q[1])<200) o+='<line x1="'+q[0].toFixed(1)+'" y1="'+q[1].toFixed(1)+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'" stroke="'+(f[1]?'#e8590c':'#fa5252')+'" stroke-width="6" opacity=".6"/>'; o+=alfa(p[0],p[1]); });
    var b=hcEz((t-3)/.6)*(1+Math.sin(t*10)*.04); o+='<g transform="translate(560,200) scale('+b+')"><circle r="60" fill="#fff3bf" stroke="#f59f00" stroke-width="6"/>'+hcT(0,26,76,HC.red,'!','middle',800)+'</g>';
    return o;
  }
  function s5(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>';
    o+='<circle cx="800" cy="300" r="270" fill="#fff" stroke="#adb5bd" stroke-width="5" stroke-dasharray="14 10"/><circle cx="800" cy="300" r="12" fill="'+HC.p+'" stroke="#14213d" stroke-width="3"/>';
    [[.9,.4],[.75,2.4],[.98,4.1],[.62,5.4]].forEach(function(q){ var a=q[1]+t*.7; o+='<circle cx="'+(800+Math.cos(a)*270*q[0]).toFixed(1)+'" cy="'+(300+Math.sin(a)*270*q[0]).toFixed(1)+'" r="16" fill="'+HC.e+'" stroke="#14213d" stroke-width="3"/>'; });
    var a=hcEz((t-1.2)/.6), b=hcEz((t-3.2)/.6), c=hcEz((t-5.4)/.6);
    o+='<g opacity="'+a+'">'+hcT(1190,170,56,HC.p,'Núcleo (+)','start',800)+hcT(1190,214,34,HC.mut,'pequeño y pesado','start',700)+'<line x1="1180" y1="180" x2="818" y2="292" stroke="#14213d" stroke-width="5"/></g>';
    o+='<g opacity="'+b+'">'+hcT(170,150,56,HC.ink,'Casi todo es vacío','start',800)+'<line x1="520" y1="175" x2="620" y2="270" stroke="#14213d" stroke-width="5"/></g>';
    o+='<g opacity="'+c+'">'+hcT(1190,480,52,HC.e,'Electrones (−)','start',800)+hcT(1190,520,34,HC.mut,'alrededor del núcleo','start',700)+'</g>';
    return o;
  }
  return hcHistoria(box,{titulo:'Rutherford · Inglaterra · 1909–1911',W:W,H:H,escenas:[
    {d:8,c:'Inglaterra, 1909–1911: Rutherford quiere comprobar el modelo de Thomson.',f:s1},
    {d:8,c:'Disparó partículas contra una lámina de oro muy delgada.',f:s2},
    {d:8,c:'Esperaba que todas la atravesaran casi derechas.',f:s3},
    {d:9,c:'¡Pero algunas se desviaron o rebotaron hacia atrás!',f:s4},
    {d:10,c:'Conclusión: el átomo es casi vacío y tiene un núcleo pequeño y positivo.',f:s5}]});
}

/* ---------- Simulador: lámina de oro ---------- */
function c5SimRutherford(box){
  var M=hcMarco(box,'Rutherford: lámina de oro','Elige un modelo y pulsa «Disparar»'), L=hcLienzo(M.esc,1000,520), cx=L.cx;
  var modo='thomson', fire=false, P=[], marks=[], N={t:0,p:0,d:0,r:0}, raf=0, alive=true, last=0, acc=0, bT, bR, bF;
  var NUC=[]; for(var k=0;k<5;k++){ NUC.push([470,70+90*k]); NUC.push([530,115+90*k]); }
  var V=520, KK=V*V*0.5;
  bT=hcBtn(M.ctrl,'Modelo de Thomson',function(){ set('thomson'); }); bR=hcBtn(M.ctrl,'Modelo de Rutherford',function(){ set('rutherford'); });
  bF=hcBtn(M.ctrl,'Disparar',function(){ fire=!fire; bF.textContent=fire?'Detener':'Disparar'; },'go');
  hcBtn(M.ctrl,'Borrar conteo',function(){ N={t:0,p:0,d:0,r:0}; marks=[]; P=[]; msg(); });
  function set(m){ modo=m; bT.className='hc-btn'+(m==='thomson'?' on':''); bR.className='hc-btn'+(m==='rutherford'?' on':''); N={t:0,p:0,d:0,r:0}; marks=[]; P=[]; msg(); }
  function msg(){
    if(N.t<20) M.msg(modo==='thomson'?'Con el modelo de <b>Thomson</b> se esperaba que casi todas pasen derechas.':'Con el modelo de <b>Rutherford</b>: ¿qué pasará? Dispara varias partículas.');
    else if(modo==='thomson') M.msg('Con Thomson: <b>todas</b> pasan casi derechas. Ahora prueba el modelo de Rutherford.','');
    else if(N.r>0) M.msg('¡Algunas <b>rebotan</b>! Algo muy pequeño, pesado y positivo las frena: el <b>núcleo</b>.','ok');
    else M.msg('Casi todas pasan: el átomo es <b>casi vacío</b>. Sigue disparando para ver si alguna rebota.','warn');
  }
  function exit(p){
    var ang=Math.abs(Math.atan2(p.vy,p.vx))*180/Math.PI; N.t++;
    if(ang<20) N.p++; else if(ang<90){ N.d++; marks.push({pts:p.path,c:'#e8590c',t:performance.now()}); } else { N.r++; marks.push({pts:p.path,c:'#c92a2a',t:performance.now()}); }
    if(N.t%10===0||N.r===1) msg();
  }
  function step(p,dt){
    if(modo==='rutherford' && p.x>380 && p.x<620){
      var rem=dt, g=0;
      while(rem>0 && g++<400){
        var best=1e9, bx=0, by=0;
        for(var i=0;i<NUC.length;i++){ var dx=p.x-NUC[i][0], dy=p.y-NUC[i][1]; if(Math.abs(dx)>70||Math.abs(dy)>70) continue; var d2=dx*dx+dy*dy; if(d2<best){ best=d2; bx=dx; by=dy; } }
        if(best>=1e8){ p.x+=p.vx*rem; p.y+=p.vy*rem; rem=0; break; }
        var d=Math.sqrt(best+.15), sp=Math.hypot(p.vx,p.vy), h=hcCl(0.04*Math.max(d,1)/sp,0.00002,0.004); if(h>rem) h=rem;
        var a=KK/(d*d*d); p.vx+=bx*a*h; p.vy+=by*a*h;
        p.x+=p.vx*h; p.y+=p.vy*h; rem-=h;
      }
    } else {
      if(modo==='thomson' && p.x>440 && p.x<560 && !p.kick){ p.kick=1; p.vy+=(Math.random()-.5)*12; }
      p.x+=p.vx*dt; p.y+=p.vy*dt;
    }
  }
  function frame(now){
    if(!alive) return; raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now;
    if(fire){ acc+=dt; while(acc>.03){ acc-=.03; var y0=45+Math.random()*430; P.push({x:96,y:y0,vx:V,vy:0,path:[[96,y0]]}); } }
    P.forEach(function(p){ step(p,dt); if(!p.path.length||Math.abs(p.x-p.path[p.path.length-1][0])+Math.abs(p.y-p.path[p.path.length-1][1])>14) p.path.push([p.x,p.y]);
      if(p.x>960||p.x<10||p.y<-20||p.y>540){ p.dead=true; p.path.push([p.x,p.y]); exit(p); } });
    P=P.filter(function(p){ return !p.dead; }); marks=marks.filter(function(m){ return now-m.t<2600; }); while(marks.length>6) marks.shift();
    L.begin(); cx.fillStyle='#fff'; cx.fillRect(0,0,1000,520);
    cx.fillStyle='#ced4da'; cx.strokeStyle='#14213d'; cx.lineWidth=4; cx.fillRect(10,215,86,90); cx.strokeRect(10,215,86,90); hcTxtC(cx,'Fuente α',53,330,'#14213d',22,'center',800);
    cx.fillStyle='rgba(241,196,15,.28)'; cx.fillRect(448,30,104,490); hcTxtC(cx,'Lámina de oro',500,18,'#92400e',22,'center',800);
    NUC.forEach(function(n){
      if(modo==='thomson'){ cx.fillStyle='#ffc9c9'; cx.strokeStyle='#14213d'; cx.lineWidth=2.5; cx.beginPath(); cx.arc(n[0],n[1],33,0,6.2832); cx.fill(); cx.stroke(); cx.fillStyle='#1c7ed6'; [[-12,-9],[10,-14],[-4,12],[15,8]].forEach(function(q){ cx.beginPath(); cx.arc(n[0]+q[0],n[1]+q[1],4.5,0,6.2832); cx.fill(); }); }
      else { cx.strokeStyle='#adb5bd'; cx.lineWidth=2; cx.setLineDash([6,6]); cx.beginPath(); cx.arc(n[0],n[1],33,0,6.2832); cx.stroke(); cx.setLineDash([]); cx.fillStyle='#e03131'; cx.strokeStyle='#14213d'; cx.lineWidth=2; cx.beginPath(); cx.arc(n[0],n[1],5.5,0,6.2832); cx.fill(); cx.stroke(); }
    });
    marks.forEach(function(m){ var f=1-(now-m.t)/2600; cx.globalAlpha=.75*f; cx.strokeStyle=m.c; cx.lineWidth=4; cx.beginPath(); m.pts.forEach(function(q,i){ if(i) cx.lineTo(q[0],q[1]); else cx.moveTo(q[0],q[1]); }); cx.stroke(); cx.globalAlpha=1; });
    P.forEach(function(p){ var ang=Math.abs(Math.atan2(p.vy,p.vx))*180/Math.PI; cx.fillStyle=ang<20?'#1971c2':(ang<90?'#e8590c':'#c92a2a'); cx.beginPath(); cx.arc(p.x,p.y,6,0,6.2832); cx.fill(); });
    /* marcador */
    cx.fillStyle='#fff'; cx.strokeStyle='#c3cddb'; cx.lineWidth=3; cx.fillRect(700,16,290,150); cx.strokeRect(700,16,290,150);
    hcTxtC(cx,'Pasan derecho: '+N.p,715,46,'#1971c2',26,'left',800); hcTxtC(cx,'Se desvían: '+N.d,715,86,'#e8590c',26,'left',800); hcTxtC(cx,'Rebotan: '+N.r,715,126,'#c92a2a',26,'left',800);
  }
  set('thomson'); raf=requestAnimationFrame(function(n){ last=n; frame(n); });
  return function stop(){ alive=false; cancelAnimationFrame(raf); L.stop(); M.off(); };
}
