# SkillShare Backend

Backend API per la piattaforma SkillShare, un sistema di prenotazione e gestione lezioni private tra tutor e studenti con chat real-time integrata.

## Stack Tecnologico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Autenticazione**: JWT (Access Token + Refresh Token)
- **Real-time**: Socket.IO
- **Documentazione**: Swagger/OpenAPI 3.0

## Struttura Cartelle

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Configurazione connessione MongoDB
│   │
│   ├── controllers/
│   │   ├── authController.js     # Registrazione, login, refresh token
│   │   ├── bookingController.js  # Gestione prenotazioni
│   │   ├── chatController.js     # Endpoint REST chat privata
│   │   ├── healthController.js   # Health check API
│   │   ├── reviewController.js   # Gestione recensioni tutor
│   │   ├── tutorController.js    # Profili tutor e disponibilità
│   │   └── userController.js     # Gestione profilo utente
│   │
│   ├── middlewares/
│   │   ├── auth.js               # Verifica JWT e autorizzazione
│   │   ├── chatAccess.js         # Validazione membership conversation
│   │   └── chatSocketAuth.js     # Autenticazione Socket.IO handshake
│   │
│   ├── models/
│   │   ├── AvailabilitySlot.js   # Slot disponibilità tutor
│   │   ├── Booking.js            # Prenotazioni lezioni
│   │   ├── Conversations.js      # Conversazioni chat privata
│   │   ├── Messages.js           # Messaggi chat
│   │   ├── Review.js             # Recensioni tutor
│   │   ├── Tutor.js              # Profili tutor
│   │   └── User.js               # Profili utente (student/tutor)
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # /api/v1/auth/*
│   │   ├── bookingRoutes.js      # /api/v1/bookings/*
│   │   ├── chatRoutes.js         # /api/v1/chats/*
│   │   ├── healthRoutes.js       # /api/v1/health
│   │   ├── index.js              # Aggregatore rotte
│   │   ├── reviewRoutes.js       # /api/v1/reviews/*
│   │   ├── tutorRoutes.js        # /api/v1/tutors/*
│   │   └── userRoutes.js         # /api/v1/users/*
│   │
│   ├── services/
│   │   ├── chatService.js        # Logica dominio chat privata
│   │   └── tokenServices.js      # Generazione e verifica JWT
│   │
│   ├── sockets/
│   │   └── chatSocket.js         # Handler eventi Socket.IO chat
│   │
│   ├── server.js                 # Bootstrap Express + Socket.IO
│   └── swagger.js                # Documentazione OpenAPI
│
├── .env                          # Variabili ambiente
├── package.json                  # Dipendenze Node.js
└── README.md                     # Questo file
```

## Autenticazione e Autorizzazione

### Flusso di Autenticazione

1. **Registrazione** (`POST /api/v1/auth/register`)
   - Crea nuovo utente (studente o tutor)
   - Hash password con bcrypt
   - Risposta: ID utente e credenziali

2. **Login** (`POST /api/v1/auth/login`)
   - Verifica credenziali
   - Genera Access Token (15 minuti) + Refresh Token (7 giorni, httpOnly cookie)
   - Risposta: Access Token

3. **Refresh Token** (`POST /api/v1/auth/refresh`)
   - Legge Refresh Token da cookie
   - Genera nuovo Access Token
   - Nessuna necessità di re-login

4. **Logout** (`POST /api/v1/auth/logout`)
   - Invalida Refresh Token
   - Cancella cookie

### Middleware di Autorizzazione

- **verifyToken**: Estrae e valida JWT da header Bearer o query. Popola `req.user` con dati utente.
- **restrictTo(roles)**: Controlla che il ruolo utente sia in un array consentito.

### Token JWT

```javascript
// Access Token Payload
{
  userId: "64d1f4c9e1b44a0012345678",
  role: "tutor",         // Prima di array, default ["student"]
  iat: 1234567890,
  exp: 1234567890 + 15m
}
```

## Entità Principali

### User (Utente)
- Ruoli: `["student"]`, `["tutor"]`, o entrambi
- Stato: `active` | `deleted` (soft-delete)
- Credenziali: email, password (hashata), username

### Tutor (Profilo Tutor)
- Associato a User via `userId`
- Materie insegnate (array)
- Prezzo orario, bio, modalità lezione (remote/presence)
- Valutazione media e numero recensioni

### AvailabilitySlot (Disponibilità)
- Slot settimanale (giorno, ora inizio/fine)
- Stato: `isBooked` (true se occupato)

### Booking (Prenotazione)
- Collega studente + tutor + slot
- Stato: `pending` → `accepted` → `completed` | `cancelled`
- Subject: materia lezione

### Review (Recensione)
- Tutor recensibile solo da studente che ha completato booking
- Rating 1-5, commento opzionale
- Aggiorna valutazione media tutor

### Conversation (Conversazione Chat)
- Chat privata 1:1 tra tutor e studente
- Accessibile solo con booking accepted
- Persiste anche dopo cambio stato booking
- Chiave unica: `participantsKey` (coppia ordinata utenti)

### Message (Messaggio)
- Testo max 1000 caratteri
- Read receipt: `isRead` (default false)
- Ordinabile per createdAt

## API REST Principali

### Autenticazione

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Registra utente | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/refresh` | Rinnova access token | No |
| POST | `/api/v1/auth/logout` | Logout | Sì |

### Profilo Utente

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users/profile` | Ottieni profilo | Sì |
| PUT | `/api/v1/users/profile` | Aggiorna profilo | Sì |
| DELETE | `/api/v1/users/profile` | Cancella profilo | Sì |

### Tutor

| Metodo | Endpoint | Descrizione | Auth | Ruolo |
|--------|----------|-------------|------|-------|
| GET | `/api/v1/tutors` | Cerca tutor (filtri: subject, price, rating) | No | - |
| GET | `/api/v1/tutors/:id` | Dettagli tutor | No | - |
| GET | `/api/v1/tutors/:id/availability` | Slot disponibilità | No | - |
| POST | `/api/v1/tutors/:id/availability` | Aggiungi slot | Sì | tutor |
| PUT | `/api/v1/tutors/:id/availability` | Aggiorna slot | Sì | tutor |

### Prenotazioni

| Metodo | Endpoint | Descrizione | Auth | Ruolo |
|--------|----------|-------------|------|-------|
| POST | `/api/v1/bookings` | Crea prenotazione | Sì | student |
| GET | `/api/v1/bookings/my-bookings` | Lista mie prenotazioni | Sì | - |
| PATCH | `/api/v1/bookings/:id/cancel` | Cancella prenotazione | Sì | student |
| PATCH | `/api/v1/bookings/:id/status` | Aggiorna stato (pending/accepted/completed) | Sì | tutor |

### Recensioni

| Metodo | Endpoint | Descrizione | Auth | Ruolo |
|--------|----------|-------------|------|-------|
| GET | `/api/v1/reviews/:tutorId` | Leggi recensioni tutor | No | - |
| POST | `/api/v1/reviews` | Crea recensione | Sì | student |
| PUT | `/api/v1/reviews/:id` | Aggiorna recensione | Sì | student |
| DELETE | `/api/v1/reviews/:id` | Elimina recensione | Sì | student |

### Chat Privata

| Metodo | Endpoint | Descrizione | Auth | Note |
|--------|----------|-------------|------|------|
| GET | `/api/v1/chats/conversations` | Lista conversazioni | Sì | - |
| POST | `/api/v1/chats/conversations/with/:peerUserId` | Apri/crea chat con peer | Sì | Richiede booking accepted |
| GET | `/api/v1/chats/conversations/:conversationId/messages` | Storico messaggi (paginato) | Sì | 30 msg/pagina default |
| POST | `/api/v1/chats/conversations/:conversationId/messages` | Invia messaggio | Sì | Max 1000 caratteri |
| PATCH | `/api/v1/chats/conversations/:conversationId/read` | Segna come letti | Sì | Messaggi ricevuti |

### Health Check

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/v1/health` | Verifica stato server |

## Socket.IO Real-Time Chat

### Autenticazione
- Token JWT trasmesso via handshake: `socket.handshake.auth.token`
- Su fallback: errore handshake, connessione rifiutata

### Eventi Socket Emessi dal Client

```javascript
// Apri conversazione con peer (auto-crea se non esiste e booking accepted)
socket.emit('conversation:open', { peerUserId: "..." }, callback)

// Entra in una conversazione specifica
socket.emit('conversation:join', { conversationId: "..." }, callback)

// Invia messaggio (broadcasting a room participants)
socket.emit('message:send', {
  conversationId: "...",
  text: "...",
  clientMessageId: "..." // opzionale, per dedup client-side
}, callback)

// Segna messaggi come letti
socket.emit('message:read', { conversationId: "..." }, callback)
```

### Eventi Socket Ricevuti dal Client

```javascript
// Nuovo messaggio in room
socket.on('message:new', (payload) => {
  // payload: { conversationId, message, clientMessageId }
})

// Conferma messaggi come letti
socket.on('message:read', (payload) => {
  // payload: { conversationId, readerId, updatedCount }
})
```

### Room Structure
- Ogni conversation ha una room: `conversation:{conversationId}`
- Broadcasting limitato ai soli partecipanti autorizzati

## Regole di Sicurezza Chat

1. **Accesso iniziale**: Consentito solo se esiste almeno una booking con status `accepted` tra tutor e studente
2. **Persistenza**: Conversation rimane accessibile anche se booking diventa `cancelled` o `completed`
3. **Membership**: Solo partecipanti della conversation possono inviare/leggere messaggi
4. **Autenticazione Socket**: Token JWT obbligatorio nel handshake

## Variabili Ambiente (.env)

```env
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/skillshare

# JWT
ACCESS_TOKEN_SECRET=your_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here
```

## Avvio

### Sviluppo
```bash
npm install
npm run dev
```

Server avvia su `http://localhost:3000`  
Swagger disponibile su `http://localhost:3000/api-docs`

### Produzione
```bash
npm start
```

## Documentazione

- **OpenAPI/Swagger**: Disponibile su `/api-docs`
- **Schema Database**: Descritti nei file `src/models/*.js`
- **Middleware**: Documentati nei file `src/middlewares/*.js`

## Note Implementative

- **Soft-Delete**: User impostabile a `deleted` senza cancelazione fisica
- **Role-Based Access**: Controllo ruoli con array-aware checks
- **Paginazione**: Default 30 items/pagina, max 100
- **Limiti Messaggi**: 1000 caratteri massimi per messaggio
- **Indici Database**: Ottimizzati per query conversazione-messaggi
