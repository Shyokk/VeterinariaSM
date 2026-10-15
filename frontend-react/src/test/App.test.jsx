
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import App from '../App';

function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
}

describe('Aplicación principal', () => {
  it('muestra el nombre de la veterinaria', () => {
    renderApp();

    expect(
      screen.getByRole('heading', {
        name: 'Veterinaria San Marcos',
      })
    ).toBeInTheDocument();
  });

  it('muestra los enlaces principales de navegación', () => {
    renderApp();

    expect(
      screen.getByRole('link', { name: 'Inicio' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Pacientes' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Solicitar cita' })
    ).toBeInTheDocument();
  });

  it('muestra la página de inicio en la ruta principal', () => {
    renderApp();

    expect(
      screen.getByRole('heading', {
        name: 'Bienvenido a Veterinaria San Marcos',
      })
    ).toBeInTheDocument();
  });

  it('permite navegar a la página de pacientes', () => {
    renderApp();

    fireEvent.click(
      screen.getByRole('link', { name: 'Pacientes' })
    );

    expect(
      screen.getByRole('heading', { name: 'Pacientes' })
    ).toBeInTheDocument();
  });
});
