# Diccionario MECE de Emojis Kairós

> Referencia canónica. Un emoji = un significado. Sin solapamiento.
> Cada template del eje documental incluye la leyenda de sus emojis relevantes.

---

## Principios

1. **Un emoji = un significado.** No reutilizar emojis con semánticas diferentes.
2. **Emoji + texto siempre.** Nunca un emoji solo como contenido.
3. **Posición: prefijo del elemento.** `🧑 [USR.FN.03.HUM]`; el emoji va antes del ID.
4. **Set curado y finito.** Solo los emojis definidos aquí. Prohibido improvisar.
5. **Documentado en cada plantilla.** Cada template incluye la leyenda de sus emojis relevantes.

---

## Categoría 1: Verificabilidad

| Emoji | Código | Significado | Usado en |
|---|---|---|---|
| 🤖 | `.LLM` | Verificable por IA/herramienta automatizada | MASTER-SPEC §8, TODO.md, derive/checklist deliverables |
| 🧑 | `.HUM` | Requiere verificación humana | MASTER-SPEC §8, TODO.md, derive/checklist deliverables |
| 🤖🧑 | `.MIX` | Pre-verificable por IA, validación final humana | MASTER-SPEC §8, TODO.md, derive/checklist deliverables |

## Categoría 2: Estado

| Emoji | Significado | Usado en |
|---|---|---|
| ✅ | Implementado y verificado (con timestamp obligatorio) | MASTER-SPEC §8 |
| ⏳ | En progreso | TODO.md |
| 🔲 | Pendiente | TODO.md, MASTER-SPEC §8 |

## Categoría 3: Naturaleza de entrada

| Emoji | Significado | Usado en |
|---|---|---|
| 🚨 | Bloqueo crítico / deuda técnica urgente | DEUDA-TECNICA.md, TODO.md |
| 💡 | Decisión estratégica del usuario | USER-DECISIONS.md |
| 🧠 | Heurística transferible aprendida | MEMORY.md |

## Categoría 4: Señalización operativa

| Emoji | Significado | Usado en |
|---|---|---|
| ⚠️ | Conflicto de coherencia detectado por `/document` | Reporte de sincronización |
| 🔗 | Referencia cruzada trazable | Cualquier documento (ej: `🔗 USER-DECISIONS #003`) |

---

**Total: 11 emojis. MECE por categoría. Sin solapamiento.**
