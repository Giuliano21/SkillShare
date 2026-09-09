// authController.js definisce i metodi per gestire la registrazione, il login e il logout degli utenti e il refresh del token.

const tokenService= require('../services/tokenServices');
const User= require('../models/User');
const Tutor= require('../models/Tutor');

async function register(req, res) {
    try{
        // Estrae i dati dell'utente dalla richiesta
        const { name, surname, username, email, password, role } = req.body;
        const roles = Array.isArray(role) ? role : (role ? [role] : ['student']);
        if (roles.includes('tutor') && (Array.isArray(req.body.lessonMode) || !['remote', 'presence'].includes(req.body.lessonMode))) {
            return res.status(400).json({ message: 'Selezionare una sola modalità di lezione' });
        }

        // Verifica se l'utente esiste già nel database
        const existingUser = await User.findOne({ $or: [{ username }, { email }] }); // Controlla se esiste un utente con lo stesso username o email
        // Se l'utente esiste già, restituisce un errore
        if (existingUser) return res.status(400).json({ message: 'Username o email già esistenti' }); 

        // Crea un nuovo utente e, se il ruolo è "tutor", crea anche un nuovo tutor associato all'utente
        const newUser = new User({ name, surname, username, email, password, role: roles });
        await newUser.save(); // Salva il nuovo utente nel database
        if (roles.includes('tutor')) {
            // Se il ruolo dell'utente è "tutor", estrai ulteriori informazioni per i tutor
            const subjects = req.body.subjects || req.body.subject || [];
            const hourlyPrice = req.body.hourlyPrice;
            const bio = req.body.bio || '';
            const lessonMode = req.body.lessonMode;

            // Crea un nuovo tutor associato all'utente appena creato
            const newTutor = new Tutor({
                userId: newUser._id,
                subjects,
                hourlyPrice,
                bio,
                lessonMode
            });
            await newTutor.save(); // Salva il nuovo tutor nel database
        }

            res.status(201).json({
                message: roles.includes('tutor') ? 'Tutor registrato con successo' : 'Utente registrato con successo',
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                }
            });
    }
    catch(error){
        res.status(400).json({
            message: 'Errore nella registrazione dell\'utente',
            error: error.message
        });
    }
}

async function login(req, res) {
    // Estrae email e password dalla richiesta
    const { email, password } = req.body;
    // Verifica se email e password sono stati forniti
    if(!email || !password) return res.status(400).json({ message: 'Inserire email e password' });
    // Cerca l'utente nel database in base all'email fornita
    const user = await User.findOne({ email});
    // Verifica se la password fornita corrisponde a quella memorizzata nel database
    const isPasswordValid = user && await user.comparePassword(password);
    // Se l'utente non viene trovato o la password non è valida, restituisce un errore di autenticazione
    if (!user || !isPasswordValid) return res.status(401).json({ message: 'Email o password errata' });
   
    const accessToken = tokenService.generateAccessToken(user); // Genera un access token per l'utente
    const refreshToken = tokenService.generateRefreshToken(user); // Genera un refresh token per l'utente
    user.refreshTokenHash = tokenService.hashRefreshToken(refreshToken); // Aggiunge al db l'hash del refresh token per la verifica futura
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Imposta il cookie come sicuro solo in produzione
        sameSite: 'strict', // Previene attacchi CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // Imposta la durata del cookie a 7 giorni
    })
    // Restituisce l'access token al client
    res.json({
        accessToken,
        user: {id: user._id, username: user.username,role: user.role}
    }); 


}

async function refresh(req, res) {
    try {
        // Estrae il refresh token dai cookie della richiesta.
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token mancante. Effettua nuovamente il login.' });
        }

        let decoded;
        try {
            decoded = tokenService.verifyRefreshToken(refreshToken);
            if (!decoded) {
                return res.status(401).json({ message: 'Refresh token non valido o scaduto. Effettua nuovamente il login.' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Refresh token non valido o scaduto. Effettua nuovamente il login.' });
        }

        // Trova l'utente nel database utilizzando l'ID decodificato dal refresh token e verifica se l'hash del refresh token corrisponde a quello memorizzato nel database.  
        const user = await User.findById(decoded.userId).select('+refreshTokenHash');
        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato. Effettua nuovamente il login.' });
        }

        const refreshTokenHash = tokenService.hashRefreshToken(refreshToken);
        if (!user.refreshTokenHash || user.refreshTokenHash !== refreshTokenHash) {
            res.clearCookie('refreshToken');
            return res.status(401).json({ message: 'Refresh token revocato o già utilizzato. Effettua nuovamente il login.' });
        }
        // Genera un nuovo access token e un nuovo refresh token, aggiorna l'hash del refresh token nel database e invia il nuovo refresh token al client tramite cookie.
        const rotatedRefreshToken = tokenService.generateRefreshToken(user);
        const rotatedRefreshTokenHash = tokenService.hashRefreshToken(rotatedRefreshToken);
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id, refreshTokenHash },
            { $set: { refreshTokenHash: rotatedRefreshTokenHash } },
            { new: true }
        );
        if (!updatedUser) {
            res.clearCookie('refreshToken');
            return res.status(401).json({ message: 'Refresh token già utilizzato. Effettua nuovamente il login.' });
        }

        res.cookie('refreshToken', rotatedRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const newAccessToken = tokenService.generateAccessToken(user);
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(500).json({ message: 'Errore durante il refresh del token', error: error.message });
    }
}

async function logout(req, res) {
    // Cancella il cookie del refresh token dal client, invalidando così la sessione dell'utente.
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        try {
            // Verifica il refresh token e rimuove l'hash del refresh token dal database per invalidare il token.
            const decoded = tokenService.verifyRefreshToken(refreshToken);
            await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshTokenHash: 1 } });
        } catch (error) {
            // Il cookie viene comunque cancellato anche se è già scaduto o non valido.
        }
    }
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Imposta il cookie come sicuro solo in produzione
        sameSite: 'strict' // Previene attacchi CSRF
    });
    res.json({ message: 'Logout effettuato con successo.' });
}


module.exports = {
    register,
    login,
    refresh,
    logout
}