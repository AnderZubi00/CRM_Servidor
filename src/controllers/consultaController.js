const Consulta = require('../models/Consulta');
const Usuario = require('../models/Usuario');

const ASUNTOS_VALIDOS = ['cotizacion', 'stock', 'soporte', 'garantia', 'otro'];

// POST /api/consultas — cualquier usuario autenticado puede enviar una consulta
const crear = async (req, res) => {
  try {
    const { asunto, mensaje, telefono } = req.body;
    const { id: id_usuario, correo } = req.user;

    if (!asunto || !mensaje) {
      return res.status(400).json({ error: 'El asunto y el mensaje son obligatorios.' });
    }

    if (!ASUNTOS_VALIDOS.includes(asunto)) {
      return res.status(400).json({ error: 'Asunto no válido.' });
    }

    // Obtener nombre completo del usuario desde la BD
    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: ['nombre', 'apellido', 'correo', 'telefono'],
    });

    const nombre = usuario
      ? [usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || correo
      : correo;

    const consulta = await Consulta.create({
      asunto,
      mensaje: mensaje.trim(),
      nombre,
      correo: usuario?.correo || correo,
      telefono: telefono || usuario?.telefono || null,
      estado: 'pendiente',
      id_usuario,
    });

    return res.status(201).json({ message: 'Consulta enviada correctamente.', consulta });
  } catch (error) {
    console.error('Error al crear consulta:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// GET /api/consultas — solo admin (rol 1) y empleado (rol 2)
const listar = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      order: [['fecha_creacion', 'DESC']],
    });
    return res.json(consultas);
  } catch (error) {
    console.error('Error al listar consultas:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// PATCH /api/consultas/:id/estado — solo admin y empleado
const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const ESTADOS_VALIDOS = ['pendiente', 'vista', 'resuelta'];
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido.' });
    }

    const consulta = await Consulta.findByPk(id);
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta no encontrada.' });
    }

    await consulta.update({ estado });
    return res.json({ message: 'Estado actualizado.', consulta });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// DELETE /api/consultas/:id — solo admin
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const consulta = await Consulta.findByPk(id);
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta no encontrada.' });
    }

    await consulta.destroy();
    return res.json({ message: 'Consulta eliminada.' });
  } catch (error) {
    console.error('Error al eliminar consulta:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { crear, listar, actualizarEstado, eliminar };
