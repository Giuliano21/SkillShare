
const Conversations = require('../models/Conversations');

async function getMyConversations(req, res) {
    try {
        const userId = req.user.id; 
        const conversations = await Conversations.find({ partecipants: userId});
        res.status(200).json({conversations});
    }
    catch(error){
        res.status(500).json({
            message: 'Errore nel recupero delle conversazioni',
            error
        });
    }
}

module.exports = {
    getMyConversations
}