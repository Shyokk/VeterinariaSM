import { ROLES } from './roles.js';

export const ETIQUETA_ESTADO = {
  PENDIENTE: 'Pendiente de confirmación',
  CONFIRMADA: 'Confirmada',
  HORARIO_PROPUESTO: 'Nuevo horario propuesto',
  CANCELADA: 'Cancelada',
  ATENDIDA: 'Atendida',
  NO_ASISTIO: 'No asistió',
};

export const CLASE_ESTADO = {
  PENDIENTE: 'bg-warning text-dark',
  CONFIRMADA: 'bg-success',
  HORARIO_PROPUESTO: 'bg-info text-dark',
  CANCELADA: 'bg-secondary',
  ATENDIDA: 'bg-primary',
  NO_ASISTIO: 'bg-danger',
};

/**
 * Acciones que el usuario puede ejecutar sobre una cita, según su rol y el estado.
 * Refleja las reglas del backend (ms-citas); allá se vuelven a validar.
 */
export function accionesDisponibles(cita, rol, ahora = new Date()) {
  const gestor = rol === ROLES.ADMIN || rol === ROLES.RECEPCION;
  const dueno = rol === ROLES.DUENO;
  const futura = new Date(`${cita.fecha}T${cita.hora}`) > ahora;
  const acciones = [];

  switch (cita.estado) {
    case 'PENDIENTE':
      if (gestor) acciones.push('confirmar', 'proponer');
      if (gestor || (dueno && futura)) acciones.push('cancelar');
      break;
    case 'CONFIRMADA':
      if (gestor) acciones.push('proponer');
      if (gestor || rol === ROLES.VETERINARIO) acciones.push('atender');
      if (gestor && !futura) acciones.push('noAsistio');
      if (gestor || (dueno && futura)) acciones.push('cancelar');
      break;
    case 'HORARIO_PROPUESTO':
      if (gestor || dueno) acciones.push('aceptar');
      if (gestor || (dueno && futura)) acciones.push('cancelar');
      break;
    default:
      break;
  }
  return acciones;
}
