const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_proveedor'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'proveedor',
  timestamps: false
});

module.exports = Proveedor;

