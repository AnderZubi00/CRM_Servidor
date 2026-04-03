const Usuario = require('../models/Usuario');
const Empleado = require('../models/Empleado');

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
/**
 * Asigna el id_rol según el correo del usuario
 * admin@gmail.com → administrador (1)
 * empleado@gmail.com → empleado (2)
 * resto → cliente (3)
 */
const asignarRolPorCorreo = (correo) => {
  const correoLower = (correo || '').toLowerCase().trim();
  if (correoLower === 'admin@gmail.com') return 1;
  if (correoLower === 'empleado@gmail.com') return 2;
  return 3; // cliente por defecto
};

const createUser = async (userData) => {
  try {
    if (!userData?.correo?.trim()) {
      throw new Error('El correo es obligatorio');
    }
    if (!userData?.contraseña) {
      throw new Error('La contraseña es obligatoria');
    }
    if (userData.contraseña.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (!userData?.nombre?.trim()) {
      throw new Error('El nombre es obligatorio');
    }
    if (!userData?.apellido?.trim()) {
      throw new Error('El apellido es obligatorio');
    }
    if (!userData?.telefono?.trim()) {
      throw new Error('El teléfono es obligatorio');
    }

    // Verificar si el correo ya existe
    const existingUser = await Usuario.findOne({ where: { correo: userData.correo.trim() } });
    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }

    // Asignar rol según correo: admin@gmail.com → admin, empleado@gmail.com → empleado, resto → cliente
    // Forzar número para evitar que llegue null/undefined desde el body
    const id_rol = Number(asignarRolPorCorreo(userData.correo)) || 3;
    const datosUsuario = {
      correo: userData.correo.trim(),
      contraseña: userData.contraseña,
      id_rol,
      nombre: userData.nombre.trim(),
      apellido: userData.apellido.trim(),
      telefono: userData.telefono.trim(),
    };
    if (userData.id_empleado != null && userData.id_empleado !== '') {
      datosUsuario.id_empleado = Number(userData.id_empleado);
    }

    // Crear el usuario (solo estos campos; no pasar userData para evitar id_rol null del body)
    const usuario = await Usuario.create(datosUsuario);
    
    // No devolver la contraseña
    const userResponse = usuario.toJSON();
    delete userResponse.contraseña;
    
    return userResponse;
  } catch (error) {
    throw error;
  }
};

/**
 * Crea un empleado en la tabla empleado y un usuario con rol empleado (id_rol=2) vinculado.
 * @param {Object} data - { correo, contraseña, empleado: { nombre, apellido?, telefono?, dni? } }
 * @returns {Promise<Object>} { empleado, user }
 */
const createUserAsEmpleado = async (data) => {
  const { correo, contraseña, empleado: empleadoData } = data || {};
  if (!correo?.trim()) throw new Error('El correo es obligatorio');
  if (!contraseña) throw new Error('La contraseña es obligatoria');
  if (contraseña.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');
  const nombre = empleadoData?.nombre?.trim();
  if (!nombre) throw new Error('El nombre del empleado es obligatorio');

  const existingUser = await Usuario.findOne({ where: { correo: correo.trim() } });
  if (existingUser) throw new Error('El correo ya está registrado');

  const empleado = await Empleado.create({
    nombre,
    apellido: empleadoData?.apellido?.trim() || null,
    telefono: empleadoData?.telefono?.trim() || null,
    dni: empleadoData?.dni?.trim() || null,
  });

  const usuario = await Usuario.create({
    correo: correo.trim(),
    contraseña,
    id_rol: 2,
    id_empleado: empleado.id_empleado,
  });

  const userResponse = usuario.toJSON();
  delete userResponse.contraseña;
  return { empleado, user: userResponse };
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
  createUserAsEmpleado,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

