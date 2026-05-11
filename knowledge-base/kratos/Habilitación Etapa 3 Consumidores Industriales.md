---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Resolución Exenta 2279]]"
se_descompone_en: []
se_relaciona_con: ["[[Consumidor Industrial]]", "[[SISREP]]"]
cssclasses: [kb-node]
---

# Habilitación Etapa 3 Consumidores Industriales

## Qué dice

La implementación gradual de las plataformas de la SMA contempló una cronología diferenciada por actor. La "Etapa 3", dedicada exclusivamente al catastro y la operatividad de los reportes por parte de los Consumidores Industriales, fue habilitada durante el mes de junio de 2025. La Etapa 3 es un hecho consumado y lleva operativa desde esa fecha.

Al momento de realizar este catastro diferido, el sistema requirió que se regularizaran de manera retroactiva "los meses que correspondan al momento del registro". Esto significa que Trazambiental debe poseer la capacidad de agrupar y exportar retroactivamente conjuntos de datos masivos correspondientes a períodos anteriores al registro para los módulos de clientes de perfil industrial. Dado que la Etapa 3 ya está activa, los Consumidores Industriales que aún no se hayan registrado acumulan una deuda retroactiva creciente.

## Por qué existe

Este concepto se deriva de [[Resolución Exenta 2279]] porque la cronología diferenciada de la Etapa 3 está establecida en dicha resolución. Para Trazambiental, este hecho impacta directamente el MVP: los módulos orientados a Consumidores Industriales deben estar preparados para generar cargas retroactivas masivas, no solo reportes mensuales prospectivos. Con la Etapa 3 ya activa desde junio 2025, la capacidad de ingesta retroactiva no es un requisito futuro sino una necesidad operativa inmediata al momento de lanzamiento del MVP.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Consumidor Industrial]]: **Ventana de Regularización:** Los Consumidores Industriales que se registraron o se registren en la Etapa 3 deben regularizar retroactivamente los meses anteriores desde el inicio del período. Con la Etapa 3 activa desde junio 2025, los que no se hayan registrado aún acumulan más de un año de deuda retroactiva.
- [[SISREP]]: **Carga Retroactiva:** El SISREP debe aceptar cargas de datos correspondientes a meses anteriores al registro formal del Consumidor Industrial.

## Fuente original

Resolución Exenta N° 2.279 (disposición sobre Etapa 3).

## Evidencia

https://www.bcn.cl/leychile/navegar?idNorma=1209251

## Justificación de estado

Permanece en `borrador` porque los detalles de regularización retroactiva no han sido verificados contra el texto oficial de la Resolución Exenta 2279. La fecha de habilitación (junio 2025) es un hecho consumado; lo que falta verificar son los plazos exactos y las condiciones de la regularización.
