
const Conversations = require('../models/Conversations');
const Messages = require('../models/Messages');

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

async function getMessages(req, res) {
    try{
        const conversationId = req.params.conversationId;
        const userId = req.user.id;
        const conversation = await Conversations.findById(conversationId);

        if(!conversation){
            return res.status(404).json({message: 'Conversazione non trovata'});
        }

        if(!conversation.partecipants.some(id => id.equals(userId))){
            return res.status(403).json({message: 'Accesso negato: non sei un partecipante di questa conversazione'});
        }

    const messages = await Messages.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json({messages});
    }
    catch(error){
        res.status(500).json({message: 'Errore nel recupero dei messaggi', error});
    }
}

async function sendMessage(req, res) {
    try{
        const conversationId = req.params.conversationId;
        const text = req.body.text;
        const userId = req.user.id;
        const conversation = await Conversations.findById(conversationId);

        if(!conversation){
            return res.status(404).json({message: 'Conversazione non trovata'});
        }

        if(!conversation.partecipants.some(id => id.equals(userId))){
            return res.status(403).json({message: 'Accesso negato: non sei un partecipante di questa conversazione'});
        }

        const message = new Messages({
            conversationId,
            senderId: userId,
            text
        });

        await message.save();
        res.status(201).json({message});
    }
    catch(error){
        res.status(500).json({message: "Errore nell'invio del messaggio", error});
    }
}

module.exports = {
    getMyConversations,
    getMessages,
    sendMessage
};