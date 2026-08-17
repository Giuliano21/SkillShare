const mongoose = require('mongoose');
const Conversation = require('../models/Conversations');
const Message = require('../models/Messages');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');

// Funzione per normalizzare gli ID degli utenti in stringhe
function normalizeId(value) {
    return value ? value.toString() : '';
}

// Funzione per costruire una chiave unica basata sugli ID dei partecipanti
function buildParticipantsKey(userAId, userBId) {
    const ids = [normalizeId(userAId), normalizeId(userBId)].sort();
    // Restituisce coppia ordinata di ID
    return `${ids[0]}:${ids[1]}`;
}

// Funzione per verificare se un utente ha un determinato ruolo
function hasRole(userDoc, role) {
    const roles = Array.isArray(userDoc?.role) ? userDoc.role : [userDoc?.role];
    return roles.includes(role);
}

// Funzione per risolvere la coppia tutor-studente tra due utenti
async function resolveTutorStudentPair(userAId, userBId) {
    // Recupera i documenti degli utenti dal database 
    const [userA, userB] = await Promise.all([
        User.findById(userAId).select('_id role status'),
        User.findById(userBId).select('_id role status')
    ]);

    if (!userA || !userB) return null;

    if (userA.status !== 'active' || userB.status !== 'active') return null;

    
    const aTutor = hasRole(userA, 'tutor');
    const bTutor = hasRole(userB, 'tutor');
    const aStudent = hasRole(userA, 'student');
    const bStudent = hasRole(userB, 'student');

    let tutorUserId = null;
    let studentUserId = null;

    // Determina quale utente è il tutor e quale è lo studente
    if (aTutor && bStudent) {
        tutorUserId = userA._id;
        studentUserId = userB._id;
    } else if (bTutor && aStudent) {
        tutorUserId = userB._id;
        studentUserId = userA._id;
    } else {
        return null;
    }

    // Recupera il profilo del tutor dal database
    const tutorProfile = await Tutor.findOne({ userId: tutorUserId }).select('_id userId');
    if (!tutorProfile) return null;

    return {
        tutorUserId,
        studentUserId,
        tutorProfileId: tutorProfile._id
    };
}

// Funzione per verificare se esiste almeno una prenotazione accettata tra due utenti (tutor e studente)
async function hasAcceptedBookingBetweenUsers(userAId, userBId) {
    const pair = await resolveTutorStudentPair(userAId, userBId);
    if (!pair) return false;

    const acceptedBooking = await Booking.findOne({
        userId: pair.studentUserId,
        tutorId: pair.tutorProfileId,
        status: 'accepted'
    }).select('_id');
    // Restituisce true se esiste almeno una prenotazione accettata, altrimenti false
    return Boolean(acceptedBooking);
}

// Funzione per creare o recuperare una conversazione tra due utenti
async function createOrGetConversationByUsers(requesterId, peerUserId) {
    // Normalizza gli ID degli utenti
    const requester = normalizeId(requesterId);
    const peer = normalizeId(peerUserId);

    if (!requester || !peer) {
        const error = new Error('Identificatori utente mancanti.');
        error.statusCode = 400;
        throw error;
    }

    if (requester === peer) {
        const error = new Error('Non puoi aprire una chat privata con te stesso.');
        error.statusCode = 400;
        throw error;
    }
    // Costruisce la chiave dei partecipanti per la conversazione
    const participantsKey = buildParticipantsKey(requesterId, peerUserId);
    let conversation = await Conversation.findOne({ participantsKey });
   
    // Se la conversazione esiste già, la restituisce
    if (conversation) return conversation;

    const canStartChat = await hasAcceptedBookingBetweenUsers(requesterId, peerUserId);
    if (!canStartChat) {
        const error = new Error('Chat non consentita: serve almeno una prenotazione accettata tra tutor e studente.');
        error.statusCode = 403;
        throw error;
    }

    try {
        // Crea una nuova conversazione se non esiste già
        conversation = await Conversation.create({
            participants: [new mongoose.Types.ObjectId(requester), new mongoose.Types.ObjectId(peer)],
            participantsKey
        });
        return conversation;
    } catch (error) {
        // Gestisce eventuali errori di chiave duplicata (ad esempio, se un'altra richiesta ha creato la conversazione nello stesso momento)
        if (error?.code === 11000) {
            const existing = await Conversation.findOne({ participantsKey });
            if (existing) {
                return existing;
            }
        }
        throw error;
    }
}

// Funzione per garantire che un utente sia membro di una conversazione
async function ensureConversationMembership(conversationId, userId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        const error = new Error('Conversazione non trovata.');
        error.statusCode = 404;
        throw error;
    }
    // Normalizza l'ID dell'utente e verifica se è presente tra i partecipanti della conversazione
    const userIdString = normalizeId(userId);
    const isMember = conversation.participants.some((participantId) => normalizeId(participantId) === userIdString);

    if (!isMember) {
        const error = new Error('Non sei autorizzato ad accedere a questa conversazione.');
        error.statusCode = 403;
        throw error;
    }

    return conversation;
}

// Funzione per elencare tutte le conversazioni di un utente
async function listConversationsForUser(userId) {
    return Conversation.find({ participants: userId })
        .populate('participants', 'username name surname role')
        .sort({ updatedAt: -1 });
}

// Funzione per elencare i messaggi di una conversazione con paginazione
async function listMessages(conversationId, page = 1, limit = 30) {
    
    const safePage = Math.max(Number(page) || 1, 1); // Assicura che la pagina sia almeno 1
    const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100); // Assicura che il limite sia tra 1 e 100
    const skip = (safePage - 1) * safeLimit; // Calcola il numero di messaggi da saltare in base alla pagina e al limite

    const [messages, total] = await Promise.all([
        // Recupera i messaggi della conversazione, popolando le informazioni del mittente e ordinandoli per data di creazione decrescente
        Message.find({ conversationId })
            .populate('senderId', 'username name surname role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit),
        // Conta il numero totale di messaggi nella conversazione per la paginazione
        Message.countDocuments({ conversationId })
    ]);

    return {
        messages,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            pages: Math.ceil(total / safeLimit)
        }
    };
}

/* Funzione per creare un nuovo messaggio in una conversazione. 
Un messaggio può essere creato solo se il testo non è vuoto e non supera i 1000 caratteri.
Dopo la creazione del messaggio, viene aggiornato il timestamp della conversazione
per indicare l'ultima attività. */
async function createMessage(conversationId, senderId, text) {
    // Normalizza il testo del messaggio e verifica che non sia vuoto o troppo lungo
    const normalizedText = typeof text === 'string' ? text.trim() : '';
    if (!normalizedText) {
        const error = new Error('Il testo del messaggio è obbligatorio.');
        error.statusCode = 400;
        throw error;
    }

    if (normalizedText.length > 1000) {
        const error = new Error('Il messaggio supera il limite di 1000 caratteri.');
        error.statusCode = 400;
        throw error;
    }

    const message = await Message.create({
        conversationId,
        senderId,
        text: normalizedText
    });

    await Conversation.findByIdAndUpdate(conversationId, { $set: { updatedAt: new Date() } });

    return Message.findById(message._id).populate('senderId', 'username name surname role');
}

// Funzione per segnare tutti i messaggi di una conversazione come letti da un utente specifico
async function markConversationAsRead(conversationId, readerId) {
    const result = await Message.updateMany(
        {
            conversationId,
            // Filtra i messaggi che non sono stati inviati dal lettore e che non sono già stati letti
            senderId: { $ne: readerId },
            isRead: false
        },
        {
            $set: { isRead: true }
        }
    );
    // Restituisce il numero di messaggi aggiornati (se presenti) o 0 se nessun messaggio è stato aggiornato
    return result.modifiedCount || 0;
}

module.exports = {
    buildParticipantsKey,
    hasAcceptedBookingBetweenUsers,
    createOrGetConversationByUsers,
    ensureConversationMembership,
    listConversationsForUser,
    listMessages,
    createMessage,
    markConversationAsRead
};
