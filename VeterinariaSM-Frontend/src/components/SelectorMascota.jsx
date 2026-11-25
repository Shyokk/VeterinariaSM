import { useMemo, useState } from 'react';

import { mascotasApi } from '../api/index.js';
import useCargar from '../hooks/useCargar.js';
import useDuenos from '../hooks/useDuenos.js';
import { etiquetaEspecie } from '../utils/formato.js';
import Cargando from './Cargando.jsx';

/**
 * Lista desplegable de mascotas con buscador por nombre.
 * El dueño ve solo sus mascotas; el personal ve todas (con el nombre del dueño).
 */
export default function SelectorMascota({ valor, onCambio, id = 'selector-mascota', requerido = true }) {
  const [busqueda, setBusqueda] = useState('');
  const { datos, cargando, error } = useCargar(() => mascotasApi.listar(), []);
  const { nombreDueno, duenos } = useDuenos();

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return (datos ?? []).filter((m) => !texto || m.nombre.toLowerCase().includes(texto));
  }, [datos, busqueda]);

  if (cargando) return <Cargando texto="Cargando mascotas..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <label htmlFor={id} className="form-label fw-semibold">
        Mascota {requerido && <span className="text-danger">*</span>}
      </label>
      <input
        type="search"
        className="form-control mb-2"
        placeholder="Buscar por nombre..."
        aria-label="Buscar mascota por nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <select
        id={id}
        className="form-select"
        value={valor ?? ''}
        onChange={(e) => onCambio(e.target.value ? Number(e.target.value) : null)}
        required={requerido}
      >
        <option value="">-- Selecciona una mascota --</option>
        {filtradas.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre} ({etiquetaEspecie(m.especie)})
            {duenos.length > 0 ? ` — ${nombreDueno(m.duenoId)}` : ''}
          </option>
        ))}
      </select>
      {(datos ?? []).length === 0 && (
        <div className="form-text">No hay mascotas registradas todavía.</div>
      )}
    </div>
  );
}
