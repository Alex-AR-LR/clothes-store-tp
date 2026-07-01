"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons";

import type { Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor calificados" },
];

export function CatalogControls({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const searchValue = params.get("search") ?? "";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "todos" && value !== "featured") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("search")?.toString() ?? "";
    setParam("search", value);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form onSubmit={onSearchSubmit} className="relative flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <Input
          key={searchValue}
          name="search"
          defaultValue={searchValue}
          placeholder="Buscar productos..."
          className="pl-9"
          aria-label="Buscar productos"
        />
      </form>

      <div className="flex items-center gap-3">
        <Select
          value={params.get("category") ?? "todos"}
          onValueChange={(v) => setParam("category", v)}
        >
          <SelectTrigger className="w-40" aria-label="Categoría">
            <HugeiconsIcon icon={FilterHorizontalIcon} className="size-4" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={params.get("sort") ?? "featured"}
          onValueChange={(v) => setParam("sort", v)}
        >
          <SelectTrigger className="w-48" aria-label="Ordenar">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
