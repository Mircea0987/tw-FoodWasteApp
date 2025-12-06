



// --- API FICTIV PENTRU A VIZUALIZA FUNCTIONALITATEA INTERFETEI ---
// --- API FICTIV PENTRU A VIZUALIZA FUNCTIONALITATEA INTERFETEI ---
// --- API FICTIV PENTRU A VIZUALIZA FUNCTIONALITATEA INTERFETEI ---


// --- 1. DATE INITIALE
const initialMyFridge = [
  { id: 1, name: 'Lapte Zuzu', category: 'Lactate', expirationDate: '2025-12-08', status: 'private', image: 'https://placehold.co/100x100?text=Lapte' },
  { id: 2, name: 'Mere Golden', category: 'Fructe', expirationDate: '2025-12-20', status: 'private', image: 'https://placehold.co/100x100?text=Mere' }
];

const initialMarketplace = [
  { id: 101, name: 'Pizza rămasă', category: 'Altele', expirationDate: '2025-12-07', owner: 'Mircea', image: 'https://placehold.co/100x100?text=Pizza' },
  { id: 102, name: 'Morcovi', category: 'Legume', expirationDate: '2025-12-15', owner: 'Călin', image: 'https://placehold.co/100x100?text=Morcovi' },
  { id: 103, name: 'Borcan Miere', category: 'Altele', expirationDate: '2026-01-01', owner: 'Costin', image: 'https://placehold.co/100x100?text=Miere' },
];

// --- HELPERE PENTRU LOCAL STORAGE ---
const getStorageData = (key, initialValue) => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  return initialValue;
};

const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- API REQUESTS: FRIGIDERUL MEU ---

export const getMyFridge = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = getStorageData('my_fridge_data', initialMyFridge);
      resolve({ data: data });
    }, 300);
  });
};

export const addProduct = async (productData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentData = getStorageData('my_fridge_data', initialMyFridge);
      const newProduct = {
        id: Date.now(),
        ...productData,
        status: 'private',
        image: `https://placehold.co/100x100?text=${productData.name.substring(0,3)}`
      };
      
      const updatedData = [...currentData, newProduct];
      setStorageData('my_fridge_data', updatedData);
      
      resolve({ data: newProduct });
    }, 500);
  });
};

// --- API REQUESTS: MARKETPLACE ---

export const getMarketplaceItems = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = getStorageData('marketplace_data', initialMarketplace);
      resolve({ data: data });
    }, 300);
  });
};

export const claimProduct = async (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Citim ambele "baze de date" (Marketplace și Frigider)
      const currentMarketplace = getStorageData('marketplace_data', initialMarketplace);
      const myFridge = getStorageData('my_fridge_data', initialMyFridge);

      // 2. Ștergem din MARKETPLACE 
      const updatedMarketplace = currentMarketplace.filter(item => item.id !== productId);
      setStorageData('marketplace_data', updatedMarketplace);

      // 3. Ștergem și din FRIGIDERUL PROPRIETARULUI
      // Simulăm că serverul actualizează stocul proprietarului
      const updatedFridge = myFridge.filter(item => item.id !== productId);
      setStorageData('my_fridge_data', updatedFridge);

      console.log(`Produsul ${productId} a fost revendicat și a dispărut din ambele liste.`);
      resolve({ success: true });
    }, 500);
  });
};


// --- API REQUESTS: SHARE PRODUCT ---
export const shareProduct = async (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Luăm datele din Frigider
      const myFridge = getStorageData('my_fridge_data', initialMyFridge);
      const marketplace = getStorageData('marketplace_data', initialMarketplace);
      const user = localStorage.getItem('user_name') || 'Eu';

     
      const productIndex = myFridge.findIndex(p => p.id === productId);
      
      if (productIndex !== -1) {
        
        myFridge[productIndex].status = 'available';
        setStorageData('my_fridge_data', myFridge);

        // 4. Copiere in Marketplace
        // Verificăm să nu fie deja acolo
        const alreadyInMarket = marketplace.find(p => p.id === productId);
        
        if (!alreadyInMarket) {
          const productForMarket = {
            ...myFridge[productIndex],
            owner: user // 
          };
          setStorageData('marketplace_data', [...marketplace, productForMarket]);
        }
      }

      console.log(`Produsul ${productId} a fost pus la comun!`);
      resolve({ success: true });
    }, 500);
  });
};


// 1. REGISTER (Simulare)
export const registerUser = async (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("User înregistrat (Mock):", userData);
      
      resolve({ success: true });
    }, 500);
  });
};

// 2. LOGIN (Simulare)
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      
      if (password.length > 3) {
        resolve({
          token: "fake-jwt-token-" + Date.now(), // Token fals
          user: {
            id: 1,
            name: email.split('@')[0], // Luam numele din email (ex: costin@gmail.com -> costin)
            email: email
          }
        });
      } else {
        reject(new Error("Parola incorectă (minim 4 caractere)"));
      }
    }, 500);
  });
};