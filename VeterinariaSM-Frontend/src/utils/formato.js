// Helpers de presentación (fechas sin problemas de zona horaria, edad, etiquetas).

const HOY = () => new Date();

/** Fecha local de hoy en formato YYYY-MM-DD (para min/max de <input type="date">). */
export function fechaISOHoy(ahora = HOY()) {
  const y = ahora.getFullYear();
  const m = String(ahora.getMonth() + 1).padStart(2, '0');
  const d = String(ahora.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "2026-11-23" -> "23-11-2026" (sin convertir por zona horaria). */
export function formatearFecha(iso) {
  if (!iso) return '—';
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return `${d}-${m}-${y}`;
}

/** Edad legible a partir de la fecha de nacimiento. */
export function calcularEdad(fechaNacimiento, ahora = HOY()) {
  if (!fechaNacimiento) return '—';
  const [y, m, d] = fechaNacimiento.split('-').map(Number);
  let meses = (ahora.getFullYear() - y) * 12 + (ahora.getMonth() + 1 - m);
  if (ahora.getDate() < d) meses -= 1;
  if (meses < 0) return '—';
  if (meses < 12) return meses === 1 ? '1 mes' : `${meses} meses`;
  const anios = Math.floor(meses / 12);
  return anios === 1 ? '1 año' : `${anios} años`;
}

export const ESPECIES = [
  { valor: 'PERRO', etiqueta: 'Perro' },
  { valor: 'GATO', etiqueta: 'Gato' },
  { valor: 'CONEJO', etiqueta: 'Conejo' },
  { valor: 'AVE', etiqueta: 'Ave' },
  { valor: 'OTRO', etiqueta: 'Otro' },
];

export const SEXOS = [
  { valor: 'MACHO', etiqueta: 'Macho' },
  { valor: 'HEMBRA', etiqueta: 'Hembra' },
];

export function etiquetaEspecie(valor) {
  return ESPECIES.find((e) => e.valor === valor)?.etiqueta ?? valor ?? '—';
}

export function etiquetaSexo(valor) {
  return SEXOS.find((s) => s.valor === valor)?.etiqueta ?? valor ?? '—';
}

export function nombreCompleto(usuario) {
  if (!usuario) return '';
  return `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim();
}

/**
 * Estado de vencimiento de una vacuna según su próxima dosis:
 * 'vencida' (ya pasó), 'proxima' (dentro de `dias` días) o 'vigente'. null si no tiene próxima dosis.
 */
export function estadoVencimiento(fechaProxima, ahora = HOY(), dias = 30) {
  if (!fechaProxima) return null;
  const hoy = fechaISOHoy(ahora);
  if (fechaProxima < hoy) return 'vencida';
  const limite = new Date(ahora);
  limite.setDate(limite.getDate() + dias);
  return fechaProxima <= fechaISOHoy(limite) ? 'proxima' : 'vigente';
}
