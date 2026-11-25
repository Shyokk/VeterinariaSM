// Persistencia de la sesión en localStorage (sobrevive a recargas de página).
// Se guarda: accessToken, refreshToken y los datos públicos del usuario. NUNCA la contraseña.
const CLAVE = 'vet_sesion';

export function leerSesion() {
  try {
    const bruto = localStorage.getItem(CLAVE);
    if (!bruto) return null;
    const sesion = JSON.parse(bruto);
    return sesion?.accessToken && sesion?.refreshToken && sesion?.usuario ? sesion : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion));
  } catch {
    /* almacenamiento no disponible (modo privado, etc.): la sesión dura solo en memoria */
  }
}

export function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    /* nada que hacer */
  }
}

export const CLAVE_SESION = CLAVE;
