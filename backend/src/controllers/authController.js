// authController.js definisce i metodi per gestire la registrazione, il login e il logout degli utenti.

const jwt= require('jsonwebtoken');
const User= require('../models/User');
const Tutor= require('../models/Tutor');

async function register(req, res) {
    try{
        // Estrae i dati dell'utente dalla richiesta
        const { name, surname, username, email, password, role  } = req.body;
       
        // Verifica se l'utente esiste già nel database
        const existingUser = await User.findOne({ $or: [{ username }, { email }] }); // Controlla se esiste un utente con lo stesso username o email
        // Se l'utente esiste già, restituisce un errore
        if (existingUser) return res.status(400).json({ message: 'Username o email già esistenti' }); 

        // Crea un nuovo utente e, se il ruolo è "tutor", crea anche un nuovo tutor associato all'utente
        const newUser = new User({ name, surname, username, email, password, role });
        await newUser.save(); // Salva il nuovo utente nel database
        // Restituisce una risposta di successo con i dati dell'utente appena creato
        res.status(201).json({ 
            message: 'Utente registrato con successo', 
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });

        if (role.includes('tutor')) {
            // Se il ruolo dell'utente è "tutor", estrai ulteriori informazioni per i tutor
            const subjects=req.body.subject;
            const hourlyPrice=req.body.hourlyPrice;
            const bio=req.body.bio;  
            const availibility=req.body.availibility;
            // Crea un nuovo tutor associato all'utente appena creato
            const newTutor = new Tutor({ userId: newUser._id, subjects, hourlyPrice, bio, availibility });
            await newTutor.save(); // Salva il nuovo tutor nel database
            // Restituisce una risposta di successo con i dati del tutor appena creato
            res.status(201).json({ 
                message: 'Tutor registrato con successo', 
                tutor: {
                    id: newTutor._id
                }
            });
        }
    }
    catch(error){
        res.status(400).json({ 
            message: 'Errore nella registrazione dell\'utente',
            error
        });
    }
}

async function login(req, res) {
    // Estrae email e password dalla richiesta
    const { email, password } = req.body;
    // Verifica se email e password sono stati forniti
    if(!email || !password) return res.status(400).json({ message: 'Inserire email e password' });
    // Cerca l'utente nel database in base all'email fornita
    const user = await User.findOne({ email});
    // Se l'utente non viene trovato, restituisce un errore di autenticazione
    if (!user) return res.status(401).json({ message: 'Email o password errata' });
   

}
async function logout(req, res) {
    
}
module.exports = {
    register,
    login,
    logout
}