import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import Cargando from './Cargando.jsx';
import SinPermiso from './SinPermiso.jsx';

/**
 * Protege una vista en el frontend:
 *  - Sin sesión            -> redirige a /login (y vuelve aquí después de iniciar sesión).
 *  - Con sesión, rol no permitido -> muestra la pantalla 403.
 *  - Mientras se valida la sesión guardada -> muestra "Cargando" (evita parpadeos al recargar).
 * Importante: esto solo mejora la experiencia; la seguridad real la aplica el backend (JWT + roles).
 */
export default function RutaProtegida({ roles, children }) {
  const { usuario, verificando } = useAuth();
  const ubicacion = useLocation();

  if (verificando) {
    return (
      <main className="contenido-main container py-5">
        <Cargando texto="Verificando sesión..." />
      </main>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <SinPermiso />;
  }

  return children;
}
