const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../utils/token');

// POST /api/users/register - Ruta pública para registro (sin autenticación)
router.post('/register', userController.createUser);

// Todas las demás rutas requieren autenticación
router.use(authenticateToken);

// GET /api/users - Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', userController.getUserById);

// POST /api/users/create - Crear un nuevo usuario (requiere autenticación)
router.post('/create', userController.createUser);

// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', userController.deleteUser);

module.exports = router;

