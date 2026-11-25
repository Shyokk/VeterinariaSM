import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { mensajeDeError } from '../../api/http.js';
import Mensaje from '../../components/Mensaje.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { rutValido } from '../../utils/rut.js';

const INICIAL = {
  rut: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  confirmar: '',
  terminos: false,
};

/**
 * Registro PÚBLICO: crea siempre una cuenta de "Dueño de mascota".
 * El rol NO se elige aquí ni se deduce del correo: lo asigna el servidor. Las cuentas del personal
 * (veterinario, recepcionista, administrador) las crea el Administrador desde el panel de Usuarios.
 */
export default function Register() {
  const { registrar, usuario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INICIAL);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = 'Registro | Veterinaria San Marcos';
  }, []);

  if (usuario) return <Navigate to="/" replace />;

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  }

  function validar() {
    if (!rutValido(form.rut)) return 'El RUT ingresado no es válido (ej: 12.345.678-5).';
    if (!form.nombre.trim() || !form.apellido.trim()) return 'Ingresa tu nombre y apellido.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Ingresa un correo electrónico válido.';
    if (form.telefono && !/^[0-9+\s()-]{8,20}$/.test(form.telefono)) return 'Ingresa un teléfono válido.';
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (form.password !== form.confirmar) return 'Las contraseñas no coinciden.';
    if (!form.terminos) return 'Debes aceptar los términos y condiciones.';
    return '';
  }

  async function enviar(e) {
    e.preventDefault();
    const problema = validar();
    if (problema) return setError(problema);

    setEnviando(true);
    try {
      await registrar({
        rut: form.rut,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || null,
        password: form.password,
      });
      navigate('/', { replace: true }); // el registro deja la sesión iniciada
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="contenido-main container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          <div className="bg-white rounded shadow-sm p-3 p-md-4">
            <h1 className="h3 mb-1">Registro de dueño de mascota</h1>
            <p className="text-secondary">
              Crea tu cuenta para solicitar citas y ver el historial clínico de tus mascotas.
              <br />
              <small>Las cuentas del personal las crea el administrador de la clínica.</small>
            </p>

            <Mensaje tipo="danger">{error}</Mensaje>

            <form onSubmit={enviar} noValidate>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="r-rut" className="form-label">RUT *</label>
                  <input id="r-rut" name="rut" className="form-control" value={form.rut} onChange={cambiar}
                    placeholder="12.345.678-5" />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="r-tel" className="form-label">Teléfono</label>
                  <input id="r-tel" name="telefono" type="tel" className="form-control" value={form.telefono}
                    onChange={cambiar} placeholder="+56912345678" />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="r-nombre" className="form-label">Nombre *</label>
                  <input id="r-nombre" name="nombre" className="form-control" value={form.nombre} onChange={cambiar} />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="r-apellido" className="form-label">Apellido *</label>
                  <input id="r-apellido" name="apellido" className="form-control" value={form.apellido} onChange={cambiar} />
                </div>
                <div className="col-12">
                  <label htmlFor="r-email" className="form-label">Correo electrónico *</label>
                  <input id="r-email" name="email" type="email" className="form-control" autoComplete="username"
                    value={form.email} onChange={cambiar} placeholder="correo@ejemplo.cl" />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="r-pass" className="form-label">Contraseña * (mín. 8 caracteres)</label>
                  <input id="r-pass" name="password" type="password" className="form-control" autoComplete="new-password"
                    value={form.password} onChange={cambiar} />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="r-conf" className="form-label">Repetir contraseña *</label>
                  <input id="r-conf" name="confirmar" type="password" className="form-control" autoComplete="new-password"
                    value={form.confirmar} onChange={cambiar} />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input id="r-terminos" name="terminos" type="checkbox" className="form-check-input"
                      checked={form.terminos} onChange={cambiar} />
                    <label htmlFor="r-terminos" className="form-check-label">
                      Acepto los términos y condiciones de uso
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={enviando}>
                  {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
                <Link to="/login" className="btn btn-outline-secondary">¿Ya tienes cuenta? Inicia sesión</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
