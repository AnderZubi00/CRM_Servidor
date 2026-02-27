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