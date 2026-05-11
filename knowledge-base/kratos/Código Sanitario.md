---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ministerio de Salud]]"
se_descompone_en: []
se_relaciona_con: ["[[Sistema de Gestión]]"]
cssclasses: [kb-node]
---

# Código Sanitario

## Qué dice

Norma general de salud pública que establece las bases del ordenamiento sanitario chileno. En el contexto de Trazambiental, es la norma matriz de la cual emanan las autorizaciones sanitarias que la SEREMI de Salud exige para operar instalaciones de manejo de residuos. Las clausuras sanitarias ejecutadas al amparo de este código son medidas cautelares materiales sobre las instalaciones físicas, no subordinaciones tecnológicas sobre software privado de terceros.

## Por qué existe

Este concepto se deriva de [[Ministerio de Salud]] porque el Código Sanitario es la norma general emitida bajo la tutela de dicho ministerio. Su relevancia para Trazambiental es indirecta: no genera obligaciones directas para el software, pero fundamenta legalmente las autorizaciones sanitarias que los gestores deben poseer y que el SINADER valida como prerrequisito para aceptar declaraciones.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Sistema de Gestión]]: **Inexistencia de Subordinación Algorítmica:** Las clausuras sanitarias ejecutadas por la SEREMI son medidas materiales sobre recintos físicos. El Código Sanitario no faculta a la autoridad para exigir la inclusión de un "Kill Switch" o acceso de superusuario ("Root Override") en el software privado del Sistema de Gestión.

## Fuente original

Código Sanitario de Chile (DFL N° 725 de 1967).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque no se ha verificado contra el texto legal y la evidencia está vacía. Su relevancia directa para el MVP es baja. Para avanzar se requiere determinar si este concepto aporta valor suficiente como concepto independiente o si su contenido debería absorberse en [[Secretaría Regional Ministerial de Salud]].
