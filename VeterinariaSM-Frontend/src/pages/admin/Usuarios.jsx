import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { usuariosApi } from '../../api/index.js';
import { mensajeDeError } from '../../api/http.js';
import Cargando from '../../components/Cargando.jsx';
import Mensaje from '../../components/Mensaje.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useCargar from '../../hooks/useCargar.js';
import { nombreCompleto } from '../../utils/formato.js';
import { ETIQUETA_ROL, ROLES } from '../../utils/roles.js';
import { formatearRut, rutValido } from '../../utils/rut.js';

const VACIO = { nombre: '', apellido: '', rut: '', email: '', telefono: '', rol: ROLES.RECEPCION, password: '' };

/** Panel de administración: crear, editar, desactivar usuarios y asignar roles (solo Administrador). */
export default function Usuarios() {
  const { usuario: yo } = useAuth();
  const { datos, cargando, error, recargar } = useCargar(() => usuariosApi.listar(), []);

  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [modal, setModal] = useState(null); // null | { modo: 'crear' } | { modo: 'editar', usuario }
  const [form, setForm] = useState(VACIO);
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: 'success', texto: '' });

  useEffect(() => {
    document.title = 'Usuarios | Veterinaria San Marcos';
  }, []);

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return (datos ?? []).filter(
      (u) =>
        (!filtroRol || u.rol === filtroRol) &&
        (!t || nombreCompleto(u).toLowerCase().includes(t) || u.email.toLowerCase().includes(t) || (u.rut ?? '').includes(t.replace(/[.\s]/g, '')))
    );
  }, [datos, busqueda, filtroRol]);

  function abrirCrear() {
    setForm(VACIO);
    setErrorForm('');
    setModal({ modo: 'crear' });
  }

  function abrirEditar(u) {
    setForm({ nombre: u.nombre, apellido: u.apellido, rut: u.rut ?? '', email: u.email, telefono: u.telefono ?? '', rol: u.rol, password: '' });
    setErrorForm('');
    setModal({ modo: 'editar', usuario: u });
  }

  function cambiar(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrorForm('');
  }

  function validar(modo) {
    if (!form.nombre.trim() || !form.apellido.trim()) return 'Ingresa nombre y apellido.';
    if (modo === 'crear' && !rutValido(form.rut)) return 'El RUT no es válido (ej: 12.345.678-5).';
    if (modo === 'editar' && form.rut && !rutValido(form.rut)) return 'El RUT no es válido.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Ingresa un correo válido.';
    if (modo === 'crear' && form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (modo === 'editar' && form.password && form.password.length < 8) return 'La nueva contraseña debe tener al menos 8 caracteres.';
    return '';
  }

  async function guardar(e) {
    e.preventDefault();
    const problema = validar(modal.modo);
    if (problema) return setErrorForm(problema);

    const cuerpo = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      rut: form.rut.trim() || null,
      email: form.email.trim(),
      telefono: form.telefono.trim() || null,
      rol: form.rol,
    };
    if (form.password) cuerpo.password = form.password;

    setGuardando(true);
    try {
      if (modal.modo === 'crear') await usuariosApi.crear(cuerpo);
      else await usuariosApi.editar(modal.usuario.id, cuerpo);
      setAviso({ tipo: 'success', texto: modal.modo === 'crear' ? 'Usuario creado.' : 'Usuario actualizado.' });
      setModal(null);
      recargar();
    } catch (err) {
      setErrorForm(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function alternarEstado(u) {
    const desactivar = u.activo;
    if (desactivar && !window.confirm(`¿Desactivar a ${nombreCompleto(u)}? No podrá iniciar sesión.`)) return;
    try {
      if (desactivar) await usuariosApi.desactivar(u.id);
      else await usuariosApi.activar(u.id);
      setAviso({ tipo: 'success', texto: `Usuario ${desactivar ? 'desactivado' : 'activado'}.` });
    } catch (err) {
      setAviso({ tipo: 'danger', texto: mensajeDeError(err) });
    } finally {
      recargar();
    }
  }

  return (
    <main className="contenido-main container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Administración de usuarios</h1>
        <button type="button" className="btn btn-primary" onClick={abrirCrear}>+ Nuevo usuario</button>
      </div>

      <Mensaje tipo={aviso.tipo} alCerrar={() => setAviso({ ...aviso, texto: '' })}>{aviso.texto}</Mensaje>
      <Mensaje tipo="danger">{error}</Mensaje>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-8">
          <input type="search" className="form-control" placeholder="Buscar por nombre, correo o RUT..."
            aria-label="Buscar usuarios" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" aria-label="Filtrar por rol" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
            <option value="">Todos los roles</option>
            {Object.entries(ETIQUETA_ROL).map(([v, e]) => <option key={v} value={v}>{e}</option>)}
          </select>
        </div>
      </div>

      {cargando ? (
        <Cargando texto="Cargando usuarios..." />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle bg-white">
            <thead>
              <tr><th>Nombre</th><th>RUT</th><th>Correo</th><th>Rol</th><th>Estado</th><th /></tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold">{nombreCompleto(u)}</td>
                  <td>{u.rut ? formatearRut(u.rut) : '—'}</td>
                  <td>{u.email}</td>
                  <td>{ETIQUETA_ROL[u.rol]}</td>
                  <td>
                    <span className={`badge ${u.activo ? 'bg-success' : 'bg-secondary'}`}>{u.activo ? 'Activo' : 'Desactivado'}</span>
                  </td>
                  <td className="text-end text-nowrap">
                    <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => abrirEditar(u)}>Editar</button>
                    <button type="button" className={`btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      disabled={u.id === yo.id} title={u.id === yo.id ? 'No puedes desactivar tu propia cuenta' : undefined}
                      onClick={() => alternarEstado(u)}>
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={6} className="text-center text-secondary">Sin resultados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={Boolean(modal)} onHide={() => setModal(null)} centered size="lg">
        {modal && (
          <form onSubmit={guardar} noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{modal.modo === 'crear' ? 'Nuevo usuario' : 'Editar usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Mensaje tipo="danger">{errorForm}</Mensaje>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="u-nombre" className="form-label">Nombre *</label>
                  <input id="u-nombre" name="nombre" className="form-control" value={form.nombre} onChange={cambiar} />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="u-apellido" className="form-label">Apellido *</label>
                  <input id="u-apellido" name="apellido" className="form-control" value={form.apellido} onChange={cambiar} />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="u-rut" className="form-label">RUT {modal.modo === 'crear' && '*'}</label>
                  <input id="u-rut" name="rut" className="form-control" value={form.rut} onChange={cambiar} placeholder="12.345.678-5" />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="u-tel" className="form-label">Teléfono</label>
                  <input id="u-tel" name="telefono" type="tel" className="form-control" value={form.telefono} onChange={cambiar} />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="u-email" className="form-label">Correo *</label>
                  <input id="u-email" name="email" type="email" className="form-control" value={form.email} onChange={cambiar} />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="u-rol" className="form-label">Rol *</label>
                  <select id="u-rol" name="rol" className="form-select" value={form.rol} onChange={cambiar}
                    disabled={modal.modo === 'editar' && modal.usuario.id === yo.id}>
                    {Object.entries(ETIQUETA_ROL).map(([v, e]) => <option key={v} value={v}>{e}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="u-pass" className="form-label">
                    {modal.modo === 'crear' ? 'Contraseña * (mín. 8 caracteres)' : 'Nueva contraseña (déjala vacía para no cambiarla)'}
                  </label>
                  <input id="u-pass" name="password" type="password" className="form-control" autoComplete="new-password"
                    value={form.password} onChange={cambiar} />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(null)} disabled={guardando}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
            </Modal.Footer>
          </form>
        )}
      </Modal>
    </main>
  );
}
