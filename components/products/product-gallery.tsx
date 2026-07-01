"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [""];

  return (
    <div className="flex flex-col gap-3">
      <div className="border-border bg-muted relative aspect-4/5 overflow-hidden rounded-2xl border">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                "bg-muted relative aspect-square w-20 overflow-hidden rounded-xl border transition-colors",
                i === active
                  ? "border-primary"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
