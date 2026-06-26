const express = require('express');
const router = express.Router();

// Importo il controller per gestire le recensioni dei tutor
const ReviewController = require('../controllers/reviewController');

// Importo il middleware per verificare il token JWT e proteggere le rotte che richiedono autenticazione
const verifyToken = require('../middlewares/auth');

// Definisco le rotte per creare, leggere, aggiornare e cancellare le recensioni dei tutor
router.post('/:id/reviews' ,verifyToken, ReviewController.createReview);
router.get('/:id/reviews', ReviewController.getReviews);
router.put('/:id/reviews/:reviewId', verifyToken, ReviewController.updateReview);
router.delete('/:id/reviews/:reviewId', verifyToken, ReviewController.deleteReview);

module.exports = router;