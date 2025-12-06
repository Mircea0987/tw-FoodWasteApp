
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import MyNavbar from './components/MyNavbar';
import MyFridge from './pages/MyFridge';
import AddProduct from './pages/AddProduct';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import Register from './pages/Register'; 

import { Container } from 'react-bootstrap';

function App() {
  const navigate = useNavigate();

  // Logica de protectie (redirect la login daca nu esti logat)
  useEffect(() => {
    const user = localStorage.getItem('user_name'); // Verificam userul salvat
    const path = window.location.pathname;

    // Daca nu ai user SI nu esti pe paginile de intrare, te trimitem la Login
    if (!user && path !== '/login' && path !== '/register') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <MyNavbar />
      <Container>
        <Routes>
          {/* RUTELE DE AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* RUTELE APLICATIEI */}
          <Route path="/" element={<MyFridge />} />
          <Route path="/marketplace" element={<Marketplace />} /> 
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;