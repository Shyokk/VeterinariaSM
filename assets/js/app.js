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