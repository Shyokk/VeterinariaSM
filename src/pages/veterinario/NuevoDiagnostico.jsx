
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { usePacientes } from '../../context/PacientesContext.jsx';
import { useHistorial } from '../../context/HistorialContext.jsx';

const formularioInicial = {
  pacienteId: '',
  fecha: '',
  descripcion: '',
  tratamiento: '',
  veterinario: '',
};

export default function NuevoDiagnostico() {
  const { pacientes } = usePacientes();
  const { registrarDiagnostico } = useHistorial();

  const navegar = useNavigate();
  const [parametros] = useSearchParams();

  const pacienteDesdeUrl = parametros.get('paciente') || '';

  const [formulario, setFormulario] = useState(() => ({
    ...formularioInicial,
    pacienteId: pacienteDesdeUrl,
    fecha: new Date().toLocaleDateString('en-CA'),
  }));

  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Nuevo diagnóstico | Veterinaria San Marcos';

    return () => {
      document.title = 'Veterinaria San Marcos';
    };
  }, []);

  useEffect(() => {
    setFormulario((anterior) => ({
      ...anterior,
      pacienteId: pacienteDesdeUrl,
    }));
  }, [pacienteDesdeUrl]);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setError('');
  }

  function guardarDiagnostico(evento) {
    evento.preventDefault();

    const descripcion = formulario.descripcion.trim();
    const tratamiento = formulario.tratamiento.trim();
    const veterinario = formulario.veterinario.trim();

    if (
      !formulario.pacienteId ||
      !formulario.fecha ||
      !descripcion ||
      !tratamiento ||
      !veterinario
    ) {
      setError('Debes completar todos los campos.');
      return;
    }

    const pacienteExiste = pacientes.some(
      (paciente) => paciente.id === formulario.pacienteId
    );

    if (!pacienteExiste) {
      setError('Debes seleccionar un paciente válido.');
      return;
    }

    const nuevoDiagnostico = {
      id: `registro-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      pacienteId: formulario.pacienteId,
      fecha: formulario.fecha,
      descripcion,
      tratamiento,
      veterinario,
    };

    registrarDiagnostico(nuevoDiagnostico);

    navegar(
      `/historial?paciente=${encodeURIComponent(
        formulario.pacienteId
      )}`
    );
  }

  return (
    <main className="contenido-main container py-4">
      <h1 className="mb-3">Registrar diagnóstico</h1>

      <p className="text-secondary">
        Ingresa los antecedentes de una atención veterinaria
        y asócialos al historial del paciente.
      </p>

      <div className="alert alert-info" role="note">
        Versión de demostración: los diagnósticos se guardan
        temporalmente en memoria.
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <section className="card shadow-sm">
        <div className="card-body">
          <h2 className="h4 mb-4">
            Datos del diagnóstico
          </h2>

          {pacientes.length === 0 ? (
            <>
              <p>
                Necesitas registrar una mascota antes
                de crear un diagnóstico.
              </p>

              <Link to="/pacientes" className="btn btn-primary">
                Registrar paciente
              </Link>
            </>
          ) : (
            <form onSubmit={guardarDiagnostico}>
              <div className="row g-3">
                <div className="col-12">
                  <label
                    htmlFor="pacienteId"
                    className="form-label"
                  >
                    Paciente
                  </label>

                  <select
                    id="pacienteId"
                    name="pacienteId"
                    className="form-select"
                    value={formulario.pacienteId}
                    onChange={actualizarCampo}
                    required
                  >
                    <option value="">
                      Selecciona una mascota
                    </option>

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
                    Fecha de atención
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
                    htmlFor="veterinario"
                    className="form-label"
                  >
                    Veterinario responsable
                  </label>

                  <input
                    id="veterinario"
                    name="veterinario"
                    type="text"
                    className="form-control"
                    placeholder="Nombre del veterinario"
                    value={formulario.veterinario}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12">
                  <label
                    htmlFor="descripcion"
                    className="form-label"
                  >
                    Diagnóstico
                  </label>

                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
                    rows="4"
                    placeholder="Describe los hallazgos de la consulta"
                    value={formulario.descripcion}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div className="col-12">
                  <label
                    htmlFor="tratamiento"
                    className="form-label"
                  >
                    Tratamiento indicado
                  </label>

                  <textarea
                    id="tratamiento"
                    name="tratamiento"
                    className="form-control"
                    rows="3"
                    placeholder="Indica el tratamiento o las recomendaciones"
                    value={formulario.tratamiento}
                    onChange={actualizarCampo}
                    required
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar diagnóstico
                </button>

                <Link
                  to={
                    formulario.pacienteId
                      ? `/historial?paciente=${encodeURIComponent(
                          formulario.pacienteId
                        )}`
                      : '/historial'
                  }
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
