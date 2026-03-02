const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { authenticateToken } = require('../utils/token');

router.use(authenticateToken);

router.get('/', proveedorController.getAll);
router.post('/', proveedorController.create);
router.put('/:id', proveedorController.update);
router.delete('/:id', proveedorController.remove);

module.exports = router;
