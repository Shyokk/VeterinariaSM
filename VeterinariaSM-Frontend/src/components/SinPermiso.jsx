import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { ETIQUETA_ROL } from '../utils/roles.js';

/** Pantalla 403: el usuario inició sesión pero su rol no puede entrar a esta vista. */
export default function SinPermiso() {
  const { rol } = useAuth();

  return (
    <main className="contenido-main container py-5">
      <section className="text-center bg-white rounded shadow-sm p-4 p-md-5">
        <p className="display-1 fw-bold text-danger mb-2">403</p>
        <h1 className="h3 mb-3">Acceso restringido</h1>
        <p className="text-secondary mb-4">
          Tu cuenta ({ETIQUETA_ROL[rol] ?? 'sin rol'}) no tiene permisos para ver esta sección.
        </p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
