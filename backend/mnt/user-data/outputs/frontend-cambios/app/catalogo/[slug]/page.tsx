import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  DeliveryTruck01Icon,
  ReturnRequestIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";

import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/data/products";
import { formatPrice, discountPercent } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@/components/products/rating";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchase } from "@/components/products/product-purchase";
import { ProductGrid } from "@/components/products/product-grid";

// Prerenderiza las páginas de detalle en build, pidiendo los slugs reales
// al backend.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
  };
}

const guarantees = [
  { icon: DeliveryTruck01Icon, text: "Envío gratis desde $50.000" },
  { icon: ReturnRequestIcon, text: "Cambios hasta 30 días" },
  { icon: SecurityCheckIcon, text: "Compra 100% protegida" },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const gallery = product.images ?? [product.image];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="text-muted-foreground mb-6 flex items-center gap-1 text-sm">
        <Button variant="ghost" size="sm" asChild data-icon="inline-start">
          <Link href="/catalogo">
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            Volver al catálogo
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={gallery} alt={product.name} />

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {product.isNew && <Badge>Nuevo</Badge>}
              {discount > 0 && (
                <Badge variant="destructive">-{discount}% OFF</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary">Agotado</Badge>
              )}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <Rating
              value={product.rating}
              reviewsCount={product.reviewsCount}
            />
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-muted-foreground text-lg line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground text-pretty">
            {product.description}
          </p>

          <Separator />

          <ProductPurchase product={product} />

          <Separator />

          <ul className="grid gap-3 sm:grid-cols-3">
            {guarantees.map((g) => (
              <li
                key={g.text}
                className="text-muted-foreground flex items-center gap-2 text-sm"
              >
                <HugeiconsIcon
                  icon={g.icon}
                  className="text-foreground size-5"
                />
                {g.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            También te puede gustar
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
