import { useState } from 'react';

import { ESPECIES, SEXOS, fechaISOHoy, nombreCompleto } from '../utils/formato.js';

const VACIO = {
  nombre: '',
  especie: '',
  raza: '',
  sexo: '',
  fechaNacimiento: '',
  pesoKg: '',
  duenoId: '',
};

/**
 * Formulario de mascota (crear / editar).
 *  - `duenos`: lista de dueños para que el personal elija el propietario. Si es null
 *    (un dueño registrando su propia mascota) no se muestra el selector.
 */
export default function MascotaForm({ inicial, duenos = null, guardando = false, onGuardar, onCancelar }) {
  const [form, setForm] = useState(() => ({
    ...VACIO,
    ...(inicial
      ? {
          nombre: inicial.nombre ?? '',
          especie: inicial.especie ?? '',
          raza: inicial.raza ?? '',
          sexo: inicial.sexo ?? '',
          fechaNacimiento: inicial.fechaNacimiento ?? '',
          pesoKg: inicial.pesoKg ?? '',
          duenoId: inicial.duenoId ?? '',
        }
      : {}),
  }));
  const [error, setError] = useState('');

  function cambiar(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function enviar(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return setError('El nombre es obligatorio.');
    if (!form.especie) return setError('Selecciona la especie.');
    if (!form.sexo) return setError('Selecciona el sexo.');
    if (duenos && !form.duenoId) return setError('Selecciona el dueño de la mascota.');
    if (form.pesoKg !== '' && Number(form.pesoKg) <= 0) return setError('El peso debe ser mayor a 0.');

    onGuardar({
      nombre: form.nombre.trim(),
      especie: form.especie,
      raza: form.raza.trim() || null,
      sexo: form.sexo,
      fechaNacimiento: form.fechaNacimiento || null,
      pesoKg: form.pesoKg === '' ? null : Number(form.pesoKg),
      duenoId: duenos ? Number(form.duenoId) : null,
    });
  }

  return (
    <form onSubmit={enviar} noValidate>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label htmlFor="m-nombre" className="form-label">Nombre *</label>
          <input id="m-nombre" name="nombre" className="form-control" maxLength={80}
            value={form.nombre} onChange={cambiar} placeholder="Ej: Thor" />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="m-especie" className="form-label">Especie *</label>
          <select id="m-especie" name="especie" className="form-select" value={form.especie} onChange={cambiar}>
            <option value="">-- Selecciona --</option>
            {ESPECIES.map((e) => <option key={e.valor} value={e.valor}>{e.etiqueta}</option>)}
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="m-raza" className="form-label">Raza</label>
          <input id="m-raza" name="raza" className="form-control" maxLength={80}
            value={form.raza} onChange={cambiar} placeholder="Ej: Labrador" />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="m-sexo" className="form-label">Sexo *</label>
          <select id="m-sexo" name="sexo" className="form-select" value={form.sexo} onChange={cambiar}>
            <option value="">-- Selecciona --</option>
            {SEXOS.map((s) => <option key={s.valor} value={s.valor}>{s.etiqueta}</option>)}
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="m-nac" className="form-label">Fecha de nacimiento</label>
          <input id="m-nac" type="date" name="fechaNacimiento" className="form-control"
            max={fechaISOHoy()} value={form.fechaNacimiento} onChange={cambiar} />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="m-peso" className="form-label">Peso (kg)</label>
          <input id="m-peso" type="number" step="0.01" min="0.01" name="pesoKg" className="form-control"
            value={form.pesoKg} onChange={cambiar} placeholder="Ej: 12.5" />
        </div>

        {duenos && (
          <div className="col-12">
            <label htmlFor="m-dueno" className="form-label">Dueño *</label>
            <select id="m-dueno" name="duenoId" className="form-select" value={form.duenoId} onChange={cambiar}>
              <option value="">-- Selecciona al dueño --</option>
              {duenos.map((d) => (
                <option key={d.id} value={d.id}>{nombreCompleto(d)} — {d.email}</option>
              ))}
            </select>
            {duenos.length === 0 && (
              <div className="form-text">
                Aún no hay dueños registrados. El dueño debe crear su cuenta primero (Registro).
              </div>
            )}
          </div>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancelar && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
