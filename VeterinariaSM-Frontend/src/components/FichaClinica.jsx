import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';

import { clinicaApi, mascotasApi } from '../api/index.js';
import { mensajeDeError } from '../api/http.js';
import useCargar from '../hooks/useCargar.js';
import { calcularEdad, estadoVencimiento, etiquetaEspecie, etiquetaSexo, formatearFecha } from '../utils/formato.js';
import Cargando from './Cargando.jsx';

const TEXTO_VACIO = '—';

function Tabla({ columnas, filas, vacio, onEliminar }) {
  if (filas.length === 0) return <p className="text-secondary my-3">{vacio}</p>;
  return (
    <div className="table-responsive">
      <table className="table table-sm table-striped align-middle bg-white">
        <thead>
          <tr>
            {columnas.map((c) => <th key={c.titulo} scope="col">{c.titulo}</th>)}
            {onEliminar && <th scope="col" />}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id}>
              {columnas.map((c) => <td key={c.titulo}>{c.valor(fila) ?? TEXTO_VACIO}</td>)}
              {onEliminar && (
                <td className="text-end">
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(fila)}>
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InsigniaVencimiento({ fecha }) {
  const estado = estadoVencimiento(fecha);
  if (!estado) return TEXTO_VACIO;
  const clase = { vencida: 'bg-danger', proxima: 'bg-warning text-dark', vigente: 'bg-success' }[estado];
  const texto = { vencida: 'Vencida', proxima: 'Próxima', vigente: 'Vigente' }[estado];
  return (
    <>
      {formatearFecha(fecha)} <span className={`badge ${clase}`}>{texto}</span>
    </>
  );
}

/**
 * Ficha clínica completa de una mascota (consultas, vacunas, recetas y exámenes).
 *  - puedeEscribir: muestra los atajos para agregar registros (Veterinario / Administrador).
 *  - puedeEliminar: muestra el botón eliminar (solo Administrador).
 * El dueño la ve en modo solo lectura y únicamente de sus propias mascotas (lo garantiza el backend).
 */
export default function FichaClinica({ mascotaId, puedeEscribir = false, puedeEliminar = false }) {
  const [errorAccion, setErrorAccion] = useState('');

  const mascota = useCargar(() => mascotasApi.obtener(mascotaId), [mascotaId]);
  const consultas = useCargar(() => clinicaApi.listar('consultas', mascotaId), [mascotaId]);
  const vacunas = useCargar(() => clinicaApi.listar('vacunas', mascotaId), [mascotaId]);
  const recetas = useCargar(() => clinicaApi.listar('recetas', mascotaId), [mascotaId]);
  const examenes = useCargar(() => clinicaApi.listar('examenes', mascotaId), [mascotaId]);

  const porTipo = { consultas, vacunas, recetas, examenes };

  async function eliminar(tipo, fila) {
    if (!window.confirm('¿Eliminar este registro de la ficha clínica? Esta acción no se puede deshacer.')) return;
    try {
      await clinicaApi.eliminar(tipo, fila.id);
      setErrorAccion('');
      porTipo[tipo].recargar();
    } catch (e) {
      setErrorAccion(mensajeDeError(e));
    }
  }

  if (mascota.cargando) return <Cargando texto="Cargando ficha..." />;
  if (mascota.error) return <div className="alert alert-danger">{mascota.error}</div>;

  const m = mascota.datos;
  const eliminarDe = (tipo) => (puedeEliminar ? (fila) => eliminar(tipo, fila) : undefined);
  const agregar = (ruta, texto) =>
    puedeEscribir && (
      <Link to={`${ruta}?mascota=${mascotaId}`} className="btn btn-sm btn-outline-primary mb-2">
        + {texto}
      </Link>
    );
  const errorDe = (estado) => estado.error && <div className="alert alert-danger py-2">{estado.error}</div>;

  return (
    <section>
      <div className="card mb-3">
        <div className="card-body">
          <h2 className="h4 mb-1">{m.nombre}</h2>
          <p className="mb-0 text-secondary">
            {etiquetaEspecie(m.especie)}
            {m.raza ? ` · ${m.raza}` : ''} · {etiquetaSexo(m.sexo)} · {calcularEdad(m.fechaNacimiento)}
            {m.pesoKg ? ` · ${m.pesoKg} kg` : ''}
          </p>
        </div>
      </div>

      {errorAccion && <div className="alert alert-danger">{errorAccion}</div>}

      <Tabs defaultActiveKey="consultas" className="mb-3" fill>
        <Tab eventKey="consultas" title={`Consultas (${consultas.datos?.length ?? 0})`}>
          {agregar('/nuevo-diagnostico', 'Nuevo diagnóstico')}
          {errorDe(consultas)}
          <Tabla
            vacio="Sin consultas registradas."
            filas={consultas.datos ?? []}
            onEliminar={eliminarDe('consultas')}
            columnas={[
              { titulo: 'Fecha', valor: (f) => formatearFecha(f.fecha) },
              { titulo: 'Motivo', valor: (f) => f.motivo },
              { titulo: 'Diagnóstico', valor: (f) => f.diagnostico },
              { titulo: 'Tratamiento', valor: (f) => f.tratamiento },
              { titulo: 'Medicamentos', valor: (f) => f.medicamentos },
              { titulo: 'Veterinario', valor: (f) => f.veterinario },
              { titulo: 'Próximo control', valor: (f) => (f.proximoControl ? formatearFecha(f.proximoControl) : null) },
            ]}
          />
        </Tab>

        <Tab eventKey="vacunas" title={`Vacunas (${vacunas.datos?.length ?? 0})`}>
          {agregar('/nueva-vacuna', 'Nueva vacuna')}
          {errorDe(vacunas)}
          <Tabla
            vacio="Sin vacunas registradas."
            filas={vacunas.datos ?? []}
            onEliminar={eliminarDe('vacunas')}
            columnas={[
              { titulo: 'Aplicada', valor: (f) => formatearFecha(f.fechaAplicacion) },
              { titulo: 'Vacuna', valor: (f) => f.nombre },
              { titulo: 'Dosis', valor: (f) => f.dosis },
              { titulo: 'Próxima dosis', valor: (f) => <InsigniaVencimiento fecha={f.fechaProximaDosis} /> },
              { titulo: 'Veterinario', valor: (f) => f.veterinario },
              { titulo: 'Observaciones', valor: (f) => f.observaciones },
            ]}
          />
        </Tab>

        <Tab eventKey="recetas" title={`Recetas (${recetas.datos?.length ?? 0})`}>
          {agregar('/nueva-receta', 'Nueva receta')}
          {errorDe(recetas)}
          <Tabla
            vacio="Sin recetas registradas."
            filas={recetas.datos ?? []}
            onEliminar={eliminarDe('recetas')}
            columnas={[
              { titulo: 'Fecha', valor: (f) => formatearFecha(f.fecha) },
              { titulo: 'Medicamento', valor: (f) => f.medicamento },
              { titulo: 'Dosis', valor: (f) => f.dosis },
              { titulo: 'Frecuencia', valor: (f) => f.frecuencia },
              { titulo: 'Duración', valor: (f) => f.duracion },
              { titulo: 'Indicaciones', valor: (f) => f.indicaciones },
              { titulo: 'Veterinario', valor: (f) => f.veterinario },
            ]}
          />
        </Tab>

        <Tab eventKey="examenes" title={`Exámenes (${examenes.datos?.length ?? 0})`}>
          {agregar('/nuevo-examen', 'Nuevo examen')}
          {errorDe(examenes)}
          <Tabla
            vacio="Sin exámenes registrados."
            filas={examenes.datos ?? []}
            onEliminar={eliminarDe('examenes')}
            columnas={[
              { titulo: 'Fecha', valor: (f) => formatearFecha(f.fecha) },
              { titulo: 'Tipo', valor: (f) => f.tipoExamen },
              { titulo: 'Motivo', valor: (f) => f.motivo },
              { titulo: 'Resultados', valor: (f) => f.resultados },
              { titulo: 'Veterinario', valor: (f) => f.veterinario },
              { titulo: 'Observaciones', valor: (f) => f.observaciones },
            ]}
          />
        </Tab>
      </Tabs>
    </section>
  );
}
