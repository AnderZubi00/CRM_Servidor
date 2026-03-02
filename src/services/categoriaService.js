const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');

/**
 * Lista todas las categorías
 */
const getAll = async () => {
  const list = await Categoria.findAll({
    order: [['nombre', 'ASC']],
  });
  return list;
};

/**
 * Crea una categoría
 */
const create = async (data) => {
  const nombre = data && typeof data.nombre === 'string' ? data.nombre.trim() : '';
  if (!nombre) throw new Error('El nombre es obligatorio.');
  const cat = await Categoria.create({ nombre });
  return cat;
};

/**
 * Actualiza una categoría
 */
const update = async (id, data) => {
  const cat = await Categoria.findByPk(id);
  if (!cat) throw new Error('Categoría no encontrada');
  await cat.update({ nombre: data.nombre.trim() });
  return cat;
};

/**
 * Elimina una categoría. Devuelve 409 si hay productos que la usan.
 */
const remove = async (id) => {
  const cat = await Categoria.findByPk(id);
  if (!cat) throw new Error('Categoría no encontrada');
  const count = await Producto.count({ where: { id_categoria: id } });
  if (count > 0) {
    const err = new Error('No se puede eliminar: hay productos asociados a esta categoría.');
    err.statusCode = 409;
    throw err;
  }
  await cat.destroy();
  return true;
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
