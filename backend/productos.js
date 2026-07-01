// routes/productos.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Producto = require("../models/producto");

// POST /api/productos -> Crear un producto
router.post("/", async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/productos -> Leer todos, con filtro opcional ?categoria=...
router.get("/", async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = categoria ? { categoria } : {};
    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/productos/:id -> Leer uno por ID (Mongo _id o id_producto)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Acepta tanto el _id de Mongo como el id_producto propio del negocio.
    const producto = mongoose.isValidObjectId(id)
      ? await Producto.findById(id)
      : await Producto.findOne({ id_producto: id });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
