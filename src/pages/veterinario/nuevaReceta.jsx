
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

export default function NuevaReceta() {
  const { pacientes } = usePacientes();
  const { registrarReceta } = useHistorial();

  const navegar = useNavigate();
  const [parametros] = useSearchParams();

  const pacienteInicial = parametros.get('paciente') || '';

  const [formulario, setFormulario] = useState({
    pacienteId: pacienteInicial,
    fecha: fechaActual(),
    medicamento: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    indicaciones: '',
    veterinario: '',
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

  function guardarReceta(evento) {
    evento.preventDefault();

    const campos = [
      formulario.pacienteId,
      formulario.fecha,
      formulario.medicamento,
      formulario.dosis,
      formulario.frecuencia,
      formulario.duracion,
      formulario.veterinario,
    ];

    if (campos.some((campo) => !String(campo).trim())) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    const receta = {
      id: `registro-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      pacienteId: formulario.pacienteId,
      fecha: formulario.fecha,
      medicamento: formulario.medicamento.trim(),
      dosis: formulario.dosis.trim(),
      frecuencia: formulario.frecuencia.trim(),
      duracion: formulario.duracion.trim(),
      indicaciones: formulario.indicaciones.trim(),
      veterinario: formulario.veterinario.trim(),
    };

    const guardado = registrarReceta(receta);

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
      <h1 className="mb-3">Registrar receta</h1>

      <p className="text-secondary">
        Registra una indicación veterinaria
        para un paciente.
      </p>

      <div className="alert alert-info">
        Registro de demostración. No utilizar
        como receta veterinaria real.
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
            <form onSubmit={guardarReceta}>
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
                    Fecha *
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
                  <label
                    htmlFor="medicamento"
                    className="form-label"
                  >
                    Medicamento *
                  </label>

                  <input
                    id="medicamento"
                    name="medicamento"
                    className="form-control"
                    value={formulario.medicamento}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="dosis" className="form-label">
                    Dosis *
                  </label>

                  <input
                    id="dosis"
                    name="dosis"
                    className="form-control"
                    value={formulario.dosis}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    htmlFor="frecuencia"
                    className="form-label"
                  >
                    Frecuencia *
                  </label>

                  <input
                    id="frecuencia"
                    name="frecuencia"
                    className="form-control"
                    placeholder="Ej. Cada 12 horas"
                    value={formulario.frecuencia}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label
                    htmlFor="duracion"
                    className="form-label"
                  >
                    Duración *
                  </label>

                  <input
                    id="duracion"
                    name="duracion"
                    className="form-control"
                    placeholder="Ej. 5 días"
                    value={formulario.duracion}
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
                    htmlFor="indicaciones"
                    className="form-label"
                  >
                    Indicaciones adicionales
                  </label>

                  <textarea
                    id="indicaciones"
                    name="indicaciones"
                    className="form-control"
                    rows="3"
                    value={formulario.indicaciones}
                    onChange={actualizarCampo}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar receta
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
