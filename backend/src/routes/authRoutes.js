/* authRoutes.js definisce le rotte per la registrazione, il login e il logout   degli utenti.
 Queste rotte vengono gestite dal controller authController.js, che contiene la logica per eseguire le operazioni di autenticazione. */

const express = require('express');
const router = express.Router();

// Importo authController per gestire le richieste di registrazione, login e logout
const AuthController = require('../controllers/authController');

// Rotte per la registrazione, login e logout degli utenti
router.post('/register' , AuthController.register);
router.post('/login' , AuthController.login);
router.post('/logout' , AuthController.logout);
router.post('/refresh' , AuthController.refresh);
module.exports = router;