
import { useEffect, useState } from 'react';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import { usePacientes } from '../../context/PacientesContext.jsx';
import { useHistorial } from '../../context/HistorialContext.jsx';

export default function Historial() {
  const { pacientes } = usePacientes();

  const {
    obtenerDiagnosticosPaciente,
    obtenerVacunasPaciente,
    obtenerRecetasPaciente,
    eliminarDiagnostico,
    eliminarVacuna,
    eliminarReceta,
  } = useHistorial();

  const [parametros, setParametros] = useSearchParams();
  const [mensaje, setMensaje] = useState('');

  const pacienteId = parametros.get('paciente') || '';

  const paciente = pacientes.find(
    (item) => item.id === pacienteId
  );

  const diagnosticos = paciente
    ? obtenerDiagnosticosPaciente(paciente.id)
    : [];

  const vacunas = paciente
    ? obtenerVacunasPaciente(paciente.id)
    : [];

  const recetas = paciente
    ? obtenerRecetasPaciente(paciente.id)
    : [];

  useEffect(() => {
    document.title = 'Historial clínico | Veterinaria San Marcos';

    return () => {
      document.title = 'Veterinaria San Marcos';
    };
  }, []);

  function seleccionarPaciente(evento) {
    const id = evento.target.value;

    setParametros(id ? { paciente: id } : {});
    setMensaje('');
  }

  function confirmarEliminacion(tipo, id) {
    const confirmado = window.confirm(
      `¿Deseas eliminar este registro de ${tipo}?`
    );

    if (!confirmado) {
      return;
    }

    if (tipo === 'diagnóstico') {
      eliminarDiagnostico(id);
    } else if (tipo === 'vacuna') {
      eliminarVacuna(id);
    } else if (tipo === 'receta') {
      eliminarReceta(id);
    }

    setMensaje('Registro eliminado correctamente.');
  }

  const rutaPaciente = paciente
    ? `?paciente=${encodeURIComponent(paciente.id)}`
    : '';

  return (
    <main className="contenido-main container py-4">
      <h1 className="mb-3">Historial clínico</h1>

      <p className="text-secondary">
        Consulta los diagnósticos, vacunas y recetas
        de cada mascota registrada.
      </p>

      <div className="alert alert-info">
        Historial de demostración con datos mock.
        Los cambios se reinician al recargar.
      </div>

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Seleccionar paciente</h2>

          {pacientes.length === 0 ? (
            <Link to="/pacientes" className="btn btn-primary">
              Registrar paciente
            </Link>
          ) : (
            <select
              className="form-select"
              aria-label="Seleccionar paciente"
              value={paciente?.id || ''}
              onChange={seleccionarPaciente}
            >
              <option value="">Selecciona una mascota</option>

              {pacientes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre} — {item.propietario}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      {paciente && (
        <>
          <section className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h4 mb-3">
                Ficha de {paciente.nombre}
              </h2>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <strong>Especie:</strong> {paciente.especie}
                </div>

                <div className="col-12 col-md-6">
                  <strong>Raza:</strong> {paciente.raza}
                </div>

                <div className="col-12 col-md-6">
                  <strong>Edad:</strong> {paciente.edad} años
                </div>

                <div className="col-12 col-md-6">
                  <strong>Propietario:</strong>{' '}
                  {paciente.propietario}
                </div>

                <div className="col-12">
                  <strong>Teléfono:</strong> {paciente.telefono}
                </div>
              </div>
            </div>
          </section>

          <div className="d-flex flex-wrap gap-2 mb-4">
            <Link
              to={`/nuevo-diagnostico${rutaPaciente}`}
              className="btn btn-primary"
            >
              Nuevo diagnóstico
            </Link>

            <Link
              to={`/nueva-vacuna${rutaPaciente}`}
              className="btn btn-success"
            >
              Nueva vacuna
            </Link>

            <Link
              to={`/nueva-receta${rutaPaciente}`}
              className="btn btn-outline-primary"
            >
              Nueva receta
            </Link>
          </div>

          <section className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h4 mb-3">
                Diagnósticos ({diagnosticos.length})
              </h2>

              {diagnosticos.length === 0 ? (
                <p className="text-secondary">
                  No hay diagnósticos registrados.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Diagnóstico</th>
                        <th>Tratamiento</th>
                        <th>Veterinario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnosticos.map((item) => (
                        <tr key={item.id}>
                          <td>{item.fecha}</td>
                          <td>{item.descripcion}</td>
                          <td>{item.tratamiento}</td>
                          <td>{item.veterinario}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                confirmarEliminacion(
                                  'diagnóstico',
                                  item.id
                                )
                              }
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

          <section className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h4 mb-3">
                Vacunas ({vacunas.length})
              </h2>

              {vacunas.length === 0 ? (
                <p className="text-secondary">
                  No hay vacunas registradas.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Vacuna</th>
                        <th>Dosis</th>
                        <th>Veterinario</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacunas.map((item) => (
                        <tr key={item.id}>
                          <td>{item.fecha}</td>
                          <td>{item.nombre}</td>
                          <td>{item.dosis}</td>
                          <td>{item.veterinario}</td>
                          <td>{item.observaciones || '—'}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                confirmarEliminacion(
                                  'vacuna',
                                  item.id
                                )
                              }
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

          <section className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-3">
                Recetas ({recetas.length})
              </h2>

              {recetas.length === 0 ? (
                <p className="text-secondary">
                  No hay recetas registradas.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Medicamento</th>
                        <th>Dosis</th>
                        <th>Frecuencia</th>
                        <th>Duración</th>
                        <th>Indicaciones</th>
                        <th>Veterinario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recetas.map((item) => (
                        <tr key={item.id}>
                          <td>{item.fecha}</td>
                          <td>{item.medicamento}</td>
                          <td>{item.dosis}</td>
                          <td>{item.frecuencia}</td>
                          <td>{item.duracion}</td>
                          <td>{item.indicaciones || '—'}</td>
                          <td>{item.veterinario}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                confirmarEliminacion(
                                  'receta',
                                  item.id
                                )
                              }
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
        </>
      )}
    </main>
  );
}
