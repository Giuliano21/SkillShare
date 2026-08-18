const mongoose = require('mongoose');

const conversationSchema= new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    // Campo per memorizzare una chiave unica basata sugli ID dei partecipanti
    participantsKey: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
},{timestamps: true} );

// Indice per ottimizzare le query
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation' , conversationSchema);