// Vista exclusiva para la solicitud y registro de exámenes clínicos del paciente.

import React, { useState } from 'react';
import Cabecera from '../../components/Cabecera';
import PiePagina from '../../components/PiePagina';

export default function NuevoExamen() {
    const [formData, setFormData] = useState({
        especie: '',
        fechaExamen: '',
        motivoExamen: '',
        tipoExamen: '',
        motivoEvaluacion: '',
        resultadosExamen: '',
        veterinario: '',
        observaciones: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        {/* TODO: Conectar con la API o backend cuando corresponda */ }
        console.log('Datos del examen a registrar:', formData);
        alert('Examen registrado con éxito');
    };

    const handleReset = () => {
        setFormData({
            especie: '',
            fechaExamen: '',
            motivoExamen: '',
            tipoExamen: '',
            motivoEvaluacion: '',
            resultadosExamen: '',
            veterinario: '',
            observaciones: ''
        });
    };

    return (
        <>
            <Cabecera />

            <main className="contenido-main">
                <section className="seccion-nuevo-examen">
                    <div className="formulario-examen">
                        <h1>Nuevo Examen</h1>

                        <p>
                            Complete la información del examen y cree un nuevo
                            registro en los antecedentes clínicos del paciente.
                        </p>

                        <form onSubmit={handleSubmit}>

                            {/* DATOS DEL PACIENTE */}
                            <fieldset>
                                <legend>Datos del paciente</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="especie">Especie:</label>

                                    <select
                                        id="especie"
                                        name="especie"
                                        value={formData.especie}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione especie</option>
                                        <option value="perro">Perro</option>
                                        <option value="gato">Gato</option>
                                        <option value="ave">Ave / Conejo</option>
                                    </select>
                                </div>
                            </fieldset>

                            {/* DATOS DEL EXAMEN */}
                            <fieldset>
                                <legend>Datos del examen</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="fecha-examen">Fecha de examen:</label>

                                    <input
                                        type="date"
                                        id="fecha-examen"
                                        name="fechaExamen"
                                        value={formData.fechaExamen}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="motivo-examen">Motivo del examen:</label>

                                    <textarea
                                        id="motivo-examen"
                                        name="motivoExamen"
                                        rows="4"
                                        placeholder="Describa el motivo del examen"
                                        value={formData.motivoExamen}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </fieldset>

                            {/* SOLICITUD / REGISTRO DE EXAMEN */}
                            <fieldset>
                                <legend>Solicitud / Registro de Examen</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="tipo-examen">Examen solicitado:</label>
                                    <select
                                        id="tipo-examen"
                                        name="tipoExamen"
                                        value={formData.tipoExamen}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Seleccione un examen del catálogo --</option>
                                        <option value="EX001">EX001 - Hemograma completo ($22.000)</option>
                                        <option value="EX002">EX002 - Perfil bioquímico completo ($35.000)</option>
                                        <option value="EX003">EX003 - Radiografía (1 proyección) ($28.000)</option>
                                        <option value="EX004">EX004 - Ecografía abdominal ($45.000)</option>
                                        <option value="EX005">EX005 - Test de leishmaniasis ($18.000)</option>
                                    </select>
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="motivo-examen-evaluacion">Motivo del examen y observaciones previos:</label>
                                    <textarea
                                        id="motivo-examen-evaluacion"
                                        name="motivoEvaluacion"
                                        rows="4"
                                        placeholder="Indique los síntomas previos o la razón clínica por la que solicita el examen..."
                                        value={formData.motivoEvaluacion}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="resultados-examen">Resultados o Hallazgos (Opcional):</label>
                                    <textarea
                                        id="resultados-examen"
                                        name="resultadosExamen"
                                        rows="4"
                                        placeholder="Ingrese las observaciones del laboratorio o imágenes obtenidas..."
                                        value={formData.resultadosExamen}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </fieldset>

                            {/* DATOS DEL PROFESIONAL */}
                            <fieldset>
                                <legend>Datos del profesional</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="veterinario">Veterinario responsable:</label>

                                    <input
                                        type="text"
                                        id="veterinario"
                                        name="veterinario"
                                        placeholder="Ingrese el nombre del veterinario"
                                        value={formData.veterinario}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </fieldset>

                            {/* OBSERVACIONES ADICIONALES */}
                            <fieldset>
                                <legend>Observaciones adicionales</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="observaciones">Observaciones:</label>

                                    <textarea
                                        id="observaciones"
                                        name="observaciones"
                                        rows="3"
                                        placeholder="Ingrese observaciones o recomendaciones adicionales para el dueño..."
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </fieldset>

                            {/* BOTONES */}
                            <div className="acciones-formulario">
                                <button type="submit" className="boton">
                                    Registrar examen
                                </button>

                                <button type="button" onClick={handleReset} className="boton boton-secundario">
                                    Limpiar formulario
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