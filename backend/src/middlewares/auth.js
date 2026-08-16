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

async function verifyToken(req, res, next) {
   
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization; // Recupera l'header di autorizzazione dalla richiesta
    // Authorization : Bearer <token>
    // Controlla se il token è presente nell'header di autorizzazione e verifica che il token inizi con "Bearer"
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // Estrae il token dall'header, dividendo la stringa in base allo spazio e prendendo il secondo elemento dell'array risultante
    } else if (req.query.token) {
        token = req.query.token; // Estrae il token dai parametri della query dell'URL, se presente
    }

    // Se il token non è presente, restituisce un errore 401 Unauthorized con un messaggio che indica che l'utente deve effettuare il login per accedere alla risorsa protetta
    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Effettua il login per accedere a questa risorsa.'
        });
    }

    try {
        // Verifica il token utilizzando la funzione verifyAccessToken del servizio tokenService e decodifica le informazioni dell'utente
        const decoded = tokenService.verifyAccessToken(token);

        // Verifica se l'utente esiste nel database utilizzando l'ID dell'utente decodificato dal token
        const userDoc = await User.findById(decoded.userId);
        if (!userDoc) {
            return res.status(401).json({
                status: 'fail',
                message: 'L\'utente associato a questo token non esiste più. Effettua nuovamente il login.'
            });
        }

        req.user = {
            ...userDoc.toObject(),
            _id: userDoc._id,
            userId: userDoc._id,
            role: userDoc.role
        };
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


module.exports = { verifyToken, restrictTo };