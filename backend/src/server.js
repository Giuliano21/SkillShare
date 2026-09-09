/* server.js è il file principale dell'applicazione, dove viene configurato il server Express e la connessione al database MongoDB.
In questo file vengono importati i moduli necessari, come express, cors e db, e viene creata un'istanza dell'applicazione Express.
Viene anche importato il file index.js per gestire le rotte principali dell'API.
Infine, viene configurata la connessione al database MongoDB e avviato il server sulla porta specificata nelle variabili d'ambiente. */

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const chatSocketAuth = require("./middlewares/chatSocketAuth");
const { registerChatSocket } = require("./sockets/chatSocket");
const { apiLimiter } = require("./middlewares/rateLimiters");
// Prendo i dati dalle variabili d'ambiente definite nel file .env
require("dotenv").config();
const PORT = process.env.PORT || 4000;
// Disabilito l'intestazione "X-Powered-By" per motivi di sicurezza e configuro il trust proxy in base alla variabile d'ambiente TRUST_PROXY.
app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);

/* Configuro il middleware CORS per consentire le richieste da domini diversi, specificando i metodi consentiti,
gli header consentiti, la possibilità di inviare cookie e le intestazioni esposte per la gestione dello streaming video e della paginazione. */
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "100kb", strict: true, parameterLimit: 100 })); // Limita il payload per ridurre abusi e consumo di memoria
app.use(cookieParser()); // Configuro il middleware per il parsing dei cookie nelle richieste
app.use(apiLimiter);

// Importo index.js per gestire le rotte principali dell'API
const apiRoutes = require("./routes/index");
app.use("/api/v1", apiRoutes);

// Configuro la documentazione dell'API utilizzando Swagger
const swaggerUi = require("swagger-ui-express"); // Importo il modulo swagger-ui-express per la documentazione dell'API
const swaggerSpec = require("./swagger"); // swaggerSpec è il file che contiene la documentazione dell'API in formato OpenAPI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuro il server HTTP e Socket.IO per gestire le connessioni in tempo reale
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});
// Configuro il middleware di autenticazione per le connessioni Socket.IO
io.use(chatSocketAuth);
registerChatSocket(io);

// Configuro la connessione al database MongoDB utilizzando la funzione connectDB di db.js
db.connectDB();

// Gestisco le rotte non trovate con un middleware che restituisce un messaggio di errore in formato JSON
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `La rotta ${req.originalUrl} non è stata trovata sul server!`,
  });
});

// Avvio il server sulla porta specificata nelle variabili d'ambiente
httpServer.listen(PORT, () => {
  console.log(`Il server è avviato su http://localhost:${PORT}`);
  console.log(
    `La documentazione dell'API è disponibile su http://localhost:${PORT}/api-docs`,
  );
});
// Timeout per il server HTTP
httpServer.requestTimeout = 30 * 1000;
httpServer.headersTimeout = 35 * 1000;
httpServer.keepAliveTimeout = 5 * 1000;
