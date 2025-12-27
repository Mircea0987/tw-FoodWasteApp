import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0 small">
              &copy; {new Date().getFullYear()} FoodWasteApp. Toate drepturile rezervate.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white text-decoration-none">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white text-decoration-none">
                Instagram
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;