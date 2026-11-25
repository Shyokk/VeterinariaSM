import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { clinicaApi } from '../api/index.js';
import { mensajeDeError } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fechaISOHoy, nombreCompleto } from '../utils/formato.js';
import SelectorMascota from './SelectorMascota.jsx';

/**
 * Formulario genérico para registrar algo en la ficha clínica (vacuna, receta, diagnóstico o examen).
 * Cada pantalla solo define sus campos; el resto (selector de mascota, validación, envío a la API,
 * mensajes) es común.
 *
 * campos: [{ nombre, etiqueta, tipo: 'text'|'textarea'|'date'|'select', requerido, max, soloPasado, inicial, ayuda }]
 */
export default function FormularioClinico({ titulo, descripcion, tipo, campos, validar, adaptar }) {
  const { usuario } = useAuth();
  const [params] = useSearchParams();
  const mascotaInicial = params.get('mascota') ? Number(params.get('mascota')) : null;

  const valoresIniciales = () =>
    Object.fromEntries(
      campos.map((c) => {
        let valor = c.inicial ?? '';
        if (valor === 'hoy') valor = fechaISOHoy();
        if (valor === 'veterinario') valor = usuario?.rol === 'VETERINARIO' ? nombreCompleto(usuario) : '';
        return [c.nombre, valor];
      })
    );

  const [mascotaId, setMascotaId] = useState(mascotaInicial);
  const [form, setForm] = useState(valoresIniciales);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cambiar(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setExito('');
  }

  async function enviar(e) {
    e.preventDefault();
    if (!mascotaId) return setError('Selecciona la mascota.');
    const faltante = campos.find((c) => c.requerido && !String(form[c.nombre]).trim());
    if (faltante) return setError(`El campo "${faltante.etiqueta}" es obligatorio.`);
    const mensajeValidacion = validar?.(form);
    if (mensajeValidacion) return setError(mensajeValidacion);

    // Campos vacíos se envían como null para que el backend los trate como "no informados"
    const cuerpo = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === 'string' && v.trim() === '' ? null : v])
    );

    setGuardando(true);
    try {
      await clinicaApi.crear(tipo, mascotaId, adaptar ? adaptar(cuerpo) : cuerpo);
      setExito('Registro guardado correctamente en la ficha clínica.');
      setForm(valoresIniciales());
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="contenido-main container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="bg-white rounded shadow-sm p-3 p-md-4">
            <h1 className="h3">{titulo}</h1>
            <p className="text-secondary">{descripcion}</p>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {exito && (
              <div className="alert alert-success" role="status">
                {exito}{' '}
                {mascotaId && <Link to={`/historial?mascota=${mascotaId}`}>Ver ficha clínica</Link>}
              </div>
            )}

            <form onSubmit={enviar} noValidate>
              <div className="mb-3">
                <SelectorMascota valor={mascotaId} onCambio={setMascotaId} />
              </div>

              <div className="row g-3">
                {campos.map((c) => (
                  <div key={c.nombre} className={c.tipo === 'textarea' ? 'col-12' : 'col-12 col-md-6'}>
                    <label htmlFor={`f-${c.nombre}`} className="form-label">
                      {c.etiqueta} {c.requerido && <span className="text-danger">*</span>}
                    </label>
                    {c.tipo === 'textarea' ? (
                      <textarea id={`f-${c.nombre}`} name={c.nombre} rows={3} className="form-control"
                        maxLength={c.max} value={form[c.nombre]} onChange={cambiar} />
                    ) : (
                      <input id={`f-${c.nombre}`} name={c.nombre} type={c.tipo ?? 'text'} className="form-control"
                        maxLength={c.max} max={c.soloPasado ? fechaISOHoy() : undefined}
                        value={form[c.nombre]} onChange={cambiar} />
                    )}
                    {c.ayuda && <div className="form-text">{c.ayuda}</div>}
                  </div>
                ))}
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar registro'}
                </button>
                <Link to="/historial" className="btn btn-outline-secondary">Ver historial</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
