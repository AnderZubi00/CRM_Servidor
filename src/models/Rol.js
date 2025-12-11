const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_rol'
  },
  nombre_rol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'nombre_rol',
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'rol',
  timestamps: false
});

module.exports = Rol;

