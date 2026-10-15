
const CLAVE_SOLICITUDES = 'veterinariaSM_solicitudesCitas';

export function obtenerSolicitudes() {
  try {
    const datosGuardados = localStorage.getItem(CLAVE_SOLICITUDES);

    if (!datosGuardados) {
      return [];
    }

    const solicitudes = JSON.parse(datosGuardados);

    return Array.isArray(solicitudes) ? solicitudes : [];
  } catch (error) {
    console.error('No se pudieron leer las solicitudes:', error);
    return [];
  }
}

export function guardarSolicitudes(solicitudes) {
  localStorage.setItem(
    CLAVE_SOLICITUDES,
    JSON.stringify(solicitudes)
  );

  return solicitudes;
}

export function crearSolicitud(datos) {
  const solicitudesActuales = obtenerSolicitudes();

  const nuevaSolicitud = {
    ...datos,
    id: `CITA-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`,
    estado: 'Pendiente',
    fechaPropuesta: '',
    fechaCreacion: new Date().toISOString(),
  };

  guardarSolicitudes([
    nuevaSolicitud,
    ...solicitudesActuales,
  ]);

  return nuevaSolicitud;
}

export function actualizarSolicitud(id, cambios) {
  const solicitudesActuales = obtenerSolicitudes();
  let solicitudActualizada = null;

  const solicitudesActualizadas = solicitudesActuales.map(
    (solicitud) => {
      if (solicitud.id !== id) {
        return solicitud;
      }

      solicitudActualizada = {
        ...solicitud,
        ...cambios,
      };

      return solicitudActualizada;
    }
  );

  if (solicitudActualizada) {
    guardarSolicitudes(solicitudesActualizadas);
  }

  return solicitudActualizada;
}
