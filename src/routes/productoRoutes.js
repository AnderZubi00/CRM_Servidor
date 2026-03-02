const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();
const productoController = require('../controllers/productoController');
const { authenticateToken } = require('../utils/token');

// Configuración de multer para subir imágenes de productos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'productos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-');
    const unique = Date.now();
    cb(null, `${base}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Endpoint para subir imagen de producto
router.post('/upload-imagen', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha enviado ninguna imagen.' });
  }
  // URL relativa que el frontend puede usar directamente
  const url = `/uploads/productos/${req.file.filename}`;
  res.status(201).json({ url });
});

// GET /api/productos - Obtener todos los productos
router.get('/', productoController.getAllProductos);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', productoController.getProductoById);

// POST /api/productos/nuevo - Crear un nuevo producto
router.post('/nuevo', productoController.createProducto);

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', productoController.updateProducto);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', productoController.deleteProducto);

module.exports = router;

