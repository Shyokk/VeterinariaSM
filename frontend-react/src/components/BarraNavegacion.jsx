
import { NavLink } from 'react-router-dom';

function BarraNavegacion() {
  const clasesEnlace = ({ isActive }) =>
    `nav-link px-3 rounded ${
      isActive
        ? 'active bg-white text-primary fw-bold'
        : 'text-white'
    }`;

  return (
    <nav
      className="navbar bg-primary rounded p-3"
      aria-label="Navegación principal"
    >
      <div className="container-fluid p-0">
        <span className="navbar-brand text-white fw-bold mb-0">
          San Marcos
        </span>

        <div className="d-flex flex-wrap gap-2">
          <NavLink to="/" end className={clasesEnlace}>
            Inicio
          </NavLink>

          <NavLink to="/pacientes" className={clasesEnlace}>
            Pacientes
          </NavLink>

          <NavLink to="/solicitar-cita" className={clasesEnlace}>
            Solicitar cita
          </NavLink>

          <NavLink to="/mis-citas" className={clasesEnlace}>
            Mis citas
          </NavLink>

          <NavLink
            to="/solicitudes-citas"
            className={clasesEnlace}
          >
            Solicitudes de citas
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default BarraNavegacion;
