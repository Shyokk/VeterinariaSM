import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { mensajeDeError } from '../../api/http.js';
import Mensaje from '../../components/Mensaje.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const destino = ubicacion.state?.desde ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = 'Iniciar sesión | Veterinaria San Marcos';
  }, []);

  // Si ya hay sesión no tiene sentido mostrar el login
  if (usuario) return <Navigate to={destino} replace />;

  async function enviar(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="contenido-main container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="bg-white rounded shadow-sm p-4">
            <h1 className="h3 mb-1">Iniciar sesión</h1>
            <p className="text-secondary">Accede con tu cuenta de Veterinaria San Marcos.</p>

            <Mensaje tipo="info">
              {ubicacion.state?.desde && 'Debes iniciar sesión para ver esa página.'}
            </Mensaje>
            <Mensaje tipo="danger">{error}</Mensaje>

            <form onSubmit={enviar} noValidate>
              <div className="mb-3">
                <label htmlFor="login-email" className="form-label">Correo electrónico</label>
                <input id="login-email" type="email" className="form-control" autoComplete="username"
                  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.cl" autoFocus />
              </div>
              <div className="mb-3">
                <label htmlFor="login-pass" className="form-label">Contraseña</label>
                <input id="login-pass" type="password" className="form-control" autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
                {enviando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/register" className="text-decoration-underline">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
