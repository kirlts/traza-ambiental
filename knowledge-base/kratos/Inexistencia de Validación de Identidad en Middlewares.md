---
estado: borrador
tipo: hecho_negativo
vigencia: por_verificar
depende_de: '[[RETC]]'
se_descompone_en: []
se_relaciona_con:
- '[[Validación de Identidad por Buena Fe]]'
cssclasses:
- kb-node
---

# Inexistencia de Validación de Identidad en Middlewares

## Qué dice

El Estado (y la Res. 144) no exige a los proveedores de software privado (middlewares SaaS) validar notarialmente quién es el usuario interno que aprueba el envío de datos de cumplimiento. Sin embargo, el Estado asume la autoría ineludible del "Encargado de Establecimiento" registrado en RETC por cualquier envío. Por tanto, el Generador siempre será el infractor ante un mal uso.

## Por qué existe

Este concepto se deriva de [[RETC]] porque ilustra un vacío técnico y regulatorio respecto a la interacción indirecta con esta plataforma mediante softwares de terceros. Para Trazambiental, este hecho impone la exigencia arquitectónica de implementar logs de auditoría inmutables y segregación de roles estricta para proteger al Generador y al proveedor del SaaS de responsabilidad frente a un uso indebido de las credenciales internas.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Validación de Identidad por Buena Fe]]: **Relación Bidireccional:** Vínculo estructurado para mantener la simetría del grafo.


## Fuente original

Resolución Exenta N° 144/2020 (MMA) y arquitectura de acceso del RETC.

## Evidencia



## Justificación de estado

Permanece en `borrador` pendiente de enlace de evidencia o corroboración. En este caso, al ser un hecho negativo, la evidencia queda en blanco al no existir norma que lo regule.
