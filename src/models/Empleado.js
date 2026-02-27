const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Empleado = sequelize.define('Empleado', {
  id_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_empleado'
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
  dni: {
    type: DataTypes.STRING(15),
    allowNull: true
  }
}, {
  tableName: 'empleado',
  timestamps: false,
});

module.exports = Empleado;

