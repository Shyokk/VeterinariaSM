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

/* MENU HAMBURGUESA */

document.addEventListener("click", event => {

    const botonMenu = event.target.closest(".menu-toggle");

    if (botonMenu) {

        const cabecera = botonMenu.closest(".cabecera");

        if (!cabecera) return;

        const abierto = cabecera.classList.toggle("menu-abierto");

        botonMenu.setAttribute("aria-expanded", abierto);

        return;
    }

    const enlace = event.target.closest(".menu a");

    if (enlace) {

        const cabecera = enlace.closest(".cabecera");
        const boton = cabecera?.querySelector(".menu-toggle");

        if (!cabecera) return;

        cabecera.classList.remove("menu-abierto");

        boton?.setAttribute("aria-expanded", "false");

        return;
    }

    const cabecera = event.target.closest(".cabecera");

    if (!cabecera) {

        document.querySelectorAll(".cabecera.menu-abierto") .forEach(header => {

            header.classList.remove("menu-abierto");

            header.querySelector(".menu-toggle") ?.setAttribute("aria-expanded", "false");

        });

    }

});

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    document.querySelectorAll(".cabecera.menu-abierto").forEach(cabecera => {

        cabecera.classList.remove("menu-abierto");

        cabecera.querySelector(".menu-toggle") ?.setAttribute("aria-expanded", "false");

    });

});


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

}