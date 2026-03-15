# 05 - DIAGRAMAS MODO DEMO (MINERÍA)

> **Documento de Validación Visual para Stakeholders**
> **Fecha:** Marzo 2026
> **Propósito:** Definir los flujos aislados ("Universos de Usuario") que serán maquetados en el Frontend para el Demo de Traza Ambiental.

---

## 1. El Portal de Entrada al Modo Demo

Así es como se estructurará la navegación inicial.

```mermaid
graph LR
    A[Página Principal<br>Boton 'Modo Demo'] --> B{Seleccione qué rol<br>desea experimentar:}
    
    B -->|Generador de Residuos| C[Universo Generador]
    B -->|Logística| D[Universo Transportista]
    B -->|Valorización| E[Universo Gestor de Planta]
    B -->|Dashboard Integral| F[Universo Admin]
    B -->|Fiscalización| G[Universo Auditor]
```

---

## 2. Los Universos Aislados (User Journeys)

Cada Universo debe responder a la pregunta: *¿Qué hace exactamente este usuario en la plataforma?*

### Universo 1: El Generador (Ej. Faena Minera)
El usuario que necesita deshacerse de neumáticos OTR gigantes.

```mermaid
journey
    title Flujo del Generador (Minera)
    section 1. Dashboard
      Ver KPIs de reciclaje anual: 5
      Ver solicitudes previas completadas: 4
    section 2. Acción Principal
      Crear 'Nueva Solicitud' de retiro: 5
      Declarar cantidad y tonelaje estimado de neumáticos: 4
    section 3. Desenlace
      Ver que su retiro está 'Buscando Transportista': 5
      Descargar su certificado tras el proceso simulado: 5
```

### Universo 2: El Transportista
El operador logístico que mueve los camiones. En su universo, ya verá subastas disponibles de empresas ficticias.

```mermaid
journey
    title Flujo del Transportista
    section 1. Buscar Trabajo
      Ver mapa o lista de cargas disponibles: 5
      Revisar origen y destino de un viaje: 4
    section 2. Ejecutar Ruta
      Aceptar viaje (Click en 'Ir a Cargar'): 5
      Declarar que subió los neumáticos al camión: 5
    section 3. Entrega Fina
      Presionar 'Entregar en Planta': 5
      Recibir comprobante de viaje finalizado: 4
```

### Universo 3: El Gestor de Planta (Centro de Valorización)
Quien tritura o recicla el neumático y emite el documento sagrado (Certificado).

```mermaid
journey
    title Flujo del Gestor
    section 1. Recepción
      Ver camiones que vienen en camino: 4
      Presionar 'Recibir Carga': 5
    section 2. Validación de Peso
      Anotar peso final de romana (Báscula): 5
      Verificar si hay diferencia de peso con el chofer: 3
    section 3. Emisión Legal
      Presionar 'Tratar Neumáticos': 5
      El sistema auto-emite el Certificado al Generador original: 5
```

### Universos 4 y 5 (Admin y Auditor)
Cuentas de vista general, útiles para vender la solidez administrativa del software.

```mermaid
mindmap
  root((Vistas de<br>Supervisión))
    Admin (Control Total)
      Ver estado general de las metas anuales ("El Panel de Control")
      Ver y bloquear usuarios o flotas sin permisos
      Revisar discrepancias de pesos (Transportista vs Planta)
    Auditor (El Funcionario del Estado)
      Vista bloqueada: No puede crear ni borrar absolutamente nada
      Ver historial forense y rastreo de un certificado específico
```
