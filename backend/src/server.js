// Importo i moduli necessari per creare l'applicazione Express, connettermi a MongoDB e gestire le richieste HTTP
const express= require('express');
const cors= require('cors');
const db= require('./config/db');

// Prendo i dati dalle variabili d'ambiente definite nel file .env
require('dotenv').config();
const PORT= process.env.PORT || 3000;

// Definizione delle route
const authRouter= require('./routes/authRouter');
const bookingRouter= require('./routes/bookingRouter');
const tutorRouter= require('./routes/tutorRouter');
const reviewRouter= require('./routes/reviewRouter');
const healthRouter= require('./routes/healthRouter');
const userRouter= require('./routes/userRouter');

// Creo un'istanza dell'applicazione Express
const app= express();

//Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/tutors', tutorRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/users', userRouter);


// Configuro la connessione al database MongoDB utilizzando la funzione connectDB di db.js 
db.connectDB();
app.listen(PORT , () => {
    console.log(`Il server è avviato su http://localhost:${PORT}`);
});

