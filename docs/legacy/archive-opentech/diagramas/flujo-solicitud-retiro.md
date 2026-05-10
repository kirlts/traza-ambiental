# Diagramas - Flujo de Solicitud de Retiro

## 📊 Diagrama de Flujo Principal (Mermaid)

```mermaid
flowchart TD
    Start([Generador inicia sesión]) --> CheckCuenta{¿Cuenta aprobada?}

    CheckCuenta -->|No| Bloqueado[❌ Mensaje: Cuenta pendiente de aprobación]
    CheckCuenta -->|Sí| Dashboard[Dashboard Generador]

    Dashboard --> NuevaSolicitud[➕ Presiona: Nueva Solicitud]

    NuevaSolicitud --> Paso1[📍 Paso 1: Información del Retiro]

    Paso1 --> InputDireccion[Ingresa dirección, región, comuna]
    InputDireccion --> InputFecha[Selecciona fecha y horario preferido]
    InputFecha --> ValidarPaso1{¿Datos válidos?}

    ValidarPaso1 -->|No| ErrorPaso1[❌ Mostrar errores]
    ErrorPaso1 --> Paso1
    ValidarPaso1 -->|Sí| Paso2[🚗 Paso 2: Detalles NFU]

    Paso2 --> InputCategorias[Ingresa cantidades y pesos por categoría]
    InputCategorias --> CalcularTotales[Sistema calcula totales]
    CalcularTotales --> ValidarPaso2{¿Al menos una categoría?}

    ValidarPaso2 -->|No| ErrorPaso2[❌ Error: Ingrese al menos una categoría]
    ErrorPaso2 --> Paso2
    ValidarPaso2 -->|Sí| Paso3[📞 Paso 3: Contacto e Instrucciones]

    Paso3 --> InputContacto[Ingresa nombre y teléfono contacto]
    InputContacto --> InputInstrucciones[Instrucciones adicionales opcional]
    InputInstrucciones --> OpcionFotos{¿Agregar fotos?}

    OpcionFotos -->|Sí| SubirFotos[📷 Sube hasta 5 fotos]
    SubirFotos --> ValidarFotos{¿Fotos válidas?}
    ValidarFotos -->|No| ErrorFotos[❌ Error: Tamaño/formato]
    ErrorFotos --> OpcionFotos
    ValidarFotos -->|Sí| ValidarPaso3

    OpcionFotos -->|No| ValidarPaso3{¿Datos válidos?}

    ValidarPaso3 -->|No| ErrorPaso3[❌ Mostrar errores]
    ErrorPaso3 --> Paso3
    ValidarPaso3 -->|Sí| OpcionGuardar{Usuario elige acción}

    OpcionGuardar -->|Guardar Borrador| GuardarBorrador[💾 Guardar como borrador]
    GuardarBorrador --> MensajeBorrador[✅ Borrador guardado]
    MensajeBorrador --> Dashboard

    OpcionGuardar -->|Enviar| ModalConfirmacion[📋 Modal de confirmación]

    ModalConfirmacion --> UsuarioConfirma{¿Confirma?}
    UsuarioConfirma -->|No| Paso3
    UsuarioConfirma -->|Sí| ProcesarSolicitud[🔄 Procesar solicitud]

    ProcesarSolicitud --> GenerarFolio[Generar folio único SOL-YYYYMMDD-XXXX]
    GenerarFolio --> GuardarDB[(💾 Guardar en Base de Datos)]
    GuardarDB --> SubirFotosStorage[☁️ Subir fotos a storage]
    SubirFotosStorage --> CrearCambioEstado[📝 Crear registro CambioEstado]
    CrearCambioEstado --> EnviarEmails[📧 Enviar emails]

    EnviarEmails --> EmailGenerador[✉️ Email confirmación al Generador]
    EnviarEmails --> EmailAdmins[✉️ Notificación a Administradores]

    EmailAdmins --> MostrarExito[✅ Pantalla de éxito con folio]

    MostrarExito --> AccionesPost{Usuario elige}
    AccionesPost -->|Ver Solicitud| VerDetalle[Ver detalle de solicitud]
    AccionesPost -->|Nueva Solicitud| NuevaSolicitud
    AccionesPost -->|Dashboard| Dashboard

    VerDetalle --> SeguimientoEstado[👁️ Seguimiento de estados]

    SeguimientoEstado --> EstadoPendiente[🟡 PENDIENTE: Esperando transportista]
    EstadoPendiente --> TransportistaAcepta{¿Transportista acepta?}

    TransportistaAcepta -->|No 48h| NotificarAdmin[⚠️ Notificar admin - sin asignación]
    TransportistaAcepta -->|Sí| EstadoAceptada[🔵 ACEPTADA: Transportista asignado]

    EstadoAceptada --> EstadoEnCamino[🟢 EN CAMINO: Transportista en ruta]
    EstadoEnCamino --> EstadoRecolectada[✅ RECOLECTADA: NFU recogidos]
    EstadoRecolectada --> EstadoEntregada[🏭 ENTREGADA A GESTOR: En planta]
    EstadoEntregada --> EstadoTratada[♻️ TRATADA: Procesada]
    EstadoTratada --> GenerarCertificado[📜 Generar Certificado de Valorización]

    GenerarCertificado --> Fin([Fin del flujo])

    style Start fill:#90EE90
    style Fin fill:#90EE90
    style Bloqueado fill:#FFB6C1
    style ErrorPaso1 fill:#FFB6C1
    style ErrorPaso2 fill:#FFB6C1
    style ErrorPaso3 fill:#FFB6C1
    style ErrorFotos fill:#FFB6C1
    style MostrarExito fill:#90EE90
    style GenerarCertificado fill:#90EE90
```

---

## 🔄 Diagrama de Estados de Solicitud

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE: Solicitud creada

    PENDIENTE --> ACEPTADA: Transportista acepta
    PENDIENTE --> RECHAZADA: Transportista rechaza
    PENDIENTE --> CANCELADA: Generador cancela

    RECHAZADA --> PENDIENTE: Reasignar

    ACEPTADA --> EN_CAMINO: Transportista inicia viaje
    ACEPTADA --> CANCELADA: Cancelación coordinada

    EN_CAMINO --> RECOLECTADA: Carga completa
    EN_CAMINO --> ACEPTADA: Reprogramar

    RECOLECTADA --> ENTREGADA_GESTOR: Entrega en planta

    ENTREGADA_GESTOR --> RECIBIDA_PLANTA: Gestor valida

    RECIBIDA_PLANTA --> TRATADA: Procesamiento completo

    TRATADA --> [*]: Certificado emitido

    CANCELADA --> [*]
    RECHAZADA --> [*]

    note right of PENDIENTE
        Estado inicial
        Esperando asignación
    end note

    note right of ACEPTADA
        Transportista asignado
        Fecha confirmada
    end note

    note right of RECOLECTADA
        Peso y cantidad real
        registrados
    end note

    note right of TRATADA
        NFU valorizado
        Contribuye a meta REP
    end note
```

---

## 👥 Diagrama de Actores e Interacciones

```mermaid
sequenceDiagram
    actor G as Generador
    participant F as Frontend
    participant API as Backend API
    participant DB as Database
    participant S as Storage
    participant E as Email Service
    actor T as Transportista
    actor GS as Gestor
    actor A as Admin

    Note over G,A: 1. CREACIÓN DE SOLICITUD

    G->>F: Accede a Nueva Solicitud
    F->>G: Muestra Formulario Paso 1
    G->>F: Completa Paso 1, 2, 3
    G->>F: Envía solicitud

    F->>F: Valida datos (Zod)
    F->>API: POST /api/solicitudes

    API->>API: Valida rol generador
    API->>API: Valida cuenta aprobada
    API->>API: Genera folio único

    API->>DB: Guarda SolicitudRetiro
    DB-->>API: Confirmación

    API->>S: Sube fotos
    S-->>API: URLs de fotos

    API->>DB: Crea CambioEstado (PENDIENTE)

    API->>E: Enviar email confirmación
    E-->>G: Email con folio

    API->>E: Notificar admins
    E-->>A: Email nueva solicitud

    API-->>F: Solicitud creada + folio
    F-->>G: Pantalla de éxito

    Note over G,A: 2. ASIGNACIÓN DE TRANSPORTISTA

    T->>API: GET /api/transportista/solicitudes-disponibles
    API-->>T: Lista de solicitudes

    T->>API: POST /api/solicitudes/{id}/aceptar
    API->>DB: Asigna transportista
    API->>DB: Cambia estado a ACEPTADA

    API->>E: Notificar generador
    E-->>G: Email: Transportista asignado

    Note over G,A: 3. RECOLECCIÓN

    T->>API: PATCH /api/solicitudes/{id}/estado (EN_CAMINO)
    API->>E: Notificar generador
    E-->>G: Email/SMS: En camino

    T->>API: POST /api/solicitudes/{id}/registrar-recoleccion
    Note over T,API: Incluye: peso real, cantidad, fotos

    API->>DB: Actualiza datos reales
    API->>S: Guarda fotos evidencia
    API->>DB: Cambia estado a RECOLECTADA

    API->>E: Notificar generador
    E-->>G: Email: Recolección completada

    Note over G,A: 4. ENTREGA A GESTOR

    T->>API: POST /api/solicitudes/{id}/confirmar-entrega
    API->>DB: Asigna gestor
    API->>DB: Cambia estado a ENTREGADA_GESTOR

    API->>E: Notificar gestor
    E-->>GS: Email: Nueva carga recibida

    Note over G,A: 5. PROCESAMIENTO Y CERTIFICACIÓN

    GS->>API: POST /api/solicitudes/{id}/validar-recepcion
    API->>DB: Cambia estado a RECIBIDA_PLANTA

    GS->>API: POST /api/lotes/{id}/asignar-tratamiento
    API->>DB: Registra tratamiento
    API->>DB: Cambia estado a TRATADA

    GS->>API: POST /api/certificados
    API->>DB: Crea Certificado
    API->>E: Enviar certificado
    E-->>G: Email + PDF: Certificado de valorización

    G->>G: ✅ Meta REP actualizada
```

---

## 🗂️ Diagrama de Estructura de Datos

```mermaid
erDiagram
    SOLICITUD_RETIRO ||--o{ CAMBIO_ESTADO : "tiene historial"
    SOLICITUD_RETIRO ||--o{ EVIDENCIA : "tiene fotos"
    SOLICITUD_RETIRO }o--|| USER_GENERADOR : "creada por"
    SOLICITUD_RETIRO }o--o| USER_TRANSPORTISTA : "asignada a"
    SOLICITUD_RETIRO }o--o| USER_GESTOR : "entregada a"
    SOLICITUD_RETIRO }o--|| REGION : "ubicada en"
    SOLICITUD_RETIRO }o--|| COMUNA : "ubicada en"
    REGION ||--o{ COMUNA : "contiene"

    SOLICITUD_RETIRO {
        string id PK
        string folio UK "SOL-YYYYMMDD-XXXX"
        string generadorId FK
        string direccionRetiro
        string region
        string comuna
        datetime fechaPreferida
        string horarioPreferido
        int categoriaA_cantidad
        float categoriaA_pesoEst
        int categoriaB_cantidad
        float categoriaB_pesoEst
        float pesoTotalEstimado
        int cantidadTotal
        string nombreContacto
        string telefonoContacto
        string instrucciones
        string[] fotos
        enum estado "PENDIENTE, ACEPTADA, etc."
        boolean esBorrador
        string transportistaId FK
        string gestorId FK
        float pesoReal
        int cantidadReal
        datetime fechaAceptacion
        datetime fechaRecoleccion
        datetime fechaEntregaGestor
        datetime createdAt
        datetime updatedAt
    }

    CAMBIO_ESTADO {
        string id PK
        string solicitudId FK
        enum estadoAnterior
        enum estadoNuevo
        datetime fecha
        string realizadoPor FK
        string notas
    }

    EVIDENCIA {
        string id PK
        string solicitudId FK
        string tipo "foto_carga, guia_despacho"
        string urlArchivo
        string nombreArchivo
        int tamanoBytes
        string mimeType
        string creadoPor FK
        datetime createdAt
    }

    REGION {
        string id PK
        string codigo UK "CL-RM"
        string nombre
        datetime createdAt
    }

    COMUNA {
        string id PK
        string codigo UK
        string nombre
        string regionId FK
        datetime createdAt
    }
```

---

## 📱 Diagrama de Componentes Frontend

```mermaid
graph TB
    subgraph "Dashboard Generador"
        Dashboard[DashboardView]
        Dashboard --> NuevaSolicitudBtn[Botón: Nueva Solicitud]
    end

    subgraph "Crear Solicitud - Container"
        NuevaSolicitudView[NuevaSolicitudView.tsx]
        NuevaSolicitudView --> StepIndicator[StepIndicator]
        NuevaSolicitudView --> FormPaso1[Paso1InformacionRetiro]
        NuevaSolicitudView --> FormPaso2[Paso2DetallesNFU]
        NuevaSolicitudView --> FormPaso3[Paso3ContactoInstrucciones]
        NuevaSolicitudView --> Resumen[ResumenSolicitud]
        NuevaSolicitudView --> Confirmacion[MensajeConfirmacion]
    end

    subgraph "Componentes Paso 1"
        FormPaso1 --> CheckboxDireccion[Checkbox: Usar dirección registrada]
        FormPaso1 --> SelectRegion[Select: Región]
        FormPaso1 --> SelectComuna[Select: Comuna]
        FormPaso1 --> DatePicker[DatePicker: Fecha]
        FormPaso1 --> RadioHorario[RadioGroup: Horario]
    end

    subgraph "Componentes Paso 2"
        FormPaso2 --> InputCatA[CategoriaNFUInput: Cat. A]
        FormPaso2 --> InputCatB[CategoriaNFUInput: Cat. B]
        FormPaso2 --> DisplayTotales[Display: Totales calculados]
    end

    subgraph "Componentes Paso 3"
        FormPaso3 --> InputContacto[Input: Nombre contacto]
        FormPaso3 --> InputTelefono[Input: Teléfono validado]
        FormPaso3 --> TextareaInstrucciones[Textarea: Instrucciones]
        FormPaso3 --> CargadorFotos[CargadorFotos.tsx]
    end

    subgraph "Hooks Personalizados"
        useSolicitudMultiStep[useSolicitudMultiStep]
        useValidarPaso[useValidarPaso]
        useSubirFotos[useSubirFotos]
    end

    NuevaSolicitudView -.usa.-> useSolicitudMultiStep
    FormPaso1 -.usa.-> useValidarPaso
    FormPaso2 -.usa.-> useValidarPaso
    FormPaso3 -.usa.-> useValidarPaso
    CargadorFotos -.usa.-> useSubirFotos

    subgraph "API Calls"
        API_Regiones[GET /api/regiones]
        API_Comunas[GET /api/regiones/{id}/comunas]
        API_Crear[POST /api/solicitudes]
        API_Borrador[POST /api/solicitudes/borrador]
    end

    SelectRegion -->|fetch| API_Regiones
    SelectComuna -->|fetch| API_Comunas
    NuevaSolicitudView -->|enviar| API_Crear
    NuevaSolicitudView -->|guardar| API_Borrador

    style NuevaSolicitudView fill:#4A90E2
    style useSolicitudMultiStep fill:#F5A623
    style API_Crear fill:#7ED321
```

---

## 🎯 Puntos de Decisión Clave

### 1. Validación de Cuenta

```
┌─────────────────────┐
│  Usuario accede     │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ ¿Rol =       │
    │ Generador?   │
    └──────┬───────┘
           │
      No ──┴── Sí
       │        │
       ▼        ▼
   ❌ 403   ┌──────────────┐
            │ ¿Cuenta      │
            │ aprobada?    │
            └──────┬───────┘
                   │
              No ──┴── Sí
               │        │
               ▼        ▼
           ❌ Mensaje  ✅ Continuar
           "Pendiente"
```

### 2. Generación de Folio

```
┌──────────────────────┐
│ Usuario envía        │
│ solicitud            │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Obtener fecha    │
    │ actual           │
    │ YYYYMMDD         │
    └──────────┬───────┘
               │
               ▼
    ┌──────────────────┐
    │ Buscar última    │
    │ solicitud del día│
    └──────────┬───────┘
               │
        ¿Existe?
               │
        No ─────┴──── Sí
         │            │
         │            ▼
         │     ┌──────────────┐
         │     │ Incrementar  │
         │     │ secuencia    │
         │     └──────┬───────┘
         │            │
         └────────────┤
                      │
                      ▼
           ┌──────────────────┐
           │ Generar folio    │
           │ SOL-YYYYMMDD-XXX │
           └──────────────────┘
```

---

**Generado:** 29/10/2025  
**Versión:** 1.0  
**Herramienta:** Mermaid.js
