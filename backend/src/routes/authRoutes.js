/* authRoutes.js definisce le rotte per la registrazione, il login, il logout e il refresh del token di accesso degli utenti.
 Queste rotte vengono gestite dal controller authController.js, che contiene la logica per eseguire le operazioni di autenticazione. */

const express = require('express');
const router = express.Router();

// Importo authController per gestire le richieste di registrazione, login, logout e refresh del token di accesso
const AuthController = require('../controllers/authController');
const { authIpLimiter, authAccountLimiter, registerLimiter } = require('../middlewares/rateLimiters');

// Rotte per la registrazione, login, logout e refresh del token di accesso degli utenti
router.post('/register' , registerLimiter, AuthController.register);
router.post('/login' , authIpLimiter, authAccountLimiter, AuthController.login);
router.post('/logout' , AuthController.logout);
router.post('/refresh' , AuthController.refresh);
module.exports = router;