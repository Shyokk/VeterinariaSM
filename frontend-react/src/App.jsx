
import { Route, Routes } from 'react-router-dom';

import BarraNavegacion from './components/BarraNavegacion';
import Inicio from './pages/Inicio';
import Pacientes from './pages/Pacientes';
import SolicitarCita from './pages/SolicitarCita';
import GestionCitas from './pages/GestionCitas';
import MisCitas from './pages/MisCitas';

function App() {
  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="text-primary fw-bold">
          Veterinaria San Marcos
        </h1>

        <p className="text-secondary mb-3">
          Sistema de gestión veterinaria
        </p>

        <BarraNavegacion />
      </header>

      <main className="mt-4">
        <Routes>
          <Route path="/" element={<Inicio />} />

          <Route
            path="/pacientes"
            element={<Pacientes />}
          />

          <Route
            path="/solicitar-cita"
            element={<SolicitarCita />}
          />

          <Route
            path="/solicitudes-citas"
            element={<GestionCitas />}
          />

          <Route
            path="/mis-citas"
            element={<MisCitas />}
          />

          <Route
            path="*"
            element={
              <section className="alert alert-warning">
                <h2 className="h4">Página no encontrada</h2>
                <p className="mb-0">
                  La dirección que intentaste abrir no existe.
                </p>
              </section>
            }
          />
        </Routes>
      </main>

      <footer className="mt-5 pt-3 border-top text-secondary">
        <p className="mb-0">
          Veterinaria San Marcos © 2026
        </p>
      </footer>
    </div>
  );
}

export default App;
