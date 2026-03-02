const Proveedor = require('../models/Proveedor');
const Producto = require('../models/Producto');

/**
 * Lista todos los proveedores
 */
const getAll = async () => {
  const list = await Proveedor.findAll({
    order: [['nombre', 'ASC']],
  });
  return list;
};

/**
 * Crea un proveedor
 */
const create = async (data) => {
  const nombre = (data && data.nombre != null) ? String(data.nombre).trim() : '';
  if (!nombre) throw new Error('El nombre es obligatorio.');
  const payload = {
    nombre,
    telefono: (data.telefono != null && data.telefono !== '') ? String(data.telefono).trim() : null,
    correo: (data.correo != null && data.correo !== '') ? String(data.correo).trim() : null,
  };
  const prov = await Proveedor.create(payload);
  return prov;
};

/**
 * Actualiza un proveedor
 */
const update = async (id, data) => {
  const prov = await Proveedor.findByPk(id);
  if (!prov) throw new Error('Proveedor no encontrado');
  const payload = {
    nombre: (data.nombre || '').trim(),
    telefono: (data.telefono || '').trim() || null,
    correo: (data.correo || '').trim() || null,
  };
  await prov.update(payload);
  return prov;
};

/**
 * Elimina un proveedor. Devuelve 409 si hay productos que lo usan.
 */
const remove = async (id) => {
  const prov = await Proveedor.findByPk(id);
  if (!prov) throw new Error('Proveedor no encontrado');
  const count = await Producto.count({ where: { id_proveedor: id } });
  if (count > 0) {
    const err = new Error('No se puede eliminar: hay productos asociados a este proveedor.');
    err.statusCode = 409;
    throw err;
  }
  await prov.destroy();
  return true;
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
