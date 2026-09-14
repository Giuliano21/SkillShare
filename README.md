# SkillShare

Il progetto consiste nella realizzazione di una piattaforma web che permetta a studenti e tutor di comunicare in modo semplice ed efficace. L'obiettivo principale è offrire agli studenti uno strumento per: cercare tutor filtrandoli per materia, prezzo e altre opzioni; prenotare una lezione con un tutor e chattare a vicenda; scrivere recensioni verso i tutor con cui gli studenti hanno svolto una prenotazione.

Dal punto di vista tecnico, l'applicazione è una **Single Page Application** con client-side rendering, con un frontend in React, un backend in Node.js + Express e un database MongoDB in cloud. Sono state implementate anche API autenticate, login lato frontend e, l'uso di Socket.IO per la chat tra studenti e tutor.

## Funzionamento

1. Un utente crea un account o effettua il login.
2. Lo studente cerca un tutor filtrando i risultati per materia, prezzo e modalita di lezione.
3. Lo studente consulta il profilo del tutor e seleziona uno o piu slot disponibili.
4. Il tutor visualizza la richiesta e aggiorna lo stato della prenotazione.
5. Dopo l'accettazione della prenotazione, studente e tutor possono comunicare nella chat privata.
6. Al termine della lezione, lo studente puo lasciare o modificare una recensione.

I ruoli applicativi sono `student` e `tutor`. Un utente autenticato puo accedere al proprio profilo e alle proprie prenotazioni; le aree di ricerca, gestione disponibilita e dashboard sono protette in base al ruolo.

## Architettura

Il progetto e composto da tre servizi:

- `frontend/`: Single Page Application React con Vite, React Router e Socket.IO Client.
- `backend/`: API REST Express, autenticazione JWT, accesso a MongoDB e server Socket.IO.
- `mongo`: database MongoDB utilizzato dal backend.

```text
SkillShare/
├── frontend/          # Interfaccia React
├── backend/           # API e logica applicativa
├── docs/UML/          # Diagrammi UML del progetto
└── docker-compose.yml  # Avvio coordinato dei servizi
```

## Tecnologie

### Frontend

- React 19
- Vite
- React Router DOM
- Fetch API
- Socket.IO Client

### Backend

- Node.js
- Express
- MongoDB e Mongoose
- JWT e cookie httpOnly per l'autenticazione
- bcryptjs per l'hashing delle password
- Socket.IO per la chat real-time
- Swagger/OpenAPI per la documentazione delle API

## Requisiti

- Node.js 22 o versione compatibile.
- Docker Desktop, se si utilizza Docker Compose.
- Un database MongoDB locale o raggiungibile tramite URI.

## Avvio con Docker Compose

Configurare prima le variabili del backend in `backend/.env` partendo dall'eventuale file `.env.example`, quindi eseguire dalla directory principale:

```bash
docker compose up --build
```

Servizi disponibili:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

Per arrestare i container:

```bash
docker compose down
```

I dati MongoDB sono conservati nel volume Docker `mongo-data`.

## Avvio senza Docker

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

In un secondo terminale:

```bash
cd frontend
npm install
npm run dev
```

Il frontend usa per impostazione predefinita le API su `http://localhost:4000/api/v1`. Per modificarle, copiare `frontend/.env.example` in `frontend/.env` e impostare:

```env
VITE_API_URL=http://localhost:4000/api/v1
VITE_SOCKET_URL=http://localhost:4000
```

## Seed dei tutor

Il backend include uno script per inserire dati di esempio:

```bash
cd backend
npm run seed
```

Per rimuovere i dati creati dallo script:

```bash
npm run seed:clean
```

## API e autenticazione

Le API sono disponibili sotto il prefisso `/api/v1`. Le aree principali sono:

- `/auth`: registrazione, login, refresh e logout.
- `/users`: profilo personale e profili pubblici.
- `/tutors`: ricerca, profili e disponibilita.
- `/bookings`: creazione e gestione delle prenotazioni.
- `/reviews`: recensioni dei tutor.
- `/chats`: conversazioni e messaggi.
- `/health`: verifica dello stato del server.

Il login restituisce un access token JWT e imposta un refresh token in un cookie httpOnly. Il frontend usa l'access token per le richieste protette e prova automaticamente a rinnovarlo all'avvio. La chat Socket.IO richiede il token durante l'handshake.

La documentazione completa degli endpoint e disponibile tramite Swagger all'indirizzo `/api-docs` quando il backend e avviato.


## Documentazione aggiuntiva

- [README del backend](backend/README.md)
- [README del frontend](frontend/README.md)
- Diagrammi UML nella directory `docs/UML/`
- Documentazione Swagger `http://localhost:4000/api-docs`

## Credenziali per account tutor e studente di prova
### Tutor  
- email: professore@email.com
- password: password123
### Studente
- email: studente@email.com
- password: password123

