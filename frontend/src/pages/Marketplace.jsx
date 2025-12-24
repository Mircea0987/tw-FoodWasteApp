import React, { useEffect, useState, useMemo } from 'react';
import { getMarketplaceItems, claimProduct } from '../services/api';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form } from 'react-bootstrap';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // State-uri pentru filtrare
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [sortOption, setSortOption] = useState('date_asc'); 

  const CATEGORIES = ['Toate', 'Lactate', 'Fructe', 'Legume', 'Carne', 'Conserve', 'Altele'];

  // Incarcarea datelor
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

  const handleClaim = async (id, name) => {
    await claimProduct(id);
    setMessage(`Ai revendicat cu succes: ${name}! 😋`);
    loadData();
    setTimeout(() => setMessage(''), 3000);
  };

  // --- LOGICA (useMemo) ---
  const processedItems = useMemo(() => {
    let result = [...items]; 

    // 1. Filtrare
    if (selectedCategory !== 'Toate') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // 2. Sortare
    result.sort((a, b) => {
      if (sortOption === 'date_asc') {
        return new Date(a.expirationDate) - new Date(b.expirationDate);
      }
      if (sortOption === 'date_desc') {
        return new Date(b.expirationDate) - new Date(a.expirationDate);
      }
      return 0;
    });

    return result;
  }, [items, selectedCategory, sortOption]);


  if (loading && items.length === 0) {
    return <Container className="mt-5 text-center"><Spinner animation="border" variant="primary"/></Container>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-primary mb-4">🛒 Marketplace - Salvează mâncare!</h2>

      {message && <Alert variant="success">{message}</Alert>}

      {/* --- ZONA FILTRE --- */}
      <Card className="p-3 mb-4 bg-light border-0">
        <Row className="g-3 align-items-center">
          
        
          <Col md={8}>
            <span className="fw-bold me-2">Categorie:</span>
            <div className="d-inline-flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <Button 
                  key={cat}
                  variant={selectedCategory === cat ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  style={{ borderRadius: '20px' }}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </Col>

          {/* Sortare */}
          <Col md={4}>
             <Form.Group className="d-flex align-items-center justify-content-md-end">
               <Form.Label className="me-2 mb-0 fw-bold text-nowrap">Sortează:</Form.Label>
               <Form.Select 
                  size="sm"
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
               >
                 <option value="date_asc">Expiră curând (Urgent)</option>
                 <option value="date_desc">Expiră târziu</option>
               </Form.Select>
             </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* --- LISTA PRODUSE --- */}
      {processedItems.length === 0 ? (
        <Alert variant="info">
            Nu există produse în categoria <strong>{selectedCategory}</strong> momentan. 
            {selectedCategory !== 'Toate' && " Încearcă să selectezi 'Toate'."}
        </Alert>
      ) : (
        <Row>
          {processedItems.map((item) => (
            <Col key={item.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-primary text-white d-flex justify-content-between">
                   <span>De la: <strong>{item.owner}</strong></span>
                   <Badge bg="light" text="dark">{item.category}</Badge>
                </Card.Header>
                
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={item.image || "https://placehold.co/50"} 
                      alt={item.name} 
                      className="rounded-circle me-3" 
                      width="50" 
                      height="50"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <Card.Title className="mb-0">{item.name}</Card.Title>
                      <small className={
                        new Date(item.expirationDate) < new Date('2026-01-01') ? "text-danger fw-bold" : "text-muted"
                      }>
                        Expiră: {item.expirationDate}
                      </small>
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