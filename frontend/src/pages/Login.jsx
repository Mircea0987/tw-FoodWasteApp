import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      
      navigate('/');
      window.location.reload(); 
      
    } catch (err) {
      console.error(err);
      setError('Email sau parolă greșită (sau cont inexistent).');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center text-success mb-4">🍏 Autentificare</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email} onChange={(e) => setEmail(e.target.value)} required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parolă</Form.Label>
              <Form.Control 
                type="password" 
                value={password} onChange={(e) => setPassword(e.target.value)} required 
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100" disabled={loading}>
               {loading ? <Spinner size="sm" animation="border"/> : 'Intră în aplicație'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Nu ai cont? <Link to="/register">Fă-ți unul aici</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;