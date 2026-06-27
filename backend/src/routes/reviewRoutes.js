const express = require('express');
const router = express.Router();

// Importo il controller per gestire le recensioni dei tutor
const ReviewController = require('../controllers/reviewController');

// Importo il middleware per verificare il token JWT e proteggere le rotte che richiedono autenticazione
const auth = require('../middlewares/auth');

// Rotta per visualizzare tutte le recensioni di un tutor specifico, identificato dall'ID del tutor nella URL
router.get('/tutor/:id', ReviewController.getReviews);
// Rotta per creare una nuova recensione
router.post('/tutor/:id', auth.verifyToken, auth.restrictTo(['student']), ReviewController.createReview);
module.exports = router;