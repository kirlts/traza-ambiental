# 🔐 API de Autenticación

**Base URL**: `/api/auth`

La API de autenticación maneja el login, registro, sesiones y autorización de usuarios en el sistema REP TrazAmbiental.

## 📋 Endpoints

### POST `/api/auth/signin`

Inicia sesión de usuario existente.

**Request Body**:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
```

**Response (200)**:

```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "roles": ["Generador", "Productor"],
    "empresa": {
      "id": "uuid",
      "name": "Empresa S.A.",
      "rut": "12.345.678-9"
    }
  },
  "token": "jwt_token_here"
}
```

**Códigos de Error**:

- `401`: Credenciales inválidas
- `429`: Demasiados intentos de login

### POST `/api/auth/signup`

Registra un nuevo usuario (solo Generadores públicos).

**Request Body**:

```json
{
  "email": "nuevo@empresa.com",
  "password": "contraseña_segura",
  "name": "Juan Pérez",
  "rut": "12.345.678-9",
  "empresa": {
    "name": "Empresa S.A.",
    "rut": "76.543.210-K",
    "direccion": "Av. Principal 123",
    "regionId": 13,
    "comunaId": 101
  }
}
```

**Response (201)**:

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "email": "nuevo@empresa.com",
    "status": "pending_approval"
  }
}
```

### POST `/api/auth/signout`

Cierra la sesión del usuario actual.

**Response (200)**:

```json
{
  "message": "Sesión cerrada exitosamente"
}
```

### GET `/api/auth/session`

Obtiene información de la sesión actual.

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Response (200)**:

```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "roles": ["Generador"],
    "permissions": ["solicitudes:create", "solicitudes:read"]
  }
}
```

### POST `/api/auth/refresh`

Renueva el token JWT.

**Request Body**:

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200)**:

```json
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

## 🔒 Sistema de Roles y Permisos

### Roles del Sistema

| Rol                    | Descripción                  | Permisos                            |
| ---------------------- | ---------------------------- | ----------------------------------- |
| **Administrador**      | Gestión completa del sistema | `*` (todos)                         |
| **Sistema de Gestión** | Supervisión y reportes       | `reportes:*`, `certificados:*`      |
| **Productor**          | Declaraciones y metas REP    | `declaraciones:*`, `metas:read`     |
| **Generador**          | Solicitudes de retiro        | `solicitudes:*`                     |
| **Transportista**      | Gestión logística            | `transportes:*`, `solicitudes:read` |
| **Gestor**             | Procesamiento y certificados | `certificados:*`, `tratamientos:*`  |

### Permisos Específicos

- `solicitudes:create` - Crear solicitudes de retiro
- `solicitudes:read` - Ver solicitudes asignadas
- `solicitudes:update` - Actualizar estado de solicitudes
- `certificados:create` - Generar certificados
- `certificados:read` - Ver certificados
- `reportes:read` - Acceder a reportes
- `usuarios:manage` - Gestionar usuarios

## 🛡️ Seguridad

### Autenticación JWT

- **Header**: `Authorization: Bearer <token>`
- **Expiración**: 1 hora (access token), 7 días (refresh token)
- **Algoritmo**: HS256

### Rate Limiting

- **Login**: 5 intentos por minuto por IP
- **API General**: 1000 requests por hora por usuario
- **Registro**: 3 registros por hora por IP

### Validaciones

- **Email**: Formato válido requerido
- **Password**: Mínimo 8 caracteres, mayúscula, minúscula, número
- **RUT**: Validación dígito verificador chileno

## 📝 Ejemplos de Uso

### Login con cURL

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "generador@empresa.com",
    "password": "SecurePass123"
  }'
```

### Uso con Token

```bash
curl -X GET http://localhost:3000/api/solicitudes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🚨 Manejo de Errores

Todos los errores siguen este formato:

```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Credenciales inválidas",
    "details": "El email o contraseña son incorrectos"
  }
}
```

### Códigos de Error Comunes

- `AUTH_INVALID_CREDENTIALS` - Credenciales incorrectas
- `AUTH_USER_NOT_FOUND` - Usuario no existe
- `AUTH_USER_INACTIVE` - Usuario suspendido
- `AUTH_TOKEN_EXPIRED` - Token expirado
- `AUTH_INSUFFICIENT_PERMISSIONS` - Permisos insuficientes
