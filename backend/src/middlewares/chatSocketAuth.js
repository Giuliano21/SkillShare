const { getUserFromAccessToken } = require('./auth');

// Funzione middleware per autenticare gli utenti tramite socket.io utilizzando un token JWT
async function chatSocketAuth(socket, next) {
    try {
        // Estrae il token JWT dai dati di autenticazione del handshake socket
        const token = socket.handshake?.auth?.token;

        if (!token) {
            const error = new Error('Token mancante nell\' handshake socket.');
            error.data = { code: 'UNAUTHORIZED' };
            return next(error);
        }

        const user = await getUserFromAccessToken(token);
        // Aggiunge le informazioni dell'utente all'oggetto socket per l'autenticazione
        socket.user = {
            _id: user._id,
            userId: user.userId,
            role: user.role,
            username: user.username
        };

        return next();
    } catch (error) {
        const authError = new Error('Token non valido o scaduto.');
        authError.data = {
            code: 'UNAUTHORIZED',
            details: error.message
        };
        return next(authError);
    }
}

module.exports = chatSocketAuth;
