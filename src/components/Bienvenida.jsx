import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'

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
    <Container className="py-5">
      <section className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary">{nombreProyecto}</h1>
        <p className="lead text-muted">Encuentra nuestros servicios disponibles.</p>
      </section>

      <Row className="g-4">
        {tarjetas.map((item) => (
          <Col xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card 
              as={Link} 
              to={item.link} 
              className="h-100 text-decoration-none shadow-sm border-0 text-center hover-card"
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                <img 
                  src={item.img} 
                  alt={item.titulo} 
                  className="img-fluid mb-3" 
                  style={{ maxHeight: '80px', objectFit: 'contain' }}
                />
                <Card.Title className="fs-6 fw-bold text-dark mb-0">
                  {item.titulo}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Bienvenida;