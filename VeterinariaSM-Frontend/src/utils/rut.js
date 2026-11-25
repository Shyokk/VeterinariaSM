// Validación de RUT chileno (misma regla de módulo 11 que usa el backend).

/** "12.345.678-5" o "123456785" -> "12345678-5" */
export function normalizarRut(rut) {
  const r = String(rut ?? '').replace(/[.\s-]/g, '').toUpperCase();
  if (r.length < 2) return r;
  return `${r.slice(0, -1)}-${r.slice(-1)}`;
}

export function rutValido(rut) {
  const normalizado = normalizarRut(rut);
  if (!/^\d{7,8}-[0-9K]$/.test(normalizado)) return false;

  const [cuerpo, dv] = normalizado.split('-');
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === esperado;
}

/** "12345678-5" -> "12.345.678-5" (para mostrar en pantalla) */
export function formatearRut(rut) {
  const normalizado = normalizarRut(rut);
  if (!normalizado.includes('-')) return normalizado;
  const [cuerpo, dv] = normalizado.split('-');
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}
