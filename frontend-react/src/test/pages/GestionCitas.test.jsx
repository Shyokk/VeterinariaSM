
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import GestionCitas from '../../pages/GestionCitas';
import { registrarSolicitud } from '../../services/citasService';

const datosPrueba = {
  nombreDueno: 'Camila Pérez',
  correo: 'camila@example.com',
  nombreMascota: 'Thor',
  especie: 'Perro',
  fecha: '2026-11-20',
  motivo: 'Control veterinario general',
};

describe('Página GestionCitas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra un mensaje cuando no hay solicitudes', async () => {
    render(<GestionCitas />);

    expect(
      await screen.findByText('Todavía no hay solicitudes')
    ).toBeInTheDocument();
  });

  it('muestra una solicitud registrada', async () => {
    registrarSolicitud(datosPrueba);

    render(<GestionCitas />);

    expect(await screen.findByText('Thor')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('camila@example.com')).toBeInTheDocument();
  });

  it('confirma una solicitud con la fecha original', async () => {
    registrarSolicitud(datosPrueba);

    render(<GestionCitas />);

    await screen.findByText('Thor');

    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cita' })
    );

    expect(
      await screen.findByText('Esta cita ya está confirmada.')
    ).toBeInTheDocument();

    expect(screen.getByText('Confirmada')).toBeInTheDocument();
    expect(screen.getByText('2026-11-20')).toBeInTheDocument();
  });

  it('permite proponer una fecha alternativa', async () => {
    registrarSolicitud(datosPrueba);

    render(<GestionCitas />);

    await screen.findByText('Thor');

    fireEvent.change(screen.getByLabelText('Proponer otra fecha'), {
      target: { value: '2026-11-25' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Proponer fecha' })
    );

    expect(
      await screen.findByText(/Se propuso una nueva fecha/)
    ).toBeInTheDocument();

    expect(screen.getByText('Reprogramada')).toBeInTheDocument();
    expect(screen.getAllByText('2026-11-20').length).toBeGreaterThan(0);
  });

  it('no propone una fecha cuando el campo está vacío', async () => {
    registrarSolicitud(datosPrueba);

    render(<GestionCitas />);

    await screen.findByText('Thor');

    fireEvent.click(
      screen.getByRole('button', { name: 'Proponer fecha' })
    );

    expect(
      screen.getByText('Selecciona una fecha antes de proponerla.')
    ).toBeInTheDocument();

    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('permite cancelar una solicitud', async () => {
    registrarSolicitud(datosPrueba);

    render(<GestionCitas />);

    await screen.findByText('Thor');

    fireEvent.click(
      screen.getByRole('button', { name: 'Cancelar solicitud' })
    );

    expect(
      await screen.findByText('Esta solicitud está cancelada.')
    ).toBeInTheDocument();

    expect(screen.getByText('Cancelada')).toBeInTheDocument();
  });

  it('confirma con la fecha propuesta después de reprogramar', async () => {
    registrarSolicitud(datosPrueba);

    render(<GestionCitas />);

    await screen.findByText('Thor');

    fireEvent.change(screen.getByLabelText('Proponer otra fecha'), {
      target: { value: '2026-11-25' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Proponer fecha' })
    );

    await screen.findByText('Reprogramada');

    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cita' })
    );

    await waitFor(() => {
      expect(screen.getByText('Confirmada')).toBeInTheDocument();
    });

    
    expect(await screen.findByText('Esta cita ya está confirmada.')).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
    expect(screen.getAllByText('2026-11-20').length).toBeGreaterThan(0);

  });
});
