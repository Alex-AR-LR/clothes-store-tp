// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productosRoutes = require("./routes/productos");
const clientesRoutes = require("./routes/clientes");
const pedidosRoutes = require("./routes/pedidos");
const informesRoutes = require("./routes/informes");

const app = express();

// --- Conexión a la base de datos ---
connectDB();

// --- Middlewares ---
// CORS habilitado para el puerto por defecto de Next.js (dev server).
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json()); // parseo de body JSON

// --- Rutas ---
app.use("/api/productos", productosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/informes", informesRoutes);

// Ruta de salud simple, útil para verificar que el server está arriba.
app.get("/", (req, res) => {
  res.json({ status: "ok", mensaje: "API tienda-virtual funcionando" });
});

// --- Manejo de rutas no encontradas ---
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// --- Manejo de errores centralizado (por si algo no fue capturado antes) ---
app.use((err, req, res, next) => {
  console.error("[server] Error no controlado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[server] Escuchando en http://localhost:${PORT}`);
});
