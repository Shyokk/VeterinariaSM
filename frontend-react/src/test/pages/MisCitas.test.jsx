
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import MisCitas from '../../pages/MisCitas';
import {
  registrarSolicitud,
  actualizarEstadoSolicitud,
} from '../../services/citasService';

const datosPrueba = {
  nombreDueno: 'Camila Pérez',
  correo: 'camila@example.com',
  nombreMascota: 'Thor',
  especie: 'Perro',
  fecha: '2026-11-20',
  motivo: 'Control veterinario general',
};

describe('Página MisCitas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra el formulario de consulta', () => {
    render(<MisCitas />);

    expect(
      screen.getByRole('heading', { name: 'Mis citas' })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toBeInTheDocument();
  });

  it('muestra solo las solicitudes que coinciden con el correo', () => {
    registrarSolicitud(datosPrueba);

    registrarSolicitud({
      ...datosPrueba,
      correo: 'otra@example.com',
      nombreMascota: 'Luna',
    });

    render(<MisCitas />);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'CAMILA@example.com' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Consultar mis citas' })
    );

    expect(screen.getByText('Thor')).toBeInTheDocument();
    expect(screen.queryByText('Luna')).not.toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('informa cuando el correo no tiene solicitudes', () => {
    render(<MisCitas />);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'sin-citas@example.com' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Consultar mis citas' })
    );

    expect(
      screen.getByText(/No encontramos solicitudes asociadas a ese correo/)
    ).toBeInTheDocument();
  });

  it('muestra la fecha propuesta cuando la solicitud fue reprogramada', () => {
    const solicitud = registrarSolicitud(datosPrueba);

    actualizarEstadoSolicitud(solicitud.id, {
      estado: 'Reprogramada',
      fechaPropuesta: '2026-11-25',
    });

    render(<MisCitas />);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: datosPrueba.correo },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Consultar mis citas' })
    );

    expect(screen.getByText('Reprogramada')).toBeInTheDocument();
    expect(screen.getByText('2026-11-25')).toBeInTheDocument();
  });
});
