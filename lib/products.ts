import type { Category, Product } from "@/lib/types";

// ---------------------------------------------------------------------------
// CAPA DE DATOS (conectada al backend Express + MongoDB)
//
// Todas las páginas consumen los productos a través de las funciones
// `async` de más abajo (getProducts, getProductBySlug, etc.). Antes este
// archivo tenía un array hardcodeado; ahora esas mismas funciones piden los
// datos reales a la API (POST/GET /api/productos del backend).
//
// Las categorías se mantienen fijas acá: la cátedra no pidió una entidad
// "Categoría" en la base de datos, así que no tiene sentido pedirla al
// backend (el campo `categoria` de cada producto es solo un string).
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

// Forma en la que el backend (models/producto.js) devuelve cada producto.
type ProductoAPI = {
  _id: string;
  id_producto: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  compareAtPrice?: number;
  categoria: string;
  slug?: string;
  image?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviewsCount?: number;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  tags?: string[];
};

// Adapta el documento de Mongo (español, id_producto) al tipo `Product`
// que ya consume toda la UI (inglés, id).
function mapProducto(doc: ProductoAPI): Product {
  return {
    id: doc.id_producto,
    slug: doc.slug ?? doc.id_producto,
    name: doc.nombre,
    description: doc.descripcion ?? "",
    price: doc.precio,
    compareAtPrice: doc.compareAtPrice,
    categorySlug: doc.categoria,
    image: doc.image ?? "",
    images: doc.images,
    colors: doc.colors ?? [],
    sizes: (doc.sizes as Product["sizes"]) ?? [],
    rating: doc.rating ?? 0,
    reviewsCount: doc.reviewsCount ?? 0,
    stock: doc.stock,
    featured: doc.featured,
    isNew: doc.isNew,
    tags: doc.tags,
  };
}

// Pide todos los productos al backend. `next: { revalidate: 60 }` cachea la
// respuesta 60s en el servidor de Next, para no pegarle a la API en cada
// render.
async function fetchAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/productos`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("[products] Error al pedir productos:", res.status);
      return [];
    }

    const data: ProductoAPI[] = await res.json();
    return data.map(mapProducto);
  } catch (error) {
    console.error("[products] No se pudo conectar con el backend:", error);
    return [];
  }
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
  let result = await fetchAllProducts();

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

  return result;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getNewProducts(limit = 4): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products.filter((p) => p.isNew).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const products = await fetchAllProducts();
  return products
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
    )
    .slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}
