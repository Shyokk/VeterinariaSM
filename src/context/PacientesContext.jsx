
import {
  createContext,
  useContext,
  useState,
} from 'react';

import {
  agregarPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from '../utils/pacientes.js';

import { pacientesMock } from '../mocks/datosVeterinaria.js';

const PacientesContext = createContext(null);

export function PacientesProvider({ children }) {
  const [pacientes, setPacientes] = useState(
    () => pacientesMock.map((paciente) => ({ ...paciente }))
  );

  function registrarPaciente(paciente) {
    setPacientes((anteriores) =>
      agregarPaciente(anteriores, paciente)
    );
  }

  function editarPaciente(pacienteActualizado) {
    setPacientes((anteriores) =>
      actualizarPaciente(anteriores, pacienteActualizado)
    );
  }

  function borrarPaciente(id) {
    setPacientes((anteriores) =>
      eliminarPaciente(anteriores, id)
    );
  }

  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        registrarPaciente,
        editarPaciente,
        borrarPaciente,
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
}

export function usePacientes() {
  const contexto = useContext(PacientesContext);

  if (!contexto) {
    throw new Error(
      'usePacientes debe utilizarse dentro de PacientesProvider'
    );
  }

  return contexto;
}
