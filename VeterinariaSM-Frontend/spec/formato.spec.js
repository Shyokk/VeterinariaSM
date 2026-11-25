import {
  calcularEdad,
  estadoVencimiento,
  fechaISOHoy,
  formatearFecha,
  nombreCompleto,
} from '../src/utils/formato.js';

describe('Utilidades de formato', () => {
  const ahora = new Date('2026-11-24T12:00:00');

  it('da formato a las fechas sin cambiar el día por zona horaria', () => {
    expect(formatearFecha('2026-11-23')).toBe('23-11-2026');
    expect(formatearFecha(null)).toBe('—');
    expect(fechaISOHoy(ahora)).toBe('2026-11-24');
  });

  it('calcula la edad en meses y años', () => {
    expect(calcularEdad('2026-10-01', ahora)).toBe('1 mes');
    expect(calcularEdad('2026-06-10', ahora)).toBe('5 meses');
    expect(calcularEdad('2022-03-15', ahora)).toBe('4 años');
    expect(calcularEdad(null, ahora)).toBe('—');
  });

  it('clasifica el vencimiento de una vacuna', () => {
    expect(estadoVencimiento('2026-11-01', ahora)).toBe('vencida');
    expect(estadoVencimiento('2026-12-10', ahora)).toBe('proxima');
    expect(estadoVencimiento('2027-03-01', ahora)).toBe('vigente');
    expect(estadoVencimiento(null, ahora)).toBeNull();
  });

  it('arma el nombre completo', () => {
    expect(nombreCompleto({ nombre: 'Carla', apellido: 'Pérez' })).toBe('Carla Pérez');
    expect(nombreCompleto(null)).toBe('');
  });
});
