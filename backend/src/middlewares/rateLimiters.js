const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Limiter globale per tutte le richieste API, limitando il numero di richieste per IP in un intervallo di tempo specificato
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8', 
    legacyHeaders: false,
    message: { status: 'fail', message: 'Troppe richieste. Riprova più tardi.' }
});

// Limiter specifico per le richieste di autenticazione basate sull'IP dell'utente
const authIpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    message: { status: 'fail', message: 'Troppi tentativi di autenticazione. Riprova più tardi.' }
});

// Limiter specifico per il login basato sull'email dell'utente
const authAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (req) => String(req.body?.email || '').trim().toLowerCase() || 'missing-email',
    message: { status: 'fail', message: 'Troppi tentativi per questo account. Riprova più tardi.' }
});

// Limiter specifico per la registrazione basato sull'IP dell'utente
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { status: 'fail', message: 'Troppe registrazioni dallo stesso indirizzo. Riprova più tardi.' }
});

module.exports = { apiLimiter, authIpLimiter, authAccountLimiter, registerLimiter };