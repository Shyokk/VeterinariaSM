import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Table, Button } from 'react-bootstrap';

export default function Reportes() {
  // 1. Estado para el término de búsqueda
    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    // 2. Estado para el historial de reportes
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

    // 3. Estado para el formulario de nuevo reporte
    const [nuevoReporte, setNuevoReporte] = useState({
        fecha: '',
        mascota: '',
        especie: 'Perro',
        atencion: '',
        veterinario: 'Vet. San Marcos',
        observaciones: ''
    });

    const handleBusquedaChange = (e) => {
        setCriterioBusqueda(e.target.value);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNuevoReporte((prev) => ({
        ...prev,
        [name]: value
        }));
    };

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
        <Container className="py-5">
        <Row className="justify-content-center mb-4">
            <Col xs={12} lg={10}>
            <div className="text-center mb-4">
                <h1 className="h2 text-primary fw-bold">Fichas y Reportes Clínicos</h1>
                <p className="text-muted">Busque un tutor o paciente por RUT/Nombre para gestionar su historial médico.</p>
            </div>

            {/* 1. BLOQUE DE BÚSQUEDA RÁPIDA */}
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body className="p-4">
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Form.Group controlId="busqueda-criterio">
                    <Form.Label className="fw-semibold">Buscar por RUT o Nombre del Tutor / Mascota:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ej: 12.345.678-K, Ana López o Kira"
                        value={criterioBusqueda}
                        onChange={handleBusquedaChange}
                    />
                    </Form.Group>
                </Form>
                </Card.Body>
            </Card>

            {/* 2. TABLA DE HISTORIAL CLÍNICO RESPONSIVA */}
            <Card className="shadow-sm border-0 mb-5">
                <Card.Header className="bg-primary text-white py-3">
                <h2 className="h5 mb-0">Historial Clínico del Paciente</h2>
                </Card.Header>
                <Card.Body className="p-0">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>Fecha</th>
                        <th>Mascota</th>
                        <th>Especie</th>
                        <th>Atención</th>
                        <th>Veterinario</th>
                        <th>Observaciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportesFiltrados.length > 0 ? (
                        reportesFiltrados.map((item) => (
                        <tr key={item.id}>
                            <td className="text-nowrap">{item.fecha}</td>
                            <td className="fw-semibold">{item.mascota}</td>
                            <td>{item.especie}</td>
                            <td>{item.atencion}</td>
                            <td>{item.veterinario}</td>
                            <td>{item.observaciones}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                            No se encontraron fichas clínicas para el criterio ingresado.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                </Card.Body>
            </Card>

            {/* 3. FORMULARIO PARA AGREGAR NUEVO REPORTE */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-secondary text-white py-3">
                <h2 className="h5 mb-0">Añadir Nuevo Reporte a esta Ficha</h2>
                </Card.Header>
                <Card.Body className="p-4">
                <Form onSubmit={handleAgregarReporte}>
                    <Row className="g-3 mb-3">
                    <Col xs={12} md={4}>
                        <Form.Group controlId="fecha-reporte">
                        <Form.Label className="fw-semibold small">Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha"
                            value={nuevoReporte.fecha}
                            onChange={handleFormChange}
                            required
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={4}>
                        <Form.Group controlId="paciente-reporte">
                        <Form.Label className="fw-semibold small">Nombre Mascota</Form.Label>
                        <Form.Control
                            type="text"
                            name="mascota"
                            placeholder="Ej: Kira"
                            value={nuevoReporte.mascota}
                            onChange={handleFormChange}
                            required
                        />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={4}>
                        <Form.Group controlId="tipo-atencion">
                        <Form.Label className="fw-semibold small">Tipo de Atención</Form.Label>
                        <Form.Select
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
                        </Form.Select>
                        </Form.Group>
                    </Col>
                    </Row>

                    <Form.Group controlId="diagnostico-reporte" className="mb-4">
                    <Form.Label className="fw-semibold small">Diagnóstico / Observaciones</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="observaciones"
                        placeholder="Escriba los detalles de la consulta..."
                        value={nuevoReporte.observaciones}
                        onChange={handleFormChange}
                        required
                    />
                    </Form.Group>

                    <div className="d-grid">
                    <Button type="submit" variant="success" size="lg">
                        Agregar Ficha al Historial
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