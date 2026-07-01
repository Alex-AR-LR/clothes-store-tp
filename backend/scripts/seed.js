// scripts/seed.js
// Carga en MongoDB los mismos productos que estaban hardcodeados en el
// frontend (lib/data/products.ts), así el catálogo real arranca poblado.
//
// Uso:
//   node scripts/seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Producto = require("../models/producto");

function img(seed) {
  return `https://picsum.photos/seed/${seed}/800/1000`;
}

const productos = [
  {
    id_producto: "1",
    slug: "remera-oversize-algodon",
    nombre: "Remera Oversize de Algodón",
    descripcion:
      "Remera de corte holgado confeccionada en algodón peinado 100%. Suave, transpirable y pensada para el uso diario. Costuras reforzadas y cuello redondo clásico.",
    precio: 18990,
    compareAtPrice: 24990,
    categoria: "remeras",
    image: img("remera-oversize"),
    images: [img("remera-oversize"), img("remera-oversize-2"), img("remera-oversize-3")],
    colors: ["Negro", "Blanco", "Arena"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewsCount: 128,
    stock: 34,
    featured: true,
    isNew: true,
    tags: ["algodón", "oversize", "unisex"],
  },
  {
    id_producto: "2",
    slug: "buzo-canguro-frisa",
    nombre: "Buzo Canguro con Frisa",
    descripcion:
      "Buzo canguro con bolsillo delantero y capucha ajustable. Interior de frisa que abriga sin abultar. Puños y cintura elastizados.",
    precio: 34990,
    categoria: "buzos",
    image: img("buzo-canguro"),
    images: [img("buzo-canguro"), img("buzo-canguro-2")],
    colors: ["Gris", "Negro", "Verde"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    reviewsCount: 96,
    stock: 21,
    featured: true,
    tags: ["frisa", "abrigo"],
  },
  {
    id_producto: "3",
    slug: "jean-slim-fit",
    nombre: "Jean Slim Fit",
    descripcion:
      "Jean de tiro medio y calce slim con leve elastano para mayor comodidad. Cinco bolsillos y lavado clásico.",
    precio: 42990,
    compareAtPrice: 52990,
    categoria: "pantalones",
    image: img("jean-slim"),
    images: [img("jean-slim"), img("jean-slim-2")],
    colors: ["Azul", "Negro"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviewsCount: 74,
    stock: 12,
    featured: true,
    tags: ["denim", "slim"],
  },
  {
    id_producto: "4",
    slug: "campera-rompeviento",
    nombre: "Campera Rompeviento",
    descripcion:
      "Campera liviana resistente al viento y a lluvias leves. Capucha desmontable y bolsillos con cierre. Ideal para media estación.",
    precio: 58990,
    categoria: "camperas",
    image: img("campera-rompeviento"),
    images: [img("campera-rompeviento"), img("campera-rompeviento-2")],
    colors: ["Negro", "Azul", "Naranja"],
    sizes: ["M", "L", "XL"],
    rating: 4.7,
    reviewsCount: 53,
    stock: 8,
    featured: true,
    isNew: true,
    tags: ["impermeable", "media estación"],
  },
  {
    id_producto: "5",
    slug: "remera-estampada-retro",
    nombre: "Remera Estampada Retro",
    descripcion:
      "Remera de algodón con estampa de estilo retro. Estampa de alta durabilidad y calce regular.",
    precio: 21990,
    categoria: "remeras",
    image: img("remera-retro"),
    colors: ["Blanco", "Negro"],
    sizes: ["S", "M", "L"],
    rating: 4.2,
    reviewsCount: 41,
    stock: 27,
    tags: ["estampada"],
  },
  {
    id_producto: "6",
    slug: "jogger-deportivo",
    nombre: "Jogger Deportivo",
    descripcion:
      "Pantalón jogger con puño elastizado y cordón ajustable. Tela de frisa suave para entrenar o descansar.",
    precio: 29990,
    compareAtPrice: 35990,
    categoria: "pantalones",
    image: img("jogger"),
    colors: ["Gris", "Negro", "Bordó"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviewsCount: 89,
    stock: 40,
    isNew: true,
    tags: ["deportivo", "jogger"],
  },
  {
    id_producto: "7",
    slug: "gorro-tejido",
    nombre: "Gorro Tejido",
    descripcion: "Gorro tejido unisex, cálido y elástico. Se adapta a cualquier talle.",
    precio: 9990,
    categoria: "accesorios",
    image: img("gorro"),
    colors: ["Negro", "Gris", "Mostaza"],
    sizes: ["M"],
    rating: 4.4,
    reviewsCount: 33,
    stock: 60,
    tags: ["invierno"],
  },
  {
    id_producto: "8",
    slug: "campera-jean-clasica",
    nombre: "Campera de Jean Clásica",
    descripcion:
      "Campera de jean de calce regular con botones metálicos y bolsillos frontales. Un básico atemporal.",
    precio: 64990,
    categoria: "camperas",
    image: img("campera-jean"),
    colors: ["Azul", "Celeste"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewsCount: 61,
    stock: 0,
    tags: ["denim", "clásico"],
  },
  {
    id_producto: "9",
    slug: "buzo-medio-cierre",
    nombre: "Buzo Medio Cierre",
    descripcion: "Buzo con medio cierre y cuello alto. Abrigado y versátil para combinar.",
    precio: 37990,
    categoria: "buzos",
    image: img("buzo-cierre"),
    colors: ["Beige", "Negro", "Petróleo"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewsCount: 47,
    stock: 15,
    tags: ["abrigo"],
  },
  {
    id_producto: "10",
    slug: "medias-pack-x3",
    nombre: "Medias Pack x3",
    descripcion:
      "Pack de 3 pares de medias de algodón con refuerzo en talón y punta. Colores surtidos.",
    precio: 8990,
    categoria: "accesorios",
    image: img("medias"),
    colors: ["Surtido"],
    sizes: ["M", "L"],
    rating: 4.1,
    reviewsCount: 22,
    stock: 100,
    tags: ["pack", "básico"],
  },
  {
    id_producto: "11",
    slug: "remera-manga-larga",
    nombre: "Remera Manga Larga",
    descripcion:
      "Remera de manga larga en algodón liviano. Ideal para superponer o usar sola en días frescos.",
    precio: 23990,
    categoria: "remeras",
    image: img("remera-larga"),
    colors: ["Blanco", "Negro", "Verde"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviewsCount: 38,
    stock: 30,
    isNew: true,
    tags: ["algodón"],
  },
  {
    id_producto: "12",
    slug: "pantalon-cargo",
    nombre: "Pantalón Cargo",
    descripcion: "Pantalón cargo con bolsillos laterales y calce relajado. Tela resistente para el día a día.",
    precio: 45990,
    categoria: "pantalones",
    image: img("cargo"),
    colors: ["Verde", "Beige", "Negro"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviewsCount: 57,
    stock: 18,
    tags: ["cargo", "urbano"],
  },
];

async function seed() {
  await connectDB();

  console.log("[seed] Borrando productos existentes...");
  await Producto.deleteMany({});

  console.log(`[seed] Insertando ${productos.length} productos...`);
  await Producto.insertMany(productos);

  console.log("[seed] Listo ✅");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
