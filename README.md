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
backend/
│── src/
│   ├── config/
│   │   └── database.js          # Configuración de la base de datos
│   │
│   ├── models/
│   │   ├── User.js              # Modelo de Usuario
│   │   ├── Role.js              # Modelo de Rol
│   │   └── Producto.js          # Modelo de Producto
│   │
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticación
│   │   ├── userController.js   # Controlador de usuarios
│   │   └── productoController.js # Controlador de productos
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── userRoutes.js       # Rutas de usuarios
│   │   └── productoRoutes.js   # Rutas de productos
│   │
│   ├── services/
│   │   ├── userService.js      # Lógica de negocio de usuarios
│   │   └── productoService.js  # Lógica de negocio de productos
│   │
│   ├── utils/
│   │   └── token.js            # Utilidades para JWT
│   │
│   ├── app.js                  # Configuración de Express
│   └── server.js               # Punto de entrada del servidor
│
├── .env                        # Variables de entorno (no subir a git)
├── .env.example               # Ejemplo de variables de entorno
├── package.json               # Dependencias del proyecto
└── README.md                  # Este archivo
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token (requiere autenticación)

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (requiere autenticación)
- `GET /api/users/:id` - Obtener un usuario por ID (requiere autenticación)
- `POST /api/users/create` - Crear un nuevo usuario (requiere autenticación)
- `PUT /api/users/:id` - Actualizar un usuario (requiere autenticación)
- `DELETE /api/users/:id` - Eliminar un usuario (requiere autenticación)

### Productos
- `GET /api/productos` - Obtener todos los productos (requiere autenticación)
- `GET /api/productos/:id` - Obtener un producto por ID (requiere autenticación)
- `POST /api/productos/nuevo` - Crear un nuevo producto (requiere autenticación)
- `PUT /api/productos/:id` - Actualizar un producto (requiere autenticación)
- `DELETE /api/productos/:id` - Eliminar un producto (requiere autenticación)

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT. Para autenticarte:

1. Realiza un `POST` a `/api/auth/login` con:
   ```json
   {
     "email": "usuario@example.com",
     "contraseña": "tu_contraseña"
   }
   ```

2. Recibirás un token JWT en la respuesta.

3. Incluye el token en las peticiones siguientes usando el header:
   ```
   Authorization: Bearer <tu_token>
   ```

## 🗄️ Modelos de Datos

### User (Usuario)
- `id`: Integer (PK, Auto-increment)
- `nombre`: String
- `email`: String (único)
- `contraseña`: String (encriptada)
- `rol`: Integer (FK a Role)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Role (Rol)
- `id`: Integer (PK, Auto-increment)
- `nombre`: String (único: 'administrador', 'empleado', 'cliente')
- `descripcion`: Text
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Producto
- `id`: Integer (PK, Auto-increment)
- `nombre`: String
- `descripcion`: Text
- `precio`: Decimal(10,2)
- `stock`: Integer
- `imagen`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## 🛠️ Tecnologías Utilizadas

- **Express.js**: Framework web para Node.js
- **Sequelize**: ORM para PostgreSQL
- **PostgreSQL**: Base de datos relacional
- **JWT (jsonwebtoken)**: Autenticación basada en tokens
- **bcryptjs**: Encriptación de contraseñas
- **CORS**: Manejo de peticiones cross-origin
- **dotenv**: Gestión de variables de entorno

## 📝 Notas

- Las contraseñas se encriptan automáticamente antes de guardarse en la base de datos.
- En desarrollo, las tablas se crean automáticamente. En producción, se recomienda usar migraciones.
- El archivo `.env` no debe subirse al repositorio. Usa `.env.example` como referencia.

## 🤝 Contribución

1. Crea una rama para tu feature
2. Realiza tus cambios
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

ISC

