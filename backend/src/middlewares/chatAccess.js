// Middleware per verificare se l'utente ha accesso a una conversazione specifica.

const { ensureConversationMembership } = require('../services/chatService');

async function requireConversationMembership(req, res, next) {
    try {
        const conversationId = req.params.conversationId || req.body.conversationId;
        if (!conversationId) {
            return res.status(400).json({ message: 'conversationId mancante.' });
        }
        // Verifica se l'utente è membro della conversazione specificata
        const conversation = await ensureConversationMembership(conversationId, req.user._id);
        req.conversation = conversation;
        return next();
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
}

module.exports = {
    requireConversationMembership
};
