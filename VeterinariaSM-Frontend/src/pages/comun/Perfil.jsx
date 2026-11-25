import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext.jsx';
import { ETIQUETA_ROL } from '../../utils/roles.js';
import { formatearRut } from '../../utils/rut.js';
import { formatearFecha, nombreCompleto } from '../../utils/formato.js';

/** Datos de la cuenta con sesión iniciada (vienen del backend: GET /api/auth/me). */
export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Mi perfil | Veterinaria San Marcos';
  }, []);

  function cerrarSesion() {
    if (window.confirm('¿Deseas cerrar la sesión actual?')) {
      logout();
      navigate('/login');
    }
  }

  const filas = [
    ['Nombre completo', nombreCompleto(usuario)],
    ['RUT', usuario.rut ? formatearRut(usuario.rut) : '—'],
    ['Correo electrónico', usuario.email],
    ['Teléfono', usuario.telefono || '—'],
    ['Rol en el sistema', ETIQUETA_ROL[usuario.rol] ?? usuario.rol],
    ['Cuenta creada el', formatearFecha(usuario.fechaCreacion)],
  ];

  return (
    <main className="contenido-main container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-9 col-lg-6">
          <div className="bg-white rounded shadow-sm p-4">
            <h1 className="h3 mb-3">Mi perfil</h1>
            <dl className="row mb-4">
              {filas.map(([etiqueta, valor]) => (
                <div className="row mb-2" key={etiqueta}>
                  <dt className="col-sm-5">{etiqueta}</dt>
                  <dd className="col-sm-7 mb-0">{valor}</dd>
                </div>
              ))}
            </dl>
            <button type="button" className="btn btn-outline-danger" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
