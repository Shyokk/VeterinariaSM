// URLs de los microservicios del backend. Se pueden cambiar con un archivo .env (ver .env.example).
export const API = {
  usuarios: import.meta.env.VITE_API_USUARIOS ?? 'http://localhost:8081',
  pacientes: import.meta.env.VITE_API_PACIENTES ?? 'http://localhost:8082',
  citas: import.meta.env.VITE_API_CITAS ?? 'http://localhost:8083',
};

// Datos de la clínica (se usan en el mapa de "Nosotros"). Ajustar a la dirección real.
export const CLINICA = {
  nombre: 'Veterinaria San Marcos',
  direccion: 'Rancagua, Región del Libertador General Bernardo O\'Higgins',
  latitud: -34.1701,
  longitud: -70.7406,
  telefono: '+56 72 222 0000',
  email: 'VeteSM@sanmarcos.cl',
};
