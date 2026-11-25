import { obtenerPacienteActual } from "../core/obtenerPaciente.js";
import { mostrarDatos } from "../core/vista.js";

export function mostrarPaciente() {

    const paciente = obtenerPacienteActual();

    if (!paciente) return;

    mostrarDatos(paciente);

}