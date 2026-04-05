const pedidoService = require('../services/pedidoService');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

/**
 * POST /api/pedidos
 * Body: { items: [{ id_producto, cantidad }] }
 * Auth: token → req.user.id (id_usuario) → se resuelve a id_cliente
 */
const createPedido = async (req, res) => {
  try {
    const idUsuario = req.user?.id;
    if (!idUsuario) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    // Buscar el usuario para obtener sus datos
    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    // Find-or-create el registro de cliente a partir del correo del usuario
    const [cliente] = await Cliente.findOrCreate({
      where: { correo: usuario.correo },
      defaults: {
        nombre: usuario.nombre || usuario.correo.split('@')[0],
        apellido: usuario.apellido || null,
        telefono: usuario.telefono || null,
        correo: usuario.correo,
      },
    });

    const { items } = req.body;
    const result = await pedidoService.createPedido(cliente.id_cliente, items);

    res.status(201).json({
      message: 'Pedido creado exitosamente.',
      pedido: result.pedido,
      detalles: result.detalles,
    });
  } catch (error) {
    console.error('Error en createPedido:', error);
    const status = error.message.includes('insuficiente') ? 409 : 500;
    res.status(status).json({ error: error.message || 'Error al crear el pedido.' });
  }
};

/**
 * GET /api/pedidos/mis-pedidos
 * Auth: token → req.user.id (id_usuario) → se resuelve a id_cliente
 */
const getMisPedidos = async (req, res) => {
  try {
    const idUsuario = req.user?.id;
    if (!idUsuario) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    const cliente = await Cliente.findOne({ where: { correo: usuario.correo } });
    if (!cliente) {
      return res.json([]); // No tiene pedidos aún
    }

    const pedidos = await pedidoService.getPedidosByCliente(cliente.id_cliente);
    res.json(pedidos);
  } catch (error) {
    console.error('Error en getMisPedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
};

/**
 * GET /api/pedidos/todos
 * Solo accesible para admin (rol=1) y empleado (rol=2).
 */
const getAllPedidos = async (req, res) => {
  try {
    const rolUsuario = Number(req.user?.id_rol);
    if (rolUsuario !== 1 && rolUsuario !== 2) {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    const pedidos = await pedidoService.getAllPedidos();
    res.json(pedidos);
  } catch (error) {
    console.error('Error en getAllPedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
};

module.exports = { createPedido, getMisPedidos, getAllPedidos };
