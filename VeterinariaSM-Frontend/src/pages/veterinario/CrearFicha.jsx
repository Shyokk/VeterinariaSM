import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { mascotasApi } from '../../api/index.js';
import { mensajeDeError } from '../../api/http.js';
import Cargando from '../../components/Cargando.jsx';
import MascotaForm from '../../components/MascotaForm.jsx';
import Mensaje from '../../components/Mensaje.jsx';
import useDuenos from '../../hooks/useDuenos.js';

/** Crear la ficha (registro) de un paciente nuevo y asignarlo a su dueño. */
export default function CrearFicha() {
  const navigate = useNavigate();
  const { duenos, cargando, error: errorDuenos } = useDuenos();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Crear ficha | Veterinaria San Marcos';
  }, []);

  async function guardar(datos) {
    setGuardando(true);
    setError('');
    try {
      const creada = await mascotasApi.crear(datos);
      navigate(`/historial?mascota=${creada.id}`);
    } catch (e) {
      setError(mensajeDeError(e));
      setGuardando(false);
    }
  }

  return (
    <main className="contenido-main container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="bg-white rounded shadow-sm p-3 p-md-4">
            <h1 className="h3">Crear ficha de paciente</h1>
            <p className="text-secondary">Registra una mascota nueva y asígnala a su dueño.</p>
            <Mensaje tipo="danger">{error || errorDuenos}</Mensaje>
            {cargando ? (
              <Cargando texto="Cargando dueños..." />
            ) : (
              <MascotaForm duenos={duenos} guardando={guardando} onGuardar={guardar} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
