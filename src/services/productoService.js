const Producto = require('../models/Producto');

/**
 * Crea un nuevo producto
 * @param {Object} productoData - Datos del producto (nombre, precio, id_categoria, id_proveedor, stock opcional)
 * @returns {Promise<Object>} Producto creado
 */
const createProducto = async (productoData) => {
  try {
    const payload = {
      nombre: (productoData.nombre || '').trim(),
      precio: Number(productoData.precio),
      id_categoria: Number(productoData.id_categoria),
      id_proveedor: Number(productoData.id_proveedor),
      stock: productoData.stock != null && productoData.stock !== '' ? Number(productoData.stock) : 0,
      imagen_url: productoData.imagen_url || null,
    };
    if (payload.nombre === '' || !Number.isFinite(payload.precio) || payload.precio < 0) {
      throw new Error('Nombre y precio son obligatorios; precio debe ser >= 0.');
    }
    if (!Number.isFinite(payload.id_categoria) || !Number.isFinite(payload.id_proveedor)) {
      throw new Error('Debe indicar categoría y proveedor.');
    }
    if (payload.stock < 0) throw new Error('El stock no puede ser negativo.');
    const producto = await Producto.create(payload);
    return producto;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} Lista de productos
 */
const getAllProductos = async () => {
  try {
    const productos = await Producto.findAll({
<<<<<<< HEAD
      order: [['nombre', 'DESC']]
=======
      order: [['id_producto', 'DESC']],
>>>>>>> 6900e28 ([TFG-5]Añadir funcionalidad de creacion de productos)
    });
    return productos;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 * @param {Number} id - ID del producto
 * @returns {Promise<Object>} Producto encontrado
 */
const getProductoById = async (id) => {
  try {
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    return producto;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza un producto
 * @param {Number} id - ID del producto
 * @param {Object} productoData - Datos a actualizar
 * @returns {Promise<Object>} Producto actualizado
 */
const updateProducto = async (id, productoData) => {
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    const payload = {
      nombre: (productoData.nombre || '').trim(),
      precio: Number(productoData.precio),
      id_categoria: Number(productoData.id_categoria),
      id_proveedor: Number(productoData.id_proveedor),
      stock: productoData.stock != null && productoData.stock !== '' ? Number(productoData.stock) : 0,
      imagen_url: productoData.imagen_url || null,
    };
    if (payload.nombre === '' || !Number.isFinite(payload.precio) || payload.precio < 0) {
      throw new Error('Nombre y precio son obligatorios; precio debe ser >= 0.');
    }
    if (payload.stock < 0) throw new Error('El stock no puede ser negativo.');
    await producto.update(payload);
    return producto;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza el stock de un producto
 * @param {Number} id - ID del producto
 * @param {Number} cantidad - Cantidad a actualizar (puede ser negativa)
 * @returns {Promise<Object>} Producto actualizado
 */
const updateStock = async (id, cantidad) => {
  try {
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const nuevoStock = producto.stock + cantidad;
    
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }

    producto.stock = nuevoStock;
    await producto.save();
    
    return producto;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina un producto
 * @param {Number} id - ID del producto
 * @returns {Promise<Boolean>} True si se eliminó correctamente
 */
const deleteProducto = async (id) => {
  try {
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    await producto.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  updateStock,
  deleteProducto
};

