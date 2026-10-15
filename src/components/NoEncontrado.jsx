
import { Link } from 'react-router-dom';

function NoEncontrado() {
  return (
    <main className="contenido-main container py-5">
      <section className="text-center bg-white rounded shadow-sm p-4 p-md-5">
        <p className="display-1 fw-bold text-primary mb-2">
          404
        </p>

        <h1 className="h3 mb-3">
          Página no encontrada
        </h1>

        <p className="text-secondary mb-4">
          Lo sentimos, la página que buscas no existe
          o la dirección ingresada es incorrecta.
        </p>

        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}

export default NoEncontrado;
