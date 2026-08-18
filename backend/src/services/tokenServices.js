/* tokenService gestisce la generazione e la verifica degli access token e dei refresh token*/
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    /* Genera un access token utilizzando il metodo sign di jsonwebtoken, includendo l'ID 
    e il ruolo dell'utente nel payload del token, la chiave segreta definita nelle variabili d'ambiente
    e impostando la scadenza del token a 15 minuti. */
    return jwt.sign(
        { userId: user._id || user.id, role: Array.isArray(user.role) ? user.role[0] : user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
}

function generateRefreshToken(user) {
    /* Genera un refresh token utilizzando il metodo sign di jsonwebtoken, includendo l'ID 
    e il ruolo dell'utente nel payload del token, la chiave segreta definita nelle variabili d'ambiente
    e impostando la scadenza del token a 7 giorni. */
    return jwt.sign(
        { userId: user._id || user.id, role: Array.isArray(user.role) ? user.role[0] : user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
}

function verifyAccessToken(token) {
    // Verifica l'access token utilizzando il metodo verify di jsonwebtoken e la chiave segreta definita nelle variabili d'ambiente.
    // Se il token è valido, restituisce le informazioni decodificate dell'utente; altrimenti, genera un errore.
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token) {
    // Verifica il refresh token utilizzando il metodo verify di jsonwebtoken e la chiave segreta definita nelle variabili d'ambiente.
    // Se il token è valido, restituisce le informazioni decodificate dell'utente; altrimenti, genera un errore.
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};