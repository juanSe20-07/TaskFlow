export function initFormulario(onNuevaTarea) {
  const form = document.querySelector('#form-nueva-tarea');
  const inputT = document.querySelector('#input-titulo');
  const selectP = document.querySelector('#select-prioridad');
  const selectE = document.querySelector('#select-etiqueta');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!inputT.value.trim()) return;

    const nueva = {
      id: Date.now(),
      titulo: inputT.value.trim(),
      prioridad: selectP.value,
      estado: 'hacer',
      etiqueta: selectE.value,
    };
    onNuevaTarea(nueva);
    form.reset();
  });
}