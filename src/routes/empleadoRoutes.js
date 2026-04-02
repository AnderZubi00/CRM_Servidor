const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const { authenticateToken } = require('../utils/token');

router.use(authenticateToken);

router.get('/', empleadoController.getAll);

module.exports = router;
