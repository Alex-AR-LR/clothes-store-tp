import type { Category, Product } from "@/lib/types";

// ---------------------------------------------------------------------------
// CAPA DE DATOS (MOCK)
//
// Este archivo simula la fuente de datos. Todas las páginas consumen los
// productos a través de las funciones `async` de más abajo (getProducts,
// getProductBySlug, etc.).
//
// INTEGRACIÓN CON BACKEND:
//   Reemplazá el cuerpo de cada función por un `fetch` a la API real, por
//   ejemplo:
//
//     export async function getProducts() {
//       const res = await fetch(`${process.env.API_URL}/products`, {
//         next: { revalidate: 60 },
//       });
//       return res.json() as Promise<Product[]>;
//     }
//
//   Mientras la firma (parámetros y tipo de retorno) se mantenga, ningún
//   componente de la UI necesita cambios.
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  { slug: "remeras", name: "Remeras", description: "Básicas y estampadas" },
  { slug: "buzos", name: "Buzos", description: "Frisa y algodón" },
  {
    slug: "pantalones",
    name: "Pantalones",
    description: "Jeans, joggers y más",
  },
  {
    slug: "camperas",
    name: "Camperas",
    description: "Abrigo para toda ocasión",
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    description: "Gorros, bolsos y medias",
  },
];

// Imagen placeholder determinística (sin depender de servicios externos).
function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/800/1000`;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "remera-oversize-algodon",
    name: "Remera Oversize de Algodón",
    description:
      "Remera de corte holgado confeccionada en algodón peinado 100%. Suave, transpirable y pensada para el uso diario. Costuras reforzadas y cuello redondo clásico.",
    price: 18990,
    compareAtPrice: 24990,
    categorySlug: "remeras",
    image: img("remera-oversize"),
    images: [
      img("remera-oversize"),
      img("remera-oversize-2"),
      img("remera-oversize-3"),
    ],
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
    id: "2",
    slug: "buzo-canguro-frisa",
    name: "Buzo Canguro con Frisa",
    description:
      "Buzo canguro con bolsillo delantero y capucha ajustable. Interior de frisa que abriga sin abultar. Puños y cintura elastizados.",
    price: 34990,
    categorySlug: "buzos",
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
    id: "3",
    slug: "jean-slim-fit",
    name: "Jean Slim Fit",
    description:
      "Jean de tiro medio y calce slim con leve elastano para mayor comodidad. Cinco bolsillos y lavado clásico.",
    price: 42990,
    compareAtPrice: 52990,
    categorySlug: "pantalones",
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
    id: "4",
    slug: "campera-rompeviento",
    name: "Campera Rompeviento",
    description:
      "Campera liviana resistente al viento y a lluvias leves. Capucha desmontable y bolsillos con cierre. Ideal para media estación.",
    price: 58990,
    categorySlug: "camperas",
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
    id: "5",
    slug: "remera-estampada-retro",
    name: "Remera Estampada Retro",
    description:
      "Remera de algodón con estampa de estilo retro. Estampa de alta durabilidad y calce regular.",
    price: 21990,
    categorySlug: "remeras",
    image: img("remera-retro"),
    colors: ["Blanco", "Negro"],
    sizes: ["S", "M", "L"],
    rating: 4.2,
    reviewsCount: 41,
    stock: 27,
    tags: ["estampada"],
  },
  {
    id: "6",
    slug: "jogger-deportivo",
    name: "Jogger Deportivo",
    description:
      "Pantalón jogger con puño elastizado y cordón ajustable. Tela de frisa suave para entrenar o descansar.",
    price: 29990,
    compareAtPrice: 35990,
    categorySlug: "pantalones",
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
    id: "7",
    slug: "gorro-tejido",
    name: "Gorro Tejido",
    description:
      "Gorro tejido unisex, cálido y elástico. Se adapta a cualquier talle.",
    price: 9990,
    categorySlug: "accesorios",
    image: img("gorro"),
    colors: ["Negro", "Gris", "Mostaza"],
    sizes: ["M"],
    rating: 4.4,
    reviewsCount: 33,
    stock: 60,
    tags: ["invierno"],
  },
  {
    id: "8",
    slug: "campera-jean-clasica",
    name: "Campera de Jean Clásica",
    description:
      "Campera de jean de calce regular con botones metálicos y bolsillos frontales. Un básico atemporal.",
    price: 64990,
    categorySlug: "camperas",
    image: img("campera-jean"),
    colors: ["Azul", "Celeste"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewsCount: 61,
    stock: 0,
    tags: ["denim", "clásico"],
  },
  {
    id: "9",
    slug: "buzo-medio-cierre",
    name: "Buzo Medio Cierre",
    description:
      "Buzo con medio cierre y cuello alto. Abrigado y versátil para combinar.",
    price: 37990,
    categorySlug: "buzos",
    image: img("buzo-cierre"),
    colors: ["Beige", "Negro", "Petróleo"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewsCount: 47,
    stock: 15,
    tags: ["abrigo"],
  },
  {
    id: "10",
    slug: "medias-pack-x3",
    name: "Medias Pack x3",
    description:
      "Pack de 3 pares de medias de algodón con refuerzo en talón y punta. Colores surtidos.",
    price: 8990,
    categorySlug: "accesorios",
    image: img("medias"),
    colors: ["Surtido"],
    sizes: ["M", "L"],
    rating: 4.1,
    reviewsCount: 22,
    stock: 100,
    tags: ["pack", "básico"],
  },
  {
    id: "11",
    slug: "remera-manga-larga",
    name: "Remera Manga Larga",
    description:
      "Remera de manga larga en algodón liviano. Ideal para superponer o usar sola en días frescos.",
    price: 23990,
    categorySlug: "remeras",
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
    id: "12",
    slug: "pantalon-cargo",
    name: "Pantalón Cargo",
    description:
      "Pantalón cargo con bolsillos laterales y calce relajado. Tela resistente para el día a día.",
    price: 45990,
    categorySlug: "pantalones",
    image: img("cargo"),
    colors: ["Verde", "Beige", "Negro"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviewsCount: 57,
    stock: 18,
    tags: ["cargo", "urbano"],
  },
];

// Simula la latencia de red para que loading states y streaming se vean.
function delay<T>(value: T, ms = 0): Promise<T> {
  if (ms === 0) return Promise.resolve(value);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export type ProductQuery = {
  category?: string;
  search?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "rating";
};

/** Devuelve productos, con filtros opcionales de categoría, búsqueda y orden. */
export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  let result = [...products];

  if (query.category && query.category !== "todos") {
    result = result.filter((p) => p.categorySlug === query.category);
  }

  if (query.search) {
    const term = query.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags?.some((t) => t.toLowerCase().includes(term)),
    );
  }

  switch (query.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return delay(result);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return delay(products.filter((p) => p.featured).slice(0, limit));
}

export async function getNewProducts(limit = 4): Promise<Product[]> {
  return delay(products.filter((p) => p.isNew).slice(0, limit));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return delay(products.find((p) => p.slug === slug) ?? null);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return delay(
    products
      .filter(
        (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
      )
      .slice(0, limit),
  );
}

export async function getCategories(): Promise<Category[]> {
  return delay(categories);
}
