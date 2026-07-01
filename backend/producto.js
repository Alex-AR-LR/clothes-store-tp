// models/producto.js
// Entidad "Producto" del diseño conceptual/lógico.

const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    id_producto: {
      type: String,
      required: [true, "El id_producto es obligatorio"],
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: "",
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt automáticos
  }
);

module.exports = mongoose.model("Producto", productoSchema);
