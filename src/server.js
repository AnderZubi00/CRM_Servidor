const app = require('./app');
const { connectDB } = require('./config/database');

// Importar modelos
const Rol = require('./models/Rol');
const Empleado = require('./models/Empleado');
const Usuario = require('./models/Usuario');
const Cliente = require('./models/Cliente');
const Categoria = require('./models/Categoria');
const Proveedor = require('./models/Proveedor');
const Producto = require('./models/Producto');
const Pedido = require('./models/Pedido');
const DetallePedido = require('./models/DetallePedido');

const PORT = process.env.PORT || 4000;

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conexión a la base de datos establecida.');

    // Establecer relaciones
    // Usuario -> Rol
    Usuario.belongsTo(Rol, { 
      foreignKey: 'id_rol', 
      targetKey: 'id_rol',
      as: 'rol'
    });
    
    // Usuario -> Empleado
    Usuario.belongsTo(Empleado, { 
      foreignKey: 'id_empleado', 
      targetKey: 'id_empleado',
      as: 'empleado'
    });

    // Producto -> Categoria
    Producto.belongsTo(Categoria, { 
      foreignKey: 'id_categoria', 
      targetKey: 'id_categoria',
      as: 'categoria'
    });

    // Producto -> Proveedor
    Producto.belongsTo(Proveedor, { 
      foreignKey: 'id_proveedor', 
      targetKey: 'id_proveedor',
      as: 'proveedor'
    });

    // Pedido -> Cliente
    Pedido.belongsTo(Cliente, { 
      foreignKey: 'id_cliente', 
      targetKey: 'id_cliente',
      as: 'cliente'
    });

    // Pedido -> Empleado
    Pedido.belongsTo(Empleado, { 
      foreignKey: 'id_empleado', 
      targetKey: 'id_empleado',
      as: 'empleado'
    });

    // DetallePedido -> Pedido
    DetallePedido.belongsTo(Pedido, { 
      foreignKey: 'id_pedido', 
      targetKey: 'id_pedido',
      as: 'pedido'
    });

    // DetallePedido -> Producto
    DetallePedido.belongsTo(Producto, { 
      foreignKey: 'id_producto', 
      targetKey: 'id_producto',
      as: 'producto'
    });

    // Sincronizar modelos (las tablas ya están creadas, solo verificar estructura)
    // En producción, usar migraciones en lugar de sync
    if (process.env.NODE_ENV !== 'production') {
      // Las tablas ya están creadas manualmente, solo sincronizamos para verificar
      await Rol.sync({ force: false });
      await Empleado.sync({ force: false });
      await Cliente.sync({ force: false });
      await Categoria.sync({ force: false });
      await Proveedor.sync({ force: false });
      await Usuario.sync({ force: false });
      await Producto.sync({ force: false });
      await Pedido.sync({ force: false });
      await DetallePedido.sync({ force: false });
      
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

