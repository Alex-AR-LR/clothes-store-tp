import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  SparklesIcon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons";

import {
  getFeaturedProducts,
  getNewProducts,
  getCategories,
} from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/products/product-grid";

export default async function HomePage() {
  const [featured, news, categories] = await Promise.all([
    getFeaturedProducts(4),
    getNewProducts(4),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-16 py-8 sm:gap-20 sm:py-12">
      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-border bg-muted relative overflow-hidden rounded-3xl border">
          <Image
            src="https://picsum.photos/seed/urbana-hero/1600/900"
            alt="Colección temporada"
            width={1600}
            height={900}
            priority
            className="h-full max-h-130 w-full object-cover"
          />
          <div className="from-background/90 via-background/60 absolute inset-0 bg-linear-to-r to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center gap-4 p-8 sm:p-12 lg:p-16">
            <Badge
              variant="secondary"
              className="w-fit gap-1"
              data-icon="inline-start"
            >
              <HugeiconsIcon icon={SparklesIcon} />
              Nueva temporada 2026
            </Badge>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Estilo urbano para todos los días
            </h1>
            <p className="text-muted-foreground max-w-md text-pretty">
              Descubrí nuestra colección de remeras, buzos, pantalones y más.
              Calidad y comodidad al mejor precio.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild data-icon="inline-end">
                <Link href="/catalogo">
                  Ver catálogo
                  <HugeiconsIcon icon={ArrowRight01Icon} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/catalogo?category=camperas">Ver camperas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Categorías
            </h2>
            <p className="text-muted-foreground text-sm">
              Elegí por tipo de prenda
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild data-icon="inline-end">
            <Link href="/catalogo">
              Ver todo
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalogo?category=${category.slug}`}
            >
              <Card className="group h-full overflow-hidden pt-0 transition-shadow hover:shadow-md">
                <div className="bg-muted relative aspect-square overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/cat-${category.slug}/400/400`}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="text-center">
                  <p className="font-medium">{category.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Destacados
            </h2>
            <p className="text-muted-foreground text-sm">
              Los favoritos de la tienda
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild data-icon="inline-end">
            <Link href="/catalogo">
              Ver más
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </Link>
          </Button>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Banner promo */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
            <div className="bg-primary-foreground/10 flex size-12 shrink-0 items-center justify-center rounded-full">
              <HugeiconsIcon icon={DeliveryTruck01Icon} className="size-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">
                Envío gratis en compras desde $50.000
              </p>
              <p className="text-primary-foreground/80 text-sm">
                Recibí tu pedido en 24/48hs en todo el país.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Nuevos ingresos */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Nuevos ingresos
          </h2>
          <p className="text-muted-foreground text-sm">Lo último que sumamos</p>
        </div>
        <ProductGrid products={news} />
      </section>
    </div>
  );
}
