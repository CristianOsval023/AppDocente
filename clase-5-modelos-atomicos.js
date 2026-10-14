'use strict';
/* Clase 5 · 8° básico · OA 12: importancia de los aportes científicos en la evolución del modelo atómico.
   Presentación en TEMA CLARO (visible en proyectores antiguos). Cada estación = historia animada + simulador + «qué no explicaba». */
var C5_BASE="background:#f3f5f7;color:#14213d;font-family:'Nunito Sans',Arial,sans-serif;display:flex;flex-direction:column;box-sizing:border-box;";
var C5_EST=[
 {id:'democrito',n:'Demócrito',anio:'siglo V a. C.',idea:'Átomos indivisibles',col:'#6b7280',hist:'c5HistDemocrito',sim:'c5SimDemocrito',
  ok:'Propuso que la materia está hecha de partículas diminutas: los átomos.',no:'No tenía experimentos: era solo una idea.',sig:'Pasaron más de 2000 años hasta que Dalton la retomó con ciencia.',
  nota:'Leucipo y Demócrito (siglo V a. C.) razonaron que la materia no se puede dividir infinitamente. No hicieron experimentos; Aristóteles rechazó la idea y se olvidó por siglos.'},
 {id:'dalton',n:'Dalton',anio:'1803',idea:'Esfera maciza',col:'#e8590c',hist:'c5HistDalton',sim:'c5SimDalton',
  ok:'Al reaccionar, los átomos se reordenan y la masa total se conserva.',no:'Decía que el átomo no tiene partes, pero la electricidad mostraba otra cosa.',sig:'Thomson descubrió que el átomo sí tiene partes.',
  nota:'John Dalton presentó su teoría atómica entre 1803 y 1808. Explicó la conservación de la masa y las proporciones definidas, pero su átomo sin partes no podía explicar la electricidad.'},
 {id:'thomson',n:'Thomson',anio:'1897',idea:'Budín con pasas',col:'#c92a2a',hist:'c5HistThomson',sim:'c5SimThomson',
  ok:'Descubrió el electrón: el átomo sí tiene partes.',no:'No explicaba por qué algunas partículas rebotaban en la lámina de oro.',sig:'Rutherford descubrió que la carga positiva está concentrada en un núcleo.',
  nota:'J. J. Thomson descubrió el electrón con tubos de rayos catódicos (1897) y propuso el «budín de pasas» (c. 1904). Su modelo fue puesto a prueba por Rutherford.'},
 {id:'rutherford',n:'Rutherford',anio:'1911',idea:'Núcleo y vacío',col:'#7048e8',hist:'c5HistRutherford',sim:'c5SimRutherford',
  ok:'Descubrió el núcleo: pequeño, pesado y positivo. El resto es casi vacío.',no:'No explicaba por qué los electrones no caen al núcleo.',sig:'Bohr ordenó a los electrones en niveles de energía.',
  nota:'Experimento de Geiger y Marsden (1909) interpretado por Rutherford (1911). Según la física clásica, un electrón en órbita perdería energía y caería al núcleo.'},
 {id:'bohr',n:'Bohr',anio:'1913',idea:'Niveles de energía',col:'#1971c2',hist:'c5HistBohr',sim:'c5SimBohr',
  ok:'Los electrones están en niveles de energía: explica los colores del hidrógeno.',no:'Funcionaba bien solo con el hidrógeno, no con átomos más grandes.',sig:'Schrödinger y Heisenberg propusieron la nube de probabilidad.',
  nota:'Niels Bohr (1913) explicó el espectro del hidrógeno con niveles de energía fijos. Para átomos con varios electrones el modelo falla.'},
 {id:'cuantico',n:'Mecano-cuántico',anio:'1926',idea:'Nube de probabilidad',col:'#2b8a3e',hist:'c5HistCuantico',sim:'c5SimCuantico',
  ok:'Explica átomos grandes y pequeños con nubes de probabilidad (orbitales).',no:'Es el modelo actual, pero la ciencia sigue poniéndolo a prueba.',sig:'¿Qué preguntas harías tú?',
  nota:'Schrödinger (1926) y Heisenberg (principio de incertidumbre, 1927). Se habla de la probabilidad de encontrar al electrón en una zona (orbital).'}
];
var C5_PARES=[
 {c:'Demócrito',d:'Átomos indivisibles en el vacío.'},
 {c:'Dalton',d:'Esfera maciza e indivisible.'},
 {c:'Thomson',d:'Descubrió el electrón.'},
 {c:'Rutherford',d:'Descubrió el núcleo atómico.'},
 {c:'Bohr',d:'Electrones en niveles de energía.'},
 {c:'Schrödinger y Heisenberg',d:'Electrón como nube de probabilidad.'}
];
function c5Icono(id,sz){ return '<svg viewBox="0 0 200 200" width="'+sz+'" height="'+sz+'" style="display:block">'+hcModelo(id,100,100,86,0)+'</svg>'; }
function c5H2(txt,sz){ return '<h2 style="margin:0;font-family:Domine,Georgia,serif;font-size:'+(sz||76)+'px;font-weight:600;line-height:1.1;color:#14213d;max-width:1450px">'+txt+'</h2>'; }
function c5Tarjeta(e,extra,big){ var z=big?235:190; return '<div style="width:270px;background:#fff;border:4px solid #c3cddb;border-top:16px solid '+e.col+';border-radius:22px;padding:18px 10px 22px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center">'+c5Icono(e.id,z)+'<div style="font-family:Domine,Georgia,serif;font-size:'+(e.n.length>11?(big?38:34):(big?46:42))+'px;font-weight:700;color:#14213d;line-height:1.1">'+e.n+'</div><div style="font-size:'+(big?40:34)+'px;font-weight:800;color:'+e.col+'">'+e.anio+'</div>'+(extra||'')+'</div>'; }

function c5Error(e,k){
  var sigTxt=(k<C5_EST.length-1)?'<span style="color:#e8590c">Entonces…</span> '+e.sig:'<span style="color:#e8590c">Para pensar:</span> '+e.sig;
  return {style:C5_BASE+'padding:100px 100px 44px;gap:28px',
   html:c5H2('Modelo de '+(e.id==='cuantico'?'Schrödinger y Heisenberg':e.n)+' <span style="color:'+e.col+'">· '+e.anio+'</span>',70)+
   '<div style="display:flex;gap:36px;flex:1;min-height:0"><div style="width:430px;background:#fff;border:4px solid #c3cddb;border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">'+c5Icono(e.id,340)+'<div style="font-size:46px;font-weight:800;color:'+e.col+';text-align:center;line-height:1.1;padding:0 14px">'+e.idea+'</div></div>'+
   '<div style="flex:1;background:#ebfbee;border:7px solid #2b8a3e;border-radius:26px;padding:34px 38px;display:flex;flex-direction:column;gap:18px"><div style="font-size:50px;font-weight:800;color:#1b6b2f">✔ Lo que explicaba</div><div style="font-size:56px;line-height:1.22;font-weight:700">'+e.ok+'</div></div>'+
   '<div style="flex:1;background:#fff5f5;border:7px solid #c92a2a;border-radius:26px;padding:34px 38px;display:flex;flex-direction:column;gap:18px"><div style="font-size:50px;font-weight:800;color:#a61e1e">✘ Lo que NO explicaba</div><div style="font-size:56px;line-height:1.22;font-weight:700">'+e.no+'</div></div></div>'+
   '<div style="background:#fff3bf;border:6px solid #f59f00;border-radius:22px;padding:20px 36px;font-size:50px;font-weight:800;line-height:1.2">'+sigTxt+'</div>',
   notes:'Cierre de la estación (≈2–3 min). Los estudiantes copian el cuadro: modelo, qué explicaba y qué no. Idea clave: cada modelo tuvo aciertos y errores, y el error fue el que permitió avanzar. '+e.nota,
   timer:3};
}

function c5Slides(){
  var S=[];
  /* 1. Portada */
  var ic=''; C5_EST.forEach(function(e,k){ ic+=c5Icono(e.id,190)+(k<5?'<div style="font-size:60px;font-weight:800;color:#94a3b8;align-self:center">›</div>':''); });
  S.push({style:C5_BASE+'background:#f3f5f7;padding:120px 120px 100px;justify-content:center;gap:34px',
   html:'<p style="margin:0;font-size:40px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:#c2410c">Ciencias Naturales · 8° básico · Unidad 4 · OA 12</p><h1 style="margin:0;font-family:Domine,Georgia,serif;font-size:150px;font-weight:600;line-height:1.08;color:#14213d">Los modelos del átomo</h1><p style="margin:0;font-size:60px;line-height:1.3;color:#334155;width:1500px">Clase 5: una historia de aciertos, errores y preguntas</p><div style="display:flex;gap:14px;margin-top:30px;align-items:center">'+ic+'</div>',
   notes:'Presentar la clase (≈1 min). Hoy recorremos seis momentos de la historia del átomo; el hilo conductor es el error y el cuestionamiento como motores del conocimiento científico. Distribución sugerida de los 90 min: inicio 12 · seis estaciones de ≈9 min (54) · síntesis 12 · cierre 12.'});
  /* 2. Objetivo */
  S.push({style:C5_BASE+'padding:130px 110px 70px;gap:44px',
   html:'<div class="fecha" style="position:absolute;left:110px;top:30px;font-family:\'Nunito Sans\',Arial,sans-serif"></div>'+c5H2('Objetivo de clase',86)+
   '<div style="display:flex;align-items:center;flex:1;background:#fff;border:10px solid #1971c2;border-radius:34px;padding:60px 80px"><p style="margin:0;font-family:Domine,Georgia,serif;font-size:88px;line-height:1.26;font-weight:600;color:#14213d">Comprender la importancia de los aportes científicos en la evolución del conocimiento de la materia.</p></div>',
   notes:'Leer el objetivo en voz alta y registrar la fecha (editable). Los estudiantes lo copian en el cuaderno; usar el temporizador para marcar el tiempo.',timer:3});
  /* 3. Inicio: imagen */
  S.push({style:C5_BASE+'padding:100px 110px 50px;gap:30px',
   html:c5H2('Inicio · Observa la imagen',72)+'<div style="display:flex;gap:56px;flex:1;min-height:0"><div style="width:780px;background:#fff;border:4px solid #c3cddb;border-radius:30px;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 400 400" width="700" height="700">'+hcModelo('bohr',200,200,185,0)+'</svg></div><div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:56px">'+
   [['1','¿Conoces esta imagen?'],['2','¿Sabes dónde podemos encontrarla?']].map(function(q){ return '<div style="display:flex;align-items:center;gap:36px"><div style="flex:none;width:110px;height:110px;border-radius:50%;background:#1971c2;color:#fff;font-size:70px;font-weight:800;display:flex;align-items:center;justify-content:center">'+q[0]+'</div><div style="font-size:72px;font-weight:800;line-height:1.15">'+q[1]+'</div></div>'; }).join('')+'</div></div>',
   notes:'Inicio (≈4 min). Es la imagen típica del átomo (modelo de Bohr). Recoger respuestas orales: logotipos, libros, series, etc. Los estudiantes anotan sus ideas.',timer:3});
  /* 4. Inicio: pregunta temperatura */
  S.push({style:C5_BASE+'padding:100px 110px 60px;gap:30px;justify-content:center',
   html:'<div style="display:flex;align-items:center;gap:70px"><div style="flex:1"><p style="margin:0 0 26px;font-size:46px;font-weight:800;letter-spacing:3px;color:#c2410c;text-transform:uppercase">Inicio · Haz una predicción</p><h1 style="margin:0;font-family:Domine,Georgia,serif;font-size:100px;line-height:1.18;font-weight:600">¿Cómo crees que se comportan los átomos al variar la temperatura?</h1></div><svg viewBox="0 0 200 420" width="340" height="720"><rect x="76" y="20" width="48" height="300" rx="24" fill="#fff" stroke="#14213d" stroke-width="8"/><circle cx="100" cy="340" r="52" fill="#e03131" stroke="#14213d" stroke-width="8"/><rect x="88" y="150" width="24" height="190" fill="#e03131"/><text x="100" y="270" text-anchor="middle" font-size="110" font-weight="800" fill="#14213d" style="font-family:Nunito Sans,Arial">?</text></svg></div>',
   notes:'Inicio (≈3 min). Pedir una predicción por escrito (hipótesis) antes de probar el simulador en la siguiente diapositiva.',timer:2});
  S.push({sim:'c5Temperatura',notes:'Simulador (≈3 min): al aumentar la temperatura los átomos se mueven más rápido. Un estudiante pasa a mover el termómetro y el curso compara con su predicción. Esto conecta con la idea de que los modelos atómicos explican fenómenos observables.'});
  /* 6. Mapa de la clase */
  S.push({style:C5_BASE+'padding:100px 100px 50px;gap:30px',
   html:c5H2('Hoy seremos detectives de la ciencia',74)+'<div style="display:flex;gap:20px;margin-top:6px">'+C5_EST.map(function(e){ return c5Tarjeta(e); }).join('')+'</div>'+
   '<div style="display:flex;gap:26px;margin-top:20px">'+[['1','Historia'],['2','Simulador'],['3','¿Qué no explicaba?']].map(function(p){ return '<div style="flex:1;display:flex;align-items:center;gap:22px;background:#fff;border:4px solid #c3cddb;border-radius:24px;padding:22px 28px"><div style="flex:none;width:84px;height:84px;border-radius:50%;background:#14213d;color:#fff;font-size:54px;font-weight:800;display:flex;align-items:center;justify-content:center">'+p[0]+'</div><div style="font-size:54px;font-weight:800">'+p[1]+'</div></div>'; }).join('')+'</div>',
   notes:'Presentar el recorrido (≈2 min): seis científicos o grupos de científicos. En cada estación hay tres momentos: una historia animada, un simulador que ellos manipulan y una diapositiva para anotar qué explicaba y qué no explicaba cada modelo.'});
  /* 7–24. Estaciones */
  C5_EST.forEach(function(e,k){
    S.push({sim:e.hist,notes:'Estación '+(k+1)+' · Historia animada (≈2 min). Se puede pausar, avanzar o retroceder con los botones y con los puntos. '+e.nota});
    S.push({sim:e.sim,notes:'Estación '+(k+1)+' · Simulador (≈4 min). Los estudiantes lo manipulan (por turnos o en grupos). Pedir que expliquen con sus palabras qué observan, no que lean texto.'});
    S.push(c5Error(e,k));
  });
  /* Síntesis */
  S.push({style:C5_BASE+'padding:100px 100px 50px;gap:34px',
   html:c5H2('Línea de tiempo de los modelos',74)+'<div style="display:flex;gap:18px;align-items:stretch">'+C5_EST.map(function(e){ return c5Tarjeta(e,'<div style="font-size:42px;font-weight:700;color:#334155;line-height:1.15;margin-top:10px">'+e.idea+'</div>',true); }).join('')+'</div><div style="height:16px;border-radius:8px;background:linear-gradient(to right,#6b7280,#e8590c,#c92a2a,#7048e8,#1971c2,#2b8a3e)"></div><p style="margin:0;font-size:60px;font-weight:800;color:#334155">Cada modelo nació al cuestionar al anterior.</p>',
   notes:'Síntesis (≈5 min). Los estudiantes copian la línea de tiempo con el año y la idea de cada modelo. Pedir que señalen, con la flecha del tiempo, qué error de un modelo dio origen al siguiente.',timer:6});
  S.push({style:C5_BASE+'padding:100px 128px 60px;gap:22px',
   html:c5H2('Une cada científico con su aporte',70)+'<div class="unir u5"></div>',
   notes:'Actividad interactiva (≈6 min): arrastran desde el punto de cada científico hasta su aporte, o tocan uno y luego el otro. «Comprobar» marca las uniones correctas. Respuestas: Demócrito → átomos indivisibles; Dalton → esfera maciza; Thomson → electrón; Rutherford → núcleo; Bohr → niveles de energía; Schrödinger y Heisenberg → nube de probabilidad.',timer:6});
  /* Cierre */
  S.push({style:C5_BASE+'padding:110px 120px 60px;gap:36px;justify-content:center',
   html:'<p style="margin:0;font-size:44px;font-weight:800;letter-spacing:3px;color:#c2410c;text-transform:uppercase">Cierre · Conversemos</p><h1 style="margin:0;font-family:Domine,Georgia,serif;font-size:92px;line-height:1.16;font-weight:600;width:1600px">¿Qué habría pasado si nadie hubiera cuestionado a los científicos anteriores?</h1><div style="display:flex;gap:30px;margin-top:20px">'+['¿Qué importancia tuvieron los errores?','¿Es definitivo el modelo actual?'].map(function(q){ return '<div style="flex:1;background:#fff;border:5px solid #1971c2;border-radius:26px;padding:28px 34px;font-size:56px;font-weight:800;line-height:1.2">'+q+'</div>'; }).join('')+'</div>',
   notes:'Discusión guiada (≈8 min). Ideas: el error mostró qué faltaba explicar; cada científico partió del trabajo anterior; cuestionar con evidencia (no por capricho) hace avanzar el conocimiento; el modelo actual puede cambiar si aparece nueva evidencia.',timer:8});
  S.push({style:C5_BASE+'padding:110px 120px 60px;gap:44px;justify-content:center',
   html:'<p style="margin:0;font-size:44px;font-weight:800;letter-spacing:3px;color:#c2410c;text-transform:uppercase">Cierre · Metacognición</p><h1 style="margin:0;font-family:Domine,Georgia,serif;font-size:96px;line-height:1.18;font-weight:600;width:1600px">¿Qué importancia tiene equivocarse y cuestionarse a uno mismo para aprender?</h1><p style="margin:0;font-size:52px;font-weight:700;color:#334155">Escríbelo en tu cuaderno con un ejemplo de hoy.</p>',
   notes:'Cierre individual (≈4 min). Reflexión escrita y algunos estudiantes comparten. Conecta con la clase siguiente (6): cada grupo planificará una investigación sobre un científico y una historia.',timer:4});
  return S;
}
function presentacionClase5(box){
  var stop=presentacion(box,c5Slides(),{sim:function(b,s){ return lazy(s.sim)(b); },pairs:C5_PARES});
  var st=box.querySelector('.pz-stage'); if(st) st.style.background='#e5e9f0';
  return stop;
}
