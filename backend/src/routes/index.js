// index.js permette di aggregare tutte le rotte dell'API in un unico file

const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const tutorRoutes = require('./tutorRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

// Definisco le rotte principali dell'API e le collego ai rispettivi router
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/tutors', tutorRoutes);
router.use('/reviews', reviewRoutes);
router.use('/health', healthRoutes);
router.use('/users', userRoutes);

module.exports = router;