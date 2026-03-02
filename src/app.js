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
<<<<<<< HEAD
const empleadoRoutes = require('./routes/empleadoRoutes');
const Categoria = require('./models/Categoria');
const Proveedor = require('./models/Proveedor');
=======
const categoriaRoutes = require('./routes/categoriaRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
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
>>>>>>> 6900e28 ([TFG-5]Añadir funcionalidad de creacion de productos)

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
<<<<<<< HEAD
app.use('/api/empleados', empleadoRoutes);

// Lookups: Categorías y Proveedores (para selects del frontend)
app.get('/api/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.findAll({ order: [['id_categoria', 'ASC']] });
    res.json(categorias);
  } catch (e) {
    console.error('Error /api/categorias:', e);
    res.status(500).json({ message: 'Error cargando categorías' });
  }
});

// Crear categoría
app.post('/api/categorias', async (req, res) => {
  try {
    const nombre = (req.body?.nombre ?? '').trim();
    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
    if (nombre.length > 50) return res.status(400).json({ message: 'El nombre supera 50 caracteres' });

    const created = await Categoria.create({ nombre });
    res.status(201).json(created);
  } catch (e) {
    console.error('Error POST /api/categorias:', e);
    res.status(500).json({ message: 'Error creando categoría' });
  }
});

// Editar categoría
app.put('/api/categorias/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const nombre = (req.body?.nombre ?? '').trim();
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });
    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
    if (nombre.length > 50) return res.status(400).json({ message: 'El nombre supera 50 caracteres' });

    const cat = await Categoria.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });

    cat.nombre = nombre;
    await cat.save();
    res.json(cat);
  } catch (e) {
    console.error('Error PUT /api/categorias/:id:', e);
    res.status(500).json({ message: 'Error actualizando categoría' });
  }
});

// Eliminar categoría
app.delete('/api/categorias/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });

    const cat = await Categoria.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });

    await cat.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error('Error DELETE /api/categorias/:id:', e);

    // Si hay FK (categoría usada por productos), devolvemos conflicto
    if (e?.name?.includes('SequelizeForeignKeyConstraintError') || e?.original?.code === '23503') {
      return res.status(409).json({
        message: 'No se puede eliminar: hay productos asociados a esta categoría.'
      });
    }

    res.status(500).json({ message: 'Error eliminando categoría' });
  }
});

app.get('/api/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({ order: [['id_proveedor', 'ASC']] });
    res.json(proveedores);
  } catch (e) {
    console.error('Error /api/proveedores:', e);
    res.status(500).json({ message: 'Error cargando proveedores' });
  }
});
// Crear proveedor
app.post('/api/proveedores', async (req, res) => {
  try {
    const nombre = (req.body?.nombre ?? '').trim();
    const telefono = (req.body?.telefono ?? '').trim();
    const correo = (req.body?.correo ?? '').trim();

    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
    if (nombre.length > 50) return res.status(400).json({ message: 'El nombre supera 50 caracteres' });
    if (telefono && telefono.length > 20) return res.status(400).json({ message: 'El teléfono supera 20 caracteres' });
    if (correo && correo.length > 100) return res.status(400).json({ message: 'El correo supera 100 caracteres' });

    const created = await Proveedor.create({ nombre, telefono: telefono || null, correo: correo || null });
    res.status(201).json(created);
  } catch (e) {
    console.error('Error DELETE /api/proveedores/:id:', e);

    // Si hay FK (proveedor usado por productos), devolvemos conflicto
    if (e?.name?.includes('SequelizeForeignKeyConstraintError') || e?.original?.code === '23503') {
      return res.status(409).json({
        message: 'No se puede eliminar: hay productos asociados a este proveedor.'
      });
    }

    res.status(500).json({ message: 'Error eliminando proveedor' });
  }
});

// Editar proveedor
app.put('/api/proveedores/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const nombre = (req.body?.nombre ?? '').trim();
    const telefono = (req.body?.telefono ?? '').trim();
    const correo = (req.body?.correo ?? '').trim();

    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });
    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
    if (nombre.length > 50) return res.status(400).json({ message: 'El nombre supera 50 caracteres' });
    if (telefono && telefono.length > 20) return res.status(400).json({ message: 'El teléfono supera 20 caracteres' });
    if (correo && correo.length > 100) return res.status(400).json({ message: 'El correo supera 100 caracteres' });

    const prov = await Proveedor.findByPk(id);
    if (!prov) return res.status(404).json({ message: 'Proveedor no encontrado' });

    prov.nombre = nombre;
    prov.telefono = telefono || null;
    prov.correo = correo || null;

    await prov.save();
    res.json(prov);
  } catch (e) {
    console.error('Error PUT /api/proveedores/:id:', e);
    res.status(500).json({ message: 'Error actualizando proveedor' });
  }
});

// Eliminar proveedor
app.delete('/api/proveedores/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID inválido' });

    const prov = await Proveedor.findByPk(id);
    if (!prov) return res.status(404).json({ message: 'Proveedor no encontrado' });

    await prov.destroy();
    res.json({ ok: true });
  } catch (e) {
    console.error('Error DELETE /api/proveedores/:id:', e);

    const pgCode = e?.original?.code || e?.parent?.code; // <- clave

    // FK en Postgres = 23503
    if (pgCode === '23503' || e?.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        message: 'No se puede eliminar: hay productos asociados a este proveedor.'
      });
    }

    // Para no ir a ciegas si vuelve a fallar:
    return res.status(500).json({
      message: 'Error eliminando proveedor',
      details: e?.message,
      code: pgCode
    });
  }
});
=======
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/empleados', empleadoRoutes);
>>>>>>> 6900e28 ([TFG-5]Añadir funcionalidad de creacion de productos)

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

