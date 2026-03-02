# Backend del Proyecto

Este es el backend del proyecto desarrollado con Node.js, Express, Sequelize y PostgreSQL.

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

## 🚀 Instalación

### 1. Instalar PostgreSQL (si no está instalado)

#### macOS (con Homebrew)
```bash
# Instalar PostgreSQL
brew install postgresql@14

# Iniciar el servicio de PostgreSQL
brew services start postgresql@14

# Verificar que esté corriendo
brew services list | grep postgres
```

#### Windows
1. **Descargar PostgreSQL:**
   - Visita: https://www.postgresql.org/download/windows/
   - Descarga el instalador oficial de PostgreSQL
   - O usa el instalador de EnterpriseDB: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Instalar PostgreSQL:**
   - Ejecuta el instalador descargado
   - Durante la instalación, configura:
     - **Puerto**: 5432 (por defecto)
     - **Usuario**: postgres (por defecto)
     - **Contraseña**: Anota la contraseña que configures (la necesitarás para el `.env`)
   - Completa la instalación

3. **Verificar instalación:**
   - Abre el "SQL Shell (psql)" desde el menú de inicio
   - O verifica desde PowerShell/CMD:
     ```powershell
     psql --version
     ```

4. **Iniciar el servicio:**
   - PostgreSQL se inicia automáticamente como servicio de Windows
   - Para verificar/controlar el servicio:
     - Abre "Servicios" (services.msc)
     - Busca "postgresql-x64-XX" (donde XX es la versión)
     - Asegúrate de que esté "En ejecución"

#### Ubuntu/Debian
```bash
# Actualizar paquetes
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar el servicio de PostgreSQL
sudo systemctl start postgresql

# Habilitar PostgreSQL para que inicie automáticamente al arrancar
sudo systemctl enable postgresql

# Verificar que esté corriendo
sudo systemctl status postgresql
```

**Configurar usuario en Ubuntu:**
```bash
# Cambiar al usuario postgres
sudo -u postgres psql

# Crear un nuevo usuario y base de datos (dentro de psql)
CREATE USER tu_usuario WITH PASSWORD 'tu_contraseña';
CREATE DATABASE nombre_base_datos OWNER tu_usuario;
GRANT ALL PRIVILEGES ON DATABASE nombre_base_datos TO tu_usuario;
\q
```

**Verificar instalación (todas las plataformas):**
```bash
psql --version
```

### 2. Crear la base de datos

#### macOS y Linux
```bash
# Crear la base de datos (reemplaza 'nombre_base_datos' con el nombre que uses)
createdb nombre_base_datos

# O usando psql
psql -U postgres
CREATE DATABASE nombre_base_datos;
\q
```

#### Windows
```bash
# Usando psql desde PowerShell o CMD
psql -U postgres
# Te pedirá la contraseña que configuraste durante la instalación

# Dentro de psql:
CREATE DATABASE nombre_base_datos;
\q
```

**Nota:** En Windows, si `psql` no está en el PATH, puedes usar:
- El "SQL Shell (psql)" desde el menú de inicio
- O la ruta completa: `C:\Program Files\PostgreSQL\XX\bin\psql.exe` (donde XX es la versión)

### 2.1. Crear las tablas de la base de datos

Las tablas se crean automáticamente cuando inicias el servidor por primera vez (en modo desarrollo). Sin embargo, si prefieres crearlas manualmente, puedes ejecutar el siguiente script SQL:

```sql
-- Crear tabla de roles
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla de empleados
CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    telefono VARCHAR(20),
    dni VARCHAR(15)
);

-- Crear tabla de usuarios
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL REFERENCES rol(id_rol),
    id_empleado INT REFERENCES empleado(id_empleado)
);

-- Crear tabla de clientes
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

-- Crear tabla de categorías
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Crear tabla de proveedores
CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

-- Crear tabla de productos
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL,
    id_categoria INT NOT NULL REFERENCES categoria(id_categoria),
    id_proveedor INT NOT NULL REFERENCES proveedor(id_proveedor)
);

-- Crear tabla de pedidos
CREATE TABLE pedido (
    id_pedido SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    id_cliente INT NOT NULL REFERENCES cliente(id_cliente),
    id_empleado INT REFERENCES empleado(id_empleado)
);

-- Crear tabla de detalles de pedido
CREATE TABLE detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_producto INT NOT NULL REFERENCES producto(id_producto),
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL
);
```

**Insertar roles iniciales:**
```sql
INSERT INTO rol (nombre_rol) 
VALUES 
  ('administrador'),
  ('empleado'),
  ('cliente')
ON CONFLICT (nombre_rol) DO NOTHING;
```

### 3. Instalar dependencias del proyecto

```bash
npm install
```

### 4. Configurar variables de entorno

- Asegúrate de tener el archivo `.env` configurado con tus credenciales:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=nombre_base_datos
  DB_USER=tu_usuario_postgres
  DB_PASSWORD=tu_contraseña_postgres
  PORT=4000
  NODE_ENV=development
  JWT_SECRET=tu_secreto_super_seguro_aqui
  JWT_EXPIRES_IN=24h
  ```

### 5. Verificar la conexión a la base de datos

```bash
npm run check-db
```

Este comando verificará que la conexión a PostgreSQL funcione correctamente.

## 🏃 Ejecución

### Verificar conexión a la base de datos
Antes de iniciar el servidor, verifica que la conexión funcione:
```bash
npm run check-db
```

### Modo Desarrollo
```bash
npm run dev
```
El servidor se ejecutará con `nodemon` para recargar automáticamente los cambios.

### Modo Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:4000`

## ⚠️ Solución de Problemas

### Error: ECONNREFUSED o ConnectionRefusedError

Este error indica que PostgreSQL no está corriendo. Soluciones según tu sistema operativo:

#### macOS
1. **Verificar que PostgreSQL esté instalado:**
   ```bash
   brew list postgresql@14 || brew list postgresql
   ```

2. **Iniciar el servicio:**
   ```bash
   brew services start postgresql@14
   # o
   brew services start postgresql
   ```

3. **Verificar que esté corriendo:**
   ```bash
   brew services list | grep postgres
   ```

4. **Si no está instalado, instalarlo:**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

#### Windows
1. **Verificar el servicio:**
   - Presiona `Win + R`, escribe `services.msc` y presiona Enter
   - Busca el servicio "postgresql-x64-XX" (donde XX es la versión)
   - Si está detenido, haz clic derecho → "Iniciar"

2. **Iniciar desde PowerShell (como Administrador):**
   ```powershell
   # Buscar el nombre exacto del servicio
   Get-Service | Where-Object {$_.Name -like "*postgres*"}
   
   # Iniciar el servicio (reemplaza con el nombre exacto)
   Start-Service postgresql-x64-14
   ```

3. **Verificar que esté corriendo:**
   ```powershell
   Get-Service | Where-Object {$_.Name -like "*postgres*"}
   ```

#### Ubuntu/Debian
1. **Verificar el estado del servicio:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Iniciar el servicio:**
   ```bash
   sudo systemctl start postgresql
   ```

3. **Habilitar inicio automático:**
   ```bash
   sudo systemctl enable postgresql
   ```

4. **Verificar que esté corriendo:**
   ```bash
   sudo systemctl is-active postgresql
   ```

#### Todas las plataformas
5. **Verificar la conexión:**
   ```bash
   npm run check-db
   ```

### Error: "role does not exist" o "password authentication failed"

Este error indica problemas con las credenciales. Soluciones:

1. **Verificar las credenciales en `.env`:**
   - Asegúrate de que `DB_USER` y `DB_PASSWORD` sean correctos
   - En Windows, usa el usuario y contraseña que configuraste durante la instalación
   - En Linux, el usuario por defecto suele ser `postgres` o tu usuario del sistema

2. **Crear el usuario si no existe (Linux/macOS):**
   ```bash
   sudo -u postgres psql
   CREATE USER tu_usuario WITH PASSWORD 'tu_contraseña';
   ALTER USER tu_usuario CREATEDB;
   \q
   ```

3. **Cambiar contraseña de postgres (Windows):**
   - Abre "SQL Shell (psql)"
   - Conecta con el usuario postgres
   - Ejecuta: `ALTER USER postgres WITH PASSWORD 'nueva_contraseña';`

## 📁 Estructura del Proyecto

```
Servidor/
│── src/
│   ├── config/
│   │   └── database.js          # Configuración de la base de datos
│   │
│   ├── models/
│   │   ├── Rol.js                # Modelo de Rol
│   │   ├── Empleado.js           # Modelo de Empleado
│   │   ├── Usuario.js            # Modelo de Usuario
│   │   ├── Cliente.js            # Modelo de Cliente
│   │   ├── Categoria.js          # Modelo de Categoría
│   │   ├── Proveedor.js          # Modelo de Proveedor
│   │   ├── Producto.js           # Modelo de Producto
│   │   ├── Pedido.js             # Modelo de Pedido
│   │   └── DetallePedido.js      # Modelo de Detalle de Pedido
│   │
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticación
│   │   ├── userController.js     # Controlador de usuarios
│   │   └── productoController.js # Controlador de productos
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── userRoutes.js        # Rutas de usuarios
│   │   └── productoRoutes.js    # Rutas de productos
│   │
│   ├── services/
│   │   ├── userService.js       # Lógica de negocio de usuarios
│   │   └── productoService.js   # Lógica de negocio de productos
│   │
│   ├── utils/
│   │   └── token.js             # Utilidades para JWT
│   │
│   ├── app.js                   # Configuración de Express
│   └── server.js                # Punto de entrada del servidor
│
├── scripts/
│   └── check-db.js              # Script para verificar conexión a BD
│
├── .env                         # Variables de entorno (no subir a git)
├── .env.example                # Ejemplo de variables de entorno
├── package.json                 # Dependencias del proyecto
└── README.md                    # Este archivo
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token (requiere autenticación)

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (requiere autenticación)
- `GET /api/users/:id` - Obtener un usuario por ID (requiere autenticación)
- `POST /api/users/register` - Registrar nuevo usuario (público, sin autenticación)
- `POST /api/users/create` - Crear un nuevo usuario (requiere autenticación)
- `PUT /api/users/:id` - Actualizar un usuario (requiere autenticación)
- `DELETE /api/users/:id` - Eliminar un usuario (requiere autenticación)

### Productos
- `GET /api/productos` - Obtener todos los productos (requiere autenticación)
- `GET /api/productos/:id` - Obtener un producto por ID (requiere autenticación)
- `POST /api/productos/nuevo` - Crear un nuevo producto (requiere autenticación)
- `PUT /api/productos/:id` - Actualizar un producto (requiere autenticación)
- `DELETE /api/productos/:id` - Eliminar un producto (requiere autenticación)

### Categorías (flujo admin: crear antes que productos)
- `GET /api/categorias` - Listar categorías (requiere autenticación)
- `POST /api/categorias` - Crear categoría. Body: `{ "nombre": "Ej: Informática" }` (requiere autenticación)
- `PUT /api/categorias/:id` - Actualizar categoría (requiere autenticación)
- `DELETE /api/categorias/:id` - Eliminar categoría (devuelve 409 si hay productos asociados)

### Proveedores (flujo admin: crear antes que productos)
- `GET /api/proveedores` - Listar proveedores (requiere autenticación)
- `POST /api/proveedores` - Crear proveedor. Body: `{ "nombre": "...", "telefono": "...", "correo": "..." }` (telefono y correo opcionales)
- `PUT /api/proveedores/:id` - Actualizar proveedor (requiere autenticación)
- `DELETE /api/proveedores/:id` - Eliminar proveedor (devuelve 409 si hay productos asociados)

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Para autenticarte:

1. Realiza un `POST` a `/api/auth/login` con:
   ```json
   {
     "correo": "usuario@example.com",
     "contraseña": "tu_contraseña"
   }
   ```

2. Recibirás un token JWT en la respuesta.

3. Incluye el token en las peticiones siguientes usando el header:
   ```
   Authorization: Bearer <tu_token>
   ```

## 🗄️ Estructura de la Base de Datos

### Tabla: `rol`
- `id_rol`: Integer (PK, SERIAL, Auto-increment)
- `nombre_rol`: VARCHAR(50) (NOT NULL, UNIQUE)
  - Valores posibles: 'administrador', 'empleado', 'cliente'

### Tabla: `empleado`
- `id_empleado`: Integer (PK, SERIAL, Auto-increment)
- `nombre`: VARCHAR(50) (NOT NULL)
- `apellido`: VARCHAR(50) (NULL)
- `telefono`: VARCHAR(20) (NULL)
- `dni`: VARCHAR(15) (NULL)

### Tabla: `usuario`
- `id_usuario`: Integer (PK, SERIAL, Auto-increment)
- `correo`: VARCHAR(100) (UNIQUE, NOT NULL)
- `contraseña`: VARCHAR(255) (NOT NULL, encriptada con bcrypt)
- `id_rol`: Integer (NOT NULL, FK → `rol.id_rol`)
- `id_empleado`: Integer (NULL, FK → `empleado.id_empleado`)

**Relaciones:**
- Un usuario pertenece a un rol (obligatorio)
- Un usuario puede estar asociado a un empleado (opcional)

### Tabla: `cliente`
- `id_cliente`: Integer (PK, SERIAL, Auto-increment)
- `nombre`: VARCHAR(50) (NOT NULL)
- `apellido`: VARCHAR(50) (NULL)
- `telefono`: VARCHAR(20) (NULL)
- `correo`: VARCHAR(100) (NULL)

### Tabla: `categoria`
- `id_categoria`: Integer (PK, SERIAL, Auto-increment)
- `nombre`: VARCHAR(50) (NOT NULL)

### Tabla: `proveedor`
- `id_proveedor`: Integer (PK, SERIAL, Auto-increment)
- `nombre`: VARCHAR(50) (NOT NULL)
- `telefono`: VARCHAR(20) (NULL)
- `correo`: VARCHAR(100) (NULL)

### Tabla: `producto`
- `id_producto`: Integer (PK, SERIAL, Auto-increment)
- `nombre`: VARCHAR(100) (NOT NULL)
- `precio`: NUMERIC(10,2) (NOT NULL)
- `stock`: Integer (NOT NULL)
- `id_categoria`: Integer (NOT NULL, FK → `categoria.id_categoria`)
- `id_proveedor`: Integer (NOT NULL, FK → `proveedor.id_proveedor`)

**Relaciones:**
- Un producto pertenece a una categoría (obligatorio)
- Un producto pertenece a un proveedor (obligatorio)

### Tabla: `pedido`
- `id_pedido`: Integer (PK, SERIAL, Auto-increment)
- `fecha`: TIMESTAMP (NOT NULL, DEFAULT NOW())
- `id_cliente`: Integer (NOT NULL, FK → `cliente.id_cliente`)
- `id_empleado`: Integer (NULL, FK → `empleado.id_empleado`)

**Relaciones:**
- Un pedido pertenece a un cliente (obligatorio)
- Un pedido puede estar asociado a un empleado (opcional)

### Tabla: `detalle_pedido`
- `id_detalle`: Integer (PK, SERIAL, Auto-increment)
- `id_pedido`: Integer (NOT NULL, FK → `pedido.id_pedido`, ON DELETE CASCADE)
- `id_producto`: Integer (NOT NULL, FK → `producto.id_producto`)
- `cantidad`: Integer (NOT NULL)
- `precio_unitario`: NUMERIC(10,2) (NOT NULL)

**Relaciones:**
- Un detalle pertenece a un pedido (obligatorio, se elimina si se elimina el pedido)
- Un detalle referencia a un producto (obligatorio)

## 📊 Diagrama de Relaciones

```
rol (1) ──< (N) usuario
empleado (1) ──< (N) usuario
empleado (1) ──< (N) pedido
cliente (1) ──< (N) pedido
categoria (1) ──< (N) producto
proveedor (1) ──< (N) producto
pedido (1) ──< (N) detalle_pedido
producto (1) ──< (N) detalle_pedido
```

## 🔑 Datos Iniciales

Después de crear las tablas, es necesario insertar los roles iniciales:

```sql
INSERT INTO rol (nombre_rol) 
VALUES 
  ('administrador'),
  ('empleado'),
  ('cliente')
ON CONFLICT (nombre_rol) DO NOTHING;
```

**Nota:** Los roles se insertan automáticamente si ejecutas el script SQL proporcionado en la sección de instalación.

## 🛠️ Tecnologías Utilizadas

- **Express.js**: Framework web para Node.js
- **Sequelize**: ORM para PostgreSQL
- **PostgreSQL**: Base de datos relacional
- **JWT (jsonwebtoken)**: Autenticación basada en tokens
- **bcryptjs**: Encriptación de contraseñas
- **CORS**: Manejo de peticiones cross-origin
- **dotenv**: Gestión de variables de entorno

## 📝 Notas

- **Contraseñas**: Se encriptan automáticamente con bcrypt antes de guardarse en la base de datos.
- **Creación de tablas**: 
  - En desarrollo, las tablas se crean automáticamente al iniciar el servidor (si no existen).
  - En producción, se recomienda usar migraciones de Sequelize o scripts SQL.
- **Variables de entorno**: El archivo `.env` no debe subirse al repositorio. Usa `.env.example` como referencia.
- **Roles**: Los roles iniciales deben insertarse manualmente o mediante script SQL.
- **Relaciones**: Todas las foreign keys están configuradas con las restricciones apropiadas (CASCADE donde corresponde).

## 🤝 Contribución

1. Crea una rama para tu feature
2. Realiza tus cambios
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

ISC

