
import { useState } from 'react';
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { usePacientes } from '../../context/PacientesContext.jsx';
import { useHistorial } from '../../context/HistorialContext.jsx';

function fechaActual() {
  const ahora = new Date();
  const local = new Date(
    ahora.getTime() - ahora.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 10);
}

export default function NuevaVacuna() {
  const { pacientes } = usePacientes();
  const { registrarVacuna } = useHistorial();

  const navegar = useNavigate();
  const [parametros] = useSearchParams();

  const pacienteInicial = parametros.get('paciente') || '';

  const [formulario, setFormulario] = useState({
    pacienteId: pacienteInicial,
    fecha: fechaActual(),
    nombre: '',
    dosis: '',
    veterinario: '',
    observaciones: '',
  });

  const [error, setError] = useState('');

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setError('');
  }

  function guardarVacuna(evento) {
    evento.preventDefault();

    const nombre = formulario.nombre.trim();
    const dosis = formulario.dosis.trim();
    const veterinario = formulario.veterinario.trim();

    if (
      !formulario.pacienteId ||
      !formulario.fecha ||
      !nombre ||
      !dosis ||
      !veterinario
    ) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    const vacuna = {
      id: `registro-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      pacienteId: formulario.pacienteId,
      fecha: formulario.fecha,
      nombre,
      dosis,
      veterinario,
      observaciones: formulario.observaciones.trim(),
    };

    const guardado = registrarVacuna(vacuna);

    if (!guardado) {
      setError('El paciente seleccionado no existe.');
      return;
    }

    navegar(
      `/historial?paciente=${encodeURIComponent(
        formulario.pacienteId
      )}`
    );
  }

  return (
    <main className="contenido-main container py-4">
      <h1 className="mb-3">Registrar vacuna</h1>

      <p className="text-secondary">
        Registra una vacuna y asóciala al historial
        clínico de una mascota.
      </p>

      <div className="alert alert-info">
        Formulario de demostración con datos simulados.
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <section className="card shadow-sm">
        <div className="card-body">
          {pacientes.length === 0 ? (
            <>
              <p>No hay pacientes registrados.</p>
              <Link to="/pacientes" className="btn btn-primary">
                Registrar paciente
              </Link>
            </>
          ) : (
            <form onSubmit={guardarVacuna}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label
                    htmlFor="pacienteId"
                    className="form-label"
                  >
                    Paciente *
                  </label>

                  <select
                    id="pacienteId"
                    name="pacienteId"
                    className="form-select"
                    value={formulario.pacienteId}
                    onChange={actualizarCampo}
                    required
                  >
                    <option value="">Selecciona una mascota</option>

                    {pacientes.map((paciente) => (
                      <option
                        key={paciente.id}
                        value={paciente.id}
                      >
                        {paciente.nombre} — {paciente.propietario}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="fecha" className="form-label">
                    Fecha de aplicación *
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
                  <label htmlFor="nombre" className="form-label">
                    Nombre de la vacuna *
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    placeholder="Ej. Antirrábica"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="dosis" className="form-label">
                    Dosis aplicada *
                  </label>

                  <input
                    id="dosis"
                    name="dosis"
                    className="form-control"
                    placeholder="Ej. Primera dosis"
                    value={formulario.dosis}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12">
                  <label
                    htmlFor="veterinario"
                    className="form-label"
                  >
                    Veterinario responsable *
                  </label>

                  <input
                    id="veterinario"
                    name="veterinario"
                    className="form-control"
                    value={formulario.veterinario}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12">
                  <label
                    htmlFor="observaciones"
                    className="form-label"
                  >
                    Observaciones
                  </label>

                  <textarea
                    id="observaciones"
                    name="observaciones"
                    className="form-control"
                    rows="3"
                    value={formulario.observaciones}
                    onChange={actualizarCampo}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar vacuna
                </button>

                <Link
                  to="/historial"
                  className="btn btn-secondary"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
