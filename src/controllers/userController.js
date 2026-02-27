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

const createEmpleadoUser = async (req, res) => {
  const { correo, contraseña, empleado } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: "Faltan correo o contraseña" });
  }
  if (!empleado?.nombre) {
    return res.status(400).json({ error: "Falta empleado.nombre" });
  }

  try {
    const { sequelize } = require("../config/database");
    const Usuario = require("../models/Usuario");
    const Empleado = require("../models/Empleado");

    const { usuario, empleadoCreado } = await sequelize.transaction(async (t) => {
      // 1) Crear empleado
      const empleadoCreado = await Empleado.create(
        {
          nombre: empleado.nombre,
          apellido: empleado.apellido ?? null,
          telefono: empleado.telefono ?? null,
          dni: empleado.dni ?? null,
        },
        { transaction: t }
      );

      // 2) Crear usuario asociado (rol empleado = 2)
      // NOTA: la contraseña se hashea sola por hooks del modelo Usuario
      const usuario = await Usuario.create(
        {
          correo,
          contraseña,
          id_rol: 2,
          id_empleado: empleadoCreado.id_empleado,
        },
        { transaction: t }
      );

      return { usuario, empleadoCreado };
    });

    return res.status(201).json({
      empleado: empleadoCreado,
      usuario,
    });
  } catch (error) {
    console.error("❌ Error create-empleado:", error);
    return res.status(500).json({
      error: "Error al crear empleado y usuario",
      details: error?.message || null,
      sequelize: Array.isArray(error?.errors)
        ? error.errors.map((e) => ({ message: e.message, path: e.path, value: e.value }))
        : null,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createEmpleadoUser
};