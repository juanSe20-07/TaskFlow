import { initFormulario } from './formulario.js';

const tareas = [
  { id: 1, titulo: 'Diseñar mockups del panel', prioridad: 'alta', estado: 'hacer', etiqueta: 'dev' },
  { id: 2, titulo: 'Configurar repositorio Git', prioridad: 'media', estado: 'hacer', etiqueta: 'dev' },
  { id: 3, titulo: 'Escribir README del proyecto', prioridad: 'baja', estado: 'hacer', etiqueta: 'docs' },
  { id: 4, titulo: 'Crear estructura HTML', prioridad: 'alta', estado: 'progreso', etiqueta: 'dev' },
  { id: 5, titulo: 'Definir tokens de diseño', prioridad: 'media', estado: 'progreso', etiqueta: 'diseno' },
  { id: 6, titulo: 'Instalar extensiones VS Code', prioridad: 'baja', estado: 'hecho', etiqueta: 'dev' },
];

const columnasMap = {
  'hacer': 'col-hacer',
  'progreso': 'col-progreso',
  'hecho': 'col-hecho',
};

const listasMap = {
  'hacer': 'lista-hacer',
  'progreso': 'lista-progreso',
  'hecho': 'lista-hecho',
};

const contadoresMap = {
  'hacer': 'contador-hacer',
  'progreso': 'contador-progreso',
  'hecho': 'contador-hecho',
};

const estadoSiguiente = {
  'hacer': 'progreso',
  'progreso': 'hecho',
  'hecho': 'hacer',
};

let filtroActual = 'todas';
let ordenActual = 'prioridad';

function crearCardTarea(tarea) {
  const card = document.createElement('div');
  card.classList.add('tarea-card');
  card.dataset.id = String(tarea.id);

  const top = document.createElement('div');
  top.classList.add('tarea-top');

  const badge = document.createElement('span');
  badge.classList.add('badge-prioridad', 'prioridad-' + tarea.prioridad);
  badge.textContent = tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1);

  const titulo = document.createElement('h3');
  titulo.classList.add('tarea-titulo');
  titulo.textContent = tarea.titulo;

  top.appendChild(badge);
  top.appendChild(titulo);

  const meta = document.createElement('div');
  meta.classList.add('tarea-meta');

  const etiqueta = document.createElement('span');
  etiqueta.classList.add('tarea-etiqueta');
  etiqueta.textContent = tarea.etiqueta;

  const fecha = document.createElement('span');
  fecha.classList.add('tarea-fecha');
  fecha.textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  meta.appendChild(etiqueta);
  meta.appendChild(fecha);

  const acciones = document.createElement('div');
  acciones.classList.add('tarea-acciones');
  acciones.style.display = 'flex';
  acciones.style.gap = '8px';

  const btnMover = document.createElement('button');
  btnMover.classList.add('btn-mover');
  btnMover.textContent = 'Mover';
  btnMover.dataset.accion = 'mover';
  btnMover.dataset.id = String(tarea.id);

  const btnEliminar = document.createElement('button');
  btnEliminar.classList.add('btn-eliminar');
  btnEliminar.textContent = 'Borrar';
  btnEliminar.dataset.accion = 'borrar';
  btnEliminar.dataset.id = String(tarea.id);

  acciones.appendChild(btnMover);
  acciones.appendChild(btnEliminar);

  card.appendChild(top);
  card.appendChild(meta);
  card.appendChild(acciones);

  return card;
}

function getTareasFiltradas(tareas, filtroEstado, orden) {
  let lista = tareas.filter(t =>
    filtroEstado === 'todas' ? true : t.estado === filtroEstado
  );

  const prioridadOrden = { alta: 1, media: 2, baja: 3 };
  if (orden === 'prioridad') {
    lista = lista.sort((a, b) =>
      prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad]
    );
  } else {
    lista = lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }
  return lista;
}

function renderTareas(listaFiltrada = null) {
  const lista = listaFiltrada ?? getTareasFiltradas(tareas, filtroActual, ordenActual);

  document.getElementById('lista-hacer').innerHTML = '';
  document.getElementById('lista-progreso').innerHTML = '';
  document.getElementById('lista-hecho').innerHTML = '';

  const contadores = { hacer: 0, progreso: 0, hecho: 0 };

  lista.forEach(tarea => {
    const card = crearCardTarea(tarea);
    const listaId = listasMap[tarea.estado];
    document.getElementById(listaId).appendChild(card);
    contadores[tarea.estado]++;
  });

  Object.keys(contadores).forEach(estado => {
    document.getElementById(contadoresMap[estado]).textContent = contadores[estado];
  });
}

function handleNuevaTarea(nuevaTarea) {
  tareas.push(nuevaTarea);
  renderTareas();
}

document.addEventListener('DOMContentLoaded', () => {
  renderTareas();

  initFormulario(handleNuevaTarea);

  document.getElementById('filtro-estado').addEventListener('change', (e) => {
    filtroActual = e.target.value;
    renderTareas();
  });

  document.getElementById('orden-tareas').addEventListener('change', (e) => {
    ordenActual = e.target.value;
    renderTareas();
  });

  const contenedor = document.querySelector('.tareas-contenedor');
  contenedor.addEventListener('click', (e) => {
    const btnMover = e.target.closest('[data-accion="mover"]');
    const btnBorrar = e.target.closest('[data-accion="borrar"]');

    if (btnMover) {
      const id = Number(btnMover.dataset.id);
      const tarea = tareas.find(t => t.id === id);
      if (tarea) {
        tarea.estado = estadoSiguiente[tarea.estado] || 'hacer';
      }
      renderTareas();
    }

    if (btnBorrar) {
      const id = Number(btnBorrar.dataset.id);
      const idx = tareas.findIndex(t => t.id === id);
      if (idx !== -1) tareas.splice(idx, 1);
      renderTareas();
    }
  });
});