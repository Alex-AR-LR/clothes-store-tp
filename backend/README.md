# Tienda Virtual — Backend (BD II)

Backend en Node.js + Express + MongoDB (Mongoose) para el TP de la cátedra Base de Datos II.

## 1. Instalación

```bash
cd tienda-virtual
npm install
cp .env.example .env   # completá MONGO_URI si usás Atlas u otro host
npm run dev             # o "npm start"
```

El servidor levanta por defecto en `http://localhost:4000`.

## 2. Estructura

```
tienda-virtual/
├── config/db.js            # Conexión a MongoDB
├── models/
│   ├── producto.js
│   ├── cliente.js
│   └── pedido.js            # Documento denormalizado (embebe cliente + productos)
├── routes/
│   ├── productos.js
│   ├── clientes.js
│   ├── pedidos.js
│   └── informes.js
├── controllers/
│   └── informes.js          # Agregaciones ($unwind, $group)
├── .env.example
└── server.js
```

## 3. Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/productos` | Crear producto |
| GET | `/api/productos?categoria=remeras` | Listar (con filtro opcional) |
| GET | `/api/productos/:id` | Detalle por `_id` o `id_producto` |
| POST | `/api/clientes` | Crear cliente |
| GET | `/api/clientes` | Listar clientes |
| GET | `/api/clientes/:id` | Detalle por `_id` o `id_cliente` |
| POST | `/api/pedidos` | Crear pedido (descuenta stock automáticamente) |
| GET | `/api/pedidos/cliente/:id_cliente` | Pedidos de un cliente |
| PUT | `/api/pedidos/:id/estado` | Actualizar estado (`pendiente` \| `enviado` \| `entregado`) |
| GET | `/api/informes/ventas-por-producto` | Unidades e ingresos por producto |
| GET | `/api/informes/ventas-por-mes` | Facturación mensual |

## 4. Integración con el frontend (Next.js — checkout)

El checkout del frontend (`app/checkout/page.tsx`) recolecta datos de contacto/envío y
el carrito (`components/cart/cart-store.ts`) guarda `product`, `quantity`, `size`, `color`.
El body que el frontend debe enviar a `POST /api/pedidos` tiene que verse así:

```json
{
  "cliente": {
    "id_cliente": "cli-001",
    "nombre": "Ana Gómez",
    "correo": "ana.gomez@example.com",
    "telefono": "+54 9 380 4555555",
    "direccion": "Av. Siempre Viva 742, La Rioja"
  },
  "productos": [
    {
      "id_producto": "1",
      "nombre": "Remera Oversize de Algodón",
      "precio_unitario": 18990,
      "cantidad": 2,
      "talle": "M",
      "color": "Negro"
    },
    {
      "id_producto": "2",
      "nombre": "Buzo Canguro con Frisa",
      "precio_unitario": 34990,
      "cantidad": 1,
      "talle": "L",
      "color": "Gris"
    }
  ]
}
```

Notas importantes:

- `id_producto` debe coincidir con el `id_producto` ya cargado en la colección `productos`
  (en el mock del frontend, `product.id` es un string simple como `"1"`, `"2"`, etc.).
- `talle` y `color` son **opcionales**: no forman parte del mínimo pedido por la consigna
  de la cátedra, pero se aceptan porque el carrito real del frontend los maneja.
- El campo `total` **no** se envía: el backend lo calcula sumando `precio_unitario × cantidad`
  de cada línea, para no confiar en un total calculado del lado del cliente.
- Si algún `id_producto` no existe o no tiene stock suficiente, la API responde `400` y
  no se crea el pedido (se revierte cualquier descuento de stock ya aplicado).
- Respuesta esperada: `201` con el documento del pedido creado (incluye `_id`, `estado: "pendiente"`,
  `fecha_pedido` y `total` calculados por el servidor).

Ejemplo de fetch desde el frontend:

```ts
const res = await fetch(`${process.env.API_URL}/api/pedidos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ cliente, productos }),
});

if (!res.ok) {
  const { error } = await res.json();
  throw new Error(error);
}

const pedidoCreado = await res.json();
```
