// ---------------------------------------------------------------------------
// STORE DEL CARRITO (externo, del lado del cliente)
//
// Implementado como un store externo compatible con `useSyncExternalStore`.
// Guarda el carrito en memoria + localStorage para que la demo sea funcional
// sin backend.
//
// INTEGRACIÓN CON BACKEND:
//   Este archivo es el ÚNICO lugar a tocar para conectar el carrito real.
//   Reemplazá la persistencia en localStorage por llamadas a la API
//   (POST /cart/items, DELETE /cart/items/:id, GET /cart, etc.) o por un
//   carrito asociado a la sesión del usuario. La interfaz `useCart()` que
//   consumen los componentes puede permanecer igual.
// ---------------------------------------------------------------------------

import type { CartItem, Product, ProductSize } from "@/lib/types";

const STORAGE_KEY = "clothes-store-cart";

// Snapshot estable para el render del servidor (SSR) y la hidratación.
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Sin persistencia disponible: seguimos con estado en memoria.
  }
}

function loadOnce() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw) as CartItem[];
  } catch {
    // Ignorar datos corruptos.
  }
}

function sameLine(
  a: CartItem,
  productId: string,
  size: ProductSize,
  color: string,
) {
  return a.product.id === productId && a.size === size && a.color === color;
}

// --- API de suscripción (para useSyncExternalStore) ---

export function subscribe(listener: () => void) {
  // Cargamos desde localStorage en el primer suscriptor (solo en el cliente).
  if (!loaded) {
    loadOnce();
    emit();
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return items;
}

export function getServerSnapshot() {
  return EMPTY;
}

// --- Mutaciones ---

export function addItem(
  product: Product,
  options?: { size?: ProductSize; color?: string; quantity?: number },
) {
  const size = options?.size ?? product.sizes[0];
  const color = options?.color ?? product.colors[0];
  const quantity = options?.quantity ?? 1;

  const existing = items.find((i) => sameLine(i, product.id, size, color));
  if (existing) {
    items = items.map((i) =>
      sameLine(i, product.id, size, color)
        ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
        : i,
    );
  } else {
    items = [...items, { product, size, color, quantity }];
  }
  persist();
  emit();
}

export function updateQuantity(
  productId: string,
  size: ProductSize,
  color: string,
  quantity: number,
) {
  items = items
    .map((i) =>
      sameLine(i, productId, size, color)
        ? { ...i, quantity: Math.max(0, Math.min(quantity, i.product.stock)) }
        : i,
    )
    .filter((i) => i.quantity > 0);
  persist();
  emit();
}

export function removeItem(
  productId: string,
  size: ProductSize,
  color: string,
) {
  items = items.filter((i) => !sameLine(i, productId, size, color));
  persist();
  emit();
}

export function clear() {
  items = EMPTY;
  persist();
  emit();
}
