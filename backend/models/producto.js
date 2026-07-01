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
    // ---------------------------------------------------------------
    // Campos EXTRA opcionales (no exigidos por la consigna de la
    // cátedra) para que este mismo documento pueda alimentar el
    // catálogo completo del frontend (imágenes, talles, colores, etc.)
    // sin necesidad de una segunda colección.
    // ---------------------------------------------------------------
    slug: { type: String, trim: true },
    image: { type: String, trim: true },
    images: { type: [String], default: undefined },
    colors: { type: [String], default: undefined },
    sizes: { type: [String], default: undefined },
    rating: { type: Number, min: 0, max: 5 },
    reviewsCount: { type: Number, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    featured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    tags: { type: [String], default: undefined },
  },
  {
    timestamps: true, // createdAt / updatedAt automáticos
  }
);

module.exports = mongoose.model("Producto", productoSchema);
