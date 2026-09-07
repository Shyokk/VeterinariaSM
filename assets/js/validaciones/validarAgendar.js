export function validarFecha(fecha) {

    if (!fecha) {
        return "Debes seleccionar una fecha.";
    }

    const hoy = new Date();
    const fechaSeleccionada = new Date(fecha + "T12:00:00");

    const hoyTexto = hoy.toISOString().split("T")[0];

    if (fecha < hoyTexto) {
        return "No se puede seleccionar una fecha anterior a hoy";
    }

    const diaSemana = fechaSeleccionada.getDay();

    if (diaSemana === 0 || diaSemana === 6) {
        return "No se puede agendar los fines de semana";
    }

    return "";
}


export function validarHora(hora) {

    if (!hora) {
        return "Debes seleccionar una hora.";
    }

    if (hora < "08:30" || hora > "16:30") {
        return "La agenda es desde 08:30 hasta 16:30.";
    }

    return "";
}