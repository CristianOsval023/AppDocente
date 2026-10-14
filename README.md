# Simulador de Ciencias Naturales

Todos los archivos están en **una sola carpeta** (sin subcarpetas), para poder subirlos desde una tablet.

## Qué hace cada archivo

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página de inicio (muy liviana). Abre esta. |
| `estilos.css` | Colores y diseño. |
| `cargador.js` | Descarga cada simulador solo cuando lo abres. **Aquí se registran los simuladores nuevos.** |
| `curriculo.js` | Niveles, unidades, OA, clases y simuladores (el menú). |
| `app.js` | Navegación entre pantallas. |
| `comun.js`, `atomo-comun.js`, `presentacion.js` | Piezas compartidas por varios simuladores. |
| `sim-*.js`, `clase-*.js` | Un archivo por simulador o clase. |

## Publicar gratis en GitHub Pages (una vez)

1. Crea una cuenta en github.com y un repositorio **nuevo** (público).
2. **Add file → Upload files** y selecciona **todos** los archivos de esta carpeta (descomprime el ZIP primero). Confirma con **Commit changes**.
3. **Settings → Pages**: en *Branch* elige `main` y carpeta `/ (root)`. Guarda.
4. En 1–2 minutos aparece el enlace (`https://tu-usuario.github.io/nombre-repo/`). Ábrelo en la tablet y agrégalo a la pantalla de inicio.

> El sitio es público: **no subas nombres de estudiantes, notas ni datos personales.**

## Actualizar un archivo que ya existe

En el repositorio abre el archivo → lápiz (editar) → pega el contenido nuevo → *Commit changes*. O bien **Add file → Upload files** con el mismo nombre: reemplaza al anterior.

## Agregar un simulador nuevo

1. Crea `sim-nombre.js` con una función así:
   ```js
   'use strict';
   function miSimulador(box){
     box.innerHTML = '...';
     return function stop(){ /* detener animaciones */ };
   }
   ```
2. En `cargador.js` agrégalo en `ARCHIVO_DE`:  `"miSimulador": "sim-nombre.js"`
   (si usa piezas de `comun.js`, anótalo también en `DEPENDENCIAS`: `"sim-nombre.js": ["comun.js"]`).
3. En `curriculo.js`, donde corresponda: `run:lazy('miSimulador')`.
4. Sube los archivos modificados a GitHub.

## Imágenes, audio y video

Ponlos en la misma carpeta, comprimidos: imágenes en **WebP** (squoosh.app), audio en **MP3**, video en **MP4** liviano. No los incrustes dentro del código.
