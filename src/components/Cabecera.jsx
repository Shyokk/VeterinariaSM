import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

function Cabecera() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          🐾 Veterinaria San Marcos
        </Navbar.Brand>

        {/* Botón hamburguesa automático para dispositivos móviles */}
        <Navbar.Toggle aria-controls="navbar-san-marcos" />

        <Navbar.Collapse id="navbar-san-marcos">
          <Nav className="ms-auto align-items-lg-center gap-2">
            <Nav.Link as={Link} to="/inicio">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/perfil">Mi Perfil</Nav.Link>
            <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
            <Nav.Link as={Link} to="/agendar">Agendar</Nav.Link>
            <Nav.Link as={Link} to="/reportes">Reportes</Nav.Link>
            <Nav.Link as={Link} to="/login" className="btn btn-outline-light text-white ms-lg-2 px-3">
              Acceder
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Cabecera;