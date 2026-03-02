const categoriaService = require('../services/categoriaService');

const getAll = async (req, res) => {
  try {
    const list = await categoriaService.getAll();
    res.json(list);
  } catch (err) {
    console.error('getAll categorías:', err);
    res.status(500).json({ message: 'Error al obtener las categorías.' });
  }
};

const create = async (req, res) => {
  try {
    const cat = await categoriaService.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    console.error('create categoría:', err);
    res.status(500).json({ message: err.message || 'Error al crear la categoría.' });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const cat = await categoriaService.update(id, req.body);
    res.json(cat);
  } catch (err) {
    console.error('update categoría:', err);
    if (err.message === 'Categoría no encontrada') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'Error al actualizar la categoría.' });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await categoriaService.remove(id);
    res.json({ message: 'Categoría eliminada correctamente.' });
  } catch (err) {
    console.error('remove categoría:', err);
    if (err.message === 'Categoría no encontrada') {
      return res.status(404).json({ message: err.message });
    }
    if (err.statusCode === 409) {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'Error al eliminar la categoría.' });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
