
import {
  obtenerSolicitudes,
  crearSolicitud,
  actualizarSolicitud,
} from '../utils/solicitudesCitas';

export function listarSolicitudes() {
  return obtenerSolicitudes();
}

export function registrarSolicitud(datos) {
  return crearSolicitud(datos);
}

export function actualizarEstadoSolicitud(id, cambios) {
  return actualizarSolicitud(id, cambios);
}
