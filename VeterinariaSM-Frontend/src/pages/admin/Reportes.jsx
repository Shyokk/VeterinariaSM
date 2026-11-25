import { useEffect, useState } from 'react';

import { citasApi, reportesApi } from '../../api/index.js';
import Cargando from '../../components/Cargando.jsx';
import Mensaje from '../../components/Mensaje.jsx';
import useCargar from '../../hooks/useCargar.js';
import { ETIQUETA_ESTADO } from '../../utils/agenda.js';
import { formatearFecha } from '../../utils/formato.js';

function Tarjeta({ titulo, valor, detalle }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="card h-100">
        <div className="card-body">
          <p className="text-secondary mb-1 small">{titulo}</p>
          <p className="h2 mb-0">{valor ?? '—'}</p>
          {detalle && <small className="text-secondary">{detalle}</small>}
        </div>
      </div>
    </div>
  );
}

/** Reportes por período: pacientes nuevos, atenciones, citas por estado e inasistencia. */
export default function Reportes() {
  const [filtro, setFiltro] = useState({ desde: '', hasta: '' });
  const [aplicado, setAplicado] = useState({ desde: '', hasta: '' });
  const [errorFiltro, setErrorFiltro] = useState('');

  const params = { desde: aplicado.desde || undefined, hasta: aplicado.hasta || undefined };
  const pacientes = useCargar(() => reportesApi.resumen(params), [aplicado]);
  const citas = useCargar(() => citasApi.reporte(params), [aplicado]);

  useEffect(() => {
    document.title = 'Reportes | Veterinaria San Marcos';
  }, []);

  function aplicar(e) {
    e.preventDefault();
    if (filtro.desde && filtro.hasta && filtro.desde > filtro.hasta) {
      return setErrorFiltro('La fecha "desde" no puede ser posterior a "hasta".');
    }
    setErrorFiltro('');
    setAplicado(filtro);
  }

  const p = pacientes.datos;
  const c = citas.datos;

  return (
    <main className="contenido-main container py-4">
      <h1 className="h3 mb-3">Reportes</h1>

      <form onSubmit={aplicar} className="bg-white rounded shadow-sm p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-6 col-md-3">
            <label htmlFor="rep-desde" className="form-label">Desde</label>
            <input id="rep-desde" type="date" className="form-control" value={filtro.desde}
              onChange={(e) => setFiltro({ ...filtro, desde: e.target.value })} />
          </div>
          <div className="col-6 col-md-3">
            <label htmlFor="rep-hasta" className="form-label">Hasta</label>
            <input id="rep-hasta" type="date" className="form-control" value={filtro.hasta}
              onChange={(e) => setFiltro({ ...filtro, hasta: e.target.value })} />
          </div>
          <div className="col-12 col-md-3">
            <button type="submit" className="btn btn-primary w-100">Generar reporte</button>
          </div>
        </div>
        <div className="form-text">Sin fechas: pacientes y atenciones de los últimos 6 meses; citas de los últimos 30 días.</div>
        <Mensaje tipo="danger">{errorFiltro}</Mensaje>
      </form>

      <Mensaje tipo="danger">{pacientes.error}</Mensaje>
      <Mensaje tipo="danger">{citas.error}</Mensaje>

      <div className="row g-3 mb-4">
        <Tarjeta titulo="Pacientes nuevos" valor={p?.totalPacientesNuevos} />
        <Tarjeta titulo="Atenciones registradas" valor={p?.totalAtenciones} />
        <Tarjeta titulo="Citas en el período" valor={c?.total} />
        <Tarjeta titulo="Tasa de inasistencia" valor={c ? `${c.tasaInasistenciaPorcentaje}%` : null}
          detalle="No asistió / (atendidas + no asistió)" />
      </div>

      <div className="row g-4">
        <section className="col-12 col-lg-6">
          <h2 className="h5">Pacientes y atenciones por mes</h2>
          {pacientes.cargando ? <Cargando /> : p && (
            <div className="table-responsive">
              <table className="table table-sm table-striped bg-white">
                <thead><tr><th>Mes</th><th className="text-end">Pacientes nuevos</th><th className="text-end">Atenciones</th></tr></thead>
                <tbody>
                  {p.porMes.map((m) => (
                    <tr key={m.mes}><td>{m.mes}</td><td className="text-end">{m.pacientesNuevos}</td><td className="text-end">{m.atenciones}</td></tr>
                  ))}
                </tbody>
              </table>
              <small className="text-secondary">Período: {formatearFecha(p.desde)} al {formatearFecha(p.hasta)}</small>
            </div>
          )}
        </section>

        <section className="col-12 col-lg-6">
          <h2 className="h5">Citas por estado</h2>
          {citas.cargando ? <Cargando /> : c && (
            <div className="bg-white rounded border p-3">
              {Object.entries(c.porEstado).map(([estado, n]) => (
                <div key={estado} className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span>{ETIQUETA_ESTADO[estado]}</span><strong>{n}</strong>
                  </div>
                  <div className="progress" role="progressbar" aria-label={ETIQUETA_ESTADO[estado]} aria-valuenow={n} aria-valuemin="0" aria-valuemax={c.total}>
                    <div className="progress-bar" style={{ width: `${c.total ? (n * 100) / c.total : 0}%` }} />
                  </div>
                </div>
              ))}
              <small className="text-secondary">Período: {formatearFecha(c.desde)} al {formatearFecha(c.hasta)}</small>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
