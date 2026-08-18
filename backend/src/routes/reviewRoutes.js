// reviewRoutes.js definisce le rotte per la gestione delle recensioni dei tutor

const express = require('express');
const router = express.Router();

// Importo il controller per gestire le recensioni dei tutor
const ReviewController = require('../controllers/reviewController');

// Importo il middleware per verificare il token JWT e proteggere le rotte che richiedono autenticazione
const auth = require('../middlewares/auth');

// Rotta per visualizzare tutte le recensioni di un tutor specifico, identificato dall'ID del tutor nella URL
router.get('/:tutorId', ReviewController.getReviews);
// Rotta per creare una nuova recensione
router.post('/', auth.verifyToken, auth.restrictTo(['student']), ReviewController.createReview);
// Rotta per aggiornare la recensione
router.put('/:id' , auth.verifyToken , auth.restrictTo(['student']), ReviewController.updateReview );
// Rotta per eliminare la recensione
router.delete('/:id', auth.verifyToken ,auth.restrictTo(['student']) , ReviewController.deleteReview);


module.exports = router;