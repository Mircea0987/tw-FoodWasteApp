import axios from 'axios';

// Configurare de bază
const API_BASE_URL = 'http://localhost:8001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR (Token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 1. GET DATA ---

export const getMyFridge = async () => {
  try {
    const response = await apiClient.get('/product/products');
    return { data: response.data }; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
        return { data: [] }; 
    }
    console.error("Eroare getMyFridge:", error);
    return { data: [] };
  }
};

export const getMarketplaceItems = async () => {
  try {
    const response = await apiClient.get('/product/products');
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
        return { data: [] };
    }
    console.error("Eroare getMarketplaceItems:", error);
    return { data: [] };
  }
};

// --- 2. ADAUGARE PRODUS ---

export const addProduct = async (productData) => {
  try {
    const payload = { ...productData, Status: 'private' };
    const response = await apiClient.post('/product/products', payload);
    return { data: response.data.product || response.data }; 
  } catch (error) {
    console.error("Eroare la addProduct:", error);
    throw error;
  }
};

// --- 3. ACTIUNI (SHARE & CLAIM)

export const shareProduct = async (productId) => {
  try {
    const response = await apiClient.put(`/product/products/${productId}`, {
      Status: 'public' 
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Eroare la shareProduct:", error);
    throw error;
  }
};

export const claimProduct = async (productId) => {
  try {
    await apiClient.delete(`/product/products/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Eroare la claimProduct:", error);
    throw error;
  }
};

// !!! Pentru backend : ar trebui sa aiba rutele DELETE
// /api/product/products/:id si PUT /api/product/products/:id active.


// Sterge produs

export const deleteProduct = async (productId) => {
  return await apiClient.delete(`/product/products/${productId}`);

};

// Actualizare produs

export const updateProduct = async (productId, updateDate) => {
  return await apiClient.put(`/product/products/${productId}`, updateDate);
}

// --- 4. AUTH ---

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { 
        email: email, 
        password: password 
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      const userName = response.data.user?.FirstName || email;
      
      localStorage.setItem('user_name', userName);
    }
    return response.data; 
  } catch (error) {
    console.error("Eroare la login:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const payload = {
        firstName: userData.firstName,    
        lastName: userData.lastName,            
        email: userData.email,       
        password: userData.password  
    };

    console.log("📤 Trimitem la server:", payload); // Debugging

    const response = await apiClient.post('/register', payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Eroare la register:", error);
    
    if (error.response && error.response.status === 500) {
        throw new Error("Eroare server. Cel mai probabil acest EMAIL este deja folosit!");
    }
    
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_name');
  window.location.href = '/login'; 
};