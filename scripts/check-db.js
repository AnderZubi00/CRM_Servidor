/**
 * Script para verificar la conexión a la base de datos
 * Uso: node scripts/check-db.js
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function checkConnection() {
  console.log('🔍 Verificando configuración...\n');
  
  // Verificar variables de entorno
  console.log('Variables de entorno:');
  console.log(`  DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  DB_PORT: ${process.env.DB_PORT || 5432}`);
  console.log(`  DB_NAME: ${process.env.DB_NAME || 'NO CONFIGURADO'}`);
  console.log(`  DB_USER: ${process.env.DB_USER || 'NO CONFIGURADO'}`);
  console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : 'NO CONFIGURADO'}\n`);

  if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('❌ Faltan variables de entorno. Verifica tu archivo .env');
    process.exit(1);
  }

  console.log('🔌 Intentando conectar a PostgreSQL...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ ¡Conexión exitosa a la base de datos!');
    
    // Verificar si la base de datos existe
    const [results] = await sequelize.query("SELECT current_database()");
    console.log(`✅ Base de datos conectada: ${results[0].current_database}`);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al conectar:');
    
    if (error.name === 'SequelizeConnectionRefusedError' || error.code === 'ECONNREFUSED') {
      console.error('   PostgreSQL no está corriendo o no es accesible.\n');
      console.error('📋 Soluciones:\n');
      console.error('1. Verifica que PostgreSQL esté instalado:');
      console.error('   brew list postgresql@14 || brew list postgresql\n');
      console.error('2. Inicia el servicio de PostgreSQL:');
      console.error('   brew services start postgresql@14');
      console.error('   # o');
      console.error('   brew services start postgresql\n');
      console.error('3. Verifica que esté corriendo:');
      console.error('   brew services list | grep postgres\n');
      console.error('4. Si no está instalado, instálalo:');
      console.error('   brew install postgresql@14');
      console.error('   brew services start postgresql@14\n');
      console.error('5. Crea la base de datos si no existe:');
      console.error(`   createdb ${process.env.DB_NAME}`);
      console.error(`   # o`);
      console.error(`   psql -c "CREATE DATABASE ${process.env.DB_NAME};"`);
    } else if (error.code === '3D000') {
      console.error(`   La base de datos "${process.env.DB_NAME}" no existe.\n`);
      console.error('📋 Solución:');
      console.error(`   createdb ${process.env.DB_NAME}`);
      console.error(`   # o`);
      console.error(`   psql -c "CREATE DATABASE ${process.env.DB_NAME};"`);
    } else if (error.code === '28P01') {
      console.error('   Usuario o contraseña incorrectos.\n');
      console.error('📋 Solución:');
      console.error('   Verifica las credenciales en tu archivo .env');
    } else {
      console.error(`   ${error.message}`);
    }
    
    await sequelize.close();
    process.exit(1);
  }
}

checkConnection();

