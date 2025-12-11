const Usuario = require('../models/Usuario');
const { generateToken } = require('../utils/token');

/**
 * Controlador para el inicio de sesión
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Validar que se proporcionen correo y contraseña
    if (!correo || !contraseña) {
      return res.status(400).json({
        error: 'Correo y contraseña son requeridos'
      });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await usuario.comparePassword(contraseña);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(usuario);

    // Respuesta exitosa
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        id_rol: usuario.id_rol,
        id_empleado: usuario.id_empleado
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
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['contraseña'] }
    });

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      user: usuario,
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

