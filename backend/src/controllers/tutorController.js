const Tutor = require("../models/Tutor");
const AvailabilitySlot = require("../models/AvailabilitySlot");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Funzione per ottenere tutti i tutor in base a criteri di ricerca specifici
async function getAllTutors(req, res) {
  try {
    // Estrazione dei parametri di query dalla richiesta
    const { subject, minPrice, maxPrice, minRating, lessonMode, sort } =
      req.query;
    let filter = {};
    // Filtro per materia (case-insensitive)
    if (subject) {
      if (typeof subject !== "string" || subject.length > 80) {
        return res.status(400).json({ message: "Materia non valida" });
      }
      // $regex per ricerca case-insensitive e $options: 'i' per ignorare maiuscole/minuscole
      filter.subjects = { $regex: escapeRegex(subject), $options: "i" };
    }
    // Filtri per prezzo minimo e massimo
    if (minPrice !== undefined && !Number.isFinite(Number(minPrice)))
      return res.status(400).json({ message: "Prezzo minimo non valido" });
    if (maxPrice !== undefined && !Number.isFinite(Number(maxPrice)))
      return res.status(400).json({ message: "Prezzo massimo non valido" });
    if (minPrice !== undefined)
      filter.hourlyPrice = { ...filter.hourlyPrice, $gte: Number(minPrice) };
    if (maxPrice !== undefined)
      filter.hourlyPrice = { ...filter.hourlyPrice, $lte: Number(maxPrice) };

    // Filtro per valutazione minima
    if (minRating !== undefined && !Number.isFinite(Number(minRating)))
      return res.status(400).json({ message: "Valutazione minima non valida" });
    if (minRating !== undefined)
      filter.rating = { ...filter.rating, $gte: Number(minRating) };

    // Filtro per modalità di lezione (remota o in presenza)
    if (lessonMode) filter.lessonMode = lessonMode;

    let query = Tutor.find(filter).populate("userId", "name surname");

    // Ordinamento dei risultati in base al parametro di ordinamento specificato nella query
    if (sort === "subject") {
      query = query.sort({ subjects: 1 });
    } else if (sort === "price") {
      query = query.sort({ hourlyPrice: 1 });
    } else if (sort === "rating") {
      query = query.sort({ rating: -1 });
    } else if (sort === "lessonMode") {
      query = query.sort({ lessonMode: 1 });
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    }

    const tutors = await query;
    res.status(200).json({ message: "Tutor trovati", tutors });
  } catch (err) {
    res.status(500).json({
      message: "Errore durante il recupero dei tutor",
      error: err.message,
    });
  }
}

// Funzione per ottenere le informazioni di un tutor specifico in base al suo ID
async function getTutorById(req, res) {
  try {
    const tutorId = req.params.id;
    // Utilizzo di populate per ottenere i dettagli dell'utente associato al tutor
    const tutor = await Tutor.findById(tutorId).populate(
      "userId",
      "name surname",
    );
    if (!tutor) {
      return res.status(404).json({ message: "Tutor non trovato" });
    }
    res.status(200).json({ message: "Tutor trovato", tutor });
  } catch (err) {
    res.status(500).json({
      message: "Errore durante il recupero del tutor",
      error: err.message,
    });
  }
}

async function getMyTutor(req, res) {
  try {
    const tutor = await Tutor.findOne({ userId: req.user._id }).populate(
      "userId",
      "name surname username",
    );
    if (!tutor)
      return res.status(404).json({ message: "Profilo tutor non trovato" });
    res.status(200).json({ tutor });
  } catch (err) {
    res.status(500).json({
      message: "Errore nel recupero del profilo tutor",
      error: err.message,
    });
  }
}

async function updateMyTutor(req, res) {
  try {
    const { subjects, hourlyPrice, bio, lessonMode } = req.body;
    // Normalizza la modalità di lezione in un array di stringhe uniche
    const normalizedLessonMode =
      lessonMode === undefined
        ? undefined
        : Array.isArray(lessonMode)
          ? [...new Set(lessonMode)]
          : [lessonMode];
    if (
      normalizedLessonMode !== undefined &&
      (!normalizedLessonMode.length ||
        normalizedLessonMode.some(
          (mode) => !["remote", "presence"].includes(mode),
        ))
    ) {
      return res
        .status(400)
        .json({ message: "Modalità di lezione non valida" });
    }
    const tutor = await Tutor.findOne({ userId: req.user._id });
    if (!tutor)
      return res.status(404).json({ message: "Profilo tutor non trovato" });
    if (subjects !== undefined)
      tutor.subjects = Array.isArray(subjects)
        ? subjects
        : subjects
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    if (hourlyPrice !== undefined) tutor.hourlyPrice = hourlyPrice;
    if (bio !== undefined) tutor.bio = bio;
    if (normalizedLessonMode !== undefined)
      tutor.lessonMode = normalizedLessonMode;
    await tutor.save();
    return res.status(200).json({ message: "Profilo tutor aggiornato", tutor });
  } catch (err) {
    return res.status(400).json({
      message: "Errore nell'aggiornamento del profilo tutor",
      error: err.message,
    });
  }
}

// Funzione per ottenere le disponibilità orarie di un tutor specifico in base al suo ID
async function getTutorAvailability(req, res) {
  try {
    const tutorId = req.params.id;
    const availabilitySlots = await AvailabilitySlot.find({
      tutorId: tutorId,
      isBooked: false,
    });
    res
      .status(200)
      .json({ message: "Disponibilità del tutor trovata", availabilitySlots });
  } catch (err) {
    res.status(500).json({
      message: "Errore durante il recupero della disponibilità del tutor",
      error: err.message,
    });
  }
}

// Funzione per aggiungere nuove disponibilità orarie per un tutor specifico in base al suo ID
async function addTutorAvailability(req, res) {
  try {
    const tutorId = req.params.id;
    const { startTime, endTime } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end - start) / (60 * 60 * 1000);
    if (
      !startTime ||
      !endTime ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      durationHours < 1 ||
      !Number.isInteger(durationHours)
    ) {
      return res
        .status(400)
        .json({ message: "Intervallo di disponibilità non valido" });
    }
    const slots = [];
    for (
      let slotStart = start;
      slotStart < end;
      slotStart = new Date(slotStart.getTime() + 60 * 60 * 1000)
    ) {
      slots.push({
        tutorId,
        startTime: slotStart,
        endTime: new Date(slotStart.getTime() + 60 * 60 * 1000),
        isBooked: false,
      });
    }
    const newAvailabilitySlots = await AvailabilitySlot.insertMany(slots);
    res.status(201).json({
      message: "Disponibilità del tutor aggiunta",
      availabilitySlots: newAvailabilitySlots,
    });
  } catch (err) {
    res.status(500).json({
      message: "Errore durante l'aggiunta della disponibilità del tutor",
      error: err.message,
    });
  }
}

// Funzione per aggiornare le disponibilità orarie di un tutor specifico in base al suo ID
async function updateTutorAvailability(req, res) {
  try {
    const availabilityId = req.params.id;
    const { startTime, endTime } = req.body;

    const availabilitySlot = await AvailabilitySlot.findById(availabilityId);
    if (!availabilitySlot)
      return res
        .status(404)
        .json({ message: "Disponibilità del tutor non trovata" });
    const tutor = await Tutor.findOne({
      _id: availabilitySlot.tutorId,
      userId: req.user._id,
    });
    if (!tutor) return res.status(403).json({ message: "Non autorizzato" });

    // Aggiorna i campi della disponibilità con i nuovi valori forniti nella richiesta
    const nextStart =
      startTime !== undefined
        ? new Date(startTime)
        : availabilitySlot.startTime;
    const nextEnd =
      endTime !== undefined ? new Date(endTime) : availabilitySlot.endTime;
    if (
      Number.isNaN(new Date(nextStart).getTime()) ||
      Number.isNaN(new Date(nextEnd).getTime()) ||
      nextEnd - nextStart !== 60 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({ message: "Intervallo di disponibilità non valido" });
    }
    availabilitySlot.startTime = nextStart;
    availabilitySlot.endTime = nextEnd;

    await availabilitySlot.save();
    res.status(200).json({
      message: "Disponibilità del tutor aggiornata",
      availabilitySlot,
    });
  } catch (err) {
    res.status(500).json({
      message: "Errore durante l'aggiornamento della disponibilità del tutor",
      error: err.message,
    });
  }
}

async function deleteTutorAvailability(req, res) {
  try {
    const slot = await AvailabilitySlot.findById(req.params.id);
    if (!slot)
      return res.status(404).json({ message: "Disponibilità non trovata" });
    const tutor = await Tutor.findOne({
      _id: slot.tutorId,
      userId: req.user._id,
    });
    if (!tutor) return res.status(403).json({ message: "Non autorizzato" });
    if (slot.isBooked)
      return res
        .status(400)
        .json({ message: "Non puoi eliminare uno slot prenotato" });
    await slot.deleteOne();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({
      message: "Errore nella cancellazione della disponibilità",
      error: err.message,
    });
  }
}

module.exports = {
  getAllTutors,
  getTutorById,
  getMyTutor,
  updateMyTutor,
  getTutorAvailability,
  addTutorAvailability,
  updateTutorAvailability,
  deleteTutorAvailability,
};
