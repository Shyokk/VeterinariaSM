// Registro de usuario con detección automática de Rol según correo corporativo y menú desplegable

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cabecera from '../components/Cabecera';
import PiePagina from '../components/PiePagina';

export default function Register() {
    const [formData, setFormData] = useState({
        rut: '',
        nombres: '',
        apellidos: '',
        tipoUsuario: '',
        correo: '',
        telefono: '',
        contrasena: '',
        terminos: false
    });

    const [errorCorreo, setErrorCorreo] = useState('');

    // 🔹 Tu función para determinar el rol según el correo ingresado
    const obtenerRolPorCorreo = (correo) => {
        const emailLower = correo.toLowerCase().trim();

        if (!emailLower) {
            return { rol: '', nombreRol: '', esFuncionario: false };
        }

        // Si NO pertenece al dominio corporativo, es Tutor
        if (!emailLower.endsWith('@sanmarcos.cl')) {
            return { rol: 'tutor', nombreRol: 'Tutor / Dueño de Mascota', esFuncionario: false };
        }

        // Si pertenece a @sanmarcos.cl, identificamos el cargo específico
        if (emailLower.startsWith('admin')) {
            return { rol: 'administrador', nombreRol: 'Administrador de la Clínica', esFuncionario: true };
        }

        if (emailLower.startsWith('vet') || emailLower.startsWith('vete')) {
            return { rol: 'veterinario', nombreRol: 'Veterinario / Personal Médico', esFuncionario: true };
        }

        if (emailLower.startsWith('rec') || emailLower.startsWith('recepcion')) {
            return { rol: 'recepcionista', nombreRol: 'Recepcionista / Atención al Cliente', esFuncionario: true };
        }

        // Si es @sanmarcos.cl genérico (ej. VeteSM@sanmarcos.cl)
        return { rol: 'funcionario', nombreRol: 'Funcionario General San Marcos', esFuncionario: true };
    };

    const infoRol = obtenerRolPorCorreo(formData.correo);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => {
            const nuevoState = {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            };

            // Si el usuario escribe su correo, autoseleccionamos el rol sugerido en el desplegable
            if (name === 'correo') {
                const rolDetectado = obtenerRolPorCorreo(value);
                if (rolDetectado.rol) {
                    nuevoState.tipoUsuario = rolDetectado.rol;
                }
                setErrorCorreo('');
            }

            return nuevoState;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const esRolFuncionario = ['veterinario', 'recepcionista', 'administrador', 'funcionario'].includes(formData.tipoUsuario);
        const tieneCorreoCorporativo = formData.correo.toLowerCase().trim().endsWith('@sanmarcos.cl');

        // Validación si intenta registrar un rol corporativo con correo genérico
        if (esRolFuncionario && !tieneCorreoCorporativo) {
            setErrorCorreo('Para registrarse como funcionario debe usar un correo corporativo (@sanmarcos.cl).');
            return;
        }

        const datosFinales = {
            ...formData,
            rolCalculado: infoRol.rol
        };

        console.log('Datos de registro exitosos:', datosFinales);
        alert(`Usuario registrado con éxito como: ${infoRol.nombreRol || formData.tipoUsuario}`);
    };

    return (
        <>
            <Cabecera />

            <main className="contenido-main">
                <section className="seccion-formulario-registro">
                    <div className="formulario-registro">
                        <h1>Registro de Usuario</h1>
                        <p>Cree su cuenta para acceder a la plataforma de la Veterinaria San Marcos.</p>

                        <form id="form-registro" onSubmit={handleSubmit}>

                            {/* DATOS PERSONALES */}
                            <fieldset>
                                <legend>Información Personal</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="rut">RUT / Identificación:</label>
                                    <input
                                        type="text"
                                        id="rut"
                                        name="rut"
                                        placeholder="Ej: 12.345.678-K"
                                        value={formData.rut}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="nombres">Nombres:</label>
                                    <input
                                        type="text"
                                        id="nombres"
                                        name="nombres"
                                        placeholder="Ej: Roberto Carlos"
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
                                        placeholder="Ej: Gómez Bolaños"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </fieldset>

                            {/* DATOS DE LA CUENTA */}
                            <fieldset>
                                <legend>Tipo de Cuenta y Acceso</legend>

                                <div className="campo-formulario">
                                    <label htmlFor="correo">Correo electrónico:</label>
                                    <input
                                        type="email"
                                        id="correo"
                                        name="correo"
                                        placeholder="Ej: tutor@gmail.com o vete.juan@sanmarcos.cl"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errorCorreo && (
                                        <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                                            {errorCorreo}
                                        </p>
                                    )}
                                </div>

                                {/* MENÚ DESPLEGABLE CON SELECCIÓN DE ROLES */}
                                <div className="campo-formulario">
                                    <label htmlFor="tipo-usuario">Rol / Tipo de Cuenta:</label>
                                    <select
                                        id="tipo-usuario"
                                        name="tipoUsuario"
                                        value={formData.tipoUsuario}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Seleccione un tipo de cuenta --</option>
                                        <option value="tutor">Tutor / Dueño de Mascota</option>
                                        <option value="veterinario">Veterinario / Personal Médico</option>
                                        <option value="recepcionista">Recepcionista / Atención al Cliente</option>
                                        <option value="administrador">Administrador de la Clínica</option>
                                        <option value="funcionario">Funcionario General San Marcos</option>
                                    </select>
                                </div>

                                {/* INDICADOR VISUAL DEL ROL DETECTADO */}
                                {formData.correo.length > 3 && infoRol.nombreRol && (
                                    <div className="campo-formulario">
                                        <p style={{ fontWeight: 'bold', color: infoRol.esFuncionario ? '#2b6cb0' : '#2f855a' }}>
                                            Rol detectado automáticamente: {infoRol.nombreRol}
                                        </p>
                                    </div>
                                )}

                                <div className="campo-formulario">
                                    <label htmlFor="telefono">Teléfono de contacto:</label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        placeholder="Ej: +56912345678"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="contrasena">Contraseña:</label>
                                    <input
                                        type="password"
                                        id="contrasena"
                                        name="contrasena"
                                        placeholder="Cree una contraseña segura"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario campo-checkbox">
                                    <input
                                        type="checkbox"
                                        id="terminos"
                                        name="terminos"
                                        checked={formData.terminos}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label htmlFor="terminos">Acepto los términos y condiciones de uso</label>
                                </div>
                            </fieldset>

                            {/* BOTONES DE ACCIÓN */}
                            <div className="acciones-formulario">
                                <button type="submit" className="boton">
                                    Registrar Cuenta
                                </button>
                                <Link to="/login" className="boton boton-secundario">
                                    ¿Ya tienes cuenta? Iniciar Sesión
                                </Link>
                            </div>

                        </form>
                    </div>
                </section>
            </main>

            <PiePagina />
        </>
    );
}