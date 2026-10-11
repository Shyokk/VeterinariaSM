import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Navegacion() {
  return (
    <Navbar expand="lg" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Veterinaria San Marcos</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            {/* General */}
            <NavLink className="nav-link" to="/">Inicio</NavLink>
            <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>
            <NavLink className="nav-link" to="/perfil">Mi Perfil</NavLink>

            {/* Recepción & Usuario */}
            <NavLink className="nav-link" to="/agendar">Agendar</NavLink>
            <NavLink className="nav-link" to="/mis-mascotas">Mis Mascotas</NavLink>

            {/* Menú Desplegable Veterinario */}
            <NavDropdown title="Veterinario" id="menu-veterinario">
              <NavDropdown.Item as={NavLink} to="/pacientes">Pacientes</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/historial">Historial</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/crear-ficha">Crear Ficha</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="/nueva-receta">Nueva Receta</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/nueva-vacuna">Nueva Vacuna</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/nuevo-diagnostico">Nuevo Diagnóstico</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/nuevo-examen">Nuevo Examen</NavDropdown.Item>
            </NavDropdown>

            {/* Menú Desplegable Administración */}
            <NavDropdown title="Administración" id="menu-admin">
              <NavDropdown.Item as={NavLink} to="/gestion">Gestión</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/reportes">Reportes</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/usuarios">Usuarios</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/admin-actividades">Actividades</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;