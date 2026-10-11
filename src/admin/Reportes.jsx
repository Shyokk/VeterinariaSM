// Vista para la búsqueda y gestión de Fichas y Reportes Clínicos

import React, { useState } from 'react';
import Cabecera from '../components/Cabecera';
import PiePagina from '../components/PiePagina';

export default function Reportes() {
    // 1. Estado para el término de búsqueda
    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    // 2. Estado para el historial de reportes (datos de prueba iniciales)
    const [historialReportes, setHistorialReportes] = useState([
        {
            id: 1,
            fecha: '2026-09-15',
            tutor: 'Ana López',
            rutTutor: '12.345.678-K',
            mascota: 'Kira',
            especie: 'Perro',
            atencion: 'Vacunación',
            veterinario: 'Dr. Carlos Reyes',
            observaciones: 'Vacuna antirrábica aplicada sin inconvenientes.'
        },
        {
            id: 2,
            fecha: '2026-10-01',
            tutor: 'Roberto Gómez',
            rutTutor: '9.876.543-2',
            mascota: 'Felix',
            especie: 'Gato',
            atencion: 'Consulta General',
            veterinario: 'Dra. María Paz',
            observaciones: 'Control de peso y chequeo de dentadura general.'
        }
    ]);

    // 3. Estado para los campos del formulario de nuevo reporte
    const [nuevoReporte, setNuevoReporte] = useState({
        fecha: '',
        mascota: '',
        especie: 'Perro',
        atencion: '',
        veterinario: 'Vet. San Marcos',
        observaciones: ''
    });

    // Manejador del cambio en el buscador
    const handleBusquedaChange = (e) => {
        setCriterioBusqueda(e.target.value);
    };

    // Manejador del formulario de nuevo reporte
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNuevoReporte((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Agregar nuevo reporte a la tabla
    const handleAgregarReporte = (e) => {
        e.preventDefault();

        const reporteCreado = {
            id: Date.now(),
            fecha: nuevoReporte.fecha,
            tutor: criterioBusqueda || 'Tutor Registrado',
            rutTutor: '12.345.678-K',
            mascota: nuevoReporte.mascota,
            especie: nuevoReporte.especie,
            atencion: nuevoReporte.atencion,
            veterinario: nuevoReporte.veterinario,
            observaciones: nuevoReporte.observaciones
        };

        setHistorialReportes([reporteCreado, ...historialReportes]);

        // Limpiar formulario
        setNuevoReporte({
            fecha: '',
            mascota: '',
            especie: 'Perro',
            atencion: '',
            veterinario: 'Vet. San Marcos',
            observaciones: ''
        });

        alert('¡Ficha/Reporte añadido con éxito al historial!');
    };

    // Filtrar los reportes según la búsqueda realizada por el usuario
    const reportesFiltrados = historialReportes.filter((item) => {
        const busqueda = criterioBusqueda.toLowerCase().trim();
        if (!busqueda) return true;
        return (
            item.tutor.toLowerCase().includes(busqueda) ||
            item.rutTutor.toLowerCase().includes(busqueda) ||
            item.mascota.toLowerCase().includes(busqueda)
        );
    });

    return (
        <>
            <Cabecera />

            <main className="contenido-main">
                <section className="seccion-reportes">
                    <h1>Fichas y Reportes Clínicos</h1>
                    <p>Busque un tutor o paciente por RUT/Nombre para gestionar su historial médico.</p>

                    {/* 1. BLOQUE DE BÚSQUEDA RÁPIDA */}
                    <div className="contenedor-busqueda">
                        <form className="formulario-inline" onSubmit={(e) => e.preventDefault()}>
                            <div className="campo-formulario">
                                <label htmlFor="busqueda-criterio">Buscar por RUT o Nombre del Tutor / Mascota:</label>
                                <input
                                    type="text"
                                    id="busqueda-criterio"
                                    placeholder="Ej: 12.345.678-K, Ana López o Kira"
                                    value={criterioBusqueda}
                                    onChange={handleBusquedaChange}
                                />
                            </div>
                        </form>
                    </div>

                    <hr />

                    {/* 2. RESULTADOS DE LA BÚSQUEDA E HISTORIAL */}
                    <div id="seccion-historial" className="contenedor-tabla">
                        <h2>Historial Clínico del Paciente</h2>

                        <table className="tabla-datos">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Mascota</th>
                                    <th>Especie</th>
                                    <th>Atención</th>
                                    <th>Veterinario</th>
                                    <th>Observaciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-reportes-body">
                                {reportesFiltrados.length > 0 ? (
                                    reportesFiltrados.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.fecha}</td>
                                            <td>{item.mascota}</td>
                                            <td>{item.especie}</td>
                                            <td>{item.atencion}</td>
                                            <td>{item.veterinario}</td>
                                            <td>{item.observaciones}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#718096' }}>
                                            No se encontraron fichas clínicas para el criterio ingresado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 3. FORMULARIO PARA AGREGAR NUEVA VISITA AL PACIENTE ENCONTRADO */}
                    <div className="contenedor-formulario-reporte">
                        <h2>Añadir Nuevo Reporte a esta Ficha</h2>

                        <form id="form-nuevo-reporte" className="formulario-reporte" onSubmit={handleAgregarReporte}>
                            <fieldset>
                                <legend>Detalle de la Nueva Atención</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="fecha-reporte">Fecha:</label>
                                    <input
                                        type="date"
                                        id="fecha-reporte"
                                        name="fecha"
                                        value={nuevoReporte.fecha}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="paciente-reporte">Nombre Mascota:</label>
                                    <input
                                        type="text"
                                        id="paciente-reporte"
                                        name="mascota"
                                        placeholder="Ej: Kira"
                                        value={nuevoReporte.mascota}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="tipo-atencion">Tipo de Atención:</label>
                                    <select
                                        id="tipo-atencion"
                                        name="atencion"
                                        value={nuevoReporte.atencion}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">-- Seleccione --</option>
                                        <option value="Consulta General">Consulta General</option>
                                        <option value="Vacunación">Vacunación</option>
                                        <option value="Cirugía">Cirugía</option>
                                        <option value="Control Sano">Control Sano</option>
                                    </select>
                                </div>

                                <div className="campo-formulario campo-ancho-completo">
                                    <label htmlFor="diagnostico-reporte">Diagnóstico / Observaciones:</label>
                                    <textarea
                                        id="diagnostico-reporte"
                                        name="observaciones"
                                        rows="3"
                                        placeholder="Escriba los detalles de la consulta..."
                                        value={nuevoReporte.observaciones}
                                        onChange={handleFormChange}
                                        required
                                    ></textarea>
                                </div>
                            </fieldset>

                            <div className="acciones-formulario">
                                <button type="submit" className="boton">
                                    Agregar Ficha al Historial
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            <PiePagina />
        </>
    );
}

