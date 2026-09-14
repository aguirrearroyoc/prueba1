# Página web de AEBI

Sitio estático (HTML + CSS + JavaScript) listo para publicar en GitHub Pages.
No necesita instalar nada: se edita con cualquier editor de texto (VS Code, Bloc de notas, etc.)
y se prueba abriendo `index.html` en el navegador con doble clic.

## 1. Qué hay en la carpeta

```
aebi-web/
├── index.html              Inicio (portada, visión y valores, links rápidos, pop-up del próximo evento)
├── inscripciones.html      "Únete a nosotros"
├── eventos.html            Programación de eventos + calendario
├── grupos-de-estudio.html  Proyectos → Grupos de estudio
├── semilleros.html         Proyectos → Semilleros
├── bio-colecciones.html    Bio-Colecciones (carrusel de camisetas, con zoom)
├── bitacora.html           Bitácora (galería giratoria de fotos)
├── miembros.html           Estructura, comités y Red Alumni
├── css/estilos.css         Colores, tipografías y aspecto de todo el sitio
├── js/principal.js         Menú de celular, carruseles, calendario, zoom... (no hace falta tocarlo)
└── Imagenes/               AQUÍ VAN LAS FOTOS (ver punto 2)
    ├── miembros/           Fotos de los miembros y alumni
    └── bitacora/           Fotos de la Bitácora
```

Cada archivo HTML tiene comentarios (`<!-- así -->`) que explican qué es cada bloque y cómo cambiarlo.
El CSS está dividido en 17 bloques numerados con un índice al inicio.

## 2. Antes de publicar: poner las imágenes

Copia tus fotos en la carpeta `Imagenes/` **con estos nombres exactos**.
GitHub distingue mayúsculas de minúsculas: `principal.jpg` NO es lo mismo que `PRINCIPAL.jpg`,
y `.jpeg` NO es lo mismo que `.jpg`. Si tus archivos terminan en `.jpeg`, lo más fácil es renombrarlos a `.jpg`.

| Archivo | Dónde se usa |
|---|---|
| `Imagenes/LOGOAEBI.png` | Logo del menú e icono de la pestaña |
| `Imagenes/PRINCIPAL.jpg` | Foto blob de la portada (y de la caja "¿Tienes la iniciativa...?" en Eventos) |
| `Imagenes/LOGOBIOFEST.png` | Evento BIOFEST |
| `Imagenes/FERIASEMILLEROS.jpg` | Evento Feria de Semilleros |
| `Imagenes/BIOLOGO.jpg` | Evento Día del Biólogo y pop-up de inicio |
| `Imagenes/Camiseta1.png` … `Camiseta6.png` | Carrusel de Bio-Colecciones |
| `Imagenes/BIOCOLECCIONES.jpg` | Foto en blob de la introducción de Bio-Colecciones |
| `Imagenes/MASTOZOOLOGIA.jpg`, `BOTANICA.jpg`, `HERPETOLOGIA.jpg`, `ORNITOLOGIA.jpg` | Grupos de estudio (si guardas las fotos con otro nombre, cámbialo en `grupos-de-estudio.html`) |
| `Imagenes/bitacora/campo.jpg`, `laboratorio.jpg`, `aves.jpg`, `herbario.jpg`, `datos.jpg`, `clase.jpg` | Las 6 fotos de la Bitácora |
| `Imagenes/miembros/pres.jpg` | Presidencia |
| `Imagenes/miembros/comu1.jpg` … `comu4.jpg` | Comunicaciones |
| `Imagenes/miembros/estudiantil1.jpg` … `estudiantil4.jpg` | Estudiantil |
| `Imagenes/miembros/logistica1.jpg` … `logistica5.jpg` | Logística |
| `Imagenes/miembros/relaciones1.jpg` … `relaciones4.jpg` | Relaciones |
| `Imagenes/miembros/gestion1.jpg` … `gestion3.jpg` | Gestión |
| `Imagenes/miembros/marALUMNI.jpg`, `manoloALUMNI.jpg`, `catalinaALUMNI.jpg`, `kateALUMNI.jpg`, `nataliaALUMNI.jpg` | Red Alumni |

Si una foto no aparece, la página no se rompe: queda un cuadro de color en su lugar.
Además, cuando abres la página **en tu computador** aparece un aviso amarillo arriba con la lista de
imágenes que no encontró. Ese aviso nunca se ve en la página publicada.

## 3. Cómo publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `aebi-web`). Puede ser público.
2. Sube **todo el contenido** de esta carpeta (los `.html`, `css/`, `js/`, `Imagenes/`).
   `index.html` debe quedar en la raíz del repositorio, no dentro de una subcarpeta.
3. En el repositorio ve a **Settings → Pages**.
4. En *Build and deployment* → *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
5. Espera 1–2 minutos. La página quedará en `https://TU-USUARIO.github.io/aebi-web/`.

Cada vez que subas cambios al repositorio, la página se actualiza sola en uno o dos minutos.

## 4. Guía rápida de edición

**Colores y tipografías** → `css/estilos.css`, bloque 1. Cambiar un color ahí lo cambia en todo el sitio.

**Textos** → están directamente en cada archivo `.html`. Busca el texto que quieres cambiar y edítalo.

**Menú y pie de página** → se repiten iguales en los 8 archivos HTML. Si cambias algo (un link, el correo,
una pestaña nueva), hazlo en todos para que quede igual en todas las páginas. En pantallas de 1024px o
menos (tablets y celulares) el menú se convierte en el botón ☰; si algún día agregas más pestañas y el
menú deja de caber en una fila en escritorio, sube ese número en `css/estilos.css`, bloque 17.

**Eventos** (`eventos.html`) → cada evento es un bloque `<article class="evento">`. Para agregar uno,
copia un bloque completo y cambia imagen, fecha, título, texto y el link de Google Calendar.
En ese link, la fecha va en `dates=` con el formato `AAAAMMDDTHHMMSS/AAAAMMDDTHHMMSS`
(inicio/fin, hora de Colombia). Ejemplo: `20261029T090000/20261029T170000` = 29 oct 2026, 9:00 a. m. a 5:00 p. m.
Para un evento de todo el día sin hora: `20261028/20261029`.

**Calendario** (`eventos.html`, debajo de las tarjetas) → se arma solo, no hay que tocarlo. Lee el
`data-fecha="AAAA-MM-DD"` de cada `<article class="evento">` y dibuja el mes que corresponda con ese
día marcado. Si agregas un evento nuevo, solo asegúrate de ponerle su `data-fecha` (además de la fecha
en el link de Google Calendar, que es un formato distinto) y el calendario lo va a mostrar solo, incluso
si cae en un mes que todavía no aparecía.

**Pop-up de inicio** (`index.html`, bloque `<div id="popup-evento">`) → copia ahí la tarjeta del evento
que quieras destacar. Para quitarlo, borra ese bloque. Sale una vez por visita; en `js/principal.js`
(bloque 3) se explica cómo hacer que salga siempre o solo una vez.

**Grupos de estudio** → cada grupo es un `<article class="grupo grupo-COLOR">`.
Colores: `grupo-naranja`, `grupo-verde`, `grupo-amarillo`, `grupo-azul`.

**Semilleros** → cada uno es un `<article class="semillero">`. El botón "Contacto" puede llevar a
Instagram (`https://...`) o a un correo (`mailto:correo@icesi.edu.co`).

**Camisetas** (`bio-colecciones.html`) → cada camiseta es un `<div class="carrusel-item">`.
Copia un bloque, cambia la imagen (`Imagenes/Camiseta7.png`), el nombre y las tallas.
Los puntos del carrusel se generan solos. Cada foto se puede ampliar con un clic (o con Enter,
si se llega con el teclado); no hay que configurar nada para que una camiseta nueva también lo haga.

**Ola decorativa** (`bio-colecciones.html`, entre la introducción y el catálogo) → es un dibujo (SVG)
en `css/estilos.css`, dentro del bloque de Bio-Colecciones (busca `.ola svg` y `.ola path`). Para una
ola más alta o más baja, cambia el `height` de `.ola svg`; no hace falta entender los números del
dibujo (`d="M0,5 A90,90..."`) para eso.

**Bitácora** (`bitacora.html`) → cada foto es un botón `<button class="bitacora-foto">`. Para agregar
una: copia un bloque completo, guarda la foto en `Imagenes/bitacora/`, y cambia el `src` de la imagen,
el texto alternativo (`alt`), y `data-titulo` y `data-texto` (lo que va a salir en la ventana al tocar
la foto). El orden en que giran es el mismo orden en que están en el HTML. Dentro de la ventana se
puede pasar de una foto a otra tocando la imagen, con las flechas de los lados o con las teclas ← →.

**Miembros** → cada persona es un `<div class="persona">`. Reemplaza `XXX` por el nombre.
Todas las fotos se recortan al mismo cuadrado automáticamente.
Red Alumni: cada persona es un `<div class="carrusel-item persona">` con foto, nombre y link de LinkedIn.

**Forma del blob** → `css/estilos.css`, bloque 6. Los ocho porcentajes de `border-radius` controlan la forma.

## 5. Pendientes (busca "PENDIENTE" en los archivos)

- `inscripciones.html`: pegar el link del formulario de inscripción en el botón "Inscríbete para 2027-1".
- `bio-colecciones.html`: pegar el link del formulario de pedidos en los 6 botones "Realiza tu pedido".
- `miembros.html`: reemplazar cada `XXX` por el nombre de la persona.
- `grupos-de-estudio.html`: elegir las fotos de los cuatro grupos.
- `eventos.html`: la caja "¿Tienes la iniciativa de algún evento?" usa `PRINCIPAL.jpg` por ahora; cámbiala si quieres otra foto.
- `bitacora.html`: los títulos y descripciones de las 6 fotos son de ejemplo; cámbialos por los reales en cada `data-titulo` y `data-texto`.

## 6. Tipografías

El manual de marca pide Bebas Neue Cyrillic, Oswald y Roboto:

- **Bebas Neue**, **Oswald** y **Roboto** se cargan gratis desde Google Fonts (ya está el link en cada
  HTML, con Roboto en dos pesos: normal y negrita). A diferencia de Arial, Roboto no viene instalada en
  los computadores, así que si algún día quitas ese link de Google Fonts, el texto se va a ver con la
  fuente de respaldo (Helvetica o Arial) en vez de Roboto.

Los iconos (LinkedIn, Instagram, correo, WhatsApp, flechas, lupa) vienen de Font Awesome, también cargado desde internet.
Si abres la página sin conexión, se verán las fuentes de respaldo y los iconos no aparecerán; en la página publicada todo carga bien.
