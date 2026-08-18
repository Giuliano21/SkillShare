// User.js definisce la struttura dei dati per gli utenti nel database MongoDB

const mongoose = require('mongoose');
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
    username:{
        type: String,
        required: true,
        unique: true,
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
},{timestamps: true }); // createdAt e updateAt

// Middleware che, prima di salvare una password, rende la password crittografata utilizzando bcrypt
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    // 10 è la lunghezza del salt
    this.password = await bcrypt.hash(this.password, 10);
});

// Metodo per verificare che la password inserita dall'utente corrisponda alla password hashata nel database
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);