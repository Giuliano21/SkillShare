// Questo modello definisce la struttura dei dati per i tutor nel database MongoDB

const mongoose = require('mongoose');

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
    rating: {
        type: Number,
        default: 0,
    },
    reviewsCount:{
        type: Number,
        default: 0,
    },
    lessonMode:{
        type: String,
        enum: ['remote', 'presence'],
        required: true
    }
},{timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);