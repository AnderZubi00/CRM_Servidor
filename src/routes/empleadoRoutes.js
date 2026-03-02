<<<<<<< HEAD
const express = require("express");
const router = express.Router();

const { getEmpleados, postEmpleado } = require("../controllers/empleadoController");

// Si ya proteges otras rutas con middleware, lo enchufamos aquí luego.
// router.use(authMiddleware);

router.get("/", getEmpleados);
router.post("/", postEmpleado);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const { authenticateToken } = require('../utils/token');

router.use(authenticateToken);

router.get('/', empleadoController.getAll);

module.exports = router;
>>>>>>> 6900e28 ([TFG-5]Añadir funcionalidad de creacion de productos)
