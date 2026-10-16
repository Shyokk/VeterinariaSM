import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';

export default function Perfil() {
  // Simulación de datos del usuario autenticado
    const [usuario, setUsuario] = useState({
        rut: '19.876.543-2',
        nombres: 'María Paz',
        apellidos: 'Rojas Silva',
        correo: 'vet.maria@sanmarcos.cl',
        telefono: '+56912345678',
        direccion: 'Av. Américo Vespucio 1234, La Cisterna'
    });

    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({ ...usuario });

    // Función para determinar el rol según el correo
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
        <Container className="py-5">
        <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
                <h2 className="h4 mb-0">Mi Perfil</h2>
                <Badge 
                    bg={infoRol.esFuncionario ? "info" : "success"} 
                    className="px-3 py-2 fs-6 text-wrap"
                >
                    {infoRol.nombreRol}
                </Badge>
                </Card.Header>

                <Card.Body className="p-4">
                {!editando ? (
                    /* VISTA DE LECTURA DEL PERFIL */
                    <div>
                    <h5 className="text-primary border-bottom pb-2 mb-3">Información Personal</h5>
                    
                    <Row className="g-3 mb-4">
                        <Col xs={12} sm={6}>
                        <strong className="d-block text-muted small">RUT:</strong>
                        <span className="fs-6 fw-semibold">{usuario.rut}</span>
                        </Col>
                        <Col xs={12} sm={6}>
                        <strong className="d-block text-muted small">Nombre Completo:</strong>
                        <span className="fs-6 fw-semibold">{usuario.nombres} {usuario.apellidos}</span>
                        </Col>
                        <Col xs={12} sm={6}>
                        <strong className="d-block text-muted small">Correo Electrónico:</strong>
                        <span className="fs-6 fw-semibold">{usuario.correo}</span>
                        </Col>
                        <Col xs={12} sm={6}>
                        <strong className="d-block text-muted small">Teléfono:</strong>
                        <span className="fs-6 fw-semibold">{usuario.telefono}</span>
                        </Col>
                        <Col xs={12}>
                        <strong className="d-block text-muted small">Dirección:</strong>
                        <span className="fs-6 fw-semibold">{usuario.direccion}</span>
                        </Col>
                    </Row>

                    <h5 className="text-primary border-bottom pb-2 mb-3">Opciones de Cuenta</h5>
                    {!infoRol.esFuncionario ? (
                        <div className="mb-4">
                        <p className="mb-2">Como Tutor puedes gestionar tus mascotas registradas:</p>
                        <Link to="/mis-mascotas" className="btn btn-outline-primary btn-sm">
                            Ver Mis Mascotas
                        </Link>
                        </div>
                    ) : (
                        <div className="mb-4">
                        <p className="mb-1 fw-semibold text-success">Acceso concedido al Panel Institucional San Marcos.</p>
                        <small className="text-muted">Acceso de Funcionario Activo (@sanmarcos.cl)</small>
                        </div>
                    )}

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="primary" onClick={() => setEditando(true)} className="px-4">
                        Editar Perfil
                        </Button>
                    </div>
                    </div>
                ) : (
                    /* VISTA DE EDICIÓN DEL PERFIL */
                    <Form onSubmit={handleGuardar}>
                    <h5 className="text-primary border-bottom pb-2 mb-3">Editar Datos Personales</h5>

                    <Row className="g-3">
                        <Col xs={12} sm={6}>
                        <Form.Group controlId="nombres">
                            <Form.Label className="fw-semibold small">Nombres</Form.Label>
                            <Form.Control
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                        <Form.Group controlId="apellidos">
                            <Form.Label className="fw-semibold small">Apellidos</Form.Label>
                            <Form.Control
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                        <Form.Group controlId="telefono">
                            <Form.Label className="fw-semibold small">Teléfono</Form.Label>
                            <Form.Control
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                        <Form.Group controlId="direccion">
                            <Form.Label className="fw-semibold small">Dirección</Form.Label>
                            <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            />
                        </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button
                        variant="secondary"
                        onClick={() => {
                            setFormData({ ...usuario });
                            setEditando(false);
                        }}
                        >
                        Cancelar
                        </Button>
                        <Button type="submit" variant="success" className="px-4">
                        Guardar Cambios
                        </Button>
                    </div>
                    </Form>
                )}
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    );
}