const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetallePedido = sequelize.define('DetallePedido', {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle'
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_pedido'
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_producto'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'detalle_pedido',
  timestamps: false
});

module.exports = DetallePedido;

