const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../utils/token');

// POST /api/auth/login - Inicio de sesión
router.post('/login', authController.login);

// GET /api/auth/verify - Verificar token actual
router.get('/verify', authenticateToken, authController.verifyAuth);

module.exports = router;

