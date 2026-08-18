
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const chatController = require('../controllers/chatController');
const { requireConversationMembership } = require('../middlewares/chatAccess');

router.use(auth.verifyToken);
// Rotta per visualizzare tutte le conversazioni dell'utente autenticato
router.get('/conversations', chatController.listMyConversations);
// Rotta per creare o visualizzare una conversazione tra due utenti
router.post('/conversations/with/:peerUserId', chatController.createOrGetConversation);
// Rotta per visualizzare i messaggi di una conversazione specifica, richiede che l'utente sia membro della conversazione
router.get('/conversations/:conversationId/messages', requireConversationMembership, chatController.getConversationMessages);
// Rotta per inviare un messaggio in una conversazione specifica, richiede che l'utente sia membro della conversazione
router.post('/conversations/:conversationId/messages', requireConversationMembership, chatController.sendMessage);
// Rotta per marcare una conversazione come letta, richiede che l'utente sia membro della conversazione
router.patch('/conversations/:conversationId/read', requireConversationMembership, chatController.markAsRead);

module.exports = router;
