
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Pacientes from '../../pages/Pacientes';

describe('Página de pacientes', () => {
  it('muestra las tres mascotas iniciales', () => {
    render(<Pacientes />);

    expect(
      screen.getByRole('heading', { name: 'Thor' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Luna' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Max' })
    ).toBeInTheDocument();
  });

  it('filtra las mascotas según el nombre escrito', () => {
    render(<Pacientes />);

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: 'Buscar por nombre',
      }),
      { target: { value: 'LUNA' } }
    );

    expect(
      screen.getByRole('heading', { name: 'Luna' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Thor' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Max' })
    ).not.toBeInTheDocument();
  });

  it('muestra un aviso cuando no existen coincidencias', () => {
    render(<Pacientes />);

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: 'Buscar por nombre',
      }),
      { target: { value: 'Firulais' } }
    );

    expect(
      screen.getByRole('status')
    ).toHaveTextContent(
      'No se encontraron mascotas con ese nombre.'
    );
  });
});
