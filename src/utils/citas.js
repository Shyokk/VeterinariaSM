
export function limpiarTexto(texto) {
  return String(texto ?? '').trim();
}

export function camposCompletos(formulario) {
  return Boolean(
    limpiarTexto(formulario.propietario) &&
    limpiarTexto(formulario.mascota) &&
    formulario.fecha &&
    formulario.hora &&
    limpiarTexto(formulario.motivo)
  );
}

export function fechaHoraValida(fecha, hora) {
  const fechaHora = new Date(`${fecha}T${hora}`);

  return !Number.isNaN(fechaHora.getTime());
}

export function fechaHoraFutura(fecha, hora, ahora = new Date()) {
  if (!fechaHoraValida(fecha, hora)) {
    return false;
  }

  return new Date(`${fecha}T${hora}`) > ahora;
}

export function horarioDisponible(citas, fecha, hora) {
  return !citas.some(
    (cita) => cita.fecha === fecha && cita.hora === hora
  );
}

export function validarCita(formulario, citas, ahora = new Date()) {
  if (!camposCompletos(formulario)) {
    return 'Debes completar todos los campos.';
  }

  if (!fechaHoraFutura(formulario.fecha, formulario.hora, ahora)) {
    return 'La cita debe tener una fecha y hora futuras.';
  }

  if (!horarioDisponible(citas, formulario.fecha, formulario.hora)) {
    return 'Ya existe una cita registrada en ese horario.';
  }

  return '';
}

export function crearCita(formulario, id) {
  return {
    id,
    propietario: limpiarTexto(formulario.propietario),
    mascota: limpiarTexto(formulario.mascota),
    fecha: formulario.fecha,
    hora: formulario.hora,
    motivo: limpiarTexto(formulario.motivo),
  };
}

export function agregarCita(citas, nuevaCita) {
  return [...citas, nuevaCita];
}

export function eliminarCitaPorId(citas, id) {
  return citas.filter((cita) => cita.id !== id);
}
