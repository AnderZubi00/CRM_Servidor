const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
const createUser = async (userData) => {
  try {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear el usuario (la contraseña se encripta automáticamente en el hook)
    const user = await User.create(userData);
    
    // No devolver la contraseña
    const userResponse = user.toJSON();
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
    const users = await User.findAll({
      attributes: { exclude: ['contraseña'] }
    });
    return users;
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
    const user = await User.findByPk(id, {
      attributes: { exclude: ['contraseña'] }
    });
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
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
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await user.update(userData);
    
    const userResponse = user.toJSON();
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
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await user.destroy();
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

