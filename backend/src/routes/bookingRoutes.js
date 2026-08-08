/* bookingRoutes.js definisce le rotte per creare, visualizzare, cancellare e aggiornare le prenotazioni. 
In particolare, alcune rotte sono protette e accessibili solo a determinati tipi di utenti. */

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
router.patch('/:id/cancel', auth.restrictTo(['student']) ,BookingController.cancelBooking);
// Rotta per aggiornare lo stato di una prenotazione, accessibile solo ai tutor
router.patch('/:id/status', auth.restrictTo(['tutor']) ,BookingController.updateBookingStatus);


module.exports = router;