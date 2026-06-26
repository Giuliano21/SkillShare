# Progetto piattaforma tutor-studente

## Descrizione del progetto

Il progetto consiste nella realizzazione di una piattaforma web che permetta a studenti e tutor di trovarsi in modo semplice ed efficace. L'obiettivo principale è offrire agli studenti uno strumento per cercare insegnanti filtrandoli per materia, prezzo e altri criteri utili, consentire ai tutor di proporsi agli studenti attraverso un profilo pubblico e permettere ai due attori di interagire tramite chat e prenotazione di lezioni.[1]

Dal punto di vista tecnico, l'applicazione deve essere sviluppata come **Single Page Application** con client-side rendering, con un frontend in React, un backend in Node.js + Express e un database MongoDB in cloud. La pratica del corso suggerisce inoltre di prevedere API autenticate, login lato frontend e, per interazioni real-time come la chat, l'uso di Socket.IO.[1]

## Obiettivi del progetto

La piattaforma deve soddisfare questi obiettivi principali:

- Permettere la registrazione e il login degli utenti.[1]
- Distinguere tra utente studente e utente tutor tramite ruoli applicativi.[1]
- Consentire la ricerca dei tutor tramite filtri.
- Mostrare schede tutor con informazioni utili alla scelta.
- Consentire a uno studente autenticato di aprire una chat privata con un tutor.[1]
- Consentire allo studente di prenotare una lezione scegliendo uno slot libero del tutor.
- Consentire allo studente di lasciare una recensione dopo l'esperienza con il tutor.
- Consentire al tutor di gestire disponibilità, accettare o disdire prenotazioni.
- Consentire all'utente di effettuare logout ed eliminare il proprio account.

## Funzionalità principali

### 1. Home page

La home page rappresenta il punto di accesso principale alla piattaforma e deve contenere gli elementi chiave dell'esperienza iniziale dell'utente.

Componenti previsti:

- Navbar con logo del sito.
- Barra di ricerca tutor.
- Bottone di login.
- Bottone “Diventa tutor”.
- Sezione principale con carosello di tutor in evidenza.

### 2. Card tutor

Ogni tutor mostrato nella home o nella pagina risultati deve essere rappresentato tramite una card contenente:

- Nome e cognome.
- Numero di stelle o valutazione media.
- Numero di recensioni.
- Breve descrizione personale.
- Prezzo orario.
- Eventuale materia principale insegnata.
- Pulsante per visualizzare il profilo.
- Pulsante per avviare la chat.
- Pulsante per prenotare una lezione.

### 3. Registrazione e login

La piattaforma deve prevedere un sistema di autenticazione sicura. La pratica consente l'uso di password con hashing, Passport, OAuth o altri meccanismi, oltre a sessioni basate su cookie o JWT.[1]

La soluzione consigliata per questo progetto è:

- Registrazione unica dell'account.
- Login unico per tutti gli utenti.
- Possibilità, in fase di registrazione oppure successivamente, di diventare tutor.
- Profilo tutor separato dai dati generali dell'utente.

Questo approccio evita duplicazioni di codice e rende più pulita la gestione dei ruoli applicativi.

### 4. Profilo tutor

Un utente autenticato può completare il proprio profilo tutor inserendo:

- Materie insegnate.
- Prezzo orario.
- Breve biografia.
- Livello di istruzione o qualifiche.
- Disponibilità settimanale.
- Slot di orari liberi prenotabili.
- Eventuale modalità di lezione (online, in presenza, entrambe).

Il tutor deve anche avere un'area personale in cui:

- Visualizzare le proprie prenotazioni.
- Accettare una prenotazione.
- Disdire una prenotazione.
- Aggiornare i propri orari disponibili.

### 5. Ricerca e filtri

Gli studenti devono poter cercare tutor per:

- Materia.
- Prezzo minimo/massimo.
- Modalità della lezione.
- Valutazione media.
- Disponibilità.

La barra di ricerca nella navbar può servire per una ricerca rapida, mentre una pagina dedicata ai tutor può includere filtri più completi.

### 6. Chat privata studente-tutor

La chat deve essere disponibile solo agli utenti autenticati. Poiché la pratica suggerisce di usare tecnologie real-time per casi come chat e aggiornamenti in tempo reale, Socket.IO è una scelta coerente e consigliata.[1]

Funzionalità minime della chat:

- Apertura conversazione tra studente e tutor.
- Invio e ricezione messaggi in tempo reale.[1]
- Visualizzazione dello storico messaggi.
- Accesso consentito solo agli utenti loggati.

### 7. Prenotazione lezioni

Lo studente autenticato deve poter prenotare una lezione con un tutor scegliendo uno slot libero tra quelli messi a disposizione dal tutor.

Funzionalità previste:

- Visualizzazione calendario o elenco slot disponibili del tutor.
- Prenotazione di uno slot libero.
- Stato della prenotazione: `pending`, `accepted`, `cancelled`, `completed`.
- Visualizzazione prenotazioni future e passate nell'area utente.

Lato tutor, devono essere previste le operazioni di:

- Accettazione prenotazione.
- Disdetta prenotazione.
- Gestione disponibilità settimanali o giornaliere.
- Blocco degli slot già prenotati per evitare doppie prenotazioni.

### 8. Recensioni

Lo studente deve poter scrivere una recensione per un tutor. La recensione può essere collegata a una lezione prenotata o completata, così da rendere il sistema più realistico e impedire recensioni arbitrarie.

Ogni recensione deve includere:

- Numero di stelle.
- Testo recensione.
- Data.
- Studente autore.
- Tutor destinatario.

Il sistema deve aggiornare anche:

- Media valutazioni del tutor.
- Numero totale recensioni mostrate nelle card e nel profilo.

### 9. Profilo utente

Ogni utente deve avere una sezione profilo in cui può:

- Visualizzare i propri dati.
- Modificare alcune informazioni personali.
- Effettuare il logout.
- Eliminare il proprio account.

L'eliminazione account deve essere protetta da conferma esplicita, perché comporta la rimozione o disattivazione del profilo e delle funzionalità associate.

## Architettura del progetto

L'architettura deve rispettare i vincoli della pratica, che richiede un progetto organizzato con due sottocartelle principali: `frontend` e `backend`, da consegnare separatamente e senza `node_modules`.[1]

### Frontend

Il frontend deve essere realizzato con React, come richiesto esplicitamente dalla pratica. Per la navigazione tra le viste della SPA è opportuno usare React Router, mentre per gestire lo stato globale dell'autenticazione è utile usare Context API o hook custom, entrambe soluzioni coerenti con i suggerimenti del corso.[1]

Tecnologie consigliate lato frontend:

- React.
- React Router.[1]
- Context API.[1]
- Axios oppure Fetch per chiamare le API backend.[1]
- Material UI oppure CSS personalizzato per i componenti grafici.[1]
- Socket.IO client per la chat real-time.[1]

Se vuoi gestire bene la parte prenotazioni, può essere utile integrare un componente calendario nel frontend, oppure iniziare con una lista di slot orari semplificata.

### Backend

Il backend deve essere sviluppato con Node.js ed Express, in linea con i requisiti tecnici della pratica. Dovrà esporre API REST per autenticazione, gestione utenti, tutor, recensioni, disponibilità, prenotazioni e conversazioni.[1]

Tecnologie consigliate lato backend:

- Node.js.
- Express.[1]
- MongoDB Atlas per il database cloud.[1]
- Mongoose per la modellazione dei dati.
- bcrypt per hashing password.
- JWT oppure cookie di sessione per l'autenticazione.[1]
- Socket.IO per la chat real-time.[1]
- Swagger per documentare le API, come suggerito dalla pratica.[1]

## Modello dati suggerito

### Collezione `users`

Contiene i dati comuni a tutti gli utenti:

- `name`
- `surname`
- `email`
- `passwordHash`
- `role`
- `createdAt`
- `updatedAt`
- `isDeleted` oppure `status`

### Collezione `tutorProfiles`

Contiene le informazioni aggiuntive dei tutor:

- `userId`
- `subjects`
- `hourlyPrice`
- `bio`
- `education`
- `availabilityRules`
- `lessonMode`
- `ratingAverage`
- `reviewsCount`

### Collezione `availabilitySlots`

Contiene gli slot prenotabili dei tutor:

- `tutorId`
- `startDateTime`
- `endDateTime`
- `isBooked`
- `createdAt`

### Collezione `bookings`

Contiene le prenotazioni delle lezioni:

- `studentId`
- `tutorId`
- `slotId`
- `status`
- `subject`
- `notes`
- `createdAt`
- `updatedAt`

### Collezione `reviews`

Contiene le recensioni lasciate dagli studenti:

- `studentId`
- `tutorId`
- `bookingId`
- `rating`
- `comment`
- `createdAt`

### Collezione `conversations`

Contiene le conversazioni tra utenti:

- `participants`
- `createdAt`
- `updatedAt`

### Collezione `messages`

Contiene i singoli messaggi della chat:

- `conversationId`
- `senderId`
- `text`
- `timestamp`
- `isRead`

## Struttura consigliata delle cartelle

```text
project-root/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── tutor/
│   │   │   ├── booking/
│   │   │   ├── review/
│   │   │   ├── chat/
│   │   │   └── profile/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── router.jsx
│   ├── package.json
│   └── .env
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── sockets/
│   │   ├── docs/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
└── docs/
    ├── scenario-applicativo.md
    ├── architettura-applicazione.md
    ├── modello-dati.md
    └── use-case-uml.png
```

Questa struttura è coerente con la consegna, che richiede esplicitamente una cartella di backend e una di frontend e una documentazione tecnica del progetto comprensiva di modello dati e documentazione API.[1]

## Come realizzarlo nel codice

## 1. Avvio del frontend

Nel frontend si crea un progetto React con pagine e componenti separati. Le rotte principali possono essere:

- `/` home page.
- `/login` pagina di login.
- `/register` pagina di registrazione.
- `/tutors` elenco tutor.
- `/tutors/:id` profilo tutor.
- `/become-tutor` completamento profilo tutor.
- `/chat` area chat protetta.
- `/bookings` area prenotazioni.
- `/profile` profilo utente.

Esempio di logica router:

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/tutors" element={<TutorsPage />} />
  <Route path="/tutors/:id" element={<TutorProfilePage />} />
  <Route path="/become-tutor" element={<ProtectedRoute><BecomeTutorPage /></ProtectedRoute>} />
  <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
  <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
</Routes>
```

## 2. Gestione autenticazione

L'autenticazione può essere realizzata con backend Express e JWT. Il frontend invia email e password all'API, riceve un token e salva lo stato utente nel contesto applicativo. La pratica consente esplicitamente autenticazione con hashing password e sessioni via JWT o cookie.[1]

Flusso suggerito:

1. L'utente compila il form di registrazione.
2. Il backend valida i dati.
3. La password viene hashata con bcrypt.
4. L'utente viene salvato in MongoDB.
5. Al login, il backend verifica credenziali e restituisce un token.
6. Il frontend usa il token per accedere alle route protette e alle API autenticate.[1]
7. Al logout il token viene rimosso lato client oppure invalidato lato server, a seconda della strategia scelta.
8. In caso di eliminazione account, il backend deve verificare identità e autorizzazione prima di cancellare o disattivare il profilo.

## 3. API backend principali

API minime consigliate:

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `DELETE /api/auth/account`

### Tutor

- `GET /api/tutors`
- `GET /api/tutors/:id`
- `POST /api/tutors/profile`
- `PUT /api/tutors/profile`
- `GET /api/tutors/:id/availability`
- `POST /api/tutors/availability`
- `PUT /api/tutors/availability/:slotId`
- `DELETE /api/tutors/availability/:slotId`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/me`
- `PATCH /api/bookings/:id/accept`
- `PATCH /api/bookings/:id/cancel`

### Reviews

- `GET /api/reviews/:tutorId`
- `POST /api/reviews`

### Chat

- `GET /api/chat/conversations`
- `GET /api/chat/messages/:conversationId`
- `POST /api/chat/conversations`

Queste API devono essere documentate anche in Swagger, in quanto il file pratica richiede documentazione delle API backend e cita Swagger come formato utile per la consegna.[1]

## 4. Chat real-time con Socket.IO

Per la chat si può aprire una connessione Socket.IO dopo il login. Il client si connette passando il token dell'utente, e il server associa il socket all'utente autenticato. La pratica suggerisce espressamente Socket.IO per questo tipo di interazione real-time.[1]

Eventi principali possibili:

- `join_conversation`
- `send_message`
- `receive_message`
- `message_read`

Logica di base:

1. L'utente apre una conversazione.
2. Il frontend recupera lo storico messaggi via API REST.
3. Il socket entra nella room della conversazione.
4. Quando viene inviato un messaggio, il server lo salva nel database.
5. Il server inoltra il messaggio in tempo reale all'altro partecipante.[1]

## 5. Sistema prenotazioni

La gestione prenotazioni può essere realizzata in questo modo:

1. Il tutor crea o aggiorna gli slot disponibili.
2. Lo studente apre il profilo del tutor e visualizza solo gli slot liberi.
3. Lo studente seleziona uno slot e invia la prenotazione.
4. Il backend crea un booking in stato `pending`.
5. Il tutor può accettare o disdire.
6. Se il tutor accetta, lo stato passa a `accepted`.
7. Se il tutor o lo studente annullano, lo stato passa a `cancelled` e lo slot può tornare disponibile.

È importante gestire correttamente il controllo di concorrenza, in modo che due studenti non prenotino lo stesso slot quasi nello stesso momento.

## 6. Sistema recensioni

La recensione dovrebbe essere possibile solo per studenti autenticati e, idealmente, solo se esiste una prenotazione completata con quel tutor. Questo rende il modello più credibile e più corretto dal punto di vista logico.

Flusso consigliato:

1. Lo studente apre la sezione prenotazioni concluse.
2. Se una lezione è completata, compare il pulsante “Scrivi recensione”.
3. Il frontend invia voto e commento al backend.
4. Il backend salva la recensione e aggiorna media e conteggio nel profilo tutor.

## 7. Profilo utente, logout ed eliminazione account

La pagina profilo deve includere almeno:

- Dati personali.
- Ruolo e stato tutor.
- Cronologia prenotazioni.
- Pulsante logout.
- Pulsante elimina account.

Per l'eliminazione account hai due opzioni:

- **Soft delete**: l'account viene marcato come eliminato ma resta nel database.
- **Hard delete**: l'account viene cancellato davvero.

Per un progetto universitario è spesso più semplice usare una soft delete, perché evita problemi con riferimenti a recensioni, prenotazioni e chat già esistenti.

## 8. Sicurezza minima da implementare

Per rendere il progetto corretto e credibile dal punto di vista tecnico è opportuno prevedere:

- Hashing delle password.
- Validazione input lato server.
- Protezione delle route autenticate.[1]
- Controllo dei ruoli per operazioni da tutor.
- Sanitizzazione dei dati in input.
- Gestione centralizzata degli errori nel backend.
- Verifica che solo il tutor proprietario possa modificare le proprie disponibilità.
- Verifica che solo lo studente autore possa lasciare una recensione legata a una propria prenotazione.

## Roadmap di sviluppo consigliata

### Fase 1: setup iniziale

- Creazione repository.
- Setup frontend React.
- Setup backend Express.
- Configurazione MongoDB Atlas.[1]

### Fase 2: autenticazione

- Registrazione utente.
- Login utente.
- Logout utente.
- Middleware auth.
- Route protette.
- Eliminazione account.

### Fase 3: tutor

- Modello tutor profile.
- API per creare e aggiornare profilo tutor.
- Card tutor e carosello nella home.
- Pagina elenco tutor con filtri.
- Gestione disponibilità e slot orari.

### Fase 4: prenotazioni e recensioni

- Modello booking.
- Modello availability slot.
- API prenotazioni.
- Accettazione/disdetta da parte del tutor.
- Modello review.
- Scrittura recensioni da parte dello studente.

### Fase 5: chat

- Modelli conversation e message.
- API per recupero conversazioni.
- Integrazione Socket.IO client/server.[1]
- Interfaccia chat nel frontend.

### Fase 6: documentazione e rifinitura

- Documentazione architettura.
- Modello dati.
- Swagger API.[1]
- UML casi d'uso.[1]
- Credenziali di test per la consegna.[1]

## Considerazioni finali di progetto

Questa piattaforma rappresenta un progetto adatto al corso perché integra in modo coerente i temi principali richiesti: React lato frontend, Express lato backend, MongoDB cloud, autenticazione sicura, interazione real-time e documentazione tecnica. Inoltre, il dominio applicativo è sufficientemente originale ma resta realistico e realizzabile entro un progetto universitario.

Dal punto di vista della valutazione, il progetto permette di coprire diverse voci previste dalla pratica: API Express, frontend React, uso di CSS o librerie UI, autenticazione, real-time con Socket.IO, deployment e documentazione Swagger. L'aggiunta di prenotazioni, disponibilità e recensioni rende inoltre l'applicazione più completa e più forte anche dal punto di vista della modellazione dei dati e della qualità della demo finale.