/* auth.js è un middleware che gestisce l'autenticazione degli utenti tramite token JWT. La funzione verifyToken controlla se il
token è presente nell'header di autorizzazione o nei parametri della query dell'URL, decodifica le informazioni dell'utente e
verifica se l'utente esiste nel database. Se il token è valido e l'utente esiste, le informazioni dell'utente vengono aggiunte 
al corpo della richiesta e il middleware passa al successivo. In caso contrario, viene restituito un errore 401 Unauthorized con
un messaggio appropriato. Il middleware include anche una funzione restrictTo che può essere utilizzata per limitare l'accesso a
determinate rotte in base ai ruoli degli utenti. Questa funzione accetta un array di ruoli consentiti e verifica
se il ruolo dell'utente corrisponde a uno dei ruoli consentiti. Se il ruolo dell'utente non è autorizzato, viene restituito un
errore 403 Forbidden.*/

const tokenService = require('../services/tokenServices');
const User = require('../models/User');

// Funzione per estrarre il token JWT dalla richiesta
function extractTokenFromRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer '))  return authHeader.split(' ')[1];
    
    if (req.query.token) return req.query.token;

    return null;
}

// Funzione per ottenere le informazioni dell'utente dal token di accesso
async function getUserFromAccessToken(token) {
    /* Decodifica il token di accesso utilizzando il servizio tokenService e
    ottiene l'ID dell'utente dal payload del token */
    const decoded = tokenService.verifyAccessToken(token);
    const userDoc = await User.findById(decoded.userId);

    if (!userDoc) {
        const error = new Error('L\'utente associato a questo token non esiste più. Effettua nuovamente il login.');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }
    // Restituisce un oggetto contenente le informazioni dell'utente, inclusi l'ID, il ruolo e lo username
    return {
        ...userDoc.toObject(),
        _id: userDoc._id,
        userId: userDoc._id,
        role: userDoc.role
    };
}

// Funzione middleware per verificare il token di accesso e autenticare l'utente
async function verifyToken(req, res, next) {
   
    const token = extractTokenFromRequest(req);

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Effettua il login per accedere a questa risorsa.'
        });
    }

    try {
        req.user = await getUserFromAccessToken(token);
        next(); // Chiama il middleware o il controller successivo
    }
    catch(error){
        // Se il token non è valido o è scaduto, restituisce un errore 401 Unauthorized
        return res.status(401).json({ 
            status: 'fail',
            message: 'Token non valido o scaduto. Effettua nuovamente il login.',
            error: error.message
        });
    }
}
// Funzione middleware per limitare l'accesso a determinate rotte in base ai ruoli degli utenti
function restrictTo(roles){
    return (req, res, next) => {
        const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

        // Controlla se il ruolo dell'utente è incluso nell'array dei ruoli consentiti
        if (!userRoles.some(role => roles.includes(role))) {
            // Se il ruolo dell'utente non è autorizzato, restituisce un errore 403 Forbidden
            return res.status(403).json({
                status: 'fail',
                message: 'Non hai i permessi necessari per accedere a questa risorsa.'
            });
        }
        next();
    };
}

module.exports = { verifyToken, restrictTo, extractTokenFromRequest, getUserFromAccessToken };