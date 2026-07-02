const express = require("express");
const router = express.Router();

const {
  ventasPorProducto,
  ventasPorMes
} = require("../controllers/informes");

// rutas correctas
router.get("/ventas-por-producto", ventasPorProducto);
router.get("/ventas-por-mes", ventasPorMes);

module.exports = router;