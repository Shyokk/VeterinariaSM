import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import { citasApi, mascotasApi } from '../../api/index.js';
import { mensajeDeError } from '../../api/http.js';
import Cargando from '../../components/Cargando.jsx';
import Mensaje from '../../components/Mensaje.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useCargar from '../../hooks/useCargar.js';
import useDuenos from '../../hooks/useDuenos.js';
import { CLASE_ESTADO, ETIQUETA_ESTADO, accionesDisponibles } from '../../utils/agenda.js';
import { etiquetaEspecie, fechaISOHoy, formatearFecha } from '../../utils/formato.js';
import { ROLES } from '../../utils/roles.js';

/** Selector de hora que consulta los cupos libres de la fecha elegida (GET /api/citas/disponibilidad). */
function SelectorHora({ fecha, valor, onCambio, id }) {
  const { datos, cargando, error } = useCargar(() => citasApi.disponibilidad(fecha), [fecha], {
    habilitado: Boolean(fecha),
  });

  if (!fecha) return <select id={id} className="form-select" disabled><option>Elige primero la fecha</option></select>;
  if (cargando) return <Cargando texto="Consultando horarios..." />;
  if (error) return <div className="text-danger small">{error}</div>;

  return (
    <select id={id} className="form-select" value={valor} onChange={(e) => onCambio(e.target.value)}>
      <option value="">-- Selecciona la hora --</option>
      {(datos?.bloques ?? []).map((b) => (
        <option key={b.hora} value={b.hora} disabled={b.disponibles === 0}>
          {b.hora} {b.disponibles === 0 ? '(sin cupos)' : `(${b.disponibles} cupos)`}
        </option>
      ))}
    </select>
  );
}

/** Ventana para que recepción proponga otro horario al dueño. */
function ModalProponer({ cita, onCerrar, onConfirmar }) {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function enviar(e) {
    e.preventDefault();
    if (!fecha || !hora) return setError('Indica la fecha y la hora propuestas.');
    onConfirmar(cita.id, { fecha, hora, mensaje: mensaje.trim() || null });
  }

  return (
    <Modal show onHide={onCerrar} centered>
      <form onSubmit={enviar}>
        <Modal.Header closeButton><Modal.Title>Proponer otro horario</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="text-secondary">
            Cita actual de <strong>{cita.mascotaNombre}</strong>: {formatearFecha(cita.fecha)} a las {cita.hora}.
          </p>
          <Mensaje tipo="danger">{error}</Mensaje>
          <div className="mb-3">
            <label htmlFor="p-fecha" className="form-label">Nueva fecha</label>
            <input id="p-fecha" type="date" className="form-control" min={fechaISOHoy()} value={fecha}
              onChange={(e) => { setFecha(e.target.value); setHora(''); setError(''); }} />
          </div>
          <div className="mb-3">
            <label htmlFor="p-hora" className="form-label">Nueva hora</label>
            <SelectorHora id="p-hora" fecha={fecha} valor={hora} onCambio={(h) => { setHora(h); setError(''); }} />
          </div>
          <div className="mb-3">
            <label htmlFor="p-msg" className="form-label">Mensaje para el dueño (opcional)</label>
            <textarea id="p-msg" className="form-control" rows={2} maxLength={500} value={mensaje}
              onChange={(e) => setMensaje(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Enviar propuesta</button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

/**
 * Flujo de citas (el "pedido" del proyecto):
 *  Dueño: solicita una cita -> ve su estado -> acepta el horario propuesto o cancela.
 *  Recepción/Admin: confirma, propone otro horario, marca atendida / no asistió, cancela.
 *  Veterinario: ve la agenda y marca citas como atendidas.
 */
export default function Agendar() {
  const { rol } = useAuth();
  const [params] = useSearchParams();
  const esDueno = rol === ROLES.DUENO;
  const gestor = rol === ROLES.ADMIN || rol === ROLES.RECEPCION;
  const puedeSolicitar = esDueno || gestor;

  const { duenos, nombreDueno } = useDuenos();
  const mascotas = useCargar(() => mascotasApi.listar(), [], { habilitado: puedeSolicitar });
  const [filtroEstado, setFiltroEstado] = useState('');
  const citas = useCargar(() => citasApi.listar({ estado: filtroEstado || undefined }), [filtroEstado]);

  const [form, setForm] = useState({
    mascotaId: params.get('mascota') ?? '',
    fecha: '',
    hora: '',
    motivo: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: 'success', texto: '' });
  const [proponiendo, setProponiendo] = useState(null);

  useEffect(() => {
    document.title = 'Citas | Veterinaria San Marcos';
  }, []);

  function cambiar(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === 'fecha' ? { hora: '' } : {}) }));
    setAviso((a) => ({ ...a, texto: '' }));
  }

  async function solicitar(e) {
    e.preventDefault();
    if (!form.mascotaId || !form.fecha || !form.hora || !form.motivo.trim()) {
      return setAviso({ tipo: 'danger', texto: 'Completa mascota, fecha, hora y motivo.' });
    }
    setEnviando(true);
    try {
      await citasApi.solicitar({
        mascotaId: Number(form.mascotaId),
        fecha: form.fecha,
        hora: form.hora,
        motivo: form.motivo.trim(),
      });
      setAviso({
        tipo: 'success',
        texto: esDueno
          ? 'Solicitud enviada. Quedará PENDIENTE hasta que la recepción la confirme o te proponga otro horario.'
          : 'Cita agendada y confirmada.',
      });
      setForm({ mascotaId: '', fecha: '', hora: '', motivo: '' });
      citas.recargar();
    } catch (err) {
      setAviso({ tipo: 'danger', texto: mensajeDeError(err) });
    } finally {
      setEnviando(false);
    }
  }

  /** Ejecuta una acción sobre una cita, informa el resultado y refresca la lista. */
  async function ejecutar(accion, textoOk) {
    try {
      await accion();
      setAviso({ tipo: 'success', texto: textoOk });
      setProponiendo(null);
    } catch (err) {
      setAviso({ tipo: 'danger', texto: mensajeDeError(err) });
    } finally {
      citas.recargar();
    }
  }

  function cancelar(c) {
    const motivo = window.prompt(`¿Cancelar la cita de ${c.mascotaNombre}?\nMotivo (opcional):`, '');
    if (motivo === null) return;
    ejecutar(() => citasApi.cancelar(c.id, motivo.trim()), 'La cita fue cancelada.');
  }

  const ACCIONES = {
    confirmar: { texto: 'Confirmar', clase: 'btn-success', ejecutar: (c) => ejecutar(() => citasApi.confirmar(c.id), 'Cita confirmada.') },
    proponer: { texto: 'Proponer horario', clase: 'btn-outline-primary', ejecutar: (c) => setProponiendo(c) },
    aceptar: { texto: 'Aceptar nuevo horario', clase: 'btn-success', ejecutar: (c) => ejecutar(() => citasApi.aceptarHorario(c.id), 'Horario aceptado: la cita quedó confirmada.') },
    atender: { texto: 'Marcar atendida', clase: 'btn-outline-success', ejecutar: (c) => ejecutar(() => citasApi.atender(c.id), 'Cita marcada como atendida.') },
    noAsistio: { texto: 'No asistió', clase: 'btn-outline-warning', ejecutar: (c) => window.confirm(`¿Marcar que ${c.mascotaNombre} no asistió a su cita?`) && ejecutar(() => citasApi.noAsistio(c.id), 'Inasistencia registrada.') },
    cancelar: { texto: 'Cancelar', clase: 'btn-outline-danger', ejecutar: cancelar },
  };

  const lista = citas.datos ?? [];

  return (
    <main className="contenido-main container py-4">
      <h1 className="h3 mb-3">{esDueno ? 'Mis citas' : 'Agenda de citas'}</h1>

      <Mensaje tipo={aviso.tipo} alCerrar={() => setAviso({ ...aviso, texto: '' })}>{aviso.texto}</Mensaje>

      {puedeSolicitar && (
        <section className="bg-white rounded shadow-sm p-3 p-md-4 mb-4">
          <h2 className="h5">{esDueno ? 'Solicitar una cita' : 'Agendar una cita'}</h2>
          <form onSubmit={solicitar} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="c-mascota" className="form-label">Mascota *</label>
                <select id="c-mascota" name="mascotaId" className="form-select" value={form.mascotaId} onChange={cambiar}>
                  <option value="">-- Selecciona --</option>
                  {(mascotas.datos ?? []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} ({etiquetaEspecie(m.especie)}){duenos.length ? ` — ${nombreDueno(m.duenoId)}` : ''}
                    </option>
                  ))}
                </select>
                {!mascotas.cargando && (mascotas.datos ?? []).length === 0 && (
                  <div className="form-text">
                    {esDueno ? 'Primero registra a tu mascota en «Mis mascotas».' : 'No hay mascotas registradas.'}
                  </div>
                )}
              </div>
              <div className="col-6 col-md-3">
                <label htmlFor="c-fecha" className="form-label">Fecha *</label>
                <input id="c-fecha" type="date" name="fecha" className="form-control" min={fechaISOHoy()}
                  value={form.fecha} onChange={cambiar} />
              </div>
              <div className="col-6 col-md-3">
                <label htmlFor="c-hora" className="form-label">Hora *</label>
                <SelectorHora id="c-hora" fecha={form.fecha} valor={form.hora}
                  onCambio={(hora) => setForm((f) => ({ ...f, hora }))} />
              </div>
              <div className="col-12">
                <label htmlFor="c-motivo" className="form-label">Motivo *</label>
                <input id="c-motivo" name="motivo" className="form-control" maxLength={255} value={form.motivo}
                  onChange={cambiar} placeholder="Ej: Vacunación anual, control, malestar..." />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3" disabled={enviando}>
              {enviando ? 'Enviando...' : esDueno ? 'Solicitar cita' : 'Agendar'}
            </button>
            <p className="form-text mb-0 mt-2">Atendemos de lunes a sábado, de 09:00 a 18:00.</p>
          </form>
        </section>
      )}

      <section>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
          <h2 className="h5 mb-0">{esDueno ? 'Estado de mis citas' : 'Citas registradas'}</h2>
          <select className="form-select w-auto" aria-label="Filtrar por estado" value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(ETIQUETA_ESTADO).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>{etiqueta}</option>
            ))}
          </select>
        </div>

        <Mensaje tipo="danger">{citas.error}</Mensaje>

        {citas.cargando ? (
          <Cargando texto="Cargando citas..." />
        ) : lista.length === 0 ? (
          <p className="text-secondary">No hay citas para mostrar.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle bg-white">
              <thead>
                <tr>
                  <th>Fecha</th><th>Hora</th><th>Mascota</th>
                  {!esDueno && <th>Dueño</th>}
                  <th>Motivo</th><th>Estado</th><th />
                </tr>
              </thead>
              <tbody>
                {lista.map((c) => {
                  const acciones = accionesDisponibles(c, rol);
                  return (
                    <tr key={c.id}>
                      <td>{formatearFecha(c.fecha)}</td>
                      <td>{c.hora}</td>
                      <td className="fw-semibold">{c.mascotaNombre}</td>
                      {!esDueno && <td>{nombreDueno(c.duenoId)}</td>}
                      <td>{c.motivo}</td>
                      <td>
                        <span className={`badge ${CLASE_ESTADO[c.estado]}`}>{ETIQUETA_ESTADO[c.estado]}</span>
                        {c.estado === 'HORARIO_PROPUESTO' && (
                          <div className="small mt-1">
                            Propuesta: <strong>{formatearFecha(c.fechaPropuesta)} {c.horaPropuesta}</strong>
                            {c.mensaje && <><br />«{c.mensaje}»</>}
                          </div>
                        )}
                        {c.estado === 'CANCELADA' && c.mensaje && (
                          <div className="small text-secondary mt-1">Motivo: {c.mensaje}</div>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex flex-wrap gap-1 justify-content-end">
                          {acciones.map((a) => (
                            <button key={a} type="button" className={`btn btn-sm ${ACCIONES[a].clase}`}
                              onClick={() => ACCIONES[a].ejecutar(c)}>
                              {ACCIONES[a].texto}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {proponiendo && (
        <ModalProponer
          cita={proponiendo}
          onCerrar={() => setProponiendo(null)}
          onConfirmar={(id, datos) => ejecutar(() => citasApi.proponerHorario(id, datos), 'Propuesta enviada al dueño.')}
        />
      )}
    </main>
  );
}
