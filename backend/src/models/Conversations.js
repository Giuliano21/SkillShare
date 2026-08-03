const mongoose = require('mongoose');

const conversationSchema= new mongoose.Schema({
    partecipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
},{timestamps: true} );

module.exports = mongoose.model('Conversation' , conversationSchema);