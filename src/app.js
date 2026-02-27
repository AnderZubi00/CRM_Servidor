const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productoRoutes = require('./routes/productoRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const Categoria = require('./models/Categoria');
const Proveedor = require('./models/Proveedor');
// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});
// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/empleados', empleadoRoutes);

// Lookups: Categorías y Proveedores (para selects del frontend)
app.get('/api/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.findAll({ order: [['nombre', 'ASC']] });
    res.json(categorias);
  } catch (e) {
    console.error('Error /api/categorias:', e);
    res.status(500).json({ message: 'Error cargando categorías' });
  }
});

app.get('/api/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({ order: [['nombre', 'ASC']] });
    res.json(proveedores);
  } catch (e) {
    console.error('Error /api/proveedores:', e);
    res.status(500).json({ message: 'Error cargando proveedores' });
  }
});

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

