// Vista del Perfil de Usuario (Muestra información personal y datos según el Rol)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cabecera from '../components/Cabecera';
import PiePagina from '../components/PiePagina';

export default function Perfil() {
    // 🔹 Simulación de datos del usuario autenticado en la sesión
    const [usuario, setUsuario] = useState({
        rut: '19.876.543-2',
        nombres: 'María Paz',
        apellidos: 'Rojas Silva',
        correo: 'vet.maria@sanmarcos.cl', // Puedes probar cambiando a 'maria@gmail.com'
        telefono: '+56912345678',
        direccion: 'Av. Américo Vespucio 1234, La Cisterna'
    });

    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({ ...usuario });

    // 🔹 Función para determinar el rol según el correo
    const obtenerRolPorCorreo = (correo) => {
        const emailLower = correo.toLowerCase().trim();

        if (!emailLower) {
            return { rol: '', nombreRol: 'Usuario', esFuncionario: false };
        }

        if (!emailLower.endsWith('@sanmarcos.cl')) {
            return { rol: 'tutor', nombreRol: 'Tutor / Dueño de Mascota', esFuncionario: false };
        }

        if (emailLower.startsWith('admin')) {
            return { rol: 'administrador', nombreRol: 'Administrador/a de la Clínica', esFuncionario: true };
        }

        if (emailLower.startsWith('vet') || emailLower.startsWith('vete')) {
            return { rol: 'veterinario', nombreRol: 'Veterinario/a Clínico', esFuncionario: true };
        }

        if (emailLower.startsWith('rec') || emailLower.startsWith('recepcion')) {
            return { rol: 'recepcionista', nombreRol: 'Recepcionista', esFuncionario: true };
        }

        return { rol: 'funcionario', nombreRol: 'Funcionario/a San Marcos', esFuncionario: true };
    };

    const infoRol = obtenerRolPorCorreo(usuario.correo);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        setUsuario({ ...formData });
        setEditando(false);
        alert('Perfil actualizado correctamente.');
    };

    return (
        <>
            <Cabecera />

            <main className="contenido-main">
                <section className="seccion-perfil">
                    <div className="contenedor-perfil">

                        <h1>Mi Perfil</h1>

                        {/* BADGE DEL ROL */}
                        <div className="tarjeta-rol-perfil" style={{ marginBottom: '1.5rem' }}>
                            <span
                                className="badge-rol"
                                style={{
                                    display: 'inline-block',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    backgroundColor: infoRol.esFuncionario ? '#ebf8ff' : '#f0fff4',
                                    color: infoRol.esFuncionario ? '#2b6cb0' : '#2f855a',
                                    border: `1px solid ${infoRol.esFuncionario ? '#bee3f8' : '#c6f6d5'}`
                                }}
                            >
                                {infoRol.nombreRol}
                            </span>
                        </div>

                        {!editando ? (
                            /* VISTA DE LECTURA DEL PERFIL */
                            <div className="detalle-perfil">
                                <fieldset>
                                    <legend>Información Personal</legend>
                                    <p><strong>RUT:</strong> {usuario.rut}</p>
                                    <p><strong>Nombre Completo:</strong> {usuario.nombres} {usuario.apellidos}</p>
                                    <p><strong>Correo Electrónico:</strong> {usuario.correo}</p>
                                    <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                                    <p><strong>Dirección:</strong> {usuario.direccion}</p>
                                </fieldset>

                                {/* OPCIONES EXCLUSIVAS SEGÚN EL ROL */}
                                <fieldset style={{ marginTop: '1.5rem' }}>
                                    <legend>Opciones de Cuenta</legend>
                                    {!infoRol.esFuncionario ? (
                                        <div>
                                            <p>Como Tutor puedes gestionar tus mascotas registradas:</p>
                                            <Link to="/mis-mascotas" className="boton" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                                                Ver Mis Mascotas
                                            </Link>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>Acceso concedido al Panel Institucional San Marcos.</p>
                                            <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                                                Acceso de Funcionario Activo (@sanmarcos.cl)
                                            </span>
                                        </div>
                                    )}
                                </fieldset>

                                <div className="acciones-perfil" style={{ marginTop: '1.5rem' }}>
                                    <button className="boton" onClick={() => setEditando(true)}>
                                        Editar Perfil
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* VISTA DE EDICIÓN DEL PERFIL */
                            <form onSubmit={handleGuardar} className="formulario-perfil">
                                <fieldset>
                                    <legend>Editar Datos Personales</legend>

                                    <div className="campo-formulario">
                                        <label htmlFor="nombres">Nombres:</label>
                                        <input
                                            type="text"
                                            id="nombres"
                                            name="nombres"
                                            value={formData.nombres}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="campo-formulario">
                                        <label htmlFor="apellidos">Apellidos:</label>
                                        <input
                                            type="text"
                                            id="apellidos"
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="campo-formulario">
                                        <label htmlFor="telefono">Teléfono:</label>
                                        <input
                                            type="tel"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="campo-formulario">
                                        <label htmlFor="direccion">Dirección:</label>
                                        <input
                                            type="text"
                                            id="direccion"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </fieldset>

                                <div className="acciones-formulario" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="boton">
                                        Guardar Cambios
                                    </button>
                                    <button
                                        type="button"
                                        className="boton boton-secundario"
                                        onClick={() => {
                                            setFormData({ ...usuario });
                                            setEditando(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </section>
            </main>

            <PiePagina />
        </>
    );
}