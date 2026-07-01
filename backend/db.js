// config/db.js
// Configuración y establecimiento de la conexión a MongoDB usando Mongoose.

const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error(
      "[db] ERROR: no se definió MONGO_URI en las variables de entorno (.env)."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`[db] Conectado a MongoDB -> DB: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("[db] Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }

  // Manejo de eventos de conexión (útil para detectar caídas en runtime).
  mongoose.connection.on("error", (err) => {
    console.error("[db] Error de conexión en runtime:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] Mongoose se desconectó de MongoDB.");
  });
}

module.exports = connectDB;
