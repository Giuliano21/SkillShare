// Script per popolare il database con 10 tutor, slot di disponibilità e 3 recensioni

const mongoose = require("mongoose");
const User = require("./models/User");
const Tutor = require("./models/Tutor");
const AvailabilitySlot = require("./models/AvailabilitySlot");
const Booking = require("./models/Booking");
const Review = require("./models/Review");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

// Dati di esempio per i tutor
const tutorsData = [
  {
    user: {
      name: "Marco",
      surname: "Rossi",
      username: "marco_rossi",
      email: "marco.rossi@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Matematica", "Fisica"],
      hourlyPrice: 25,
      bio: "Insegnante di matematica e fisica con 10 anni di esperienza. Specializzato in preparazione agli esami.",
      rating: 4.8,
      reviewsCount: 45,
      lessonMode: "remote",
    },
  },
  {
    user: {
      name: "Giulia",
      surname: "Bianchi",
      username: "giulia_bianchi",
      email: "giulia.bianchi@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Inglese", "Francese"],
      hourlyPrice: 20,
      bio: "Laureata in Lingue Straniere. Lezioni conversazionali e grammatica per tutti i livelli.",
      rating: 4.9,
      reviewsCount: 62,
      lessonMode: "remote",
    },
  },
  {
    user: {
      name: "Andrea",
      surname: "Verdi",
      username: "andrea_verdi",
      email: "andrea.verdi@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Italiano", "Letteratura"],
      hourlyPrice: 18,
      bio: "Professore di italiano con passione per la letteratura classica e moderna. Aiuto con scrittura creativa.",
      rating: 4.7,
      reviewsCount: 38,
      lessonMode: "presence",
    },
  },
  {
    user: {
      name: "Francesca",
      surname: "Neri",
      username: "francesca_neri",
      email: "francesca.neri@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Chimica", "Biologia"],
      hourlyPrice: 22,
      bio: "Laureata in Scienze Biologiche. Lezioni interattive con esperimenti e modelli visuali.",
      rating: 4.6,
      reviewsCount: 41,
      lessonMode: "presence",
    },
  },
  {
    user: {
      name: "Luca",
      surname: "Ferrari",
      username: "luca_ferrari",
      email: "luca.ferrari@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Matematica", "Informatica"],
      hourlyPrice: 28,
      bio: "Ingegnere Informatico con esperienza nel insegnamento. Specializzato in programmazione e logica.",
      rating: 4.9,
      reviewsCount: 54,
      lessonMode: "remote",
    },
  },
  {
    user: {
      name: "Elena",
      surname: "Gallo",
      username: "elena_gallo",
      email: "elena.gallo@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Spagnolo", "Italiano"],
      hourlyPrice: 19,
      bio: "Insegnante di lingue romanze. Metodo comunicativo e divertente per imparare velocemente.",
      rating: 4.8,
      reviewsCount: 47,
      lessonMode: "remote",
    },
  },
  {
    user: {
      name: "Roberto",
      surname: "Moretti",
      username: "roberto_moretti",
      email: "roberto.moretti@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Diritto", "Economia"],
      hourlyPrice: 24,
      bio: "Avvocato e consulente economico. Spiego concetti complessi in modo semplice e pratico.",
      rating: 4.7,
      reviewsCount: 35,
      lessonMode: "presence",
    },
  },
  {
    user: {
      name: "Martina",
      surname: "Colombo",
      username: "martina_colombo",
      email: "martina.colombo@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Arte", "Storia"],
      hourlyPrice: 17,
      bio: "Storica dell'arte appassionata. Lezioni che combinano storia, arte e cultura.",
      rating: 4.5,
      reviewsCount: 29,
      lessonMode: "presence",
    },
  },
  {
    user: {
      name: "Paolo",
      surname: "Rizzo",
      username: "paolo_rizzo",
      email: "paolo.rizzo@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Tedesco", "Inglese"],
      hourlyPrice: 21,
      bio: "Nativo di Monaco. Insegno tedesco autentico con enfasi sulla pronuncia e la cultura.",
      rating: 4.8,
      reviewsCount: 43,
      lessonMode: "remote",
    },
  },
  {
    user: {
      name: "Alessandra",
      surname: "Conti",
      username: "alessandra_conti",
      email: "alessandra.conti@email.com",
      password: "password123",
      role: ["tutor"],
    },
    tutor: {
      subjects: ["Fisica", "Scienze"],
      hourlyPrice: 23,
      bio: "Fisico sperimentale con passione per l'insegnamento. Rendo la fisica divertente e comprensibile.",
      rating: 4.9,
      reviewsCount: 51,
      lessonMode: "remote",
    },
  },
];

// Dati di esempio per gli studenti
const studentsData = [
  {
    name: "Luigi",
    surname: "Bianchi",
    username: "luigi_bianchi",
    email: "luigi.bianchi@email.com",
    password: "password123",
    role: ["student"],
  },
  {
    name: "Sara",
    surname: "Rossi",
    username: "sara_rossi",
    email: "sara.rossi@email.com",
    password: "password123",
    role: ["student"],
  },
  {
    name: "Giovanni",
    surname: "Verdi",
    username: "giovanni_verdi",
    email: "giovanni.verdi@email.com",
    password: "password123",
    role: ["student"],
  },
];

// Helper per generare slot di disponibilità
const generateAvailabilitySlots = (tutorId, daysAhead = 7) => {
  const slots = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1); // Inizia da domani

  for (let day = 0; day < daysAhead; day++) {
    const slotDate = new Date(baseDate);
    slotDate.setDate(slotDate.getDate() + day);

    // Slot mattutino (9:00-10:00)
    const morningStart = new Date(slotDate);
    morningStart.setHours(9, 0, 0, 0);
    const morningEnd = new Date(slotDate);
    morningEnd.setHours(10, 0, 0, 0);

    slots.push({
      tutorId,
      startTime: morningStart,
      endTime: morningEnd,
      isBooked: day === 0, // Solo il primo slot è prenotato
    });

    // Slot pomeridiano (14:00-15:00)
    const afternoonStart = new Date(slotDate);
    afternoonStart.setHours(14, 0, 0, 0);
    const afternoonEnd = new Date(slotDate);
    afternoonEnd.setHours(15, 0, 0, 0);

    slots.push({
      tutorId,
      startTime: afternoonStart,
      endTime: afternoonEnd,
      isBooked: false,
    });
  }

  return slots;
};

// Funzione per popolare il database
const seedTutors = async () => {
  try {
    // Connessione al database MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(" Connesso al database MongoDB");

    // Chiedi conferma se il database contiene già dati
    const userCount = await User.countDocuments();
    const tutorCount = await Tutor.countDocuments();

    if (userCount > 0 || tutorCount > 0) {
      console.warn(`\n  Database contiene già dati:`);
      console.warn(` - ${userCount} utenti`);
      console.warn(` - ${tutorCount} tutor`);
      console.log("\n Per sovrascrivere i dati, esegui: npm run seed:clean");
      await mongoose.disconnect();
      return;
    }

    // Inserisci i tutor
    console.log("\n Creazione dei tutor...\n");

    const tutorsArray = [];
    for (const data of tutorsData) {
      // Crea l'utente tutor
      const user = new User(data.user);
      const savedUser = await user.save();
      console.log(
        `✓ Tutor creato: ${data.user.name} ${data.user.surname} (${data.user.email})`,
      );

      // Crea il profilo tutor
      const tutor = new Tutor({
        userId: savedUser._id,
        ...data.tutor,
      });
      const savedTutor = await tutor.save();
      tutorsArray.push({ tutor: savedTutor, user: savedUser });
      console.log(
        `  → Materie: ${data.tutor.subjects.join(", ")} | €${data.tutor.hourlyPrice}/h`,
      );
    }

    // Inserisci gli studenti
    console.log("\n Creazione degli studenti...\n");

    const studentsArray = [];
    for (const data of studentsData) {
      const user = new User(data);
      const savedUser = await user.save();
      studentsArray.push(savedUser);
      console.log(
        `Studente creato: ${data.name} ${data.surname} (${data.email})`,
      );
    }

    // Crea slot di disponibilità per i tutor
    console.log("\n Creazione degli slot di disponibilità...\n");

    const slotsArray = [];
    for (const { tutor } of tutorsArray) {
      const slots = generateAvailabilitySlots(tutor._id);
      const savedSlots = await AvailabilitySlot.insertMany(slots);
      slotsArray.push(...savedSlots);
      console.log(`${savedSlots.length} slot creati per il tutor`);
    }

    // Crea booking completati per le recensioni
    console.log("\n Creazione dei booking completati...\n");

    const bookingsArray = [];

    // Booking 1: Studente 1 con Tutor 1 (Marco Rossi)
    const booking1 = new Booking({
      userId: studentsArray[0]._id,
      tutorId: tutorsArray[0].tutor._id,
      slotId: slotsArray[0]._id,
      slotIds: [slotsArray[0]._id],
      subject: "Matematica",
      status: "completed",
    });
    const savedBooking1 = await booking1.save();
    bookingsArray.push(savedBooking1);
    console.log(`Booking 1 creato: ${studentsArray[0].name} con Marco Rossi`);

    // Booking 2: Studente 2 con Tutor 2 (Giulia Bianchi)
    const booking2 = new Booking({
      userId: studentsArray[1]._id,
      tutorId: tutorsArray[1].tutor._id,
      slotId: slotsArray[14]._id,
      slotIds: [slotsArray[14]._id],
      subject: "Inglese",
      status: "completed",
    });
    const savedBooking2 = await booking2.save();
    bookingsArray.push(savedBooking2);
    console.log(
      ` Booking 2 creato: ${studentsArray[1].name} con Giulia Bianchi`,
    );

    // Booking 3: Studente 3 con Tutor 5 (Luca Ferrari)
    const booking3 = new Booking({
      userId: studentsArray[2]._id,
      tutorId: tutorsArray[4].tutor._id,
      slotId: slotsArray[28]._id,
      slotIds: [slotsArray[28]._id],
      subject: "Informatica",
      status: "completed",
    });
    const savedBooking3 = await booking3.save();
    bookingsArray.push(savedBooking3);
    console.log(` Booking 3 creato: ${studentsArray[2].name} con Luca Ferrari`);

    // Crea 3 recensioni
    console.log("\n Creazione delle recensioni...\n");

    // Recensione 1
    const review1 = new Review({
      userId: studentsArray[0]._id,
      tutorId: tutorsArray[0].tutor._id,
      bookingId: savedBooking1._id,
      rating: 5,
      comment:
        "Marco è un eccellente insegnante! Spiega i concetti complessi in modo chiaro e ha molta pazienza.",
    });
    await review1.save();
    console.log(` Recensione 1: 5 stelle su Marco Rossi`);

    // Recensione 2
    const review2 = new Review({
      userId: studentsArray[1]._id,
      tutorId: tutorsArray[1].tutor._id,
      bookingId: savedBooking2._id,
      rating: 4,
      comment:
        "Giulia è bravissima, lezione molto utile. Potrebbe essere un po' più interattiva.",
    });
    await review2.save();
    console.log(` Recensione 2: 4 stelle su Giulia Bianchi`);

    // Recensione 3
    const review3 = new Review({
      userId: studentsArray[2]._id,
      tutorId: tutorsArray[4].tutor._id,
      bookingId: savedBooking3._id,
      rating: 5,
      comment:
        "Luca è straordinario! Ha reso la programmazione affascinante. Consigliatissimo!",
    });
    await review3.save();
    console.log(` Recensione 3: 4 stelle su Luca Ferrari`);

    console.log(`\n Script completato con successo!`);
    console.log(`\n Statistiche finali:`);
    console.log(` Tutor creati: ${tutorsArray.length}`);
    console.log(` Studenti creati: ${studentsArray.length}`);
    console.log(` Slot di disponibilità: ${slotsArray.length}`);
    console.log(` Booking completati: ${bookingsArray.length}`);
    console.log(` Recensioni: 3\n`);

    await mongoose.disconnect();
    console.log("Disconnessione dal database completata");
    process.exit(0);
  } catch (error) {
    console.error("Errore durante il seed del database:", error.message);
    if (error.code === 11000) {
      console.error("Errore: Username o email già esistenti nel database.");
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Funzione per pulire i dati
const cleanDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connesso al database MongoDB");

    console.log("\n Eliminazione di tutti i dati...");
    const userResult = await User.deleteMany({});
    const tutorResult = await Tutor.deleteMany({});
    const slotResult = await AvailabilitySlot.deleteMany({});
    const bookingResult = await Booking.deleteMany({});
    const reviewResult = await Review.deleteMany({});

    console.log(`Eliminati ${userResult.deletedCount} utenti`);
    console.log(`Eliminati ${tutorResult.deletedCount} tutor`);
    console.log(`Eliminati ${slotResult.deletedCount} slot di disponibilità`);
    console.log(`Eliminati ${bookingResult.deletedCount} booking`);
    console.log(`Eliminate ${reviewResult.deletedCount} recensioni`);

    console.log("\n Adesso puoi eseguire: npm run seed\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Errore durante la pulizia del database:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Esegui il seed o la pulizia in base agli argomenti
const command = process.argv[2];
if (command === "clean") {
  cleanDatabase();
} else {
  seedTutors();
}
