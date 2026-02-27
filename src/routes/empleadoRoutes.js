const express = require("express");
const router = express.Router();

const { getEmpleados, postEmpleado } = require("../controllers/empleadoController");

// Si ya proteges otras rutas con middleware, lo enchufamos aquí luego.
// router.use(authMiddleware);

router.get("/", getEmpleados);
router.post("/", postEmpleado);

module.exports = router;