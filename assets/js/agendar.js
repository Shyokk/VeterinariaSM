import {guardar, descargar, obtener} from "../js/core/almacenamiento.js";
import {obtenerDatos} from "../js/core/datos.js";

const fechaInicio = document.getElementById('fechaAgendar'); 

if (fechaInicio) {

    const hoy = new Date().toISOString().split('T')[0];
    fechaInicio.setAttribute('min', hoy);

    fechaInicio.addEventListener('input', function() {

        const fechaSeleccionada = this.value;
        const fechaObj = new Date(fechaSeleccionada + 'T12:00:00'); 
        const diaSemana = fechaObj.getDay(); 

        if (diaSemana === 0 || diaSemana === 6) { 

            this.setCustomValidity('No se puede agendar los fines de semana.');

        } else {

            this.setCustomValidity('');

        }

    });

}// ESTE ES LA FUNCION PARA QUE LA FECHA AL AGENDAR NO SE PUEDA SELECCIONAR ANTERIOR AL DIA ACTUAL


// ESTE ES LA FUNCION PARA QUE LA HORA AL AGENDAR SOLO SEA EN HORARIO LABORAL
const horaInicio = document.getElementById('horaCita'); 

if (horaInicio) {

    horaInicio.addEventListener('input', function() {

        if (this.value < '08:30' || this.value > '16:30') {

            this.setCustomValidity('La agenda es desde 08:30 hasta 16:30');

        } else {

            this.setCustomValidity('');

        }

    });

} // ESTE ES LA FUNCION PARA QUE LA HORA AL AGENDAR SOLO SEA EN HORARIO LABORAL


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


// ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA
const fechaDespues = document.getElementById('nacimientoMascota'); 

if (fechaDespues) {

    const hoy = new Date().toISOString().split('T')[0];


    fechaDespues.setAttribute('max', hoy);

} // ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA

// ESTAS SON LAS FUNCIONES PARA GUARDAR LOS DATOS EN LA TABLA
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