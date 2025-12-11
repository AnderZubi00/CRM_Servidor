const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_cliente'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: true
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
  tableName: 'cliente',
  timestamps: false
});

module.exports = Cliente;

