
import { beforeEach, describe, expect, it } from 'vitest';

import {
  listarSolicitudes,
  registrarSolicitud,
  actualizarEstadoSolicitud,
} from '../../services/citasService';

const datosPrueba = {
  nombreDueno: 'Camila Pérez',
  correo: 'camila@example.com',
  nombreMascota: 'Thor',
  especie: 'Perro',
  fecha: '2026-11-20',
  motivo: 'Control veterinario general',
};

describe('Servicio de solicitudes de citas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve una lista vacía cuando no hay solicitudes', () => {
    expect(listarSolicitudes()).toEqual([]);
  });

  it('registra una solicitud con ID y estado inicial', () => {
    const solicitud = registrarSolicitud(datosPrueba);

    expect(solicitud.id).toMatch(/^CITA-/);
    expect(solicitud.estado).toBe('Pendiente');
    expect(solicitud.nombreMascota).toBe('Thor');
    expect(solicitud.fechaCreacion).toBeTruthy();
  });

  it('conserva la solicitud cuando se consulta la lista', () => {
    registrarSolicitud(datosPrueba);

    const solicitudes = listarSolicitudes();

    expect(solicitudes).toHaveLength(1);
    expect(solicitudes[0].correo).toBe('camila@example.com');
  });

  it('actualiza el estado sin eliminar otros datos de la solicitud', () => {
    const solicitud = registrarSolicitud(datosPrueba);

    const actualizada = actualizarEstadoSolicitud(solicitud.id, {
      estado: 'Confirmada',
      fechaConfirmada: '2026-11-20',
    });

    expect(actualizada.estado).toBe('Confirmada');
    expect(actualizada.nombreMascota).toBe('Thor');
    expect(actualizada.fechaConfirmada).toBe('2026-11-20');
    expect(listarSolicitudes()).toHaveLength(1);
  });

  it('devuelve null cuando intenta actualizar un ID inexistente', () => {
    const resultado = actualizarEstadoSolicitud('CITA-INEXISTENTE', {
      estado: 'Cancelada',
    });

    expect(resultado).toBeNull();
    expect(listarSolicitudes()).toEqual([]);
  });

  it('permite registrar más de una solicitud', () => {
    registrarSolicitud(datosPrueba);

    registrarSolicitud({
      ...datosPrueba,
      correo: 'otra@example.com',
      nombreMascota: 'Luna',
    });

    expect(listarSolicitudes()).toHaveLength(2);
  });
});
