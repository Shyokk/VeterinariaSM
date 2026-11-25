import {obtener} from "../js/core/almacenamiento.js";

const storageKey = "fichas";

const parametros = new URLSearchParams(window.location.search);

const codUnico = parametros.get("codUnico");

const rut = document.getElementById("rut");
const nombreTutor = document.getElementById("nombreTutor");
const nombreMascota = document.getElementById("nombreMascota");
const codigoUnico = document.getElementById("codUnico");
const nacimientoMascota = document.getElementById("nacimientoMascota");
const edadMascota = document.getElementById("edadMascota");
const pelajeMascota = document.getElementById("pelajeMascota");
const ciudadMascota = document.getElementById("ciudadMascota");
const especie = document.getElementById("especie");
const raza = document.getElementById("raza");

function obtenerPaciente() {

    const pacientes = obtener(storageKey);
    return pacientes.find(paciente => paciente.codUnico === codUnico);

}

function mostrarPaciente() {

    const paciente = obtenerPaciente();

    if (!paciente) {
        console.error("No se encontró paciente");
        return;
    }

    rut.textContent = paciente.rut ?? "";
    nombreTutor.textContent = paciente.nombreTutor ?? "";
    nombreMascota.textContent = paciente.mascota ?? "";
    codigoUnico.textContent = paciente.codUnico ?? "";
    nacimientoMascota.textContent = paciente.nacimientoMascota ?? "";
    edadMascota.textContent = paciente.edadMascota ?? "";
    pelajeMascota.textContent = paciente.pelajeMascota ?? "";
    ciudadMascota.textContent = paciente.ciudadMascota ?? "";
    especie.textContent = paciente.especie ?? "";
    raza.textContent = paciente.raza ?? "";

}

const botonesAccion = document.querySelectorAll(".btnAccion");

botonesAccion.forEach(boton => {

    boton.addEventListener("click", () => {

        const vista = boton.dataset.vista;
        if (!vista || !codUnico) return;

        window.location.href = `${vista}?codUnico=${encodeURIComponent(codUnico)}`;

    });

});

mostrarPaciente();