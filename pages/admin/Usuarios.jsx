// Vista de Información de la Cuenta Activa / Usuario en Sesión

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cabecera from '../components/Cabecera';
import PiePagina from '../components/PiePagina';

export default function Usuarios() {
    const navigate = useNavigate();

    // 🔹 Estado del usuario autenticado en la sesión actual
    // (Posteriormente se obtendrá desde localStorage, Context API o Redux)
    const [usuario, setUsuario] = useState({
        rut: '19.876.543-2',
        nombre: 'María Paz Rojas Silva',
        correo: 'vet.maria@sanmarcos.cl', // Puedes probar cambiando a 'cliente@gmail.com'
        telefono: '+56 9 1234 5678'
    });

    // 🔹 Función para determinar el rol según la extensión y prefijo del correo
    const obtenerRolPorCorreo = (correo) => {
        const emailLower = correo.toLowerCase().trim();

        if (!emailLower) {
            return { rol: '', nombreRol: 'Sin Rol', esFuncionario: false };
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

    // 🔹 Acción para Cerrar Sesión
    const handleCerrarSesion = () => {
        if (window.confirm('¿Está seguro/a de que desea cerrar la sesión actual?')) {
            // TODO: Limpiar tokens o datos guardados en el almacenamiento local
            // localStorage.removeItem('token');
            // localStorage.removeItem('usuario');

            alert('Sesión cerrada correctamente.');
            navigate('/login');
        }
    };

    return (
        <>
            <Cabecera />

            <main className="contenido-main">
                <section className="seccion-usuarios">
                    <div className="contenedor-tarjeta-usuario">
                        <h1>Información de la Cuenta Activa</h1>
                        <p>Detalle del usuario autenticado en la sesión actual.</p>

                        <div className="tarjeta-usuario-activa">
                            <div className="campo-detalle">
                                <strong>RUT / Identificación:</strong>
                                <span id="user-rut">{usuario.rut || '-'}</span>
                            </div>

                            <div className="campo-detalle">
                                <strong>Nombre Completo:</strong>
                                <span id="user-nombre">{usuario.nombre || '-'}</span>
                            </div>

                            <div className="campo-detalle">
                                <strong>Correo Electrónico:</strong>
                                <span id="user-correo">{usuario.correo || '-'}</span>
                            </div>

                            <div className="campo-detalle">
                                <strong>Teléfono:</strong>
                                <span id="user-telefono">{usuario.telefono || '-'}</span>
                            </div>

                            <div className="campo-detalle">
                                <strong>Rol en el Sistema:</strong>
                                <span
                                    id="user-rol"
                                    className="badge-rol"
                                    style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        backgroundColor: infoRol.esFuncionario ? '#ebf8ff' : '#f0fff4',
                                        color: infoRol.esFuncionario ? '#2b6cb0' : '#2f855a',
                                        border: `1px solid ${infoRol.esFuncionario ? '#bee3f8' : '#c6f6d5'}`
                                    }}
                                >
                                    {infoRol.nombreRol}
                                </span>
                            </div>
                        </div>

                        <div className="acciones-usuario" style={{ marginTop: '1.5rem' }}>
                            <button
                                id="btn-cerrar-sesion"
                                className="boton boton-secundario"
                                onClick={handleCerrarSesion}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <PiePagina />
        </>
    );
}
