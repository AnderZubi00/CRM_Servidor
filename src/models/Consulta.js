const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Consulta = sequelize.define('Consulta', {
  id_consulta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asunto: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'vista', 'resuelta'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'consulta',
  timestamps: false,
});

module.exports = Consulta;
