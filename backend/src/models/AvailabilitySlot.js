
const mongoose = require("mongoose");

// Definizione dello schema per la disponibilità del tutor
const availibilitySlotSchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
        unique: true
    },
    // La disponibilità del tutor è rappresentata da un array di slot, ognuno dei quali ha un giorno della settimana e un intervallo di tempo
    startDay: {  
    type: Number, 
    required: true, 
    min: 1, 
    max: 7 // 1 = Lunedì, ... ,  7 = Domenica
  },
  startTime: { 
    type: String, 
    required: true, 
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // regex che ammette orari che hanno ora da 00 a 23 e minuti da 00 a 59, cioè un formato HH:MM
  },
  endDay: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 7 
  },
  endTime: { 
    type: String, 
    required: true, 
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }, 
  isBooked: {
    type: Boolean , 
    default: false
  }
});

module.exports = mongoose.model('Slot' , availibilitySlotSchema);