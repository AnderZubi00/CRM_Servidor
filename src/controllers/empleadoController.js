<<<<<<< HEAD
const empleadoService = require("../services/empleadoService");

const getEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoService.getAllEmpleados();
    res.json(empleados);
  } catch (error) {
    console.error("Error en getEmpleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

const postEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, telefono, dni } = req.body;

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
    }

    const empleado = await empleadoService.createEmpleado({
      nombre: String(nombre).trim(),
      apellido,
      telefono,
      dni,
    });

    res.status(201).json(empleado);
  } catch (error) {
    console.error("Error en postEmpleado:", error);
    res.status(500).json({ error: "Error al crear empleado" });
  }
};

module.exports = { getEmpleados, postEmpleado };
=======
const empleadoService = require('../services/empleadoService');

const getAll = async (req, res) => {
  try {
    const list = await empleadoService.getAll();
    res.json(list);
  } catch (err) {
    console.error('getAll empleados:', err);
    res.status(500).json({ message: 'Error al obtener los empleados.' });
  }
};

module.exports = {
  getAll,
};
>>>>>>> 6900e28 ([TFG-5]Añadir funcionalidad de creacion de productos)
