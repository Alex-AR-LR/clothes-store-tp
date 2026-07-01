// models/pedido.js
// Entidad "Pedido" — estructura DENORMALIZADA (fase 2 de la propuesta).
//
// A diferencia de "Producto" y "Cliente" (que son colecciones normalizadas
// para mantener su propio CRUD e integridad), "Pedido" EMBEBE una copia del
// cliente y de los productos comprados al momento de la compra. Esto es
// intencional: optimiza las lecturas más frecuentes (listar pedidos, ver el
// detalle de un pedido, generar informes) evitando joins ($lookup), a costa
// de aceptar redundancia de datos, que es justamente lo que se busca
// evaluar en el diseño lógico NoSQL de la cátedra.

const mongoose = require("mongoose");

// --- Subdocumento: snapshot del cliente al momento del pedido ---
const clienteEmbebidoSchema = new mongoose.Schema(
  {
    id_cliente: { type: String, required: true },
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String },
    direccion: { type: String },
  },
  { _id: false } // no necesitamos un _id propio para el subdocumento
);

// --- Subdocumento: cada línea de producto vendido dentro del pedido ---
const productoEmbebidoSchema = new mongoose.Schema(
  {
    id_producto: { type: String, required: true },
    nombre: { type: String, required: true },
    precio_unitario: {
      type: Number,
      required: true,
      min: 0,
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, "La cantidad debe ser al menos 1"],
    },
    // Campos opcionales que el frontend real envía (talle/color elegidos).
    // No forman parte del mínimo pedido por la cátedra, pero se aceptan
    // para que el carrito del frontend (Next.js) encaje sin pérdida de datos.
    talle: { type: String },
    color: { type: String },
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: clienteEmbebidoSchema,
      required: [true, "El pedido debe incluir los datos del cliente"],
    },
    productos: {
      type: [productoEmbebidoSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "El pedido debe incluir al menos un producto",
      },
    },
    fecha_pedido: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: {
        values: ["pendiente", "enviado", "entregado"],
        message: "Estado inválido: {VALUE}",
      },
      default: "pendiente",
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pedido", pedidoSchema);
