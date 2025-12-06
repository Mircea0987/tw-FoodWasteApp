
import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const MyNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 1. Verificăm la încărcare dacă userul este logat
  useEffect(() => {
    // Cheia 'user_name' a fost setată în Login.jsx
    const savedUser = localStorage.getItem('user_name'); 
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // 2. Funcția de Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');   
    window.location.reload(); // refresh pentru actualizare
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">🍏 FoodWasteApp</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* Partea stângă: Link-urile principale (apar doar dacă ești logat) */}
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/">Frigiderul Meu</Nav.Link>
                <Nav.Link as={Link} to="/marketplace">Marketplace</Nav.Link>
              </>
            )}
          </Nav>

          {/* Partea dreaptă: User info sau Login/Register */}
          <Nav>
            {user ? (
              // VARIANTA LOGAT: Arată numele și buton de Logout
              <div className="d-flex align-items-center">
                <Navbar.Text className="me-3 text-white">
                  Salut, <strong>{user}</strong>!
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Ieșire
                </Button>
              </div>
            ) : (
              // VARIANTA NELOGAT: Arată butoane de intrare
              <>
                <Nav.Link as={Link} to="/login">Autentificare</Nav.Link>
                <Nav.Link as={Link} to="/register">Înregistrare</Nav.Link>
              </>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;