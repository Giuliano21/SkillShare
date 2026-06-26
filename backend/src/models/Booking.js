const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true,
        unique: true // In questo modo, ogni slot può essere prenotato solo una volta, evitando conflitti di prenotazione.
    },
    subject: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'cancelled', 'completed'], 
        default: 'pending' 
    },
});

module.exports = mongoose.model('Booking', bookingSchema);