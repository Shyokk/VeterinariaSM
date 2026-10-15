
import { useState } from 'react';
import TarjetaMascota from '../components/TarjetaMascota';

const mascotas = [
  {
    id: 1,
    nombre: 'Thor',
    especie: 'Perro',
    edad: '4 años',
  },
  {
    id: 2,
    nombre: 'Luna',
    especie: 'Gato',
    edad: '2 años',
  },
  {
    id: 3,
    nombre: 'Max',
    especie: 'Perro',
    edad: '6 años',
  },
];

function Pacientes() {
  const [busqueda, setBusqueda] = useState('');

  const mascotasFiltradas = mascotas.filter((mascota) =>
    mascota.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase())
  );

  return (
    <section aria-labelledby="titulo-pacientes">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 id="titulo-pacientes">Pacientes</h2>
          <p className="text-secondary mb-0">
            Listado de mascotas de ejemplo.
          </p>
        </div>

        <span className="badge text-bg-primary fs-6">
          {mascotasFiltradas.length} resultados
        </span>
      </div>

      <div className="mb-4">
        <label htmlFor="buscar-mascota" className="form-label">
          Buscar por nombre
        </label>

        <input
          id="buscar-mascota"
          type="search"
          className="form-control"
          placeholder="Ejemplo: Thor"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
      </div>

      {mascotasFiltradas.length > 0 ? (
        <div className="row g-3">
          {mascotasFiltradas.map((mascota) => (
            <div
              className="col-12 col-md-6 col-xl-4"
              key={mascota.id}
            >
              <TarjetaMascota
                nombre={mascota.nombre}
                especie={mascota.especie}
                edad={mascota.edad}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning" role="status">
          No se encontraron mascotas con ese nombre.
        </div>
      )}
    </section>
  );
}

export default Pacientes;
