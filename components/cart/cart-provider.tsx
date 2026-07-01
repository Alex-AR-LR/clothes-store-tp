"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/types";
import * as store from "@/components/cart/cart-store";

// El estado del carrito vive en un store externo (ver cart-store.ts).
// `CartProvider` se mantiene como punto de montaje por si en el futuro se
// necesita inyectar un carrito por sesión/usuario desde el backend; hoy
// simplemente renderiza a sus hijos.
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCart() {
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return useMemo(() => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    );
    return {
      items: items as CartItem[],
      totalItems,
      subtotal,
      addItem: store.addItem,
      updateQuantity: store.updateQuantity,
      removeItem: store.removeItem,
      clear: store.clear,
    };
  }, [items]);
}
