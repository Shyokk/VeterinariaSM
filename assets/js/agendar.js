import {guardar, descargar, obtener} from "../js/core/almacenamiento.js";
import {obtenerDatos} from "../js/core/datos.js";

const CONFIG = {tabla: "agendamientos", archivo: "../assets/data/agendamientos.json"};

const formulario = document.querySelector("#formularioHoraAgendada");

if (!formulario) {

    throw new Error("No se encontró #formularioHoraAgendada.");

}

formulario.addEventListener("submit", event => {event.preventDefault();

    if (!formulario.reportValidity()) {
        return;
    }

    const datos = obtenerDatos(formulario);

    datos.fechaSolicitud = new Date().toISOString();

    guardar(CONFIG.tabla, datos);

    formulario.reset();

    console.log(`${CONFIG.tabla}:`, obtener(CONFIG.tabla));

});

const botonDescargar = formulario.querySelector('[data-accion="descargar"]');

if (botonDescargar) {

    botonDescargar.addEventListener("click", () => {descargar(CONFIG.tabla);});

}
