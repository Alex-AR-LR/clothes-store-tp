import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type RatingProps = {
  value: number;
  reviewsCount?: number;
  className?: string;
};

/** Muestra una calificación de 0 a 5 con estrellas. */
export function Rating({ value, reviewsCount, className }: RatingProps) {
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex" aria-label={`Calificación ${value} de 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <HugeiconsIcon
            key={i}
            icon={StarIcon}
            className={cn(
              "size-3.5",
              i < rounded
                ? "fill-current text-amber-500"
                : "text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      {reviewsCount !== undefined && (
        <span className="text-muted-foreground text-xs">({reviewsCount})</span>
      )}
    </div>
  );
}
