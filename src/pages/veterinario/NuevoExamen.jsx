import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

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
        <Container className="py-5">
        <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white text-center py-3">
                <h1 className="h3 mb-1">Nuevo Examen</h1>
                <p className="small mb-0 opacity-75">
                    Complete la información del examen y cree un nuevo registro en los antecedentes clínicos del paciente.
                </p>
                </Card.Header>

                <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                    {/* DATOS DEL PACIENTE */}
                    <h5 className="text-primary border-bottom pb-2 mb-3">Datos del paciente</h5>
                    <Row className="g-3 mb-4">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="especie">
                        <Form.Label className="fw-semibold small">Especie</Form.Label>
                        <Form.Select
                            name="especie"
                            value={formData.especie}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione especie</option>
                            <option value="perro">Perro</option>
                            <option value="gato">Gato</option>
                            <option value="ave">Ave / Conejo</option>
                        </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group controlId="fechaExamen">
                        <Form.Label className="fw-semibold small">Fecha de examen</Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaExamen"
                            value={formData.fechaExamen}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    {/* DATOS DEL EXAMEN Y SOLICITUD */}
                    <h5 className="text-primary border-bottom pb-2 mb-3">Solicitud y Detalle del Examen</h5>
                    <Row className="g-3 mb-4">
                    <Col xs={12}>
                        <Form.Group controlId="tipoExamen">
                        <Form.Label className="fw-semibold small">Examen solicitado</Form.Label>
                        <Form.Select
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
                        </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col xs={12}>
                        <Form.Group controlId="motivoExamen">
                        <Form.Label className="fw-semibold small">Motivo del examen y observaciones previos</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="motivoExamen"
                            placeholder="Describa el motivo o síntomas previos que justifican el examen..."
                            value={formData.motivoExamen}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12}>
                        <Form.Group controlId="resultadosExamen">
                        <Form.Label className="fw-semibold small">Resultados o Hallazgos (Opcional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="resultadosExamen"
                            placeholder="Ingrese las observaciones del laboratorio o imágenes obtenidas..."
                            value={formData.resultadosExamen}
                            onChange={handleChange}
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    {/* DATOS DEL PROFESIONAL Y ADICIONALES */}
                    <h5 className="text-primary border-bottom pb-2 mb-3">Datos del Profesional y Observaciones</h5>
                    <Row className="g-3 mb-4">
                    <Col xs={12} md={6}>
                        <Form.Group controlId="veterinario">
                        <Form.Label className="fw-semibold small">Veterinario responsable</Form.Label>
                        <Form.Control
                            type="text"
                            name="veterinario"
                            placeholder="Ingrese el nombre del veterinario"
                            value={formData.veterinario}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12}>
                        <Form.Group controlId="observaciones">
                        <Form.Label className="fw-semibold small">Observaciones adicionales</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="observaciones"
                            placeholder="Ingrese observaciones o recomendaciones adicionales para el dueño..."
                            value={formData.observaciones}
                            onChange={handleChange}
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    {/* BOTONES */}
                    <div className="d-flex justify-content-end gap-2">
                    <Button type="button" variant="outline-secondary" onClick={handleReset}>
                        Limpiar formulario
                    </Button>
                    <Button type="submit" variant="primary" className="px-4">
                        Registrar examen
                    </Button>
                    </div>
                </Form>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    );
}