import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function PiePagina() {
  return (
    <footer className="py-4 bg-dark text-white mt-auto">
      <Container>
        <Row className="gy-3 text-center text-md-start align-items-center">
          <Col xs={12} md={6}>
            <h5 className="mb-1 fw-bold">Veterinaria San Marcos</h5>
            <p className="small text-white-50 mb-0">
              Página oficial de atención e información clínica.
            </p>
          </Col>

          <Col xs={12} md={6} className="text-center text-md-end">
            <address className="mb-0 small">
              Contacto: {' '}
              <a 
                href="mailto:VeteSM@sanmarcos.cl" 
                className="text-white text-decoration-underline"
              >
                VeteSM@sanmarcos.cl
              </a>
            </address>
          </Col>
        </Row>

        <hr className="my-3 border-secondary" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 small text-white-50">
              &copy; {new Date().getFullYear()} Veterinaria San Marcos. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default PiePagina;