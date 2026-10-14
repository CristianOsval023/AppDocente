'use strict';
var app = document.getElementById('app');
function el(tag, cls, txt){ var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }
function crumb(parts){
  var c = el('nav','crumb'); c.setAttribute('aria-label','Ubicación');
  parts.forEach(function(p,i){
    if(i) c.appendChild(el('span',null,'/'));
    if(p.go){ var b=el('button',null,p.t); b.onclick=function(){ location.hash=p.go; }; c.appendChild(b); }
    else c.appendChild(el('span',null,p.t));
  });
  return c;
}
function viewLevels(){
  app.innerHTML='';
  app.appendChild(crumb([{t:'Niveles'}]));
  app.appendChild(el('h2',null,'Elige tu nivel'));
  app.appendChild(el('p','lead','Selecciona un nivel para ver sus cuatro unidades.'));
  var g=el('div','grid levels');
  CURR.forEach(function(l){
    var b=el('button','card'); b.appendChild(el('span','big',l.big)); b.appendChild(el('span','sm',l.sm)); b.appendChild(el('span','sub',l.sub));
    b.onclick=function(){ location.hash='#/'+l.id; }; g.appendChild(b);
  });
  app.appendChild(g);
}
function viewUnits(l){
  app.innerHTML='';
  app.appendChild(crumb([{t:'Niveles',go:'#/'},{t:l.big+' '+l.sm}]));
  app.appendChild(el('h2',null,l.big+' '+l.sm));
  app.appendChild(el('p','lead','Elige una unidad.'));
  var g=el('div','grid units');
  l.units.forEach(function(u,i){
    var b=el('button','card'+(u.pend?' pend':''));
    b.appendChild(el('span','tag','Unidad '+(i+1))); b.appendChild(el('h3',null,u.t));
    if(u.d) b.appendChild(el('span','sub',u.d));
    if(u.oas) b.appendChild(el('span','sub',u.oas.length+' objetivos de aprendizaje')); else if(!u.sims.length) b.appendChild(el('span','soon','Próximamente'));
    b.onclick=function(){ location.hash='#/'+l.id+'/'+(i+1); }; g.appendChild(b);
  });
  app.appendChild(g);
}
function viewUnit(l,i){
  var u=l.units[i];
  app.innerHTML='';
  app.appendChild(crumb([{t:'Niveles',go:'#/'},{t:l.big+' '+l.sm,go:'#/'+l.id},{t:'Unidad '+(i+1)}]));
  app.appendChild(el('h2',null,u.t));
  if(u.d) app.appendChild(el('p','lead',u.d));
  if(u.oas){
    var ol=el('div','oas');
    u.oas.forEach(function(o){
      var c=el('article','card oa'); c.appendChild(el('span','tag',o.n)); c.appendChild(el('p','oat',o.t));
      if(o.pts){ var ul=el('ul'); o.pts.forEach(function(x){ ul.appendChild(el('li',null,x)); }); c.appendChild(ul); }
      if(o.clases||o.sims){ var ob=el('button','btnopen','Abrir clases y simuladores →'); ob.onclick=function(){ location.hash='#/'+l.id+'/'+(i+1)+'/'+o.n.replace(/\D/g,''); }; c.appendChild(ob); }
      else c.appendChild(el('span','soon','Simulador: próximamente'));
      ol.appendChild(c);
    });
    app.appendChild(ol); return;
  }
  if(!u.sims.length){ app.appendChild(el('div','panel','Esta unidad todavía no tiene simuladores. Próximamente.')); return; }
  var g=el('div','grid units');
  u.sims.forEach(function(s){ var b=el('button','card'); b.appendChild(el('h3',null,s.t)); b.onclick=function(){ app.innerHTML=''; app.appendChild(crumb([{t:'Niveles',go:'#/'},{t:l.big+' '+l.sm,go:'#/'+l.id},{t:'Unidad '+(i+1),go:'#/'+l.id+'/'+(i+1)},{t:s.t}])); var box=el('div'); app.appendChild(box); s.run(box); }; g.appendChild(b); });
  app.appendChild(g);
}
function viewOA(l,i,o,tab){
  var u=l.units[i], base='#/'+l.id+'/'+(i+1)+'/'+o.n.replace(/\D/g,'');
  app.innerHTML='';
  app.appendChild(crumb([{t:'Niveles',go:'#/'},{t:l.big+' '+l.sm,go:'#/'+l.id},{t:'Unidad '+(i+1),go:'#/'+l.id+'/'+(i+1)},{t:o.n}]));
  app.appendChild(el('h2',null,o.n)); app.appendChild(el('p','lead',o.t));
  var tb=el('div','tabs'); tb.setAttribute('role','tablist');
  [['clases','Clases',o.clases],['sims','Simuladores',o.sims]].forEach(function(x){
    var b=el('button','tabb'+(tab===x[0]?' on':''),x[1]+' ('+(x[2]||[]).length+')'); b.setAttribute('role','tab'); b.setAttribute('aria-selected',tab===x[0]);
    b.onclick=function(){ location.hash=base+'/'+x[0]; }; tb.appendChild(b); });
  app.appendChild(tb);
  var items=(tab==='sims'?o.sims:o.clases)||[], g=el('div','grid units');
  items.forEach(function(it,k){ var c=el('article','card'); c.appendChild(el('span','tag',(tab==='sims'?'Simulador ':'Clase ')+(k+1))); c.appendChild(el('h3',null,it.t)); if(it.d) c.appendChild(el('span','sub',it.d)); if(it.parts){ var ob=el('button','btnopen','Abrir simulador →'); ob.onclick=function(){ location.hash=base+'/sims/'+(k+1); }; c.appendChild(ob); } else if(it.run){ var cb=el('button','btnopen','Abrir clase →'); cb.onclick=function(){ location.hash=base+'/clases/'+(k+1); }; c.appendChild(cb); } else c.appendChild(el('span','soon','Próximamente')); g.appendChild(c); });
  if(!items.length) g.appendChild(el('div','panel','Sin contenido todavía.'));
  app.appendChild(g);
}
var cleanup=null;
function viewSim(l,i,o,k,pi){
  var it=o.sims[k], base='#/'+l.id+'/'+(i+1)+'/'+o.n.replace(/\D/g,''), part=it.parts[pi];
  app.innerHTML=''; document.body.classList.add('simmode');
  var bar=el('div','simbar');
  bar.appendChild(crumb([{t:l.big+' '+l.sm,go:'#/'+l.id},{t:'Unidad '+(i+1),go:'#/'+l.id+'/'+(i+1)},{t:o.n,go:base+'/sims'},{t:it.t}]));
  var tb=el('div','tabs');
  if(it.parts.length>1) it.parts.forEach(function(p,j){
    var b=el('button','tabb'+(j===pi?' on':''),p.t+(p.run?'':' (próximamente)')); if(!p.run) b.disabled=true;
    b.onclick=function(){ location.hash=base+'/sims/'+(k+1)+'/'+(j+1); }; tb.appendChild(b); });
  bar.appendChild(tb);
  var bx=el('div','simbox');
  if(part && (part.d||part.info)){
    var ib=el('button','infobtn','ℹ Explicación'); ib.setAttribute('aria-expanded','false');
    var pn=el('div','siminfo'); pn.hidden=true; if(part.d) pn.appendChild(el('p',null,part.d)); if(part.info){ var d2=el('div'); d2.innerHTML=part.info; pn.appendChild(d2); }
    ib.onclick=function(){ pn.hidden=!pn.hidden; ib.setAttribute('aria-expanded',String(!pn.hidden)); };
    bar.appendChild(ib); app.appendChild(bar); app.appendChild(bx); bx.appendChild(pn);
  } else { app.appendChild(bar); app.appendChild(bx); }
  if(part && part.run){ var inner=el('div'); inner.style.cssText='flex:1;min-height:0;display:flex;flex-direction:column;position:relative'; bx.appendChild(inner); cleanup=part.run(inner)||null; }
}
function viewClase(l,i,o,k){
  var it=o.clases[k], base='#/'+l.id+'/'+(i+1)+'/'+o.n.replace(/\D/g,'');
  app.innerHTML=''; document.body.classList.add('simmode');
  var bar=el('div','simbar'); bar.appendChild(crumb([{t:l.big+' '+l.sm,go:'#/'+l.id},{t:'Unidad '+(i+1),go:'#/'+l.id+'/'+(i+1)},{t:o.n,go:base+'/clases'},{t:it.t}]));
  app.appendChild(bar); var bx=el('div','simbox'); app.appendChild(bx);
  var inner=el('div'); inner.style.cssText='flex:1;min-height:0;display:flex;flex-direction:column;position:relative'; bx.appendChild(inner); cleanup=it.run(inner)||null;
}
function route(){
  if(cleanup){ cleanup(); cleanup=null; }
  document.body.classList.remove('simmode');
  var p=(location.hash||'#/').replace(/^#\/?/,'').split('/').filter(Boolean);
  var l=CURR.filter(function(x){return x.id===p[0];})[0];
  if(!l) return viewLevels();
  var n=parseInt(p[1],10);
  if(n>=1 && n<=l.units.length){
    var u=l.units[n-1], o=p[2] && (u.oas||[]).filter(function(x){return x.n.replace(/\D/g,'')===p[2];})[0];
    if(o && p[3]==='clases' && p[4]){ var kc=parseInt(p[4],10)-1; if(o.clases && o.clases[kc] && o.clases[kc].run) return viewClase(l,n-1,o,kc); }
    if(o && p[3]==='sims' && p[4]){ var k=parseInt(p[4],10)-1, pi=Math.max(0,(parseInt(p[5],10)||1)-1); if(o.sims && o.sims[k] && o.sims[k].parts && o.sims[k].parts[pi]) return viewSim(l,n-1,o,k,pi); }
    if(o) return viewOA(l,n-1,o,p[3]==='sims'?'sims':'clases');
    return viewUnit(l,n-1);
  }
  viewUnits(l);
  window.scrollTo(0,0);
}
document.getElementById('brand').onclick=function(){ location.hash='#/'; };
window.addEventListener('hashchange',route);
route();
