import { Link } from 'react-router-dom';

import calendarioImg from '../assets/img/calendario.webp';
import miPerfilImg from '../assets/img/miperfil.webp';
import examenesImg from '../assets/img/examenes.webp';
import escudoImg from '../assets/img/escudo.webp';

import { useAuth } from '../context/AuthContext.jsx';
import { ETIQUETA_ROL, puedeAcceder } from '../utils/roles.js';
import { nombreCompleto } from '../utils/formato.js';

// Todas las tarjetas posibles. Se muestran solo las que el rol del usuario puede usar.
const TARJETAS = [
  { titulo: 'Citas', img: calendarioImg, link: '/agendar' },
  { titulo: 'Mis mascotas', img: examenesImg, link: '/mis-mascotas' },
  { titulo: 'Pacientes', img: escudoImg, link: '/pacientes' },
  { titulo: 'Historial clínico', img: escudoImg, link: '/historial' },
  { titulo: 'Crear ficha', img: escudoImg, link: '/crear-ficha' },
  { titulo: 'Diagnóstico', img: escudoImg, link: '/nuevo-diagnostico' },
  { titulo: 'Vacuna', img: escudoImg, link: '/nueva-vacuna' },
  { titulo: 'Receta', img: escudoImg, link: '/nueva-receta' },
  { titulo: 'Examen', img: escudoImg, link: '/nuevo-examen' },
  { titulo: 'Reportes', img: escudoImg, link: '/reportes' },
  { titulo: 'Usuarios', img: escudoImg, link: '/usuarios' },
  { titulo: 'Gestión', img: escudoImg, link: '/gestion' },
  { titulo: 'Mi perfil', img: miPerfilImg, link: '/perfil' },
];

function Bienvenida() {
  const { usuario, rol } = useAuth();

  const visibles = usuario
    ? TARJETAS.filter((t) => puedeAcceder(t.link, rol))
    : [
        { titulo: 'Iniciar sesión', img: miPerfilImg, link: '/login' },
        { titulo: 'Registrarse', img: miPerfilImg, link: '/register' },
        { titulo: 'Nosotros', img: escudoImg, link: '/nosotros' },
      ];

  return (
    <main className="contenido-main">
      <section style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Veterinaria San Marcos</h1>
        {usuario ? (
          <p>
            Hola, <strong>{nombreCompleto(usuario)}</strong> ({ETIQUETA_ROL[rol]}). ¿Qué quieres hacer hoy?
          </p>
        ) : (
          <p>Inicia sesión o crea tu cuenta para solicitar citas y revisar el historial de tus mascotas.</p>
        )}
      </section>

      <section className="grill-tarjeta">
        {visibles.map((item) => (
          <div key={item.link}>
            <Link to={item.link}>
              <div className="tarjeta">
                <img className="tarjeta-img" src={item.img} alt="" />
                <span className="descripcion-tarjeta">{item.titulo}</span>
              </div>
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Bienvenida;
