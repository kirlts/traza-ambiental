# 📦 API de Gestión de Productos

**Base URL**: `/api/admin/productos`

Esta API permite a los administradores gestionar el catálogo maestro de productos (neumáticos) del sistema, incluyendo creación, edición, eliminación y consulta.

---

## 📋 Endpoints Disponibles

### 1. Listar Productos

**Endpoint:** `GET /api/admin/productos`

Obtiene un listado paginado de productos con filtros opcionales.

#### Autenticación

- Requiere sesión activa
- Solo rol **ADMINISTRADOR** puede acceder

#### Query Parameters

| Parámetro   | Tipo   | Requerido | Descripción                                            |
| ----------- | ------ | --------- | ------------------------------------------------------ |
| `search`    | string | No        | Búsqueda por nombre, marca o modelo (case-insensitive) |
| `categoria` | string | No        | Filtrar por categoría REP (A o B)                      |
| `page`      | number | No        | Número de página (default: 1)                          |
| `limit`     | number | No        | Registros por página (default: 10)                     |

#### Response (200)

```json
{
  "productos": [
    {
      "id": "cmio1loon00hwrlrgtndkfifu",
      "nombre": "Neumático R22.5",
      "marca": "Michelin",
      "modelo": "XZA2",
      "categoria": "B",
      "codigoLER": "16.01.03",
      "descripcion": "Neumático para vehículos pesados",
      "createdAt": "2025-12-15T10:00:00Z",
      "updatedAt": "2025-12-15T10:00:00Z",
      "_count": {
        "inventarios": 5
      }
    }
  ],
  "total": 150,
  "pages": 15
}
```

#### Errores

**401 Unauthorized**

```json
{
  "error": "No autorizado"
}
```

**500 Internal Server Error**

```json
{
  "error": "Error interno"
}
```

#### Ejemplo de Uso

```bash
# Listar productos con búsqueda
curl -X GET \
  "https://traza-ambiental.com/api/admin/productos?search=Michelin&categoria=B&page=1&limit=20" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 2. Actualizar Producto

**Endpoint:** `PUT /api/admin/productos`

Actualiza un producto existente en el catálogo.

#### Autenticación

- Requiere sesión activa
- Solo rol **ADMINISTRADOR** puede acceder

#### Request Body

```json
{
  "id": "cmio1loon00hwrlrgtndkfifu",
  "nombre": "Neumático R22.5 Actualizado",
  "marca": "Michelin",
  "modelo": "XZA2 Plus",
  "categoria": "B",
  "codigoLER": "16.01.03",
  "descripcion": "Neumático mejorado para vehículos pesados"
}
```

**Campos editables:**

- `nombre` (string): Nombre del producto
- `marca` (string): Marca del producto
- `modelo` (string, opcional): Modelo del producto
- `categoria` (string): Categoría REP (A o B)
- `codigoLER` (string): Código LER (Lista Europea de Residuos)
- `descripcion` (string, opcional): Descripción del producto

**Campo requerido:**

- `id` (string): ID del producto a actualizar

#### Response (200)

```json
{
  "id": "cmio1loon00hwrlrgtndkfifu",
  "nombre": "Neumático R22.5 Actualizado",
  "marca": "Michelin",
  "modelo": "XZA2 Plus",
  "categoria": "B",
  "codigoLER": "16.01.03",
  "descripcion": "Neumático mejorado para vehículos pesados",
  "createdAt": "2025-12-15T10:00:00Z",
  "updatedAt": "2025-12-17T14:30:00Z"
}
```

#### Errores

**400 Bad Request**

```json
{
  "error": "ID requerido"
}
```

**401 Unauthorized**

```json
{
  "error": "No autorizado"
}
```

**500 Internal Server Error**

```json
{
  "error": "Error actualizando producto"
}
```

#### Ejemplo de Uso

```bash
curl -X PUT \
  "https://traza-ambiental.com/api/admin/productos" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "id": "cmio1loon00hwrlrgtndkfifu",
    "nombre": "Neumático R22.5 Actualizado",
    "marca": "Michelin",
    "categoria": "B",
    "codigoLER": "16.01.03"
  }'
```

---

### 3. Eliminar Producto

**Endpoint:** `DELETE /api/admin/productos?id=[id]`

Elimina un producto del catálogo. Solo se permite si el producto no está en uso.

#### Autenticación

- Requiere sesión activa
- Solo rol **ADMINISTRADOR** puede acceder

#### Query Parameters

| Parámetro | Tipo   | Requerido | Descripción                |
| --------- | ------ | --------- | -------------------------- |
| `id`      | string | Sí        | ID del producto a eliminar |

#### Validaciones

El sistema verifica:

- ✅ Que el producto no esté en uso en inventarios activos
- ✅ Que no esté asociado a solicitudes de retiro
- ✅ Que no tenga historial de uso

#### Response (200)

```json
{
  "success": true
}
```

#### Errores

**400 Bad Request**

```json
{
  "error": "ID requerido"
}
```

**409 Conflict**

```json
{
  "error": "No se puede eliminar: El producto está en uso en 5 inventario(s)."
}
```

**401 Unauthorized**

```json
{
  "error": "No autorizado"
}
```

**500 Internal Server Error**

```json
{
  "error": "Error eliminando producto"
}
```

#### Ejemplo de Uso

```bash
curl -X DELETE \
  "https://traza-ambiental.com/api/admin/productos?id=cmio1loon00hwrlrgtndkfifu" \
  -H "Cookie: next-auth.session-token=..."
```

---

## 🔒 Permisos de Acceso

| Rol               | Listar | Actualizar | Eliminar |
| ----------------- | ------ | ---------- | -------- |
| **Administrador** | ✅     | ✅         | ✅       |
| **Otros roles**   | ❌     | ❌         | ❌       |

---

## 📋 Modelo de Datos

### Producto

```typescript
interface Producto {
  id: string;
  nombre: string;
  marca: string;
  modelo?: string;
  categoria: "A" | "B";
  codigoLER: string;
  descripcion?: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    inventarios: number;
  };
}
```

### Categorías REP

- **A**: Neumáticos de vehículos livianos
- **B**: Neumáticos de vehículos pesados, mineros, OTR

---

## 🚨 Manejo de Errores

### Errores Comunes

**Error: "El producto está en uso"**

- El producto no puede eliminarse porque está asociado a inventarios
- Solución: Editar el producto en lugar de eliminarlo
- O eliminar primero los inventarios que lo usan

**Error: "ID requerido"**

- Falta el parámetro `id` en la petición
- Verificar que el ID se esté enviando correctamente

**Error: "No autorizado"**

- El usuario no tiene rol de Administrador
- Verificar permisos del usuario

---

## 📊 Ejemplos de Integración

### React Hook para Listar

```typescript
import { useState, useEffect } from "react";

interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: "A" | "B";
  _count: { inventarios: number };
}

export function useProductos(search?: string, categoria?: string) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (categoria) params.append("categoria", categoria);
    params.append("page", "1");
    params.append("limit", "20");

    fetch(`/api/admin/productos?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.productos);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [search, categoria]);

  return { productos, loading, total };
}
```

### Actualizar Producto

```typescript
async function actualizarProducto(id: string, datos: Partial<Producto>) {
  const response = await fetch("/api/admin/productos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...datos }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}
```

### Eliminar Producto

```typescript
async function eliminarProducto(id: string) {
  const response = await fetch(`/api/admin/productos?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}
```

---

## 📝 Notas Técnicas

### Validaciones

- El nombre del producto debe ser único
- La categoría debe ser 'A' o 'B'
- El código LER debe ser válido
- No se puede eliminar un producto en uso

### Rendimiento

- Paginación recomendada: 10-50 registros por página
- Búsqueda optimizada con índices en nombre, marca y modelo
- Filtros combinables (search + categoria)

### Seguridad

- Solo administradores pueden gestionar productos
- Validación de dependencias antes de eliminar
- Logs de auditoría para cambios

---

**Última actualización:** Diciembre 2025  
**Versión API:** 1.1.0
