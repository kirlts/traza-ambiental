# 📖 Guía: ¿Cómo se Llena el Módulo de Tratamientos?

## 🎯 Resumen Rápido

El módulo **"Asignar Tratamientos"** se llena automáticamente cuando el gestor **valida físicamente una recepción** de neumáticos. Los lotes aparecen en este módulo cuando las solicitudes cambian a estado **`RECIBIDA_PLANTA`**.

---

## 📋 Flujo Completo del Proceso

### **Paso 1: Generador crea Solicitud de Retiro**

- **Rol**: Generador
- **Estado**: `PENDIENTE`
- **Ubicación**: `/dashboard/generador/solicitudes/nueva`
- El generador completa el formulario y envía la solicitud

### **Paso 2: Transportista acepta la Solicitud**

- **Rol**: Transportista
- **Estado**: `ACEPTADA`
- **Ubicación**: `/dashboard/transportista/solicitudes`
- El transportista acepta y asigna un vehículo

### **Paso 3: Transportista recolecta los Neumáticos**

- **Rol**: Transportista
- **Estado**: `RECOLECTADA`
- El transportista marca la recolección como completada

### **Paso 4: Transportista entrega al Gestor**

- **Rol**: Transportista
- **Estado**: `ENTREGADA_GESTOR`
- **Ubicación**: `/dashboard/transportista/solicitudes`
- El transportista confirma la entrega y selecciona un gestor
- **Nota**: En este punto, la solicitud aparece en "Recepciones Pendientes" del gestor

### **Paso 5: ⭐ Gestor valida la Recepción Física**

- **Rol**: Gestor
- **Estado cambia a**: `RECIBIDA_PLANTA`
- **Ubicación**: `/dashboard/gestor/recepciones`
- **Acción clave**: El gestor debe hacer clic en **"Validar Recepción"** en cada recepción pendiente
- En el formulario, el gestor ingresa:
  - Peso real según romana
  - Cantidad verificada
  - Categorías verificadas
  - Observaciones (opcional)

### **Paso 6: ✅ Lote aparece en Módulo de Tratamientos**

- **Rol**: Gestor
- **Estado**: `RECIBIDA_PLANTA`
- **Ubicación**: `/dashboard/gestor/tratamientos`
- Una vez validada la recepción, el lote aparece automáticamente en este módulo
- El gestor puede asignar el tipo de tratamiento

---

## 🔄 Diagrama Visual del Flujo

```
┌─────────────────────────────────────────────────────────────┐
│  1. GENERADOR                                                │
│  Crea Solicitud de Retiro                                    │
│  Estado: PENDIENTE                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  2. TRANSPORTISTA                                            │
│  Acepta Solicitud                                            │
│  Estado: ACEPTADA → EN_CAMINO → RECOLECTADA                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  3. TRANSPORTISTA                                            │
│  Confirma Entrega al Gestor                                  │
│  Estado: ENTREGADA_GESTOR                                    │
│                                                              │
│  👉 Aparece en: /dashboard/gestor/recepciones               │
│     (Recepciones Pendientes)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. ⭐ GESTOR - ACCIÓN CLAVE                                │
│  Valida Recepción Física                                     │
│  - Peso en romana                                            │
│  - Cantidad verificada                                       │
│  - Categorías verificadas                                    │
│                                                              │
│  Estado cambia a: RECIBIDA_PLANTA                           │
│                                                              │
│  👉 Acción: "Validar Recepción" en cada card                │
│     /dashboard/gestor/recepciones                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  5. ✅ LOTE DISPONIBLE EN TRATAMIENTOS                      │
│  Estado: RECIBIDA_PLANTA                                     │
│                                                              │
│  👉 Aparece en: /dashboard/gestor/tratamientos              │
│     Listo para asignar tratamiento                          │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Pasos para Llenar el Módulo de Tratamientos

### **Opción 1: Usando el Flujo Normal (Recomendado)**

1. **Asegúrate de tener recepciones pendientes**:
   - Ve a `/dashboard/gestor/recepciones`
   - Debes ver cards con el botón **"Validar Recepción"**

2. **Valida cada recepción**:
   - Haz clic en **"Validar Recepción"** en cada card
   - Completa el formulario con:
     - ✅ Peso real (en romana)
     - ✅ Cantidad verificada
     - ✅ Categorías (A y/o B)
     - ✅ Observaciones (opcional)
   - Haz clic en **"Confirmar Validación"**

3. **Verifica que aparezca en Tratamientos**:
   - Ve a `/dashboard/gestor/tratamientos`
   - El lote debería aparecer en la lista

### **Opción 2: Usando Datos de Prueba (Para Testing)**

Si no tienes recepciones pendientes, puedes crear datos de prueba ejecutando:

```bash
# Ejecutar el seeder de solicitudes (si existe)
npm run seed:solicitudes

# O crear datos directamente en la base de datos
```

---

## 🔍 Verificar el Estado Actual

Para verificar en qué estado están tus solicitudes, puedes ejecutar esta consulta SQL:

```sql
-- Ver solicitudes por estado
SELECT
  folio,
  estado,
  "gestorId",
  "fechaEntregaGestor",
  "fechaRecepcionPlanta"
FROM solicitudes_retiro
WHERE "gestorId" IS NOT NULL
ORDER BY estado, "createdAt" DESC;
```

**Estados esperados:**

- `ENTREGADA_GESTOR` → Aparece en "Recepciones Pendientes", necesita validación
- `RECIBIDA_PLANTA` → Aparece en "Asignar Tratamientos", listo para tratamiento

---

## ❓ Preguntas Frecuentes

### **¿Por qué no veo lotes en el módulo de tratamientos?**

- Verifica que tengas solicitudes en estado `RECIBIDA_PLANTA`
- Asegúrate de haber validado las recepciones pendientes primero
- Verifica que las solicitudes estén asignadas a tu usuario gestor

### **¿Cómo creo datos de prueba?**

Puedes usar el seeder de solicitudes o crear solicitudes manualmente siguiendo el flujo completo:

1. Generador crea solicitud
2. Transportista acepta y recolecta
3. Transportista entrega a tu gestor
4. Tú validas la recepción
5. Aparece en tratamientos

### **¿Puedo asignar tratamiento sin validar primero?**

No. El sistema requiere que la recepción esté validada (estado `RECIBIDA_PLANTA`) antes de poder asignar un tratamiento.

---

## 📝 Resumen

**Para que aparezcan lotes en el módulo de Tratamientos:**

1. ✅ Debes tener solicitudes en estado `ENTREGADA_GESTOR` (en Recepciones Pendientes)
2. ✅ Debes validar cada recepción usando el formulario "Validar Recepción"
3. ✅ Al validar, el estado cambia a `RECIBIDA_PLANTA`
4. ✅ Automáticamente aparecen en `/dashboard/gestor/tratamientos`

**En resumen**: El módulo se llena cuando **validas las recepciones físicas** de los neumáticos entregados por el transportista.
