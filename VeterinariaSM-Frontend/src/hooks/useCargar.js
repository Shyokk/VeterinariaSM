import { useCallback, useEffect, useRef, useState } from 'react';

import { mensajeDeError } from '../api/http.js';

/**
 * Ejecuta una función asíncrona (llamada a la API) y entrega { datos, cargando, error, recargar }.
 * Evita actualizar el estado si el componente ya se desmontó.
 */
export default function useCargar(funcion, dependencias = [], { habilitado = true } = {}) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(habilitado);
  const [error, setError] = useState('');
  const funcionRef = useRef(funcion);
  funcionRef.current = funcion;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setDatos(await funcionRef.current());
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!habilitado) {
      setCargando(false);
      return undefined;
    }
    let activo = true;
    setCargando(true);
    setError('');
    funcionRef
      .current()
      .then((resultado) => activo && setDatos(resultado))
      .catch((e) => activo && setError(mensajeDeError(e)))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habilitado, ...dependencias]);

  return { datos, cargando, error, recargar, setDatos };
}
