'use strict';
/* Utilidades compartidas por los simuladores */
/* ====== Ayudas comunes de los simuladores de calor ====== */
var NSV='http://www.w3.org/2000/svg';
function SV(tag,a,p){ var e=document.createElementNS(NSV,tag); for(var k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e; }
function RG(id,lab,min,max,step,val,unit){ return '<label><span>'+lab+'</span><output id="'+id+'o"></output><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" data-u="'+(unit||'')+'"></label>'; }
function SL(id,lab,opts,val){ return '<label class="row"><span>'+lab+'</span><select id="'+id+'">'+opts.map(function(o){ return '<option value="'+o[0]+'"'+(o[0]===val?' selected':'')+'>'+o[1]+'</option>'; }).join('')+'</select></label>'; }
function CK(id,lab,on){ return '<label class="row"><span>'+lab+'</span><input type="checkbox" id="'+id+'"'+(on?' checked':'')+'></label>'; }
function bindRg(box,id,fn){ var i=box.querySelector('#'+id), o=box.querySelector('#'+id+'o'), u=i.getAttribute('data-u');
  function upd(){ o.textContent=i.value.replace('.',',')+u; if(fn) fn(+i.value); } i.addEventListener('input',upd); upd(); return i; }
function hx(h){ return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]; }
function ramp(u,stops){ u=Math.max(0,Math.min(1,u)); for(var i=1;i<stops.length;i++){ if(u<=stops[i][0]||i===stops.length-1){ var a=stops[i-1],b=stops[i],f=(u-a[0])/(b[0]-a[0]||1); f=Math.max(0,Math.min(1,f)); var c0=hx(a[1]),c1=hx(b[1]);
  return 'rgb('+[0,1,2].map(function(k){ return Math.round(c0[k]+(c1[k]-c0[k])*f); }).join(',')+')'; } } }
var HOT=[[0,'#adb5bd'],[.35,'#fab005'],[.7,'#f76707'],[1,'#e03131']];
var FLU=[[0,'#1c7ed6'],[.25,'#74c0fc'],[.5,'#ffd43b'],[.75,'#ff922b'],[1,'#e03131']];
function fnum(x,d){ return x.toFixed(d==null?0:d).replace('.',','); }
function simShell(sceneId,vb,label,sideHtml){
  return '<div class="fc-wrap"><div class="fc-main"><div class="fc-scene"><svg id="'+sceneId+'" viewBox="'+vb+'" role="img" aria-label="'+label+'"></svg></div><p class="fc-status" aria-live="polite"></p></div><aside class="fc-side">'+sideHtml+'</aside></div>';
}

