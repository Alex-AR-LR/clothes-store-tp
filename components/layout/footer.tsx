import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  InstagramIcon,
  FacebookIcon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  DeliveryTruck01Icon,
  ReturnRequestIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const shopLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?category=remeras", label: "Remeras" },
  { href: "/catalogo?category=buzos", label: "Buzos" },
  { href: "/catalogo?category=camperas", label: "Camperas" },
];

const helpLinks = [
  { href: "/contacto", label: "Contacto" },
  { href: "/carrito", label: "Mi carrito" },
  { href: "/checkout", label: "Checkout" },
];

const benefits = [
  {
    icon: DeliveryTruck01Icon,
    title: "Envío gratis",
    text: "En compras desde $50.000",
  },
  { icon: ReturnRequestIcon, title: "Cambios fáciles", text: "Hasta 30 días" },
  {
    icon: SecurityCheckIcon,
    title: "Pago seguro",
    text: "Protegemos tus datos",
  },
];

export function Footer() {
  return (
    <footer className="border-border bg-muted/30 mt-auto border-t">
      {/* Beneficios */}
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {benefits.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <div className="bg-background text-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
              <HugeiconsIcon icon={b.icon} className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{b.title}</p>
              <p className="text-muted-foreground text-sm">{b.text}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* Marca */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <HugeiconsIcon icon={ShoppingBag01Icon} className="size-5" />
            URBANA
          </Link>
          <p className="text-muted-foreground text-sm">
            Indumentaria urbana para todos los días. Calidad, comodidad y estilo
            a precios justos.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Instagram"
              asChild
            >
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <HugeiconsIcon icon={InstagramIcon} />
              </a>
            </Button>
            <Button variant="outline" size="icon" aria-label="Facebook" asChild>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <HugeiconsIcon icon={FacebookIcon} />
              </a>
            </Button>
          </div>
        </div>

        {/* Tienda */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Tienda</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            {shopLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ayuda */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Ayuda</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            {helpLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} className="size-4" />
              Av. Siempre Viva 742, CABA
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={Call02Icon} className="size-4" />
              +54 11 5555-5555
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} className="size-4" />
              hola@urbana.com
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Newsletter</h3>
          <p className="text-muted-foreground text-sm">
            Suscribite y recibí novedades y descuentos.
          </p>
          <form className="flex gap-2" action="#">
            <Input
              type="email"
              placeholder="Tu email"
              aria-label="Email"
              required
            />
            <Button type="submit">Enviar</Button>
          </form>
        </div>
      </div>

      <Separator />

      <div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} URBANA. Trabajo práctico universitario.
        </p>
        <p>Hecho con Next.js, TailwindCSS y shadcn/ui.</p>
      </div>
    </footer>
  );
}
