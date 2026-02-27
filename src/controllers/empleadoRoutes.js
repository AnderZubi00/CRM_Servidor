const express = require("express");
const router = express.Router();

const { getEmpleados, postEmpleado } = require("../controllers/empleadoController");

// Si tu proyecto usa middleware de auth para proteger, lo enchufamos aquí.
// Ejemplo:
// const { authMiddleware } = require("../middlewares/auth");
// router.use(authMiddleware);

router.get("/", getEmpleados);
router.post("/", postEmpleado);

module.exports = router;