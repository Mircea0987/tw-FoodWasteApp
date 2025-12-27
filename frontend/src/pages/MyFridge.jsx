import React, { useEffect, useState } from 'react';
import { getMyFridge, shareProduct, deleteProduct, updateProduct } from '../services/api'; 
import { Container, Row, Col, Card, Badge, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyFridge = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    name: '',
    category: 'Altele',
    date: '',
    listID: null
  });

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  
  const loadFridge = async () => {
    try {
      const response = await getMyFridge();
      const rawData = Array.isArray(response.data) ? response.data : [];

      const myListId = localStorage.getItem("list_id");
      const myIdInt = myListId ? parseInt(myListId) : 1; 

      if (myIdInt) {
        const myProducts = rawData.filter(p => p.ListID === myIdInt);
        setProducts(myProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Eroare incarcare frigider:", err);
      setError("Nu am putut încărca datele.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFridge();
  }, []);

  // --- DELETE: PASUL 1 - DESCHIDEM MODALA ---
  const handleDeleteClick = (id) => {
      setIdToDelete(id);
      setShowDeleteModal(true);
  };

  // --- DELETE: PASUL 2 - CONFIRMAM ACTIUNEA ---
  const confirmDelete = async () => {
      if (!idToDelete) return;

      try {
        await deleteProduct(idToDelete);
        setShowDeleteModal(false); 
        setIdToDelete(null);       
        loadFridge();             
      } catch (err) {
        console.error("Eroare la ștergere:", err);
        alert("Eroare la ștergere! Verifică consola.");
        setShowDeleteModal(false);
      }
  };

  
  const handleEditClick = (product) => {
    let cleanCategory = product.Description || 'Altele';
    if (cleanCategory.includes('Categorie selectată: ')) {
        cleanCategory = cleanCategory.replace('Categorie selectată: ', '').trim();
    }

    let formattedDate = '';
    if (product.ExpirationDate) {
        const d = new Date(product.ExpirationDate);
        formattedDate = d.toISOString().split('T')[0];
    }

    setEditData({
        id: product.ProductID,
        name: product.ProductName,
        category: cleanCategory,
        date: formattedDate,
        listID: product.ListID
    });

    setShowEditModal(true);
  };

  // --- EDIT: SALVARE ---
  const handleSaveEdit = async () => {
    try {
        const payload = {
            ProductName: editData.name,
            ExpirationDate: editData.date,
            CategoryID: 1, 
            ListID: editData.listID,
            Status: 'FRIDGE', 
            Description: `Categorie selectată: ${editData.category}` 
        };

        await updateProduct(editData.id, payload);
        
        setShowEditModal(false); 
        loadFridge(); 
    } catch (err) {
        console.error("Eroare la update:", err);
        alert("Nu s-a putut actualiza produsul.");
    }
  };

  // --- SHARE ---
  const handleShare = async (id) => {
    try {
      await shareProduct(id);
      loadFridge();
    } catch (err) {
      alert("Eroare la partajare!");
    }
  };

  // --- HELPERE ---
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
          <h5>Frigiderul tău este gol! 🧊</h5>
          <p>Adaugă primele tale alimente.</p>
        </div>
      )}

      <Row>
        {products.map((prod) => {
          const daysLeft = getDaysUntilExpiration(prod.ExpirationDate);
          
          let displayDesc = prod.Description || 'Aliment';
          if (displayDesc.includes('Categorie selectată: ')) {
             displayDesc = displayDesc.replace('Categorie selectată: ', '');
          }

          const isPublic = prod.Status === 'MARKETPLACE' || prod.Status === 'public';
          const isPrivate = prod.Status === 'FRIDGE' || prod.Status === 'private';
          
          return (
            <Col key={prod.ProductID} xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Header className="bg-transparent d-flex justify-content-between">
                  <Badge bg="info">{displayDesc}</Badge>
                  {isPublic && <Badge bg="success">La comun ♻️</Badge>}
                </Card.Header>
                
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
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
                  <div className="d-grid gap-2">
                    
                    {isPrivate ? (
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => handleShare(prod.ProductID)} 
                      >
                        Pune la comun ♻️
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        Deja la comun
                      </Button>
                    )}

                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="w-50" 
                        onClick={() => handleEditClick(prod)}
                      >
                        ✏️ Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="w-50" 
                        
                        onClick={() => handleDeleteClick(prod.ProductID)}
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

      {/* --- MODALA DE EDITARE --- */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editează Produs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Nume Produs</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Categorie</Form.Label>
                    <Form.Select 
                        value={editData.category}
                        onChange={(e) => setEditData({...editData, category: e.target.value})}
                    >
                        <option>Lactate</option>
                        <option>Fructe</option>
                        <option>Legume</option>
                        <option>Carne</option>
                        <option>Conserve</option>
                        <option>Altele</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data Expirării</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={editData.date}
                        onChange={(e) => setEditData({...editData, date: e.target.value})}
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Anulează
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Salvează Modificările
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>⚠️ Confirmare Ștergere</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
           <h5>Ești sigur că vrei să ștergi acest produs?</h5>
           <p className="text-muted">Această acțiune este ireversibilă.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="px-4">
            Nu, păstrează-l
          </Button>
          <Button variant="danger" onClick={confirmDelete} className="px-4 fw-bold">
            Da, Șterge-l
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default MyFridge;