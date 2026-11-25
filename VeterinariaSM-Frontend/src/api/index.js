import { API } from '../config.js';
import { peticion } from './http.js';

const usuarios = (ruta, op) => peticion(API.usuarios, ruta, op);
const pacientes = (ruta, op) => peticion(API.pacientes, ruta, op);
const citas = (ruta, op) => peticion(API.citas, ruta, op);

// ----------------------------------------------------------- ms-usuarios (8081)
export const authApi = {
  login: (email, password) =>
    usuarios('/api/auth/login', { metodo: 'POST', cuerpo: { email, password }, auth: false }),
  registro: (datos) =>
    usuarios('/api/auth/registro', { metodo: 'POST', cuerpo: datos, auth: false }),
  me: () => usuarios('/api/auth/me'),
};

export const usuariosApi = {
  listar: () => usuarios('/api/usuarios'),
  crear: (datos) => usuarios('/api/usuarios', { metodo: 'POST', cuerpo: datos }),
  editar: (id, datos) => usuarios(`/api/usuarios/${id}`, { metodo: 'PUT', cuerpo: datos }),
  desactivar: (id) => usuarios(`/api/usuarios/${id}`, { metodo: 'DELETE' }),
  activar: (id) => usuarios(`/api/usuarios/${id}/activar`, { metodo: 'PATCH' }),
  /** Dueños activos (Administrador, Recepcionista y Veterinario). */
  duenos: (q) => usuarios('/api/usuarios/duenos', { params: { q } }),
};

// ----------------------------------------------------------- ms-pacientes (8082)
export const mascotasApi = {
  listar: (params) => pacientes('/api/mascotas', { params }),
  obtener: (id) => pacientes(`/api/mascotas/${id}`),
  crear: (datos) => pacientes('/api/mascotas', { metodo: 'POST', cuerpo: datos }),
  actualizar: (id, datos) => pacientes(`/api/mascotas/${id}`, { metodo: 'PUT', cuerpo: datos }),
  desactivar: (id) => pacientes(`/api/mascotas/${id}`, { metodo: 'DELETE' }),
};

/** Ficha clínica: cada "tipo" corresponde a un recurso del backend. */
const RECURSOS_CLINICOS = {
  consultas: { lista: 'consultas', item: 'consultas' },
  vacunas: { lista: 'vacunas', item: 'vacunas' },
  recetas: { lista: 'recetas', item: 'recetas' },
  examenes: { lista: 'examenes', item: 'examenes' },
};

export const clinicaApi = {
  listar: (tipo, mascotaId) =>
    pacientes(`/api/mascotas/${mascotaId}/${RECURSOS_CLINICOS[tipo].lista}`),
  crear: (tipo, mascotaId, datos) =>
    pacientes(`/api/mascotas/${mascotaId}/${RECURSOS_CLINICOS[tipo].lista}`, {
      metodo: 'POST',
      cuerpo: datos,
    }),
  eliminar: (tipo, id) =>
    pacientes(`/api/${RECURSOS_CLINICOS[tipo].item}/${id}`, { metodo: 'DELETE' }),
  vacunasPorVencer: (dias = 30) => pacientes('/api/vacunas/por-vencer', { params: { dias } }),
};

export const reportesApi = {
  resumen: (params) => pacientes('/api/reportes/resumen', { params }),
};

// ----------------------------------------------------------- ms-citas (8083)
export const citasApi = {
  listar: (params) => citas('/api/citas', { params }),
  solicitar: (datos) => citas('/api/citas', { metodo: 'POST', cuerpo: datos }),
  disponibilidad: (fecha) => citas('/api/citas/disponibilidad', { params: { fecha } }),
  reporte: (params) => citas('/api/citas/reporte', { params }),
  confirmar: (id) => citas(`/api/citas/${id}/confirmar`, { metodo: 'PATCH' }),
  proponerHorario: (id, datos) =>
    citas(`/api/citas/${id}/proponer-horario`, { metodo: 'PATCH', cuerpo: datos }),
  aceptarHorario: (id) => citas(`/api/citas/${id}/aceptar-horario`, { metodo: 'PATCH' }),
  cancelar: (id, motivo) =>
    citas(`/api/citas/${id}/cancelar`, { metodo: 'PATCH', cuerpo: motivo ? { motivo } : {} }),
  atender: (id) => citas(`/api/citas/${id}/atender`, { metodo: 'PATCH' }),
  noAsistio: (id) => citas(`/api/citas/${id}/no-asistio`, { metodo: 'PATCH' }),
};
