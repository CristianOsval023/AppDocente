'use strict';
/* Carga bajo demanda: cada simulador es un archivo que solo se descarga cuando lo abres.
   Para agregar uno nuevo: 1) crea su archivo sim-xxx.js con una función  function miSimulador(box){...; return function stop(){...}; }
   2) anótalo en ARCHIVO_DE (nombre de la función -> archivo), y en DEPENDENCIAS si usa otros archivos.
   3) en curriculo.js usa   run:lazy('miSimulador')   donde quieras que aparezca. */
var ARCHIVO_DE={
 "flujoCalor": "sim-conduccion.js",
 "temperaturaCalor": "sim-temperatura.js",
 "conveccionCalor": "sim-conveccion.js",
 "radiacionCalor": "sim-radiacion.js",
 "presentacionClase1": "clase-6-calor.js",
 "presentacionClase8": "clase-8-atomo.js",
 "lineaTiempoAtomica": "sim-linea-atomica.js",
 "rutherfordExperimento": "sim-rutherford.js",
 "rutherfordAtomo": "sim-rutherford.js",
 "daltonExperimento": "sim-dalton.js",
 "thomsonExperimento": "sim-thomson.js",
 "bohrExperimento": "sim-bohr.js",
 "dobleRendija": "sim-doble-rendija.js",
 "barreraPrimaria": "sim-barrera-primaria.js"
};
var DEPENDENCIAS={
 "sim-temperatura.js": [
  "comun.js"
 ],
 "sim-conveccion.js": [
  "comun.js"
 ],
 "sim-radiacion.js": [
  "comun.js"
 ],
 "sim-linea-atomica.js": [
  "comun.js"
 ],
 "presentacion.js": [
  "comun.js"
 ],
 "clase-6-calor.js": [
  "presentacion.js",
  "sim-temperatura.js"
 ],
 "clase-8-atomo.js": [
  "presentacion.js",
  "sim-linea-atomica.js"
 ],
 "atomo-comun.js": [
  "comun.js"
 ],
 "sim-rutherford.js": [
  "atomo-comun.js"
 ],
 "sim-dalton.js": [
  "atomo-comun.js"
 ],
 "sim-thomson.js": [
  "atomo-comun.js"
 ],
 "sim-bohr.js": [
  "atomo-comun.js"
 ],
 "sim-doble-rendija.js": [
  "atomo-comun.js"
 ]
};
var _scripts={};
function cargarScript(src){
  if(_scripts[src]) return _scripts[src];
  _scripts[src]=new Promise(function(ok,fail){
    var s=document.createElement('script'); s.src=src; s.onload=ok;
    s.onerror=function(){ delete _scripts[src]; fail(new Error('No se pudo cargar '+src)); };
    document.head.appendChild(s);
  });
  return _scripts[src];
}
function cargarArchivo(f){
  return Promise.all((DEPENDENCIAS[f]||[]).map(cargarArchivo)).then(function(){ return cargarScript(f); });
}
function lazy(nombre){
  return function(box){
    var stop=null, muerto=false;
    box.innerHTML='<p class="lead" style="padding:24px">Cargando…</p>';
    cargarArchivo(ARCHIVO_DE[nombre]).then(function(){
      if(muerto) return; box.innerHTML=''; stop=window[nombre](box)||null;
    }).catch(function(e){
      if(muerto) return; box.innerHTML='<div class="panel">No se pudo cargar este simulador. Revisa la conexión e inténtalo de nuevo.</div>';
    });
    return function(){ muerto=true; if(stop){ try{ stop(); }catch(e){} } };
  };
}
