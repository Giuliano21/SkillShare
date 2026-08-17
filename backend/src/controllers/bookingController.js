const Booking = require('../models/Booking');
const AvailabilitySlot = require('../models/AvailabilitySlot');
const Tutor = require('../models/Tutor');

// Funzione per verificare se un utente ha un determinato ruolo
function hasRole(user, role) {
    // Controlla se l'utente ha il ruolo specificato, considerando che il ruolo può essere un array o una singola stringa
    const roles = Array.isArray(user?.role) ? user.role : [user?.role];
    return roles.includes(role);
}

async function createBooking(req, res) {
    try{
        const { tutorId, slotId, subject } = req.body;
        // Controlla se lo slot non sia già prenotato
        const slot = await AvailabilitySlot.findOne({ _id: slotId, isBooked: false });
        if(!slot) return res.status(400).json({ message: 'Lo slot selezionato non è disponibile' });

        slot.isBooked = true; // Imposta lo slot come prenotato
        await slot.save(); // Salva le modifiche allo slot nel database

        // Controlla se l'utente autenticato ha il ruolo di "student" prima di permettere la creazione della prenotazione
        if(!hasRole(req.user, 'student')) return res.status(403).json({ message: 'Solo gli studenti possono creare prenotazioni' });

        // Crea la prenotazione
        const newBooking = new Booking({
            userId: req.user._id,
            tutorId,
            slotId,
            subject,
            status: 'pending' // Imposta lo stato iniziale della prenotazione come "pending"
        });
        // Salva la nuova prenotazione nel database
        await newBooking.save(); 

        res.status(201).json({ message: 'Prenotazione creata con successo', booking: newBooking });
    }
    catch(err){
        res.status(500).json({ message: 'Errore nella creazione della prenotazione', error: err.message });
    }
}

async function getBookings(req, res) {
    try{
        // Se l'utente è un tutor, recupera le prenotazioni associate al suo ID, altrimenti recupera le prenotazioni associate all'ID dell'utente loggato
        let query = { userId: req.user._id };

        if (hasRole(req.user, 'tutor')) {
            const tutorProfile = await Tutor.findOne({ userId: req.user._id }).select('_id');
            if (!tutorProfile) {
                return res.status(404).json({ message: 'Profilo tutor non trovato' });
            }
            query = { tutorId: tutorProfile._id };
        }

        // Recupera le prenotazioni dal database, popolando i campi studentId, tutorId e slotId con i dati corrispondenti
        const bookings = await Booking.find(query)
        .populate('userId', 'username')
        .populate('tutorId', 'lessonMode')
        .populate('slotId', 'date startTime endTime')
        .sort({ createdAt: -1 }); // Ordina le prenotazioni in ordine decrescente di data di creazione

        res.status(200).json({ bookings });
    }
    catch(err){
        res.status(500).json({ message: 'Errore nel recupero delle prenotazioni', error: err.message });
    }
}

async function cancelBooking(req, res) {
    // Lo studente può cancellare una prenotazione, liberando lo slot associato al tutor
    try{
        // Recupera l'ID della prenotazione dai parametri della richiesta e verifica che la prenotazione esista nel database
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        if(!booking) return res.status(404).json({ message: 'Prenotazione non trovata' });
        
        // Verifica che l'utente autenticato sia lo studente associato alla prenotazione prima di permettere la cancellazione
        if(booking.userId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Non sei autorizzato a cancellare questa prenotazione' });

        // Aggiorna lo stato della prenotazione a "cancelled" nel database, in modo da mantenere un record della prenotazione cancellata
        await booking.updateOne({ status: 'cancelled' });
        // Libera lo slot associato alla prenotazione, impostando isBooked a false
        await AvailabilitySlot.findByIdAndUpdate(booking.slotId, { isBooked: false });

        res.status(200).json({ message: 'Prenotazione cancellata con successo' });
    }
    catch(err){
        res.status(500).json({ message: 'Errore nella cancellazione della prenotazione', error: err.message });
    }
}

async function updateBookingStatus(req, res) {
    // Il tutor può aggiornare lo stato di una prenotazione (ad esempio da "pending" a "accepted" o "completed")
    try{
        const bookingId = req.params.id;
        const { status } = req.body;

        // Verifica che lo status fornito non sia "cancelled", poiché solo lo studente può cancellare una prenotazione
        const validStatus = ['pending', 'accepted', 'completed']; 
        if (!validStatus.includes(status)) 
            return res.status(400).json({ error: 'Stato non valido o non autorizzato per il tutor' });

        const booking = await Booking.findById(bookingId);
        if(!booking) return res.status(404).json({ message: 'Prenotazione non trovata' });

        const tutorProfile = await Tutor.findById(booking.tutorId).select('userId');
        if (!tutorProfile) {
            return res.status(404).json({ message: 'Profilo tutor della prenotazione non trovato' });
        }
        
        // Verifica che l'utente autenticato sia il tutor associato alla prenotazione prima di permettere l'aggiornamento dello stato
        if(tutorProfile.userId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Non sei autorizzato ad aggiornare lo stato di questa prenotazione' });

        // Aggiorna lo stato della prenotazione nel database
        await booking.updateOne({ status });
        res.status(200).json({ message: 'Stato della prenotazione aggiornato con successo' });
    }
    catch(err){
        res.status(500).json({ message: 'Errore nell\'aggiornamento dello stato della prenotazione', error: err.message });
    }
}

module.exports = {
    createBooking,
    getBookings,
    cancelBooking,
    updateBookingStatus
}