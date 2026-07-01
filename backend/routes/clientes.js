// routes/clientes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Cliente = require("../models/cliente");

// POST /api/clientes -> Crear un cliente
router.post("/", async (req, res) => {
  try {
    const nuevoCliente = await Cliente.create(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/clientes -> Leer todos
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/clientes/:id -> Leer uno por ID (Mongo _id o id_cliente)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = mongoose.isValidObjectId(id)
      ? await Cliente.findById(id)
      : await Cliente.findOne({ id_cliente: id });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
