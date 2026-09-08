import {obtener} from "../core/almacenamiento.js";

const storageKey = "fichas";

export function obtenerCodUnicoURL() {

    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("codUnico");

}

export function obtenerPacienteCodUnico(codUnico) {

    const pacientes = obtener(storageKey);

    return pacientes.find(paciente => paciente.codUnico === codUnico);

}

export function obtenerPacienteActual() {

    const codUnico = obtenerCodUnicoURL();

    if (!codUnico) {
        console.error("No se recibió codigo unico en la URL");
        return null;
    }

    const paciente = obtenerPacienteCodUnico(codUnico);

    if (!paciente) {
        console.error("No se encontro paciente");
        return null;
    }
    
    return paciente;

}