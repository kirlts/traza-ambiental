---
estado: borrador
tipo: hecho_negativo
vigencia: por_verificar
depende_de: "[[Resolución Exenta 2084]]"
se_descompone_en: []
se_relaciona_con: ["[[SISREP]]", "[[Monitoreo Manual de Plataformas Estatales]]"]
cssclasses: [kb-node]
---

# Formato Dinámico Anexo Neumáticos

## Qué dice

La estructura técnica de las columnas del "Anexo Neumáticos" (el formato Excel mandatorio para reportes de Sistemas de Gestión al SISREP) **NO se publica estáticamente en el Diario Oficial ni en el cuerpo de ninguna resolución**. La Resolución 2084 establece que "la Superintendencia del Medio Ambiente pondrá a disposición de los sistemas de gestión un formato de anexo para estos efectos". La Resolución 2279 refrenda esta flexibilidad indicando que los reportes deben entregarse "por medio del formato actualizado establecido por la Superintendencia del Medio Ambiente, el cual será publicado oportunamente en la página web institucional".

Esto significa que el modelo de datos de la SMA es dinámico y discrecional: puede cambiar sin previo aviso normativo formal, publicándose directamente en el portal web institucional de la SMA.

## Por qué existe

Este concepto se deriva de [[Resolución Exenta 2084]] porque es una consecuencia directa de la discrecionalidad administrativa que la resolución otorga a la SMA sobre la estructura del formato. Para Trazambiental, este hecho negativo representa una brecha tecnológica: es imposible fijar la estructura del Excel transaccional basándose en el texto legal. El software debe establecer rutinas de vigilancia tecnológica activa para detectar actualizaciones silentes en las versiones del Anexo Neumáticos, de lo contrario las plantillas autogeneradas podrían ser rechazadas por la capa de validación del SISREP.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SISREP]]: **Dependencia de Formato:** El SISREP utiliza el Anexo Neumáticos como formato de ingesta. La naturaleza dinámica de este formato impacta directamente la estabilidad del módulo de autogeneración de documentos.
- [[Monitoreo Manual de Plataformas Estatales]]: **Mitigación Operativa:** La decisión del CEO de que el Administrador monitoree manualmente los canales del Estado es la respuesta directa a esta brecha: si los formatos cambian sin aviso, el monitoreo humano es el único mecanismo de detección disponible.

## Fuente original

Resolución Exenta N° 2.084, Art. sobre formato de anexo; Resolución Exenta N° 2.279.

## Evidencia

https://portal.sma.gob.cl/index.php/ley-rep/instructivo-y-reporte/

## Justificación de estado

Permanece en `borrador` porque, si bien la brecha está documentada con evidencia del portal de la SMA, no se ha verificado si existe algún diccionario de datos estable en el portal al momento de esta auditoría.
