
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import SolicitarCita from '../../pages/SolicitarCita';

describe('Formulario de solicitud de cita', () => {
  it('muestra el título del formulario', () => {
    render(<SolicitarCita />);

    expect(
      screen.getByRole('heading', {
        name: 'Solicitar una cita',
      })
    ).toBeInTheDocument();
  });

  it('marca como obligatorios los campos principales', () => {
    render(<SolicitarCita />);

    expect(
      screen.getByLabelText('Nombre del dueño/a')
    ).toBeRequired();

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toBeRequired();

    expect(
      screen.getByLabelText('Nombre de la mascota')
    ).toBeRequired();

    expect(
      screen.getByLabelText('Fecha solicitada')
    ).toBeRequired();
  });

  it('permite seleccionar la especie de la mascota', () => {
    render(<SolicitarCita />);

    const selector = screen.getByLabelText('Especie');

    fireEvent.change(selector, {
      target: { value: 'Gato' },
    });

    expect(selector).toHaveValue('Gato');
  });

  it('muestra una confirmación al enviar los datos', () => {
    render(<SolicitarCita />);

    fireEvent.change(
      screen.getByLabelText('Nombre del dueño/a'),
      { target: { value: 'Camila Pérez' } }
    );

    fireEvent.change(
      screen.getByLabelText('Correo electrónico'),
      { target: { value: 'camila@example.com' } }
    );

    fireEvent.change(
      screen.getByLabelText('Nombre de la mascota'),
      { target: { value: 'Thor' } }
    );

    fireEvent.change(
      screen.getByLabelText('Especie'),
      { target: { value: 'Perro' } }
    );

    fireEvent.change(
      screen.getByLabelText('Fecha solicitada'),
      { target: { value: '2026-11-20' } }
    );

    fireEvent.change(
      screen.getByLabelText('Motivo de consulta'),
      { target: { value: 'Control general' } }
    );

    fireEvent.submit(
      screen.getByRole('form', {
        name: 'Formulario de solicitud de cita',
      })
    );

    expect(
      screen.getByRole('status')
    ).toHaveTextContent('Solicitud registrada en la demostración');

    expect(
      screen.getByRole('status')
    ).toHaveTextContent('Camila Pérez');

    expect(
      screen.getByRole('status')
    ).toHaveTextContent('Thor');

    
    expect(
      screen.getByRole('status')
    ).toHaveTextContent('Los datos se guardan en este navegador, no en un servidor.');

  });
});
