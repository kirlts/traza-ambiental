---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ley 20.920]]"
se_descompone_en: []
se_relaciona_con: ["[[Gestor]]", "[[Productor]]"]
cssclasses: [kb-node]
---

# Certificado de Valorización

## Qué dice

Documento final y excluyente que certifica que un lote de residuos prioritarios (NFU) ha sido sometido a un proceso de valorización válido (ej. recauchaje, pirólisis, co-procesamiento). Es el hito único en el cual se materializa el cese de responsabilidad legal del Generador/Productor; ni la entrega al transportista ni la recepción en patio del Gestor extinguen el pasivo.

## Por qué existe

Este concepto se deriva de [[Ley 20.920]] porque es el mecanismo mediante el cual se acredita el cumplimiento material de la Ley REP. Para Trazambiental, el diseño lógico de su *Compliance Core* debe erigirse sobre este hito: el saldo de pasivos ambientales en el *Dashboard* del usuario no se rebaja algorítmicamente hasta que se asocia este certificado validado (*is_legally_valorized = TRUE*). 

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Gestor]]: **Emisor Exclusivo:** Es la única entidad habilitada para emitir y registrar en SINADER/SISREP el certificado tras concluir el proceso físico.
- [[Productor]]: **Receptor Necesario:** Es la parte que requiere poseer (y asociar a sus metas) este certificado para considerar la obligación legal cumplida ante el Estado.

## Fuente original

Decreto Supremo N° 8/2019 y Ley 20.920.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque espera la verificación y enlace de los artículos precisos de la normativa.
