"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";

import type { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/products/rating";
import { useCart } from "@/components/cart/cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === 0;

  function handleAdd() {
    addItem(product);
    toast.success("Agregado al carrito", {
      description: `${product.name} · ${product.sizes[0]} · ${product.colors[0]}`,
    });
  }

  return (
    <Card className="group/card overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link href={`/catalogo/${product.slug}`} className="relative block">
        <div className="bg-muted relative aspect-4/5 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-300 group-hover/card:scale-105",
              soldOut && "opacity-60",
            )}
          />
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge>Nuevo</Badge>}
          {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
          {soldOut && <Badge variant="secondary">Agotado</Badge>}
        </div>
      </Link>

      <CardContent className="space-y-1.5">
        <Rating value={product.rating} reviewsCount={product.reviewsCount} />
        <Link
          href={`/catalogo/${product.slug}`}
          className="hover:text-primary line-clamp-1 font-medium transition-colors"
        >
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-muted-foreground text-sm line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleAdd}
          disabled={soldOut}
          className="w-full"
          data-icon="inline-start"
        >
          <HugeiconsIcon icon={ShoppingCart01Icon} />
          {soldOut ? "Sin stock" : "Agregar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
