import { useMemo } from 'react';

import { usuariosApi } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { esPersonal } from '../utils/roles.js';
import { nombreCompleto } from '../utils/formato.js';
import useCargar from './useCargar.js';

/**
 * Lista de dueños (solo la puede pedir el personal) y un diccionario id -> nombre,
 * para mostrar el nombre del dueño en tablas de mascotas y citas.
 */
export default function useDuenos() {
  const { rol } = useAuth();
  const { datos, cargando, error } = useCargar(() => usuariosApi.duenos(), [rol], {
    habilitado: esPersonal(rol),
  });

  const lista = datos ?? [];
  const nombres = useMemo(() => {
    const mapa = {};
    lista.forEach((d) => {
      mapa[d.id] = nombreCompleto(d);
    });
    return mapa;
  }, [lista]);

  return {
    duenos: lista,
    nombreDueno: (id) => nombres[id] ?? `Dueño #${id}`,
    cargando,
    error,
  };
}
