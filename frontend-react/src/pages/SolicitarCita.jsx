
import { useState } from 'react';
import { registrarSolicitud } from '../services/citasService';

const formularioInicial = {
  nombreDueno: '',
  correo: '',
  nombreMascota: '',
  especie: '',
  fecha: '',
  motivo: '',
};

function SolicitarCita() {
  const [formulario, setFormulario] = useState({
    ...formularioInicial,
  });
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [datosSolicitud, setDatosSolicitud] = useState(null);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setSolicitudEnviada(false);
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevaSolicitud = registrarSolicitud(formulario);

    setDatosSolicitud(nuevaSolicitud);
    setSolicitudEnviada(true);
  }

  function limpiarFormulario() {
    setFormulario({ ...formularioInicial });
    setDatosSolicitud(null);
    setSolicitudEnviada(false);
  }

  return (
    <section>
      <div className="mb-4">
        <h2>Solicitar una cita</h2>

        <p className="text-secondary">
          Completa los datos para registrar una solicitud de
          atención veterinaria.
        </p>
      </div>

      {solicitudEnviada && datosSolicitud && (
        <div className="alert alert-success" role="status">
          <h3 className="h5">
            Solicitud registrada en la demostración
          </h3>

          <p>
            <strong>Identificador:</strong> {datosSolicitud.id}
          </p>

          <p>
            <strong>Estado:</strong> {datosSolicitud.estado}
          </p>

          <p>
            <strong>Dueño/a:</strong> {datosSolicitud.nombreDueno}
          </p>

          <p>
            <strong>Mascota:</strong> {datosSolicitud.nombreMascota}
          </p>

          <p>
            <strong>Fecha solicitada:</strong> {datosSolicitud.fecha}
          </p>

          <p className="mb-0">
            Puedes consultar el estado desde Solicitudes de citas
            o desde Mis citas. Los datos se guardan en este
            navegador, no en un servidor.
          </p>
        </div>
      )}

      <form
        aria-label="Formulario de solicitud de cita"
        className="card shadow-sm"
        onSubmit={manejarEnvio}
      >
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="nombreDueno" className="form-label">
                Nombre del dueño/a
              </label>

              <input
                id="nombreDueno"
                name="nombreDueno"
                type="text"
                className="form-control"
                autoComplete="name"
                value={formulario.nombreDueno}
                onChange={manejarCambio}
                required
                minLength={3}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>

              <input
                id="correo"
                name="correo"
                type="email"
                className="form-control"
                autoComplete="email"
                value={formulario.correo}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="nombreMascota" className="form-label">
                Nombre de la mascota
              </label>

              <input
                id="nombreMascota"
                name="nombreMascota"
                type="text"
                className="form-control"
                value={formulario.nombreMascota}
                onChange={manejarCambio}
                required
                minLength={2}
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
                onChange={manejarCambio}
                required
              >
                <option value="">Selecciona una especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
                <option value="Ave">Ave</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="fecha" className="form-label">
                Fecha solicitada
              </label>

              <input
                id="fecha"
                name="fecha"
                type="date"
                className="form-control"
                value={formulario.fecha}
                onChange={manejarCambio}
                required
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="col-12">
              <label htmlFor="motivo" className="form-label">
                Motivo de consulta
              </label>

              <textarea
                id="motivo"
                name="motivo"
                className="form-control"
                rows="4"
                placeholder="Ejemplo: control general, vacunación..."
                value={formulario.motivo}
                onChange={manejarCambio}
                required
                minLength={5}
              />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button type="submit" className="btn btn-primary">
              Enviar solicitud
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={limpiarFormulario}
            >
              Limpiar formulario
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default SolicitarCita;
