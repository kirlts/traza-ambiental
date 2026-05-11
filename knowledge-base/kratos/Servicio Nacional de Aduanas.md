---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ministerio de Hacienda]]"
se_descompone_en: ["[[Resolución Exenta 134]]", "[[Declaración Jurada REP Neumáticos]]"]
se_relaciona_con: ["[[Registro Público de Sistemas de Gestión]]", "[[Decreto Supremo 9]]"]
cssclasses: [kb-node]
---

# Servicio Nacional de Aduanas

## Qué dice

Institución del Estado de Chile encargada de la fiscalización y control del comercio exterior. En el contexto de Trazambiental, Aduanas ejecuta en frontera la exigencia del DS 8: todo importador de neumáticos debe acreditar pertenencia a un Sistema de Gestión autorizado antes de que se permita la internación del producto al país.

## Por qué existe

Este concepto se deriva de [[Ministerio de Hacienda]] porque es un servicio público dependiente de dicho ministerio. Su relevancia para el MVP radica en que el punto de entrada de neumáticos al mercado nacional es la frontera aduanera, y Aduanas opera como el primer filtro de cumplimiento REP: si el importador (Productor) no acredita adhesión a un Sistema de Gestión, la internación se bloquea. Los instrumentos que Aduanas utiliza (Res 134, Declaración Jurada REP) son los que el software debe conocer para orientar correctamente a sus usuarios.

## Lógica de descomposición

Se descompone en dos conceptos: [[Resolución Exenta 134]] (el instrumento bloqueador que Aduanas aplica en frontera) y [[Declaración Jurada REP Neumáticos]] (el formulario que el importador debe completar para acreditar cumplimiento). Ambos cubren dominios operativos distintos: uno es la herramienta sancionatoria, el otro es el instrumento declarativo.

## Relaciones Horizontales

- [[Registro Público de Sistemas de Gestión]]: **Validación Cruzada:** Aduanas consulta el Registro Público de la SMA para verificar que el importador efectivamente pertenece a un Sistema de Gestión autorizado antes de liberar la mercancía.
- [[Decreto Supremo 9]]: **Integración logística:** Aduanas opera y restringe en frontera los movimientos transfronterizos bajo este reglamento.

## Fuente original

Servicio Nacional de Aduanas de Chile.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la evidencia primaria está vacía y la operativa de frontera no ha sido verificada contra documentos oficiales de Aduanas. Para avanzar se requiere enlazar fuentes oficiales del SNA.
