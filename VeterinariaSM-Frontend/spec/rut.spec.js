import { formatearRut, normalizarRut, rutValido } from '../src/utils/rut.js';

describe('Utilidades de RUT', () => {
  it('normaliza puntos, espacios y guion', () => {
    expect(normalizarRut('12.345.678-5')).toBe('12345678-5');
    expect(normalizarRut('123456785')).toBe('12345678-5');
    expect(normalizarRut(' 7.654.321-6 ')).toBe('7654321-6');
  });

  it('valida el dígito verificador', () => {
    expect(rutValido('12.345.678-5')).toBeTrue();
    expect(rutValido('11111111-1')).toBeTrue();
    expect(rutValido('7654321-6')).toBeTrue();
    expect(rutValido('12345678-9')).toBeFalse();
  });

  it('rechaza formatos inválidos', () => {
    expect(rutValido('')).toBeFalse();
    expect(rutValido('abc')).toBeFalse();
    expect(rutValido('1-9')).toBeFalse();
    expect(rutValido(null)).toBeFalse();
  });

  it('formatea para mostrar en pantalla', () => {
    expect(formatearRut('123456785')).toBe('12.345.678-5');
    expect(formatearRut('7654321-6')).toBe('7.654.321-6');
  });
});
