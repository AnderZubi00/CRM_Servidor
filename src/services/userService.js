const Usuario = require('../models/Usuario');
const Empleado = require('../models/Empleado');
const Cliente = require('../models/Cliente');
const { sequelize } = require('../config/database');

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

    // Todo usuario nuevo empieza como cliente → crear registro en tabla cliente
    await Cliente.findOrCreate({
      where: { correo: datosUsuario.correo },
      defaults: {
        nombre: datosUsuario.nombre || datosUsuario.correo.split('@')[0],
        apellido: datosUsuario.apellido || null,
        telefono: datosUsuario.telefono || null,
        correo: datosUsuario.correo,
      },
    });

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
 * Actualiza un usuario y sincroniza las tablas cliente/empleado si cambia el rol.
 * @param {Number} id - ID del usuario
 * @param {Object} userData - Datos a actualizar (puede incluir id_rol)
 * @returns {Promise<Object>} Usuario actualizado
 */
const updateUser = async (id, userData) => {
  const t = await sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(id, { transaction: t });
    if (!usuario) throw new Error('Usuario no encontrado');

    const oldRol = Number(usuario.id_rol);
    const newRol = userData.id_rol != null ? Number(userData.id_rol) : oldRol;
    const rolCambia = newRol !== oldRol;

    if (rolCambia) {
      // ── A. Limpiar tabla de origen ──────────────────────────────────────
      if (oldRol === 3) {
        // Era cliente → eliminar de tabla cliente
        await Cliente.destroy({ where: { correo: usuario.correo }, transaction: t });
      } else if (oldRol === 2 && usuario.id_empleado) {
        // Era empleado → eliminar registro de empleado y limpiar FK
        await Empleado.destroy({ where: { id_empleado: usuario.id_empleado }, transaction: t });
        userData.id_empleado = null;
      }

      // ── B. Crear registro en tabla destino ──────────────────────────────
      if (newRol === 3) {
        // Nuevo cliente → crear en tabla cliente
        await Cliente.findOrCreate({
          where: { correo: usuario.correo },
          defaults: {
            nombre: userData.nombre || usuario.nombre || usuario.correo.split('@')[0],
            apellido: userData.apellido || usuario.apellido || null,
            telefono: userData.telefono || usuario.telefono || null,
            correo: usuario.correo,
          },
          transaction: t,
        });
      } else if (newRol === 2) {
        // Nuevo empleado → crear en tabla empleado y vincular en usuario
        const empleado = await Empleado.create({
          nombre: userData.nombre || usuario.nombre || usuario.correo.split('@')[0],
          apellido: userData.apellido || usuario.apellido || null,
          telefono: userData.telefono || usuario.telefono || null,
          dni: null,
        }, { transaction: t });
        userData.id_empleado = empleado.id_empleado;
      } else if (newRol === 1) {
        // Admin → sin tabla propia, limpiar FK de empleado si la hubiera
        userData.id_empleado = null;
      }
    }

    await usuario.update(userData, { transaction: t });
    await t.commit();

    const userResponse = usuario.toJSON();
    delete userResponse.contraseña;
    return userResponse;
  } catch (error) {
    await t.rollback();
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

