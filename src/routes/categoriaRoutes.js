const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { authenticateToken } = require('../utils/token');

router.use(authenticateToken);

router.get('/', categoriaController.getAll);
router.post('/', categoriaController.create);
router.put('/:id', categoriaController.update);
router.delete('/:id', categoriaController.remove);

module.exports = router;
