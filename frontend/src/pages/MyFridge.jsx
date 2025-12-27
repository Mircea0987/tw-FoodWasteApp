import React, { useEffect, useState } from 'react';
import { getMyFridge, shareProduct, deleteProduct } from '../services/api'; 
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const MyFridge = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Functia de incarcare produse
  const loadFridge = async () => {
    try{
      const response = await getMyFridge();
      const rawData = Array.isArray(response.data) ? response.data : [];

      const myListId = localStorage.getItem("list_id");
      const myIdInt = myListId ? parseInt(myListId) : null;

      if(myIdInt){
        const myProducts = rawData.filter(p=> p.ListID === myIdInt);
        setProducts(myProducts);
      } else{
        setProducts([]);
      }
    } catch (err) {
      console.error("Eroare incarcare frigider:", err);
      setError("Nu am putut incarca datele");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFridge();
  }, []);

  // Functia de stergere

  const handleDelete = async (id) => {
    if(window.confirm("Ești sigur că vrei să ștergi acest produs?")) {
      try{
        await deleteProduct(id);
        loadFridge();
      } catch (err) {
        console.error("Eroare la ștergere:", err);
        alert("Eroare la ștergere! Verifică consola pentru detalii.");
      }
    }
  };

  const handleEdit = (product) => {
    alert(`Aici se va deschide formularul de editare pentru produsul: ${product.ProductName}. (Necesita backend PUT)`);
  }

  // Actiunea de click
  const handleShare = async (id) => {
    try{
      await shareProduct(id);
      loadFridge();
    } catch (err) {
      alert("Eroare la partajare! Verifică consola pentru detalii.");
    }
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

      {products.length === 0 && !loading && (
        <div className="text-center mt-5 text-muted">
          <h5>Frigiderul tau este gol!</h5>
          <p>Adauga primele tale alimente</p>
      </div>
      )}

      <Row>
        {products.map((prod) => {
          const daysLeft = getDaysUntilExpiration(prod.ExpirationDate);

          let displayDesc = prod.Description || 'Aliment';
          if(displayDesc.includes('Categorie selectată: ')){
            displayDesc = displayDesc.replace('Categorie selectată: ', '');
          }
          
          return (
            <Col key={prod.ProductID} xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Header className="bg-transparent d-flex justify-content-between">
                  <Badge bg="info">
                    {displayDesc}
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
                  <div className='d-grid gap-2'>
                    {/* Buton share */}
                    {prod.Status === 'private' ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleShare(prod.ProductID)}
                      >
                        Pune la comun ♻️
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        Este deja la comun
                      </Button>
                    )}

                    {/* Buton edit si delete */}

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className= "w-50"
                        onClick={() => handleEdit(prod)}
                      >
                        ✏️ Editează
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className= "w-50"
                        onClick={() => handleDelete(prod.ProductID)}
                      >
                        🗑️ Șterge
                      </Button>
                    </div>
                    
                  </div>
                  
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