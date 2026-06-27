const express = require('express');
const router = express.Router();

// Importo il controller per gestire le prenotazioni dei tutor
const BookingController = require('../controllers/BookingController');
// Importo il middleware per verificare il token JWT e proteggere le rotte che richiedono autenticazione
const auth = require('../middlewares/auth');

router.use(auth.verifyToken); // Tutte le rotte qui sotto richiedono autenticazione

// Rotta per creare una prenotazione, accessibile solo agli studenti
router.post('/', auth.restrictTo(['student']) ,BookingController.createBooking);
// Rotta per visualizzare le prenotazioni
router.get('/my-bookings', BookingController.getBookings);
// Rotta per cancellare una prenotazione, accessibile solo agli studenti
router.delete('/:id', auth.restrictTo(['student']) ,BookingController.cancelBooking);
// Rotta per aggiornare lo stato di una prenotazione, accessibile solo ai tutor
router.put('/:id/status', auth.restrictTo(['tutor']) ,BookingController.updateBookingStatus);


module.exports = router;