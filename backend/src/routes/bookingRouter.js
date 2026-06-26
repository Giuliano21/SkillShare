const express = require('express');
const router = express.Router();

const BookingController = require('../controllers/BookingController');

const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, BookingController.createBooking);

module.exports = router;