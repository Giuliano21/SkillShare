const {
    createOrGetConversationByUsers,
    listConversationsForUser,
    listMessages,
    createMessage,
    markConversationAsRead
} = require('../services/chatService');

// Funzione per creare o visualizzare una conversazione tra due utenti
async function createOrGetConversation(req, res) {
    try {
        // Recupera l'ID dell'utente peer dai parametri della richiesta e crea o recupera la conversazione tra l'utente autenticato e l'utente peer
        const { peerUserId } = req.params;
        const conversation = await createOrGetConversationByUsers(req.user._id, peerUserId);

        return res.status(200).json({
            message: 'Conversazione disponibile.',
            conversation
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
}
// Funzione per elencare tutte le conversazioni dell'utente autenticato
async function listMyConversations(req, res) {
    try {
        const conversations = await listConversationsForUser(req.user._id);
        return res.status(200).json({ conversations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// Funzione per ottenere i messaggi di una conversazione specifica
async function getConversationMessages(req, res) {
    try {
        // Recupera i parametri di paginazione dalla query string della richiesta, con valori predefiniti se non specificati
        const { page = 1, limit = 30 } = req.query;
        const result = await listMessages(req.conversation._id, page, limit);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// Funzione per inviare un messaggio in una conversazione specifica
async function sendMessage(req, res) {
    try {
        // Recupera il testo del messaggio dal corpo della richiesta e crea un nuovo messaggio nella conversazione specificata
        const { text } = req.body;
        const message = await createMessage(req.conversation._id, req.user._id, text);

        return res.status(201).json({
            message: 'Messaggio inviato con successo.',
            data: message
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
}
// Funzione per marcare una conversazione come letta
async function markAsRead(req, res) {
    try {
        // Chiama la funzione di servizio per marcare la conversazione come letta per l'utente autenticato
        const updatedCount = await markConversationAsRead(req.conversation._id, req.user._id);

        return res.status(200).json({
            message: 'Messaggi segnati come letti.',
            updatedCount
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createOrGetConversation,
    listMyConversations,
    getConversationMessages,
    sendMessage,
    markAsRead
};
