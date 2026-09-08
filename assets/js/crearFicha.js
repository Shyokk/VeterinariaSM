import {guardar, descargar, obtener} from "../js/core/almacenamiento.js";
import {obtenerDatos} from "../js/core/datos.js";

// ESTAS SON LAS FUNCIONES PARA GUARDAR LOS DATOS EN LA TABLA
const CONFIG = {tabla: "fichas", archivo: "../assets/data/fichas.json"};

const formulario = document.querySelector("#formularioFormularioFicha");

if (!formulario) {

    throw new Error("No se encontró #formularioFormularioFicha.");

}

formulario.addEventListener("submit", event => {event.preventDefault();

    if (!formulario.reportValidity()) { // VALIDA LAS REGLAS DEL FORMULARIO
        return;
    }

    const datos = obtenerDatos(formulario); // OBTIENELOS DATOS

    datos.fechaSolicitud = new Date().toISOString(); // REGISTRA CUANDO SE HIZO LA SOLICITUD

    guardar(CONFIG.tabla, datos); // LOS GUARDA EN LA TABLA

    formulario.reset();

    console.log(`${CONFIG.tabla}:`, obtener(CONFIG.tabla));

});

const botonDescargar = formulario.querySelector('[data-accion="descargar"]');

if (botonDescargar) {

    botonDescargar.addEventListener("click", () => {descargar(CONFIG.tabla);});

}

// ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA
const fechaDespues = document.getElementById('nacimientoMascota'); 

if (fechaDespues) {

    const hoy = new Date().toISOString().split('T')[0];


    fechaDespues.setAttribute('max', hoy);

} // ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA

// ESTE BLOQUE ES PARA EL RUT/CODUNICO DEL PACIENTE
const checkboxRut = document.getElementById('aceptaRut');
const inputCodUnico = document.getElementById('codUnico');

if (checkboxRut && inputCodUnico) {

    function generarCodigoUnico() {

        return Math.floor(100000000 + Math.random() * 900000000).toString();

    }

    function actualizarEstadoCampos() {

        if (checkboxRut.checked) {
            inputCodUnico.readOnly = false;
            inputCodUnico.required = true;
            inputCodUnico.value = '';
            inputCodUnico.placeholder = 'Ingrese Codigo o RUT';
            inputCodUnico.focus();
            
        } else {
            
            inputCodUnico.readOnly = true;
            inputCodUnico.required = false;
            inputCodUnico.value = generarCodigoUnico();
            inputCodUnico.placeholder = '';

        }
    }

    actualizarEstadoCampos();
    
    checkboxRut.addEventListener('change', actualizarEstadoCampos);
}
// ESTE BLOQUE ES PARA EL RUT/CODUNICO DEL PACIENTE