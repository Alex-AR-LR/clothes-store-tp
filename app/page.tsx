"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  CreditCardIcon,
  DeliveryTruck01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST = 6990;

const provinces = [
  "Buenos Aires",
  "CABA",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Otra",
];

const paymentMethods = [
  { id: "card", label: "Tarjeta de crédito/débito", icon: CreditCardIcon },
  { id: "cash", label: "Efectivo al recibir", icon: DeliveryTruck01Icon },
];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [payment, setPayment] = useState("card");
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "");
    const lastName = String(form.get("lastName") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const address = String(form.get("address") ?? "");
    const city = String(form.get("city") ?? "");
    const province = String(form.get("province") ?? "");
    const zip = String(form.get("zip") ?? "");

    const cliente = {
      // Usamos el email como id_cliente: es único y no necesitamos un
      // sistema de login para este TP.
      id_cliente: email.toLowerCase().trim(),
      nombre: `${firstName} ${lastName}`.trim(),
      correo: email,
      telefono: phone,
      direccion: `${address}, ${city}, ${province} (CP ${zip})`,
    };

    const productos = items.map((item) => ({
      id_producto: item.product.id,
      nombre: item.product.name,
      precio_unitario: item.product.price,
      cantidad: item.quantity,
      talle: item.size,
      color: item.color,
    }));

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/pedidos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente, productos }),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo registrar el pedido.");
      }

      clear();
      setPlaced(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo conectar con el servidor. Probá de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-muted-foreground">
          Tu pedido fue registrado correctamente. Te enviamos un email con el
          detalle y el seguimiento del envío.
        </p>
        <Button asChild size="lg">
          <Link href="/catalogo">Seguir comprando</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          No hay nada para pagar
        </h1>
        <p className="text-muted-foreground">
          Agregá productos al carrito antes de continuar con el checkout.
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

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_360px]"
      >
        <div className="flex flex-col gap-6">
          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de contacto</CardTitle>
              <CardDescription>
                Para enviarte la confirmación del pedido.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
            </CardContent>
          </Card>

          {/* Envío */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección de envío</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Calle y número"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Select name="province" defaultValue="Buenos Aires">
                  <SelectTrigger id="province" className="w-full">
                    <SelectValue placeholder="Elegí una provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Código postal</Label>
                <Input id="zip" name="zip" required />
              </div>
            </CardContent>
          </Card>

          {/* Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Método de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayment(m.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                      payment === m.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    <HugeiconsIcon icon={m.icon} className="size-5" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>

              {payment === "card" && (
                <div className="grid gap-4 pt-2 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardExp">Vencimiento</Label>
                    <Input
                      id="cardExp"
                      name="cardExp"
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      inputMode="numeric"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Tu pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex justify-between gap-2 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.quantity}× {item.product.name}
                      <span className="block text-xs">
                        Talle {item.size} · {item.color}
                      </span>
                    </span>
                    <span className="shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {error && (
                <p className="text-destructive text-center text-sm">{error}</p>
              )}
              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full"
                data-icon="inline-end"
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Confirmar pedido"}
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                Al confirmar aceptás los términos y condiciones.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
