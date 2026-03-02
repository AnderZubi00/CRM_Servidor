<<<<<<< HEAD
const Empleado = require("../models/Empleado");

const getAllEmpleados = async () => {
  return await Empleado.findAll({ order: [["id_empleado", "DESC"]] });
};

const createEmpleado = async (data) => {
  const payload = {
    nombre: data.nombre,
    apellido: data.apellido ?? null,
    telefono: data.telefono ?? null,
    dni: data.dni ?? null,
  };

  return await Empleado.create(payload);
};

module.exports = {
  getAllEmpleados,
  createEmpleado,
};
=======
const Empleado = require('../models/Empleado');
const Usuario = require('../models/Usuario');

/**
 * Lista todos los empleados.
 * Primero devuelve las filas de la tabla empleado.
 * Si no hay ninguna, devuelve los usuarios con rol empleado (id_rol=2) con sus datos de empleado si existen.
 */
const getAll = async () => {
  const empleadosFromTable = await Empleado.findAll({
    order: [['id_empleado', 'ASC']],
  });
  if (empleadosFromTable.length > 0) {
    return empleadosFromTable.map((e) => e.get({ plain: true }));
  }
  const usuariosEmpleado = await Usuario.findAll({
    where: { id_rol: 2 },
    include: [
      { model: Empleado, as: 'empleado', required: false, attributes: ['id_empleado', 'nombre', 'apellido', 'telefono', 'dni'] },
    ],
    attributes: ['id_usuario', 'id_empleado', 'correo'],
  });
  return usuariosEmpleado.map((u) => {
    const e = u.empleado;
    return {
      id_empleado: e ? e.id_empleado : u.id_empleado,
      id_usuario: u.id_usuario,
      nombre: e ? e.nombre : '-',
      apellido: e ? e.apellido : '-',
      telefono: e ? e.telefono : '-',
      dni: e ? e.dni : '-',
    };
  });
};

module.exports = {
  getAll,
};
>>>>>>> 6900e28 ([TFG-5]Añadir funcionalidad de creacion de productos)
