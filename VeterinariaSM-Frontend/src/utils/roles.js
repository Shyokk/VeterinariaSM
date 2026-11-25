// Roles del sistema (coinciden con el enum Rol del backend ms-usuarios)
export const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  RECEPCION: 'RECEPCIONISTA',
  VETERINARIO: 'VETERINARIO',
  DUENO: 'DUENO',
};

export const ETIQUETA_ROL = {
  ADMINISTRADOR: 'Administrador',
  RECEPCIONISTA: 'Recepcionista',
  VETERINARIO: 'Veterinario/a',
  DUENO: 'Dueño de mascota',
};

const TODOS = [ROLES.ADMIN, ROLES.RECEPCION, ROLES.VETERINARIO, ROLES.DUENO];
export const PERSONAL = [ROLES.ADMIN, ROLES.RECEPCION, ROLES.VETERINARIO];
export const CLINICO = [ROLES.ADMIN, ROLES.VETERINARIO];

/**
 * Tabla única de permisos de pantalla: qué roles pueden entrar a cada ruta.
 * La usan tanto <RutaProtegida> (para bloquear) como el menú (para ocultar),
 * así nunca se desincronizan. El backend vuelve a validar cada petición.
 */
export const ACCESO = {
  '/perfil': TODOS,
  '/agendar': TODOS,
  '/mis-mascotas': [ROLES.DUENO],
  '/pacientes': PERSONAL,
  '/crear-ficha': PERSONAL,
  '/historial': PERSONAL,
  '/nueva-vacuna': CLINICO,
  '/nueva-receta': CLINICO,
  '/nuevo-diagnostico': CLINICO,
  '/nuevo-examen': CLINICO,
  '/gestion': [ROLES.ADMIN],
  '/reportes': [ROLES.ADMIN, ROLES.RECEPCION],
  '/usuarios': [ROLES.ADMIN],
};

export function puedeAcceder(ruta, rol) {
  const permitidos = ACCESO[ruta];
  if (!permitidos) return true; // ruta pública
  return Boolean(rol) && permitidos.includes(rol);
}

export function esPersonal(rol) {
  return PERSONAL.includes(rol);
}

export function esClinico(rol) {
  return CLINICO.includes(rol);
}
