const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/token');
const { crear, listar, actualizarEstado, eliminar } = require('../controllers/consultaController');

// Middleware: solo admin (id_rol 1) y empleado (id_rol 2)
const soloStaff = (req, res, next) => {
  if (req.user.id_rol !== 1 && req.user.id_rol !== 2) {
    return res.status(403).json({ error: 'Acceso restringido al personal.' });
  }
  next();
};

// Middleware: solo admin (id_rol 1)
const soloAdmin = (req, res, next) => {
  if (req.user.id_rol !== 1) {
    return res.status(403).json({ error: 'Acceso restringido al administrador.' });
  }
  next();
};

// POST /api/consultas — cualquier usuario autenticado
router.post('/', authenticateToken, crear);

// GET /api/consultas — solo staff
router.get('/', authenticateToken, soloStaff, listar);

// PATCH /api/consultas/:id/estado — solo staff
router.patch('/:id/estado', authenticateToken, soloStaff, actualizarEstado);

// DELETE /api/consultas/:id — solo admin
router.delete('/:id', authenticateToken, soloAdmin, eliminar);

module.exports = router;
