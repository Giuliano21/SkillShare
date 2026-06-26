const express = require('express');
const router = express.Router();

// Importo il controller per l'autenticazione, che contiene la logica per gestire la registrazione e il login degli utenti
const AuthController = require('../controllers/authController');

// Rotte per la registrazione, login e logout degli utenti
router.post('/register' , AuthController.register);
router.post('/login' , AuthController.login);
router.post('/logout' , AuthController.logout);

module.exports = router;