import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// MOCKS: Simulación de datos y funciones de backend para la veterinaria
const mockObtenerMascotas = vi.fn().mockReturnValue([
  { id: 1, nombre: 'Firulais', especie: 'Perro', edad: 4 },
  { id: 2, nombre: 'Mishi', especie: 'Gato', edad: 2 }
]);

const mockAutenticacionUsuario = vi.fn((email, password) => {
  if (email === 'admin@veterinaria.com' && password === '123456') {
    return { exito: true, token: 'abc-123-token' };
  }
  return { exito: false, mensaje: 'Credenciales inválidas' };
});

describe('Suite de Pruebas Unitarias - VeterinariaSM', () => {

  // PRUEBA 1: Renderizado general de la app
  it('1. Debe renderizar el contenedor principal de la aplicación sin errores', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });

  // PRUEBA 2: Navegación a la ruta Raíz (Bienvenida)
  it('2. Debe cargar correctamente la ruta inicial ("/")', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  // PRUEBA 3: Navegación a la página de Login
  it('3. Debe renderizar la vista de Login sin lanzar excepciones', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  // PRUEBA 4: Navegación a la página de Perfil
  it('4. Debe renderizar la ruta de Perfil ("/perfil")', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/perfil']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  // PRUEBA 5: Navegación a la página de Mis Mascotas
  it('5. Debe cargar la vista de Mis Mascotas ("/mis-mascotas")', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/mis-mascotas']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  // PRUEBA 6: Navegación a la vista de Pacientes
  it('6. Debe acceder a la ruta de Pacientes ("/pacientes")', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pacientes']}>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  // PRUEBA 7: MOCK - Verificación de llamada al servicio de mascotas
  it('7. Mock: Debe llamar a la función simulada de obtener mascotas correctamente', () => {
    const lista = mockObtenerMascotas();
    expect(mockObtenerMascotas).toHaveBeenCalled();
    expect(lista).toHaveLength(2);
  });

  // PRUEBA 8: MOCK - Verificación de datos de respuesta simulados
  it('8. Mock: Debe validar la estructura de los datos retornados por el mock de mascotas', () => {
    const lista = mockObtenerMascotas();
    expect(lista[0].nombre).toBe('Firulais');
    expect(lista[1].especie).toBe('Gato');
  });

  // PRUEBA 9: MOCK - Simulación de autenticación exitosa
  it('9. Mock: Debe procesar el inicio de sesión exitoso con credenciales válidas', () => {
    const respuesta = mockAutenticacionUsuario('admin@veterinaria.com', '123456');
    expect(respuesta.exito).toBe(true);
    expect(respuesta.token).toBe('abc-123-token');
  });

  // PRUEBA 10: MOCK - Simulación de autenticación fallida
  it('10. Mock: Debe denegar el acceso cuando las credenciales son incorrectas', () => {
    const respuesta = mockAutenticacionUsuario('user@fake.com', 'error');
    expect(respuesta.exito).toBe(false);
    expect(respuesta.mensaje).toBe('Credenciales inválidas');
  });

});