// EN ESTE JAVASCRIPT ESTARÁN LOS SCRIPST PARA LA PAGINA

{fetch('header.html')
    .then(response => response.text())
    .then(data => document.getElementById('header-contenedor').innerHTML = data);

}

{fetch('footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer-contenedor').innerHTML = data);
}