import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { ETIQUETA_ROL, puedeAcceder } from '../utils/roles.js';
import { nombreCompleto } from '../utils/formato.js';

// Cada enlace del menú; solo se muestra si el rol del usuario puede acceder a la ruta (utils/roles.js).
const GRUPO_CLINICA = [
  { to: '/pacientes', texto: 'Pacientes' },
  { to: '/historial', texto: 'Historial clínico' },
  { to: '/crear-ficha', texto: 'Crear ficha' },
  { to: '/nuevo-diagnostico', texto: 'Nuevo diagnóstico' },
  { to: '/nueva-vacuna', texto: 'Nueva vacuna' },
  { to: '/nueva-receta', texto: 'Nueva receta' },
  { to: '/nuevo-examen', texto: 'Nuevo examen' },
];

const GRUPO_ADMIN = [
  { to: '/gestion', texto: 'Panel de gestión' },
  { to: '/usuarios', texto: 'Usuarios' },
  { to: '/reportes', texto: 'Reportes' },
];

function Navegacion() {
  const { usuario, rol, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [expandido, setExpandido] = useState(false);

  // En móvil (menú hamburguesa) se cierra solo al cambiar de página
  useEffect(() => {
    setExpandido(false);
  }, [pathname]);

  const clinica = GRUPO_CLINICA.filter((e) => puedeAcceder(e.to, rol));
  const admin = GRUPO_ADMIN.filter((e) => puedeAcceder(e.to, rol));

  function cerrarSesion() {
    logout();
    navigate('/login');
  }

  return (
    <Navbar expand="lg" bg="light" data-bs-theme="light" expanded={expandido} onToggle={setExpandido}>
      <Container>
        <Navbar.Brand as={NavLink} to="/">Veterinaria San Marcos</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>

            {puedeAcceder('/agendar', rol) && <Nav.Link as={NavLink} to="/agendar">Citas</Nav.Link>}
            {puedeAcceder('/mis-mascotas', rol) && <Nav.Link as={NavLink} to="/mis-mascotas">Mis mascotas</Nav.Link>}

            {clinica.length > 0 && (
              <NavDropdown title="Clínica" id="menu-clinica">
                {clinica.map((e) => (
                  <NavDropdown.Item key={e.to} as={NavLink} to={e.to}>{e.texto}</NavDropdown.Item>
                ))}
              </NavDropdown>
            )}

            {admin.length > 0 && (
              <NavDropdown title="Administración" id="menu-admin">
                {admin.map((e) => (
                  <NavDropdown.Item key={e.to} as={NavLink} to={e.to}>{e.texto}</NavDropdown.Item>
                ))}
              </NavDropdown>
            )}

            {usuario ? (
              <NavDropdown
                align="end"
                id="menu-usuario"
                title={<span>{nombreCompleto(usuario)} <small className="text-secondary">({ETIQUETA_ROL[rol]})</small></span>}
              >
                <NavDropdown.Item as={NavLink} to="/perfil">Mi perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={cerrarSesion}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="fw-semibold">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;
