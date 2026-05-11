---
cssclasses: [kb-node]
estado: con_vacios
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Trazabilidad detallada]]"]
---

# Restricciones operativas por empresa

## Qué es

Modelado simplificado de restricciones propias de cada empresa (EPP, protocolos en sitio, prohibiciones) mediante un campo de texto estático ("Notas operativas") expuesto en el perfil B2B.

## Por qué existe

Esta responsabilidad nace de [[Trazambiental MVP]] porque la logística de retiro de NFU choca constantemente con protocolos de seguridad en las faenas (ej. uso de EPP). Originalmente concebido como un motor de reglas de bloqueo, fue simplificado pragmáticamente para el MVP de Agosto: entregar el 80% del valor (evitar viajes fallidos por ignorancia del chofer) con 0% de la complejidad, utilizando un simple campo de notas que el transportista debe leer antes de emprender el viaje.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Compromisos

| Actor | Acción en el sistema | Sustento |
|---|---|---|
| Generador | Rellenar campo de texto libre con exigencias de sitio (EPP, horarios) | [[Protocolos Logísticos en Terreno]] |
| Transportista | Leer "Notas operativas" adjuntas a la orden de retiro antes del viaje | [[Protocolos Logísticos en Terreno]] |

## Relaciones Horizontales

- [[Trazabilidad detallada]]: **Regla de Bloqueo Logístico:** El módulo de restricciones se ancla transversalmente al flujo de trazabilidad transaccional para imponer validaciones de seguridad (como EPP obligatorio) antes de que la orden de viaje sea aprobada en el sistema.



## Se descompone en



## Qué falta

**Hipótesis de vacíos operativos:**
1. **Responsabilidad Legal de las Notas:** No está definido quién es responsable si un accidente ocurre porque las notas operativas estaban desactualizadas o incompletas. ¿Trazambiental se exime vía TyC, o la nota genera una obligación trazable?
2. **Interacción con DS 298:** Si un retiro involucra NFU en condiciones peligrosas, las restricciones operativas deberían reflejar las condiciones del [[Decreto Supremo 298]] (transporte de carga peligrosa). El campo de notas libres no es suficiente para codificar restricciones normativas de este nivel.



## Justificación de estado

Retrocede a `con_vacios` porque se identificaron hipótesis de vacíos operativos sobre responsabilidad legal de las notas e interacción con el DS 298 para NFU peligrosos. Los compromisos base siguen sustentados en Kratos.
