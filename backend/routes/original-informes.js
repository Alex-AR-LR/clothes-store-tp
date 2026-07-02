// controllers/informes.js
const Pedido = require("../models/pedido");

// -----------------------------------------------------------------------
// GET /api/informes/ventas-por-producto
// $unwind separa cada línea del array "productos" en un documento propio,
// para poder agruparlas por id_producto y sumar unidades e ingresos.
// -----------------------------------------------------------------------
async function ventasPorProducto(req, res) {
  try {
    const resultado = await Pedido.aggregate([
      // 1) Descompone el array "productos" en un documento por cada línea.
      { $unwind: "$productos" },

      // 2) Agrupa por id_producto, sumando cantidades e ingresos.
      {
        $group: {
          _id: "$productos.id_producto",
          nombre: { $first: "$productos.nombre" },
          unidades_vendidas: { $sum: "$productos.cantidad" },
          ingresos_generados: {
            $sum: { $multiply: ["$productos.precio_unitario", "$productos.cantidad"] },
          },
        },
      },

      // 3) Presentación: ordenar de mayor a menor ingreso y renombrar _id.
      { $sort: { ingresos_generados: -1 } },
      {
        $project: {
          _id: 0,
          id_producto: "$_id",
          nombre: 1,
          unidades_vendidas: 1,
          ingresos_generados: 1,
        },
      },
    ]);

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// -----------------------------------------------------------------------
// GET /api/informes/ventas-por-mes
// Agrupa los pedidos por año-mes de fecha_pedido para calcular la
// facturación mensual y la cantidad de pedidos de cada mes.
// -----------------------------------------------------------------------
async function ventasPorMes(req, res) {
  try {
    const resultado = await Pedido.aggregate([
      {
        $group: {
          // $dateToString arma una clave "YYYY-MM" a partir de fecha_pedido.
          _id: {
            $dateToString: { format: "%Y-%m", date: "$fecha_pedido" },
          },
          facturacion_total: { $sum: "$total" },
          cantidad_pedidos: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // orden cronológico
      {
        $project: {
          _id: 0,
          mes: "$_id",
          facturacion_total: 1,
          cantidad_pedidos: 1,
        },
      },
    ]);

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { ventasPorProducto, ventasPorMes };