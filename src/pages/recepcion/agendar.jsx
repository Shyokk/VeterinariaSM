
import { useEffect, useState } from 'react';

import {
  validarCita,
  crearCita,
  agregarCita,
  eliminarCitaPorId,
} from '../../utils/citas.js';

const formularioInicial = {
  propietario: '',
  mascota: '',
  fecha: '',
  hora: '',
  motivo: '',
};

export default function Agendar() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Agendar citas | Veterinaria San Marcos';

    return () => {
      document.title = 'Veterinaria San Marcos';
    };
  }, []);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setError('');
    setMensaje('');
  }

  function guardarCita(evento) {
    evento.preventDefault();

    const resultadoValidacion = validarCita(formulario, citas);

    if (resultadoValidacion) {
      setError(resultadoValidacion);
      setMensaje('');
      return;
    }

    const nuevaCita = crearCita(
      formulario,
      crypto.randomUUID()
    );

    setCitas((anteriores) =>
      agregarCita(anteriores, nuevaCita)
    );

    setFormulario(formularioInicial);
    setError('');
    setMensaje('La cita se agregó correctamente.');
  }

  function eliminarCita(id) {
    setCitas((anteriores) =>
      eliminarCitaPorId(anteriores, id)
    );

    setError('');
    setMensaje('La cita se eliminó correctamente.');
  }

  return (
    <main className="contenido-main container py-4">
      <h1 className="mb-3">Agendar citas</h1>

      <p className="text-secondary">
        Registra y consulta las citas de atención veterinaria.
      </p>

      <div className="alert alert-info" role="note">
        Versión de demostración: las citas se guardan
        temporalmente mientras esta página está abierta.
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h4 mb-4">Nueva cita</h2>

          <form onSubmit={guardarCita}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label
                  htmlFor="propietario"
                  className="form-label"
                >
                  Nombre del propietario
                </label>

                <input
                  id="propietario"
                  name="propietario"
                  type="text"
                  className="form-control"
                  value={formulario.propietario}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="mascota" className="form-label">
                  Nombre de la mascota
                </label>

                <input
                  id="mascota"
                  name="mascota"
                  type="text"
                  className="form-control"
                  value={formulario.mascota}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="fecha" className="form-label">
                  Fecha
                </label>

                <input
                  id="fecha"
                  name="fecha"
                  type="date"
                  className="form-control"
                  value={formulario.fecha}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="hora" className="form-label">
                  Hora
                </label>

                <input
                  id="hora"
                  name="hora"
                  type="time"
                  className="form-control"
                  value={formulario.hora}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="motivo" className="form-label">
                  Motivo de la consulta
                </label>

                <textarea
                  id="motivo"
                  name="motivo"
                  className="form-control"
                  rows="3"
                  value={formulario.motivo}
                  onChange={actualizarCampo}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-4"
            >
              Registrar cita
            </button>
          </form>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-3">
            Citas registradas ({citas.length})
          </h2>

          {citas.length === 0 ? (
            <p className="text-secondary mb-0">
              Todavía no hay citas registradas.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Propietario</th>
                    <th>Mascota</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Motivo</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {citas.map((cita) => (
                    <tr key={cita.id}>
                      <td>{cita.propietario}</td>
                      <td>{cita.mascota}</td>
                      <td>{cita.fecha}</td>
                      <td>{cita.hora}</td>
                      <td>{cita.motivo}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminarCita(cita.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
