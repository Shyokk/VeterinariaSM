import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { mascotasApi } from '../../api/index.js';
import { mensajeDeError } from '../../api/http.js';
import Cargando from '../../components/Cargando.jsx';
import MascotaForm from '../../components/MascotaForm.jsx';
import Mensaje from '../../components/Mensaje.jsx';
import useCargar from '../../hooks/useCargar.js';
import useDuenos from '../../hooks/useDuenos.js';
import { calcularEdad, etiquetaEspecie, etiquetaSexo } from '../../utils/formato.js';

/** Listado de pacientes (mascotas) para el personal: buscar, editar y desactivar. */
export default function Pacientes() {
  const { datos, cargando, error, recargar } = useCargar(() => mascotasApi.listar(), []);
  const { duenos, nombreDueno } = useDuenos();

  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: 'success', texto: '' });

  useEffect(() => {
    document.title = 'Pacientes | Veterinaria San Marcos';
  }, []);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return (datos ?? []).filter(
      (m) =>
        !texto ||
        m.nombre.toLowerCase().includes(texto) ||
        etiquetaEspecie(m.especie).toLowerCase().includes(texto) ||
        nombreDueno(m.duenoId).toLowerCase().includes(texto)
    );
  }, [datos, busqueda, duenos]); // eslint-disable-line react-hooks/exhaustive-deps

  async function guardarEdicion(cambios) {
    setGuardando(true);
    try {
      await mascotasApi.actualizar(editando.id, cambios);
      setEditando(null);
      setAviso({ tipo: 'success', texto: 'Paciente actualizado correctamente.' });
      recargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: mensajeDeError(e) });
    } finally {
      setGuardando(false);
    }
  }

  async function desactivar(m) {
    if (!window.confirm(`¿Desactivar a ${m.nombre}? Su ficha clínica se conserva, pero dejará de aparecer en el listado.`)) return;
    try {
      await mascotasApi.desactivar(m.id);
      setAviso({ tipo: 'success', texto: `${m.nombre} fue desactivado.` });
      recargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: mensajeDeError(e) });
    }
  }

  return (
    <main className="contenido-main container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Pacientes</h1>
        <Link to="/crear-ficha" className="btn btn-primary">+ Nuevo paciente</Link>
      </div>

      <Mensaje tipo={aviso.tipo} alCerrar={() => setAviso({ ...aviso, texto: '' })}>{aviso.texto}</Mensaje>
      <Mensaje tipo="danger">{error}</Mensaje>

      <input type="search" className="form-control mb-3" placeholder="Buscar por nombre, especie o dueño..."
        aria-label="Buscar pacientes" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {cargando ? (
        <Cargando texto="Cargando pacientes..." />
      ) : filtrados.length === 0 ? (
        <p className="text-secondary">No hay pacientes que coincidan.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle bg-white">
            <thead>
              <tr>
                <th>Nombre</th><th>Especie</th><th>Raza</th><th>Sexo</th><th>Edad</th><th>Dueño</th><th />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((m) => (
                <tr key={m.id}>
                  <td className="fw-semibold">{m.nombre}</td>
                  <td>{etiquetaEspecie(m.especie)}</td>
                  <td>{m.raza || '—'}</td>
                  <td>{etiquetaSexo(m.sexo)}</td>
                  <td>{calcularEdad(m.fechaNacimiento)}</td>
                  <td>{nombreDueno(m.duenoId)}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/historial?mascota=${m.id}`} className="btn btn-sm btn-outline-primary me-1">Ficha</Link>
                    <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => setEditando(m)}>Editar</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => desactivar(m)}>Desactivar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={Boolean(editando)} onHide={() => setEditando(null)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Editar paciente</Modal.Title></Modal.Header>
        <Modal.Body>
          {editando && (
            <MascotaForm inicial={editando} duenos={duenos} guardando={guardando}
              onGuardar={guardarEdicion} onCancelar={() => setEditando(null)} />
          )}
        </Modal.Body>
      </Modal>
    </main>
  );
}
