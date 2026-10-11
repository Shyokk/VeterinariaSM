import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Componentes estructurales
import Cabecera from './components/Cabecera'
import Navegacion from './components/Navegacion'
import Bienvenida from './components/Bienvenida'
import PiePagina from './components/PiePagina'

// Estilos globales
import './assets/css/estilos.css'

// 1. Páginas Comunes
import Inicio from './pages/comun/Inicio'
import Login from './pages/comun/Login'
import Nosotros from './pages/comun/Nosotros'
import Perfil from './pages/comun/Perfil'
import Register from './pages/comun/Register'

// 2. Páginas de Administración
import AdminActividades from './pages/admin/AdminActividades'
import Gestion from './pages/admin/Gestion'
import Reportes from './pages/admin/Reportes'
import Usuarios from './pages/admin/Usuarios'

// 3. Páginas de Recepción
import Agendar from './pages/recepcion/agendar'

// 4. Páginas de Usuario
import MisMascotas from './pages/usuario/MisMascotas'

// 5. Páginas de Veterinario
import CrearFicha from './pages/veterinario/CrearFicha'
import Historial from './pages/veterinario/Historial'
import NuevaReceta from './pages/veterinario/nuevaReceta'
import NuevaVacuna from './pages/veterinario/NuevaVacuna'
import NuevoDiagnostico from './pages/veterinario/NuevoDiagnostico'
import NuevoExamen from './pages/veterinario/NuevoExamen'
import Pacientes from './pages/veterinario/Pacientes'

function App() {
  return (
    <BrowserRouter>
      <Cabecera />
      <Navegacion />

      <Routes>
        {/* Inicio / Dashboard */}
        <Route path="/" element={<Bienvenida />} />
        <Route path="/inicio" element={<Inicio />} />

        {/* Común */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Administración */}
        <Route path="/admin-actividades" element={<AdminActividades />} />
        <Route path="/gestion" element={<Gestion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/usuarios" element={<Usuarios />} />

        {/* Recepción */}
        <Route path="/agendar" element={<Agendar />} />

        {/* Usuario */}
        <Route path="/mis-mascotas" element={<MisMascotas />} />

        {/* Veterinario */}
        <Route path="/crear-ficha" element={<CrearFicha />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/nueva-receta" element={<NuevaReceta />} />
        <Route path="/nueva-vacuna" element={<NuevaVacuna />} />
        <Route path="/nuevo-diagnostico" element={<NuevoDiagnostico />} />
        <Route path="/nuevo-examen" element={<NuevoExamen />} />
        <Route path="/pacientes" element={<Pacientes />} />
      </Routes>

      <PiePagina />
    </BrowserRouter>
  )
}

export default App