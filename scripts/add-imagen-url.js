/**
 * Añade la columna imagen_url a la tabla producto si no existe.
 * Uso: node scripts/add-imagen-url.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

async function addColumn() {
  if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('❌ Faltan variables de entorno (DB_NAME, DB_USER, DB_PASSWORD). Verifica .env');
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos.\n');

    try {
      await sequelize.query(`
        ALTER TABLE producto
        ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(255);
      `);
    } catch (alterErr) {
      if (alterErr.message && alterErr.message.includes('already exists')) {
        console.log('✅ La columna imagen_url ya existe. Nada que hacer.\n');
        await sequelize.close();
        process.exit(0);
        return;
      }
      if (alterErr.message && alterErr.message.includes('IF NOT EXISTS')) {
        await sequelize.query(`
          ALTER TABLE producto ADD COLUMN imagen_url VARCHAR(255);
        `);
      } else {
        throw alterErr;
      }
    }

    console.log('✅ Columna imagen_url añadida en la tabla producto.\n');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      console.log('✅ La columna imagen_url ya existe en producto. Nada que hacer.\n');
      await sequelize.close();
      process.exit(0);
      return;
    }
    console.error('❌ Error:', err.message);
    await sequelize.close();
    process.exit(1);
  }
}

addColumn();
