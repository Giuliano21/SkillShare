/* tutorRoutes.js definisce le rotte per gestire le operazioni relative ai tutor come: la ricerca dei tutor, il recupero delle informazioni di un tutor specifico
e la gestione delle disponibilità orarie.
*/

const express = require('express');
const router = express.Router();

// Importo il controller per gestire le operazioni relative ai tutor
const TutorController = require('../controllers/tutorController');

// Importo il middleware per verificare il token JWT e proteggere le rotte che richiedono autenticazione
const auth = require('../middlewares/auth');

// Ricerca dei tutor in base a criteri specifici (ad esempio, materia, disponibilità, ecc.)
router.get('/' , TutorController.getAllTutors);
// Recupero le informazioni di un tutor specifico in base al suo ID
router.get('/:id' , TutorController.getTutorById);
// Aggiunta di nuove disponibilità orarie per un tutor in base al suo ID  
router.post('/:id/availability', auth.verifyToken , auth.restrictTo(['tutor']) ,TutorController.addTutorAvailability);
// Recupero le disponibilità orarie di un tutor in base al suo ID
router.get('/:id/availability', TutorController.getTutorAvailability);
// Aggiornamento delle disponibilità orarie di un tutor in base al suo ID 
router.put('/:id/availability', auth.verifyToken , auth.restrictTo(['tutor']) ,TutorController.updateTutorAvailability);

module.exports = router;