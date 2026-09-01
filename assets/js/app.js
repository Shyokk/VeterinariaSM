// EN ESTE JAVASCRIPT ESTARÁN LOS SCRIPST PARA LA PAGINA

{fetch('header.html') // ESTE ES PARA HACER EL HEADER PLANTILLA
    .then(response => response.text())
    .then(data => document.getElementById('header-contenedor').innerHTML = data);

}

{fetch('footer.html') // ESTE ES PARA HACER EL FOOTER PLANTILLA
    .then(response => response.text())
    .then(data => document.getElementById('footer-contenedor').innerHTML = data);
}


// ESTE ES LA FUNCION PARA QUE EL ICONO DE INICIAR SESIÓN SOLO APAREZCA PARA DISPOSIVOS MOVILES
const mediaQuery = window.matchMedia('(min-width: 1280px)');

function aparecerIcono(e) {
    const iconoInicio = document.querySelector('.icono-iniciar');
    
    if (!iconoInicio) return; 

    if (e.matches) {
        iconoInicio.style.display = 'none';
    } else {
        iconoInicio.style.display = 'block';
    }
}

aparecerIcono(mediaQuery);

if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', aparecerIcono);
} else {
    mediaQuery.addEventListener(aparecerIcono);
} // ESTE ES LA FUNCION PARA QUE EL ICONO DE INICIAR SESIÓN SOLO APAREZCA PARA DISPOSIVOS MOVILES



// AQUI ESTARAN LOS BLOQUES JS PARA LA VISTA DE AGENDAR HORA

// ESTE ES LA FUNCION PARA QUE LA FECHA AL AGENDAR NO SE PUEDA SELECCIONAR ANTERIOR AL DIA ACTUAL
const fechaInicio = document.getElementById('fechaAgendar'); 

if (fechaInicio) {
    const hoy = new Date().toISOString().split('T')[0];


    fechaInicio.setAttribute('min', hoy);

} // ESTE ES LA FUNCION PARA QUE LA FECHA AL AGENDAR NO SE PUEDA SELECCIONAR ANTERIOR AL DIA ACTUAL


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

const inputRut = document.getElementById('rutMascota');

const inputCodUnico = document.getElementById('codUnico');


if (checkboxRut && inputRut && inputCodUnico) {

    function generarCodigoUnico() {

        return Math.floor(100000000 + Math.random() * 900000000).toString();

    }


    function actualizarEstadoCampos() {

        if (checkboxRut.checked) {

            inputRut.disabled = false;
            inputRut.required = true;
            inputRut.focus();

            inputCodUnico.value = '';

        } else {
            
            inputRut.disabled = true;
            inputRut.required = false;
            inputRut.value = '';

            inputCodUnico.value = generarCodigoUnico();

        }

    }

    actualizarEstadoCampos();
    
    checkboxRut.addEventListener('change', actualizarEstadoCampos);
}
// ESTE BLOQUE ES PARA EL RUT/CODUNICO DEL PACIENTE


// AQUI ESTARAN LOS BLOQUES JS PARA LA VISTA DE AGENDAR HORA