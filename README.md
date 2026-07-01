# URBANA · Tienda de ropa

Frontend de una tienda de ropa online desarrollado como trabajo práctico
universitario. Construido con **Next.js (App Router)**, **TailwindCSS** y
**shadcn/ui**.

Este repositorio contiene la **capa de frontend/diseño**. Está preparado para
que el equipo de backend/base de datos conecte una API real con cambios
mínimos y localizados (ver [Integración con backend](#integración-con-backend)).

## Stack

- **Next.js 16** (App Router, React Server Components).
- **React 19**.
- **TailwindCSS 4** para estilos y layout.
- **shadcn/ui** (estilo `radix-maia`) como librería de componentes base.
- **Hugeicons** para iconografía.
- **Sonner** para notificaciones (toasts).

## Cómo correr el proyecto

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:3000
```

Otros scripts:

```bash
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint     # ESLint
```

## Estructura de carpetas

```
app/                        # Rutas (App Router). Cada carpeta = una ruta.
├── layout.tsx              # Layout raíz: Navbar + Footer + providers globales
├── page.tsx                # Home
├── globals.css             # Estilos globales y tema (tokens de color)
├── catalogo/
│   ├── page.tsx            # Catálogo (grilla + filtros/orden/búsqueda por URL)
│   └── [slug]/
│       └── page.tsx        # Detalle de producto (ruta dinámica)
├── carrito/page.tsx        # Carrito de compras
├── checkout/page.tsx       # Checkout (formulario + resumen)
└── contacto/page.tsx       # Contacto (formulario + datos)

components/
├── ui/                     # Componentes de shadcn/ui (button, card, input, ...)
├── layout/
│   ├── navbar.tsx          # Barra de navegación reutilizable (con menú mobile)
│   └── footer.tsx          # Pie de página reutilizable
├── products/
│   ├── product-card.tsx    # Tarjeta de producto (con "Agregar al carrito")
│   ├── product-grid.tsx    # Grilla de productos + estado vacío
│   ├── product-gallery.tsx # Galería de imágenes del detalle
│   ├── product-purchase.tsx# Selector de talle/color/cantidad + acciones
│   ├── catalog-controls.tsx# Buscador + filtro por categoría + orden
│   └── rating.tsx          # Estrellas de calificación
└── cart/
    ├── cart-store.ts       # Estado del carrito (store externo)  ← punto de integración
    └── cart-provider.tsx   # Hook useCart() (useSyncExternalStore)

lib/
├── types.ts                # Tipos de dominio (Product, CartItem, Category)
├── format.ts               # Formato de precios (ARS) y descuentos
├── utils.ts                # Helper cn() (clsx + tailwind-merge)
└── data/
    └── products.ts         # DATOS MOCK + accesores async  ← punto de integración
```

## Páginas incluidas

| Ruta               | Descripción                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `/`                | Home: hero, categorías, destacados, banner promo, nuevos ingresos. |
| `/catalogo`        | Listado con búsqueda, filtro por categoría y orden (vía URL).      |
| `/catalogo/[slug]` | Detalle: galería, selección de talle/color/cantidad, relacionados. |
| `/carrito`         | Carrito editable con resumen de compra y cálculo de envío.         |
| `/checkout`        | Formulario de contacto/envío/pago + resumen y confirmación.        |
| `/contacto`        | Formulario de contacto e información de la tienda.                 |

## Decisiones de diseño

- **Layout global (`app/layout.tsx`)**: define el marco de toda la app. Incluye
  el `Navbar` y el `Footer` reutilizables (implementados con componentes de
  shadcn/ui) y los providers globales (`TooltipProvider`, `Toaster` y
  `CartProvider`). Al vivir en el layout raíz, evita duplicación y garantiza
  consistencia visual en todas las páginas.
- **Prioridad a shadcn/ui**: la UI se arma con `Button`, `Card`, `Input`,
  `Label`, `Textarea`, `Select`, `Dialog`, `Sheet`, `DropdownMenu`, `Tooltip`,
  `Badge`, `Separator` y `Sonner`. Tailwind se usa solo para layout y ajustes
  puntuales.
- **Server Components por defecto**: las páginas que solo muestran datos son
  Server Components (`Home`, `Catálogo`, `Detalle`). Se usa `"use client"` solo
  donde hay interactividad (carrito, filtros, formularios).
- **Estado del carrito**: vive en un store externo (`components/cart/cart-store.ts`)
  consumido con `useSyncExternalStore`. Hoy persiste en `localStorage` para que
  la demo sea funcional sin backend.

## Integración con backend

El diseño concentra el acceso a datos en **dos archivos**. Manteniendo sus
firmas (parámetros y tipos de retorno), ningún componente de UI necesita
cambios:

### 1. Catálogo y productos → `lib/data/products.ts`

Todas las páginas consumen los productos a través de funciones `async`:

```ts
getProducts(query)        // listado con filtros (categoría, búsqueda, orden)
getFeaturedProducts(n)    // destacados para la home
getNewProducts(n)         // nuevos ingresos
getProductBySlug(slug)    // detalle de un producto
getRelatedProducts(p, n)  // relacionados
getCategories()           // categorías
```

Hoy devuelven datos mock. Para conectar la API real, reemplazá el cuerpo por
un `fetch` (o el cliente de base de datos), por ejemplo:

```ts
export async function getProducts(query = {}) {
  const params = new URLSearchParams(query as Record<string, string>);
  const res = await fetch(`${process.env.API_URL}/products?${params}`, {
    next: { revalidate: 60 }, // cache/ISR de Next.js
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json() as Promise<Product[]>;
}
```

Los **tipos de dominio** están en `lib/types.ts` (`Product`, `Category`,
`CartItem`). Conviene que la API respete esas formas (o adaptar la respuesta
dentro de estas funciones).

### 2. Carrito → `components/cart/cart-store.ts`

El carrito está aislado en un store. Para un carrito real (persistido en base
de datos o asociado a la sesión del usuario), reemplazá la lógica de
`localStorage` por llamadas a la API (`GET /cart`, `POST /cart/items`,
`DELETE /cart/items/:id`, etc.). La interfaz `useCart()` que usan los
componentes puede permanecer igual.

### 3. Formularios (checkout y contacto)

- **Checkout** (`app/checkout/page.tsx`): en el `handleSubmit` está marcado el
  punto donde enviar el pedido (`POST /orders`) con los datos del formulario y
  los items del carrito.
- **Contacto** (`app/contacto/page.tsx`): idem para el mensaje de contacto
  (`POST /contact` o un servicio de emails).

Los puntos de integración están señalados en el código con comentarios
`INTEGRACIÓN BACKEND`.

### 4. Imágenes

Las imágenes usan placeholders de `picsum.photos` (configurado en
`next.config.ts` → `images.remotePatterns`). Al tener un CDN/almacenamiento
propio, agregá su dominio ahí y actualizá las URLs en los datos.

## Notas

- Los precios se muestran en pesos argentinos (ARS) con `lib/format.ts`.
- El proyecto pasa `npm run build`, `npm run lint` y `tsc --noEmit` sin errores.
