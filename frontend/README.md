# SkillShare Frontend

Applicazione web client di SkillShare, una Single Page Application realizzata con React e Vite. Permette a studenti e tutor di utilizzare le funzionalita della piattaforma attraverso le API del backend e la chat real-time.

## Tecnologie

- React 19
- Vite
- React Router DOM
- Fetch API per le richieste HTTP
- Socket.IO Client per la chat real-time
- ESLint per il controllo del codice

## Funzionalità

- Registrazione e accesso degli utenti.
- Gestione della sessione con access token JWT e refresh token tramite cookie httpOnly.
- Ricerca dei tutor con filtri per materia, prezzo e modalita di lezione.
- Visualizzazione del profilo pubblico e dei dettagli di un tutor.
- Gestione del profilo personale.
- Gestione delle disponibilita per i tutor.
- Creazione e gestione delle prenotazioni.
- Chat privata tra utenti autorizzati.
- Visualizzazione e gestione delle recensioni dello studente.
- Protezione delle pagine in base all'autenticazione e al ruolo dell'utente.

## Pagine principali

| Percorso | Accesso | Descrizione |
|---|---|---|
| `/` | Pubblico | Home page e tutor in evidenza; per un tutor autenticato mostra la dashboard |
| `/login` | Pubblico | Accesso all'account |
| `/register` | Pubblico | Registrazione di un nuovo account |
| `/tutors/search` | Studente | Ricerca tutor con filtri |
| `/tutors/:id` | Studente | Dettagli del tutor, disponibilita e prenotazione |
| `/profile` | Utente autenticato | Profilo personale |
| `/users/:id` | Utente autenticato | Profilo pubblico di un utente |
| `/bookings` | Utente autenticato | Elenco delle prenotazioni |
| `/tutor/dashboard` | Tutor | Dashboard del tutor |
| `/tutor/availability` | Tutor | Gestione degli slot disponibili |
| `/chat` | Utente autenticato | Conversazioni e messaggi |
| `/reviews/mine` | Studente | Recensioni scritte dallo studente |

## Struttura del progetto

```text
frontend/
├── public/                  # Risorse statiche
├── src/
│   ├── api/                 # Client HTTP, API applicative e Socket.IO
│   ├── assets/              # Risorse utilizzate dall'interfaccia
│   ├── components/          # Componenti condivisi
│   ├── context/             # Stato globale dell'autenticazione
│   ├── pages/               # Pagine associate alle rotte
│   ├── routes/              # Router e protezione delle rotte
│   ├── utils/               # Funzioni e costanti di supporto
│   ├── App.jsx              # Layout comune dell'applicazione
│   ├── index.css            # Stili globali
│   └── main.jsx             # Punto di ingresso
├── .env.example             # Esempio delle variabili d'ambiente
├── Dockerfile
├── package.json
└── vite.config.js
```


## Autenticazione

All'avvio `AuthProvider` tenta di rinnovare la sessione tramite il refresh token memorizzato nel cookie httpOnly del backend. L'access token ricevuto viene mantenuto in memoria e aggiunto alle richieste API tramite header `Authorization: Bearer <token>`.

Le rotte protette attendono il completamento del caricamento della sessione prima di effettuare redirect. Le pagine riservate ai tutor o agli studenti verificano inoltre il ruolo dell'utente.

## Chat

La chat utilizza sia le API REST per conversazioni e storico dei messaggi sia Socket.IO per la ricezione in tempo reale. Il token JWT viene trasmesso durante l'handshake Socket.IO. L'accesso alla conversazione e gestito dal backend e richiede i permessi previsti dalla piattaforma.
