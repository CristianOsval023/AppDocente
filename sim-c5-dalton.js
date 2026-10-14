'use strict';
/* Clase 5 · Estación 2: Dalton (átomos como esferas macizas que se reordenan) */
var C5D_AT={H:[24,'#4dabf7','#14213d',1],O:[32,'#ff6b6b','#14213d',16],C:[30,'#495057','#ffffff',12],N:[30,'#9775fa','#14213d',14],Fe:[44,'#adb5bd','#14213d',56]};
function c5dAt(x,y,tp,sc){ var d=C5D_AT[tp], r=d[0]*(sc||1);
  return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+d[1]+'" stroke="#14213d" stroke-width="3.5"/><ellipse cx="'+(x-r*.3).toFixed(1)+'" cy="'+(y-r*.35).toFixed(1)+'" rx="'+(r*.28)+'" ry="'+(r*.18)+'" fill="#fff" opacity=".55"/>'+hcT(x.toFixed(1),(y+r*.34).toFixed(1),Math.round(r*.95),d[2],tp,'middle',800); }

function c5HistDalton(box){
  var W=1600,H=620,G=500;
  function s1(t){
    var o=hcFondoLab(W,H,G)+'<rect x="860" y="'+(G-150)+'" width="640" height="26" rx="6" fill="#b08a54" stroke="#6f5430" stroke-width="4"/><rect x="890" y="'+(G-124)+'" width="22" height="124" fill="#8a6a3c"/><rect x="1450" y="'+(G-124)+'" width="22" height="124" fill="#8a6a3c"/>';
    [[960,'#74c0fc'],[1090,'#ff8787'],[1220,'#8ce99a']].forEach(function(f){ o+='<polygon points="'+(f[0]-14)+','+(G-250)+' '+(f[0]+14)+','+(G-250)+' '+(f[0]+14)+','+(G-210)+' '+(f[0]+60)+','+(G-150)+' '+(f[0]-60)+','+(G-150)+' '+(f[0]-14)+','+(G-210)+'" fill="'+f[1]+'" stroke="#14213d" stroke-width="5" stroke-linejoin="round"/>'; });
    return o+hcPersona({x:560+Math.sin(t*.9)*6,y:G+34,tun:'#2f5d50',trim:'#1b3a31',hair:'#adb5bd',gest:t,sc:1.05,name:'John Dalton',sub:'Inglaterra · 1766–1844'});
  }
  function balanza(th,izq,der){
    var px=800,py=210,L=340, ex=Math.cos(th)*L, ey=Math.sin(th)*L, o='';
    o+='<polygon points="'+(px-110)+',500 '+(px+110)+',500 '+(px+16)+','+(py+10)+' '+(px-16)+','+(py+10)+'" fill="#c8b98e" stroke="#6f5430" stroke-width="5"/>';
    o+='<line x1="'+(px-ex)+'" y1="'+(py-ey)+'" x2="'+(px+ex)+'" y2="'+(py+ey)+'" stroke="#14213d" stroke-width="14" stroke-linecap="round"/><circle cx="'+px+'" cy="'+py+'" r="20" fill="#f59f00" stroke="#14213d" stroke-width="5"/>';
    [[px-ex,py-ey,izq],[px+ex,py+ey,der]].forEach(function(p){
      o+='<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+(p[0]-95)+'" y2="'+(p[1]+150)+'" stroke="#475569" stroke-width="4"/><line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+(p[0]+95)+'" y2="'+(p[1]+150)+'" stroke="#475569" stroke-width="4"/>';
      o+='<path d="M'+(p[0]-120)+','+(p[1]+150)+' Q'+p[0]+','+(p[1]+215)+' '+(p[0]+120)+','+(p[1]+150)+'Z" fill="#ced4da" stroke="#14213d" stroke-width="5"/>'+p[2](p[0],p[1]+150); });
    return o;
  }
  function s2(t){
    var th=(1-hcEz(t/4.2))*-.16;
    var o=hcFondoLab(W,H,G)+balanza(th,function(x,y){ return c5dAt(x-48,y-24,'H')+c5dAt(x+4,y-24,'H')+c5dAt(x+58,y-30,'O'); },function(x,y){ return '<line x1="'+(x-44)+'" y1="'+(y-38)+'" x2="'+x+'" y2="'+(y-60)+'" stroke="#14213d" stroke-width="6"/><line x1="'+(x+44)+'" y1="'+(y-38)+'" x2="'+x+'" y2="'+(y-60)+'" stroke="#14213d" stroke-width="6"/>'+c5dAt(x,y-60,'O')+c5dAt(x-48,y-26,'H')+c5dAt(x+48,y-26,'H'); });
    o+=hcT(430,120,40,HC.mut,'Antes','middle',800)+hcT(1170,120,40,HC.mut,'Después','middle',800);
    var a=hcEz((t-4.4)/.6); if(a>0) o+=hcT(800,110,110,HC.green,'=','middle',800,'opacity="'+a+'"');
    return o;
  }
  var P3={H0:[[470,320],[740,330]],H1:[[560,430],[860,330]],O:[[360,400],[800,250]]};
  function s3(t){
    var m=hcEz((t-2)/4), o=hcFondoLab(W,H,G).replace(/<rect x="70"[\s\S]*$/,''), k;
    function pos(n){ var a=P3[n][0], b=P3[n][1]; return [a[0]+(b[0]-a[0])*m+Math.sin(t*3+a[1])*7*(1-m), a[1]+(b[1]-a[1])*m+Math.cos(t*2.6+a[0])*7*(1-m)]; }
    var h0=pos('H0'),h1=pos('H1'),ox=pos('O');
    o+='<rect x="130" y="70" width="1340" height="400" rx="26" fill="#fff" stroke="#c3cddb" stroke-width="4"/>';
    if(m>.97) o+='<g stroke="#14213d" stroke-width="12"><line x1="'+ox[0]+'" y1="'+ox[1]+'" x2="'+h0[0]+'" y2="'+h0[1]+'"/><line x1="'+ox[0]+'" y1="'+ox[1]+'" x2="'+h1[0]+'" y2="'+h1[1]+'"/></g>';
    o+=c5dAt(ox[0],ox[1],'O',1.2)+c5dAt(h0[0],h0[1],'H',1.2)+c5dAt(h1[0],h1[1],'H',1.2);
    o+=hcT(300,130,46,HC.mut,'Antes','middle',800)+hcT(1300,130,46,HC.mut,'Después','middle',800);
    var c=hcEz((t-6.3)/.7); o+=hcT(800,540,56,HC.green,'3 átomos antes = 3 átomos después','middle',800,'opacity="'+c+'"');
    return o;
  }
  function s4(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fffaf0"/>', D=[['H','Hidrógeno',330],['O','Oxígeno',650],['C','Carbono',970],['Fe','Hierro',1290]];
    D.forEach(function(d,i){ var k=hcEz((t-.4-i*1.3)/.6); if(k<=0) return; o+='<g transform="translate('+d[2]+',280) scale('+k+')">'+c5dAt(0,0,d[0],2.6)+hcT(0,190,44,HC.ink,d[1],'middle',800)+'</g>'; });
    return o;
  }
  function s5(t){
    var o='<rect width="'+W+'" height="'+H+'" fill="#fffaf0"/>', k=hcEz(t/1);
    o+='<g transform="translate(800,290) scale('+k+')"><circle r="190" fill="#ff922b" stroke="#14213d" stroke-width="8"/><ellipse cx="-70" cy="-80" rx="60" ry="38" fill="#ffe8cc" transform="rotate(-30 -70 -80)"/></g>';
    var a=hcEz((t-1.6)/.6), b=hcEz((t-3.4)/.6);
    o+='<g opacity="'+a+'">'+hcT(300,250,64,HC.ink,'Maciza','middle',800)+'<line x1="420" y1="265" x2="620" y2="295" stroke="#14213d" stroke-width="6"/><polygon points="620,295 596,278 598,306" fill="#14213d"/></g>';
    o+='<g opacity="'+b+'">'+hcT(1300,250,64,HC.ink,'Indivisible','middle',800)+'<line x1="1180" y1="265" x2="980" y2="295" stroke="#14213d" stroke-width="6"/><polygon points="980,295 1004,278 1002,306" fill="#14213d"/></g>';
    return o+hcT(800,590,44,HC.mut,'Átomo de Dalton','middle',800);
  }
  return hcHistoria(box,{titulo:'Dalton · Inglaterra · comienzos del siglo XIX',W:W,H:H,escenas:[
    {d:8,c:'Inglaterra, 1803: John Dalton estudia cómo se combinan las sustancias.',f:s1},
    {d:9,c:'Pesó todo antes y después de reaccionar: la masa no cambia.',f:s2},
    {d:10,c:'Los átomos no se crean ni se destruyen: solo se reordenan.',f:s3},
    {d:8,c:'Cada elemento tiene sus propios átomos, distintos a los demás.',f:s4},
    {d:9,c:'Su modelo: el átomo es una esfera maciza e indivisible.',f:s5}]});
}

/* ---------- Simulador: los átomos se reordenan, la masa se conserva ---------- */
function c5SimDalton(box){
  var RX={
   agua:{n:'Agua',ec:'2 H₂ + O₂ → 2 H₂O',
     t:['O','O','H','H','H','H'],
     a:[[166,400],[234,400],[170,150],[230,150],[170,270],[230,270]],
     b:[[760,176],[760,356],[708,222],[812,222],[708,402],[812,402]],
     bA:[[0,1],[2,3],[4,5]], bB:[[0,2],[0,3],[1,4],[1,5]]},
   co2:{n:'Dióxido de carbono',ec:'C + O₂ → CO₂',
     t:['C','O','O'],
     a:[[200,170],[166,350],[234,350]],
     b:[[760,260],[690,260],[830,260]],
     bA:[[1,2]], bB:[[0,1],[0,2]]},
   nh3:{n:'Amoníaco',ec:'N₂ + 3 H₂ → 2 NH₃',
     t:['N','N','H','H','H','H','H','H'],
     a:[[170,120],[230,120],[170,230],[230,230],[170,330],[230,330],[170,430],[230,430]],
     b:[[700,180],[700,360],[640,228],[760,228],[700,250],[640,408],[760,408],[700,430]],
     bA:[[0,1],[2,3],[4,5],[6,7]], bB:[[0,2],[0,3],[0,4],[1,5],[1,6],[1,7]]}
  };
  var M=hcMarco(box,'Dalton: los átomos se reordenan','Mueve el control «Antes → Después»'), L=hcLienzo(M.esc,1000,520), cx=L.cx, key='agua', v=0, raf=0, alive=true, anim=0, last=0, bs={};
  Object.keys(RX).forEach(function(k){ bs[k]=hcBtn(M.ctrl,RX[k].n,function(){ key=k; mark(); sl.set(0); }); });
  var sl=hcSlider(M.ctrl,'Antes → Después',0,100,1,0,function(x){ v=x/100; msg(); },function(x){ return x+' %'; });
  hcBtn(M.ctrl,'Reaccionar',function(){ anim=v<.5?1:-1; },'go');
  function mark(){ Object.keys(bs).forEach(function(k){ bs[k].className='hc-btn'+(k===key?' on':''); }); }
  function msg(){
    if(v<.02) M.msg('<b>Antes:</b> mira los átomos. Ahora mueve el control.');
    else if(v>.98) M.msg('<b>Después:</b> son los mismos átomos y pesan lo mismo. ¡La masa se conserva!','ok');
    else M.msg('Los átomos <b>no desaparecen</b>: solo cambian de lugar…','warn');
  }
  function masa(){ var m=0; RX[key].t.forEach(function(t){ m+=C5D_AT[t][3]; }); return m; }
  function frame(now){
    if(!alive) return; raf=requestAnimationFrame(frame); var dt=Math.min((now-last)/1000,.05); last=now;
    if(anim){ var nv=hcCl(v+anim*dt*.45,0,1); if(nv===0||nv===1) anim=0; sl.set(Math.round(nv*100)); v=nv; }
    var R=RX[key], e=hcEz(v), P=R.t.map(function(_,i){ var a=R.a[i], b=R.b[i], w=Math.sin(Math.PI*v)*10; return [a[0]+(b[0]-a[0])*e+Math.sin(now/260+i*2)*w*.6, a[1]+(b[1]-a[1])*e+Math.cos(now/300+i)*w*.6]; });
    L.begin(); cx.fillStyle='#fff'; cx.fillRect(0,0,1000,520);
    [[30,'ANTES'],[580,'DESPUÉS']].forEach(function(p){ cx.fillStyle='#f1f5f9'; cx.strokeStyle='#c3cddb'; cx.lineWidth=3; cx.fillRect(p[0],20,390,452); cx.strokeRect(p[0],20,390,452); hcTxtC(cx,p[1],p[0]+195,48,'#14213d',32,'center',800); hcTxtC(cx,R.t.length+' átomos · masa '+masa(),p[0]+195,80,'#475569',24,'center',800); });
    hcTxtC(cx,'→',500,260,'#94a3b8',90,'center',800); hcTxtC(cx,R.ec,500,500,'#14213d',26,'center',800);
    cx.lineCap='round';
    function bonds(lst,al){ if(al<=0) return; cx.globalAlpha=al; cx.strokeStyle='#14213d'; cx.lineWidth=11; lst.forEach(function(q){ cx.beginPath(); cx.moveTo(P[q[0]][0],P[q[0]][1]); cx.lineTo(P[q[1]][0],P[q[1]][1]); cx.stroke(); }); cx.globalAlpha=1; }
    bonds(R.bA,1-hcCl(v*14,0,1)); bonds(R.bB,hcCl((v-.86)*14,0,1));
    R.t.forEach(function(tp,i){ var d=C5D_AT[tp]; hcBola(cx,P[i][0],P[i][1],d[0],d[1],tp,d[2]); });
  }
  mark(); msg(); raf=requestAnimationFrame(function(n){ last=n; frame(n); });
  return function stop(){ alive=false; cancelAnimationFrame(raf); L.stop(); M.off(); };
}
