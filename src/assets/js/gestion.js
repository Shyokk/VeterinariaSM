import {obtener} from "../js/core/almacenamiento.js";

const storageKey = "fichas";

const tbody = document.getElementById("tablaPacientes");
const plantilla = document.getElementById("plantillaPaciente");

const filtroPaciente = document.getElementById("filtroPaciente");
const filtroCodunico = document.getElementById("filtroCodunico");
const filtroRutTutor = document.getElementById("filtroRutTutor");
const filtroEspecie = document.getElementById("filtro-especie");

const paginaAnterior = document.getElementById("paginaAnterior");
const paginaSiguiente = document.getElementById("paginaSiguiente");
const numerosPaginas = document.getElementById("numerosPaginas");
const cantidadPacientes = document.getElementById("cantidadPacientes");

let paginaActual = 1;
let pacientesPorPagina = Number(cantidadPacientes.value);
let pacientesFiltrados = [];

function obtenerPacientes() { // ESTA FUNCION CARGA LOS PACIENTES

    return obtener(storageKey);

}

function renderPacientes(pacientes) { // ESTA FUNCION MUESTRA LOS PACIENTES

    if (!tbody || !plantilla) {
        return;
    }

    tbody.innerHTML = "";

    pacientes.forEach(paciente => {
        
        const fila = plantilla.content.cloneNode(true);

        const campos = {

            codUnico: paciente.codUnico,
            mascota: paciente.mascota,
            especie: paciente.especie,
            rut: paciente.rut,
            nombreTutor: paciente.nombreTutor

        };

        Object.entries(campos).forEach(([nombre, valor]) => {

            const elemento = fila.querySelector(`[data-campo="${nombre}"]`);

            if (elemento) {
                elemento.textContent = valor ?? "";
            }

        });

        const botonHistorial = fila.querySelector(".btnHistorial");

        if (botonHistorial) {

            botonHistorial.addEventListener("click", () => {

                window.location.href = `historial.html?codUnico=${encodeURIComponent(paciente.codUnico)}`;

            });

        }

        tbody.appendChild(fila);

    });

}

function filtrarPacientes() {

    const pacientes = obtenerPacientes();

    const textoPaciente = filtroPaciente.value.trim().toLowerCase();
    const textoCodUnico = filtroCodunico.value.trim().toLowerCase();
    const textoRutTutor = filtroRutTutor.value.trim().toLowerCase();
    const especieSeleccionada = filtroEspecie.value.trim().toLowerCase();

    pacientesFiltrados = pacientes.filter(paciente => {

        const nombrePaciente = String(paciente.mascota ?? "").toLocaleLowerCase();
        const codUnico = String(paciente.codUnico ?? "").toLowerCase();
        const rutTutor = String(paciente.rut ?? "").toLowerCase();
        const especie = String(paciente.especie ?? "").toLowerCase();

        const coicidePaciente = nombrePaciente.includes(textoPaciente);
        const coincideCodUnico = codUnico.includes(textoCodUnico);
        const coincideRutTutor = rutTutor.includes(textoRutTutor);
        const coincideEspecie = !especieSeleccionada || especie === especieSeleccionada;

        return (coicidePaciente && coincideCodUnico && coincideRutTutor && coincideEspecie);

    });

    paginaActual = 1;

    actualizarTabla();

}

function actualizarTabla() {

    const totalPacientes = pacientesFiltrados.length;
    const totalPaginas = Math.ceil(totalPacientes / pacientesPorPagina);

    if (paginaActual > totalPaginas && totalPaginas > 0) {
        paginaActual = totalPaginas;
    }

    const inicio = (paginaActual -1) * pacientesPorPagina;
    const fin = inicio + pacientesPorPagina;
    const pacientesPagina = pacientesFiltrados.slice(inicio, fin);

    renderPacientes(pacientesPagina);
    renderPaginacion(totalPaginas);

}

function renderPaginacion(totalPaginas) {

    numerosPaginas.innerHTML = "";

    if (totalPaginas === 0) {
        paginaAnterior.disabled = true;
        paginaSiguiente.disabled = true;
        return;
    }

    paginaAnterior.disabled = paginaActual === 1;

    for (
        let numero = 1;
        numero <= totalPaginas;
        numero++
    ) {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = numero;

        if (numero === paginaActual) {
            boton.classList.add("activa");
        }

        boton.addEventListener("click", () => {
            paginaActual = numero;
            actualizarTabla();
        });

        numerosPaginas.appendChild(boton);

    }

    paginaSiguiente.disabled = paginaActual === totalPaginas;

}

paginaSiguiente?.addEventListener("click", () => {

    const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina);

    if (paginaActual < totalPaginas) {
        paginaActual++;
        actualizarTabla();
    }

});

paginaAnterior?.addEventListener("click", () => {

    const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina);

    if (paginaActual < totalPaginas) {
        paginaActual--;
        actualizarTabla();
    }

});

cantidadPacientes?.addEventListener("change", () => {

    pacientesPorPagina = Number(cantidadPacientes.value);
    paginaActual = 1;
    actualizarTabla();

});

filtroPaciente?.addEventListener("input", filtrarPacientes);
filtroCodunico?.addEventListener("input", filtrarPacientes);
filtroRutTutor?.addEventListener("input", filtrarPacientes);
filtroEspecie?.addEventListener("change", filtrarPacientes);

pacientesFiltrados = obtenerPacientes();

actualizarTabla();