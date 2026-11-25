import { useEffect } from 'react';

import FormularioClinico from '../../components/FormularioClinico.jsx';

const CAMPOS = [
  { nombre: 'fechaAplicacion', etiqueta: 'Fecha de aplicación', tipo: 'date', requerido: true, inicial: 'hoy', soloPasado: true },
  { nombre: 'nombre', etiqueta: 'Vacuna', requerido: true, max: 100, ayuda: 'Ej: Antirrábica, Óctuple' },
  { nombre: 'dosis', etiqueta: 'Dosis', max: 50, ayuda: 'Ej: 1 dosis, refuerzo' },
  { nombre: 'fechaProximaDosis', etiqueta: 'Próxima dosis (vencimiento)', tipo: 'date', ayuda: 'El dueño recibirá el aviso antes de esta fecha.' },
  { nombre: 'veterinario', etiqueta: 'Veterinario', max: 120, inicial: 'veterinario' },
  { nombre: 'lote', etiqueta: 'Lote', max: 50 },
  { nombre: 'observaciones', etiqueta: 'Observaciones', tipo: 'textarea', max: 500 },
];

function validar(form) {
  if (form.fechaProximaDosis && form.fechaProximaDosis <= form.fechaAplicacion) {
    return 'La próxima dosis debe ser posterior a la fecha de aplicación.';
  }
  return '';
}

export default function NuevaVacuna() {
  useEffect(() => {
    document.title = 'Nueva vacuna | Veterinaria San Marcos';
  }, []);

  return (
    <FormularioClinico
      titulo="Nueva vacuna"
      descripcion="Registra una vacuna aplicada. Queda en el historial de vacunación digital de la mascota."
      tipo="vacunas"
      campos={CAMPOS}
      validar={validar}
    />
  );
}
