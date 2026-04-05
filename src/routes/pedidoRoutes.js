const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { authenticateToken } = require('../utils/token');

// Todas las rutas de pedidos requieren autenticación
router.use(authenticateToken);

// POST /api/pedidos — Crear un pedido
router.post('/', pedidoController.createPedido);

// GET /api/pedidos/todos — Todos los pedidos (solo admin/empleado)
router.get('/todos', pedidoController.getAllPedidos);

// GET /api/pedidos/mis-pedidos — Obtener pedidos del usuario autenticado
router.get('/mis-pedidos', pedidoController.getMisPedidos);

module.exports = router;
