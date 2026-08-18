const Tutor = require('../models/Tutor');
const AvailabilitySlot = require('../models/AvailabilitySlot');

// Funzione per ottenere tutti i tutor in base a criteri di ricerca specifici
async function getAllTutors(req, res) {
    try{
        // Estrazione dei parametri di query dalla richiesta
        const {subject, minPrice, maxPrice, minRating, lessonMode, sort} = req.query;
        let filter = {};
        // Filtro per materia (case-insensitive)
        if (subject) {
            // $regex per ricerca case-insensitive e $options: 'i' per ignorare maiuscole/minuscole
            filter.subjects = {$regex: subject, $options: 'i'}; 
        }
        // Filtri per prezzo minimo e massimo
        if (minPrice !== undefined) filter.hourlyPrice = { ...filter.hourlyPrice, $gte: parseFloat(minPrice) };
        if (maxPrice !== undefined) filter.hourlyPrice = { ...filter.hourlyPrice, $lte: parseFloat(maxPrice) };
        
        // Filtro per valutazione minima
        if (minRating !== undefined) filter.rating = { ...filter.rating, $gte: parseFloat(minRating) };

        // Filtro per modalità di lezione (remota o in presenza)
        if (lessonMode)  filter.lessonMode = lessonMode;

        const query = await Tutor.find(filter).populate('userId', 'name surname'); 
        
        // Ordinamento dei risultati in base al parametro di ordinamento specificato nella query
        if(sort === 'subject') {
            query= query.sort({ subjects: 1 });
        } else if(sort === 'price') {
            query= query.sort({ hourlyPrice: 1 });
        } else if(sort === 'rating') {
            query= query.sort({ rating: -1 });
        } else if(sort === 'lessonMode') {
            query= query.sort({ lessonMode: 1 });
        }
        
        const tutors= await query;
        res.status(200).json({ message: 'Tutor trovati', tutors });
    }
    catch(err){
        res.status(500).json({ message: 'Errore durante il recupero dei tutor', error: err.message });
    }
}

// Funzione per ottenere le informazioni di un tutor specifico in base al suo ID
async function getTutorById(req, res) {
    try{
        const tutorId = req.params.id;
        // Utilizzo di populate per ottenere i dettagli dell'utente associato al tutor
        const tutor = await Tutor.findById(tutorId).populate('userId', 'name surname');
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor non trovato' });
        }
        res.status(200).json({ message: 'Tutor trovato', tutor });
    }
    catch(err){
        res.status(500).json({ message: 'Errore durante il recupero del tutor', error: err.message });
    }
}

// Funzione per ottenere le disponibilità orarie di un tutor specifico in base al suo ID
async function getTutorAvailability(req, res) {
    try{
        const tutorId = req.params.id;
        const availabilitySlots = await AvailabilitySlot.find({ tutorId: tutorId , isBooked: false });
        res.status(200).json({ message: 'Disponibilità del tutor trovata', availabilitySlots });
    }
    catch(err){
        res.status(500).json({ message: 'Errore durante il recupero della disponibilità del tutor', error: err.message });
    }
}

// Funzione per aggiungere nuove disponibilità orarie per un tutor specifico in base al suo ID
async function addTutorAvailability(req, res) {
    try{
        const tutorId = req.params.id;
        const { startTime, endTime } = req.body;
        const newAvailabilitySlot = new AvailabilitySlot({
            tutorId: tutorId,
            startTime: startTime,
            endTime: endTime,
            isBooked: false
        });
        await newAvailabilitySlot.save();
        res.status(201).json({ message: 'Disponibilità del tutor aggiunta', availabilitySlot: newAvailabilitySlot });
    }
    catch(err){
        res.status(500).json({ message: 'Errore durante l\'aggiunta della disponibilità del tutor', error: err.message });
    }
}

// Funzione per aggiornare le disponibilità orarie di un tutor specifico in base al suo ID
async function updateTutorAvailability(req, res) {
    try{
        const availabilityId = req.params.id;
        const { startDay, endDay , startTime, endTime } = req.body; 

        const availabilitySlot = await AvailabilitySlot.findById(availabilityId);
        if (!availabilitySlot) return res.status(404).json({ message: 'Disponibilità del tutor non trovata' });

        // Aggiorna i campi della disponibilità con i nuovi valori forniti nella richiesta
        availabilitySlot.startDay = startDay !== undefined ? startDay : availabilitySlot.startDay;
        availabilitySlot.endDay = endDay !== undefined ? endDay : availabilitySlot.endDay;
        availabilitySlot.startTime = startTime !== undefined ? startTime : availabilitySlot.startTime;
        availabilitySlot.endTime = endTime !== undefined ? endTime : availabilitySlot.endTime;

        await availabilitySlot.save();
        res.status(200).json({ message: 'Disponibilità del tutor aggiornata', availabilitySlot });
    }
    catch(err){
        res.status(500).json({ message: 'Errore durante l\'aggiornamento della disponibilità del tutor', error: err.message });
    }
}

module.exports = {
    getAllTutors,
    getTutorById,
    getTutorAvailability,
    addTutorAvailability,
    updateTutorAvailability
}