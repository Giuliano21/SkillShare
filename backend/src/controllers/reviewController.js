const Review = require('../models/Review');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');

// Funzione per aggiornare il rating di un tutor
async function updateTutorRatingStats(tutorId) {
    // Recupera tutte le recensioni per un determinato tutor
    const reviews = await Review.find({ tutorId });
    const reviewsCount = reviews.length;
    
    // Calcola la media delle valutazioni 
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0); // Somma tutte le valutazioni
    const averageRating = reviewsCount > 0 ? (totalRating / reviewsCount).toFixed(1) : 0; // Se non ci sono recensioni, la media è 0

    // Aggiorna le statistiche del tutor
    await Tutor.findByIdAndUpdate(tutorId, { 
        rating: averageRating,
        reviewsCount: reviewsCount 
    });
}

async function getReviews(req, res) {
    try{
        // Recupera tutte le recensioni per un determinato tutor, popolando i campi userId e bookingId per ottenere informazioni aggiuntive
        const reviews = await Review.find({tutorId: req.params.tutorId})
        .populate('userId', 'username').populate('bookingId', 'date');
        res.status(200).json({ message: 'Recensioni recuperate con successo', reviews });
    }
    catch(err){
        res.status(500).json({ message: 'Errore nel recupero delle recensioni', error: error.message })
    }
}

async function createReview(req, res) {
    try {
        const { tutorId, bookingId, rating, comment } = req.body;

        // Verifica che l'utente abbia completato la prenotazione prima di scrivere la recensione, altrimenti manda un errore
        const validBooking = await Booking.findOne({
            _id: bookingId,
            userId: req.user.userId,
            tutorId,
            status: 'completed'
        });

        if (!validBooking) {
            return res.status(403).json({ error: 'Puoi recensire solo tutor con cui hai completato una prenotazione' });
        }

        // Creazione della recensione
        const newReview = new Review({
            userId: req.user.userId,
            bookingId,
            tutorId,
            comment,
            rating
        });

        // Salvataggio della recensione nel database
        await newReview.save();
        // Aggiorna le statistiche del tutor dopo la creazione della recensione
        await updateTutorRatingStats(tutorId);

        return res.status(201).json({ message: 'Recensione creata con successo', review: newReview });
    } catch (err) {
        return res.status(500).json({ message: 'Errore nella creazione della recensione', error: err.message });
    }
}

async function updateReview(req, res) {
    try {
        // Recupera l'ID della recensione dai parametri della richiesta e i nuovi valori di rating e comment dal corpo della richiesta
        const id = req.params.id;
        const { rating, comment } = req.body;

        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ message: 'Recensione non trovata' });

        // Verifica che l'utente autenticato sia l'autore della recensione prima di permettere l'aggiornamento
        if (review.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Non sei autorizzato ad aggiornare questa recensione' });
        }

        // Aggiorna i campi della recensione con i nuovi valori forniti e salva le modifiche nel database
        review.rating = rating;
        review.comment = comment;
        await review.save();

        await updateTutorRatingStats(review.tutorId); // Aggiorna le statistiche del tutor dopo l'aggiornamento della recensione

        return res.status(200).json({ message: 'Recensione aggiornata con successo', review });
    } catch (err) {
        return res.status(500).json({ message: 'Errore nell\'aggiornamento della recensione', error: err.message });
    }
}

async function deleteReview(req, res) {
    try {
        // Recupera l'ID della recensione dai parametri della richiesta
        const id = req.params.id;
        const review = await Review.findById(id);

        if (!review) return res.status(404).json({ message: 'Recensione non trovata' });
        // Verifica che l'utente autenticato sia l'autore della recensione prima di permettere la cancellazione
        if (review.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Non sei autorizzato a cancellare questa recensione' });
        }
        // Cancella la recensione dal database e aggiorna le statistiche del tutor
        await Review.findByIdAndDelete(id);
        await updateTutorRatingStats(review.tutorId);

        return res.status(200).json({ message: 'Recensione cancellata con successo' });
    } catch (err) {
        return res.status(500).json({ message: 'Errore nella cancellazione della recensione', error: err.message });
    }
}

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview
}