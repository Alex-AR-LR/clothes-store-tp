// Tipos de dominio de la tienda.
// El equipo de backend debería mantener estas formas (o generarlas desde la
// base de datos) para que el frontend siga funcionando sin cambios.

export type Category = {
  slug: string;
  name: string;
  description?: string;
};

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Precio en pesos (ARS), como número entero de pesos. */
  price: number;
  /** Precio anterior, si el producto está en oferta. */
  compareAtPrice?: number;
  categorySlug: string;
  /** URL de imagen. Con placeholders mientras no haya backend/CDN. */
  image: string;
  images?: string[];
  colors: string[];
  sizes: ProductSize[];
  rating: number;
  reviewsCount: number;
  /** Stock disponible. 0 = agotado. */
  stock: number;
  /** Destacado en la home. */
  featured?: boolean;
  /** Ingresó recientemente. */
  isNew?: boolean;
  tags?: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: ProductSize;
  color: string;
};
