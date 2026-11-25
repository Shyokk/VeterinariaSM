import { useEffect } from 'react';

import FormularioClinico from '../../components/FormularioClinico.jsx';

const CAMPOS = [
  { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date', inicial: 'hoy', soloPasado: true },
  { nombre: 'veterinario', etiqueta: 'Veterinario', max: 120, inicial: 'veterinario' },
  { nombre: 'medicamento', etiqueta: 'Medicamento', requerido: true, max: 150 },
  { nombre: 'dosis', etiqueta: 'Dosis', max: 100, ayuda: 'Ej: 250 mg' },
  { nombre: 'frecuencia', etiqueta: 'Frecuencia', max: 100, ayuda: 'Ej: cada 12 horas' },
  { nombre: 'duracion', etiqueta: 'Duración', max: 100, ayuda: 'Ej: 7 días' },
  { nombre: 'indicaciones', etiqueta: 'Indicaciones', tipo: 'textarea', max: 1000 },
];

export default function NuevaReceta() {
  useEffect(() => {
    document.title = 'Nueva receta | Veterinaria San Marcos';
  }, []);

  return (
    <FormularioClinico
      titulo="Nueva receta"
      descripcion="Registra una receta médica en la ficha clínica de la mascota."
      tipo="recetas"
      campos={CAMPOS}
    />
  );
}
