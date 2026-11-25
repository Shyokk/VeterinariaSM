import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import iconoMarcador from 'leaflet/dist/images/marker-icon.png';
import iconoMarcador2x from 'leaflet/dist/images/marker-icon-2x.png';
import sombraMarcador from 'leaflet/dist/images/marker-shadow.png';

import { CLINICA } from '../../config.js';

// Los íconos por defecto de Leaflet no se resuelven bien con Vite; se indican explícitamente.
L.Icon.Default.mergeOptions({
  iconUrl: iconoMarcador,
  iconRetinaUrl: iconoMarcador2x,
  shadowUrl: sombraMarcador,
});

const SERVICIOS = ['Consulta general', 'Vacunación', 'Cirugía menor', 'Desparasitación', 'Control de peso'];

/** Abre Google Maps con la ruta desde la ubicación actual del usuario hasta la clínica. */
function abrirIndicaciones(origen) {
  const destino = `${CLINICA.latitud},${CLINICA.longitud}`;
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', destino);
  if (origen) url.searchParams.set('origin', `${origen.latitude},${origen.longitude}`);
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

export default function Nosotros() {
  const [aviso, setAviso] = useState('');
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    document.title = 'Nosotros | Veterinaria San Marcos';
  }, []);

  function comoLlegar() {
    setAviso('');
    if (!navigator.geolocation) {
      abrirIndicaciones(null);
      return;
    }
    setBuscando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBuscando(false);
        abrirIndicaciones(pos.coords);
      },
      () => {
        setBuscando(false);
        setAviso('No pudimos obtener tu ubicación; abrimos el mapa para que ingreses tu punto de partida.');
        abrirIndicaciones(null);
      },
      { timeout: 8000 }
    );
  }

  const posicion = [CLINICA.latitud, CLINICA.longitud];

  return (
    <main className="contenido-main container py-4">
      <div className="row g-4">
        <section className="col-12 col-lg-6">
          <div className="bg-white rounded shadow-sm p-4 h-100">
            <h1 className="h3">Veterinaria San Marcos</h1>
            <p>
              Clínica veterinaria ubicada en Rancagua, fundada en 2009. Nuestro equipo de 3 médicos veterinarios,
              1 técnico veterinario y atención administrativa cuida de perros, gatos, conejos y aves.
            </p>
            <h2 className="h5">Servicios</h2>
            <ul>
              {SERVICIOS.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <h2 className="h5">Contacto</h2>
            <address className="mb-0">
              {CLINICA.direccion}<br />
              Teléfono: {CLINICA.telefono}<br />
              Correo: <a href={`mailto:${CLINICA.email}`} className="text-decoration-underline">{CLINICA.email}</a>
            </address>
          </div>
        </section>

        <section className="col-12 col-lg-6">
          <div className="bg-white rounded shadow-sm p-3">
            <h2 className="h5">¿Cómo llegar?</h2>
            <div style={{ height: 320 }} className="mb-3">
              <MapContainer center={posicion} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={posicion}>
                  <Popup><strong>{CLINICA.nombre}</strong><br />{CLINICA.direccion}</Popup>
                </Marker>
              </MapContainer>
            </div>
            {aviso && <div className="alert alert-warning py-2">{aviso}</div>}
            <button type="button" className="btn btn-primary" onClick={comoLlegar} disabled={buscando}>
              {buscando ? 'Obteniendo tu ubicación...' : 'Cómo llegar desde mi ubicación'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
