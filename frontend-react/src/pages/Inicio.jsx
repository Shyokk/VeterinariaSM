
import { Link } from 'react-router-dom';

function Inicio() {
  return (
    <section>
      <div className="p-4 p-md-5 bg-white border rounded-3 shadow-sm">
        <span className="badge text-bg-primary mb-3">
          Sistema de gestión veterinaria
        </span>

        <h2 className="display-6 fw-bold">
          Bienvenido a Veterinaria San Marcos
        </h2>

        <p className="lead text-secondary mt-3">
          Una forma más sencilla de organizar la información
          de las mascotas y solicitar atención veterinaria.
        </p>

        <div className="d-flex flex-wrap gap-2 mt-4">
          <Link to="/pacientes" className="btn btn-primary">
            Ver pacientes
          </Link>

          <Link
            to="/solicitar-cita"
            className="btn btn-outline-primary"
          >
            Solicitar una cita
          </Link>
        </div>
      </div>

      <div className="row g-3 mt-2">
        <div className="col-12 col-md-6">
          <article className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="h5 card-title">
                Pacientes
              </h3>

              <p className="card-text text-secondary">
                Consulta las mascotas registradas en esta
                demostración y busca por su nombre.
              </p>

              <Link to="/pacientes">
                Ir al listado
              </Link>
            </div>
          </article>
        </div>

        <div className="col-12 col-md-6">
          <article className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="h5 card-title">
                Solicitudes de cita
              </h3>

              <p className="card-text text-secondary">
                Completa un formulario para simular una
                solicitud de atención veterinaria.
              </p>

              <Link to="/solicitar-cita">
                Crear solicitud
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Inicio;
