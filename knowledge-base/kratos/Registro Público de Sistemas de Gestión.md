---
estado: borrador
tipo: factor_externo
vigencia: por_verificar
depende_de: "[[SISREP]]"
se_descompone_en: []
se_relaciona_con: ["[[SINADER]]", "[[Servicio Nacional de Aduanas]]", "[[Sistema de Gestión Colectivo]]"]
cssclasses: [kb-node]
---

# Registro Público de Sistemas de Gestión

## Qué dice

Registro público administrado por la SMA donde queda expuesto el detalle corporativo de las asociaciones empresariales (Sistemas de Gestión Colectivos). Detalla con precisión nominal cuáles son las entidades jurídicas y casas importadoras (RUTs individuales) que concurren societariamente para integrar y proveer de fondos a un sistema colectivo.

## Por qué existe

Este concepto se deriva de [[SISREP]] porque el Registro Público es el mecanismo de empadronamiento que el SISREP utiliza como filtro de ingreso para validar la legitimidad de los declarantes. Sin estar inscrito en este registro, ningún actor puede presentar reportes ante la SMA ni ser reconocido como miembro legítimo de un Sistema de Gestión. Para Trazambiental, este registro es un dato de referencia que el software debe consultar para validar la legitimidad de los actores que operan en su plataforma.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SINADER]]: **Filtro de Ingreso:** SINADER rechaza cualquier archivo de declaración si el RUT o Código de Establecimiento no está empadronado formalmente en el Registro de la SMA.
- [[Servicio Nacional de Aduanas]]: **Control de Interoperabilidad en Frontera:** Aduanas no puede autorizar la DIN sin verificar empíricamente que el RUT del Productor figura como activo en este registro.
- [[Sistema de Gestión Colectivo]]: **Habilitación Operativa:** Todo Sistema de Gestión Colectivo debe estar inscrito en este registro como condición previa para operar y presentar reportes ante SISREP.

## Fuente original

Registro Público de Sistemas de Gestión (SMA).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la evidencia primaria está vacía y la operativa del registro no ha sido verificada contra fuentes oficiales de la SMA. Para avanzar se requiere enlazar el registro público desde el sitio de la SMA.
