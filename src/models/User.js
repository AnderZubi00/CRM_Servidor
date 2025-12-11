const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3 // Por defecto cliente
    // La relación se establece en server.js con belongsTo
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.contraseña) {
        user.contraseña = await bcrypt.hash(user.contraseña, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('contraseña')) {
        user.contraseña = await bcrypt.hash(user.contraseña, 10);
      }
    }
  }
});

// Método para comparar contraseñas
User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.contraseña);
};

module.exports = User;

