"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  MinusSignIcon,
  Delete02Icon,
  ShoppingCart01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST = 6990;

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
          <HugeiconsIcon
            icon={ShoppingCart01Icon}
            className="text-muted-foreground size-7"
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Tu carrito está vacío
        </h1>
        <p className="text-muted-foreground">
          Todavía no agregaste productos. Explorá el catálogo y encontrá algo
          para vos.
        </p>
        <Button asChild size="lg" data-icon="inline-end">
          <Link href="/catalogo">
            Ir al catálogo
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Link>
        </Button>
      </div>
    );
  }

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Mi carrito</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          data-icon="inline-start"
        >
          <HugeiconsIcon icon={Delete02Icon} />
          Vaciar
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lista de items */}
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={`${item.product.id}-${item.size}-${item.color}`}>
              <Card>
                <CardContent className="flex gap-4">
                  <Link
                    href={`/catalogo/${item.product.slug}`}
                    className="bg-muted relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/catalogo/${item.product.slug}`}
                          className="hover:text-primary font-medium transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-muted-foreground text-sm">
                          Talle {item.size} · {item.color}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Quitar"
                        onClick={() =>
                          removeItem(item.product.id, item.size, item.color)
                        }
                      >
                        <HugeiconsIcon icon={Delete02Icon} />
                      </Button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="border-border flex items-center rounded-4xl border">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Restar"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                        >
                          <HugeiconsIcon icon={MinusSignIcon} />
                        </Button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Sumar"
                          disabled={item.quantity >= item.product.stock}
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity + 1,
                            )
                          }
                        >
                          <HugeiconsIcon icon={PlusSignIcon} />
                        </Button>
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        {/* Resumen */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Código de descuento"
                  aria-label="Código de descuento"
                />
                <Button variant="outline">Aplicar</Button>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-muted-foreground text-xs">
                  Te faltan {formatPrice(SHIPPING_THRESHOLD - subtotal)} para el
                  envío gratis.
                </p>
              )}
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                asChild
                size="lg"
                className="w-full"
                data-icon="inline-end"
              >
                <Link href="/checkout">
                  Finalizar compra
                  <HugeiconsIcon icon={ArrowRight01Icon} />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/catalogo">Seguir comprando</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
