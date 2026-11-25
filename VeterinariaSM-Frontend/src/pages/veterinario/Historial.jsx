import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import FichaClinica from '../../components/FichaClinica.jsx';
import SelectorMascota from '../../components/SelectorMascota.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES, esClinico } from '../../utils/roles.js';

/** Historial clínico de cualquier paciente (personal). El id viaja en la URL: /historial?mascota=3 */
export default function Historial() {
  const { rol } = useAuth();
  const [params, setParams] = useSearchParams();
  const mascotaId = params.get('mascota') ? Number(params.get('mascota')) : null;

  useEffect(() => {
    document.title = 'Historial clínico | Veterinaria San Marcos';
  }, []);

  return (
    <main className="contenido-main container py-4">
      <h1 className="h3 mb-3">Historial clínico</h1>

      <div className="bg-white rounded shadow-sm p-3 mb-4">
        <SelectorMascota
          id="historial-mascota"
          valor={mascotaId}
          onCambio={(id) => setParams(id ? { mascota: id } : {})}
          requerido={false}
        />
      </div>

      {mascotaId ? (
        <FichaClinica
          key={mascotaId}
          mascotaId={mascotaId}
          puedeEscribir={esClinico(rol)}
          puedeEliminar={rol === ROLES.ADMIN}
        />
      ) : (
        <p className="text-secondary">Selecciona una mascota para ver su ficha clínica.</p>
      )}
    </main>
  );
}
