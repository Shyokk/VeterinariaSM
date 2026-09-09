import {mostrarPaciente} from "../js/core/paciente.js";
import {guardar, descargar, obtener} from "../js/core/almacenamiento.js";
import {obtenerDatos} from "../js/core/datos.js";
import {obtenerCodUnicoURL} from "../js/core/obtenerPaciente.js";

mostrarPaciente();

const CONFIG = {tabla: "recetas", archivo: "../assets/data/recetas.json"};

const formulario = document.querySelector("#formularioFormularioFicha");

if (!formulario) {

    throw new Error("No se encontró #formularioFormularioFicha.");

}

const codUnico = obtenerCodUnicoURL();

if (!codUnico) {
    throw new Error("No se encontró codUnico");
}

formulario.addEventListener("submit", event => {event.preventDefault();

    if (!formulario.reportValidity()) { // VALIDA LAS REGLAS DEL FORMULARIO
        return;
    }

    const datos = obtenerDatos(formulario); // OBTIENELOS DATOS

    datos.codUnico = codUnico;

    datos.fechaSolicitud = new Date().toISOString(); // REGISTRA CUANDO SE HIZO LA SOLICITUD

    guardar(CONFIG.tabla, datos); // LOS GUARDA EN LA TABLA

    formulario.reset();

    console.log(`${CONFIG.tabla}:`, obtener(CONFIG.tabla));

});

const botonDescargar = formulario.querySelector('[data-accion="descargar"]');

if (botonDescargar) {

    botonDescargar.addEventListener("click", () => {descargar(CONFIG.tabla);});

}
