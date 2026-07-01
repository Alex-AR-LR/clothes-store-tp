import type { Metadata } from "next";
import {
  getProducts,
  getCategories,
  type ProductQuery,
} from "@/lib/data/products";
import { CatalogControls } from "@/components/products/catalog-controls";
import { ProductGrid } from "@/components/products/product-grid";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explorá todos los productos de la tienda.",
};

type SearchParams = {
  category?: string;
  search?: string;
  sort?: ProductQuery["sort"];
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, search, sort } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({ category, search, sort }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {activeCategory ? activeCategory.name : "Catálogo"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {activeCategory?.description ??
            "Todos nuestros productos en un solo lugar."}
        </p>
      </header>

      <CatalogControls categories={categories} />

      <div className="my-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      <Separator className="mb-6" />

      <ProductGrid products={products} />
    </div>
  );
}
