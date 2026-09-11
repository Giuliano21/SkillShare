const mongoose = require("mongoose");
const AvailabilitySlot = require("../models/AvailabilitySlot");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

// Funzione per connettersi al database MongoDB utilizzando Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await AvailabilitySlot.syncIndexes();
    console.log("Connesso al database MongoDB");
  } catch (error) {
    console.error("Errore di connessione con il database MongoDB:", error);
    process.exit(1); // Esci dal processo con codice di errore 1 (fallimento)
  }
};

module.exports = { connectDB };
