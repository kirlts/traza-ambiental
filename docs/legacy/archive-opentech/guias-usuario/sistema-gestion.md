# Guía de Usuario - Sistema de Gestión

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Dashboard Principal](#dashboard-principal)
4. [Configuración de Metas](#configuración-de-metas)
5. [Monitoreo de Cumplimiento](#monitoreo-de-cumplimiento)
6. [Historial de Metas](#historial-de-metas)
7. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Como **Sistema de Gestión**, usted es responsable de cumplir con las metas anuales de recolección y valorización de Neumáticos Fuera de Uso (NFU) establecidas en el Decreto Supremo N°8. Esta guía le ayudará a utilizar la plataforma TrazAmbiental para:

- Configurar sus metas anuales
- Monitorear el avance en tiempo real
- Proyectar el cumplimiento
- Mantener historial de años anteriores
- Generar reportes de cumplimiento

---

## Acceso al Sistema

### Credenciales

Para acceder al sistema, utilice sus credenciales proporcionadas por TrazAmbiental:

- **URL:** https://traza-ambiental.com/login
- **Email:** [su correo registrado]
- **Contraseña:** [su contraseña]

> 🔒 **Seguridad:** Cambie su contraseña periódicamente y no la comparta con terceros.

### Primer Ingreso

1. Navegue a la URL de inicio de sesión
2. Ingrese su email y contraseña
3. El sistema lo redirigirá automáticamente al **Dashboard del Sistema de Gestión**

---

## Dashboard Principal

El dashboard principal le muestra una vista general del cumplimiento de sus metas.

### Elementos del Dashboard

#### 1. Tarjetas de Metas

**Meta de Recolección:**

- Muestra el avance en toneladas
- Porcentaje de cumplimiento
- Barra de progreso visual
- Estado del cumplimiento (✓ Cumplida, ↗ Cerca, → En progreso, ⚠ Alerta, ⚠ Crítico)
- Proyección de cumplimiento

**Meta de Valorización:**

- Misma información que meta de recolección
- Específica para toneladas valorizadas

#### 2. Interpretación de Estados

| Estado        | Porcentaje | Significado       |
| ------------- | ---------- | ----------------- |
| ✓ Cumplida    | ≥ 100%     | Meta alcanzada    |
| ↗ Cerca       | 90-99%     | Próximo a cumplir |
| → En progreso | 50-89%     | Avance normal     |
| ⚠ Alerta      | 25-49%     | Requiere atención |
| ⚠ Crítico     | < 25%      | Acción urgente    |

#### 3. Proyecciones

El sistema calcula automáticamente:

- **Ritmo actual:** Toneladas recolectadas/valorizadas por mes
- **Fecha estimada de cumplimiento:** Cuándo se alcanzará la meta
- **Alerta de incumplimiento:** Si el ritmo no permite cumplir la meta

### Acciones Rápidas

Desde el dashboard puede:

- Acceder a **Configuración de Metas**
- Ver detalles de metas históricas
- Actualizar metas existentes

---

## Configuración de Metas

### Paso 1: Acceder a Configuración

1. Desde el dashboard, haga clic en **"Configuración de Metas"** en el menú lateral
2. O use el botón de acción rápida **"Configurar / Modificar Metas"**

### Paso 2: Ingresar Metas

El formulario contiene dos campos principales:

#### Meta de Recolección (toneladas)

- Ingrese el peso total de NFU que debe recolectar durante el año
- Formato: número decimal con hasta 2 decimales (ej: 1000.50)
- **Requerido**

#### Meta de Valorización (toneladas)

- Ingrese el peso total de NFU que debe valorizar durante el año
- Formato: número decimal con hasta 2 decimales (ej: 800.00)
- **Requerido**

> 💡 **Tip:** La meta de valorización típicamente es menor o igual a la de recolección. Si ingresa una meta de valorización mayor, el sistema le pedirá confirmación.

### Paso 3: Validaciones Automáticas

El sistema valida:

- ✅ Números positivos mayores a 0
- ✅ Formato correcto (2 decimales)
- ⚠️ Advertencia si valorización > recolección
- ⚠️ Advertencia si cambio es > 10% (requiere justificación)

### Paso 4: Guardar

1. Haga clic en **"💾 Guardar Metas"** o **"💾 Actualizar Metas"**
2. Revise el resumen en el modal de confirmación
3. Confirme la operación
4. El sistema guardará las metas y actualizará el dashboard

### Ejemplo Práctico

**Escenario:** Sistema de Gestión de 5 productores

```
Meta de Recolección: 1250.00 toneladas
Meta de Valorización: 1000.00 toneladas

Cálculo:
- 80% de la recolección debe valorizarse
- 1250 × 0.80 = 1000 toneladas
```

---

## Monitoreo de Cumplimiento

### Avance en Tiempo Real

El sistema calcula automáticamente el avance basado en:

- Certificados de valorización emitidos por gestores
- Registros de recolección de transportistas
- Integración con sistemas de gestión

### Indicadores Clave

#### Porcentaje de Avance

```
% Avance = (Avance Actual / Meta Total) × 100
```

#### Toneladas Faltantes

```
Faltante = Meta Total - Avance Actual
```

#### Ritmo Actual (ton/mes)

```
Ritmo = Avance Actual / Meses Transcurridos
```

### Proyección de Cumplimiento

El sistema proyecta si cumplirá la meta:

**Caso 1: Proyección Positiva**

```
"Se proyecta cumplir la meta en 15/11/2025"
```

✅ El ritmo actual permitirá cumplir la meta

**Caso 2: Proyección Negativa**

```
"A ritmo actual, faltarían 150 toneladas al finalizar el año"
```

⚠️ Debe acelerar el ritmo de recolección/valorización

**Caso 3: Meta Cumplida**

```
"¡Meta ya cumplida!"
```

🎉 Felicitaciones, ha alcanzado su objetivo

### Notificaciones Automáticas

Recibirá notificaciones cuando:

- 🔔 No hay metas configuradas para el año actual
- 🔔 Alcanza el 90% de la meta (cerca de cumplir)
- 🔔 El ritmo actual no permitirá cumplir la meta
- 🔔 Meta cumplida exitosamente

---

## Historial de Metas

### Consultar Años Anteriores

En la sección **"Historial de Metas"** puede ver:

- Metas configuradas de años pasados
- Si fueron cumplidas o no
- Porcentaje de cumplimiento final
- Toneladas recolectadas y valorizadas

### Ejemplo de Historial

```
📅 Año 2024
  Recolección: 800 ton
  ✅ Cumplido: 812 ton (101.5%)

  Valorización: 640 ton
  ✅ Cumplido: 658 ton (102.8%)

📅 Año 2023
  Recolección: 600 ton
  ✅ Cumplido: 625 ton (104.2%)

  Valorización: 480 ton
  ✅ Cumplido: 505 ton (105.2%)
```

### Uso del Historial

- **Benchmarking:** Compare con años anteriores
- **Planificación:** Base para definir metas futuras
- **Reportes:** Evidencia de cumplimiento ante el MMA
- **Auditoría:** Trazabilidad completa de metas

---

## Importar Metas desde Declaración (Avanzado)

### ¿Cuándo usar esta función?

Si su sistema de gestión está vinculado a un productor que ha declarado neumáticos en SINADER, puede importar automáticamente las metas calculadas.

### Proceso

1. El productor debe haber enviado su Declaración Anual
2. El sistema calcula automáticamente las metas según D.S. N°8:
   - Meta Recolección = Toneladas declaradas × % REP del año
   - Meta Valorización = Meta Recolección × 80%
3. Use el botón **"📥 Importar desde Declaración"**
4. Seleccione la declaración del productor
5. El sistema importará las metas automáticamente

### Ventajas

- ✅ Cálculo automático según normativa
- ✅ Consistencia con declaraciones del productor
- ✅ Ahorra tiempo de configuración manual
- ✅ Reduce errores de cálculo

---

## Preguntas Frecuentes

### ¿Puedo modificar mis metas durante el año?

Sí, puede modificar las metas en cualquier momento. Sin embargo:

- Si el cambio es > 10%, debe proporcionar una justificación
- No puede reducir la meta por debajo del avance actual
- Todos los cambios quedan registrados en auditoría

### ¿Qué pasa si no alcanzo mi meta?

El sistema le alertará con anticipación si el ritmo no permite cumplir la meta. Debe:

1. Revisar las proyecciones del dashboard
2. Acelerar la recolección y valorización
3. Coordinar con transportistas y gestores
4. Reportar al productor la situación

### ¿Cómo se calcula el avance?

El avance se calcula automáticamente basado en:

- Certificados de valorización emitidos por gestores
- Guías de transporte registradas
- Registros de recepción de NFU

### ¿Puedo ver metas de otros sistemas de gestión?

No, por seguridad y privacidad, solo puede ver sus propias metas.

### ¿Con qué frecuencia se actualiza el avance?

El avance se actualiza en tiempo real cada vez que:

- Un gestor emite un certificado
- Se registra una nueva recolección
- Se valida un proceso de valorización

### ¿Qué formato tienen los reportes?

Los reportes de cumplimiento incluyen:

- Metas configuradas
- Avance actual
- Proyecciones
- Historial comparativo
- Gráficos visuales

### Exportación para SINADER/RETC

#### Descargar Archivo Excel desde Reportes Anuales

Como **Sistema de Gestión**, puede exportar sus reportes anuales en formato Excel compatible con **SINADER** (Sistema Nacional de Declaración de Residuos) y **RETC** para cumplimiento regulatorio.

**Ubicación:** `Dashboard > Reportes > Reporte Anual`

**Proceso:**

1. **Acceder a Reportes Anuales**
   - Navegue a `Reportes > Reporte Anual` desde el menú lateral
   - Seleccione el año que desea exportar

2. **Cargar Datos del Reporte**
   - Haga clic en **"📊 Generar Reporte"** o **"🔄 Cargar Datos"**
   - Espere a que el sistema procese los datos del año seleccionado
   - Verifique que aparezcan las métricas y estadísticas

3. **Descargar Excel RETC**
   - En la sección **"Opciones de Exportación"**, haga clic en **"📊 Descargar Excel RETC"**
   - El archivo se descargará automáticamente con el nombre: `Reporte_Anual_RETC_SG_[AÑO]_[RUT].xlsx`

**Contenido del Archivo:**

El archivo Excel generado contiene múltiples hojas:

#### Hoja 1: Resumen Anual RETC

- Información general del reporte
- Año de reporte
- Sistema de Gestión
- RUT del Sistema de Gestión
- Fecha de generación
- Métricas clave (toneladas valorizadas, unidades, certificados emitidos)

#### Hoja 2: Detalle Certificados

Tabla completa con:

- Folio del certificado
- Fecha de emisión
- RUT y Razón Social del Generador
- Región y Comuna de origen
- Categorías de neumáticos
- Tratamientos aplicados
- Peso valorizado (kg)
- Cantidad de unidades
- RUT y Razón Social del Gestor

#### Hoja 3: Desglose por Región

- Total de unidades por región
- Total de peso (toneladas) por región
- Distribución geográfica del cumplimiento

#### Hoja 4: Desglose por Categoría

- Total de unidades por categoría de neumático
- Total de peso (toneladas) por categoría
- Análisis por tipo de residuo

#### Hoja 5: Desglose por Tratamiento

- Total de unidades por tipo de tratamiento
- Total de peso (toneladas) por tratamiento
- Distribución de valorización

#### Hoja 6: Desglose por Gestor

- Razón Social y RUT de cada gestor
- Total de unidades procesadas por gestor
- Total de peso (toneladas) por gestor
- Análisis de participación de gestores

**Uso del Archivo:**

1. **Revisión de Datos**
   - Verifique la consistencia de los datos en todas las hojas
   - Confirme que los totales coincidan entre hojas
   - Revise que no haya discrepancias

2. **Carga en SINADER**
   - Utilice el archivo para completar su declaración en SINADER
   - Los datos están estructurados para facilitar la carga masiva
   - Siga las instrucciones del portal oficial

3. **Cumplimiento Regulatorio**
   - El archivo sirve como evidencia de cumplimiento
   - Puede adjuntarse en reportes al MMA
   - Facilita auditorías y verificaciones

**Validaciones Incluidas:**

- ✅ Verificación de consistencia de datos
- ✅ Validación de totales (peso, unidades)
- ✅ Agrupación correcta por dimensiones (región, categoría, tratamiento, gestor)
- ✅ Formato compatible con sistemas gubernamentales

**Notas Importantes:**

- ⚠️ Debe cargar los datos del reporte antes de exportar
- ⚠️ Solo se incluyen certificados con estado "emitido"
- ⚠️ El archivo refleja datos del año seleccionado únicamente
- ✅ El formato cumple con requisitos de SINADER/RETC
- ✅ Incluye validaciones de integridad de datos

---

## Soporte Técnico

### Contacto

- **Email:** soporte@trazambiental.com
- **Teléfono:** +56 2 XXXX XXXX
- **Horario:** Lunes a Viernes, 9:00 - 18:00

### Documentación Adicional

- [Manual Técnico Completo](../README.md)
- [Roles y Permisos](../roles-y-permisos.md)
- [Ley REP y D.S. N°8](../Investigacion/)

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.1.0
