
import {
  limpiarTexto,
  camposCompletos,
  fechaHoraValida,
  fechaHoraFutura,
  horarioDisponible,
  validarCita,
  crearCita,
  agregarCita,
  eliminarCitaPorId,
} from '../src/utils/citas.js';

describe('Pruebas del módulo Agendar citas', () => {
  const ahora = new Date('2026-10-15T10:00:00');

  const formularioValido = {
    propietario: 'Ana Pérez',
    mascota: 'Thor',
    fecha: '2026-10-20',
    hora: '15:00',
    motivo: 'Control veterinario',
  };

  it('1. Elimina espacios sobrantes de un texto', () => {
    expect(limpiarTexto('  Thor  ')).toBe('Thor');
  });

  it('2. Acepta un formulario con todos los campos', () => {
    expect(camposCompletos(formularioValido)).toBeTrue();
  });

  it('3. Rechaza un formulario con propietario vacío', () => {
    const formulario = {
      ...formularioValido,
      propietario: '  ',
    };

    expect(camposCompletos(formulario)).toBeFalse();
  });

  it('4. Detecta una fecha y hora inválidas', () => {
    expect(
      fechaHoraValida('fecha-invalida', '15:00')
    ).toBeFalse();
  });

  it('5. Acepta una fecha y hora futuras', () => {
    expect(
      fechaHoraFutura('2026-10-20', '15:00', ahora)
    ).toBeTrue();
  });

  it('6. Rechaza una fecha y hora pasadas', () => {
    expect(
      fechaHoraFutura('2026-10-10', '15:00', ahora)
    ).toBeFalse();
  });

  it('7. Detecta un horario ocupado', () => {
    const citas = [
      {
        id: '1',
        fecha: '2026-10-20',
        hora: '15:00',
      },
    ];

    expect(
      horarioDisponible(citas, '2026-10-20', '15:00')
    ).toBeFalse();
  });

  it('8. Valida correctamente una cita nueva', () => {
    expect(
      validarCita(formularioValido, [], ahora)
    ).toBe('');
  });

  it('9. Crea y agrega una cita a la lista', () => {
    const nuevaCita = crearCita(formularioValido, 'cita-1');
    const citas = agregarCita([], nuevaCita);

    expect(citas.length).toBe(1);
    expect(citas[0].id).toBe('cita-1');
    expect(citas[0].mascota).toBe('Thor');
  });

  it('10. Elimina solamente la cita seleccionada', () => {
    const citas = [
      { id: '1', mascota: 'Thor' },
      { id: '2', mascota: 'Luna' },
    ];

    const resultado = eliminarCitaPorId(citas, '1');

    expect(resultado.length).toBe(1);
    expect(resultado[0].mascota).toBe('Luna');
  });
});
