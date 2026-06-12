// ===== ESTADO DEL JUEGO =====
const estado = {
  personaje:     null,
  provincia:     null,
  ciudad:        null,
  dinero:        30,
  poder:         30,
  reputacion:    30,   // interno, 0-100; se muestra como indicador cualitativo
  poderOscuro:   0,    // interno, influye en opciones disponibles; no se muestra como barra
  cargo:         'Militante de base',
  nivelCargo:    0,
  turno:         0,
  historial:     [],
  tonoPost:      null,
  enCampania:    false,
  turnosCampania: 0,
  escenario:     null,
};

const STATS_BASE = { dinero: 30, poder: 30, reputacion: 30 };

const PERSONAJES = {
  gustavo: { nombre: 'Gustavo Peralta' },
  julian:  { nombre: 'Julián Herrera' },
  rodrigo: { nombre: 'Rodrigo Casares' },
  valeria: { nombre: 'Valeria Sánchez' },
  marina:  { nombre: 'Martín Ríos' },
};

// ===== CIUDADES POR PROVINCIA =====
const CIUDADES = {
  'Buenos Aires (CABA)':     ['Palermo', 'La Boca', 'Mataderos', 'Villa Urquiza', 'Constitución', 'Flores', 'Belgrano'],
  'Buenos Aires (GBA)':      ['Quilmes', 'Lanús', 'Morón', 'San Isidro', 'Tigre', 'La Matanza', 'Avellaneda', 'Lomas de Zamora'],
  'Buenos Aires (Interior)': ['Mar del Plata', 'Bahía Blanca', 'La Plata', 'Tandil', 'Olavarría', 'Necochea', 'Azul'],
  'Córdoba':         ['Córdoba Capital', 'Villa Carlos Paz', 'Río Cuarto', 'Villa María', 'Alta Gracia', 'San Francisco'],
  'Santa Fe':        ['Rosario', 'Santa Fe Capital', 'Rafaela', 'Venado Tuerto', 'Villa Constitución'],
  'Mendoza':         ['Mendoza Capital', 'San Rafael', 'Godoy Cruz', 'Luján de Cuyo', 'Maipú'],
  'Tucumán':         ['San Miguel de Tucumán', 'Concepción', 'Banda del Río Salí', 'Aguilares'],
  'Entre Ríos':      ['Paraná', 'Concordia', 'Gualeguaychú', 'Colón', 'Villaguay'],
  'Salta':           ['Salta Capital', 'Orán', 'Tartagal', 'Cafayate', 'Rosario de la Frontera'],
  'Misiones':        ['Posadas', 'Oberá', 'Puerto Iguazú', 'Eldorado', 'Apóstoles'],
  'Chaco':           ['Resistencia', 'Pte. Roque Sáenz Peña', 'Villa Ángela', 'Charata'],
  'Corrientes':      ['Corrientes Capital', 'Goya', 'Mercedes', 'Paso de los Libres'],
  'Santiago del Estero': ['Santiago del Estero Capital', 'La Banda', 'Termas de Río Hondo', 'Frías'],
  'San Juan':        ['San Juan Capital', 'Rawson', 'Rivadavia', 'Santa Lucía', 'Caucete'],
  'Jujuy':           ['San Salvador de Jujuy', 'La Quiaca', 'Palpalá', 'Libertador Gral. San Martín'],
  'Río Negro':       ['Viedma', 'Bariloche', 'Cipolletti', 'General Roca', 'El Bolsón'],
  'Neuquén':         ['Neuquén Capital', 'Zapala', 'San Martín de los Andes', 'Cutral Có', 'Plottier'],
  'Formosa':         ['Formosa Capital', 'Clorinda', 'Pirané', 'General Mosconi'],
  'San Luis':        ['San Luis Capital', 'Villa Mercedes', 'Merlo', 'Justo Daract'],
  'Catamarca':       ['San Fernando del Valle', 'Santa María', 'Tinogasta', 'Andalgalá'],
  'La Rioja':        ['La Rioja Capital', 'Chilecito', 'Aimogasta', 'Chamical'],
  'La Pampa':        ['Santa Rosa', 'General Pico', 'Toay', 'Eduardo Castex'],
  'Chubut':          ['Rawson', 'Comodoro Rivadavia', 'Puerto Madryn', 'Trelew', 'Esquel'],
  'Santa Cruz':      ['Río Gallegos', 'Caleta Olivia', 'El Calafate', 'Puerto Deseado'],
  'Tierra del Fuego':['Ushuaia', 'Río Grande', 'Tolhuin'],
};

// ===== ESCALA DE CARGOS =====
const ESCALA_CARGOS = [
  { nivel: 0, cargo: 'Militante de base',    poderReq: 0  },
  { nivel: 1, cargo: 'Concejal',             poderReq: 20 },
  { nivel: 2, cargo: 'Intendente',           poderReq: 38 },
  { nivel: 3, cargo: 'Diputado Provincial',  poderReq: 52 },
  { nivel: 4, cargo: 'Senador Provincial',   poderReq: 63 },
  { nivel: 5, cargo: 'Gobernador',           poderReq: 74 },
  { nivel: 6, cargo: 'Diputado Nacional',    poderReq: 83 },
  { nivel: 7, cargo: 'Senador Nacional',     poderReq: 91 },
  { nivel: 8, cargo: 'Presidente',           poderReq: 98 },
];

// Reputación como indicador cualitativo
function etiquetaReputacion(val) {
  if (val <= 15) return { texto: 'Desconocido',  clase: 'rep-0' };
  if (val <= 30) return { texto: 'Conocido',     clase: 'rep-1' };
  if (val <= 50) return { texto: 'Reconocido',   clase: 'rep-2' };
  if (val <= 65) return { texto: 'Respetado',    clase: 'rep-3' };
  if (val <= 80) return { texto: 'Influyente',   clase: 'rep-4' };
  return               { texto: 'Legendario',    clase: 'rep-5' };
}

// ===== NAVEGACIÓN =====
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
}

function elegirPersonaje(id) {
  estado.personaje  = id;
  estado.dinero     = STATS_BASE.dinero;
  estado.poder      = STATS_BASE.poder;
  estado.reputacion = STATS_BASE.reputacion;
  document.getElementById('texto-personaje-elegido').textContent =
    `Jugando como: ${PERSONAJES[id].nombre}`;
  mostrarPantalla('pantalla-provincia');
}

function elegirProvincia(nombre) {
  estado.provincia = nombre;
  document.getElementById('texto-provincia-elegida').textContent = `Provincia: ${nombre}`;
  const grilla = document.getElementById('grilla-ciudades');
  grilla.innerHTML = (CIUDADES[nombre] || [])
    .map(c => `<button class="btn-provincia" onclick="elegirCiudad('${c}')">${c}</button>`)
    .join('');
  mostrarPantalla('pantalla-ciudad');
}

function elegirCiudad(nombre) {
  estado.ciudad = nombre;
  iniciarOficina();
  mostrarPantalla('pantalla-oficina');
}

// ===== OFICINA =====
function iniciarOficina() {
  actualizarStats();
  document.getElementById('zona-texto').textContent = `${estado.ciudad}, ${estado.provincia}`;
  actualizarBadgeAgenda();
  actualizarBadgeTele();
}

function actualizarStats() {
  document.getElementById('val-dinero').textContent = estado.dinero;
  document.getElementById('val-poder').textContent  = estado.poder;
  document.getElementById('barra-dinero').style.width = Math.min(estado.dinero, 100) + '%';
  document.getElementById('barra-poder').style.width  = Math.min(estado.poder,  100) + '%';

  const rep = etiquetaReputacion(estado.reputacion);
  const badge = document.getElementById('rep-indicador');
  badge.textContent  = rep.texto;
  badge.className    = `rep-badge ${rep.clase}`;

  verificarAscenso();
}

function verificarAscenso() {
  let nivelActual = ESCALA_CARGOS[0];
  for (const n of ESCALA_CARGOS) {
    if (estado.poder >= n.poderReq) nivelActual = n;
  }
  if (nivelActual.nivel !== estado.nivelCargo) {
    estado.nivelCargo = nivelActual.nivel;
    estado.cargo      = nivelActual.cargo;
    document.getElementById('cargo-texto').textContent = estado.cargo;
    mostrarNotificacion(`¡Ascendiste a ${estado.cargo}!`, 'positivo');
    generarMisionesPorNivel(estado.nivelCargo);
  }
}

function mostrarNotificacion(texto, tipo) {
  const n = document.createElement('div');
  n.className = `notif-ascenso ${tipo}`;
  n.textContent = texto;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3500);
}

function registrarAccion(texto, efectos) {
  estado.turno++;
  estado.historial.unshift({ texto, efectos, turno: estado.turno });

  if (estado.enCampania) {
    estado.turnosCampania--;
    if (estado.turnosCampania <= 0) finalizarCampania();
    else actualizarBannerCampania();
  }

  const lista = document.getElementById('lista-historial');
  const li = document.createElement('li');
  li.innerHTML = `<strong>#${estado.turno}</strong> ${texto} — ` +
    efectos.map(e =>
      `<span class="${e.valor >= 0 ? 'efecto-pos' : 'efecto-neg'}">${e.stat}: ${e.valor > 0 ? '+' : ''}${e.valor}</span>`
    ).join(', ');
  lista.prepend(li);

  actualizarStats();
  actualizarBadgeTele();
}

function aplicarEfectos(efectos) {
  efectos.forEach(e => {
    estado[e.stat] = Math.max(0, Math.min(100, (estado[e.stat] || 0) + e.valor));
  });
}

function toggleHistorial() {
  document.getElementById('historial').classList.toggle('oculto');
}

function actualizarBadgeAgenda() {
  document.getElementById('badge-agenda').textContent = misiones.length;
}

function actualizarBadgeTele() {
  const vigentes = noticias.filter(n => !n.usada && (n.creadaEnTurno + n.duracion) > estado.turno);
  const badge = document.getElementById('badge-tele');
  badge.textContent = vigentes.length > 0 ? '!' : '…';
  badge.style.display = vigentes.length > 0 ? 'flex' : 'none';
}

// ===== MODALES =====
function abrirModal(tipo) {
  document.getElementById('modal-overlay').classList.remove('oculto');
  document.getElementById('modal-contenido').innerHTML = generarContenidoModal(tipo);
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.add('oculto');
}

function generarContenidoModal(tipo) {
  switch (tipo) {
    case 'agenda':    return renderAgenda();
    case 'mapa':      return renderMapa();
    case 'tele':      return renderTele();
    case 'compu':     return renderCompu();
    case 'empleados': return renderEmpleados();
    case 'puerta':    return renderPuerta();
    case 'campania':  return renderCampania();
    default:          return '<p>En construcción...</p>';
  }
}

// ===== MISIONES =====
// Las misiones tienen nivel mínimo requerido; generarMisionesPorNivel las agrega al pool
const misionesBase = [
  {
    id: 'primera_reunion',
    nivelReq: 0,
    titulo: 'Primera reunión vecinal',
    descripcion: 'Te invitaron a hablar en una reunión del barrio sobre el problema de los baches. Hay unas cincuenta personas. Algunos parecen escépticos, otros esperanzados. ¿Cómo te manejás?',
    opciones: [
      {
        texto: '🤝 Prometé arreglarlos aunque todavía no tenés poder para eso',
        efectos: [{ stat: 'reputacion', valor: -5 }, { stat: 'poder', valor: 8 }],
        resultado: 'La gente te aplaudió de pie. Pero en el barrio quedó la duda de si sos de fiar. Alguien en el fondo murmuró: "Igual que todos".',
      },
      {
        texto: '📋 Escuchá a todos y comprometete a elevar el reclamo formalmente',
        efectos: [{ stat: 'reputacion', valor: 12 }, { stat: 'poder', valor: 3 }],
        resultado: 'Te ganaste el respeto del vecindario. Una señora mayor te agarró la mano y te dijo que su marido también fue concejal. Lento, pero seguro.',
      },
      {
        texto: '💰 Conseguí plata de un comerciante local para pagar el arreglo',
        efectos: [{ stat: 'dinero', valor: 15 }, { stat: 'reputacion', valor: -8 }, { stat: 'poderOscuro', valor: 8 }],
        resultado: 'Los baches se arreglaron en una semana. Algunos vecinos preguntan de dónde salió la plata. El comerciante espera el favor.',
      },
    ],
  },
  {
    id: 'entrevista_radio',
    nivelReq: 0,
    titulo: 'Te llaman de la radio local',
    descripcion: 'El periodista más escuchado del barrio quiere entrevistarte sobre la situación de los vecinos. Primero te avisa: "Soy duro, no te voy a tirar flores." Es tu primera exposición pública.',
    opciones: [
      {
        texto: '🎤 Critcá al intendente actual sin filtro',
        efectos: [{ stat: 'reputacion', valor: 5 }, { stat: 'poder', valor: 10 }],
        resultado: 'Generaste ruido político. El periodista te metió una pregunta trampa sobre las obras y la zafaste bien. Algunos te odian, muchos te escucharon.',
      },
      {
        texto: '📢 Hablá solo de propuestas concretas, sin atacar a nadie',
        efectos: [{ stat: 'reputacion', valor: 15 }, { stat: 'poder', valor: 5 }],
        resultado: 'El periodista terminó diciéndote "raro pero interesante". Tres vecinos te llamaron al día siguiente para sumarse.',
      },
      {
        texto: '🚫 Rechazá la entrevista, todavía no es el momento',
        efectos: [{ stat: 'reputacion', valor: 2 }],
        resultado: 'Prudente. Guardás pólvora para cuando valga más. El periodista te mandó un mensaje igual: "Cuando quieras, la puerta está abierta."',
      },
    ],
  },
  {
    id: 'sobre_anonimo',
    nivelReq: 0,
    titulo: 'Un sobre en tu puerta',
    descripcion: 'Apareció un sobre sin remitente con $50.000 en efectivo y una nota: "Para el candidato que sabe lo que se hace. Ya nos conoceremos." Nadie vio quién lo dejó.',
    opciones: [
      {
        texto: '🗑️ Tirar el sobre y no saber nada',
        efectos: [{ stat: 'reputacion', valor: 8 }],
        resultado: 'Dormís tranquilo. Por ahora.',
      },
      {
        texto: '💵 Quedarte la plata sin preguntar',
        efectos: [{ stat: 'dinero', valor: 20 }, { stat: 'poderOscuro', valor: 15 }, { stat: 'reputacion', valor: -5 }],
        resultado: 'El dinero entró en caja. Alguien en algún lugar tomó nota.',
      },
      {
        texto: '🤫 Guardar la plata y mandar a averiguar quién la mandó',
        efectos: [{ stat: 'dinero', valor: 20 }, { stat: 'poderOscuro', valor: 20 }, { stat: 'poder', valor: 5 }],
        resultado: 'Era la familia Rodero. Importadores con negocios grises. Ahora tienen un canal directo a vos. Eso tiene precio.',
      },
    ],
  },
  {
    id: 'paro_barrial',
    nivelReq: 0,
    titulo: 'Paro de actividades en el barrio',
    descripcion: 'Los comerciantes cerraron sus locales en protesta por la inseguridad. Hay una asamblea improvisada en la vereda. Alguien te reconoció y te pidió que hables.',
    opciones: [
      {
        texto: '🏛️ Apoyar el paro y pedir seguridad al municipio',
        efectos: [{ stat: 'reputacion', valor: 10 }, { stat: 'poder', valor: 8 }],
        resultado: 'Los comerciantes te aplaudieron. El intendente te ignoró, pero el diario local publicó una foto tuya.',
      },
      {
        texto: '🤐 Pedir calma y diálogo, sin pronunciarte a favor del paro',
        efectos: [{ stat: 'reputacion', valor: -3 }, { stat: 'poder', valor: 5 }],
        resultado: 'Te chiflaron un poco. Pero el jefe del bloque del partido te llamó para felicitarte por "la madurez".',
      },
      {
        texto: '💬 Usar el espacio para presentarte como candidato',
        efectos: [{ stat: 'reputacion', valor: 6 }, { stat: 'poder', valor: 12 }],
        resultado: 'Algunos dijeron que te colgaste del momento. Pero tu nombre quedó grabado en más de veinte celulares esa tarde.',
      },
    ],
  },
  {
    id: 'periodista_investiga',
    nivelReq: 1,
    titulo: 'Un periodista te investiga',
    descripcion: 'Un cronista independiente está preguntando por tu financiamiento. Dice que quiere "contar la historia real" de cómo empezaste. Le dijeron de los Rodero.',
    opciones: [
      {
        texto: '📰 Dar una entrevista transparente y contar la versión limpia',
        efectos: [{ stat: 'reputacion', valor: 12 }, { stat: 'poder', valor: -3 }],
        resultado: 'La nota salió bien. Los Rodero te mandaron un mensaje frío: "Cuidado con lo que hablás."',
      },
      {
        texto: '🤐 No hablar y dejar que el tema se enfríe solo',
        efectos: [{ stat: 'reputacion', valor: -5 }, { stat: 'poder', valor: 3 }],
        resultado: 'La nota salió igual, con datos incompletos. Quedó en el aire.',
      },
      {
        texto: '🎭 Ofrecer al periodista una nota exclusiva sobre otro tema más jugoso',
        efectos: [{ stat: 'reputacion', valor: 2 }, { stat: 'poderOscuro', valor: 10 }, { stat: 'poder', valor: 6 }],
        resultado: 'Desviaste el foco. El periodista publicó la nota que vos querías. Ahora te debe una... o te teme.',
      },
    ],
  },
  {
    id: 'elecciones_internas',
    nivelReq: 1,
    titulo: 'Elecciones internas del partido',
    descripcion: 'El partido va a elegir candidato a concejal. Te anotaste, pero hay otro candidato más conocido. Tenés tres días para hacer política interna.',
    opciones: [
      {
        texto: '🗳️ Campaña limpia: reuniones, propuestas, debate cara a cara',
        efectos: [{ stat: 'reputacion', valor: 15 }, { stat: 'poder', valor: 10 }],
        resultado: 'Perdiste por pocos votos pero quedaste como la figura moral del partido. El candidato ganador te buscó para armar equipo.',
      },
      {
        texto: '🤑 Repartir favores y promesas a los afiliados clave',
        efectos: [{ stat: 'dinero', valor: -15 }, { stat: 'poder', valor: 18 }, { stat: 'poderOscuro', valor: 8 }],
        resultado: 'Ganaste la interna. Pero todos saben cómo ganaste. Eso tiene su propio valor.',
      },
      {
        texto: '🔪 Filtrar información comprometedora sobre el otro candidato',
        efectos: [{ stat: 'reputacion', valor: -12 }, { stat: 'poder', valor: 20 }, { stat: 'poderOscuro', valor: 15 }],
        resultado: 'Ganaste. El candidato desplazado juró venganza. Algunos en el partido te miran diferente ahora.',
      },
    ],
  },
  {
    id: 'contrato_municipal',
    nivelReq: 2,
    titulo: 'Un contrato municipal en juego',
    descripcion: 'Una empresa constructora quiere el contrato para remodelar el parque central. Pasaron a verte. Son amigos del intendente anterior, pero también conocidos de los Rodero. La licitación tiene margen para "acomodar" el resultado.',
    opciones: [
      {
        texto: '🏗️ Llamar a una licitación abierta y transparente',
        efectos: [{ stat: 'reputacion', valor: 18 }, { stat: 'poder', valor: 5 }],
        resultado: 'El parque se remodeló bien. La nota en el diario fue buena. La constructora nunca más te llamó. Los Rodero tampoco.',
      },
      {
        texto: '🤝 Favorecer a la empresa pero pedirles que hagan el trabajo bien',
        efectos: [{ stat: 'dinero', valor: 25 }, { stat: 'poder', valor: 10 }, { stat: 'reputacion', valor: -8 }, { stat: 'poderOscuro', valor: 10 }],
        resultado: 'El parque quedó más o menos. Nadie preguntó demasiado. Hubo un "reconocimiento" en tu cuenta.',
      },
      {
        texto: '💰 Armar un esquema de sobreprecios a cambio de una comisión',
        efectos: [{ stat: 'dinero', valor: 40 }, { stat: 'reputacion', valor: -20 }, { stat: 'poderOscuro', valor: 25 }, { stat: 'poder', valor: 8 }],
        resultado: 'Muy buen negocio. El parque quedó pésimo. Nadie puede probarte nada todavía.',
      },
    ],
  },
  {
    id: 'rival_politico',
    nivelReq: 2,
    titulo: 'Tu rival quiere aliarse',
    descripcion: 'El concejal de la oposición — tu principal competidor hasta ahora — te pidió una reunión privada. Llegó solo. Dice que tiene información sobre el intendente que puede beneficiarlos a los dos.',
    opciones: [
      {
        texto: '🤝 Escucharlo y considerar la alianza',
        efectos: [{ stat: 'poder', valor: 12 }, { stat: 'reputacion', valor: -4 }],
        resultado: 'Armaron una alianza táctica. Algunos aliados tuyos se preocuparon. Pero el movimiento te dio acceso a información que antes no tenías.',
      },
      {
        texto: '🚪 Rechazarlo educadamente y reportar la reunión públicamente',
        efectos: [{ stat: 'reputacion', valor: 15 }, { stat: 'poder', valor: 4 }],
        resultado: 'Tu imagen de independencia creció. Pero el rival ahora es un enemigo declarado.',
      },
      {
        texto: '🎯 Escucharlo, tomar la información y usarla sin hacer la alianza',
        efectos: [{ stat: 'poder', valor: 18 }, { stat: 'reputacion', valor: -10 }, { stat: 'poderOscuro', valor: 12 }],
        resultado: 'Información valiosa en tus manos. El rival se enteró de que lo usaste. Créate un enemigo peligroso y bien informado.',
      },
    ],
  },
  {
    id: 'escandalo_propio',
    nivelReq: 3,
    titulo: 'Aparece una foto comprometedora',
    descripcion: 'Un usuario anónimo publicó una foto tuya cenando con el dueño de los Rodero en un restaurante privado. La foto es de hace seis meses. Tu equipo te avisa a las 2 AM.',
    opciones: [
      {
        texto: '📢 Salir a aclarar antes de que crezca: "Es una reunión de trabajo"',
        efectos: [{ stat: 'reputacion', valor: -8 }, { stat: 'poder', valor: 3 }],
        resultado: 'Algunos te creyeron. Otros no. El tema duró dos días en trending y después murió.',
      },
      {
        texto: '🤐 No decir nada y esperar que pase',
        efectos: [{ stat: 'reputacion', valor: -18 }, { stat: 'poder', valor: -3 }],
        resultado: 'Creció sola. Te pasaron tres días difíciles. Tus adversarios lo usaron en campaña.',
      },
      {
        texto: '⚡ Contraatacar revelando algo sobre quien publicó la foto',
        efectos: [{ stat: 'reputacion', valor: -5 }, { stat: 'poder', valor: 10 }, { stat: 'poderOscuro', valor: 8 }],
        resultado: 'La narrativa cambió. La gente empezó a hablar de quién te perseguía más que de la cena. Método cuestionable, efectivo.',
      },
    ],
  },
];

// Pool activo de misiones (empieza con las de nivel 0)
const misiones = misionesBase.filter(m => m.nivelReq === 0).map(m => ({ ...m }));

function generarMisionesPorNivel(nivel) {
  const nuevas = misionesBase
    .filter(m => m.nivelReq === nivel && !misiones.find(x => x.id === m.id));
  misiones.push(...nuevas.map(m => ({ ...m })));
  actualizarBadgeAgenda();
  if (nuevas.length > 0) {
    mostrarNotificacion(`📋 ${nuevas.length} misión(es) nueva(s) en la agenda`, 'positivo');
  }
}

function renderAgenda() {
  const pendientes = misiones.filter(m => !m.resuelta);
  if (pendientes.length === 0) {
    return `<h3>📋 Agenda</h3><p style="color:#aaa">Sin misiones pendientes. Salí a la calle o mirá las noticias.</p>`;
  }
  return `<h3>📋 Agenda — ${pendientes.length} pendiente(s)</h3>` +
    pendientes.map((m, i) => `
      <div class="mision">
        <h4>${m.titulo}</h4>
        <p>${m.descripcion}</p>
        <div class="opciones-mision">
          ${m.opciones.map((op, j) => `
            <button class="btn-opcion" onclick="resolverMision('${m.id}', ${j})">${op.texto}</button>
          `).join('')}
        </div>
      </div>
    `).join('');
}

function resolverMision(misionId, indiceOpcion) {
  const idx    = misiones.findIndex(m => m.id === misionId);
  const mision = misiones[idx];
  const opcion = mision.opciones[indiceOpcion];

  aplicarEfectos(opcion.efectos);
  registrarAccion(mision.titulo, opcion.efectos);
  misiones.splice(idx, 1);
  actualizarBadgeAgenda();

  document.getElementById('modal-contenido').innerHTML = `
    <h3>✅ ${mision.titulo}</h3>
    <p style="margin-bottom:1rem; color:#ccc">${opcion.resultado}</p>
    <div style="background:#0f1e35; border-radius:8px; padding:0.8rem">
      ${opcion.efectos.map(e => `
        <p style="font-size:0.85rem; color:${e.valor >= 0 ? '#4caf50' : '#f44336'}">
          ${e.stat}: ${e.valor > 0 ? '+' : ''}${e.valor}
        </p>`).join('')}
    </div>
    <button class="btn-elegir" style="margin-top:1rem" onclick="cerrarModal()">Continuar</button>
  `;
}

// ===== EVENTOS (AGENDA NORMAL) =====
const tiposEvento = [
  {
    id: 'partido_futbol',
    titulo: '🏟️ Partido de fútbol — fecha local',
    escenario: 'Estadio municipal. Lleno. La gente está caliente porque el equipo no gana hace cinco fechas.',
    descripcion: 'Te invitaron al palco oficial. Hay cámaras. La cancha ruge. ¿Qué hacés?',
    opciones: [
      { texto: 'Bajar a la platea popular y mezclarte con la gente', efectos: [{ stat: 'reputacion', valor: 12 }, { stat: 'poder', valor: 6 }], resultado: 'Te sacaron fotos con los hinchas. "Uno de nosotros", dijo alguien.' },
      { texto: 'Quedarte en el palco y saludar con protocolo', efectos: [{ stat: 'reputacion', valor: 3 }, { stat: 'poder', valor: 4 }], resultado: 'Imagen formal. Nada especial.' },
      { texto: 'Aprovechar el micrófono del entretiempo para decir unas palabras', efectos: [{ stat: 'reputacion', valor: 8 }, { stat: 'poder', valor: 10 }, { stat: 'dinero', valor: -3 }], resultado: 'Silbidos y aplausos mezclados. Pero te vieron miles.' },
    ],
  },
  {
    id: 'recital',
    titulo: '🎸 Recital masivo en la ciudad',
    escenario: 'Parque municipal. Diez mil personas. Jóvenes, música, olor a choripán.',
    descripcion: 'Te invitaron como representante local al evento. Hay prensa. ¿Cómo aparecés?',
    opciones: [
      { texto: 'Subir al escenario a saludar brevemente', efectos: [{ stat: 'reputacion', valor: 10 }, { stat: 'poder', valor: 8 }], resultado: 'El público respondió bien. La foto del escenario recorrió las redes.' },
      { texto: 'Circular por la zona VIP y hacer contactos', efectos: [{ stat: 'poder', valor: 6 }, { stat: 'dinero', valor: 5 }], resultado: 'Conociste al organizador del evento. Tiene llegada a muchos sponsors.' },
      { texto: 'Ir disfrazado de civil y hablar con gente sin revelar quién sos', efectos: [{ stat: 'reputacion', valor: 15 }, { stat: 'poder', valor: 3 }], resultado: 'Un joven te reconoció igual. La historia de que "andabas mezclado con la gente" se viralizó.' },
    ],
  },
  {
    id: 'inauguracion_obra',
    titulo: '🏗️ Inauguración de obra pública',
    escenario: 'Calle recién asfaltada. Vecinos con banderas. Fotógrafos del municipio.',
    descripcion: 'Podés sumarte a la foto oficial o diferenciarte. La obra la impulsó el intendente, no vos.',
    opciones: [
      { texto: 'Participar y felicitar públicamente al intendente', efectos: [{ stat: 'reputacion', valor: 5 }, { stat: 'poder', valor: 8 }], resultado: 'Gesto político apreciado. El intendente te agradeció privadamente.' },
      { texto: 'No ir y emitir un comunicado señalando que llegó tarde', efectos: [{ stat: 'reputacion', valor: 8 }, { stat: 'poder', valor: 5 }], resultado: 'La oposición te celebró. El intendente tomó nota.' },
      { texto: 'Ir pero hablarle a los vecinos por separado, sin el intendente', efectos: [{ stat: 'reputacion', valor: 12 }, { stat: 'poder', valor: 10 }], resultado: 'Dos actos paralelos en el mismo lugar. La prensa lo notó.' },
    ],
  },
  {
    id: 'hospital',
    titulo: '🏥 Visita al hospital público',
    escenario: 'Guardia colapsada. Sillas todas ocupadas. Enfermeras exhaustas. Alguien llora en un pasillo.',
    descripcion: 'El hospital está en crisis. Podés estar ahí políticamente o humanamente. ¿Qué hacés?',
    opciones: [
      { texto: 'Convocar a la prensa y denunciar la situación', efectos: [{ stat: 'reputacion', valor: 10 }, { stat: 'poder', valor: 8 }], resultado: 'La nota salió fuerte. La directora del hospital te agradeció y te odió al mismo tiempo.' },
      { texto: 'Entrar sin cámaras, hablar con médicos y escuchar', efectos: [{ stat: 'reputacion', valor: 18 }, { stat: 'poder', valor: 3 }], resultado: 'Una enfermera te contó cosas que nunca se publicaron. Información que vale.' },
      { texto: 'Gestionar insumos de urgencia con recursos propios', efectos: [{ stat: 'dinero', valor: -10 }, { stat: 'reputacion', valor: 20 }, { stat: 'poder', valor: 5 }], resultado: 'Los insumos llegaron ese día. El jefe de guardia te mandó un mensaje que guardaste para siempre.' },
    ],
  },
  {
    id: 'inundacion',
    titulo: '🌊 Inundación en el barrio bajo',
    escenario: 'Agua en las calles, familias sacando colchones. El municipio tardó. Los vecinos están solos.',
    descripcion: 'Es una catástrofe menor pero muy visible. La gente necesita ayuda, y también alguien a quién culpar.',
    opciones: [
      { texto: 'Ir personalmente con voluntarios a ayudar', efectos: [{ stat: 'reputacion', valor: 20 }, { stat: 'poder', valor: 8 }, { stat: 'dinero', valor: -5 }], resultado: 'Las imágenes te mostraron con las botas en el barro. Dieron la vuelta al país.' },
      { texto: 'Organizar una colecta desde la oficina', efectos: [{ stat: 'reputacion', valor: 10 }, { stat: 'poder', valor: 5 }], resultado: 'Buena iniciativa, menos impacto visual. La gente agradeció igual.' },
      { texto: 'Culpar públicamente al gobierno provincial y pedir intervención', efectos: [{ stat: 'reputacion', valor: 6 }, { stat: 'poder', valor: 12 }], resultado: 'El gobernador respondió con furia. Buen combate público para tus seguidores.' },
    ],
  },
  {
    id: 'teatro',
    titulo: '🎭 Estreno de obra de teatro local',
    escenario: 'Sala independiente, cien personas. Artistas del barrio que llevan años trabajando sin subsidio.',
    descripcion: 'Te invitaron al estreno. Hay una propuesta de financiamiento cultural encima de la mesa.',
    opciones: [
      { texto: 'Comprometerte públicamente a apoyar el proyecto cultural', efectos: [{ stat: 'reputacion', valor: 12 }, { stat: 'dinero', valor: -5 }], resultado: 'Los artistas te abrazaron. La comunidad cultural te adoptó.' },
      { texto: 'Ir, disfrutar, y no comprometerte a nada', efectos: [{ stat: 'reputacion', valor: 3 }], resultado: 'Noche tranquila. Sin consecuencias.' },
      { texto: 'Proponer que la sala sea sede de eventos del partido', efectos: [{ stat: 'poder', valor: 8 }, { stat: 'reputacion', valor: -5 }], resultado: 'Los artistas se enojaron en silencio. Tenés el espacio igual.' },
    ],
  },
  {
    id: 'incendio',
    titulo: '🔥 Incendio en un depósito abandonado',
    escenario: 'Humo negro sobre el barrio. Bomberos trabajando. Vecinos mirando desde la vereda.',
    descripcion: 'No hubo heridos, pero el depósito era de un empresario con vínculos políticos conocidos. Algunos dicen que el incendio fue intencional.',
    opciones: [
      { texto: 'Pedir una investigación y hacer el pedido formal al juzgado', efectos: [{ stat: 'reputacion', valor: 15 }, { stat: 'poder', valor: 5 }], resultado: 'La investigación avanza lento. Pero tu nombre quedó asociado a la exigencia de justicia.' },
      { texto: 'Estar presente, dar declaraciones a la prensa y no teorizar', efectos: [{ stat: 'reputacion', valor: 8 }, { stat: 'poder', valor: 7 }], resultado: 'Imagen sólida. Sin compromiso político por el momento.' },
      { texto: 'Usar la situación para presionar al empresario vinculado', efectos: [{ stat: 'poder', valor: 15 }, { stat: 'poderOscuro', valor: 12 }, { stat: 'reputacion', valor: -8 }], resultado: 'El empresario cedió. No saben qué cedió, pero algo cedió.' },
    ],
  },
];

let eventosActivos = [tiposEvento[0], tiposEvento[1]]; // Empieza con dos eventos

function agregarEventoAleatorio() {
  const disponibles = tiposEvento.filter(e => !eventosActivos.find(a => a.id === e.id));
  if (disponibles.length === 0) return;
  const nuevo = disponibles[Math.floor(Math.random() * disponibles.length)];
  eventosActivos.push(nuevo);
  mostrarNotificacion(`📅 Nuevo evento: ${nuevo.titulo}`, 'positivo');
}

function renderAgendaEventos() {
  if (eventosActivos.length === 0) return '';
  return `
    <div style="border-top:1px solid #2a3a5c; margin-top:1rem; padding-top:0.8rem">
      <p style="font-size:0.75rem; color:#e8c547; text-transform:uppercase; margin-bottom:0.5rem">Eventos</p>
      ${eventosActivos.map((ev, i) => `
        <div class="mision evento">
          <div class="evento-escenario">${ev.escenario}</div>
          <h4>${ev.titulo}</h4>
          <p>${ev.descripcion}</p>
          <div class="opciones-mision">
            ${ev.opciones.map((op, j) => `
              <button class="btn-opcion" onclick="resolverEvento(${i}, ${j})">${op.texto}</button>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function resolverEvento(indiceEvento, indiceOpcion) {
  const evento = eventosActivos[indiceEvento];
  const opcion = evento.opciones[indiceOpcion];

  aplicarEfectos(opcion.efectos);
  registrarAccion(evento.titulo, opcion.efectos);
  eventosActivos.splice(indiceEvento, 1);

  // Chance de agregar nuevo evento
  if (Math.random() > 0.4) agregarEventoAleatorio();

  document.getElementById('modal-contenido').innerHTML = `
    <h3>✅ ${evento.titulo}</h3>
    <p style="margin-bottom:1rem; color:#ccc; font-style:italic">${evento.escenario}</p>
    <p style="margin-bottom:1rem; color:#e0e0e0">${opcion.resultado}</p>
    <div style="background:#0f1e35; border-radius:8px; padding:0.8rem">
      ${opcion.efectos.map(e => `
        <p style="font-size:0.85rem; color:${e.valor >= 0 ? '#4caf50' : '#f44336'}">
          ${e.stat}: ${e.valor > 0 ? '+' : ''}${e.valor}
        </p>`).join('')}
    </div>
    <button class="btn-elegir" style="margin-top:1rem" onclick="cerrarModal()">Continuar</button>
  `;
}

// Sobreescribir renderAgenda para incluir eventos
function renderAgenda() {
  const pendientes = misiones.filter(m => !m.resuelta);
  const hayMisiones = pendientes.length > 0;
  const hayEventos  = eventosActivos.length > 0;

  if (!hayMisiones && !hayEventos) {
    return `<h3>📋 Agenda</h3><p style="color:#aaa">Sin pendientes. Salí a la calle o mirá las noticias.</p>`;
  }

  let html = `<h3>📋 Agenda</h3>`;

  if (hayMisiones) {
    html += `<p style="font-size:0.75rem; color:#e8c547; text-transform:uppercase; margin-bottom:0.5rem">Misiones (${pendientes.length})</p>`;
    html += pendientes.map((m, i) => `
      <div class="mision">
        <h4>${m.titulo}</h4>
        <p>${m.descripcion}</p>
        <div class="opciones-mision">
          ${m.opciones.map((op, j) => `
            <button class="btn-opcion" onclick="resolverMision('${m.id}', ${j})">${op.texto}</button>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  html += renderAgendaEventos();
  return html;
}

// ===== CAMPAÑA ELECTORAL =====
const DURACION_CAMPANIA = 10; // turnos

const destinosCampania = [
  { nombre: 'Recorrida por el interior', costo: 8, efectos: [{ stat: 'poder', valor: 12 }, { stat: 'reputacion', valor: 8 }], desc: 'Cuatro días en pueblos que nunca habían visto un candidato en persona.' },
  { nombre: 'Acto en la capital provincial', costo: 12, efectos: [{ stat: 'poder', valor: 15 }, { stat: 'reputacion', valor: 5 }], desc: 'Mil personas en el centro. Prensa nacional.' },
  { nombre: 'Debate televisivo', costo: 0, efectos: [{ stat: 'poder', valor: 8 }, { stat: 'reputacion', valor: 15 }], desc: 'Cara a cara con tu rival. El que gana el debate, gana terreno.' },
  { nombre: 'Campaña en redes (equipo digital)', costo: 10, efectos: [{ stat: 'poder', valor: 10 }, { stat: 'reputacion', valor: 10 }], desc: 'Cobertura full en redes durante una semana.' },
  { nombre: 'Visita a comunidades vulnerables', costo: 5, efectos: [{ stat: 'reputacion', valor: 18 }, { stat: 'poder', valor: 6 }], desc: 'Sin cámaras, solo escuchar. Pero alguien siempre filma.' },
];

function activarCampania() {
  estado.enCampania   = true;
  estado.turnosCampania = DURACION_CAMPANIA;
  document.getElementById('banner-campania').classList.remove('oculto');
  document.getElementById('obj-campania').classList.remove('oculto');
  actualizarBannerCampania();
  mostrarNotificacion('📣 ¡Modo campaña activado!', 'positivo');
  cerrarModal();
}

function actualizarBannerCampania() {
  document.getElementById('campania-turnos').textContent =
    `${estado.turnosCampania} turno(s) restante(s)`;
}

function finalizarCampania() {
  estado.enCampania = false;
  document.getElementById('banner-campania').classList.add('oculto');
  document.getElementById('obj-campania').classList.add('oculto');
  mostrarNotificacion('📣 Campaña finalizada', 'positivo');
}

function renderCampania() {
  if (!estado.enCampania) {
    return `
      <h3>📣 Modo Campaña</h3>
      <p style="color:#aaa; font-size:0.85rem; margin-bottom:1rem">
        Activar el modo campaña habilita una agenda especial con viajes, actos y debate.
        Dura ${DURACION_CAMPANIA} turnos. Cada acción de campaña consume un turno del contador.
      </p>
      <button class="btn-elegir" onclick="activarCampania()">Iniciar campaña</button>
    `;
  }

  return `
    <h3>📣 Agenda de Campaña — ${estado.turnosCampania} turno(s)</h3>
    <p style="color:#aaa; font-size:0.82rem; margin-bottom:1rem">
      Cada acción consume un turno de campaña. Elegí bien dónde invertís el tiempo.
    </p>
    ${destinosCampania.map((d, i) => `
      <div class="mision campania-item">
        <h4>${d.nombre}</h4>
        <p>${d.desc}</p>
        ${d.costo > 0 ? `<p style="color:#e8c547; font-size:0.78rem">Costo: $${d.costo}</p>` : ''}
        <button class="btn-opcion" onclick="ejecutarAccionCampania(${i})"
          ${estado.dinero < d.costo ? 'disabled style="opacity:0.4"' : ''}>
          ▶ Ir
        </button>
      </div>
    `).join('')}
  `;
}

function ejecutarAccionCampania(indice) {
  const destino = destinosCampania[indice];
  if (estado.dinero < destino.costo) return;

  if (destino.costo > 0) estado.dinero -= destino.costo;
  aplicarEfectos(destino.efectos);
  registrarAccion(`Campaña: ${destino.nombre}`, destino.efectos);

  document.getElementById('modal-contenido').innerHTML = `
    <h3>📣 ${destino.nombre}</h3>
    <p style="color:#ccc; margin-bottom:1rem">${destino.desc}</p>
    <div style="background:#0f1e35; border-radius:8px; padding:0.8rem">
      ${destino.efectos.map(e => `
        <p style="font-size:0.85rem; color:${e.valor >= 0 ? '#4caf50' : '#f44336'}">
          ${e.stat}: ${e.valor > 0 ? '+' : ''}${e.valor}
        </p>`).join('')}
    </div>
    <p style="color:#888; font-size:0.78rem; margin-top:0.8rem">Turnos restantes: ${estado.turnosCampania}</p>
    <button class="btn-elegir" style="margin-top:1rem" onclick="cerrarModal()">Continuar</button>
  `;
}

// ===== NOTICIAS CON TIEMPO =====
const DURACION_NOTICIA   = 4;
const PENALIZACION_VIEJA = [{ stat: 'reputacion', valor: -6 }, { stat: 'poder', valor: 3 }];
const BONUS_HISTORICA    = [{ stat: 'reputacion', valor: 4 },  { stat: 'poder', valor: 2 }];

const noticias = [
  {
    id: 'inflacion',
    titulo: 'Inflación mensual supera el 15%',
    cuerpo: 'Los precios siguen subiendo. La gente está enojada con el gobierno. Tu oportunidad para alzar la voz.',
    efectos: [{ stat: 'reputacion', valor: 10 }, { stat: 'poder', valor: 8 }],
    creadaEnTurno: 0, duracion: DURACION_NOTICIA, usada: false,
  },
  {
    id: 'escandalo',
    titulo: 'Escándalo de corrupción en la municipalidad',
    cuerpo: 'Contratos irregulares filtrados. El intendente desmiente todo. La oposición exige renuncias.',
    efectos: [{ stat: 'reputacion', valor: 8 }, { stat: 'poder', valor: 12 }],
    creadaEnTurno: 0, duracion: DURACION_NOTICIA, usada: false,
  },
  {
    id: 'dolar',
    titulo: 'El dólar sube pero nadie se sorprende',
    cuerpo: 'Nuevo récord histórico. Los ahorristas hacen cola en las cuevas. Negocio para algunos, drama para muchos.',
    efectos: [{ stat: 'reputacion', valor: 5 }, { stat: 'poder', valor: 5 }],
    creadaEnTurno: 1, duracion: DURACION_NOTICIA, usada: false,
  },
  {
    id: 'presupuesto',
    titulo: 'El presupuesto municipal fue rechazado',
    cuerpo: 'El Concejo rechazó el presupuesto presentado por el ejecutivo. Caos administrativo en puerta.',
    efectos: [{ stat: 'poder', valor: 10 }, { stat: 'reputacion', valor: 6 }],
    creadaEnTurno: 2, duracion: DURACION_NOTICIA, usada: false,
  },
];

function estadoNoticia(n) {
  if (n.usada) return 'usada';
  const restantes = (n.creadaEnTurno + n.duracion) - estado.turno;
  if (restantes > 1) return 'vigente';
  if (restantes === 1) return 'por-vencer';
  return 'vencida';
}

function renderTele() {
  return `<h3>📺 Noticias del día</h3>
    <p style="color:#888; font-size:0.78rem; margin-bottom:1rem">
      Las noticias tienen un tiempo de acción. Si llegás tarde, quedás como oportunista.
      Las viejas se pueden usar como cita histórica con menor impacto.
    </p>` +
    noticias.map((n, i) => {
      const est = estadoNoticia(n);
      const restantes = (n.creadaEnTurno + n.duracion) - estado.turno;
      let badge = '', botones = '';

      if (est === 'usada') {
        badge = `<span class="noticia-tag usada">Ya usada</span>`;
      } else if (est === 'vigente') {
        badge = `<span class="noticia-tag vigente">🟢 ${restantes} turnos</span>`;
        botones = `<button class="btn-opcion" style="margin-top:0.5rem" onclick="usarNoticia(${i}, false)">⚡ Aprovechar ahora</button>`;
      } else if (est === 'por-vencer') {
        badge = `<span class="noticia-tag alerta">🟡 Último turno</span>`;
        botones = `<button class="btn-opcion" style="margin-top:0.5rem" onclick="usarNoticia(${i}, false)">⚡ Aprovechar (último momento)</button>`;
      } else {
        badge = `<span class="noticia-tag vencida">🔴 Venció</span>`;
        botones = `<button class="btn-opcion oportunista" style="margin-top:0.5rem" onclick="usarNoticia(${i}, true)">📰 Usar como cita histórica</button>`;
      }

      return `
        <div class="noticia-item ${est}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem">
            <h4>${n.titulo}</h4>${badge}
          </div>
          <p>${n.cuerpo}</p>${botones}
        </div>`;
    }).join('');
}

function usarNoticia(indice, esHistorica) {
  const n = noticias[indice];
  n.usada = true;
  const est = estadoNoticia(n);

  let efectos, mensaje;
  if (esHistorica) {
    efectos = BONUS_HISTORICA;
    mensaje = `Usaste "${n.titulo}" como referencia histórica. Algunos lo valoraron, otros sintieron que llegaste tarde.`;
  } else if (est === 'vencida') {
    efectos = PENALIZACION_VIEJA;
    mensaje = `Querés aprovechar "${n.titulo}" pero ya pasó el momento. Te tildan de oportunista.`;
  } else {
    efectos = n.efectos;
    mensaje = `Tomaste posición sobre "${n.titulo}". Tu nombre empieza a circular.`;
  }

  aplicarEfectos(efectos);
  registrarAccion(`Noticia: "${n.titulo}"`, efectos);

  document.getElementById('modal-contenido').innerHTML = `
    <h3>📢 Tomaste posición</h3>
    <p style="color:#ccc; margin-bottom:1rem">${mensaje}</p>
    ${efectos.map(e => `
      <p style="color:${e.valor >= 0 ? '#4caf50' : '#f44336'}">
        ${e.stat}: ${e.valor > 0 ? '+' : ''}${e.valor}
      </p>`).join('')}
    <button class="btn-elegir" style="margin-top:1rem" onclick="cerrarModal()">Continuar</button>
  `;
}

// ===== MAPA =====
function renderMapa() {
  return `
    <h3>🗺️ ${estado.ciudad}, ${estado.provincia}</h3>
    <p style="color:#aaa; font-size:0.85rem; margin-bottom:1rem">
      Con tu nivel actual operás en tu zona local. A mayor poder, más lugares se desbloquean.
    </p>
    <div style="background:#0f1e35; border-radius:8px; padding:1rem; text-align:center; color:#555; font-size:0.85rem">
      🗺️ Mapa visual en construcción...<br>
      <span style="font-size:0.75rem">Podés hacer política desde la puerta mientras tanto.</span>
    </div>
  `;
}

// ===== REDES =====
function renderCompu() {
  return `
    <h3>💻 Redes Sociales</h3>
    <p style="color:#aaa; font-size:0.82rem; margin-bottom:0.8rem">
      Un post bien puesto da exposición. Uno mal puesto hunde.
    </p>
    <textarea class="post-area" id="texto-post" placeholder="¿Qué vas a decir hoy?..."></textarea>
    <p style="font-size:0.8rem; color:#888; margin-bottom:0.5rem">Tono:</p>
    <div class="tonos-post">
      <button class="btn-tono" onclick="seleccionarTono('propositivo', this)">🤝 Propositivo</button>
      <button class="btn-tono" onclick="seleccionarTono('critico', this)">🔥 Crítico</button>
      <button class="btn-tono" onclick="seleccionarTono('populista', this)">📣 Populista</button>
      <button class="btn-tono" onclick="seleccionarTono('tecnico', this)">📊 Técnico</button>
    </div>
    <button class="btn-publicar" onclick="publicarPost()">Publicar</button>
  `;
}

function seleccionarTono(tono, btn) {
  document.querySelectorAll('.btn-tono').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
  estado.tonoPost = tono;
}

function publicarPost() {
  const texto = document.getElementById('texto-post').value.trim();
  if (!texto) { alert('Escribí algo primero.'); return; }

  const efectos = {
    propositivo: [{ stat: 'reputacion', valor: 10 }, { stat: 'poder', valor: 3 }],
    critico:     [{ stat: 'reputacion', valor: 5 },  { stat: 'poder', valor: 8 }],
    populista:   [{ stat: 'reputacion', valor: -3 }, { stat: 'poder', valor: 12 }],
    tecnico:     [{ stat: 'reputacion', valor: 8 },  { stat: 'poder', valor: 2 }],
  }[estado.tonoPost] || [{ stat: 'reputacion', valor: 3 }];

  aplicarEfectos(efectos);
  registrarAccion(`Post en redes (${estado.tonoPost || 'neutral'})`, efectos);

  document.getElementById('modal-contenido').innerHTML = `
    <h3>✅ Post publicado</h3>
    <p style="color:#aaa; font-size:0.85rem; background:#0f1e35; padding:0.8rem; border-radius:8px; margin-bottom:1rem; font-style:italic">"${texto}"</p>
    ${efectos.map(e => `<p style="color:${e.valor >= 0 ? '#4caf50' : '#f44336'}">${e.stat}: ${e.valor > 0 ? '+' : ''}${e.valor}</p>`).join('')}
    <button class="btn-elegir" style="margin-top:1rem" onclick="cerrarModal()">Continuar</button>
  `;
}

// ===== EQUIPO =====
const equipo = [
  { avatar: '👩‍💼', nombre: 'Laura Vega', rol: 'Asesora de imagen',  estado: 'Disponible' },
  { avatar: '👨‍💻', nombre: 'Diego Paz',  rol: 'Community manager', estado: 'Disponible' },
];

const contactosOscuros = [
  { avatar: '🕶️',  nombre: '???',          rol: 'Intermediario',          oscuroReq: 15 },
  { avatar: '🤵',  nombre: 'El Ingeniero', rol: 'Operador de favores',    oscuroReq: 30 },
  { avatar: '🧔‍♂️', nombre: 'Don Héctor',  rol: 'Representante del clan', oscuroReq: 50 },
];

function renderEmpleados() {
  const desbloqueados = contactosOscuros.filter(c => estado.poderOscuro >= c.oscuroReq);
  const bloqueados    = contactosOscuros.filter(c => estado.poderOscuro < c.oscuroReq);

  return `
    <h3>👥 Tu equipo</h3>
    ${equipo.map(e => `
      <div class="empleado-item">
        <div class="empleado-avatar">${e.avatar}</div>
        <div class="empleado-info"><h4>${e.nombre}</h4><p>${e.rol}</p></div>
        <span class="empleado-estado">${e.estado}</span>
      </div>`).join('')}
    ${desbloqueados.length > 0 ? `
      <div style="border-top:1px solid #2a1a3a; margin-top:1rem; padding-top:0.8rem">
        <p style="font-size:0.75rem; color:#9c27b0; text-transform:uppercase; margin-bottom:0.5rem">En las sombras</p>
        ${desbloqueados.map(c => `
          <div class="empleado-item oscuro">
            <div class="empleado-avatar">${c.avatar}</div>
            <div class="empleado-info"><h4>${c.nombre}</h4><p>${c.rol}</p></div>
            <span class="empleado-estado oscuro">Activo</span>
          </div>`).join('')}
      </div>` : ''}
    ${bloqueados.length > 0 && estado.poderOscuro > 0
      ? `<p style="color:#555; font-size:0.75rem; margin-top:0.8rem">${bloqueados.length} contacto(s) más disponibles con más conexiones en las sombras.</p>`
      : ''}
  `;
}

// ===== CALLE =====
const accionesCallejeras = [
  {
    texto: '🚶 Recorrer el barrio puerta a puerta',
    efectos: [{ stat: 'reputacion', valor: 10 }, { stat: 'poder', valor: 5 }],
    resultado: 'Hablaste con decenas de vecinos. Te conocen un poco más.',
  },
  {
    texto: '📌 Pegar afiches en el barrio',
    efectos: [{ stat: 'reputacion', valor: 3 }, { stat: 'poder', valor: 8 }, { stat: 'dinero', valor: -5 }],
    resultado: 'Tu cara está en todos lados. Cuesta plata pero da presencia.',
  },
  {
    texto: '🤝 Juntarte con el referente del barrio (turbio pero conectado)',
    efectos: [{ stat: 'poder', valor: 12 }, { stat: 'reputacion', valor: -5 }, { stat: 'poderOscuro', valor: 5 }],
    resultado: 'El referente tiene poder pero su reputación es dudosa. Algo se pegó.',
  },
  {
    texto: '🏗️ Organizar una jornada de trabajo comunitario',
    efectos: [{ stat: 'reputacion', valor: 15 }, { stat: 'poder', valor: 4 }, { stat: 'dinero', valor: -8 }],
    resultado: 'Pintaron la escuela del barrio. Las fotos dieron vuelta en el vecindario.',
  },
  {
    texto: '🗣️ Charla abierta en la plaza sobre el estado del barrio',
    efectos: [{ stat: 'reputacion', valor: 8 }, { stat: 'poder', valor: 6 }],
    resultado: 'Vinieron cuarenta personas. Algunas con preguntas difíciles que te obligaron a pensar.',
  },
];

function renderPuerta() {
  return `
    <h3>🚪 Salir a la calle</h3>
    <p style="color:#aaa; font-size:0.82rem; margin-bottom:1rem">La política local se construye cara a cara.</p>
    ${accionesCallejeras.map((a, i) => `
      <div class="mision" style="margin-bottom:0.8rem">
        <button class="btn-opcion" onclick="accionCallejera(${i})">${a.texto}</button>
      </div>`).join('')}
  `;
}

function accionCallejera(indice) {
  const accion = accionesCallejeras[indice];
  aplicarEfectos(accion.efectos);
  registrarAccion(accion.texto.replace(/^[^\s]+\s/, ''), accion.efectos);

  document.getElementById('modal-contenido').innerHTML = `
    <h3>✅ Acción realizada</h3>
    <p style="color:#ccc; margin-bottom:1rem">${accion.resultado}</p>
    ${accion.efectos.map(e => `
      <p style="color:${e.valor >= 0 ? '#4caf50' : '#f44336'}">
        ${e.stat}: ${e.valor > 0 ? '+' : ''}${e.valor}
      </p>`).join('')}
    <button class="btn-elegir" style="margin-top:1rem" onclick="cerrarModal()">Continuar</button>
  `;
}
