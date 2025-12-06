
import React, { useEffect, useState } from 'react';
import { getMarketplaceItems, claimProduct } from '../services/api';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Mesaj succes

  // Incarcam datele la inceput
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    getMarketplaceItems().then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  };

  // Functia de Claim
  const handleClaim = async (id, name) => {
    await claimProduct(id); // Chemam API-ul
    setMessage(`Ai revendicat cu succes: ${name}! 😋`);
    loadData(); // Reincarcam lista
    
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading && items.length === 0) {
    return <Container className="mt-5 text-center"><Spinner animation="border" variant="primary"/></Container>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-primary mb-4">🛒 Marketplace - Salvează mâncare!</h2>

      {message && <Alert variant="success">{message}</Alert>}

      {items.length === 0 ? (
        <Alert variant="info">Nu e nimic disponibil momentan. Revino mai târziu!</Alert>
      ) : (
        <Row>
          {items.map((item) => (
            <Col key={item.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-primary text-white d-flex justify-content-between">
                   <span>De la: <strong>{item.owner}</strong></span>
                   <Badge bg="light" text="dark">{item.category}</Badge>
                </Card.Header>
                
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <img src={item.image} alt={item.name} className="rounded-circle me-3" width="50" height="50"/>
                    <div>
                      <Card.Title className="mb-0">{item.name}</Card.Title>
                      <small className="text-muted">Expira: {item.expirationDate}</small>
                    </div>
                  </div>
                  <Card.Text>
                    {item.owner} oferă acest produs gratuit. Îl dorești?
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="bg-white border-top-0">
                  <Button 
                    variant="success" 
                    className="w-100 fw-bold"
                    onClick={() => handleClaim(item.id, item.name)}
                  >
                    🙋‍♂️ Vreau eu! (Claim)
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Marketplace;