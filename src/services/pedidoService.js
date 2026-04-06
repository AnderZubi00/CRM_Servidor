const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const { sequelize } = require('../config/database');

/**
 * Crea un pedido completo (cabecera + líneas) en transacción.
 * Descuenta stock de cada producto.
 *
 * @param {number} idCliente
 * @param {{ id_producto: number, cantidad: number }[]} items
 * @returns {Promise<{ pedido: Object, detalles: Object[] }>}
 */
const createPedido = async (idCliente, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('El pedido debe tener al menos un producto.');
  }

  const t = await sequelize.transaction();

  try {
    // 1. Crear cabecera del pedido
    const pedido = await Pedido.create(
      { id_cliente: idCliente, fecha: new Date(), id_empleado: null, estado: 'pendiente' },
      { transaction: t }
    );

    const detalles = [];

    for (const item of items) {
      const producto = await Producto.findByPk(item.id_producto, {
        transaction: t,
        lock: t.LOCK.UPDATE,        // bloqueo optimista
      });

      if (!producto) {
        throw new Error(`Producto con id ${item.id_producto} no encontrado.`);
      }

      const cantidad = Math.max(1, Math.floor(Number(item.cantidad)));

      if (producto.stock < cantidad) {
        throw new Error(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${cantidad}.`
        );
      }

      // Descontar stock
      producto.stock -= cantidad;
      await producto.save({ transaction: t });

      // Crear detalle
      const detalle = await DetallePedido.create(
        {
          id_pedido: pedido.id_pedido,
          id_producto: producto.id_producto,
          cantidad,
          precio_unitario: producto.precio,
        },
        { transaction: t }
      );

      detalles.push(detalle);
    }

    await t.commit();
    return { pedido, detalles };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Obtiene todos los pedidos de un cliente con sus detalles.
 *
 * @param {number} idCliente
 * @returns {Promise<Object[]>}
 */
const getPedidosByCliente = async (idCliente) => {
  const pedidos = await Pedido.findAll({
    where: { id_cliente: idCliente },
    order: [['fecha', 'DESC']],
  });

  const result = [];

  for (const pedido of pedidos) {
    const detalles = await DetallePedido.findAll({
      where: { id_pedido: pedido.id_pedido },
    });

    // Enriquecer con nombre producto
    const detallesConNombre = [];
    for (const d of detalles) {
      const prod = await Producto.findByPk(d.id_producto);
      detallesConNombre.push({
        ...d.toJSON(),
        nombre_producto: prod ? prod.nombre : 'Producto eliminado',
        imagen_url: prod ? prod.imagen_url : null,
      });
    }

    result.push({
      ...pedido.toJSON(),
      detalles: detallesConNombre,
    });
  }

  return result;
};

/**
 * Obtiene todos los pedidos con detalles e info de cliente (para admin/empleado).
 *
 * @returns {Promise<Object[]>}
 */
const getAllPedidos = async () => {
  const pedidos = await Pedido.findAll({ order: [['fecha', 'DESC']] });

  const result = [];

  for (const pedido of pedidos) {
    const detalles = await DetallePedido.findAll({
      where: { id_pedido: pedido.id_pedido },
    });

    let total = 0;
    const detallesConNombre = [];

    for (const d of detalles) {
      const prod = await Producto.findByPk(d.id_producto);
      total += Number(d.precio_unitario) * Number(d.cantidad);
      detallesConNombre.push({
        ...d.toJSON(),
        nombre_producto: prod ? prod.nombre : 'Producto eliminado',
        imagen_url: prod ? prod.imagen_url : null,
      });
    }

    const cliente = await Cliente.findByPk(pedido.id_cliente);

    result.push({
      ...pedido.toJSON(),
      correo_cliente: cliente ? cliente.correo : null,
      nombre_cliente: cliente
        ? `${cliente.nombre} ${cliente.apellido || ''}`.trim()
        : null,
      total,
      detalles: detallesConNombre,
    });
  }

  return result;
};

module.exports = { createPedido, getPedidosByCliente, getAllPedidos };
