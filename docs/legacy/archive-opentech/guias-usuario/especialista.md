# Guía de Usuario - Rol Especialista de Sistema de Gestión REP

## 📊 Introducción

Como **Especialista de Sistema de Gestión REP**, usted es el cerebro analítico del sistema. Su rol es estratégico y fundamental para el cumplimiento de las metas establecidas por el Ministerio del Medio Ambiente según el Decreto Supremo N°1/2021.

### Su Misión

1. Monitorear el cumplimiento global del sistema REP
2. Definir y hacer seguimiento de metas anuales
3. Generar análisis y reportes para stakeholders
4. Identificar mejoras en procesos
5. Asegurar cumplimiento normativo

### Habilidades Requeridas

- Análisis de datos y visualización
- Conocimiento profundo de Ley REP y normativa MMA
- Pensamiento estratégico
- Comunicación efectiva con múltiples stakeholders

---

## 📋 Funcionalidades Principales

### 1. Dashboard de Cumplimiento Global

#### Acceso

**Menú:** `Cumplimiento > Dashboard Global`

Este es su herramienta principal. Proporciona una vista 360° del sistema REP.

#### Secciones del Dashboard

##### A. Indicadores Globales (Top Cards)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ META ANUAL      │ AVANCE ACTUAL   │ BRECHA          │ PROYECCIÓN      │
│ 15,000 ton      │ 67.8%           │ 4,830 ton       │ 98.2% (Dic 31)  │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

- **Meta Anual:** Establecida según normativa MMA
- **Avance Actual:** % y toneladas valorizadas a la fecha
- **Brecha:** Diferencia entre meta y realizado
- **Proyección:** Estimación de cumplimiento al cierre del año

##### B. Gráfico de Evolución Temporal

Visualización mensual del progreso:

- Línea azul: Acumulado realizado
- Línea punteada: Trayectoria ideal
- Área verde: Zona de cumplimiento
- Área roja: Zona de riesgo

**Insights automáticos:**

- "Cumplimiento adelantado en 2.3% respecto a proyección"
- "Desaceleración detectada en últimos 2 meses"
- "Ritmo actual insuficiente para meta anual"

##### C. Distribución por Región

Mapa de Chile con heat map de cumplimiento:

- Verde: Cumpliendo/Superando meta
- Amarillo: En riesgo
- Rojo: Incumplimiento

**Acciones disponibles:**

- Click en región para drill-down
- Ver detalle de generadores en la región
- Identificar cuellos de botella

##### D. Análisis por Actor

Tablas con ranking de:

**Generadores:**
| Generador | Meta | Realizado | % | Estado |
|-----------|------|-----------|---|--------|
| Empresa A | 500t | 480t | 96% | 🟢 |
| Empresa B | 300t | 180t | 60% | 🔴 |
| Empresa C | 800t | 790t | 98% | 🟢 |

**Transportistas:**
| Transportista | Toneladas | Entregas | Eficiencia |
|---------------|-----------|----------|------------|
| Trans A | 1,200t | 45 | 98% |
| Trans B | 890t | 38 | 94% |

**Gestores:**
| Gestor | Capacidad | Utilización | Método Principal |
|--------|-----------|-------------|------------------|
| Valor A | 500t/mes | 78% | Reciclaje |
| Valor B | 300t/mes | 95% | Energético |

##### E. Métodos de Valorización

Gráfico circular mostrando distribución:

- Reciclaje Material: 45%
- Valorización Energética: 35%
- Reutilización: 15%
- Otros: 5%

##### F. Alertas y Notificaciones

Panel de alertas en tiempo real:

🔴 **Críticas:**

- "Generador X con riesgo alto de incumplimiento (35% de meta)"
- "Región Metropolitana 15% bajo proyección"

🟡 **Advertencias:**

- "Capacidad de Gestor Y al 95%, posible cuello de botella"
- "Desaceleración en recolecciones último mes"

🟢 **Positivas:**

- "Meta Q3 alcanzada con 5% de margen"
- "Nuevo récord mensual: 1,450 toneladas"

### 2. Definición de Metas

#### Establecer Meta Anual

**Menú:** `Metas > Definir Meta Anual`

##### Proceso

1. **Seleccionar año objetivo**
   - Ej: 2025

2. **Información base**
   - Sistema muestra volúmenes del año anterior
   - Calcula meta según normativa:

     ```
     Meta = Volumen_Introducido_Año_Anterior × Porcentaje_Normativo

     Ejemplo:
     Volumen 2024: 20,000 toneladas
     % REP 2025: 75%
     Meta 2025: 15,000 toneladas
     ```

3. **Desglose por categoría (opcional)**
   - Neumáticos de auto
   - Neumáticos de camión
   - Neumáticos de moto
   - Industriales/especiales

4. **Desglose regional (opcional)**
   - Distribución de meta por región
   - Basado en volúmenes históricos
   - Ajustable manualmente

5. **Hitos intermedios**
   - Definir submetas trimestrales
   - Establecer alertas de seguimiento

6. **Revisión y aprobación**
   - Vista previa del plan
   - Guardar como borrador o activar
   - Una vez activada, comienza tracking

#### Modificar Meta

Las metas pueden ajustarse solo en casos excepcionales:

- Cambios normativos
- Eventos de fuerza mayor
- Con aprobación de MMA

**Proceso:**

1. `Metas > Meta Actual > Solicitar Modificación`
2. Justificar cambio
3. Adjuntar documentación
4. Sistema registra en auditoría
5. Notifica a stakeholders

### 3. Análisis y Reportes Avanzados

#### A. Generador de Reportes Personalizados

**Menú:** `Reportes > Generador Avanzado`

##### Constructor Drag & Drop

1. **Seleccionar métricas:**
   - KPIs disponibles (drag desde panel lateral)
   - Gráficos (barras, líneas, tortas, mapas)
   - Tablas de datos

2. **Aplicar filtros:**
   - Rango de fechas
   - Regiones específicas
   - Generadores/Transportistas/Gestores
   - Tipo de neumático
   - Método de valorización

3. **Diseñar layout:**
   - Organizar widgets en canvas
   - Ajustar tamaños
   - Agregar textos y títulos

4. **Guardar template:**
   - Nombre del reporte
   - Categoría
   - Compartir con otros usuarios
   - Programar generación automática

5. **Exportar:**
   - PDF (presentación)
   - Excel (datos crudos)
   - PowerPoint (slides)
   - Enviar por email

#### B. Reportes Predefinidos

##### Reporte Mensual de Cumplimiento

- **Frecuencia:** Automático el día 1 de cada mes
- **Contenido:**
  - Resumen ejecutivo
  - KPIs mensuales
  - Comparativa con mes anterior
  - Avance anual acumulado
  - Alertas y recomendaciones

##### Reporte Trimestral MMA

- **Frecuencia:** Trimestral (plazo: 15 días después del cierre)
- **Formato:** Según template oficial MMA
- **Contenido:**
  - Volúmenes valorizados
  - Desglose por método
  - Distribución regional
  - Certificados emitidos
  - Cumplimiento vs. meta
- **Envío:** Integración automática con plataforma MMA (si disponible)

##### Reporte Anual de Gestión

- **Frecuencia:** Anual
- **Contenido:**
  - Análisis completo del año
  - Comparativa con años anteriores
  - Lecciones aprendidas
  - Recomendaciones para próximo año
  - Estadísticas completas

#### C. Análisis Predictivo

**Menú:** `Análisis > Proyecciones`

##### Proyección de Cumplimiento

Sistema utiliza modelos estadísticos para proyectar:

- Cumplimiento al cierre del año
- Intervalo de confianza (95%)
- Factores de riesgo identificados

**Visualización:**

```
Proyección al 31/12/2025:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░ 98.2% (14,730 ton)

Escenarios:
- Optimista (95% confianza): 102.3%
- Esperado: 98.2%
- Pesimista (95% confianza): 94.1%
```

##### Simulaciones "What-If"

Herramienta para simular escenarios:

**Ejemplo:**

- ¿Qué pasa si Gestor X aumenta capacidad en 20%?
- ¿Cuántas toneladas adicionales necesito en Región Y?
- ¿Impacto de nuevo generador con 500 ton/año?

**Proceso:**

1. Definir parámetro a modificar
2. Establecer nuevo valor
3. Sistema recalcula proyección
4. Compara con escenario base
5. Visualiza impacto

### 4. Monitoreo en Tiempo Real

#### Vista de Operaciones en Vivo

**Menú:** `Monitoreo > Tiempo Real`

Dashboard estilo "sala de control" con:

##### A. Actividad Reciente

Stream de eventos en tiempo real:

```
🚛 10:23 - Transportista A recogió 2.5 ton en Santiago
♻️  10:15 - Gestor B valorizó 4.8 ton (Reciclaje)
📜 10:02 - Certificado #1234 emitido para Generador C
🏭 09:45 - Generador D registró 150 neumáticos nuevos
```

##### B. Mapa de Movimientos

Mapa de Chile mostrando:

- Transportes en curso (íconos en movimiento)
- Centros de acopio (círculos azules)
- Instalaciones de gestores (círculos verdes)
- Flujos principales (líneas animadas)

##### C. Capacidades en Tiempo Real

Medidores de capacidad de gestores:

```
Gestor Norte:  ▓▓▓▓▓▓▓▓░░ 82%
Gestor Centro: ▓▓▓▓▓▓▓▓▓░ 95% ⚠️
Gestor Sur:    ▓▓▓▓░░░░░░ 45%
```

### 5. Gestión de Alertas

#### Configurar Alertas Personalizadas

**Menú:** `Configuración > Alertas`

##### Tipos de Alertas Disponibles

1. **Alertas de Cumplimiento**
   - Desviación > X% de proyección
   - Meta mensual no alcanzada
   - Generador en riesgo de incumplimiento

2. **Alertas de Capacidad**
   - Gestor > 90% capacidad
   - Escasez de transportistas en región
   - Punto de acopio saturado

3. **Alertas de Calidad**
   - Retraso en emisión de certificados
   - Inconsistencia en datos
   - Registro sin validar > X días

4. **Alertas Normativas**
   - Plazo de declaración próximo
   - Cambio en normativa REP
   - Requerimiento de MMA

##### Configuración

Para cada tipo:

- ✅ Activar/Desactivar
- 🔔 Canales (Email, SMS, Push, Slack)
- ⚙️ Umbrales personalizados
- 👥 Destinatarios
- 📅 Horario de notificaciones

### 6. Colaboración y Stakeholders

#### Gestión de Usuarios

**Menú:** `Administración > Usuarios`

Como Especialista, puede:

- Ver listado de todos los usuarios del sistema
- Filtrar por rol
- Ver actividad reciente de usuarios
- Detectar usuarios inactivos
- Solicitar ajustes de permisos a Administrador

#### Comunicación Integrada

**Menú:** `Comunicación > Mensajes`

Sistema de mensajería interno:

- Enviar mensajes a generadores
- Solicitar información adicional
- Coordinar con transportistas y gestores
- Notificar cambios en metas o procesos

### 7. Exportación de Datos

#### Data Export Center

**Menú:** `Datos > Exportar`

##### Exportaciones Disponibles

1. **Exportación Completa**
   - Todos los datos del sistema
   - Formato: SQL dump, CSV bundle, JSON
   - Para análisis externo en BI tools

2. **Exportación Personalizada**
   - Seleccionar tablas específicas
   - Aplicar filtros de fecha
   - Elegir campos a incluir

3. **Exportación para Auditoría**
   - Formato inmutable
   - Incluye hashes de verificación
   - Sello de tiempo certificado

4. **API Access**
   - Generar API key personal
   - Documentación de endpoints
   - Rate limits y cuotas

### 8. Benchmarking y Comparativas

#### Análisis Comparativo

**Menú:** `Análisis > Benchmarking`

##### Comparación Temporal

Comparar diferentes períodos:

- Año actual vs. año anterior
- Trimestre vs. trimestre
- Variación mensual

**Métricas comparadas:**

- Volúmenes valorizados
- Eficiencia de cadena
- Costos promedio
- Tiempos de proceso

##### Comparación Regional

Ranking de regiones:

```
1. Región de Valparaíso    105.2% ⭐
2. Región Metropolitana    98.7%
3. Región del Biobío       96.3%
...
15. Región de Aysén        78.1% 🔴
```

##### Comparación Internacional (futuro)

Si se integran datos de otros países con sistemas similares:

- Chile vs. otros países con EPR
- Benchmarks de mejores prácticas
- Adopción de estándares internacionales

---

## ✅ Checklist del Especialista

### Rutina Diaria

- [ ] Revisar dashboard global al inicio del día
- [ ] Verificar alertas críticas
- [ ] Revisar actividad de las últimas 24 horas
- [ ] Responder consultas de stakeholders

### Rutina Semanal

- [ ] Generar reporte semanal de tendencias
- [ ] Analizar desviaciones de proyección
- [ ] Reunión con equipo (si aplica)
- [ ] Actualizar presentación para dirección

### Rutina Mensual

- [ ] Generar reporte mensual completo
- [ ] Analizar cumplimiento mensual vs. meta
- [ ] Revisar y ajustar proyecciones
- [ ] Proponer mejoras en procesos
- [ ] Comunicar estado a stakeholders

### Rutina Trimestral

- [ ] Preparar reporte trimestral para MMA
- [ ] Análisis profundo de tendencias
- [ ] Evaluación de actores (generadores, transportistas, gestores)
- [ ] Presentación a alta dirección
- [ ] Planificación trimestre siguiente

### Rutina Anual

- [ ] Reporte anual de gestión
- [ ] Definir meta para próximo año
- [ ] Lecciones aprendidas
- [ ] Proponer cambios estratégicos
- [ ] Auditoría de cumplimiento

---

## 📊 KPIs del Especialista

Indicadores para medir su desempeño:

1. **Precisión de Proyecciones**
   - Meta: Desviación < 3% entre proyección y real

2. **Tiempo de Respuesta a Alertas**
   - Meta: < 4 horas en alertas críticas

3. **Cumplimiento de Plazos de Reportes**
   - Meta: 100% de reportes a tiempo

4. **Efectividad de Recomendaciones**
   - Meta: > 80% de recomendaciones implementadas exitosamente

5. **Satisfacción de Stakeholders**
   - Meta: > 4.5/5 en encuestas de satisfacción

---

## 🆘 Preguntas Frecuentes

### ¿Puedo modificar datos operacionales?

No. Como Especialista, su rol es de análisis y monitoreo, no de ejecución. Puede visualizar todos los datos pero no modificarlos. Si detecta un error, debe contactar al actor correspondiente o al Administrador.

### ¿Cómo manejo datos sensibles?

- Aplique filtros de anonimización en reportes compartidos
- Agregue datos cuando presente a terceros
- Respete acuerdos de confidencialidad
- Use permisos de "solo visualización" al compartir dashboards

### ¿Qué hago si detecto incumplimiento grave?

1. Documentar el hallazgo
2. Generar reporte específico
3. Notificar a generador afectado
4. Escalar a Administrador/Dirección
5. Proponer plan de acción correctiva
6. Si es normativo, coordinar con área legal

### ¿Puedo crear sub-usuarios?

No directamente, pero puede solicitar al Administrador la creación de "Especialistas Junior" o "Analistas" con permisos reducidos para asistirle.

---

## 📞 Soporte

### Soporte Técnico

- **Email:** soporte@trazambiental.com
- **Prioridad:** Alta (respuesta < 2 horas)

### Soporte en Análisis de Datos

- **Email:** data@trazambiental.com
- Consultas sobre interpretación de datos, modelos estadísticos

### Soporte Normativo

- **Email:** legal@trazambiental.com
- Interpretación de normativa REP y MMA

---

## 📚 Recursos Adicionales

- [Video Tutorial: Dashboard de Cumplimiento](link)
- [Guía de Interpretación de Normativa REP](link)
- [Plantillas de Reportes](link)
- [Mejores Prácticas en Análisis de Cumplimiento](link)
- [Webinar: Análisis Predictivo](link)

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0
