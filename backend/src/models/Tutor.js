// Questo modello definisce la struttura dei dati per i tutor nel database MongoDB

const mongoose = require('mongoose');

// Definizione dello schema per la disponibilità del tutor
const availibilitySlotSchema = new mongoose.Schema({
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
  }
});

// Definizione dello schema per il modello Tutor
const tutorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,       // Tipo di dato ObjectId per riferirsi a un documento in un'altra collezione
        ref: 'User',                                // Riferimento al modello User
        required: true,
        unique: true,
    },
    subjects: {
        type: [String],                             // Array di stringhe per rappresentare le materie insegnate dal tutor
        required: true,
        trim: true,
    },
    hourlyPrice:{
        type: Number,                               
        required: true,
        min: 0,                                     
    },
    bio: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true,
    },
    availibility: [availibilitySlotSchema],         // Array di slot di disponibilità definiti dallo schema availibilitySlotSchema
    rating: {
        type: Number,
        default: 0,
    },
    reviewCount:{
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Tutor', tutorSchema);