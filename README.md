# SkillShare

## Setup Docker (fatto finora)

Abbiamo configurato `docker-compose.yml` con 3 servizi: `mongo`, `backend`, `frontend`, così da avviare tutto l'ambiente di sviluppo con un solo comando (`docker compose up --build`), senza dover installare Node/MongoDB in locale.

### `mongo`
- Immagine ufficiale `mongo:8`, porta `27017:27017` pubblicata sull'host (serve se vogliamo collegarci al DB da fuori Docker).
- Volume `mongo-data:/data/db`: i dati del database vengono salvati in un'area gestita da Docker (non in una cartella del progetto), così sopravvivono anche se ricreiamo il container. Il `mongo-data` va dichiarato anche nella sezione `volumes:`, altrimenti Compose non sa che è un volume gestito da lui.

### `backend` e `frontend`
- `build: ./backend` / `./frontend`: Compose costruisce l'immagine leggendo il rispettivo `Dockerfile` invece di scaricarne una pronta.
- `ports`: il numero a sinistra è la porta sul nostro PC, quello a destra è la porta su cui l'app ascolta dentro il container (deve combaciare con `EXPOSE` nel Dockerfile: 4000 per il backend, 5173 per il frontend/Vite).
- `depends_on`: dice a Compose in che ordine avviare i servizi (mongo prima del backend, backend prima del frontend), anche se non garantisce che il servizio "dipendente" sia già pronto a ricevere richieste, solo che il container sia partito.
- `volumes`: 
  1. `./backend:/usr/src/app` collega la nostra cartella locale al container, così le modifiche al codice si vedono subito senza rifare la build.
  2. `/usr/src/app/node_modules` protegge la `node_modules` installata dentro il container quando facciamo la build, impedendo che il bind mount della riga sopra la sovrascriva con la nostra `node_modules` locale (che spesso è vuota o incompatibile, essendo Windows).
- `env_file: ./backend/.env` sul backend: il backend legge lì le variabili come `MONGO_URI`, `PORT`, `CLIENT_URL`. Il file `.env` non è committato (è nel `.gitignore`), mentre `.env.example` sì, come traccia di quali variabili servono.

## Stato attuale
- Ambiente Docker funzionante per `mongo` e `frontend`.
- Il `backend` non parte ancora: manca il file di ingresso `index.js` e la struttura di cartelle (`src/`) del codice Express.

