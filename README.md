🎓 SkillShare — Piattaforma di Tutoring Universitario

Un'applicazione web Full-Stack progettata per connettere studenti universitari e tutor. Gli utenti possono cercare tutor in base a materia, prezzo e disponibilità, prenotare sessioni, scambiarsi messaggi in tempo reale e lasciare recensioni. Il progetto è sviluppato come Single Page Application (SPA) e rispetta i requisiti del corso di Fondamenti del Web.

📑 Indice

Concetti Teorici e Architettura

Stack Tecnologico

Struttura del Progetto

Modello Dati (MongoDB)

Prerequisiti

Configurazione Variabili d'Ambiente

Setup Backend (Sviluppo Locale)

Setup Frontend (Sviluppo Locale)

Deployment Locale con Docker e Docker Compose

Documentazione e API

📚 1. Concetti Teorici e Architettura

Benvenuto nel team! Per iniziare con il piede giusto, ecco una panoramica di come è pensata l'applicazione SkillShare. Il progetto è diviso in due macro-aree (Frontend e Backend) che comunicano tra loro tramite rete.

1.1 Architettura Client-Server (SPA)

Client (Frontend): Realizzato in React. È una Single Page Application (SPA). Questo significa che il browser carica un'unica pagina HTML iniziale e la navigazione tra le schermate (ricerca, profilo tutor, chat) avviene in modo dinamico tramite JavaScript (React Router), senza ricaricare la pagina. Questo garantisce un'esperienza utente fluida e reattiva.

Server (Backend): Realizzato in Node.js con Express. Espone delle API RESTful. Il suo compito è ricevere le richieste dal client, validarle, interrogare il database, applicare la logica di business (es. controllare se uno slot orario è già occupato) e restituire i dati in formato JSON.

1.2 Autenticazione e Sicurezza

Utilizziamo JSON Web Token (JWT). Quando un utente fa il login, il server genera un token firmato che il client salva (es. nel Local Storage o nei Cookie). Ogni richiesta successiva alle API protette includerà questo token nell'header Authorization, permettendo al server di identificare l'utente senza mantenere lo stato della sessione in memoria.

1.3 Comunicazione Real-Time

Per la funzionalità di chat tra studente e tutor, HTTP tradizionale (richiesta-risposta) non è sufficiente. Utilizziamo WebSockets (tramite la libreria Socket.IO) per mantenere un canale bidirezionale sempre aperto, permettendo l'invio e la ricezione di messaggi in tempo reale.

🛠️ 2. Stack Tecnologico

Il progetto è basato sullo stack MERN (MongoDB, Express, React, Node.js).

Frontend:

Libreria UI: React (con Vite per un build e un server di sviluppo ultra-veloci)

Routing: React Router DOM

Gestione Stato: React Context API / Custom Hooks

Stili: CSS puro / TailwindCSS (per un design responsivo e moderno)

Real-time: socket.io-client

Backend:

Runtime & Framework: Node.js + Express.js

Database & ODM: MongoDB + Mongoose (per la modellazione dei dati)

Autenticazione: jsonwebtoken (JWT) e bcryptjs (per l'hashing delle password)

Real-time: socket.io

📂 3. Struttura del Progetto

Il repository è organizzato come un "monorepo" contenente due cartelle principali (frontend e backend) e una cartella per la documentazione, affiancate dai file di orchestrazione Docker.

skillshare/
├── backend/                  # Logica server e API (Node.js/Express)
│   ├── src/
│   │   ├── config/           # Configurazioni (es. db.js per connessione a Mongo)
│   │   ├── controllers/      # Logica di business per ogni rotta (es. authController.js)
│   │   ├── middlewares/      # Middleware Express (es. authMiddleware.js per validare JWT)
│   │   ├── models/           # Schemi Mongoose (User, Session, Message)
│   │   ├── routes/           # Definizione degli endpoint REST (es. userRoutes.js)
│   │   ├── sockets/          # Gestori degli eventi Socket.IO per la chat
│   │   └── utils/            # Funzioni helper (es. validazione input, calcolo slot)
│   ├── .dockerignore         # File per escludere file non necessari alla build di Docker
│   ├── .env.example          # Template delle variabili d'ambiente
│   ├── Dockerfile            # Configurazione per containerizzare il backend
│   ├── package.json
│   └── server.js             # Entry point del server backend
│
├── frontend/                 # Client React (Vite)
│   ├── src/
│   │   ├── assets/           # Immagini, icone, font
│   │   ├── components/       # Componenti riutilizzabili (Navbar, Button, TutorCard, Modal)
│   │   ├── context/          # React Context (es. AuthContext, ChatContext)
│   │   ├── hooks/            # Custom hooks (es. useFetch, useAuth)
│   │   ├── pages/            # Componenti pagina (Home, Login, Search, TutorProfile, AdminDashboard)
│   │   ├── services/         # Chiamate API con fetch/axios (es. api.js)
│   │   ├── App.jsx           # Componente root e configurazione Router
│   │   └── main.jsx          # Entry point di React
│   ├── .dockerignore         # File per escludere file non necessari alla build del frontend
│   ├── Dockerfile            # Configurazione multi-stage per React + Nginx
│   ├── index.html            # File HTML principale
│   ├── nginx.conf            # Configurazione Nginx per gestire il routing SPA
│   ├── package.json
│   └── vite.config.js
│
├── docs/                     # Documentazione del progetto (Fondamenti Web)
│   ├── UML/                  # Diagrammi di sequenza e casi d'uso
│   ├── API_DOCS.md           # Documentazione degli endpoint REST
│   └── DataModel.md          # Diagramma E-R e specifiche MongoDB
│
├── docker-compose.yml        # File di orchestrazione per comporre i container dell'app
└── README.md                 # Questo file


🗄️ 4. Modello Dati (MongoDB)

Una panoramica rapida delle collezioni principali che gestiremo in Mongoose:

User: Gestisce studenti, tutor e admin.

Campi base: nome, email, password_hash, ruoli (Array: può essere ['student'], ['student', 'tutor'], o ['admin']).

Campi tutor (popolati solo se ruolo include 'tutor'): materie (array di stringhe), tariffa_oraria, modalita (presenza/remoto), valutazione_media.

Booking (Prenotazione): Collega uno studente a un tutor.

Campi: studentId (ref User), tutorId (ref User), data_ora_inizio, data_ora_fine, stato (in attesa, confermata, completata, annullata), prezzo_totale.

Review (Recensione): Lasciata dallo studente dopo una sessione.

Campi: tutorId, studentId, voto (1-5), commento, data.

Message (Messaggio): Per la chat.

Campi: mittenteId, destinatarioId, testo, timestamp, letto (booleano).

Report (Segnalazione): Per l'area admin.

Campi: segnalatoreId, segnalatoId, motivo, stato (aperto, risolto).

⚙️ 5. Prerequisiti

Assicurati di aver installato sulla tua macchina:

Node.js (versione 18 o superiore raccomandata, solo se intendi sviluppare senza Docker)

MongoDB (solo se sviluppi localmente senza Docker)

Docker Desktop (necessario per avviare l'applicazione in modalità isolata)

Git

🔒 6. Configurazione Variabili d'Ambiente

Il progetto utilizza i file .env per nascondere dati sensibili. Non pushare mai i file .env su GitHub!

Nel Backend (backend/.env):

Nota: Se utilizzi Docker Compose, il server si collegherà automaticamente al DB con l'host mongo.

PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/skillshare # Per sviluppo locale classico
# MONGODB_URI=mongodb://mongo:27017/skillshare   # Cambia a questo se usi Docker Compose manuale
JWT_SECRET=inserisci_una_stringa_molto_lunga_e_segreta
FRONTEND_URL=http://localhost:5173


Nel Frontend (frontend/.env):

VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000


🚀 7. Setup Backend (Sviluppo Locale Classico)

Apri un terminale e naviga nella cartella backend:

cd backend


Installa le dipendenze:

npm install


Crea il file .env basandoti su .env.example.

Avvia il server in modalità sviluppo:

npm run dev


🖥️ 8. Setup Frontend (Sviluppo Locale Classico)

Apri un secondo terminale e naviga nella cartella frontend:

cd frontend


Installa le dipendenze:

npm install


Crea il file .env con le variabili necessarie.

Avvia il server di sviluppo di Vite:

npm run dev


🐳 9. Deployment Locale con Docker e Docker Compose

L'applicazione può essere avviata in pochissimi secondi senza dover installare Node o MongoDB sulla propria macchina fisica. Docker si occuperà di scaricare, configurare ed eseguire tutti i servizi in rete isolata.

Assicurati che Docker Desktop sia attivo sul tuo computer.

Posizionati nella cartella principale del progetto (dove si trova il file docker-compose.yml):

cd skillshare


Avvia tutti i container compilando le immagini necessarie:

docker compose up --build


Docker configurerà:

Database: MongoDB esposto sulla porta 27017 del tuo PC (con dati persistenti in un volume Docker dedicato).

Backend: Server Express in ascolto sulla porta 3000.

Frontend: Applicazione React servita tramite Nginx direttamente sulla porta HTTP 80.

Apri il browser e naviga su http://localhost. Vedrai l'applicazione SkillShare perfettamente funzionante e integrata con il backend!

Comandi utili per Docker:

Arrestare i container: docker compose down

Arrestare eliminando anche i dati nel DB: docker compose down -v

Vedere i log dei container: docker compose logs -f

📖 10. Documentazione e API

Tutta la documentazione di progetto si trova nella cartella docs/.

Diagrammi UML e Modello Dati: Troverai file PDF e Markdown nella cartella docs/UML/ che descrivono i casi d'uso (studente, tutor, admin) e la struttura entità-relazione.

API REST: Le specifiche degli endpoint sono dettagliate nel file docs/API_DOCS.md.