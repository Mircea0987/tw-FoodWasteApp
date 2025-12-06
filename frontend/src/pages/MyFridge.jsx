
import React, { useEffect, useState } from 'react';
import { getMyFridge, shareProduct } from '../services/api'; 
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyFridge = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Functia de incarcare produse
  const loadProducts = () => {
    getMyFridge().then((response) => {
      setProducts(response.data);
      setLoading(false);
    });
  };

  
  useEffect(() => {
    loadProducts();
  }, []);

  // 2. Actiunea de click
  const handleShare = async (id) => {
    setLoading(true); 
    await shareProduct(id); // Chemam API-ul
    loadProducts(); // Reincarcarea listei
  };

  const getDaysUntilExpiration = (dateString) => {
    const today = new Date();
    const expDate = new Date(dateString);
    const timeDiff = expDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getExpirationColor = (days) => {
    if (days < 0) return 'text-secondary';
    if (days <= 3) return 'text-danger fw-bold';
    return 'text-success';
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Actualizăm frigiderul...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">🌿 Frigiderul Meu</h2>
        <Button variant="outline-success" as={Link} to="/add-product">
          + Adaugă Aliment
        </Button>
      </div>

      <Row>
        {products.map((prod) => {
          const daysLeft = getDaysUntilExpiration(prod.expirationDate);
          
          return (
            <Col key={prod.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Header className="bg-transparent d-flex justify-content-between">
                  <Badge bg="info">{prod.category}</Badge>
                  
                  {/* Daca e available, aratam eticheta verde */}
                  {prod.status === 'available' && <Badge bg="success">La comun ♻️</Badge>}
                </Card.Header>
                
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <img src={prod.image} alt={prod.name} className="rounded-circle me-3" width="50" height="50"/>
                    <Card.Title className="mb-0">{prod.name}</Card.Title>
                  </div>
                  
                  <Card.Text>
                    Expiră în: <span className={getExpirationColor(daysLeft)}>
                      {prod.expirationDate} ({daysLeft} zile)
                    </span>
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="bg-transparent border-top-0">
                  {/* 3. Conectare buton share */}
                  {prod.status === 'private' ? (
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      className="w-100"
                      onClick={() => handleShare(prod.id)} 
                    >
                      Pune la comun ♻️
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" className="w-100" disabled>
                      Este deja la comun
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default MyFridge;