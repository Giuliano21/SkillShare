
const express = require('express');
const router = express.Router();
// Importo il controller per gestire le conversazioni
const chatController = require('../controllers/chatController');
// Importo il middleware per verificare il token JWT e proteggere le rotte che richiedono autenticazione
const auth = require('../middlewares/auth');

router.use(auth.verifyToken); // Tutte le rotte richiedono autenticazione

router.get('/', chatController.getMyConversations);

router.get('/:conversationId/messages', chatController.getMessages);

router.post('/:conversationId/messages', chatController.sendMessage);
module.exports = router;