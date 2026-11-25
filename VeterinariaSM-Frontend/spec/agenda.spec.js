import { accionesDisponibles } from '../src/utils/agenda.js';
import { ROLES } from '../src/utils/roles.js';

describe('Acciones permitidas sobre una cita', () => {
  const ahora = new Date('2026-12-01T10:00:00');
  const futura = { fecha: '2026-12-05', hora: '10:00', estado: 'PENDIENTE' };
  const pasada = { fecha: '2026-11-20', hora: '10:00', estado: 'CONFIRMADA' };

  it('recepción confirma o propone horario en una cita pendiente', () => {
    expect(accionesDisponibles(futura, ROLES.RECEPCION, ahora)).toEqual(['confirmar', 'proponer', 'cancelar']);
  });

  it('el dueño solo puede cancelar su cita pendiente', () => {
    expect(accionesDisponibles(futura, ROLES.DUENO, ahora)).toEqual(['cancelar']);
  });

  it('el dueño puede aceptar un horario propuesto', () => {
    const propuesta = { ...futura, estado: 'HORARIO_PROPUESTO' };
    expect(accionesDisponibles(propuesta, ROLES.DUENO, ahora)).toEqual(['aceptar', 'cancelar']);
  });

  it('"no asistió" solo aparece cuando la hora de la cita ya pasó', () => {
    expect(accionesDisponibles(pasada, ROLES.RECEPCION, ahora)).toContain('noAsistio');
    const futuraConfirmada = { ...futura, estado: 'CONFIRMADA' };
    expect(accionesDisponibles(futuraConfirmada, ROLES.RECEPCION, ahora)).not.toContain('noAsistio');
  });

  it('el dueño no puede cancelar una cita que ya pasó', () => {
    expect(accionesDisponibles(pasada, ROLES.DUENO, ahora)).toEqual([]);
  });

  it('el veterinario solo puede marcar como atendida una cita confirmada', () => {
    expect(accionesDisponibles({ ...futura, estado: 'CONFIRMADA' }, ROLES.VETERINARIO, ahora)).toEqual(['atender']);
    expect(accionesDisponibles(futura, ROLES.VETERINARIO, ahora)).toEqual([]);
  });

  it('las citas terminadas no tienen acciones', () => {
    ['CANCELADA', 'ATENDIDA', 'NO_ASISTIO'].forEach((estado) => {
      expect(accionesDisponibles({ ...futura, estado }, ROLES.ADMIN, ahora)).toEqual([]);
    });
  });
});
