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

    fechaInicio.addEventListener('input', function() {

        const fechaSeleccionada = this.value;
        const fechaObj = new Date(fechaSeleccionada + 'T12:00:00'); 
        const diaSemana = fechaObj.getDay(); 
        
        // getDay() devuelve 0 para Domingo y 6 para Sábado
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
            // Permitir escribir el RUT
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


// AQUI ESTARAN LOS BLOQUES JS PARA LA VISTA DE AGENDAR HORA


// ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA
const fechaDespues = document.getElementById('nacimientoMascota'); 

if (fechaDespues) {
    const hoy = new Date().toISOString().split('T')[0];


    fechaDespues.setAttribute('max', hoy);

} // ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA


// ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA
function abrirPreviewConsulta() {
    const modal = document.getElementById('previewConsulta')
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarPreviewConsulta() {
    const modal = document.getElementById('previewConsulta');
    if (modal) {
        modal.style.display = 'none';
    }
} // ESTE ES LA FUNCION PARA QUE LA FECHA DE NACIMIENTO NO SEA FUTURA

// ESTE ES EL BLOQUE PARA LA GESTION DE CITAS

const citas = {
    "2026-09-02": [
        {hora: "09:30", mascota: "Max"}
    ],
    "2026-09-03": [
        {hora: "10:30", mascota: "Perrito"}
    ]
}

const horasAgenda = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

let fechaSeleccionada = new Date(2026, 8, 2);
let mesMostrado = new Date(2026, 8, 1);

const nombresMeses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]

function formatoFecha(fecha) {

    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

function renderCalendario() {

    const contenedor = document.getElementById('diasCalendario');
    const titulo = document.getElementById('mesAno');
    contenedor.innerHTML = '';

    titulo.textContent = `${nombresMeses[mesMostrado.getMonth()]} ${mesMostrado.getFullYear()}`;

    const primerDia = new Date(mesMostrado.getFullYear(), mesMostrado.getMonth(), 1);

    const offset = (primerDia.getDay() + 6) % 7;
    const diasMes = new Date( mesMostrado.getFullYear(), mesMostrado.getMonth() + 1,0).getDate();

    const diasMesAnterior = new Date( mesMostrado.getFullYear(), mesMostrado.getMonth(), 0).getDate();

    const totalCeldas = Math.ceil((offset + diasMes) / 7) * 7;

    for (let i = 0; i < totalCeldas; i++) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "dia-calendario";

        let dia;
        let mes = mesMostrado.getMonth();
        let anio = mesMostrado.getFullYear();

        if (i < offset) {

            dia = diasMesAnterior - offset + i + 1;
            mes--;
            
            if (mes < 0) { 
                mes = 11; anio--; 
            }

            boton.classList.add("otro-mes");

        } else if (i >= offset + diasMes) {

            dia = i - offset - diasMes + 1;
            mes++;

            if (mes > 11) { 
                mes = 0; anio++; 
            }

            boton.classList.add("otro-mes");

        } else {

            dia = i - offset + 1;
        }
        

        const fecha = new Date(anio, mes, dia);
        boton.textContent = dia;

        if (formatoFecha(fecha) === formatoFecha(new Date())) {
            boton.classList.add("hoy");
        }

        if (formatoFecha(fecha) === formatoFecha(fechaSeleccionada)) {
            boton.classList.add("seleccionado");
        }

        boton.addEventListener("click", () => seleccionarFecha(fecha));
        contenedor.appendChild(boton);
    }

}

function seleccionarFecha(fecha) {

    fechaSeleccionada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

    mesMostrado = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), 1);

    renderCalendario();
    renderCronograma();

}

function cambiarMes(direccion) {

    mesMostrado.setMonth(mesMostrado.getMonth() + direccion);
    renderCalendario();
}


function nombreDia(fecha) {

    return fecha.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric"});

}

function renderCronograma() {

    const fechaKey = formatoFecha(fechaSeleccionada);
    const citasDelDia = citas[fechaKey] || [];
    const titulo = document.getElementById("fechaSeleccionada");
    const cronograma = document.getElementById("cronograma");

    titulo.textContent = nombreDia(fechaSeleccionada);
    cronograma.innerHTML = "";

    horasAgenda.forEach(hora => {

        const bloque = document.createElement("div");
        bloque.className = "bloque-hora";

        const etiqueta = document.createElement("div");
        etiqueta.className = "hora-etiqueta";
        etiqueta.textContent = `${hora} hrs.`;

        const espacio = document.createElement("div");
        espacio.className = "espacio-citas";

        const citasHora = citasDelDia.filter(cita => cita.hora.startsWith(hora.split(":")[0] + ":"));

        if (citasHora.length) {

            citasHora.forEach(cita => {

                const citaElemento = document.createElement("div");
                citaElemento.className = "cita-aprobada";
                citaElemento.innerHTML = `<strong>${cita.hora}</strong> - ${cita.mascota}`;
                citaElemento.addEventListener("click", abrirPopupCita);
                espacio.appendChild(citaElemento);

            });

        } else {

            const sinCitas = document.createElement("div");
            sinCitas.className = "sin-citas";
            sinCitas.textContent = "Sin citas";
            espacio.appendChild(sinCitas);

        }

        bloque.appendChild(etiqueta);
        bloque.appendChild(espacio);
        cronograma.appendChild(bloque);
    });
}

function abrirPopupCita() {

    document.getElementById("popupCita").style.display = "block";

}

function cerrarPopupCita() {

    document.getElementById("popupCita").style.display = "none";

}

window.addEventListener("click", function(event) {

    const modal = document.getElementById("popupCita");

    if (event.target === modal) {

        cerrarPopupCita();

    }

});

renderCalendario();
renderCronograma();


// ESTE ES EL BLOQUE PARA LA GESTION DE CITAS