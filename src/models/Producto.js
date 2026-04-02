const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_producto'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },

  imagen_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'imagen_url'
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_categoria'
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_proveedor'
  }
}, {
  tableName: 'producto',
  timestamps: false
});

module.exports = Producto;
