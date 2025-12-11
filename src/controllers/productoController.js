const productoService = require('../services/productoService');

/**
 * Controlador para obtener todos los productos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllProductos = async (req, res) => {
  try {
    const productos = await productoService.getAllProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error en getAllProductos:', error);
    res.status(500).json({
      error: 'Error al obtener los productos'
    });
  }
};

/**
 * Controlador para obtener un producto por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoService.getProductoById(id);
    res.json(producto);
  } catch (error) {
    console.error('Error en getProductoById:', error);
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Error al obtener el producto'
    });
  }
};

/**
 * Controlador para crear un nuevo producto
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createProducto = async (req, res) => {
  try {
    const productoData = req.body;
    const producto = await productoService.createProducto(productoData);
    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto
    });
  } catch (error) {
    console.error('Error en createProducto:', error);
    res.status(500).json({
      error: 'Error al crear el producto'
    });
  }
};

/**
 * Controlador para actualizar un producto
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoData = req.body;
    const producto = await productoService.updateProducto(id, productoData);
    res.json({
      message: 'Producto actualizado exitosamente',
      producto
    });
  } catch (error) {
    console.error('Error en updateProducto:', error);
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Error al actualizar el producto'
    });
  }
};

/**
 * Controlador para eliminar un producto
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await productoService.deleteProducto(id);
    res.json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteProducto:', error);
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Error al eliminar el producto'
    });
  }
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};

