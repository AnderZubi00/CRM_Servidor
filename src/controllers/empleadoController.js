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
