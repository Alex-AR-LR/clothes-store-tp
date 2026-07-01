// routes/pedidos.js
const express = require("express");
const router = express.Router();
const Pedido = require("../models/pedido");
const Producto = require("../models/producto");

// -----------------------------------------------------------------------
// POST /api/pedidos
// Crea un pedido (documento denormalizado) y descuenta el stock vendido.
//
// Estrategia de actualización de stock:
//   Por cada línea del pedido usamos un findOneAndUpdate ATÓMICO que sólo
//   descuenta stock si hay suficiente (id_producto + stock >= cantidad en
//   el filtro). Esto evita condiciones de carrera donde dos pedidos
//   simultáneos dejen el stock en negativo. Si en algún punto no hay stock
//   suficiente, se revierten ($inc positivo) los descuentos ya aplicados
//   y se responde 400, sin llegar a crear el pedido.
//
//   Nota: en un entorno productivo con MongoDB como replica set, esto se
//   podría envolver en una transacción (session.withTransaction). Para el
//   alcance de la cátedra, el patrón "descuenta y revierte si falla" es
//   suficiente y más simple de explicar en el informe.
// -----------------------------------------------------------------------
router.post("/", async (req, res) => {
  const { cliente, productos } = req.body;

  if (!cliente || !productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({
      error: "El pedido debe incluir 'cliente' y un array 'productos' no vacío",
    });
  }

  const descuentosAplicados = []; // para poder revertir si algo falla

  try {
    // 1) Descontar stock producto por producto, de forma atómica.
    for (const item of productos) {
      const { id_producto, cantidad } = item;

      const productoActualizado = await Producto.findOneAndUpdate(
        { id_producto, stock: { $gte: cantidad } }, // sólo si hay stock suficiente
        { $inc: { stock: -cantidad } }, // descuento (inc negativo)
        { new: true }
      );

      if (!productoActualizado) {
        throw new Error(
          `Stock insuficiente o producto inexistente: ${id_producto}`
        );
      }

      descuentosAplicados.push({ id_producto, cantidad });
    }

    // 2) Calcular el total en el servidor (no confiar en el total del cliente).
    const total = productos.reduce(
      (acc, p) => acc + p.precio_unitario * p.cantidad,
      0
    );

    // 3) Crear el pedido denormalizado (embebe cliente y productos).
    const nuevoPedido = await Pedido.create({
      cliente,
      productos,
      total,
      estado: "pendiente",
    });

    return res.status(201).json(nuevoPedido);
  } catch (error) {
    // Revertir los descuentos de stock ya aplicados antes del error.
    for (const d of descuentosAplicados) {
      await Producto.updateOne(
        { id_producto: d.id_producto },
        { $inc: { stock: d.cantidad } }
      );
    }
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/pedidos/cliente/:id_cliente -> Pedidos de un cliente específico
router.get("/cliente/:id_cliente", async (req, res) => {
  try {
    const pedidos = await Pedido.find({
      "cliente.id_cliente": req.params.id_cliente,
    }).sort({ fecha_pedido: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pedidos -> Listar todos los pedidos (útil para el frontend/admin)
router.get("/", async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ fecha_pedido: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/pedidos/:id/estado -> Actualizar únicamente el estado
router.put("/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["pendiente", "enviado", "entregado"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")}`,
      });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
