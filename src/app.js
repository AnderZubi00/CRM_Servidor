const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productoRoutes = require('./routes/productoRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');

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

