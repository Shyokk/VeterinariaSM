
import { Routes, Route } from 'react-router-dom';

// Componentes estructurales
import Cabecera from './components/Cabecera';
import Navegacion from './components/Navegacion';
import Bienvenida from './components/Bienvenida';
import PiePagina from './components/PiePagina';
import NoEncontrado from './components/NoEncontrado';

// Estilos globales
import './assets/css/estilos.css';

// Páginas comunes
import Inicio from './pages/comun/Inicio';
import Login from './pages/comun/Login';
import Nosotros from './pages/comun/Nosotros';
import Perfil from './pages/comun/Perfil';
import Register from './pages/comun/Register';

// Páginas de administración
import AdminActividades from './pages/admin/AdminActividades';
import Gestion from './pages/admin/Gestion';
import Reportes from './pages/admin/Reportes';
import Usuarios from './pages/admin/Usuarios';

// Páginas de recepción
import Agendar from './pages/recepcion/agendar';

// Páginas de usuario
import MisMascotas from './pages/usuario/MisMascotas';

// Páginas de veterinario
import CrearFicha from './pages/veterinario/CrearFicha';
import Historial from './pages/veterinario/Historial';
import NuevaReceta from './pages/veterinario/nuevaReceta';
import NuevaVacuna from './pages/veterinario/NuevaVacuna';
import NuevoDiagnostico from './pages/veterinario/NuevoDiagnostico';
import NuevoExamen from './pages/veterinario/NuevoExamen';
import Pacientes from './pages/veterinario/Pacientes';

function App() {
  return (
    <>
      <Cabecera />
      <Navegacion />

      <Routes>
        {/* Inicio */}
        <Route path="/" element={<Bienvenida />} />
        <Route path="/inicio" element={<Inicio />} />

        {/* Módulos comunes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Módulos de administración */}
        <Route
          path="/admin-actividades"
          element={<AdminActividades />}
        />
        <Route path="/gestion" element={<Gestion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/usuarios" element={<Usuarios />} />

        {/* Módulos de recepción */}
        <Route path="/agendar" element={<Agendar />} />

        {/* Módulos de usuario */}
        <Route
          path="/mis-mascotas"
          element={<MisMascotas />}
        />

        {/* Módulos de veterinario */}
        <Route path="/crear-ficha" element={<CrearFicha />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/nueva-receta" element={<NuevaReceta />} />
        <Route path="/nueva-vacuna" element={<NuevaVacuna />} />
        <Route
          path="/nuevo-diagnostico"
          element={<NuevoDiagnostico />}
        />
        <Route path="/nuevo-examen" element={<NuevoExamen />} />
        <Route path="/pacientes" element={<Pacientes />} />

        {/* Debe quedar al final para capturar rutas desconocidas */}
        <Route path="*" element={<NoEncontrado />} />
      </Routes>

      <PiePagina />
    </>
  );
}

export default App;
