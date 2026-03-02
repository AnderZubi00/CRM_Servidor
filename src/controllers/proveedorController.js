const proveedorService = require('../services/proveedorService');

const getAll = async (req, res) => {
  try {
    const list = await proveedorService.getAll();
    res.json(list);
  } catch (err) {
    console.error('getAll proveedores:', err);
    res.status(500).json({ message: 'Error al obtener los proveedores.' });
  }
};

const create = async (req, res) => {
  try {
    const prov = await proveedorService.create(req.body);
    res.status(201).json(prov);
  } catch (err) {
    console.error('create proveedor:', err);
    res.status(500).json({ message: err.message || 'Error al crear el proveedor.' });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const prov = await proveedorService.update(id, req.body);
    res.json(prov);
  } catch (err) {
    console.error('update proveedor:', err);
    if (err.message === 'Proveedor no encontrado') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'Error al actualizar el proveedor.' });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await proveedorService.remove(id);
    res.json({ message: 'Proveedor eliminado correctamente.' });
  } catch (err) {
    console.error('remove proveedor:', err);
    if (err.message === 'Proveedor no encontrado') {
      return res.status(404).json({ message: err.message });
    }
    if (err.statusCode === 409) {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'Error al eliminar el proveedor.' });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
