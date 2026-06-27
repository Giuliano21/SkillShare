const express = require('express');
const router = express.Router();

// Importo il controller per gestire le operazioni relative agli utenti
const UserController = require('../controllers/UserController');

// Importo il middleware per verificare il token JWT e proteggere le rotte che richiedono autenticazione
const auth = require('../middlewares/auth');

router.use(auth.verifyToken); // Tutte le rotte qui sotto richiedono autenticazione

// Definisco le rotte per la gestione del profilo utente
router.route('/profile')
    .get(UserController.getProfile)
    .put(UserController.updateProfile)
    .delete(UserController.deleteProfile);
    
module.exports = router;