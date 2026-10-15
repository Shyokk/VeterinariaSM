
import {
  createContext,
  useContext,
  useState,
} from 'react';

import { usePacientes } from './PacientesContext.jsx';

import {
  diagnosticosMock,
  vacunasMock,
  recetasMock,
} from '../mocks/datosVeterinaria.js';

const HistorialContext = createContext(null);

export function HistorialProvider({ children }) {
  const { pacientes } = usePacientes();

  const [diagnosticos, setDiagnosticos] = useState(
    () => diagnosticosMock.map((item) => ({ ...item }))
  );

  const [vacunas, setVacunas] = useState(
    () => vacunasMock.map((item) => ({ ...item }))
  );

  const [recetas, setRecetas] = useState(
    () => recetasMock.map((item) => ({ ...item }))
  );

  const idsPacientes = new Set(
    pacientes.map((paciente) => paciente.id)
  );

  function filtrarRegistrosValidos(registros) {
    return registros.filter(
      (registro) => idsPacientes.has(registro.pacienteId)
    );
  }

  const diagnosticosValidos = filtrarRegistrosValidos(diagnosticos);
  const vacunasValidas = filtrarRegistrosValidos(vacunas);
  const recetasValidas = filtrarRegistrosValidos(recetas);

  function registrarDiagnostico(diagnostico) {
    if (!idsPacientes.has(diagnostico.pacienteId)) {
      return false;
    }

    setDiagnosticos((anteriores) => [
      ...anteriores,
      diagnostico,
    ]);

    return true;
  }

  function registrarVacuna(vacuna) {
    if (!idsPacientes.has(vacuna.pacienteId)) {
      return false;
    }

    setVacunas((anteriores) => [
      ...anteriores,
      vacuna,
    ]);

    return true;
  }

  function registrarReceta(receta) {
    if (!idsPacientes.has(receta.pacienteId)) {
      return false;
    }

    setRecetas((anteriores) => [
      ...anteriores,
      receta,
    ]);

    return true;
  }

  function obtenerDiagnosticosPaciente(pacienteId) {
    return diagnosticosValidos.filter(
      (registro) => registro.pacienteId === pacienteId
    );
  }

  function obtenerVacunasPaciente(pacienteId) {
    return vacunasValidas.filter(
      (registro) => registro.pacienteId === pacienteId
    );
  }

  function obtenerRecetasPaciente(pacienteId) {
    return recetasValidas.filter(
      (registro) => registro.pacienteId === pacienteId
    );
  }

  function eliminarDiagnostico(id) {
    setDiagnosticos((anteriores) =>
      anteriores.filter((registro) => registro.id !== id)
    );
  }

  function eliminarVacuna(id) {
    setVacunas((anteriores) =>
      anteriores.filter((registro) => registro.id !== id)
    );
  }

  function eliminarReceta(id) {
    setRecetas((anteriores) =>
      anteriores.filter((registro) => registro.id !== id)
    );
  }

  return (
    <HistorialContext.Provider
      value={{
        diagnosticos: diagnosticosValidos,
        vacunas: vacunasValidas,
        recetas: recetasValidas,
        registrarDiagnostico,
        registrarVacuna,
        registrarReceta,
        obtenerDiagnosticosPaciente,
        obtenerVacunasPaciente,
        obtenerRecetasPaciente,
        eliminarDiagnostico,
        eliminarVacuna,
        eliminarReceta,
      }}
    >
      {children}
    </HistorialContext.Provider>
  );
}

export function useHistorial() {
  const contexto = useContext(HistorialContext);

  if (!contexto) {
    throw new Error(
      'useHistorial debe utilizarse dentro de HistorialProvider'
    );
  }

  return contexto;
}
