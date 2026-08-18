const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Funzione per recuperare il profilo dell'utente autenticato
async function getProfile(req, res) {
    try{
        const id= req.user.userId; // Recupera l'ID dell'utente autenticato dalla richiesta
        const user = await User.findById(id).select('-password'); // Recupera l'utente dal database escludendo il campo password
        if(!user || user.status === 'deleted') return res.status(404).json({message: 'Utente non trovato'}); 

        res.status(200).json({user}); // Restituisce i dati dell'utente in formato JSON
    }
    catch(error){
        res.status(500).json({message: 'Errore nel recupero del profilo utente', error});
    }
}

// Funzione per aggiornare il profilo dell'utente autenticato
async function updateProfile(req, res) {
    try{
        const id= req.user.userId;

        // Recupera i nuovi dati dal corpo della richiesta
        const {name, surname, username, email, currentPassword, newPassword} = req.body; 

        // Verifica se l'utente esiste e non è stato cancellato
        const user = await User.findById(id);
        if(!user || user.status === 'deleted') return res.status(404).json({message: 'Utente non trovato'});

        // Aggiornamento dei campi base dell'utente
        if (name) user.name = name;
        if (surname) user.surname = surname;
        if (username) user.username = username;

        // Verifica se l'email è già in uso da un altro utente e in caso contrario aggiorna l'email dell'utente
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'Email già in uso' });
            user.email = email;
        }

        if (newPassword) {
            // Verifica che la password corrente sia stata fornita
            if (!currentPassword) return res.status(400).json({ message: 'Inserire la password corrente per cambiare la password' });
            // Verifica che la nuova password sia diversa dalla password corrente
            if (currentPassword === newPassword)
                 return res.status(400).json({ message: 'La nuova password deve essere diversa dalla password corrente' });
            // Verifica la password corrente nel database confrontandola con la password fornita dall'utente
            const isMatch = await user.comparePassword(currentPassword);
            if(!isMatch) return res.status(400).json({message: 'Password corrente non valida'});
            
            // Aggiorna la password dell'utente con la nuova password fornita, dopo averla hashata
            user.password = await bcrypt.hash(newPassword, 10); 
        }   

        await user.save(); // Salva le modifiche dell'utente nel database

        // Recupera l'utente aggiornato dal database escludendo il campo password e lo restituisce nella risposta
        const updatedUser = await User.findById(id).select('-password'); 
        res.status(200).json({message: 'Profilo utente aggiornato con successo', user: updatedUser});
    }
    catch(error){
        res.status(500).json({message: 'Errore nell\'aggiornamento del profilo utente', error});
    }
}

// Funzione per cancellare il profilo dell'utente autenticato (Soft delete)
async function deleteProfile(req, res) {
    try{
        const id = req.user.userId;
        const user = await User.findById(id);
        if(!user || user.status === 'deleted') return res.status(404).json({message: 'Utente non trovato'});
        user.status = 'deleted';
        await user.save();

        // Rimuove il cookie di refresh token dal client
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Imposta il cookie come sicuro solo in produzione
            sameSite: 'strict' // Previene attacchi CSRF
        });

        res.status(200).json({message: 'Profilo utente cancellato con successo'});
    }
    catch(error){
        res.status(500).json({message: 'Errore nella cancellazione del profilo utente', error});
    }
}

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile
}