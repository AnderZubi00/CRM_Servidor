const userService = require('../services/userService');

/**
 * Controlador para obtener todos los usuarios
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({
      error: 'Error al obtener los usuarios'
    });
  }
};

/**
 * Controlador para obtener un usuario por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    console.error('Error en getUserById:', error);
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Error al obtener el usuario'
    });
  }
};

/**
 * Controlador para crear un nuevo usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error en createUser:', error);
    if (error.message === 'El email ya está registrado') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Error al crear el usuario'
    });
  }
};

/**
 * Controlador para actualizar un usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const user = await userService.updateUser(id, userData);
    res.json({
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error en updateUser:', error);
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Error al actualizar el usuario'
    });
  }
};

/**
 * Controlador para eliminar un usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.json({
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Error al eliminar el usuario'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

