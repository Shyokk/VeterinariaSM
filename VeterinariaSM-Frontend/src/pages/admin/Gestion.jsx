import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { citasApi, clinicaApi, mascotasApi, usuariosApi } from '../../api/index.js';
import Cargando from '../../components/Cargando.jsx';
import useCargar from '../../hooks/useCargar.js';
import { ETIQUETA_ROL } from '../../utils/roles.js';

/** Resumen general para el Administrador. Cada indicador se carga por separado: si un servicio falla, solo ese muestra «—». */
async function cargarResumen() {
  const [usuarios, mascotas, pendientes, vacunas] = await Promise.allSettled([
    usuariosApi.listar(),
    mascotasApi.listar(),
    citasApi.listar({ estado: 'PENDIENTE' }),
    clinicaApi.vacunasPorVencer(30),
  ]);
  const valor = (r) => (r.status === 'fulfilled' ? r.value : null);
  return {
    usuarios: valor(usuarios),
    mascotas: valor(mascotas),
    pendientes: valor(pendientes),
    vacunas: valor(vacunas),
  };
}

function Indicador({ titulo, valor, detalle, enlace }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <Link to={enlace} className="card h-100 text-decoration-none">
        <div className="card-body">
          <p className="text-secondary mb-1">{titulo}</p>
          <p className="display-6 mb-1">{valor ?? '—'}</p>
          {detalle && <small className="text-secondary">{detalle}</small>}
        </div>
      </Link>
    </div>
  );
}

export default function Gestion() {
  const { datos, cargando } = useCargar(cargarResumen, []);

  useEffect(() => {
    document.title = 'Panel de gestión | Veterinaria San Marcos';
  }, []);

  const usuarios = datos?.usuarios;
  const porRol = (usuarios ?? []).reduce((acc, u) => ({ ...acc, [u.rol]: (acc[u.rol] ?? 0) + 1 }), {});

  return (
    <main className="contenido-main container py-4">
      <h1 className="h3 mb-3">Panel de gestión</h1>

      {cargando ? (
        <Cargando />
      ) : (
        <>
          <div className="row g-3 mb-4">
            <Indicador titulo="Usuarios" valor={usuarios?.length} enlace="/usuarios"
              detalle={Object.entries(porRol).map(([r, n]) => `${ETIQUETA_ROL[r]}: ${n}`).join(' · ')} />
            <Indicador titulo="Pacientes activos" valor={datos?.mascotas?.length} enlace="/pacientes" />
            <Indicador titulo="Citas por confirmar" valor={datos?.pendientes?.length} enlace="/agendar" />
            <Indicador titulo="Vacunas por vencer (30 días)" valor={datos?.vacunas?.length} enlace="/historial" />
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/usuarios" className="btn btn-outline-primary">Gestionar usuarios y roles</Link>
            <Link to="/reportes" className="btn btn-outline-primary">Ver reportes</Link>
            <Link to="/agendar" className="btn btn-outline-primary">Agenda de citas</Link>
          </div>
        </>
      )}
    </main>
  );
}
