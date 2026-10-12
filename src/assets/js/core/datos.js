export function convertirElemento(elemento) {

    const { name, type, value, checked, files, multiple } = elemento;

    if (!name || ["submit", "button", "reset"].includes(type)) {
        return undefined;
    }

    if (type === "checkbox") {
        return checked;
    }

    if (type === "radio") {
        return checked ? value : undefined;
    }

    if (type === "file") {

        const lista = [...(files ?? [])].map(file => ({

            nombre: file.name,
            tipo: file.type,
            tamaño: file.size,
            ultimaModificacion: file.lastModified

        }));

        return multiple ? lista : (lista[0] ?? null);

    }

    if (["number", "range"].includes(type)) {
        return value === "" ? null : Number(value);
    }

    if (elemento instanceof HTMLSelectElement && multiple) {
        return [...elemento.selectedOptions].map(opcion => opcion.value);
    }

    return value;

}

export function obtenerDatos(formulario) {

    const datos = {};
    const radios = new Map();

    for (const elemento of formulario.elements) {

        if (!elemento.name || ["submit", "button", "reset"].includes(elemento.type)) {
            continue;
        }

        if (elemento.type === "radio") {

            if (!radios.has(elemento.name)) {
                radios.set(elemento.name, null);
            }

            if (elemento.checked) {
                radios.set(elemento.name, elemento.value);
            }

            continue;

        }

        const valor = convertirElemento(elemento);

        if (valor !== undefined) {
            datos[elemento.name] = valor;
        }

    }

    for (const [nombre, valor] of radios) {
        datos[nombre] = valor;
    }

    return datos;

}
