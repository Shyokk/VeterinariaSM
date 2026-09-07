const memoria = Object.create(null); // GUARDA LOS DATOS PARA NO ESTAR LEYENDO A CADA RATO

function leerLocalStorage(tabla) { // LEE Y DEVUELVE LOS DATOS

    const datosGuardados = localStorage.getItem(tabla);

    if (!datosGuardados) { // SI NO HAY NADA GUARDADO
        return [];
    }

    try { // SI HAY GUARDADO

        const datos = JSON.parse(datosGuardados);

        if (!Array.isArray(datos)) { // VEO QUE SEA LISTA VALIDADA

            console.warn(`El contenido de "${tabla}" no es un array. Se utilizará un array vacío.`);
            return [];

        }

        return datos;

    } catch (error) { // SI SALTA UN ERROR ATRAPA EL ERROR

        console.error(`El contenido de localStorage "${tabla}" no es un JSON válido.`, error);
        return [];

    }
}

export function obtener(tabla) { // DEVUELVE LOS DATOS O LOS TRAE SI ES LA PRIMERA VEZ

    if (!memoria[tabla]) {
        memoria[tabla] = leerLocalStorage(tabla);
    }

    return memoria[tabla];

}

export function guardar(tabla, registro) { // AGREGA REGISTRO NUEVO

    const registros = obtener(tabla);

    registros.push(registro);

    localStorage.setItem(tabla, JSON.stringify(registros));

    return registro;

}

export function reemplazar(tabla, registros) { // REEMPLAZA POR UNA NUEVA LISTA

    if (!Array.isArray(registros)) { // SI NO ES LISTA ERROR
        throw new TypeError(`El JSON de ${tabla} debe contener una lista.`);
    }

    memoria[tabla] = registros;

    localStorage.setItem(tabla, JSON.stringify(registros));

    return registros;

}

export function limpiar(tabla) { // BORRA LOS DATOS

    memoria[tabla] = [];

    localStorage.removeItem(tabla);

}

export function descargar(tabla) { // DESCARGA LOS DATOS

    const blob = new Blob([JSON.stringify(obtener(tabla),null,2)],{type: "application/json;charset=utf-8"});

    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = `${tabla}.json`;
    enlace.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 0);

}

// NO SE SI FUNCIONA, NO LO PROBÉ PERO DEBERIA 
// SERVIR PARA SUBIR UN JSON YA CON DATOS

export async function cargar(tabla, ruta = `./assets/data/${tabla}.json`) {

    const respuesta = await fetch(ruta,{cache: "no-store"});

    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${ruta} (${respuesta.status}).`);
    }

    const registros = await respuesta.json();

    return reemplazar(tabla, registros);

}