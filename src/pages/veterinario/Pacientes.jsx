
import { useEffect, useState } from 'react';

import { usePacientes } from '../../context/PacientesContext.jsx';

import {
  limpiarPaciente,
  validarPaciente,
  buscarPacientes,
} from '../../utils/pacientes.js';

const formularioInicial = {
  nombre: '',
  especie: '',
  raza: '',
  edad: '',
  propietario: '',
  telefono: '',
};

export default function Pacientes() {
  const {
    pacientes,
    registrarPaciente,
    editarPaciente: actualizarPacienteContexto,
    borrarPaciente: borrarPacienteContexto,
  } = usePacientes();

  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState('');
  const [idEditando, setIdEditando] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    document.title = 'Pacientes | Veterinaria San Marcos';

    return () => {
      document.title = 'Veterinaria San Marcos';
    };
  }, []);

  const pacientesFiltrados = buscarPacientes(pacientes, busqueda);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setError('');
    setMensaje('');
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setIdEditando(null);
    setError('');
  }

  function guardarPaciente(evento) {
    evento.preventDefault();

    const resultado = validarPaciente(formulario);

    if (resultado) {
      setError(resultado);
      setMensaje('');
      return;
    }

    const datos = limpiarPaciente(formulario);

    if (idEditando !== null) {
      actualizarPacienteContexto({
        ...datos,
        id: idEditando,
      });

      setMensaje('Paciente actualizado correctamente.');
    } else {
      registrarPaciente({
        ...datos,
        id: crypto.randomUUID(),
      });

      setMensaje('Paciente registrado correctamente.');
    }

    setFormulario(formularioInicial);
    setIdEditando(null);
    setError('');
  }

  function comenzarEdicion(paciente) {
    setFormulario({
      nombre: paciente.nombre,
      especie: paciente.especie,
      raza: paciente.raza,
      edad: String(paciente.edad),
      propietario: paciente.propietario,
      telefono: paciente.telefono,
    });

    setIdEditando(paciente.id);
    setError('');
    setMensaje('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function confirmarEliminacion(id) {
    const confirmado = window.confirm(
      '¿Estás seguro de que deseas eliminar este paciente?'
    );

    if (!confirmado) {
      return;
    }

    borrarPacienteContexto(id);

    if (idEditando === id) {
      limpiarFormulario();
    }

    setMensaje('Paciente eliminado correctamente.');
    setError('');
  }

  return (
    <main className="contenido-main container py-4">
      <h1 className="mb-3">Gestión de pacientes</h1>

      <p className="text-secondary">
        Registra, consulta y administra los pacientes
        de Veterinaria San Marcos.
      </p>

      <div className="alert alert-info" role="note">
        Los pacientes se comparten entre las páginas mediante
        React Context, pero se pierden al recargar la aplicación.
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
          <h2 className="h4 mb-4">
            {idEditando !== null
              ? 'Editar paciente'
              : 'Registrar paciente'}
          </h2>

          <form onSubmit={guardarPaciente}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="nombre" className="form-label">
                  Nombre de la mascota
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="especie" className="form-label">
                  Especie
                </label>
                <select
                  id="especie"
                  name="especie"
                  className="form-select"
                  value={formulario.especie}
                  onChange={actualizarCampo}
                  required
                >
                  <option value="">Selecciona una especie</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Conejo">Conejo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="raza" className="form-label">
                  Raza
                </label>
                <input
                  id="raza"
                  name="raza"
                  className="form-control"
                  value={formulario.raza}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="edad" className="form-label">
                  Edad en años
                </label>
                <input
                  id="edad"
                  name="edad"
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  className="form-control"
                  value={formulario.edad}
                  onChange={actualizarCampo}
                  required
                />
              </div>

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
                  className="form-control"
                  value={formulario.propietario}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="telefono" className="form-label">
                  Teléfono de contacto
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  className="form-control"
                  placeholder="+56912345678"
                  value={formulario.telefono}
                  onChange={actualizarCampo}
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button type="submit" className="btn btn-primary">
                {idEditando !== null
                  ? 'Guardar cambios'
                  : 'Registrar paciente'}
              </button>

              {idEditando !== null && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h2 className="h4 mb-0">
              Pacientes registrados ({pacientes.length})
            </h2>

            <input
              type="search"
              className="form-control"
              style={{ maxWidth: '320px' }}
              placeholder="Buscar mascota o propietario"
              aria-label="Buscar pacientes"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(evento.target.value)
              }
            />
          </div>

          {pacientesFiltrados.length === 0 ? (
            <p className="text-secondary mb-0">
              {pacientes.length === 0
                ? 'Todavía no hay pacientes registrados.'
                : 'No se encontraron pacientes con esa búsqueda.'}
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Mascota</th>
                    <th>Especie</th>
                    <th>Raza</th>
                    <th>Edad</th>
                    <th>Propietario</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {pacientesFiltrados.map((paciente) => (
                    <tr key={paciente.id}>
                      <td>{paciente.nombre}</td>
                      <td>{paciente.especie}</td>
                      <td>{paciente.raza}</td>
                      <td>{paciente.edad}</td>
                      <td>{paciente.propietario}</td>
                      <td>{paciente.telefono}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              comenzarEdicion(paciente)
                            }
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              confirmarEliminacion(paciente.id)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
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
