
const mongoose = require("mongoose");

// Definizione dello schema per la disponibilità del tutor
const availibilitySlotSchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBooked: {
    type: Boolean , 
    default: false
  }
});

module.exports = mongoose.model('Slot' , availibilitySlotSchema);