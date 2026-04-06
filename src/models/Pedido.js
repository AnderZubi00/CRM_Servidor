const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pedido'
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_cliente'
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_empleado'
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
  }
}, {
  tableName: 'pedido',
  timestamps: false
});

module.exports = Pedido;

