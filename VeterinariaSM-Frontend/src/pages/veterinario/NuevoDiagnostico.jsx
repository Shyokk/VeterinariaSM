import { useEffect } from 'react';

import FormularioClinico from '../../components/FormularioClinico.jsx';

const CAMPOS = [
  { nombre: 'fecha', etiqueta: 'Fecha de la consulta', tipo: 'date', inicial: 'hoy', soloPasado: true },
  { nombre: 'veterinario', etiqueta: 'Veterinario', max: 120, inicial: 'veterinario' },
  { nombre: 'motivo', etiqueta: 'Motivo de la consulta', max: 255 },
  { nombre: 'diagnostico', etiqueta: 'Diagnóstico', tipo: 'textarea', requerido: true, max: 1000 },
  { nombre: 'tratamiento', etiqueta: 'Tratamiento', tipo: 'textarea', max: 1000 },
  { nombre: 'medicamentos', etiqueta: 'Medicamentos indicados', tipo: 'textarea', max: 1000 },
  { nombre: 'proximoControl', etiqueta: 'Próximo control', tipo: 'date' },
];

function validar(form) {
  if (form.proximoControl && form.proximoControl < form.fecha) {
    return 'El próximo control no puede ser anterior a la fecha de la consulta.';
  }
  return '';
}

export default function NuevoDiagnostico() {
  useEffect(() => {
    document.title = 'Nuevo diagnóstico | Veterinaria San Marcos';
  }, []);

  return (
    <FormularioClinico
      titulo="Nuevo diagnóstico"
      descripcion="Registra el diagnóstico y tratamiento de una consulta en la ficha clínica."
      tipo="consultas"
      campos={CAMPOS}
      validar={validar}
    />
  );
}
