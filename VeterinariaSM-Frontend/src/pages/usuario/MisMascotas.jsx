import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { clinicaApi, mascotasApi } from '../../api/index.js';
import { mensajeDeError } from '../../api/http.js';
import Cargando from '../../components/Cargando.jsx';
import FichaClinica from '../../components/FichaClinica.jsx';
import MascotaForm from '../../components/MascotaForm.jsx';
import Mensaje from '../../components/Mensaje.jsx';
import useCargar from '../../hooks/useCargar.js';
import { calcularEdad, etiquetaEspecie, formatearFecha } from '../../utils/formato.js';

/**
 * Vista del dueño: sus mascotas, el historial clínico (solo lectura) y los avisos de vacunas por vencer.
 * El backend solo entrega las mascotas del dueño autenticado.
 */
export default function MisMascotas() {
  const mascotas = useCargar(() => mascotasApi.listar(), []);
  const avisos = useCargar(() => clinicaApi.vacunasPorVencer(30), []);

  const [seleccionada, setSeleccionada] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Mis mascotas | Veterinaria San Marcos';
  }, []);

  async function registrar(datos) {
    setGuardando(true);
    setError('');
    try {
      const creada = await mascotasApi.crear(datos);
      setMostrarForm(false);
      setSeleccionada(creada.id);
      mascotas.recargar();
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setGuardando(false);
    }
  }

  const lista = mascotas.datos ?? [];

  return (
    <main className="contenido-main container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Mis mascotas</h1>
        <div className="d-flex gap-2">
          <Link to="/agendar" className="btn btn-outline-primary">Solicitar cita</Link>
          <button type="button" className="btn btn-primary" onClick={() => setMostrarForm(true)}>
            + Registrar mascota
          </button>
        </div>
      </div>

      <Mensaje tipo="danger">{error || mascotas.error}</Mensaje>

      {(avisos.datos ?? []).length > 0 && (
        <div className="alert alert-warning" role="alert">
          <strong>Vacunas por vencer (próximos 30 días):</strong>
          <ul className="mb-0 mt-1">
            {avisos.datos.map((v) => (
              <li key={v.id}>
                {v.mascotaNombre}: {v.nombre} — vence el {formatearFecha(v.fechaProximaDosis)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {mascotas.cargando ? (
        <Cargando texto="Cargando tus mascotas..." />
      ) : lista.length === 0 ? (
        <p className="text-secondary">
          Aún no tienes mascotas registradas. Usa «Registrar mascota» para agregar la primera.
        </p>
      ) : (
        <div className="row g-3 mb-4">
          {lista.map((m) => (
            <div key={m.id} className="col-12 col-sm-6 col-lg-4">
              <button
                type="button"
                className={`card w-100 text-start h-100 ${seleccionada === m.id ? 'border-primary border-2' : ''}`}
                onClick={() => setSeleccionada(m.id)}
              >
                <div className="card-body">
                  <h2 className="h5 card-title mb-1">{m.nombre}</h2>
                  <p className="card-text text-secondary mb-0">
                    {etiquetaEspecie(m.especie)}{m.raza ? ` · ${m.raza}` : ''} · {calcularEdad(m.fechaNacimiento)}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {seleccionada && <FichaClinica key={seleccionada} mascotaId={seleccionada} />}

      <Modal show={mostrarForm} onHide={() => setMostrarForm(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Registrar mascota</Modal.Title></Modal.Header>
        <Modal.Body>
          <MascotaForm guardando={guardando} onGuardar={registrar} onCancelar={() => setMostrarForm(false)} />
        </Modal.Body>
      </Modal>
    </main>
  );
}
