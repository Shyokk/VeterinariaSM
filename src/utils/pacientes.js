
export function limpiarPaciente(paciente) {
  return {
    nombre: String(paciente.nombre ?? '').trim(),
    especie: String(paciente.especie ?? '').trim(),
    raza: String(paciente.raza ?? '').trim(),
    edad: Number(paciente.edad),
    propietario: String(paciente.propietario ?? '').trim(),
    telefono: String(paciente.telefono ?? '').trim(),
  };
}

export function validarPaciente(paciente) {
  const datos = limpiarPaciente(paciente);

  if (
    !datos.nombre ||
    !datos.especie ||
    !datos.raza ||
    !datos.propietario ||
    !datos.telefono ||
    paciente.edad === ''
  ) {
    return 'Debes completar todos los campos.';
  }

  if (
    !Number.isInteger(datos.edad) ||
    datos.edad < 0 ||
    datos.edad > 50
  ) {
    return 'La edad debe ser un número entero entre 0 y 50.';
  }

  if (!/^[0-9+\s()-]{8,20}$/.test(datos.telefono)) {
    return 'Ingresa un teléfono válido.';
  }

  return '';
}

export function buscarPacientes(pacientes, busqueda) {
  const texto = String(busqueda ?? '').trim().toLowerCase();

  if (!texto) {
    return pacientes;
  }

  return pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(texto) ||
    paciente.propietario.toLowerCase().includes(texto) ||
    paciente.especie.toLowerCase().includes(texto)
  );
}

export function agregarPaciente(pacientes, paciente) {
  return [...pacientes, paciente];
}

export function actualizarPaciente(pacientes, pacienteActualizado) {
  return pacientes.map((paciente) =>
    paciente.id === pacienteActualizado.id
      ? pacienteActualizado
      : paciente
  );
}

export function eliminarPaciente(pacientes, id) {
  return pacientes.filter((paciente) => paciente.id !== id);
}
