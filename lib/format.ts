// Utilidades de formato compartidas por toda la UI.

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** Formatea un precio en ARS: 24990 -> "$ 24.990". */
export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

/** Porcentaje de descuento entre precio de lista y precio actual. */
export function discountPercent(
  price: number,
  compareAtPrice?: number,
): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
