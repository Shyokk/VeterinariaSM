
import { useEffect, useState } from 'react';
import {
  listarSolicitudes,
  actualizarEstadoSolicitud,
} from '../services/citasService';

function GestionCitas() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [fechasPropuestas, setFechasPropuestas] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    actualizarLista();
  }, []);

  function actualizarLista() {
    setSolicitudes(listarSolicitudes());
  }

  function manejarConfirmacion(solicitud) {
    const fechaConfirmada =
      solicitud.fechaPropuesta || solicitud.fecha;

    actualizarEstadoSolicitud(solicitud.id, {
      estado: 'Confirmada',
      fechaConfirmada,
    });

    setMensaje(
      `La solicitud ${solicitud.id} fue confirmada para el ${fechaConfirmada}.`
    );

    actualizarLista();
  }

  function manejarPropuesta(solicitud) {
    const fechaPropuesta = fechasPropuestas[solicitud.id];

    if (!fechaPropuesta) {
      setMensaje('Selecciona una fecha antes de proponerla.');
      return;
    }

    actualizarEstadoSolicitud(solicitud.id, {
      estado: 'Reprogramada',
      fechaPropuesta,
      fechaConfirmada: '',
    });

    setMensaje(
      `Se propuso una nueva fecha para la solicitud ${solicitud.id}.`
    );

    actualizarLista();
  }

  function manejarCancelacion(solicitud) {
    actualizarEstadoSolicitud(solicitud.id, {
      estado: 'Cancelada',
      fechaConfirmada: '',
    });

    setMensaje(`La solicitud ${solicitud.id} fue cancelada.`);
    actualizarLista();
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
        <h2>Solicitudes de citas</h2>

        <p className="text-secondary">
          Consulta las solicitudes registradas y administra sus
          estados. Los cambios se guardan en este navegador.
        </p>
      </div>

      {mensaje && (
        <div className="alert alert-info" role="status">
          {mensaje}
        </div>
      )}

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <p className="mb-0">
          <strong>Total de solicitudes:</strong> {solicitudes.length}
        </p>

        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={actualizarLista}
        >
          Actualizar lista
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <div className="alert alert-secondary">
          <h3 className="h5">Todavía no hay solicitudes</h3>
          <p className="mb-0">
            Registra una cita desde Solicitar cita para verla aquí.
          </p>
        </div>
      ) : (
        <div className="d-grid gap-3">
          {solicitudes.map((solicitud) => (
            <article
              key={solicitud.id}
              className="card shadow-sm"
            >
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                  <div>
                    <h3 className="h5 mb-1">
                      {solicitud.nombreMascota}
                    </h3>

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

                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-6">
                    <p className="mb-1">
                      <strong>Dueño/a:</strong> {solicitud.nombreDueno}
                    </p>

                    <p className="mb-1">
                      <strong>Correo:</strong> {solicitud.correo}
                    </p>

                    <p className="mb-1">
                      <strong>Especie:</strong> {solicitud.especie}
                    </p>
                  </div>

                  <div className="col-12 col-md-6">
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
                  </div>
                </div>

                <p>
                  <strong>Motivo:</strong> {solicitud.motivo}
                </p>

                {solicitud.estado !== 'Cancelada' &&
                  solicitud.estado !== 'Confirmada' && (
                    <div className="border-top pt-3 mt-3">
                      <label
                        htmlFor={`fecha-${solicitud.id}`}
                        className="form-label"
                      >
                        Proponer otra fecha
                      </label>

                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <input
                          id={`fecha-${solicitud.id}`}
                          type="date"
                          className="form-control"
                          min={new Date().toISOString().slice(0, 10)}
                          value={fechasPropuestas[solicitud.id] || ''}
                          onChange={(evento) => {
                            setFechasPropuestas((anterior) => ({
                              ...anterior,
                              [solicitud.id]: evento.target.value,
                            }));
                          }}
                        />

                        <button
                          type="button"
                          className="btn btn-outline-info text-nowrap"
                          onClick={() => manejarPropuesta(solicitud)}
                        >
                          Proponer fecha
                        </button>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => manejarConfirmacion(solicitud)}
                        >
                          Confirmar cita
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => manejarCancelacion(solicitud)}
                        >
                          Cancelar solicitud
                        </button>
                      </div>

                      {solicitud.estado === 'Reprogramada' && (
                        <p className="small text-secondary mt-2 mb-0">
                          Al confirmar, se utilizará la fecha propuesta.
                        </p>
                      )}
                    </div>
                  )}

                {solicitud.estado === 'Confirmada' && (
                  <p className="text-success mb-0">
                    Esta cita ya está confirmada.
                  </p>
                )}

                {solicitud.estado === 'Cancelada' && (
                  <p className="text-danger mb-0">
                    Esta solicitud está cancelada.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default GestionCitas;
