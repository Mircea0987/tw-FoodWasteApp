# tw-FoodWasteApp
Web Technology Project

## 📅 Specificații detaliate, planul de proiect
- Prezența unui proiect în Git: **16.11.2025**
- Obiectiv: realizarea unei aplicații web de tip **SPA** cu front-end React.js și back-end Node.js/Express, conectată la o bază de date PostgreSQL.

---

## 🖥️ Back-end (Server)

Back-end-ul este dezvoltat folosind **Node.js** ca mediu de rulare, datorită performanței sale ridicate în gestionarea operațiunilor asincrone și a modelului non-blocant. Peste acesta este utilizat framework-ul **Express.js**, care permite dezvoltarea unui **API RESTful** scalabil, modular și ușor de întreținut.

### 🔧 Structura serverului include:
- Definirea rutelor pentru fiecare resursă disponibilă în API;
- Utilizarea middleware-urilor pentru:
  - validare
  - autentificare
  - gestionarea erorilor
- Organizarea logicii aplicației în **controllere** și **servicii**, pentru o separare clară a responsabilităților.

### 📦 Sequelize ORM
Pentru interacțiunea cu baza de date relațională **PostgreSQL**, se folosește **Sequelize ORM**, care oferă:
- client tipizat generat automat
- operațiuni CRUD simplificate
- gestionarea facilă a relațiilor dintre entități
- consistența datelor și siguranță sporită în timpul dezvoltării

### 🎯 Rolul back-end-ului:
- gestionarea fluxurilor aplicației
- validarea datelor primite de la front-end
- operațiuni asupra bazei de date
- răspuns către front-end prin endpoint-uri definite în **Contractul API**

---

## 🗄️ Modelarea Bazei de Date (DB Layer)

Aplicația folosește **PostgreSQL**, ales pentru suportul pentru relații complexe, tranzacții ACID și scalabilitate. Accesul la date este realizat prin **ORM modern** (Sequelize), integrat în back-end-ul Node.js/Express.

### 📑 Entitățile principale:
- **Utilizatori** – profilul utilizatorilor aplicației
- **Alimente** – produse alimentare asociate utilizatorilor, cu termen de expirare și disponibilitate
- **Categorii** – clasificarea alimentelor
- **Grupuri de prieteni** – colecții de utilizatori cu etichete/tag-uri specifice
- **Revendicări (Claim)** – solicitări prin care utilizatorii pot cere un aliment disponibil

### 🔧 Responsabilități:
- definirea structurii bazei de date
- configurarea relațiilor dintre entități
- optimizarea interogărilor
- integrarea completă cu ORM-ul
- asigurarea consistenței și integrității datelor pe parcursul dezvoltării

---

## 🌐 Front-end (Client Web)

Interfața aplicației este realizată folosind **React.js**, pentru construirea unei aplicații **SPA**, bazată pe componente și gestionarea eficientă a stării. Pentru stilizare și responsivitate se folosește **Bootstrap**.

### 🎨 Responsabilități front-end:
- implementarea interfeței grafice (UI)
- gestionarea logicii de interacțiune și a fluxurilor vizuale (UX)
- consumarea endpoint-urilor REST furnizate de back-end
- validarea și afișarea datelor primite în format JSON


# 📋 Planul Proiectului – tw-FoodWasteApp

## 👥 Echipa

Proiectul este dezvoltat de o echipă de **3 membri**, fiecare responsabil de o componentă principală a aplicației:

| Membru | Rol | Responsabilități principale |
|--------|-----|----------------------------|
| Calugaru Mircea-Costin | Back-end (Server) | Dezvoltarea API-ului RESTful folosind Node.js și Express.js, integrarea cu PostgreSQL prin Sequelize, definirea rutelor, middleware-urilor și logicii serverului |
| Cernea Costin-Matei | Front-end (Client Web) | Dezvoltarea interfeței SPA folosind React.js și Bootstrap, consumarea endpoint-urilor REST, gestionarea logicii de interacțiune și afișarea datelor JSON |
| Cibotar Calin | Baza de Date & Web Layer | Modelarea bazei de date PostgreSQL, definirea entităților și relațiilor, integrarea cu ORM-ul utilizat, suport back-end pentru interogări și validări |

---

## 🎯 Obiective

- Crearea unei aplicații web de tip **Single Page Application (SPA)** pentru gestionarea și partajarea alimentelor în comunități de prieteni.
- Implementarea unui **API RESTful** complet, scalabil și sigur.
- Modelarea unei **baze de date relaționale** eficiente, cu relații coerente și tranzacții sigure.
- Dezvoltarea unui **front-end interactiv și responsive**, care să comunice corect cu back-end-ul.
- Colaborarea eficientă între membrii echipei.

---

## 🔄 Flux de lucru și colaborare

- Echipa va colabora folosind **Git și GitHub**, cu branch-uri separate pentru fiecare componentă și commit-uri incremental documentate.
- Membrii echipei se vor ajuta reciproc la integrarea componentelor și la testarea funcționalităților:
  - Serverul va oferi endpoint-urile necesare front-end-ului.
  - Front-end-ul va furniza feedback legat de consumul API și afișarea datelor.
  - Baza de date va fi ajustată după cerințele back-end-ului și front-end-ului.
- Toate modificările majore vor fi revizuite prin **pull request-uri** pentru asigurarea calității codului.

---

# 1. Clonare repository-ul
git clone <URL_REPO>
cd proiectWeb/ # Navigare în directorul principal

# 2. Instalare dependențe Backend (in root directory)
npm install

# 3. Instalare dependențe Frontend
cd ../frontend
npm install

# 4. Start
cd ..
npm run dev

cd proiectWeb/frontend 
npm run dev



