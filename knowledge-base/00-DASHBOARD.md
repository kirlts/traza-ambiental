# Dashboard Operativo - Trazambiental

> Panel de control dinámico alimentado por metadatos YAML. Se actualiza mecánicamente con cada modificación de Antigravity o del humano.

## 🔴 Bloqueadores del MVP (Khaos)
*Responsabilidades de diseño con información incompleta o vacíos estructurales detectados por auditoría.*

```dataview
TABLE depende_de AS "Módulo Padre", estado AS "Estado Actual"
FROM "khaos"
WHERE estado = "con_vacios" OR estado = "borrador"
SORT file.mday DESC
```

## 🔵 Riesgo Normativo (Kratos)
*Hechos legales o del dominio que aún no se han verificado, o cuya vigencia está en duda.*

```dataview
TABLE tipo AS "Origen", vigencia AS "Estatus Legal"
FROM "kratos"
WHERE vigencia = "por_verificar" OR estado = "borrador"
SORT tipo ASC
```

## ⚙️ Carga Estructural por Módulo
*Complejidad de cada módulo medida por la cantidad de sub-responsabilidades hijas.*

```dataview
TABLE length(se_descompone_en) AS "Nodos Hijos (Complejidad)"
FROM "khaos"
WHERE length(se_descompone_en) > 0
SORT length(se_descompone_en) DESC
```
