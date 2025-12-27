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
      
      const data = Array.isArray(response.data) ? response.data : [];
      setProducts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Actiunea de click
  const handleShare = async (id) => {
    setLoading(true); 
    await shareProduct(id); 
    loadProducts(); 
  };

  const getDaysUntilExpiration = (dateString) => {
    if (!dateString) return 0;
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

  // Functie helper pentru a formata data frumos
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO');
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
          const daysLeft = getDaysUntilExpiration(prod.ExpirationDate);
          
          return (
            <Col key={prod.ProductID} xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Header className="bg-transparent d-flex justify-content-between">
                  <Badge bg="info">
                    {prod.Description ? prod.Description.replace('Categorie selectată: ', '') : 'Aliment'}
                  </Badge>
                  
                  {prod.Status === 'public' && <Badge bg="success">La comun ♻️</Badge>}
                </Card.Header>
                
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    {/* Placeholder image*/}
                    <img 
                        src={`https://placehold.co/100x100?text=${prod.ProductName ? prod.ProductName.substring(0,3) : 'Aliment'}`} 
                        alt={prod.ProductName} 
                        className="rounded-circle me-3" 
                        width="50" 
                        height="50"
                    />
                    <Card.Title className="mb-0">{prod.ProductName}</Card.Title>
                  </div>
                  
                  <Card.Text>
                    Expiră pe: <b>{formatDate(prod.ExpirationDate)}</b>
                    <br/>
                    <span className={getExpirationColor(daysLeft)}>
                       ({daysLeft} zile rămase)
                    </span>
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="bg-transparent border-top-0">
                  {/* Verificam Status si folosim ProductID la click */}
                  {prod.Status === 'private' ? (
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      className="w-100"
                      onClick={() => handleShare(prod.ProductID)} 
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