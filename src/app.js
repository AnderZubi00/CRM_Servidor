const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// Asegurar que existe la carpeta de subidas
const uploadsDir = path.join(__dirname, '..', 'uploads', 'productos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Carpeta uploads/productos creada.');
}

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productoRoutes = require('./routes/productoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const { authenticateTokenHeaderOrBody } = require('./utils/token');

// Multer para subir imágenes de productos
const uploadProducto = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads', 'productos'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-');
      cb(null, `${base}-${Date.now()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Crear aplicación Express
const app = express();

// Middlewares: CORS permitiendo Authorization para que el token llegue
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Parsear JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios
// Servir archivos estáticos de imágenes de productos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});
// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta de subida: multer PRIMERO (para tener req.body.token), luego auth
app.post('/api/productos/upload-imagen', (req, res, next) => {
  uploadProducto.single('imagen')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Error al subir la imagen.' });
    }
    next();
  });
}, authenticateTokenHeaderOrBody, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha enviado ninguna imagen.' });
  }
  res.status(201).json({ url: `/uploads/productos/${req.file.filename}` });
});
app.get('/api/productos/upload-imagen', (req, res) => {
  res.json({ message: 'Ruta de subida de imágenes. Usa POST con el campo "imagen".' });
});

// Catálogo público (sin auth): ruta fuera de /api/productos para no pasar por authenticateToken
const productoController = require('./controllers/productoController');
const catalogoRouter = express.Router();
catalogoRouter.get('/', (req, res) => res.json({ message: 'Catálogo público. Use GET /api/catalogo/productos para listar productos.' }));
catalogoRouter.get('/productos', productoController.getAllProductos);
app.use('/api/catalogo', catalogoRouter);

app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/consultas', consultaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API del Backend funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

module.exports = app;

