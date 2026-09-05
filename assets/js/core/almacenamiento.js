const memoria = Object.create(null);

export function obtener(tabla) {

    return memoria[tabla] ??= [];

}

export function guardar(tabla, registro) {

    obtener(tabla).push(registro);
    return registro;

}

export function reemplazar(tabla, registros) {

    if (!Array.isArray(registros)) {

        throw new TypeError(`El JSON de ${tabla} debe contener un array.`);

    }

    memoria[tabla] = registros;
    return registros;

}

export function limpiar(tabla) {

    memoria[tabla] = [];

}

export function descargar(tabla) {

    const blob = new Blob(

        [JSON.stringify(obtener(tabla), null, 2)],
        { type: "application/json;charset=utf-8" }

    );

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = `${tabla}.json`;
    enlace.click();

    setTimeout(() => URL.revokeObjectURL(url), 0);

}

export async function cargar(tabla, ruta = `./assets/data/${tabla}.json`) {

    const respuesta = await fetch(ruta, { cache: "no-store" });

    if (!respuesta.ok) {

        throw new Error(`No se pudo cargar ${ruta} (${respuesta.status}).`);

    }

    const registros = await respuesta.json();
    return reemplazar(tabla, registros);
    
}
