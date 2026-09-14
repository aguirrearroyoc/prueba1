/* ==========================================================================
   JAVASCRIPT DE LA PÁGINA DE AEBI
   ==========================================================================
   Este archivo le da "movimiento" a la página. Normalmente NO hay que
   tocarlo: agregar camisetas, alumni, eventos, etc. se hace en el HTML.

   Contiene:
     1. Menú de celular (hamburguesa) y menú desplegable "Proyectos"
     2. Carruseles (camisetas y Red Alumni)
     3. Pop-up del próximo evento (página de inicio)
     4. Zoom de las fotos del catálogo (Bio-Colecciones)
     5. Calendario de eventos (página Eventos)
     6. Bitácora: carrusel giratorio y ventana con la foto + descripción
     7. Ayuda para imágenes que no se encuentran
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. MENÚ
   -------------------------------------------------------------------------- */
(function () {
  // Botón hamburguesa (celular)
  var hamburguesa = document.querySelector('.hamburguesa');
  var navegacion = document.querySelector('.navegacion');

  if (hamburguesa && navegacion) {
    hamburguesa.addEventListener('click', function () {
      var abierto = navegacion.classList.toggle('abierto');
      hamburguesa.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  }

  // Menú desplegable "Proyectos" (para pantallas táctiles, donde no hay "hover")
  document.querySelectorAll('.desplegable > button').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var li = boton.parentElement;
      var abierto = li.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  });

  // Cierra el desplegable al hacer clic en cualquier otra parte
  document.addEventListener('click', function (evento) {
    document.querySelectorAll('.desplegable.abierto').forEach(function (li) {
      if (!li.contains(evento.target)) {
        li.classList.remove('abierto');
        li.querySelector('button').setAttribute('aria-expanded', 'false');
      }
    });
  });
})();


/* --------------------------------------------------------------------------
   2. CARRUSELES
   --------------------------------------------------------------------------
   Funciona con cualquier bloque que tenga esta estructura en el HTML:

     <div class="carrusel">
       <button class="carrusel-flecha carrusel-anterior">‹</button>
       <div class="carrusel-pista">
         <div class="carrusel-item"> ... </div>
         <div class="carrusel-item"> ... </div>
       </div>
       <button class="carrusel-flecha carrusel-siguiente">›</button>
       <div class="carrusel-puntos"></div>   (los puntos se crean solos)
     </div>

   Para agregar un elemento nuevo basta con copiar un "carrusel-item".
   -------------------------------------------------------------------------- */
(function () {
  document.querySelectorAll('.carrusel').forEach(function (carrusel) {
    var pista = carrusel.querySelector('.carrusel-pista');
    var items = carrusel.querySelectorAll('.carrusel-item');
    var anterior = carrusel.querySelector('.carrusel-anterior');
    var siguiente = carrusel.querySelector('.carrusel-siguiente');
    var puntos = carrusel.querySelector('.carrusel-puntos');
    var actual = 0;                      // índice del elemento que se está viendo

    if (!pista || items.length === 0) return;

    // Cuánto hay que desplazar para pasar de un item al siguiente
    function paso() {
      var estilo = getComputedStyle(pista);
      var espacio = parseFloat(estilo.columnGap || estilo.gap) || 0;
      return items[0].getBoundingClientRect().width + espacio;
    }

    function irA(indice) {
      var maximo = items.length - 1;
      if (indice < 0) indice = maximo;   // de la primera pasa a la última
      if (indice > maximo) indice = 0;   // de la última vuelve a la primera
      actual = indice;
      pista.scrollTo({ left: indice * paso(), behavior: 'smooth' });
      actualizarPuntos();
    }

    // Si ya no se puede desplazar más, la flecha da la vuelta
    function alFinal()  { return pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 2; }
    function alInicio() { return pista.scrollLeft <= 1; }

    if (anterior)  anterior.addEventListener('click',  function () { irA(alInicio() ? items.length - 1 : actual - 1); });
    if (siguiente) siguiente.addEventListener('click', function () { irA(alFinal()  ? 0 : actual + 1); });

    // Puntos de posición (solo si el HTML tiene <div class="carrusel-puntos">)
    if (puntos) {
      items.forEach(function (item, i) {
        var punto = document.createElement('button');
        punto.type = 'button';
        punto.setAttribute('aria-label', 'Ir al elemento ' + (i + 1));
        punto.addEventListener('click', function () { irA(i); });
        puntos.appendChild(punto);
      });
    }

    function actualizarPuntos() {
      if (!puntos) return;
      puntos.querySelectorAll('button').forEach(function (p, i) {
        p.classList.toggle('activo', i === actual);
      });
    }
    actualizarPuntos();

    // Cuando la persona desliza con el dedo o el mouse, se actualiza la posición
    var temporizador;
    pista.addEventListener('scroll', function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        actual = Math.round(pista.scrollLeft / paso());
        actualizarPuntos();
      }, 150);
    }, { passive: true });
  });
})();


/* --------------------------------------------------------------------------
   3. POP-UP DEL PRÓXIMO EVENTO
   --------------------------------------------------------------------------
   Se muestra la primera vez que se abre la página de inicio en cada visita
   (usa "sessionStorage": al cerrar el navegador y volver, sale otra vez).

   - Para que salga SOLO UNA VEZ por persona (nunca más), cambia las dos
     palabras "sessionStorage" por "localStorage".
   - Para que salga SIEMPRE, borra las líneas marcadas con (A).
   - Para desactivar el pop-up, borra el bloque <div id="popup-evento"> del
     archivo index.html.
   -------------------------------------------------------------------------- */
(function () {
  var fondo = document.getElementById('popup-evento');
  if (!fondo) return;                                   // esta página no tiene pop-up

  var clave = 'aebi_popup_visto';

  try {
    if (sessionStorage.getItem(clave)) return;          // (A) ya se mostró en esta visita
  } catch (e) { /* si el navegador bloquea el almacenamiento, se muestra igual */ }

  function abrir() {
    fondo.classList.add('visible');
    var cerrar = fondo.querySelector('.popup-cerrar');
    if (cerrar) cerrar.focus();
    try { sessionStorage.setItem(clave, 'si'); } catch (e) {}   // (A)
  }

  function cerrar() {
    fondo.classList.remove('visible');
  }

  // Espera medio segundo para que primero se vea la página
  setTimeout(abrir, 500);

  fondo.querySelector('.popup-cerrar').addEventListener('click', cerrar);
  fondo.addEventListener('click', function (evento) {
    if (evento.target === fondo) cerrar();              // clic fuera de la tarjeta
  });
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') cerrar();              // tecla Esc
  });
})();


/* --------------------------------------------------------------------------
   4. ZOOM DE LAS FOTOS DEL CATÁLOGO
   --------------------------------------------------------------------------
   Al hacer clic (o Enter, si se llega con el teclado) en una foto de
   camiseta, se abre en grande para ver los detalles. Solo funciona en
   páginas que tengan botones con la clase "ampliar" y el bloque
   #zoom-imagen (por ahora, Bio-Colecciones). No hay que tocar nada de
   esto al agregar o quitar camisetas del carrusel.
   -------------------------------------------------------------------------- */
(function () {
  var fondo = document.getElementById('zoom-imagen');
  if (!fondo) return;                                    // esta página no tiene zoom

  var imagenGrande = fondo.querySelector('img');
  var botonCerrar = fondo.querySelector('.zoom-cerrar');

  function abrir(boton) {
    var imagenChica = boton.querySelector('img');
    imagenGrande.src = imagenChica.src;
    imagenGrande.alt = imagenChica.alt;
    fondo.classList.add('visible');
    botonCerrar.focus();
    document.body.style.overflow = 'hidden';             // la página no se mueve detrás
  }

  function cerrar() {
    fondo.classList.remove('visible');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.ampliar').forEach(function (boton) {
    boton.addEventListener('click', function () { abrir(boton); });
  });

  botonCerrar.addEventListener('click', cerrar);
  fondo.addEventListener('click', function (evento) {
    if (evento.target === fondo) cerrar();               // clic fuera de la imagen
  });
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && fondo.classList.contains('visible')) cerrar();
  });
})();


/* --------------------------------------------------------------------------
   5. CALENDARIO DE EVENTOS
   --------------------------------------------------------------------------
   Arma un calendario a partir de la fecha (data-fecha) de cada evento de
   la página Eventos. No hay que mantenerlo a mano: agregar, quitar o
   cambiar la fecha de un evento en el HTML actualiza el calendario solo,
   incluso si el evento queda en un mes distinto (se crea un mes nuevo).
   Tocar un día con evento lleva directo a esa tarjeta.
   -------------------------------------------------------------------------- */
(function () {
  var contenedor = document.getElementById('calendario');
  if (!contenedor) return;                              // esta página no tiene calendario

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];   // empieza en lunes

  var eventos = Array.prototype.slice.call(document.querySelectorAll('.evento[data-fecha]')).map(function (art) {
    var partes = art.dataset.fecha.split('-').map(Number);       // [año, mes, día]
    var h3 = art.querySelector('h3');
    return { año: partes[0], mes: partes[1] - 1, dia: partes[2], nombre: h3 ? h3.textContent : '', elemento: art };
  });
  if (eventos.length === 0) return;

  // Agrupa los eventos por mes y ordena los meses de más próximo a más lejano
  var meses = {};
  eventos.forEach(function (ev) {
    var clave = ev.año + '-' + ev.mes;
    if (!meses[clave]) meses[clave] = { año: ev.año, mes: ev.mes, porDia: {} };
    meses[clave].porDia[ev.dia] = ev;
  });
  Object.keys(meses).map(function (clave) { return meses[clave]; })
    .sort(function (a, b) { return (a.año - b.año) || (a.mes - b.mes); })
    .forEach(function (bloqueMes) { contenedor.appendChild(construirMes(bloqueMes)); });

  function construirMes(bloqueMes) {
    var contenedorMes = document.createElement('div');
    contenedorMes.className = 'mes-calendario';

    var titulo = document.createElement('h3');
    titulo.textContent = MESES[bloqueMes.mes].charAt(0).toUpperCase() + MESES[bloqueMes.mes].slice(1) + ' ' + bloqueMes.año;
    contenedorMes.appendChild(titulo);

    var grilla = document.createElement('div');
    grilla.className = 'grilla-calendario';
    DIAS_SEMANA.forEach(function (letra) {
      var etiqueta = document.createElement('div');
      etiqueta.className = 'dia-semana';
      etiqueta.textContent = letra;
      grilla.appendChild(etiqueta);
    });

    // ¿Qué día de la semana cae el 1 del mes? (0 = lunes ... 6 = domingo)
    var primerDiaSemana = (new Date(bloqueMes.año, bloqueMes.mes, 1).getDay() + 6) % 7;
    var totalDias = new Date(bloqueMes.año, bloqueMes.mes + 1, 0).getDate();

    for (var vacio = 0; vacio < primerDiaSemana; vacio++) {
      grilla.appendChild(document.createElement('div'));
    }
    for (var dia = 1; dia <= totalDias; dia++) {
      var celda = document.createElement('div');
      celda.className = 'dia-calendario';
      celda.textContent = dia;

      var ev = bloqueMes.porDia[dia];
      if (ev) {
        celda.classList.add('con-evento');
        celda.title = ev.nombre;                        // se ve al pasar el mouse
        celda.setAttribute('role', 'button');
        celda.setAttribute('tabindex', '0');
        celda.setAttribute('aria-label', 'Ir al evento ' + ev.nombre);
        celda.addEventListener('click', irAlEvento(ev.elemento));
        celda.addEventListener('keydown', function (evento) {
          if (evento.key === 'Enter' || evento.key === ' ') { evento.preventDefault(); this.click(); }
        });
      }
      grilla.appendChild(celda);
    }

    contenedorMes.appendChild(grilla);
    return contenedorMes;
  }

  function irAlEvento(elemento) {
    return function () {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elemento.classList.add('evento-resaltado');
      setTimeout(function () { elemento.classList.remove('evento-resaltado'); }, 1600);
    };
  }
})();


/* --------------------------------------------------------------------------
   6. BITÁCORA: CARRUSEL GIRATORIO Y VENTANA CON LA FOTO + DESCRIPCIÓN
   --------------------------------------------------------------------------
   Las fotos van girando solas cada pocos segundos; se detienen si el mouse
   está encima. Al tocar cualquier foto (esté al frente o no) se abre en
   grande junto con su descripción (el título y el texto salen de
   data-titulo y data-texto de esa foto en el HTML). Dentro de la ventana
   se puede pasar a la siguiente foto tocando la imagen, con las flechas
   de los lados o con las teclas ← →, sin tener que cerrar y volver a abrir.
   -------------------------------------------------------------------------- */
(function () {
  var carrusel = document.querySelector('.carrusel-3d');
  var pista = document.querySelector('.carrusel-3d-pista');
  var fondo = document.getElementById('bitacora-vista');
  if (!carrusel || !pista || !fondo) return;             // esta página no tiene bitácora

  var fotos = Array.prototype.slice.call(pista.querySelectorAll('.bitacora-foto'));
  var total = fotos.length;
  if (total === 0) return;
  var activo = 0;                                        // foto al frente del carrusel

  function acomodar() {
    fotos.forEach(function (foto, i) {
      var diferencia = i - activo;
      if (diferencia > total / 2) diferencia -= total;
      if (diferencia < -total / 2) diferencia += total;
      foto.dataset.pos = Math.abs(diferencia) > 2 ? 'oculto' : String(diferencia);
    });
  }
  acomodar();

  // Gira sola cada 3.5 segundos; se pausa con el mouse encima o con la ventana abierta
  var girar = null;
  function avanzar() { activo = (activo + 1) % total; acomodar(); }
  function iniciarGiro() { detenerGiro(); girar = setInterval(avanzar, 3500); }
  function detenerGiro() { if (girar) { clearInterval(girar); girar = null; } }
  iniciarGiro();
  carrusel.addEventListener('mouseenter', detenerGiro);
  carrusel.addEventListener('mouseleave', function () {
    if (!fondo.classList.contains('visible')) iniciarGiro();
  });

  // Ventana con la foto en grande + su descripción
  var imagenGrande = fondo.querySelector('img');
  var tituloGrande = fondo.querySelector('h3');
  var textoGrande = fondo.querySelector('.vista-descripcion');
  var contador = fondo.querySelector('.vista-contador');
  var botonCerrar = fondo.querySelector('.zoom-cerrar');
  var botonAnterior = fondo.querySelector('.vista-anterior');
  var botonSiguiente = fondo.querySelector('.vista-siguiente');
  var enVista = 0;                                       // foto que se está viendo en la ventana

  function mostrar(indice) {
    enVista = (indice + total) % total;                  // da la vuelta al llegar al final
    var foto = fotos[enVista];
    var imagenChica = foto.querySelector('img');
    imagenGrande.src = imagenChica.src;
    imagenGrande.alt = imagenChica.alt;
    tituloGrande.textContent = foto.dataset.titulo || '';
    textoGrande.textContent = foto.dataset.texto || '';
    if (contador) contador.textContent = 'Foto ' + (enVista + 1) + ' de ' + total + ' · toca la foto o las flechas para ver la siguiente';
  }
  function abrir(foto) {
    detenerGiro();
    mostrar(fotos.indexOf(foto));
    fondo.classList.add('visible');
    botonCerrar.focus();
    document.body.style.overflow = 'hidden';             // la página no se mueve detrás
  }
  function cerrar() {
    fondo.classList.remove('visible');
    document.body.style.overflow = '';
    activo = enVista;                                    // el carrusel queda en la última foto vista
    acomodar();
    iniciarGiro();
  }
  function siguiente() { mostrar(enVista + 1); }
  function anterior() { mostrar(enVista - 1); }

  fotos.forEach(function (foto) {
    foto.addEventListener('click', function () { abrir(foto); });
  });
  imagenGrande.addEventListener('click', siguiente);     // tocar la foto = siguiente
  botonSiguiente.addEventListener('click', siguiente);
  botonAnterior.addEventListener('click', anterior);
  botonCerrar.addEventListener('click', cerrar);
  fondo.addEventListener('click', function (evento) {
    if (evento.target === fondo) cerrar();               // clic fuera de la foto y el texto
  });
  document.addEventListener('keydown', function (evento) {
    if (!fondo.classList.contains('visible')) return;
    if (evento.key === 'Escape') cerrar();
    if (evento.key === 'ArrowRight') siguiente();
    if (evento.key === 'ArrowLeft') anterior();
  });
})();


/* --------------------------------------------------------------------------
   7. IMÁGENES QUE NO SE ENCUENTRAN
   --------------------------------------------------------------------------
   Si una foto no carga (por ejemplo, el nombre del archivo está mal escrito),
   se oculta para que no aparezca el icono de imagen rota.
   Además, cuando abres la página desde tu computador (archivo local), sale
   un aviso amarillo arriba con la lista de imágenes que faltan. Ese aviso
   NUNCA aparece en la página publicada en GitHub.
   -------------------------------------------------------------------------- */
(function () {
  var faltantes = [];

  function marcar(img) {
    if (img.classList.contains('img-no-encontrada')) return;
    img.classList.add('img-no-encontrada');
    faltantes.push(img.getAttribute('src'));
    mostrarAviso();
  }

  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) marcar(img);
    img.addEventListener('error', function () { marcar(img); });
  });

  var aviso = null;
  function mostrarAviso() {
    if (location.protocol !== 'file:') return;          // solo en el computador, nunca en GitHub
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.style.cssText = 'background:#fef17e;color:#1e2a12;font:14px/1.5 Arial,sans-serif;' +
        'padding:10px 16px;border-bottom:3px solid #1e2a12;';
      document.body.prepend(aviso);
    }
    aviso.innerHTML = '<strong>Aviso (solo lo ves tú, no aparece en la página publicada):</strong> ' +
      'no se encontraron estas imágenes, revisa que el nombre, la extensión y las mayúsculas ' +
      'coincidan exactamente: ' + faltantes.join(', ');
  }
})();
