"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart01Icon,
  PlusSignIcon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";

import type { Product, ProductSize } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart/cart-provider";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<ProductSize>(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock === 0;

  function handleAdd() {
    addItem(product, { size, color, quantity });
    toast.success("Agregado al carrito", {
      description: `${product.name} · Talle ${size} · ${color} · x${quantity}`,
    });
  }

  return (
    <div className="space-y-6">
      {/* Talle */}
      <div className="space-y-2">
        <Label>Talle</Label>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <Button
              key={s}
              type="button"
              variant={s === size ? "default" : "outline"}
              size="icon"
              onClick={() => setSize(s)}
              className={cn("w-11", s === size && "ring-ring/40 ring-2")}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <Button
              key={c}
              type="button"
              variant={c === color ? "secondary" : "outline"}
              size="sm"
              onClick={() => setColor(c)}
              className={cn(c === color && "ring-ring/40 ring-2")}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {/* Cantidad */}
      <div className="space-y-2">
        <Label>Cantidad</Label>
        <div className="flex items-center gap-3">
          <div className="border-border flex items-center rounded-4xl border">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Restar"
            >
              <HugeiconsIcon icon={MinusSignIcon} />
            </Button>
            <span className="w-8 text-center text-sm tabular-nums">
              {quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              aria-label="Sumar"
            >
              <HugeiconsIcon icon={PlusSignIcon} />
            </Button>
          </div>
          <span className="text-muted-foreground text-sm">
            {soldOut ? "Sin stock" : `${product.stock} disponibles`}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          onClick={handleAdd}
          disabled={soldOut}
          className="flex-1"
          data-icon="inline-start"
        >
          <HugeiconsIcon icon={ShoppingCart01Icon} />
          {soldOut ? "Sin stock" : "Agregar al carrito"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          asChild
          disabled={soldOut}
          className="flex-1"
        >
          <Link href="/checkout">Comprar ahora</Link>
        </Button>
      </div>
    </div>
  );
}
