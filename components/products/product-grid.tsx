import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <p className="font-medium">No encontramos productos</p>
        <p className="text-muted-foreground text-sm">
          Probá con otra búsqueda o categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
