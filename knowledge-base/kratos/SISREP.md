---
estado: borrador
tipo: requisito_tecnico
vigencia: por_verificar
depende_de: "[[Resolución Exenta 2084]]"
se_descompone_en: ["[[Registro Público de Sistemas de Gestión]]"]
se_relaciona_con: ["[[Consumidor Industrial]]", "[[Registro de Actividades de Tratamiento]]", "[[Servicio de Impuestos Internos]]", "[[OIML R76-1]]", "[[Regla del Penúltimo Mes]]", "[[Rectificabilidad de Reportes Mensuales]]", "[[Formato Dinámico Anexo Neumáticos]]", "[[Habilitación Etapa 3 Consumidores Industriales]]"]
cssclasses: [kb-node]
---

# SISREP

## Qué dice

Sistema de Reporte de la Responsabilidad Extendida del Productor administrado por la SMA, obligatorio a contar del 1 de enero de 2025. 
Exige reportes mensuales (primeros 10 días hábiles del mes), un informe formal de avance (antes del 30 de septiembre) y un informe final auditado (hasta el 31 de mayo del año subsiguiente).
Utiliza formatos de interoperabilidad rígidos:
1. Sistemas de Gestión: Deben usar "Anexo neumáticos". Exige registrar el historial de productos (categorías macroscópicas con equivalencia metrológica a masa), introducción al mercado (Línea Base), y las operaciones de manejo, exigiendo imperativamente el costo exacto de la operación en pesos chilenos y el folio del documento tributario de respaldo (DTE del SII). El reporte se basa en la consolidación metrológica de la tonelada métrica macroscópica, rechazando expresamente la necesidad de trazar la depreciación metrológica o identificar unidades mediante catálogo SKU en las instalaciones de acopio o tratamiento.
2. Consumidores Industriales: Deben usar "Planilla neumáticos". Posee pestañas de Diccionario y General. Actualmente su entrega se realiza a través de un formulario cifrado en Google Forms.

## Por qué existe

Este concepto se deriva de [[Resolución Exenta 2084]] porque el SISREP es el sistema creado y hecho obligatorio por dicha resolución. Sin la Res 2084, el SISREP no existiría. Su relevancia para Trazambiental es directa: es uno de los dos canales de reporte oficial (junto con SINADER) ante los cuales los usuarios del software deben demostrar cumplimiento. El MVP debe generar documentos compatibles con los formatos rígidos del SISREP.

## Lógica de descomposición

Se descompone en: [[Registro Público de Sistemas de Gestión]], que es el mecanismo de empadronamiento que el SISREP utiliza como filtro de ingreso para validar la legitimidad de los declarantes.

## Relaciones Horizontales

- [[Servicio de Impuestos Internos]]: **Acoplamiento Tributario-Ambiental:** El SISREP exige el costo exacto en pesos chilenos y el folio del DTE. Obliga a calzar la contabilidad financiera con la trazabilidad ambiental.
- [[Registro de Actividades de Tratamiento]]: **Inventario de Flujos:** El SISREP obliga a recopilar rutas, costos y RUTs. Esta ingesta debe quedar mapeada dentro del RAT exigido por la Ley de Privacidad.
- [[Consumidor Industrial]]: **Vía Alternativa de Cumplimiento:** Los Consumidores Industriales utilizan canales de rendición paralelos (Google Forms) para acreditar valorización in-situ.
- [[OIML R76-1]]: **Unidad de medición macroscópica:** El tonelaje reportado en SISREP requiere respaldo metrológico fundamentado en romanas certificadas según esta norma, no en cálculos teóricos de desgaste o registro individual por SKU.
- [[Regla del Penúltimo Mes]]: **Recalibración de Plazos:** La Res. 2279 modificó la ventana de declaración mensual al SISREP, pasando de "mes anterior" a "penúltimo mes contado desde la fecha del reporte".
- [[Rectificabilidad de Reportes Mensuales]]: **Diseño de Versionado:** Los reportes mensuales enviados al SISREP pueden ser rectificados o complementados tantas veces como sea necesario hasta la remisión del informe final anual.
- [[Formato Dinámico Anexo Neumáticos]]: **Brecha Tecnológica:** La estructura del Anexo Neumáticos que ingesta el SISREP es dinámica y discrecional de la SMA, no publicada estáticamente en ley.
- [[Habilitación Etapa 3 Consumidores Industriales]]: **Cronología Diferenciada:** La Etapa 3 del SISREP para Consumidores Industriales se habilitó en junio 2025 con obligación de regularización retroactiva.

## Fuente original

Sistema SISREP (Creado por Resolución Exenta N° 2084).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque los detalles técnicos de los formatos de reporte (campos del Anexo neumáticos, estructura de la Planilla) no han sido verificados contra los archivos oficiales de la SMA, y la evidencia está vacía. Para avanzar se requiere obtener los formatos oficiales y confirmar los plazos y validaciones.
