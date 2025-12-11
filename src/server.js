const app = require('./app');
const { connectDB } = require('./config/database');
const User = require('./models/User');
const Role = require('./models/Role');
const Producto = require('./models/Producto');

const PORT = process.env.PORT || 4000;

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conexión a la base de datos establecida.');

    // Establecer relaciones antes de sincronizar
    // La foreign key 'rol' en usuarios referencia 'id' en roles
    User.belongsTo(Role, { 
      foreignKey: 'rol', 
      targetKey: 'id',
      as: 'role'
    });

    // Sincronizar modelos (crear tablas si no existen)
    // En producción, usar migraciones en lugar de sync
    if (process.env.NODE_ENV !== 'production') {
      // Sincronizar en orden: primero Role, luego User (que depende de Role), luego Producto
      // Usar { force: false } para solo crear si no existen, sin alterar
      await Role.sync({ force: false });
      await User.sync({ force: false });
      await Producto.sync({ force: false });
      
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

