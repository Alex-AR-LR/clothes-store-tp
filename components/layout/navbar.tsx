"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  ShoppingCart01Icon,
  ShoppingBag01Icon,
  UserCircleIcon,
  Login03Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/components/cart/cart-provider";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/carrito", label: "Carrito" },
  { href: "/checkout", label: "Checkout" },
  { href: "/contacto", label: "Contacto" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Menú mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menú"
            >
              <HugeiconsIcon icon={Menu01Icon} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={ShoppingBag01Icon} className="size-5" />
                URBANA
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(pathname, link.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <HugeiconsIcon icon={ShoppingBag01Icon} className="size-5" />
          <span className="text-base">URBANA</span>
        </Link>

        {/* Navegación desktop */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                isActive(pathname, link.href) && "bg-muted text-foreground",
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Acciones */}
        <div className="ml-auto flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Carrito"
              >
                <Link href="/carrito">
                  <HugeiconsIcon icon={ShoppingCart01Icon} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 size-5 justify-center rounded-full p-0 tabular-nums">
                      {totalItems > 9 ? "9+" : totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver carrito</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Cuenta">
                <HugeiconsIcon icon={UserCircleIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Mis pedidos</DropdownMenuItem>
              <DropdownMenuItem disabled>Favoritos</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <HugeiconsIcon icon={Login03Icon} className="size-4" />
                Iniciar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
