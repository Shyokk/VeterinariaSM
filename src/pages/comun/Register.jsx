import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

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

    // Función para determinar el rol según el correo ingresado
    const obtenerRolPorCorreo = (correo) => {
        const emailLower = correo.toLowerCase().trim();

        if (!emailLower) {
        return { rol: '', nombreRol: '', esFuncionario: false };
        }

        if (!emailLower.endsWith('@sanmarcos.cl')) {
        return { rol: 'tutor', nombreRol: 'Tutor / Dueño de Mascota', esFuncionario: false };
        }

        if (emailLower.startsWith('admin')) {
        return { rol: 'administrador', nombreRol: 'Administrador de la Clínica', esFuncionario: true };
        }

        if (emailLower.startsWith('vet') || emailLower.startsWith('vete')) {
        return { rol: 'veterinario', nombreRol: 'Veterinario / Personal Médico', esFuncionario: true };
        }

        if (emailLower.startsWith('rec') || emailLower.startsWith('recepcion')) {
        return { rol: 'recepcionista', nombreRol: 'Recepcionista / Atención al Cliente', esFuncionario: true };
        }

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
        <Container className="py-5">
        <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white text-center py-3">
                <h1 className="h3 mb-1">Registro de Usuario</h1>
                <p className="small mb-0 opacity-75">Cree su cuenta para acceder a la plataforma San Marcos</p>
                </Card.Header>

                <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                    {/* INFORMACIÓN PERSONAL */}
                    <h5 className="text-primary border-bottom pb-2 mb-3">Información Personal</h5>
                    <Row className="g-3 mb-4">
                    <Col xs={12} md={4}>
                        <Form.Group controlId="rut">
                        <Form.Label className="fw-semibold small">RUT / Identificación</Form.Label>
                        <Form.Control
                            type="text"
                            name="rut"
                            placeholder="Ej: 12.345.678-K"
                            value={formData.rut}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={4}>
                        <Form.Group controlId="nombres">
                        <Form.Label className="fw-semibold small">Nombres</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombres"
                            placeholder="Ej: Roberto Carlos"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={4}>
                        <Form.Group controlId="apellidos">
                        <Form.Label className="fw-semibold small">Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            name="apellidos"
                            placeholder="Ej: Gómez Bolaños"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    {/* DATOS DE LA CUENTA */}
                    <h5 className="text-primary border-bottom pb-2 mb-3">Tipo de Cuenta y Acceso</h5>
                    <Row className="g-3 mb-3">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="correo">
                        <Form.Label className="fw-semibold small">Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo"
                            placeholder="tutor@gmail.com o vete.juan@sanmarcos.cl"
                            value={formData.correo}
                            onChange={handleChange}
                            isInvalid={!!errorCorreo}
                            required
                        />
                        {errorCorreo && (
                            <Form.Control.Feedback type="invalid">
                            {errorCorreo}
                            </Form.Control.Feedback>
                        )}
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group controlId="tipoUsuario">
                        <Form.Label className="fw-semibold small">Rol / Tipo de Cuenta</Form.Label>
                        <Form.Select
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
                        </Form.Select>
                        </Form.Group>
                    </Col>
                    </Row>

                    {formData.correo.length > 3 && infoRol.nombreRol && (
                    <Alert variant={infoRol.esFuncionario ? "info" : "success"} className="py-2 mb-3 small">
                        <strong>Rol detectado automáticamente:</strong> {infoRol.nombreRol}
                    </Alert>
                    )}

                    <Row className="g-3 mb-4">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="telefono">
                        <Form.Label className="fw-semibold small">Teléfono de contacto</Form.Label>
                        <Form.Control
                            type="tel"
                            name="telefono"
                            placeholder="Ej: +56912345678"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group controlId="contrasena">
                        <Form.Label className="fw-semibold small">Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="contrasena"
                            placeholder="Cree una contraseña segura"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Form.Group controlId="terminos" className="mb-4">
                    <Form.Check
                        type="checkbox"
                        name="terminos"
                        label="Acepto los términos y condiciones de uso"
                        checked={formData.terminos}
                        onChange={handleChange}
                        required
                    />
                    </Form.Group>

                    <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="lg">
                        Registrar Cuenta
                    </Button>
                    <Link to="/login" className="btn btn-outline-secondary">
                        ¿Ya tienes cuenta? Iniciar Sesión
                    </Link>
                    </div>
                </Form>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    );
}