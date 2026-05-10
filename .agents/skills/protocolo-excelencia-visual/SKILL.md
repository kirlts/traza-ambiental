---
name: protocolo-excelencia-visual
description: Se activa para verificar que los artefactos visuales y de experiencia cumplan con las leyes de armonía, forzando desvío respecto a la huella paramétrica del AI Smell. Opera sobre interfaces web, CSS, PDF, EPUB, imágenes, diagramas y todo contenido destinado a la percepción visual.
---

# Verificación de excelencia visual

Este skill operacionaliza la regla `04-aesthetics`. Su función es verificar que cada artefacto visual tenga identidad propia y no sea un producto genérico de la distribución estadística del modelo.

## Fase 0: Carga de referencia

Cargar `@knowledge/ai-smell-registry.md` para obtener la Lista Negra de Convergencia (LNC) con los 10 vectores y sus valores exactos. La carga es interna y silenciosa.

## Fase 1: Inhalación de atmósfera

1. **Auditoría brownfield:** Inspeccionar archivos de estilo existentes (CSS, tailwind.config, theme). Identificar constraints legacy.
2. **Test de intercambiabilidad (silencioso):** «Si sustituyo el logo por el de una entidad genérica, ¿este copy/layout seguiría aplicando?» Si la respuesta es sí, el artefacto carece de anclaje de dominio.
3. **Extracción de ADN visual:** Si se solicita atmósfera nueva, derivar sistema de espaciado, curvatura y luz.
4. **Identidad tipográfica:** Calcular peso, tracking y leading específicos.
5. **Curva cromática:** Establecer lógica de color en OKLCH.

## Fase 2: Derivación de tokens

1. **Escala de ritmo:** Definir unidad base y progresión armónica.
2. **Matriz de jerarquía:** Forzar lectura dirigida mediante contrastes calculados.
3. **Densidad contextual:** Ajustar densidad según el contexto del proyecto.

## Fase 3: Gates de verificación

Verificación obligatoria antes de entregar cualquier artefacto visual.

### Gate A. Anti-Slop (mecánico, binario)

| Condición | Resultado |
|---|---|
| ≥3 valores del artefacto coinciden con LNC sin justificación atmosférica | BLOQUEO → reescribir con valores derivados |
| ≥1 emoji Unicode funciona como ícono de interfaz | BLOQUEO |
| ≥1 enlace apunta a `#` sin ser placeholder declarado | BLOQUEO |
| Un CTA usa cadenas literales de la LNC sin reescritura al dominio | BLOQUEO |

### Gate B. Armonía intencional (cognitivo)

| Condición | Resultado |
|---|---|
| Una decisión visual no es justificable desde la atmósfera inhalada | BLOQUEO → residuo de inercia estadística |
| El sistema de ritmo derivado en Fase 2 no se respeta | BLOQUEO |
| Elementos con hover no son interactivos, o focusables sin `:focus-visible` | BLOQUEO |
| Espacio vacío no comunica agrupación semántica (Gestalt) | BLOQUEO → padding genérico |

### Gate C. Integridad contextual (brownfield)

| Condición | Resultado |
|---|---|
| Restricciones de MASTER-SPEC §4 o sistema brownfield no respetados | BLOQUEO |
| Ley de armonía contradice restricción legacy | BLOQUEO → declarar al usuario y solicitar veredicto |

## Mandato de salida

Al entregar el artefacto, comunicar en lenguaje técnico estándar (sin jerga interna):
1. La atmósfera de referencia inhalada.
2. Los desvíos ejecutados respecto a los valores de convergencia.
3. Justificación de cualquier coincidencia con valores de convergencia.
