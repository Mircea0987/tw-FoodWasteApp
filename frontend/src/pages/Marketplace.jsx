import React, { useEffect, useState, useMemo } from 'react';
import { getMarketplaceItems, claimProduct } from '../services/api';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form, Modal } from 'react-bootstrap';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // State-uri pentru filtrare
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [sortOption, setSortOption] = useState('date_asc'); 

  const [showModal, setShowModal] = useState(false);
  const [productToClaim, setProductToClaim] = useState(null); // Stocam produsul pe care vrei sa il iei

  const CATEGORIES = ['Toate', 'Lactate', 'Fructe', 'Legume', 'Carne', 'Conserve', 'Altele'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getMarketplaceItems();
      const rawData = Array.isArray(response.data) ? response.data : [];

      const publicItems = rawData.filter(item => item.Status === 'MARKETPLACE' || item.Status === 'public');

      const adaptedItems = publicItems.map(dbItem => {
        let cleanCategory = dbItem.Description || 'Altele';
        if (cleanCategory.includes('Categorie selectată: ')) {
            cleanCategory = cleanCategory.replace('Categorie selectată: ', '').trim();
        }

        return {
            id: dbItem.ProductID,           
            name: dbItem.ProductName,       
            expirationDate: dbItem.ExpirationDate, 
            category: cleanCategory,        
            // Va scrie "Vecinul Tau" pana cand primestem numele real din backend
            owner: 'Vecinul Tău',           
            image: `https://placehold.co/100?text=${dbItem.ProductName ? dbItem.ProductName.substring(0,3) : 'H'}` 
        };
      });

      setItems(adaptedItems);
    } catch (error) {
      console.error("Eroare incarcare marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Cand apesi butonul, doar DESCHIDEM fereastra (nu stergem inca)
  const handleClaimClick = (item) => {
    setProductToClaim(item);
    setShowModal(true);
  };

  // 2. Asta se intampla cand apesi "DA" in fereastra
  const confirmClaim = async () => {
    if (!productToClaim) return;

    try {
        await claimProduct(productToClaim.id); 
        setMessage(`Ai revendicat cu succes: ${productToClaim.name}! 😋`);
        
        // Inchidem modala si reincarcam datele
        setShowModal(false);
        setProductToClaim(null);
        loadData(); 

        setTimeout(() => setMessage(''), 3000);
    } catch (err) {
        alert("Eroare la revendicare. Încearcă din nou.");
        setShowModal(false);
    }
  };

  // Helper formatare data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  // Helper pentru a vedea daca expira in curand (3 zile)
  const isExpiringSoon = (dateString) => {
      if(!dateString) return false;
      const today = new Date();
      const expDate = new Date(dateString);
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= 3;
  };

  // --- LOGICA (useMemo) --- 
  const processedItems = useMemo(() => {
    let result = [...items]; 
    if (selectedCategory !== 'Toate') {
      result = result.filter(item => item.category === selectedCategory);
    }
    result.sort((a, b) => {
      const dateA = new Date(a.expirationDate);
      const dateB = new Date(b.expirationDate);
      if (sortOption === 'date_asc') return dateA - dateB;
      if (sortOption === 'date_desc') return dateB - dateA;
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
            Nu există produse disponibile momentan. Mergi la "Frigiderul Meu" și pune ceva la comun! ♻️
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
                      src={item.image} 
                      alt={item.name} 
                      className="rounded-circle me-3" 
                      width="50" 
                      height="50"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <Card.Title className="mb-0">{item.name}</Card.Title>
                      
                      {/* Logica dinamica pentru data */}
                      <small className={isExpiringSoon(item.expirationDate) ? "text-danger fw-bold" : "text-muted"}>
                        Expiră: {formatDate(item.expirationDate)}
                      </small>
                    </div>
                  </div>
                  <Card.Text>Produs disponibil gratuit. Îl dorești?</Card.Text>
                </Card.Body>

                <Card.Footer className="bg-white border-top-0">
                  <Button 
                    variant="success" 
                    className="w-100 fw-bold"
                    onClick={() => handleClaimClick(item)}
                  >
                    🙋‍♂️ Vreau eu! (Revendică)
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Confirmare Revendicare</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🍽️</div>
          <h5>Ești sigur că vrei să iei produsul:</h5>
          <h3 className="text-primary my-3">{productToClaim?.name}</h3>
          <p className="text-muted">Acesta va dispărea din Marketplace și va fi alocat ție.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0 pb-4">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="px-4">
            Nu, m-am răzgândit
          </Button>
          <Button variant="success" onClick={confirmClaim} className="px-4 fw-bold">
            Da, mi-e foame!
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Marketplace;