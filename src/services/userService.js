const Usuario = require('../models/Usuario');

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
const createUser = async (userData) => {
  try {
    // Verificar si el correo ya existe
    const existingUser = await Usuario.findOne({ where: { correo: userData.correo } });
    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }

    // Crear el usuario (la contraseña se encripta automáticamente en el hook)
    const usuario = await Usuario.create(userData);
    
    // No devolver la contraseña
    const userResponse = usuario.toJSON();
    delete userResponse.contraseña;
    
    return userResponse;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
const getAllUsers = async () => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contraseña'] }
    });
    return usuarios;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene un usuario por ID
 * @param {Number} id - ID del usuario
 * @returns {Promise<Object>} Usuario encontrado
 */
const getUserById = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['contraseña'] }
    });
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    return usuario;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza un usuario
 * @param {Number} id - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
const updateUser = async (id, userData) => {
  try {
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    await usuario.update(userData);
    
    const userResponse = usuario.toJSON();
    delete userResponse.contraseña;
    
    return userResponse;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina un usuario
 * @param {Number} id - ID del usuario
 * @returns {Promise<Boolean>} True si se eliminó correctamente
 */
const deleteUser = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    await usuario.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

