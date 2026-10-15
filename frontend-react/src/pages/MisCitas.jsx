
import { useState } from 'react';
import { listarSolicitudes } from '../services/citasService';

function MisCitas() {
  const [correo, setCorreo] = useState('');
  const [correoConsultado, setCorreoConsultado] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [consultaRealizada, setConsultaRealizada] = useState(false);

  function manejarConsulta(evento) {
    evento.preventDefault();

    const correoNormalizado = correo.trim().toLowerCase();

    const coincidencias = listarSolicitudes().filter(
      (solicitud) =>
        solicitud.correo.trim().toLowerCase() === correoNormalizado
    );

    setSolicitudes(coincidencias);
    setCorreoConsultado(correoNormalizado);
    setConsultaRealizada(true);
  }

  function claseEstado(estado) {
    const clases = {
      Pendiente: 'text-bg-warning',
      Confirmada: 'text-bg-success',
      Reprogramada: 'text-bg-info',
      Cancelada: 'text-bg-danger',
    };

    return clases[estado] || 'text-bg-secondary';
  }

  return (
    <section>
      <div className="mb-4">
        <h2>Mis citas</h2>

        <p className="text-secondary">
          Consulta las solicitudes asociadas al correo utilizado
          al pedir una cita.
        </p>
      </div>

      <form
        className="card shadow-sm mb-4"
        aria-label="Consultar mis citas"
        onSubmit={manejarConsulta}
      >
        <div className="card-body">
          <label htmlFor="correoConsulta" className="form-label">
            Correo electrónico
          </label>

          <div className="d-flex flex-column flex-sm-row gap-2">
            <input
              id="correoConsulta"
              name="correoConsulta"
              type="email"
              className="form-control"
              placeholder="nombre@correo.cl"
              autoComplete="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              required
            />

            <button type="submit" className="btn btn-primary text-nowrap">
              Consultar mis citas
            </button>
          </div>

          <p className="form-text mb-0 mt-2">
            Esta consulta es demostrativa y utiliza los datos guardados
            en este navegador.
          </p>
        </div>
      </form>

      {consultaRealizada && (
        <section aria-live="polite">
          <h3 className="h5">
            Resultados para: {correoConsultado}
          </h3>

          {solicitudes.length === 0 ? (
            <div className="alert alert-secondary" role="status">
              No encontramos solicitudes asociadas a ese correo.
              Verifica la dirección o registra una nueva cita.
            </div>
          ) : (
            <>
              <p>
                <strong>Solicitudes encontradas:</strong>{' '}
                {solicitudes.length}
              </p>

              <div className="d-grid gap-3">
                {solicitudes.map((solicitud) => (
                  <article
                    key={solicitud.id}
                    className="card shadow-sm"
                  >
                    <div className="card-body">
                      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                        <div>
                          <h4 className="h5 mb-1">
                            {solicitud.nombreMascota}
                          </h4>

                          <p className="text-secondary mb-0">
                            Solicitud: {solicitud.id}
                          </p>
                        </div>

                        <span
                          className={`badge ${claseEstado(solicitud.estado)}`}
                        >
                          {solicitud.estado}
                        </span>
                      </div>

                      <hr />

                      <p className="mb-1">
                        <strong>Especie:</strong> {solicitud.especie}
                      </p>

                      <p className="mb-1">
                        <strong>Fecha solicitada:</strong> {solicitud.fecha}
                      </p>

                      {solicitud.fechaPropuesta && (
                        <p className="mb-1">
                          <strong>Fecha propuesta:</strong>{' '}
                          {solicitud.fechaPropuesta}
                        </p>
                      )}

                      {solicitud.fechaConfirmada && (
                        <p className="mb-1">
                          <strong>Fecha confirmada:</strong>{' '}
                          {solicitud.fechaConfirmada}
                        </p>
                      )}

                      <p className="mb-0 mt-2">
                        <strong>Motivo:</strong> {solicitud.motivo}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </section>
  );
}

export default MisCitas;
