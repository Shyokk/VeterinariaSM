
export const pacientesMock = [
  {
    id: 'mock-paciente-1',
    nombre: 'Thor',
    especie: 'Perro',
    raza: 'Labrador',
    edad: 4,
    propietario: 'Ana Pérez',
    telefono: '+56912345678',
  },
  {
    id: 'mock-paciente-2',
    nombre: 'Luna',
    especie: 'Gato',
    raza: 'Mestizo',
    edad: 2,
    propietario: 'Carlos Rojas',
    telefono: '+56987654321',
  },
];

export const diagnosticosMock = [
  {
    id: 'mock-diagnostico-1',
    pacienteId: 'mock-paciente-1',
    fecha: '2026-10-10',
    descripcion: 'Dermatitis leve (dato simulado)',
    tratamiento: 'Control veterinario (dato simulado)',
    veterinario: 'Dra. Andrea Soto (ficticia)',
  },
];

export const vacunasMock = [
  {
    id: 'mock-vacuna-1',
    pacienteId: 'mock-paciente-1',
    fecha: '2026-09-15',
    nombre: 'Antirrábica',
    dosis: '1 dosis',
    veterinario: 'Dra. Andrea Soto (ficticia)',
    observaciones: 'Aplicación de demostración',
  },
];

export const recetasMock = [
  {
    id: 'mock-receta-1',
    pacienteId: 'mock-paciente-1',
    fecha: '2026-10-10',
    medicamento: 'Medicamento ficticio de demostración',
    dosis: 'Según indicación veterinaria',
    frecuencia: 'Según indicación veterinaria',
    duracion: 'Según indicación veterinaria',
    indicaciones: 'Registro de ejemplo, no es una prescripción real',
    veterinario: 'Dra. Andrea Soto (ficticia)',
  },
];
