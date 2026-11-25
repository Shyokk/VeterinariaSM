import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authApi } from '../api/index.js';
import { alExpirarSesion } from '../api/http.js';
import {
  CLAVE_SESION,
  borrarSesion,
  guardarSesion,
  leerSesion,
} from '../utils/almacenSesion.js';

const AuthContext = createContext(null);

/**
 * Gestión de sesión del frontend.
 *  - Al iniciar sesión se guardan los tokens y el usuario en localStorage, así la sesión
 *    SOBREVIVE a recargas de página (F5) y al cerrar/abrir la pestaña.
 *  - Al cargar la app se valida la sesión guardada contra el backend (GET /api/auth/me).
 *    Si el token expiró se renueva solo con el refresh token; si ya no es válido, se cierra la sesión.
 *  - Si se cierra sesión en otra pestaña, esta también se entera (evento "storage").
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const [verificando, setVerificando] = useState(() => Boolean(leerSesion()));

  const cerrarLocal = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  // 1) Restaurar y validar la sesión al cargar la página
  useEffect(() => {
    alExpirarSesion(cerrarLocal);

    if (!leerSesion()) {
      setVerificando(false);
      return undefined;
    }

    let activo = true;
    authApi
      .me()
      .then((datos) => {
        if (!activo) return;
        const sesion = leerSesion();
        if (sesion) guardarSesion({ ...sesion, usuario: datos });
        setUsuario(datos);
      })
      .catch((error) => {
        // 401 => la sesión ya no sirve. Si es un error de red (status 0) se conserva la sesión guardada.
        if (activo && error.status === 401) cerrarLocal();
      })
      .finally(() => {
        if (activo) setVerificando(false);
      });

    return () => {
      activo = false;
    };
  }, [cerrarLocal]);

  // 2) Sincronizar entre pestañas
  useEffect(() => {
    function alCambiarAlmacenamiento(evento) {
      if (evento.key === CLAVE_SESION) setUsuario(leerSesion()?.usuario ?? null);
    }
    window.addEventListener('storage', alCambiarAlmacenamiento);
    return () => window.removeEventListener('storage', alCambiarAlmacenamiento);
  }, []);

  const iniciarSesionConRespuesta = useCallback((datos) => {
    guardarSesion({
      accessToken: datos.accessToken,
      refreshToken: datos.refreshToken,
      usuario: datos.usuario,
    });
    setUsuario(datos.usuario);
    return datos.usuario;
  }, []);

  const login = useCallback(
    async (email, password) => iniciarSesionConRespuesta(await authApi.login(email, password)),
    [iniciarSesionConRespuesta]
  );

  const registrar = useCallback(
    async (datos) => iniciarSesionConRespuesta(await authApi.registro(datos)),
    [iniciarSesionConRespuesta]
  );

  const valor = useMemo(
    () => ({
      usuario,
      autenticado: Boolean(usuario),
      verificando,
      rol: usuario?.rol ?? null,
      login,
      registrar,
      logout: cerrarLocal,
      tieneRol: (...roles) => Boolean(usuario) && roles.includes(usuario.rol),
    }),
    [usuario, verificando, login, registrar, cerrarLocal]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}
