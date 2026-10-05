const CLAVE = 'taskflow-tareas';

export function guardarTareas(tareas) {
  localStorage.setItem(CLAVE, JSON.stringify(tareas));
}

export function cargarTareas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
  } catch {
    return [];
  }
}