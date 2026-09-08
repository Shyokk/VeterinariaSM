export function mostrarDatos(datos, contenedor = document) {

    if (!datos) return;

    const elementos = contenedor.querySelectorAll("[data-campo]");

    elementos.forEach(elemento => {

        const campo = elemento.dataset.campo;

        if (!(campo in datos)) return;

        elemento.textContent = datos[campo] ?? "";

    });

}