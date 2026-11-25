import { useEffect } from 'react';

import FormularioClinico from '../../components/FormularioClinico.jsx';

const CAMPOS = [
  { nombre: 'fecha', etiqueta: 'Fecha del examen', tipo: 'date', inicial: 'hoy' },
  { nombre: 'veterinario', etiqueta: 'Veterinario', max: 120, inicial: 'veterinario' },
  { nombre: 'tipoExamen', etiqueta: 'Tipo de examen', requerido: true, max: 100, ayuda: 'Ej: Hemograma, Radiografía, Ecografía' },
  { nombre: 'motivo', etiqueta: 'Motivo de la evaluación', max: 255 },
  { nombre: 'resultados', etiqueta: 'Resultados', tipo: 'textarea', max: 2000 },
  { nombre: 'observaciones', etiqueta: 'Observaciones', tipo: 'textarea', max: 1000 },
];

export default function NuevoExamen() {
  useEffect(() => {
    document.title = 'Nuevo examen | Veterinaria San Marcos';
  }, []);

  return (
    <FormularioClinico
      titulo="Nuevo examen"
      descripcion="Registra un examen clínico en los antecedentes de la mascota."
      tipo="examenes"
      campos={CAMPOS}
    />
  );
}
