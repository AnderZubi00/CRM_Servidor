const User = require('../models/User');
const { generateToken } = require('../utils/token');

/**
 * Controlador para el inicio de sesión
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Validar que se proporcionen email y contraseña
    if (!email || !contraseña) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(contraseña);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(user);

    // Respuesta exitosa
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Controlador para verificar el token actual
 * @param {Object} req - Request object (debe tener req.user del middleware)
 * @param {Object} res - Response object
 */
const verifyAuth = async (req, res) => {
  try {
    // El middleware authenticateToken ya verificó el token
    // y agregó req.user con la información del usuario
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['contraseña'] }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      user,
      message: 'Token válido'
    });
  } catch (error) {
    console.error('Error en verifyAuth:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  verifyAuth
};

