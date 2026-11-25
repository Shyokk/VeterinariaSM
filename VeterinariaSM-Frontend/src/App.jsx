import { Navigate, Route, Routes } from 'react-router-dom';

// Componentes estructurales
import Cabecera from './components/Cabecera';
import Navegacion from './components/Navegacion';
import Bienvenida from './components/Bienvenida';
import PiePagina from './components/PiePagina';
import NoEncontrado from './components/NoEncontrado';
import RutaProtegida from './components/RutaProtegida';

// Estilos globales
import './assets/css/estilos.css';

// Roles permitidos por ruta (única fuente: utils/roles.js)
import { ACCESO } from './utils/roles';

// Páginas comunes
import Login from './pages/comun/Login';
import Nosotros from './pages/comun/Nosotros';
import Perfil from './pages/comun/Perfil';
import Register from './pages/comun/Register';

// Páginas de administración
import Gestion from './pages/admin/Gestion';
import Reportes from './pages/admin/Reportes';
import Usuarios from './pages/admin/Usuarios';

// Citas y dueños
import Agendar from './pages/recepcion/agendar';
import MisMascotas from './pages/usuario/MisMascotas';

// Clínica
import CrearFicha from './pages/veterinario/CrearFicha';
import Historial from './pages/veterinario/Historial';
import NuevaReceta from './pages/veterinario/nuevaReceta';
import NuevaVacuna from './pages/veterinario/NuevaVacuna';
import NuevoDiagnostico from './pages/veterinario/NuevoDiagnostico';
import NuevoExamen from './pages/veterinario/NuevoExamen';
import Pacientes from './pages/veterinario/Pacientes';

/** Envuelve una página con la protección por rol definida en ACCESO. */
function protegida(ruta, pagina) {
  return <RutaProtegida roles={ACCESO[ruta]}>{pagina}</RutaProtegida>;
}

function App() {
  return (
    <>
      <Cabecera />
      <Navegacion />

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Bienvenida />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nosotros" element={<Nosotros />} />

        {/* Cualquier usuario con sesión */}
        <Route path="/perfil" element={protegida('/perfil', <Perfil />)} />
        <Route path="/agendar" element={protegida('/agendar', <Agendar />)} />

        {/* Dueño de mascota */}
        <Route path="/mis-mascotas" element={protegida('/mis-mascotas', <MisMascotas />)} />

        {/* Personal de la clínica */}
        <Route path="/pacientes" element={protegida('/pacientes', <Pacientes />)} />
        <Route path="/historial" element={protegida('/historial', <Historial />)} />
        <Route path="/crear-ficha" element={protegida('/crear-ficha', <CrearFicha />)} />

        {/* Veterinario / Administrador (escritura en la ficha clínica) */}
        <Route path="/nuevo-diagnostico" element={protegida('/nuevo-diagnostico', <NuevoDiagnostico />)} />
        <Route path="/nueva-vacuna" element={protegida('/nueva-vacuna', <NuevaVacuna />)} />
        <Route path="/nueva-receta" element={protegida('/nueva-receta', <NuevaReceta />)} />
        <Route path="/nuevo-examen" element={protegida('/nuevo-examen', <NuevoExamen />)} />

        {/* Administración */}
        <Route path="/gestion" element={protegida('/gestion', <Gestion />)} />
        <Route path="/usuarios" element={protegida('/usuarios', <Usuarios />)} />
        <Route path="/reportes" element={protegida('/reportes', <Reportes />)} />

        {/* Debe quedar al final para capturar rutas desconocidas */}
        <Route path="*" element={<NoEncontrado />} />
      </Routes>

      <PiePagina />
    </>
  );
}

export default App;
