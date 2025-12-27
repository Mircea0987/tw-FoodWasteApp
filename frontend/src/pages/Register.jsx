import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; 

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  
  // Stari pentru UI
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // <--- Stare noua pentru succes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowSuccess(false);

    if (formData.password !== formData.confirmPassword) {
        setError('Parolele nu coincid!');
        return;
    }

    setLoading(true);

    try {
      const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,       
          email: formData.email,     
          password: formData.password
      };

      await registerUser(payload);

      // 1. Afisam mesajul de succes
      setLoading(false);
      setShowSuccess(true);

      // 2. Asteptam 2 secunde inainte sa schimbam pagina
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message || 'Eroare la înregistrare.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">Creează Cont</h2>
          
          {/* Mesaje de EROARE sau SUCCES */}
          {error && <Alert variant="danger">{error}</Alert>}
          {showSuccess && <Alert variant="success">✅ Cont creat! Te redirecționăm...</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Prenume</Form.Label>
              <Form.Control 
                type="text" required 
                placeholder="Ex: Ion"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nume de familie</Form.Label>
              <Form.Control 
                type="text" required 
                placeholder="Ex: Popescu"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" required 
                placeholder="email@exemplu.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parolă</Form.Label>
              <Form.Control 
                type="password" required 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmă Parola</Form.Label>
              <Form.Control 
                type="password" required 
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </Form.Group>

            <Button className="w-100" type="submit" disabled={loading || showSuccess}>
              {loading ? <Spinner size="sm" animation="border"/> : 'Înregistrează-te'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Ai deja cont? <Link to="/login">Intră în cont</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;