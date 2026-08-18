/* healthRoutes.js gestisce le rotte relative allo stato di salute dell'applicazione. 
Queste rotte vengono utilizzate per verificare se l'applicazione è in esecuzione correttamente e risponde alle richieste. */

const express = require('express');
const router = express.Router();

// Importo il controller per lo stato di salute dell'applicazione, che contiene la logica per verificare se l'applicazione è in esecuzione correttamente
const HealthController = require('../controllers/healthController');

// Rotta per ottenere lo stato dell'applicazione
router.get('/' , HealthController.healthCheck);

module.exports = router;