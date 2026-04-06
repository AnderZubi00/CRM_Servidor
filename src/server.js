const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
const { DataTypes } = require('sequelize');

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
const Consulta = require('./models/Consulta');

const PORT = process.env.PORT || 4000;

const ensureUsuarioColumns = async () => {
  const qi = sequelize.getQueryInterface();
  const desc = await qi.describeTable('usuario');

  const addIfMissing = async (columnName, attributes) => {
    if (desc[columnName]) return;
    await qi.addColumn('usuario', columnName, attributes);
    console.log(`✅ Columna agregada: usuario.${columnName}`);
  };

  await addIfMissing('nombre', { type: DataTypes.STRING(80), allowNull: true });
  await addIfMissing('apellido', { type: DataTypes.STRING(120), allowNull: true });
  await addIfMissing('telefono', { type: DataTypes.STRING(20), allowNull: true });
};

const ensurePedidoColumns = async () => {
  const qi = sequelize.getQueryInterface();
  const desc = await qi.describeTable('pedido');

  if (!desc['estado']) {
    await qi.addColumn('pedido', 'estado', {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pendiente',
    });
    console.log('✅ Columna agregada: pedido.estado');
  }
};

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conexión a la base de datos establecida.');

    // Asegurar columnas faltantes (solo desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      await ensureUsuarioColumns();
      await ensurePedidoColumns();
    }

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

    // Consulta -> Usuario
    Consulta.belongsTo(Usuario, {
      foreignKey: 'id_usuario',
      targetKey: 'id_usuario',
      as: 'usuario',
    });
    Usuario.hasMany(Consulta, {
      foreignKey: 'id_usuario',
      sourceKey: 'id_usuario',
      as: 'consultas',
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
      await Consulta.sync({ force: false });
      
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📷 Subida de imágenes: POST http://localhost:${PORT}/api/productos/upload-imagen`);
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

