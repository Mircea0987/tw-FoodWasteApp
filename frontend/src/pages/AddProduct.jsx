import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../services/api'; 


const AddProduct = () => {
  const navigate = useNavigate();
  
  // Stari pentru datele formularului (UI)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Lactate');
  const [date, setDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const myListId = localStorage.getItem("list_id");
    
    if(!myListId) {
      alert("Eroare: Nu s-a găsit lista ta personală. Te rugăm să te autentifici din nou.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const productPayload = {
      ProductName: name,
      ExpirationDate: date,
      
      CategoryID: 1, // Salvam cu ID generic 1 pentru toate categoriile momentan
      ListID: parseInt(myListId),
      Status: 'private',
      Description: category
    };

    try {
      await addProduct(productPayload);

      setLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/'); // Ne intoarcem la frigider sa vedem produsul
      }, 1500);

    } catch (error) {
      console.error("Eroare la salvare:", error);
      setLoading(false);
      alert("Eroare la salvare! Verifică în consolă dacă ai erori de Foreign Key (CategoryID/ListID).");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">➕ Adaugă un produs nou</h2>
      
      {showSuccess && <Alert variant="success">Produs adăugat! Te redirecționăm...</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            
            {/* NUME PRODUS */}
            <Form.Group className="mb-3">
              <Form.Label>Nume Produs</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Iaurt, Banane..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </Form.Group>

            {/* CATEGORIE (Doar vizual momentan, se salveaza in Descriere) */}
            <Form.Group className="mb-3">
              <Form.Label>Categorie</Form.Label>
              <Form.Select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Lactate</option>
                <option>Fructe</option>
                <option>Legume</option>
                <option>Carne</option>
                <option>Conserve</option>
                <option>Altele</option>
              </Form.Select>
              <Form.Text className="text-muted">
                *Momentan se va salva intern cu ID-ul generic 1.
              </Form.Text>
            </Form.Group>

            {/* DATA EXPIRARII */}
            <Form.Group className="mb-4">
              <Form.Label>Data Expirării</Form.Label>
              <Form.Control 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required 
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="success" size="lg" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : 'Salvează în Frigider'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/')}>
                Anulează
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;