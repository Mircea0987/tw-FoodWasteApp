
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; 

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Trimitem datele la "server"
      await registerUser(formData);
      // Daca e ok, il trimitem la Login
      navigate('/login');
    } catch (err) {
      setError('Eroare la înregistrare. Email-ul poate exista deja.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Creează Cont</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nume</Form.Label>
              <Form.Control 
                type="text" required 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" required 
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

            <Button className="w-100" type="submit">Înregistrează-te</Button>
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