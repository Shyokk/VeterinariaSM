// ESTE ES EL BLOQUE PARA LA GESTION DE CITAS

const citas = { // ESTO SON DATOS DE PRUEBA
    "2026-09-02": [
        {hora: "09:30", mascota: "Max"}
    ],
    "2026-09-03": [
        {hora: "10:30", mascota: "Perrito"}
    ]
}

const horasAgenda = [ // ESTO SON DATOS DE PRUEBA
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

let fechaSeleccionada = new Date(2026, 8, 2);
let mesMostrado = new Date(2026, 8, 1);

const nombresMeses = [ // ESTO SON DATOS DE PRUEBA PORQUE SE USARA UNA API PARA EL CALENDARIO
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]

function formatoFecha(fecha) { // ESTO ES PARA SACAR EL FORMATO DESEADO DE LA FECHA

    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

function renderCalendario() { // ESTO ES PARA EN LOS BLOQUES QUE HICIMOS SE GUARDEN LOS DATOS QUE LE ESTAMOS DANDO

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

        if (i < offset) { // ESTA ES PARA CAMBIAR EL MES

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

        if (formatoFecha(fecha) === formatoFecha(new Date())) { // ESTO ES PARA EL CRONOGRAMA
            boton.classList.add("hoy");
        }

        if (formatoFecha(fecha) === formatoFecha(fechaSeleccionada)) {
            boton.classList.add("seleccionado");
        }

        boton.addEventListener("click", () => seleccionarFecha(fecha));
        contenedor.appendChild(boton);
    }

}

function seleccionarFecha(fecha) {  // ESTA FUNCION ES PARA AL SELECCIONAR ALGUN DIA SE CAMBIE A ESE DIA

    fechaSeleccionada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

    mesMostrado = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), 1);

    renderCalendario();
    renderCronograma();

}

function cambiarMes(direccion) { // ESTA FUNCION LLAMA AL IF PARA MOSTRAR EL MES SIGUIENTE O ANTERIOR

    mesMostrado.setMonth(mesMostrado.getMonth() + direccion);
    renderCalendario();
}


function nombreDia(fecha) { // ESTA FUNCION LLAMA AL IF PARA MOSTRAR LA FECHA EN EL CRONOGRAMA

    return fecha.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric"});

}

function renderCronograma() { // ESTA FUNCION ES PARA MOSTRAR EL CRONOGRAMA

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

function abrirPopupCita() { // ESTA FUNCION MUESTRA LA VENTANA PARA VER LOS DETALLES DE LA CITA

    document.getElementById("popupCita").style.display = "block";

}

function cerrarPopupCita() {  // ESTA FUNCION SACA LA VENTANA DE LOS DETALLES DE LA CITA

    document.getElementById("popupCita").style.display = "none";

}

window.addEventListener("click", function(event) { // ESTA FUNCION ES PARA EL BOTON PARA CERRAR EL POPUP

    const modal = document.getElementById("popupCita");

    if (event.target === modal) {

        cerrarPopupCita();

    }

});

renderCalendario(); // PARA MOSTRAR EL CALENDARIO
renderCronograma(); // PARA MOSTRAR EL CRONOGRAMA
