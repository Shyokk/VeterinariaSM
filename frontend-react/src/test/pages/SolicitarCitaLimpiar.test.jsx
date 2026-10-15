
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import SolicitarCita from '../../pages/SolicitarCita';

describe('Limpiar formulario de solicitud de cita', () => {
  it('vacía los campos y oculta la confirmación al limpiar', () => {
    render(<SolicitarCita />);

    const formulario = screen.getByRole('form', {
      name: 'Formulario de solicitud de cita',
    });

    fireEvent.change(screen.getByLabelText('Nombre del dueño/a'), {
      target: { value: 'Camila Pérez' },
    });

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'camila@example.com' },
    });

    fireEvent.change(screen.getByLabelText('Nombre de la mascota'), {
      target: { value: 'Luna' },
    });

    fireEvent.change(screen.getByLabelText('Especie'), {
      target: { value: 'Gato' },
    });

    fireEvent.change(screen.getByLabelText('Fecha solicitada'), {
      target: { value: '2026-11-20' },
    });

    fireEvent.change(screen.getByLabelText('Motivo de consulta'), {
      target: { value: 'Control veterinario general' },
    });

    fireEvent.submit(formulario);

    expect(
      screen.getByRole('heading', {
        name: 'Solicitud registrada en la demostración',
      })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Limpiar formulario',
      })
    );

    expect(
      screen.getByLabelText('Nombre del dueño/a')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('Nombre de la mascota')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('Especie')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('Fecha solicitada')
    ).toHaveValue('');

    expect(
      screen.getByLabelText('Motivo de consulta')
    ).toHaveValue('');

    expect(
      screen.queryByRole('heading', {
        name: 'Solicitud registrada en la demostración',
      })
    ).not.toBeInTheDocument();
  });
});
