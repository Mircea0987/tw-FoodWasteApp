import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // bg-dark = fundal negru, text-light = scris alb, py-4 = padding vertical, mt-auto = împinge footer-ul jos
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          {/* Coloana 1: Despre Aplicație */}
          <Col md={4} className="mb-3">
            <h5>Food Waste App</h5>
            <p className="small">
              Împreună reducem risipa alimentară. Gestionează-ți frigiderul și ajută planeta.
            </p>
          </Col>

          {/* Coloana 2: Link-uri rapide */}
          <Col md={4} className="mb-3">
            <h5>Navigare</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/marketplace" className="text-decoration-none text-light">Marketplace</Link>
              </li>
              <li>
                <Link to="/my-fridge" className="text-decoration-none text-light">Frigiderul Meu</Link>
              </li>
              <li>
                <Link to="/add-product" className="text-decoration-none text-light">Adaugă Produs</Link>
              </li>
            </ul>
          </Col>

          {/* Coloana 3: Contact (Mock) */}
          <Col md={4} className="mb-3">
            <h5>Contact</h5>
            <p className="small">
              Email: contact@foodwaste.ro <br />
              Tel: +40 700 000 000
            </p>
          </Col>
        </Row>
        
        <hr className="bg-light" />
        
        <Row>
          <Col className="text-center small">
            &copy; {new Date().getFullYear()} Food Waste App. Toate drepturile rezervate.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;