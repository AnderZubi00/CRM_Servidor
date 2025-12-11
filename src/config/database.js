const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
      throw new Error('❌ Variables de entorno de base de datos no configuradas. Verifica tu archivo .env');
    }

    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    return sequelize;
  } catch (error) {
    if (error.name === 'SequelizeConnectionRefusedError' || error.code === 'ECONNREFUSED') {
      console.error('❌ Error: No se puede conectar a PostgreSQL.');
      console.error('   Verifica que:');
      console.error('   1. PostgreSQL esté instalado y corriendo');
      console.error('   2. Las credenciales en .env sean correctas');
      console.error('   3. PostgreSQL esté escuchando en', process.env.DB_HOST || 'localhost', 'puerto', process.env.DB_PORT || 5432);
      console.error('\n   Para instalar PostgreSQL en macOS:');
      console.error('   brew install postgresql@14');
      console.error('   brew services start postgresql@14');
    } else if (error.message.includes('Variables de entorno')) {
      console.error(error.message);
    } else if (error.message.includes('does not exist') || error.message.includes('role')) {
      console.error('❌ Error de autenticación o base de datos:');
      console.error(`   ${error.message}`);
      console.error('\n   Posibles soluciones:');
      console.error('   1. Verifica que el usuario en .env sea correcto');
      console.error('      En macOS con Homebrew, el usuario suele ser tu nombre de usuario del sistema');
      console.error('   2. Verifica que la base de datos exista:');
      console.error(`      psql -U $(whoami) -l | grep ${process.env.DB_NAME}`);
      console.error('   3. Crea la base de datos si no existe:');
      console.error(`      createdb ${process.env.DB_NAME}`);
    } else {
      console.error('❌ Error al conectar con la base de datos:', error.message);
    }
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB
};

