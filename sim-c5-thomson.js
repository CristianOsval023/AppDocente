'use strict';
/* Clase 5 · Estación 3: Thomson (el electrón y el "budín de pasas") */
function c5HistThomson(box){
  var W=1600,H=620,G=500;
  function tubo(x0,x1,y0,y1){ return '<rect x="'+x0+'" y="'+y0+'" width="'+(x1-x0)+'" height="'+(y1-y0)+'" rx="'+Math.min(60,(y1-y0)/2)+'" fill="#eef7ff" stroke="#14213d" stroke-width="7"/>'; }
  function s1(t){
    var o=hcFondoLab(W,H,G)+'<rect x="820" y="'+(G-150)+'" width="680" height="26" rx="6" fill="#b08a54" stroke="#6f5430" stroke-width="4"/><rect x="850" y="'+(G-124)+'" width="22" height="124" fill="#8a6a3c"/><rect x="1450" y="'+(G-124)+'" width="22" height="124" fill="#8a6a3c"/>';
    o+=tubo(900,1420,G-250,G-160)+'<rect x="906" y="'+(G-224)+'" width="14" height="38" fill="#1c7ed6"/><rect x="1400" y="'+(G-224)+'" width="14" height="38" fill="#e03131"/><line x1="930" y1="'+(G-205)+'" x2="1385" y2="'+(G-205)+'" stroke="#74c0fc" stroke-width="'+(5+Math.sin(t*9)*2)+'" stroke-dasharray="26 18" stroke-dashoffset="'+(-t*220)+'"/>';
    return o+hcPersona({x:520+Math.sin(t*.9)*6,y:G+34,tun:'#5c7cfa',trim:'#364fc7',hair:'#6c757d',bigote:true,gest:t,sc:1.05,name:'J. J. Thomson',sub:'Inglaterra · 1856–1940'});
  }
  function base(t,placas){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>'+tubo(130,1470,150,470);
    o+='<rect x="150" y="250" width="26" height="120" rx="6" fill="#1c7ed6" stroke="#14213d" stroke-width="4"/>'+hcT(163,235,44,HC.e,'−','middle',800);
    o+='<rect x="480" y="200" width="22" height="82" fill="#e03131" stroke="#14213d" stroke-width="4"/><rect x="480" y="338" width="22" height="82" fill="#e03131" stroke="#14213d" stroke-width="4"/>'+hcT(491,180,44,HC.p,'+','middle',800);
    o+='<rect x="1400" y="170" width="30" height="280" rx="8" fill="#b2f2bb" stroke="#14213d" stroke-width="4"/>';
    o+=hcT(163,520,34,HC.mut,'Cátodo','middle',800)+hcT(491,520,34,HC.mut,'Ánodo','middle',800)+hcT(1415,520,34,HC.mut,'Pantalla','middle',800);
    return o;
  }
  function trayecto(k){ /* y del rayo según x; k = 0..1 intensidad de la desviación */
    var pts=[]; for(var x=190;x<=1400;x+=20){ var y=310; if(x>780&&x<=1060) y=310-k*.0006*Math.pow(x-780,2); else if(x>1060) y=310-k*(.0006*Math.pow(280,2)+.0006*2*280*(x-1060)); pts.push(x+','+y.toFixed(1)); }
    return pts.join(' ');
  }
  function s2(t){
    var o=base(t)+'<polyline points="'+trayecto(0)+'" fill="none" stroke="#a5d8ff" stroke-width="18" opacity=".6" stroke-linecap="round"/><polyline points="'+trayecto(0)+'" fill="none" stroke="#1971c2" stroke-width="6" stroke-dasharray="30 20" stroke-dashoffset="'+(-t*300)+'"/>';
    return o+'<circle cx="1400" cy="310" r="'+(26+Math.sin(t*8)*4)+'" fill="#37b24d" opacity=".55"/>';
  }
  function s3(t){
    var k=hcEz((t-1.8)/1.4), o=base(t);
    o+='<rect x="800" y="188" width="260" height="22" fill="#e03131" stroke="#14213d" stroke-width="4" opacity="'+hcEz((t-1)/.5)+'"/><rect x="800" y="410" width="260" height="22" fill="#1c7ed6" stroke="#14213d" stroke-width="4" opacity="'+hcEz((t-1)/.5)+'"/>';
    o+=hcT(930,165,46,HC.p,'+','middle',800,'opacity="'+hcEz((t-1)/.5)+'"')+hcT(930,468,46,HC.e,'−','middle',800,'opacity="'+hcEz((t-1)/.5)+'"');
    var yEnd=310-k*(.0006*280*280+.0006*2*280*340);
    o+='<polyline points="'+trayecto(k)+'" fill="none" stroke="#a5d8ff" stroke-width="18" opacity=".6" stroke-linecap="round"/><polyline points="'+trayecto(k)+'" fill="none" stroke="#1971c2" stroke-width="6" stroke-dasharray="30 20" stroke-dashoffset="'+(-t*300)+'"/>';
    return o+'<circle cx="1400" cy="'+yEnd.toFixed(1)+'" r="'+(26+Math.sin(t*8)*4)+'" fill="#37b24d" opacity=".55"/>';
  }
  function s4(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>'+hcModelo('thomson',420,310,200);
    for(var i=0;i<6;i++){ var p=((t*.45+i/6)%1), x=420+p*1000, y=310+Math.sin(i*2.1)*60*p, a=p<.12?p/.12:1;
      o+='<g opacity="'+a+'"><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="26" fill="'+HC.e+'" stroke="#14213d" stroke-width="4"/>'+hcT(x.toFixed(1),(y+12).toFixed(1),40,'#fff','−','middle',800)+'</g>'; }
    var l=hcEz((t-3)/.6); o+='<g opacity="'+l+'">'+hcT(1200,140,60,HC.e,'Electrones','middle',800)+hcT(1200,200,36,HC.mut,'partículas con carga negativa','middle',700)+'</g>';
    return o;
  }
  function s5(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fbf4e6"/>', k=hcEz(t/.8), j=hcEz((t-1.6)/.8);
    o+='<g opacity="'+k+'"><ellipse cx="450" cy="470" rx="250" ry="42" fill="#ced4da" stroke="#14213d" stroke-width="5"/><path d="M230,450 Q230,190 450,190 Q670,190 670,450 Z" fill="#ffc9c9" stroke="#14213d" stroke-width="6"/>';
    [[350,330],[450,280],[540,350],[400,400],[500,420],[310,420],[590,430]].forEach(function(p){ o+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="18" ry="12" fill="#6f4a2d" stroke="#14213d" stroke-width="2"/>'; });
    o+=hcT(450,560,42,HC.ink,'Un budín con pasas','middle',800)+'</g>';
    o+=hcT(800,330,110,HC.mut,'≈','middle',800,'opacity="'+j+'"');
    o+='<g opacity="'+j+'">'+hcModelo('thomson',1150,320,200)+hcT(1150,560,42,HC.ink,'Átomo de Thomson','middle',800)+'</g>';
    var l=hcEz((t-3.6)/.6); o+='<g opacity="'+l+'"><rect x="1000" y="30" width="30" height="30" rx="6" fill="#ffc9c9" stroke="#14213d" stroke-width="3"/>'+hcT(1044,56,32,HC.ink,'Carga positiva (+)','start',700)+'<circle cx="1015" cy="92" r="14" fill="'+HC.e+'"/>'+hcT(1044,102,32,HC.ink,'Electrones (−)','start',700)+'</g>';
    return o;
  }
  return hcHistoria(box,{titulo:'Thomson · Inglaterra · 1897',W:W,H:H,escenas:[
    {d:8,c:'Inglaterra, 1897: J. J. Thomson investiga rayos dentro de un tubo.',f:s1},
    {d:8,c:'Un rayo viaja del polo negativo (−) al polo positivo (+).',f:s2},
    {d:10,c:'Con placas eléctricas, el rayo se dobla hacia la placa positiva (+).',f:s3},
    {d:9,c:'Conclusión: el rayo son partículas negativas, ¡los electrones!',f:s4},
    {d:9,c:'Su modelo: una esfera positiva con electrones, como un budín con pasas.',f:s5}]});
}

function c5SimThomson(box){
  var M=hcMarco(box,'Thomson: tubo de rayos','Mueve el control de las placas'), L=hcLienzo(M.esc,1000,520), cx=L.cx, val=0, on=true, P=[], I=[], raf=0, alive=true, last=0, acc=0, bt;
  var sl=hcSlider(M.ctrl,'Placas  − ⟷ +',-100,100,5,0,function(x){ val=x; msg(); },function(x){ return x===0?'apagadas':(x>0?'+ arriba':'+ abajo'); });
  bt=hcBtn(M.ctrl,'Apagar rayo',function(){ on=!on; bt.textContent=on?'Apagar rayo':'Encender rayo'; });
  function msg(){
    if(val===0) M.msg('Sin placas, el rayo va <b>derecho</b>.');
    else if(val>0) M.msg('La placa <b>+</b> está arriba y el rayo <b>sube</b>: lo atrae. ¡Tiene carga <b>negativa</b>!','ok');
    else M.msg('Ahora la placa <b>+</b> está abajo y el rayo <b>baja</b>: ¡siempre hacia el +!','ok');
  }
  function frame(now){
    if(!alive) return; raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now;
    if(on){ acc+=dt; while(acc>.018){ acc-=.018; P.push({x:215,y:260+(Math.random()-.5)*6,vy:0}); } }
    var ay=-1.9*val;
    P.forEach(function(p){ p.x+=380*dt; if(p.x>450&&p.x<650){ p.vy+=ay*dt; } p.y+=p.vy*dt; if(p.x>=925){ p.hit=true; I.push({y:p.y,t:now}); } });
    P=P.filter(function(p){ return !p.hit; }); I=I.filter(function(i){ return now-i.t<500; });
    L.begin(); cx.fillStyle='#fff'; cx.fillRect(0,0,1000,520);
    cx.fillStyle='#eef7ff'; cx.strokeStyle='#14213d'; cx.lineWidth=6; cx.beginPath(); cx.roundRect?cx.roundRect(40,100,920,320,60):cx.rect(40,100,920,320); cx.fill(); cx.stroke();
    cx.fillStyle='#1c7ed6'; cx.fillRect(58,215,16,90); hcTxtC(cx,'−',66,196,'#1c7ed6',40,'center',800); hcTxtC(cx,'Cátodo',66,452,'#475569',24,'center',700);
    cx.fillStyle='#e03131'; cx.fillRect(190,170,14,70); cx.fillRect(190,280,14,70); hcTxtC(cx,'+',197,150,'#e03131',40,'center',800); hcTxtC(cx,'Ánodo',197,452,'#475569',24,'center',700);
    cx.fillStyle='#b2f2bb'; cx.fillRect(932,125,22,270); hcTxtC(cx,'Pantalla',943,452,'#475569',24,'center',700);
    var a=Math.abs(val)/100, top=val>0?'#e03131':(val<0?'#1c7ed6':'#adb5bd'), bot=val>0?'#1c7ed6':(val<0?'#e03131':'#adb5bd');
    cx.fillStyle=top; cx.strokeStyle='#14213d'; cx.lineWidth=3; cx.fillRect(450,118,200,20); cx.strokeRect(450,118,200,20); cx.fillStyle=bot; cx.fillRect(450,382,200,20); cx.strokeRect(450,382,200,20);
    if(val!==0){ hcTxtC(cx,val>0?'+':'−',420,128,top,44,'center',800); hcTxtC(cx,val>0?'−':'+',420,392,bot,44,'center',800); }
    hcTxtC(cx,'Placas',550,450,'#475569',24,'center',700);
    P.forEach(function(p){ cx.fillStyle='rgba(25,113,194,.9)'; cx.beginPath(); cx.arc(p.x,p.y,4,0,6.2832); cx.fill(); });
    I.forEach(function(i){ var f=1-(now-i.t)/500; cx.fillStyle='rgba(55,178,77,'+(.5*f)+')'; cx.beginPath(); cx.arc(943,i.y,16,0,6.2832); cx.fill(); });
    if(!on) hcTxtC(cx,'Rayo apagado',500,260,'#94a3b8',34,'center',800);
  }
  msg(); raf=requestAnimationFrame(function(n){ last=n; frame(n); });
  return function stop(){ alive=false; cancelAnimationFrame(raf); L.stop(); M.off(); };
}
