# Guía de Usuario - Transportista

## Acceso al Sistema

1. Inicia sesión con tus credenciales en `/login`
2. Usuario de prueba: `transportista@trazambiental.com` / `transportista123`
3. Serás redirigido al Dashboard del Transportista

## Módulo de Solicitudes Disponibles

### Acceso

Desde el Dashboard, haz clic en el card "Solicitudes de Transporte" o en el botón "Ver Solicitudes Disponibles".

### Filtros

Puedes filtrar solicitudes por:

- **Región**: Selecciona una región específica de Chile
- **Peso Mín**: Filtra por peso mínimo en kg
- **Peso Máx**: Filtra por peso máximo en kg
- **Ordenar por**: Fecha preferida o Peso

Haz clic en "Aplicar Filtros" para aplicar los cambios o "Limpiar" para resetear.

### Vista de Lista

Cada tarjeta muestra:

- **Folio** de la solicitud
- **Región y Comuna** del retiro
- **Generador**: Nombre de quien solicita el servicio
- **Dirección** de retiro
- **Carga**: Peso estimado y cantidad de unidades
- **Fecha preferida** de retiro

### Acciones sobre Solicitudes

#### Ver Detalles

Haz clic en "Ver Detalles" para ver información completa de la solicitud.

#### Aceptar Solicitud

1. Haz clic en el botón "✅ Aceptar"
2. Se seleccionará automáticamente tu primer vehículo activo
3. El sistema verificará que tengas capacidad suficiente
4. Si todo está bien, la solicitud será aceptada
5. Se notificará al generador automáticamente

#### Rechazar Solicitud

1. Haz clic en el botón "❌ Rechazar"
2. Selecciona un motivo de rechazo:
   - Fuera de mi zona de cobertura
   - Carga no compatible con mi vehículo
   - Capacidad excedida
   - Horario no disponible
   - Otro motivo
3. (Opcional) Agrega detalles adicionales
4. Haz clic en "Confirmar Rechazo"
5. Se notificará al generador automáticamente

### Vista de Mapa

Haz clic en el botón "🗺️ Mapa" para ver las solicitudes en un mapa interactivo.

**Nota**: La geocodificación de direcciones está en desarrollo. Por ahora el mapa usa posiciones aproximadas.

### Dashboard de Flota

El sistema muestra un dashboard interactivo con la capacidad de cada vehículo:

**Por vehículo verás:**

- **Tipo** y **Patente**
- **Estado**: Badge verde (Activo), amarillo (Mantenimiento) o gris (Inactivo)
- **Barra de progreso**: Visualiza el porcentaje de uso
- **Capacidad usada vs disponible** en kg
- **Solicitudes activas**: Número de solicitudes asignadas

**Colores de barra:**

- 🟢 Verde: Menos del 50% de capacidad usada
- 🟡 Amarillo: Entre 50-80% de capacidad usada
- 🔴 Rojo: Más del 80% de capacidad usada

**Botón "🔄 Actualizar"**: Actualiza manualmente la información de flota

### Actualizaciones en Tiempo Real

El sistema actualiza automáticamente cada 30 segundos las:

- Solicitudes disponibles
- Estado de capacidad de cada vehículo en el dashboard de flota

## Gestión de Vehículos

### Ver Mis Vehículos

Los vehículos se gestionan desde el backend. Actualmente el sistema tiene registrados:

- Vehículo 1: Patente HJKL-12 (Camión, 8000 kg)
- Vehículo 2: Patente MNOP-34 (Camioneta, 1500 kg)

### Estados del Vehículo

- **Activo**: Disponible para asignar solicitudes
- **Mantenimiento**: En reparación, no disponible
- **Inactivo**: Fuera de servicio

## Mis Solicitudes Aceptadas

Próximamente podrás ver un listado de tus solicitudes aceptadas con su estado actual (ACEPTADA, EN_CAMINO, RECOLECTADA).

## Notificaciones

Recibirás notificaciones cuando:

- Se creen nuevas solicitudes en tu zona
- Se cambie el estado de una solicitud que has aceptado

## Consideraciones Importantes

1. **Capacidad**: Solo podrás aceptar solicitudes si tienes capacidad disponible
2. **Vehículos Activos**: Solo se consideran vehículos en estado "activo" para el cálculo de capacidad
3. **Rechazo**: Al rechazar una solicitud, debes proporcionar un motivo
4. **Responsabilidad**: Al aceptar una solicitud, te comprometes a realizar el retiro en la fecha acordada

## Soporte

Si tienes dudas o problemas:

- Contacta al Administrador del Sistema
- Email: admin@trazambiental.com
