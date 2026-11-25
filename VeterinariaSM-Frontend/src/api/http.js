import { API } from '../config.js';
import { leerSesion, guardarSesion } from '../utils/almacenSesion.js';

/** Error de la API con el código HTTP y el mensaje que envía el backend (JSON). */
export class ApiError extends Error {
  constructor(status, mensaje, detalles = []) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.detalles = detalles;
  }
}

let alExpirar = null;
/** AuthContext registra aquí qué hacer cuando la sesión ya no se puede renovar. */
export function alExpirarSesion(callback) {
  alExpirar = callback;
}

let renovacionEnCurso = null;

/**
 * Renueva los tokens con el refresh token. Si varias peticiones fallan por 401 a la vez,
 * comparten una sola renovación (evita llamar varias veces a /refresh).
 */
function renovarSesion() {
  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      const sesion = leerSesion();
      if (!sesion) throw new ApiError(401, 'Sesión expirada');
      const resp = await fetch(`${API.usuarios}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: sesion.refreshToken }),
      });
      if (!resp.ok) throw new ApiError(401, 'Sesión expirada');
      const datos = await resp.json();
      guardarSesion({
        accessToken: datos.accessToken,
        refreshToken: datos.refreshToken,
        usuario: datos.usuario,
      });
    })().finally(() => {
      renovacionEnCurso = null;
    });
  }
  return renovacionEnCurso;
}

function construirUrl(base, ruta, params) {
  const url = new URL(base + ruta);
  Object.entries(params ?? {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, valor);
    }
  });
  return url.toString();
}

async function leerCuerpo(resp) {
  const texto = await resp.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

/**
 * Petición genérica a un microservicio.
 * - Agrega el JWT (Authorization: Bearer ...) salvo auth:false.
 * - Si el servidor responde 401, intenta renovar el token UNA vez y repite la petición.
 * - Convierte los errores JSON del backend en ApiError con un mensaje legible.
 */
export async function peticion(base, ruta, { metodo = 'GET', cuerpo, params, auth = true } = {}) {
  const url = construirUrl(base, ruta, params);

  const ejecutar = () => {
    const headers = {};
    if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
      const sesion = leerSesion();
      if (sesion) headers.Authorization = `Bearer ${sesion.accessToken}`;
    }
    return fetch(url, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  };

  let resp;
  try {
    resp = await ejecutar();
  } catch {
    throw new ApiError(
      0,
      'No se pudo conectar con el servidor. Verifica que los servicios del backend estén encendidos.'
    );
  }

  if (resp.status === 401 && auth) {
    try {
      await renovarSesion();
      resp = await ejecutar();
    } catch {
      alExpirar?.();
      throw new ApiError(401, 'Tu sesión expiró. Inicia sesión nuevamente.');
    }
  }

  const datos = await leerCuerpo(resp);
  if (!resp.ok) {
    throw new ApiError(
      resp.status,
      datos?.mensaje ?? `Error ${resp.status} en la petición`,
      datos?.detalles ?? []
    );
  }
  return datos;
}

/** Mensaje completo para mostrar al usuario (incluye el detalle de validaciones del backend). */
export function mensajeDeError(error) {
  if (!(error instanceof ApiError)) return 'Ocurrió un error inesperado.';
  if (error.detalles?.length) return `${error.message}: ${error.detalles.join(' · ')}`;
  return error.message;
}
