
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TarjetaMascota from './TarjetaMascota';

describe('TarjetaMascota', () => {
  it('muestra el nombre de la mascota', () => {
    render(
      <TarjetaMascota
        nombre="Thor"
        especie="Perro"
        edad="4 años"
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Thor' })
    ).toBeInTheDocument();
  });

  it('muestra la especie de la mascota', () => {
    render(
      <TarjetaMascota
        nombre="Thor"
        especie="Perro"
        edad="4 años"
      />
    );

    expect(screen.getByText('Perro')).toBeInTheDocument();
  });

  it('muestra la edad de la mascota', () => {
    render(
      <TarjetaMascota
        nombre="Thor"
        especie="Perro"
        edad="4 años"
      />
    );

    expect(screen.getByText('4 años')).toBeInTheDocument();
  });
});
