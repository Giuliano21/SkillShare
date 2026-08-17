/* server.js è il file principale dell'applicazione, dove viene configurato il server Express e la connessione al database MongoDB.
In questo file vengono importati i moduli necessari, come express, cors e db, e viene creata un'istanza dell'applicazione Express.
Viene anche importato il file index.js per gestire le rotte principali dell'API.
Infine, viene configurata la connessione al database MongoDB e avviato il server sulla porta specificata nelle variabili d'ambiente. */

const express= require('express');
const cors= require('cors');
const http = require('http'); 
const { Server } = require('socket.io');
const db= require('./config/db');
const app= express();
const cookieParser= require('cookie-parser');
const chatSocketAuth = require('./middlewares/chatSocketAuth');
const { registerChatSocket } = require('./sockets/chatSocket');
// Prendo i dati dalle variabili d'ambiente definite nel file .env
require('dotenv').config();
const PORT= process.env.PORT || 3000;

/* Configuro il middleware CORS per consentire le richieste da domini diversi, specificando i metodi consentiti,
gli header consentiti, la possibilità di inviare cookie e le intestazioni esposte per la gestione dello streaming video e della paginazione. */
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowHeaders: ['Content-Type', 'Authorization'], 
    credentials: true ,   
};
app.use(cors(corsOptions));

app.use(express.json()); // Configuro il middleware per il parsing del corpo delle richieste in formato JSON
app.use(cookieParser()); // Configuro il middleware per il parsing dei cookie nelle richieste

// Importo index.js per gestire le rotte principali dell'API
const apiRoutes= require('./routes/index');
app.use('/api/v1', apiRoutes);

// Configuro la documentazione dell'API utilizzando Swagger
const swaggerUi = require('swagger-ui-express'); // Importo il modulo swagger-ui-express per la documentazione dell'API
const swaggerSpec = require('./swagger'); // swaggerSpec è il file che contiene la documentazione dell'API in formato OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuro il server HTTP e Socket.IO per gestire le connessioni in tempo reale
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: corsOptions
});
// Configuro il middleware di autenticazione per le connessioni Socket.IO
io.use(chatSocketAuth);
registerChatSocket(io);


// Configuro la connessione al database MongoDB utilizzando la funzione connectDB di db.js 
db.connectDB();

// Gestisco le rotte non trovate con un middleware che restituisce un messaggio di errore in formato JSON
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `La rotta ${req.originalUrl} non è stata trovata sul server!`
    });
}); 

// Avvio il server sulla porta specificata nelle variabili d'ambiente
httpServer.listen(PORT , () => {
    console.log(`Il server è avviato su http://localhost:${PORT}`);
    console.log(`La documentazione dell'API è disponibile su http://localhost:${PORT}/api-docs`);
});

