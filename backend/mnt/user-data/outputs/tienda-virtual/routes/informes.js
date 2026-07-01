// routes/informes.js
const express = require("express");
const router = express.Router();
const { ventasPorProducto, ventasPorMes } = require("../controllers/informes");

router.get("/ventas-por-producto", ventasPorProducto);
router.get("/ventas-por-mes", ventasPorMes);

module.exports = router;
