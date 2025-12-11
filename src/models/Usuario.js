const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_usuario'
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_rol'
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_empleado'
  }
}, {
  tableName: 'usuario',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.contraseña) {
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('contraseña')) {
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, 10);
      }
    }
  }
});

// Método para comparar contraseñas
Usuario.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.contraseña);
};

module.exports = Usuario;

