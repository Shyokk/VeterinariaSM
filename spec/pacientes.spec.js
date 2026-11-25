
import {
  limpiarPaciente,
  validarPaciente,
  buscarPacientes,
  agregarPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from '../src/utils/pacientes.js';

describe('Gestión de pacientes', () => {
  const pacienteValido = {
    id: 'paciente-1',
    nombre: 'Thor',
    especie: 'Perro',
    raza: 'Labrador',
    edad: 4,
    propietario: 'Ana Pérez',
    telefono: '+56912345678',
  };

  const segundoPaciente = {
    id: 'paciente-2',
    nombre: 'Luna',
    especie: 'Gato',
    raza: 'Mestizo',
    edad: 2,
    propietario: 'Carlos Rojas',
    telefono: '+56987654321',
  };

  it('1. Limpia espacios de los campos de texto', () => {
    const resultado = limpiarPaciente({
      ...pacienteValido,
      nombre: '  Thor  ',
    });

    expect(resultado.nombre).toBe('Thor');
  });

  it('2. Convierte la edad a número', () => {
    const resultado = limpiarPaciente({
      ...pacienteValido,
      edad: '4',
    });

    expect(resultado.edad).toBe(4);
  });

  it('3. Acepta un paciente válido', () => {
    expect(validarPaciente(pacienteValido)).toBe('');
  });

  it('4. Rechaza campos obligatorios vacíos', () => {
    const resultado = validarPaciente({
      ...pacienteValido,
      nombre: '',
    });

    expect(resultado).toContain('completar');
  });

  it('5. Rechaza una edad negativa', () => {
    const resultado = validarPaciente({
      ...pacienteValido,
      edad: -2,
    });

    expect(resultado).toContain('edad');
  });

  it('6. Rechaza una edad decimal', () => {
    const resultado = validarPaciente({
      ...pacienteValido,
      edad: 2.5,
    });

    expect(resultado).toContain('edad');
  });

  it('7. Rechaza un teléfono inválido', () => {
    const resultado = validarPaciente({
      ...pacienteValido,
      telefono: '123',
    });

    expect(resultado).toContain('teléfono');
  });

  it('8. Busca pacientes por nombre', () => {
    const resultado = buscarPacientes(
      [pacienteValido, segundoPaciente],
      'thor'
    );

    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe('Thor');
  });

  it('9. Busca pacientes por propietario', () => {
    const resultado = buscarPacientes(
      [pacienteValido, segundoPaciente],
      'carlos'
    );

    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe('Luna');
  });

  it('10. Agrega un paciente sin eliminar los anteriores', () => {
    const resultado = agregarPaciente(
      [pacienteValido],
      segundoPaciente
    );

    expect(resultado.length).toBe(2);
    expect(resultado[1].nombre).toBe('Luna');
  });

  it('11. Actualiza solamente el paciente indicado', () => {
    const actualizado = {
      ...pacienteValido,
      nombre: 'Thor Actualizado',
    };

    const resultado = actualizarPaciente(
      [pacienteValido, segundoPaciente],
      actualizado
    );

    expect(resultado[0].nombre).toBe('Thor Actualizado');
    expect(resultado[1].nombre).toBe('Luna');
  });

  it('12. Elimina un paciente por su identificador', () => {
    const resultado = eliminarPaciente(
      [pacienteValido, segundoPaciente],
      pacienteValido.id
    );

    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe('Luna');
  });
});
