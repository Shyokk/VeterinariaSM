import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

export default function Usuarios() {
    const navigate = useNavigate();

    // Estado del usuario autenticado en la sesión actual
    const [usuario, setUsuario] = useState({
        rut: '19.876.543-2',
        nombre: 'María Paz Rojas Silva',
        correo: 'vet.maria@sanmarcos.cl',
        telefono: '+56 9 1234 5678'
    });

    // Función para determinar el rol según el correo
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

    const handleCerrarSesion = () => {
        if (window.confirm('¿Está seguro/a de que desea cerrar la sesión actual?')) {
        alert('Sesión cerrada correctamente.');
        navigate('/login');
        }
    };

    return (
        <Container className="py-5">
        <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white text-center py-3">
                <h3 className="h4 mb-1">Información de la Cuenta Activa</h3>
                <p className="small mb-0 opacity-75">Detalle del usuario autenticado en sesión</p>
                </Card.Header>
                <Card.Body className="p-4">
                <div className="mb-3 border-bottom pb-2">
                    <strong className="d-block text-muted small">RUT / Identificación:</strong>
                    <span id="user-rut" className="fs-6 fw-semibold">{usuario.rut || '-'}</span>
                </div>

                <div className="mb-3 border-bottom pb-2">
                    <strong className="d-block text-muted small">Nombre Completo:</strong>
                    <span id="user-nombre" className="fs-6 fw-semibold">{usuario.nombre || '-'}</span>
                </div>

                <div className="mb-3 border-bottom pb-2">
                    <strong className="d-block text-muted small">Correo Electrónico:</strong>
                    <span id="user-correo" className="fs-6 fw-semibold">{usuario.correo || '-'}</span>
                </div>

                <div className="mb-3 border-bottom pb-2">
                    <strong className="d-block text-muted small">Teléfono:</strong>
                    <span id="user-telefono" className="fs-6 fw-semibold">{usuario.telefono || '-'}</span>
                </div>

                <div className="mb-3 pb-2">
                    <strong className="d-block text-muted small mb-1">Rol en el Sistema:</strong>
                    <Badge 
                    bg={infoRol.esFuncionario ? "info" : "success"} 
                    className="px-3 py-2 fs-6 text-wrap"
                    >
                    {infoRol.nombreRol}
                    </Badge>
                </div>

                <div className="d-grid mt-4">
                    <Button 
                    variant="outline-danger" 
                    id="btn-cerrar-sesion"
                    onClick={handleCerrarSesion}
                    >
                    Cerrar Sesión
                    </Button>
                </div>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    );
}