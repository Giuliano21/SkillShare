// Questo modello definisce la struttura dei dati per gli utenti nel database MongoDB

const mongoose = require('mongoose');
// bcryptjs è una libreria per l'hashing delle password. Fornisce funzioni per hashare le password e confrontarle in modo sicuro.
const bcrypt = require('bcryptjs');

// definizione dello schema per il modello User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    }, 
    surname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: [String], 
        enum: ['student', 'tutor'], 
        default: ['student']
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active',
    }
});


module.exports = mongoose.model('User', userSchema);