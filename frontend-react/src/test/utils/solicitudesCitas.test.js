
import { beforeEach, describe, expect, it } from 'vitest';

import {
  obtenerSolicitudes,
  crearSolicitud,
  actualizarSolicitud,
} from '../../utils/solicitudesCitas';

const datosPrueba = {
  nombreDueno: 'Camila Pérez',
  correo: 'camila@example.com',
  nombreMascota: 'Thor',
  especie: 'Perro',
  fecha: '2026-11-20',
  motivo: 'Control veterinario general',
};

describe('Utilidad de solicitudes de citas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve una lista vacía si no existen solicitudes', () => {
    expect(obtenerSolicitudes()).toEqual([]);
  });

  it('crea una solicitud con identificador y estado inicial', () => {
    const solicitud = crearSolicitud(datosPrueba);

    expect(solicitud.id).toMatch(/^CITA-/);
    expect(solicitud.estado).toBe('Pendiente');
    expect(solicitud.nombreMascota).toBe('Thor');
    expect(solicitud.fechaCreacion).toBeTruthy();
  });

  it('guarda la solicitud para consultarla posteriormente', () => {
    crearSolicitud(datosPrueba);

    const solicitudes = obtenerSolicitudes();

    expect(solicitudes).toHaveLength(1);
    expect(solicitudes[0].correo).toBe('camila@example.com');
  });

  it('actualiza una solicitud sin perder sus datos originales', () => {
    const solicitud = crearSolicitud(datosPrueba);

    const actualizada = actualizarSolicitud(solicitud.id, {
      estado: 'Confirmada',
      fechaConfirmada: '2026-11-20',
    });

    expect(actualizada.estado).toBe('Confirmada');
    expect(actualizada.nombreMascota).toBe('Thor');
    expect(actualizada.fechaConfirmada).toBe('2026-11-20');
    expect(obtenerSolicitudes()).toHaveLength(1);
  });

  it('devuelve null al intentar actualizar una solicitud inexistente', () => {
    const resultado = actualizarSolicitud('CITA-INEXISTENTE', {
      estado: 'Cancelada',
    });

    expect(resultado).toBeNull();
    expect(obtenerSolicitudes()).toEqual([]);
  });

  it('permite guardar varias solicitudes', () => {
    crearSolicitud(datosPrueba);

    crearSolicitud({
      ...datosPrueba,
      correo: 'otra@example.com',
      nombreMascota: 'Luna',
    });

    expect(obtenerSolicitudes()).toHaveLength(2);
  });
});
