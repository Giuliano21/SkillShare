const {
    createOrGetConversationByUsers,
    ensureConversationMembership,
    createMessage,
    markConversationAsRead
} = require('../services/chatService');

// Funzione per generare il nome della stanza di chat basata sull'ID della conversazione
function conversationRoom(conversationId) {
    return `conversation:${conversationId}`;
}

// Funzione per registrare gli eventi del socket di chat
function registerChatSocket(io) {
    // Gestisce la connessione di un nuovo socket
    io.on('connection', (socket) => {
        // Gestisce l'evento di apertura di una conversazione tra due utenti
        socket.on('conversation:open', async (payload = {}, callback) => {
            try {
                const { peerUserId } = payload;
                const conversation = await createOrGetConversationByUsers(socket.user._id, peerUserId);
                const room = conversationRoom(conversation._id);
                await socket.join(room);

                // Invia la risposta al client con i dettagli della conversazione
                if (typeof callback === 'function') {
                    callback({ ok: true, conversation });
                }
            } catch (error) {
                if (typeof callback === 'function') {
                    callback({ ok: false, error: error.message });
                }
            }
        });

        // Gestisce l'evento di un utente che si unisce a una conversazione esistente
        socket.on('conversation:join', async (payload = {}, callback) => {
            try {
                const { conversationId } = payload;
                const conversation = await ensureConversationMembership(conversationId, socket.user._id);
                const room = conversationRoom(conversation._id);
                await socket.join(room);

                if (typeof callback === 'function') {
                    callback({ ok: true, conversationId: conversation._id });
                }
            } catch (error) {
                if (typeof callback === 'function') {
                    callback({ ok: false, error: error.message });
                }
            }
        });
        // Gestisce l'evento di invio di un messaggio in una conversazione
        socket.on('message:send', async (payload = {}, callback) => {
            try {
                const { conversationId, text, clientMessageId } = payload;
                await ensureConversationMembership(conversationId, socket.user._id);
                const savedMessage = await createMessage(conversationId, socket.user._id, text);
                const room = conversationRoom(conversationId);

                // Invia il messaggio a tutti i membri della conversazione nella stanza corrispondente
                io.to(room).emit('message:new', {
                    conversationId,
                    message: savedMessage,
                    clientMessageId: clientMessageId || null
                });

                if (typeof callback === 'function') {
                    callback({ ok: true, message: savedMessage });
                }
            } catch (error) {
                if (typeof callback === 'function') {
                    callback({ ok: false, error: error.message });
                }
            }
        });
        // Gestisce l'evento di lettura di un messaggio in una conversazione
        socket.on('message:read', async (payload = {}, callback) => {
            try {
                const { conversationId } = payload;
                await ensureConversationMembership(conversationId, socket.user._id);
                const updatedCount = await markConversationAsRead(conversationId, socket.user._id);
                const room = conversationRoom(conversationId);
                
                io.to(room).emit('message:read', {
                    conversationId,
                    readerId: socket.user._id,
                    updatedCount
                });

                if (typeof callback === 'function') {
                    callback({ ok: true, updatedCount });
                }
            } catch (error) {
                if (typeof callback === 'function') {
                    callback({ ok: false, error: error.message });
                }
            }
        });
    });
}

module.exports = {
    registerChatSocket
};
