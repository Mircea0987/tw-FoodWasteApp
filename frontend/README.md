## 🌐 Frontend (Client Web)

Interfața utilizator este realizată folosind **React.js (Vite)** și **Bootstrap**, funcționând ca un SPA (Single Page Application).

### 🛠️ Instrucțiuni de Instalare și Rulare

Pentru a porni interfața grafică:

1.  Deschideți un terminal în folderul `frontend`:
    ```bash
    cd frontend
    ```

2.  Instalați pachetele necesare:
    ```bash
    npm install
    ```

3.  Porniți aplicația în modul development:
    ```bash
    npm run dev
    ```

4.  Accesați aplicația în browser la adresa afișată (implicit `http://localhost:5173`).

### ✨ Funcționalități Implementate (Demo Mode)

Aplicația rulează momentan cu date simulate (Mock Data & LocalStorage) pentru a demonstra fluxul de utilizare:

* **Autentificare:** Login & Register (Simulare - acceptă orice email/parolă validă).
* **Frigiderul Meu:** Vizualizarea produselor proprii cu alerte vizuale de expirare.
* **Adăugare Produs:** Formular funcțional pentru introducerea alimentelor în lista personală.
* **Sistem de Share (Partajare):** Posibilitatea de a marca un produs propriu ca fiind "La comun". Acesta devine vizibil automat în Marketplace.
* **Marketplace:** Lista produselor disponibile oferite de alți utilizatori.
* **Claim System:** Posibilitatea de a revendica un produs din piață (acesta dispare din lista comună și, opțional, este transferat utilizatorului curent).