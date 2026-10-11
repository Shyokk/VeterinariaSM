import React from 'react'
import { Link } from 'react-router-dom'

import calendarioImg from '../assets/img/calendario.webp'
import miPerfilImg from '../assets/img/miperfil.webp'
import examenesImg from '../assets/img/examenes.webp'
import escudoImg from '../assets/img/escudo.webp'

function Bienvenida() {
  const nombreProyecto = "Veterinaria San Marcos";

  const tarjetas = [
    { id: 1, titulo: 'Agendar', img: calendarioImg, link: '/agendar' },
    { id: 2, titulo: 'Mi Perfil', img: miPerfilImg, link: '/perfil' },
    { id: 3, titulo: 'Login / Acceso', img: miPerfilImg, link: '/login' },
    { id: 4, titulo: 'Registro', img: miPerfilImg, link: '/register' },
    { id: 5, titulo: 'Mis Mascotas', img: examenesImg, link: '/mis-mascotas' },
    { id: 6, titulo: 'Nosotros', img: escudoImg, link: '/nosotros' },
    { id: 7, titulo: 'Agenda Pacientes', img: escudoImg, link: '/pacientes' },
    { id: 8, titulo: 'Gestión', img: escudoImg, link: '/gestion' },
    { id: 9, titulo: 'Historial', img: escudoImg, link: '/historial' },
    { id: 10, titulo: 'Crear Ficha', img: escudoImg, link: '/crear-ficha' },
    { id: 11, titulo: 'Receta', img: escudoImg, link: '/nueva-receta' },
    { id: 12, titulo: 'Vacuna', img: escudoImg, link: '/nueva-vacuna' },
    { id: 13, titulo: 'Diagnóstico', img: escudoImg, link: '/nuevo-diagnostico' },
    { id: 14, titulo: 'Nuevo Examen', img: escudoImg, link: '/nuevo-examen' },
    { id: 15, titulo: 'Reportes', img: escudoImg, link: '/reportes' },
    { id: 16, titulo: 'Usuarios', img: escudoImg, link: '/usuarios' },
  ]

  return (
    <main className="contenido-main">
      <section style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>{nombreProyecto}</h1>
        <p>Encuentra nuestros servicios disponibles.</p>
      </section>

      <section className="grill-tarjeta">
        {tarjetas.map((item) => (
          <div key={item.id}>
            <Link to={item.link}>
              <div className="tarjeta">
                <img className="tarjeta-img" src={item.img} alt={item.titulo} />
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