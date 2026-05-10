# Registro Factual - Insumos para el PRD TrazaAmbiental

> **Propósito:** Persistir los hallazgos de los informes de research en un formato consultable check-por-check. Cuando se redacte el PRD, se consulta ESTE archivo - no la memoria de la IA.
> **Última actualización:** 2026-04-09T22:08 (6 informes + auditoría cruzada v3 + decisiones CEO scope - 19 hallazgos incorporados)

---

## INFORME 1: Ley REP, D.S. 8, Régimen Sancionatorio, Firma Electrónica

### `NORM-PD-001` - Identificación oficial de la Ley 20.920
**Estado:** ✅ RESUELTO
**Fuente:** bcn.cl/leychile/Navegar?idNorma=1090894
**Hallazgo textual:**
> - **Nombre completo:** Ley N° 20.920 "Establece Marco Para La Gestión De Residuos, La Responsabilidad Extendida Del Productor Y Fomento Al Reciclaje"
> - **Número:** 20.920
> - **Fecha de publicación:** 1 de junio de 2016
> - **Institución emisora:** Ministerio del Medio Ambiente

---

### `NORM-EN-002` - Fechas de publicación verificables de cada norma
**Estado:** ✅ RESUELTO (completo)
**Fuente:** bcn.cl + Informe 2 (Ley 20.417) + Informe 3 (Ley 19.799)
**Hallazgo textual:**
> - **Ley 20.920:** 1 de junio de 2016
> - **D.S. 8:** Promulgado 28 de mayo de 2019, **publicado 20 de enero de 2021** (fecha de entrada al corpus activo)
> - **Ley 20.417:** Promulgada 12 de enero de 2010. SMA entró en operaciones el 1 de octubre de 2010. (Fuente: Informe 2)
> - **Ley 19.799:** Vigente. Regulada por la Subsecretaría de Economía y Empresas de Menor Tamaño (Entidad Acreditadora: entidadacreditadora.gob.cl). (Fuente: Informe 3, sección 5)
**Notas de calidad:**
> Todas las fechas de normas aplicables ahora están resueltas. El D.S. 8 debe usar fecha de **publicación** (20/01/2021) como referencia canónica.

---

### `NORM-PD-002` - Desglose del D.S. 8 (metas por categoría)
**Estado:** ✅ RESUELTO
**Fuente:** bcn.cl/leychile/navegar?idNorma=1154847 + economiacircular.mma.gob.cl
**Hallazgo textual:**
> **Categoría A (aro < 57 pulgadas, excepto 45, 49, 51):**
> | Año | Recolección | Valorización |
> |---|---|---|
> | 1 | 50% | 25% |
> | 2 | - | 30% |
> | 3 | - | 35% |
> | 4 | 80% | 60% |
> | 6 | - | 80% |
> | 8 | 90% | 90% |
>
> **Restricción cualitativa:** El 60% mínimo de la valorización de Categoría A debe corresponder a reciclaje material o rencauche.
>
> **Categoría B (aros = 45, 49, 51, o ≥ 57 pulgadas):**
> | Año | Recolección | Valorización | Base Normativa |
> |---|---|---|---|
> | 2023 (Año 1) | 25% | 25% | D.S. 8 / Manual Ley REP MMA |
> | 2024 | 30% | 30% | Interpolación Manual Ley REP |
> | 2025 | 35% | 35% | Interpolación Manual Ley REP |
> | 2026 | 60% | 60% | Interpolación Manual Ley REP |
> | 2027 | 60% | 60% | Interpolación Manual Ley REP |
> | 2028 | 80% | 80% | Interpolación Manual Ley REP |
> | 2029 | 90% | 90% | Interpolación Manual Ley REP |
> | 2030+ | 100% | 100% | Tope D.S. 8 |
>
> **REGLA DE EQUIVALENCIA (Informe 6, verificado):** Para Cat. B **NO existen metas de recolección independientes**. La meta de recolección es matemáticamente idéntica a la de valorización. El NFU minero se acopia directamente en faena y sale bajo contrato cerrado de logística inversa. El logro de la meta de valorización acredita, por defecto legal, el cumplimiento de la meta de recolección.
>
> **Implicancia arquitectónica:** El módulo Cat. B NO necesita flujo de recolección independiente. Al registrar un Certificado de Valorización Final, el ERP debe inyectar automáticamente un registro espejo en la tabla de recolección por el mismo tonelaje.

**Notas de calidad:**
> Gap de Cat. B cerrado por Informe 6. La tabla interanualizada proviene del Manual Ley REP del MMA (economiacircular.mma.gob.cl/wp-content/uploads/2025/07/4.-Manual-Ley-REP.pdf). La regla de equivalencia es verificable en el D.S. 8 y en el SISREP.

---

### `NORM-EN-001` - Porcentajes de meta REP verificados
**Estado:** ✅ RESUELTO (completo)
**Fuente:** Misma que NORM-PD-002 + Informe 6 (Manual Ley REP MMA)
**Hallazgo textual:**
> Los porcentajes provienen del Modelo de Economía Circular del MMA y del texto del D.S. 8 en bcn.cl. Son consistentes entre ambas fuentes. Los de Categoría A están completos. Los de Categoría B **ahora están completos**: la recolección es idéntica a la valorización (regla de equivalencia confirmada por Informe 6).

---

### `NORM-PD-003` - Ley 19.799 (Firma Electrónica)
**Estado:** ✅ RESUELTO
**Fuente:** digital.gob.cl + entidadacreditadora.gob.cl + esign-la.com (Reglamento)
**Hallazgo textual:**
> La Ley 19.799 "Sobre Documentos Electrónicos, Firma Electrónica y Servicios de Certificación de Dicha Firma" reconoce dos tipos:
>
> 1. **Firma Electrónica Simple (FES):** Permite identificación del firmante. Los proveedores de FES NO requieren acreditación estatal. Barrera de entrada baja.
> 2. **Firma Electrónica Avanzada (FEA):** Permite identificación indiscutible del firmante y **garantiza la integridad del documento, haciéndolo irrepudiable**. Tiene valor probatorio equivalente a **firma manuscrita**.
>
> Solo la FEA tiene equivalencia jurídica con firma manuscrita. Los prestadores de FEA deben estar acreditados ante la Subsecretaría de Economía y Empresas de Menor Tamaño (Entidad Acreditadora).
>
> **Requisitos del prestador acreditado (PSC):**
> - Persona jurídica domiciliada en Chile
> - Acreditación únicamente por la Subsecretaría de Economía
> - Retención de registros por mínimo 6 años
> - Seguro de responsabilidad civil mínimo 5.000 UF sin deducible
> - Estructura estandarizada con las normas correspondientes
> - Prohibición de guardar copias de datos de creación de firma post-entrega

---

### `NORM-PD-004` - Ley 21.719 (Datos Personales)
**Estado:** ✅ RESUELTO (ver sección INFORME 4, `NORM-PD-004` línea ~551)
**Fuente:** bcn.cl/leychile/navegar?idNorma=1209272 + Informe 4
**Hallazgo textual:**
> Vigencia plena: **1 de diciembre de 2026**. Detalle completo en la sección de Informe 4 más abajo.

---

### `SEGR-EN-002` - Fecha de vigencia plena de la Ley 21.719
**Estado:** ✅ RESUELTO (ver sección INFORME 4, `SEGR-EN-002` línea ~640)
**Hallazgo:** 1 de diciembre de 2026 (Art. Primero Transitorio, 24 meses desde publicación 13/12/2024).

---

### `NORM-EN-003` - Monto máximo de multas y artículo
**Estado:** ✅ RESUELTO
**Fuente:** snifa.sma.gob.cl + portal.sma.gob.cl + bcn.cl
**Hallazgo textual:**
> - **Artículo 36 de la Ley 20.417** clasifica las infracciones en **gravísimas, graves y leves**.
> - **Artículo 39 de la Ley 20.417** establece que las infracciones gravísimas tienen multa de hasta **10.000 Unidades Tributarias Anuales (UTA)**.
> - Consecuencias adicionales: clausura temporal o definitiva, revocación de la Resolución de Calificación Ambiental (RCA).
> - Los Sistemas de Gestión Colectivos deben constituir cauciones (seguros/fianzas) con un Factor de Riesgo de Incumplimiento mínimo del 15%.
>
> **Precedentes:** La SMA ha iniciado los primeros procedimientos sancionatorios (2025), pero NO existen multas efectivamente aplicadas y cobradas de forma definitiva a la fecha. Casos relevantes:
> - **Insacomex (F-013-2025):** Cargo por omisión de reporte (toneladas introducidas 2022, operaciones 2023). Infracción GRAVE.
> - **Huawei (D-140-2025):** Cargo GRAVÍSIMO por operar sin Sistema de Gestión autorizado (envases, 2022-2024).

---

### `PROP-EN-001` - Obligaciones del Artículo 9 de la Ley 20.920
**Estado:** ✅ RESUELTO
**Fuente:** bcn.cl + repositorio.uchile.cl
**Hallazgo textual:**
> El Artículo 9 impone a los productores de productos prioritarios 4 obligaciones:
>
> **a)** Inscribirse en el registro del Artículo 37 (RETC).
> **b)** Organizar y financiar la recolección, almacenamiento, transporte y tratamiento de residuos **a través de Sistemas de Gestión** (no individualmente). La ley prohíbe tácitamente la acción individual informal.
> **c)** Cumplir con las metas cuantitativas del decreto supremo sectorial (D.S. 8 para NFU) en plazos y proporciones establecidos.
> **d)** Asegurar que la gestión se realice por **gestores autorizados y registrados**. La responsabilidad se extiende hasta la disposición final.

---

### `FUNC-EN-001` - Origen de los umbrales aritméticos (100 kg, 150 kg, 5%, 20%)
**Estado:** ⚠️ PARCIAL - Corrección crítica
**Fuente:** bcn.cl/leychile/navegar?idNorma=1154847
**Hallazgo textual:**
> **HALLAZGO CRÍTICO:** La clasificación Categoría A / Categoría B NO se basa en umbrales de peso (100 kg, 150 kg). Esa hipótesis queda **descartada por el texto legal**.
>
> La clasificación se basa en las **dimensiones geométricas del aro interior en pulgadas**:
> - **Categoría A:** Aro inferior a 57 pulgadas, excepto 45, 49 y 51 pulgadas.
> - **Categoría B:** Aro igual a 45, 49 o 51 pulgadas, o igual/mayor a 57 pulgadas.
>
> Los umbrales de discrepancia de peso (5%, 20%) NO fueron mencionados en este informe. Su origen podría ser una regla de negocio interna de TrazaAmbiental, no del D.S. 8. **Requiere validación con el CEO (Categoría B del mapa de insumos).**
**Notas de calidad:**
> Este hallazgo INVALIDA una premisa del reporte de brecha previo y de las reglas de negocio codificadas (RN-SOL). El PRD debe reflejar la clasificación por pulgadas de aro, no por peso. Los umbrales de 100/150 kg podrían ser una simplificación operativa interna, pero NO tienen fundamento en el D.S. 8. Decisión del CEO requerida.

---

### `ACTR-EN-001` - Artículos que definen cada actor en la Ley 20.920
**Estado:** ✅ RESUELTO (parcial - no todos los actores)
**Fuente:** bcn.cl + repositorio.uchile.cl
**Hallazgo textual:**
> Del Artículo 3 de la Ley 20.920:
> - **Producto Prioritario:** Art. 3, numeral 20
> - **Gestor:** Art. 3 (definición extraída textualmente: "persona natural o jurídica que realiza operaciones de manejo de residuos, autorizada y registrada")
> - **Sistema de Gestión:** Art. 3, numeral 27
> - **Productor:** Art. 3, numeral 21 (tres condiciones: enajenación primaria, marca propia, importación directa)
> - **Residuo:** Art. 3, numeral 24
> - **Valorización:** Art. 3, numeral 30
>
> **NO encontrados como definiciones aisladas en el Art. 3:**
> - **Reciclaje:** Mencionado como componente de "valorización", sin definición propia
> - **Recolección:** Listada como operación de manejo, sin definición semántica propia
> - **Generador:** Solo referencia indirecta a través de "Consumidor" (Art. 3: "todo generador de un residuo de producto prioritario")
>
> **Actores no cubiertos en este informe:**
> - Transportista, Importador, Exportador, Representante Legal, Delegado, Encargado, Administrador, Autoridad Sectorial → verificar en Ley 20.920 texto completo o en informes 2-4.
**Notas de calidad:**
> El Artículo 3 define actores con vocabulario jurídico. Varios actores del sistema (Transportista, Importador) podrían estar definidos en otros artículos o en reglamentos derivados. El PRD debe marcar la fuente exacta de cada actor.

---

### `GLOS-EN-001` - Definiciones textuales de la Ley 20.920 para el glosario
**Estado:** ✅ RESUELTO (parcial - 6 de 9 términos)
**Fuente:** bcn.cl/leychile/Navegar?idNorma=1090894
**Hallazgo textual:**
> Definiciones textuales del Artículo 3 extraídas verbatim:
>
> | Término | Definición textual | Numeral |
> |---|---|---|
> | Producto Prioritario | "Sustancia u objeto que una vez transformado en residuo, por su volumen, peligrosidad o presencia de recursos aprovechables, queda sujeto a las obligaciones de la responsabilidad extendida del productor" | 20 |
> | Residuo | "Sustancia u objeto que su generador desecha o tiene la intención u obligación de desechar de acuerdo a la normativa vigente" | 24 |
> | Valorización | "Conjunto de acciones cuyo objetivo es recuperar un residuo, uno o varios de los materiales que lo componen y/o el poder calorífico de los mismos. La valorización comprende la preparación para la reutilización, el reciclaje y la valorización energética" | 30 |
> | Gestor | "Persona natural o jurídica, pública o privada, que realiza cualquiera de las operaciones de manejo de residuos y que se encuentra autorizada y registrada en conformidad a la normativa vigente" | (sin numeral explícito) |
> | Sistema de Gestión | "Mecanismo instrumental para que los productores, individual o colectivamente, den cumplimiento a las obligaciones establecidas en el marco de la responsabilidad extendida del productor, a través de la implementación de un plan de gestión" | 27 |
> | Productor | "Todas aquellas personas, que independientemente de la técnica de comercialización; i) enajenan un producto prioritario por primera vez en el mercado nacional; ii) enajenan bajo marca propia un producto prioritario adquirido de un tercero que no es el primer distribuidor; o iii) importan un producto prioritario para su propio uso profesional" | 21 |
>
> **No encontrados como definiciones aisladas:** Reciclaje, Recolección, Generador.

---

### Bonus: Hallazgos no solicitados pero relevantes

#### Regla de categorización por pulgadas (D.S. 8)
**Relevancia:** FUNC-EN-001, MAQE, DATO
> La diferenciación Categoría A / B se basa exclusivamente en el **diámetro del aro interior en pulgadas**, no en peso. Regla algorítmica:
> - Si aro < 57 pulgadas Y aro ∉ {45, 49, 51} → Categoría A
> - Si aro ∈ {45, 49, 51} O aro ≥ 57 pulgadas → Categoría B
> Se mencionan por separado neumáticos de bicicletas y sillas de ruedas como entidades distintas.

#### Sub-umbral cualitativo del 60% (D.S. 8)
**Relevancia:** FUNC-CE-005, MAQE-CE-004
> Para Categoría A, no basta con alcanzar la meta global de valorización. El 60% mínimo debe ser reciclaje material o rencauche. La valorización energética (co-procesamiento en cementeras) sola NO satisface la meta.

#### Precedentes sancionatorios SMA (2025)
**Relevancia:** NORM-EN-003
> Insacomex y Huawei son los primeros procedimientos. Aún no hay multas cobradas. La SMA declara abiertamente que cruza datos aduaneros masivamente para identificar infractores.

---

## INFORME 2: Instituciones Fiscalizadoras y Nomenclatura

### `NORM-CE-002` - Nombres oficiales de instituciones verificados
**Estado:** ✅ RESUELTO
**Fuente:** mma.gob.cl, portal.sma.gob.cl, aduana.cl, sii.cl, minsal.cl, retc.mma.gob.cl, portalvu.mma.gob.cl
**Hallazgo textual:**

> **1. Ministerio del Medio Ambiente (MMA)**
> - Nombre oficial: **Ministerio del Medio Ambiente**
> - Sigla: MMA
> - Web: mma.gob.cl
> - Creado por: **Ley N° 20.417** (12 de enero de 2010, entró en operaciones 1 de octubre de 2010)
> - Reemplazó a la antigua CONAMA
> - Rol REP: Rectoría. Dicta los Decretos Supremos de metas (D.S. 8 para NFU). Aprueba/rechaza los Planes de Gestión de los Sistemas de Gestión a través de la Ventanilla Única del RETC.
> - **Hallazgo crítico - Pre-fiscalización:** El Art. 38, inciso 2° de la Ley 20.920 otorga al MMA un rol de "pre-fiscalización". Si el MMA detecta antecedentes que permitan presumir una infracción, **debe** remitir la información a la SMA y solicitar procedimiento sancionatorio. Esto transforma al MMA de regulador pasivo a monitor activo.
>
> **2. Superintendencia del Medio Ambiente (SMA)**
> - Nombre oficial: **Superintendencia del Medio Ambiente** (con "del", NO "de")
> - Sigla: SMA
> - Web: portal.sma.gob.cl
> - Creada por: **Art. 2° de la Ley N° 20.417** (2010)
> - Competencia REP: **Monopolio fiscalizador y sancionador** sobre Ley 20.920, consagrado en **Art. 34 de la Ley REP**.
> - Arts. 35 y 36 de la Ley REP establecen catálogo propio y cerrado de infracciones (gravísimas, graves, leves).
> - **Fiscalización dual:** Física (toneladas en terreno) Y algorítmica/digital (plataforma SISREP).
> - **SISREP (Sistema de Reporte de la REP):** Creado por **Resolución Exenta N° 2.084**, publicada en D.O. 27 de diciembre de 2023. Activación plena: **1 de enero de 2025**. Centralizado en plataforma "Mi SMA".
> - La SMA administra el **Registro Público de Sistemas de Gestión habilitados** (dentro de SISREP).
>
> **3. Secretaría Regional Ministerial de Salud (SEREMI de Salud / Autoridad Sanitaria)**
> - Nombre oficial: **Secretaría Regional Ministerial de Salud** (genéricamente "Autoridad Sanitaria")
> - Sigla: SEREMI de Salud
> - Web: minsal.cl + filiales regionales
> - Competencia: **Código Sanitario** (DFL N° 725), Libro X
> - **D.S. 148 (Residuos Peligrosos): NO aplica a NFU por regla general.** El neumático es caucho vulcanizado estabilizado, polímero inerte, clasificado como residuo industrial sólido **no peligroso** (refrendado por SEA en caso planta Mostazal, Región de O'Higgins).
> - Excepción: Si los NFU sufren contaminación cruzada accidental (solventes, PCB, residuos hospitalarios), activaría D.S. 148 transitoriamente.
> - **Competencia concurrente:** La SEREMI tiene jurisdicción agresiva sobre acopio de NFU por riesgo vectorial (mosquito Aedes aegypti: dengue, zika, chikungunya). Puede emitir resoluciones de prohibición de traslado interprovincial (ej. Res. Ex. CP N° 14.141/2023, Valparaíso) y clausurar instalaciones.
> - **D.S. 189/2005 (Rellenos Sanitarios):** Prohíbe terminantemente el depósito de neumáticos en rellenos sanitarios.
>
> **4. Servicio Nacional de Aduanas (SNA)**
> - Nombre oficial: **Servicio Nacional de Aduanas**
> - Sigla: SNA / Aduanas
> - Web: aduana.cl
> - Sede: Plaza Sotomayor 60, Valparaíso
> - Competencia REP activada por: **Resolución Exenta N° 134** (11 de enero de 2023) - modifica Compendio de Normas Aduaneras, Anexo 18.
> - Exige que al momento de importar neumáticos, el agente de aduanas acredite que el importador **pertenece a un Sistema de Gestión autorizado**. Sin esta acreditación, la importación es administrativamente irregular.
> - Opera como barrera preventiva contra el importador oportunista ("free-rider").
>
> **5. Servicio de Impuestos Internos (SII)**
> - Nombre oficial: **Servicio de Impuestos Internos**
> - Sigla: SII
> - Web: sii.cl
> - Competencia REP establecida en: **Oficio Ordinario N° 606** (23 de marzo de 2017), Subdirección Normativa.
> - Resoluciones clave:
>   - La actividad del gestor de residuos (recolección, transporte, trituración, transformación) es un **proceso industrial**, sujeto a **IVA** (Art. 20 N° 3 Ley de Renta + Art. 2 N° 2 Ley del IVA).
>   - Rentas clasificadas como **Primera Categoría**.
>   - Código de Actividad Económica (Giro): **900090** ("Otras actividades de manejo de desperdicios").
> - **Implicancia para trazabilidad:** La Res. Ex. 2084/SMA obliga a reportar el número de documento tributario electrónico (factura) que respalda cada operación de gestión de residuos. Esto permite cruce SMA↔SII para detectar doble contabilidad o reciclajes simulados.
>
> **6. Ministerio de Transportes y Telecomunicaciones (MTT) / Carabineros de Chile**
> - MTT: Certifica condiciones técnicas de la flota de camiones de transporte de NFU.
> - Carabineros: Intervención solo por contingencia (desperfecto mecánico, accidente que ponga en riesgo de vertido ilegal). No se requiere escolta policial rutinaria para transporte de NFU (no es residuo peligroso bajo D.S. 148).

---

### `GLOS-EN-002` - Nomenclatura institucional para el glosario del PRD
**Estado:** ✅ RESUELTO
**Fuente:** Informe 2, todas las secciones
**Hallazgo textual:**

> | Institución | Nombre Oficial Completo | Sigla | Acto Legal |
> |---|---|---|---|
> | Ministerio del Medio Ambiente | Ministerio del Medio Ambiente | MMA | Ley 20.417 (2010) |
> | Superintendencia del Medio Ambiente | Superintendencia **del** Medio Ambiente | SMA | Art. 2° Ley 20.417 (2010) |
> | Autoridad Sanitaria | Secretaría Regional Ministerial de Salud | SEREMI de Salud | Código Sanitario, DFL 725 |
> | Aduanas | Servicio Nacional de Aduanas | SNA | Res. Ex. 134 (2023) |
> | Impuestos Internos | Servicio de Impuestos Internos | SII | Oficio Ord. 606 (2017) |
> | Registro ambiental central | Registro de Emisiones y Transferencias de Contaminantes | RETC | Art. 37, Ley 20.920 |
> | Subsistema de residuos | Sistema Nacional de Declaración de Residuos | SINADER | Módulo dentro del RETC |
> | Reporte REP | Sistema de Reporte de la Responsabilidad Extendida del Productor | SISREP | Res. Ex. 2.084/SMA (2023) |
>
> **Clarificación crítica: GRANSIC**
> - **"GRANSIC" NO es un registro oficial del Estado.** No existe plataforma, agencia ni formulario estatal con ese nombre.
> - Es un acrónimo coloquial del mercado para **"Gran Sistema Colectivo"** de gestión.
> - Los importadores no se inscriben "en el GRANSIC"; se adhieren contractualmente a una corporación privada sin fines de lucro (Sistema Colectivo) que luego se registra formalmente ante el MMA (aprobación del Plan de Gestión vía RETC) y ante la SMA (empadronamiento operativo en SISREP).

---

### `SEGR-EN-001` - Competencias de fiscalización de la SMA sobre sistemas digitales
**Estado:** ✅ RESUELTO
**Fuente:** Informe 2, sección 3.3
**Hallazgo textual:**

> **La SMA tiene facultades plenas, expresas e indelegables para fiscalizar AMBOS dominios:**
> 1. **Fiscalización física:** Toneladas recolectadas y valorizadas in situ. Verifica porcentajes del D.S. 8.
> 2. **Fiscalización algorítmica/digital:** A través de SISREP y Res. Ex. 2.084:
>    - **Sistemas de Gestión:** Deben reportar via formato "Anexo neumáticos" con SKU, descripción, unidades, peso, identificación del consumidor, y el **N° de documento tributario electrónico** de respaldo.
>    - **Consumidores Industriales:** Deben reportar via "Planilla neumáticos" georreferenciada, con hojas: CIA0 (entregas a SG sin costo), CIB1 (valorización propia/directa), CIB2 (reportado por SG en representación).
>    - La SMA cruza datos de SISREP con facturas electrónicas del SII (giro 900090) y con datos aduaneros del SNA.
>    - **Garantías de cumplimiento:** Los Sistemas Colectivos deben caucionar financieramente sus operaciones (boleta de garantía o póliza de seguro), calculada con base en costo promedio × toneladas meta × factor de riesgo.
>
> **Conclusión:** La SMA no solo fiscaliza toneladas - fiscaliza la integridad del flujo de datos digital completo.

**Notas de calidad:**
> Hallazgo de alto valor para el PRD. El sistema TrazaAmbiental debe producir outputs compatibles con los formatos SISREP ("Anexo neumáticos", "Planilla neumáticos") y referenciar documentos tributarios electrónicos (facturas SII). Esto es un requisito de integración crítico.

---

### Bonus Informe 2: Hallazgos no solicitados pero relevantes

#### RETC, SINADER y la Ventanilla Única
**Relevancia:** INTG-PD-001, INTG-CE-001 a 003 (alimentan Informe 3)
> - **RETC** sigue llamándose oficialmente "Registro de Emisiones y Transferencias de Contaminantes". Opera bajo el MMA.
> - Acceso via **Portal de Ventanilla Única** (portalvu.mma.gob.cl), autenticación con **Clave Única del Registro Civil**.
> - **SINADER NO es un sistema independiente del RETC.** Es un "sistema sectorial" (módulo) incrustado dentro del RETC y accesible vía Ventanilla Única.
> - SINADER usa nomenclatura **Listado Europeo de Residuos (LER)** versión 2025.
> - Declaración mensual opera con **un mes de desfase** (declaración de febrero = datos de enero).

#### Registro bifásico de Sistemas de Gestión
**Relevancia:** ACTR-EN-001
> 1. **Fase de aprobación:** Plan de Gestión presentado al MMA vía RETC/Ventanilla Única.
> 2. **Fase de empadronamiento:** Sistema habilitado se registra en SISREP/SMA para reporte operativo continuo.

#### Triangulación de datos entre agencias
**Relevancia:** SEGR-EN-001, INTG-EN-001
> La SMA cruza en milisegundos: importaciones brutas (SNA/Aduanas) ↔ facturas tributarias (SII, giro 900090) ↔ declaraciones de NFU valorizados (SINADER/RETC, códigos LER 2025). Esto anula la posibilidad de doble contabilidad o reciclajes simulados.

#### Resolución Exenta N° 2.084 de la SMA
**Relevancia:** NORM-CE-002, SEGR-EN-001, INTG-CE-001
> Publicada en D.O. el 27/12/2023. Establece el marco metodológico completo para reportes mensuales, contenido de informes de cumplimiento final, formatos de interoperabilidad ("Anexo neumáticos", "Planilla neumáticos"), y las garantías de cumplimiento financiero.

## INFORME 3: Interfaces Digitales del Estado y Firma Electrónica

### `INTG-PD-001` - Plataformas del Estado con las que el sistema debe interoperar
**Estado:** ✅ RESUELTO
**Fuente:** retc.mma.gob.cl, portalvu.mma.gob.cl, datosretc.mma.gob.cl, sicexchile.cl, entidadacreditadora.gob.cl
**Hallazgo textual:**

> **1. RETC (Registro de Emisiones y Transferencias de Contaminantes)**
> - Base de datos integral regulada por D.S. N° 1/2013 del MMA.
> - **3 portales operativos:**
>   - Portal institucional/difusión: retc.mma.gob.cl (informativo, manuales, guías)
>   - **Ventanilla Única (transaccional): portalvu.mma.gob.cl** - autenticación con ClaveÚnica, gestión de establecimientos, cargas masivas
>   - Datos Abiertos: datosretc.mma.gob.cl - plataforma CKAN, solo lectura (*read-only*)
>
> **2. SINADER (Sistema Nacional de Declaración de Residuos)**
> - **NO es plataforma independiente.** Es un submódulo/"sistema sectorial" incrustado dentro del RETC vía Ventanilla Única.
> - Acceso: ClaveÚnica → RETC → Menú "Mis Establecimientos" → "Solicitud a Sistemas Sectoriales" → activación de perfil (Generador Industrial, Generador Municipal, Destinatario Final). Sujeto a aprobación burocrática del MMA.
> - Taxonomía: Código LER (Listado Europeo de Residuos). Códigos clave NFU: **46** (Reciclaje de NFU), **75** (Reciclaje general/coprocesamiento).
>
> **3. SICEX (Sistema Integrado de Comercio Exterior)**
> - Plataforma de Aduanas/Ministerio de Hacienda: sicexchile.cl
> - Centraliza la declaración de importación (DIN, DIPS).
> - Partidas arancelarias NFU: **4011.1000, 4011.2000, 4011.3000, 4011.4000, 4011.7000, 4011.8011, 4011.8019**
>
> **4. Ecosistema de Firma Electrónica**
> - Regulado por Ley 19.799.
> - Entidad Acreditadora: Subsecretaría de Economía (entidadacreditadora.gob.cl)

---

### `INTG-CE-001` - Existencia de APIs públicas transaccionales
**Estado:** ✅ RESUELTO
**Fuente:** Informe 3, secciones 2.2 y 4.3
**Hallazgo textual:**

> **HALLAZGO CRÍTICO - RETC/SINADER:**
> - **NO existen APIs transaccionales públicas (REST o SOAP) para escritura** de declaraciones de residuos en la Ventanilla Única.
> - La "API CKAN" del portal de Datos Abiertos es estrictamente *read-only* (consultas históricas para investigadores/periodistas). No tiene capacidades de escritura.
> - Esto **descarta integraciones síncronas máquina-a-máquina (M2M)**.
>
> **HALLAZGO CRÍTICO - SICEX:**
> - **Tampoco existe documentación pública de APIs RESTful o SOAP** para inyectar declaraciones de importación programáticamente.
> - Las integraciones SICEX↔puertos son EDI cerrado (*back-end* institucional, red privada).
> - No hay portales para desarrolladores, API Keys, ni especificaciones Swagger/OpenAPI.
> - Mesa de ayuda para dudas técnicas: mas@hacienda.gov.cl

**Notas de calidad:**
> Este es el hallazgo más determinante para la arquitectura de TrazaAmbiental. El sistema NO podrá comunicarse directamente con el Estado. Toda interacción será asíncrona vía generación de archivos.

---

### `INTG-CE-002` - Método de carga de datos al RETC/SINADER
**Estado:** ✅ RESUELTO
**Fuente:** Informe 3, sección 2.3 (Manual de Carga Masiva SINADER)
**Hallazgo textual:**

> **Dos mecanismos exclusivos en Ventanilla Única:**
>
> **A) Ingreso Manual (Formulario Web):** Digitación celda por celda. Inviable para operaciones de volumen.
>
> **B) Carga Masiva (Bulk Data Load):** El sistema permite archivos tabulados. **Formato obligatorio: .xlsx (Microsoft Excel)**. El CSV está **explícitamente prohibido**.
>
> **Plantilla Anual (6 columnas):**
> | Columna | Tipo | Regla de validación |
> |---|---|---|
> | ID | Entero correlativo | Ascendente (1, 2, 3...) |
> | LER | Código 6 dígitos | **Separados por espacios** (ej. `20 03 01`, NO `200301` ni `20-03-01`) |
> | RUT | RUT contraparte | **Sin puntos, con guión y dígito verificador** (ej. `76085903-6`) |
> | TRATAMIENTO | Código numérico | Catálogo predefinido (46=Reciclaje NFU, 75=Reciclaje general) |
> | CANTIDAD | Toneladas | **Decimales con coma (,)**, prohibido punto (.) como separador de miles. Requiere *locale* es-CL |
> | ESTABLECIMIENTO | ID oficial | Otorgado por Ventanilla Única. Sin ID = rechazo de fila |
>
> **Plantilla Mensual (9 columnas):** Las 6 anteriores + 3 adicionales:
> | Columna | Regla |
> |---|---|
> | RUT TRANSPORTISTA | RUT del transportista |
> | PATENTE | Placa vehicular (con resolución sanitaria vigente) |
> | FECHA MOVIMIENTO | **DD/MM/AAAA con barras diagonales**. Excel muta barras a guiones → forzar formato personalizado `dd"/"mm"/"yyyy` |
>
> **Bibliotecas requeridas:** openpyxl (Python) o ExcelJS (Node.js) para generar .xlsx binarios válidos.

**Notas de calidad:**
> Esto define un requisito funcional duro: TrazaAmbiental DEBE tener un módulo de exportación que genere .xlsx con las reglas exactas de formateo (LER con espacios, RUT sin puntos, decimales con coma, fechas con barras). Cualquier discrepancia = rechazo de carga.

---

### `INTG-CE-003` - Periodicidad de reportes al Estado
**Estado:** ✅ RESUELTO
**Fuente:** Informe 3, secciones 3.2 y 4.2
**Hallazgo textual:**

> **SINADER:**
> - **Mensual:** Carga masiva detallada, mes vencido (ej. en marzo se reporta febrero).
> - **Anual:** Declaración consolidada de flujos, para cruce fiscal.
>
> **SMA (Sistemas de Gestión):**
> - **Informe de avance:** Fecha límite **30 de septiembre** del año en curso.
> - **Informe final auditado:** Fecha límite **31 de mayo** del año subsiguiente (auditado por terceros independientes). Acredita metas de valorización.
>
> **Aduanas/SICEX:**
> - Declaración al momento de importación (DIN/DIPS). Incluye: partida arancelaria, acreditación de pertenencia a Sistema de Gestión, segregación volumétrica por Categoría A/B, exclusiones (macizos, sillas de ruedas, bicicletas).

---

### `INTG-EN-001` - Interoperabilidad entre plataformas del Estado
**Estado:** ✅ RESUELTO
**Fuente:** Informe 3, sección 7 + Informe 2
**Hallazgo textual:**

> La interoperabilidad real entre agencias ocurre a nivel *back-end* institucional, no vía APIs públicas:
> - **SMA cruza:** SISREP ↔ facturas SII (giro 900090) ↔ datos aduaneros SNA
> - **SICEX integra:** con plataformas portuarias (Puerto Angamos, Valparaíso, San Vicente) vía EDI cerrado
> - **RETC/SINADER:** opera como módulo unificado bajo Ventanilla Única con ClaveÚnica
>
> TrazaAmbiental NO participa en estas integraciones *back-end*. Su rol es generar los insumos (.xlsx, facturas electrónicas) que alimentan estos cruces.

---

### `INTG-EN-002` - Prestadores de Firma Electrónica Avanzada vigentes
**Estado:** ✅ RESUELTO
**Fuente:** Informe 3, sección 5.2 (catastro Subsecretaría de Economía, abril 2026)
**Hallazgo textual:**

> **11 prestadores vigentes:**
> | Prestador | Estado | Acreditación |
> |---|---|---|
> | E-CERTCHILE | Vigente | 14/08/2003 |
> | ACEPTA.COM SPA | Vigente | 21/10/2004 |
> | E-SIGN S.A. | Vigente | 01/06/2005 |
> | CERTINET S.A. | Vigente | 21/07/2006 |
> | BPO ADVISORS SPA (IDOK) | Vigente | 06/11/2017 |
> | THOMAS SIGNE CHILE S.A. | Vigente | 12/02/2020 |
> | ABANCERT SPA | Vigente | 28/02/2022 |
> | DOX PSC SPA (Firmadox) | Vigente | 26/05/2022 |
> | E-DIGITAL PKI SPA (Firmaki) | Vigente | 03/10/2022 |
> | MICROSYSTEM S.A. | Vigente | 16/03/2023 |
> | CERTIFICADORA DEL SUR SPA | Vigente | 05/06/2024 |
>
> **2 prestadores revocados:**
> | Prestador | Estado | Causa |
> |---|---|---|
> | **TOC S.A.** | Cancelado (01/06/2021) | Emitió 73.884 FEA con biometría facial remota. La Subsecretaría ordenó cesar (junio 2020); TOC desobedeció emitiendo 44.813 certificados adicionales. Cancelación definitiva e inapelable. |
> | E-PARTNERS | Cesado (09/03/2022) | Cese voluntario |
>
> **Prestadores internacionales (ej. CertiSign):** NO acreditados en Chile. Firmas digitales pero **sin validez legal** para Ley REP.
>
> **Modelo de autenticación del MMA:**
> - **ClaveÚnica:** Trámites operativos cotidianos (acceso Ventanilla Única, carga planillas SINADER, DJA del RETC). Equivale a firma electrónica simple.
> - **FEA:** Requerida para documentos formales: anexos de reportabilidad final a SMA, acreditación de metas, resoluciones operativas, mandatos de representación.

**Notas de calidad:**
> TOC S.A. es precedente sancionatorio clave: prohíbe de facto la autenticación biométrica facial remota para FEA. TrazaAmbiental NO puede usar reconocimiento facial para firmar documentos legales.
> El PRD debe especificar que la integración FEA se hará exclusivamente con prestadores del catastro vigente.

---

### `NOFN-EN-001` - Requisitos de conectividad e infraestructura
**Estado:** ✅ RESUELTO
**Fuente:** Informe 3, secciones 6.1 y 6.2 (datos SUBTEL 2025-2026)
**Hallazgo textual:**

> **Polos industriales metropolitanos (alta capacidad):**
> - Ñuble: 770,7 / 698,3 Mbps (bajada/subida)
> - Biobío: 765,2 / 630,9 Mbps
> - O'Higgins: 752 / 560,7 Mbps
> - 74,7% de accesos fijos sobre fibra óptica (junio 2025)
>
> **Áreas rurales (restricción crítica):**
> - Brecha digital de acceso fijo: **32,20%** a nivel país
> - Zonas WiFi ChileGob: **1 Mbps bajada, 256 Kbps subida** por usuario
> - Redes móviles de borde: intermitencia total a velocidades 3G marginales
>
> **Implicancia arquitectónica MANDATORIA:**
> - El front-end móvil (choferes, operadores en basurales) **DEBE ser Offline-First**
> - Base de datos embebida (SQLite/Realm) para almacenar firma, fecha, geolocalización, LER encriptadamente
> - Sincronización de paquetes ligeros (KB, no MB) vía *web workers* en segundo plano al retornar a zona 4G/5G
> - Paradigma PWA (Progressive Web App) o nativo con DB local
>
> **Cloud disponible en Chile:**
> - **GCP:** Región nativa `southamerica-west1` operativa (Quilicura/Cerrillos, Santiago). PostgreSQL/NoSQL con latencia local, jurisdicción chilena.
> - **AWS:** Local Zone Santiago operativa. Direct Connect en Sonda Quilicura Q2. Región completa (3 AZs) proyectada para finales 2026/inicios 2027. Inversión anunciada: US$ 4.000 millones.
> - **Locales:** GTD Hosting (DC Panamericana, Lidice I/II, Moneda, Holanda). IFX Networks (Magnus I, Elbosque, Phillips).

**Notas de calidad:**
> La arquitectura Offline-First NO es una preferencia - es un requisito derivado de datos oficiales de SUBTEL. El PRD debe consagrarlo como requisito no funcional innegociable.

---

### Bonus Informe 3: Hallazgos no solicitados pero relevantes

#### Regla de formateo de fechas en Excel (anti-bug)
**Relevancia:** INTG-CE-002
> Excel muta automáticamente las barras diagonales de las fechas a guiones (DD-MM-AAAA en lugar de DD/MM/AAAA). El validador del MMA rechaza este formato. La celda debe tener formato personalizado `dd"/"mm"/"yyyy`.

#### D.S. 189/2005 (prohibición de NFU en rellenos sanitarios)
**Relevancia:** NORM-CE-002
> Los neumáticos están terminantemente prohibidos en rellenos sanitarios (D.S. 189/2005 de la Autoridad Sanitaria). Los códigos de disposición final (11=Relleno sanitario, 33=Depósito de Seguridad) aplican solo si la operación no cumple jerarquía de valorización.

#### Generación de NFU en Chile (datos MMA)
**Relevancia:** FUNC-EN-001, MAQE
> - 6,6 millones de neumáticos desechados/año (~180.000 toneladas)
> - Generación efectiva (post-desgaste): ~140.000 toneladas/año
> - Histórico de manejo racional: apenas 17%
> - Metas D.S. 8: desde 25% (2023) escalando a 90% valorización / 100% recolección (2030)

#### Cuello de botella humano-digital
**Relevancia:** INTG-CE-001, INTG-CE-002
> TrazaAmbiental no interactuará con endpoints REST del Estado. Su función será: tabular datos → procesarlos → generar .xlsx con formato estricto → entregarlo a operador humano para carga en pantallas estatales. Este es el modelo operativo real.

## INFORME 4: Ley 21.719 - Protección de Datos Personales

### `NORM-PD-004` - Ley 21.719 con fecha de vigencia plena
**Estado:** ✅ RESUELTO
**Fuente:** bcn.cl/leychile/navegar?idNorma=1209272 + Informe 4, secciones 1 y 2
**Hallazgo textual:**

> **Nombre oficial:** "Ley N° 21.719 - Regula la Protección y el Tratamiento de los Datos Personales y crea la Agencia de Protección de Datos Personales"
> **Publicación en Diario Oficial:** 13 de diciembre de 2024
> **Vigencia plena (vacatio legis):** **1 de diciembre de 2026** (Art. Primero Transitorio: "comenzará a regir el día primero del mes vigésimo cuarto posterior a la publicación")
> **Institución emisora:** Congreso Nacional / Ministerio Secretaría General de la Presidencia
>
> **Relación técnica con Ley 19.628:** La Ley 21.719 NO deroga nominalmente la Ley 19.628 - la somete a "modificación y sustitución integral de su articulado". El Art. Primero sustituye en el título la frase "la vida privada" por "los datos personales", consagrando la separación entre derecho a la intimidad y derecho a la autodeterminación informativa.
>
> **Plazos reglamentarios:**
> - Reglamentos generales: antes del 13/06/2025 (Art. Segundo Transitorio)
> - Reglamento Art. 26 (funcionamiento Agencia): 6 meses desde vigencia plena
>
> **Aceleración de la Agencia (Ley 21.806, D.O. 05/02/2026):**
> Modifica Art. Cuarto Transitorio: el Presidente propone 3 consejeros directivos entre 80 y 60 días antes del hito de 6 meses previo a la vigencia (es decir, antes de junio 2026). El Senado aprueba o se activa aprobación automática por silencio.
>
> **Régimen PYMES (Art. 14 septies):**
> - Flexibilización de cargas operativas (transparencia, seguridad) para micro, pequeñas y medianas empresas (Ley 20.416)
> - **Moratoria de 12 meses** (01/12/2026 – 01/12/2027): PYMES exentas de multas económicas, solo amonestación escrita
> - Grandes empresas (>100.000 UF ventas anuales): sin moratoria

**Notas de calidad:**
> La vigencia plena de la Ley 21.719 coincide con la fase de desarrollo estimada para TrazaAmbiental. El PRD debe tratar esta ley como *vinculante desde el diseño*, no como requisito futuro.

---

### `SEGR-CE-001` - Operacionalización de la Ley 21.719
**Estado:** ✅ RESUELTO
**Fuente:** Informe 4, secciones 4, 5 y 6
**Hallazgo textual:**

> **1. Base de Licitud (Art. 13 b) - HALLAZGO CRÍTICO:**
> TrazaAmbiental **NO DEBE solicitar consentimiento** a los representantes legales para el tratamiento de sus datos personales.
> La base de licitud correcta es: **"cumplimiento de una obligación legal"** (Art. 13 letra b), derivada de la Ley 20.920.
>
> **Peligro del consentimiento superfluo:**
> - Vulnera el Principio de Transparencia (Art. 14 ter): informar que se "pide permiso" cuando la ley obliga es una ficción engañosa
> - El consentimiento es **revocable** (Art. 12): si el representante legal revoca, el sistema enfrenta una imposibilidad jurídica - o elimina el dato (rompe la cadena de custodia REP) o lo retiene (viola la revocación)
> - Solución: Aviso de Privacidad que declare tratamiento mandatorio basado en Art. 13 b de Ley 21.719 en concordancia con Ley 20.920
>
> **2. Delegado de Protección de Datos (DPO):**
> - **NO obligatorio** para empresas privadas en general (Art. Quinto Disposiciones Finales: obligatorio solo para organismos públicos)
> - **Recomendación estratégica:** designación voluntaria del DPO es **circunstancia atenuante** para graduar infracciones y multas (Arts. 33-35)
> - Modalidad: interno o externalizado ("DPO as a Service")
>
> **3. Registro de Actividades de Tratamiento (RAT):**
> - Obligatorio para demostrar "responsabilidad proactiva" (accountability)
> - Debe documentar: flujo de ingreso de datos, justificación de licitud por campo, ubicación geográfica de servidores, encargados subcontratados, calendarios de purga
> - Formato definitivo pendiente de reglamentación de la Agencia
>
> **4. Evaluación de Impacto en Protección de Datos (EIPD) - Art. 15 ter:**
> - Obligatoria si tratamiento a "gran escala" o datos sensibles
> - Si TrazaAmbiental concentra representantes legales de TODA la industria NFU chilena → podría calificar como tratamiento masivo → EIPD obligatoria
> - Si se usa firma biométrica → EIPD ineludible por mandato legal expreso (Art. 15 ter, letra d)
>
> **5. Derechos ARCOP (Acceso, Rectificación, Cancelación/supresión, Oposición, Portabilidad):**
> - El derecho a supresión **NO es absoluto** (Art. 16 + Art. 13 b)
> - Cuando la retención obedece a "cumplimiento de obligación legal" (Ley REP + SMA), la eliminación destruiría la trazabilidad probatoria
> - **Mecanismo de BLOQUEO:** el dato se vuelve indisponible para tratamiento general pero se preserva pasivamente para autoridades competentes (SMA, tribunales ambientales, Agencia PDP)
> - El bloqueo NO puede ser indefinido: debe vincularse al plazo de prescripción de responsabilidades derivadas de la Ley REP
>
> **6. Deber de Información y Transparencia (Art. 14 ter):**
> Política de Tratamiento de Datos visible en la plataforma, con:
> - Identidad y canales de contacto del responsable
> - Bases de licitud (obligación legal Ley 20.920)
> - Fines específicos de la recolección
> - Categorías de destinatarios (MMA, SMA, certificadoras)
> - Plazos de conservación
> - Mecanismos de ejercicio de derechos ARCOP
> - Dirección del DPO (si aplica)
>
> **7. Deber de reportar brechas de seguridad (Art. 14 sexies):**
> - Primera vez en legislación chilena
> - Notificación a la Agencia PDP en plazos perentorios
> - Si afecta significativamente derechos de titulares (o datos sensibles) → notificación directa a cada afectado
> - Omisión deliberada = infracción gravísima
>
> **8. Privacidad desde el Diseño (Art. 14 quáter):**
> - Integrar protección de datos desde la etapa de desarrollo
> - Configuración por defecto: solo datos estrictamente necesarios para trazabilidad

**Notas de calidad:**
> Este es el hallazgo más contraintuitivo del cuarteto de informes: el PRD debe *prohibir expresamente* el uso de checkboxes de consentimiento para datos de representantes legales vinculados a operaciones REP. El consentimiento no solo es innecesario - es jurídicamente defectuoso.

---

### `SEGR-EN-002` - Fecha de adecuación a la Ley 21.719
**Estado:** ✅ RESUELTO
**Fuente:** Informe 4, sección 2.1
**Hallazgo textual:**

> **Fecha de vigencia plena: 1 de diciembre de 2026**
> (Art. Primero Transitorio: 24 meses desde publicación en D.O. el 13/12/2024)
>
> **Consecuencia:** TrazaAmbiental debe estar en cumplimiento completo para esa fecha. Dado que la Agencia estará operativa con anticipación (Ley 21.806), las fiscalizaciones preparatorias podrían iniciar antes.

---

### `DATO-EN-001` - Clasificación de datos personales según Ley 21.719
**Estado:** ✅ RESUELTO
**Fuente:** Informe 4, sección 3 (tablas de clasificación)
**Hallazgo textual:**

> **Alcance subjetivo (Art. 1° bis):** la ley protege EXCLUSIVAMENTE datos de **personas naturales**.
> Los datos de personas jurídicas (RUT corporativo, razón social, domicilio fiscal, giro) **NO están cubiertos**.
>
> **Taxonomía de datos en TrazaAmbiental:**
>
> | Campo | Categoría Jurídica | Sujeto | Riesgo |
> |---|---|---|---|
> | RUT de la Empresa | **No regulado** | Persona Jurídica | Nulo |
> | Razón Social / Domicilio Fiscal | **No regulado** | Persona Jurídica | Nulo |
> | Nombre Completo (Rep. Legal) | Dato Personal Común (Identificación) | Persona Natural | Moderado |
> | RUT (Rep. Legal) | Dato Personal Común (Identificación) | Persona Natural | Moderado |
> | Correo Electrónico (Rep. Legal) | Dato Personal Común | Persona Natural | Moderado |
> | Domicilio (Rep. Legal) | Dato Personal Común / Localización | Persona Natural | Moderado |
> | Firma Electrónica PKI (Simple/Avanzada) | Dato Personal Común | Persona Natural | Moderado |
> | Firma Electrónica Biométrica | **Dato Personal Sensible (Biométrico)** | Persona Natural | **CRÍTICO** |
>
> **Error común a evitar:** asumir que datos de contacto corporativo (ej. j.perez@valorizadora.cl) pierden su naturaleza de "dato personal" por usarse en contexto B2B. La ley NO hace distinción privado/profesional.
>
> **Implicancia arquitectónica MANDATORIA:**
> - **Firma digital estándar (PKI):** dato personal común → régimen general de la ley
> - **Firma biométrica (trazo dinámico, facial, dactilar):** dato personal sensible (Art. 16 ter) → activa régimen excepcional:
>   - Consentimiento explícito obligatorio (Art. 16 bis) - NO es posible usar base de "obligación legal" para biometría porque la Ley 20.920 no exige textualmente biometría
>   - EIPD obligatoria (Art. 15 ter, letra d)
>   - Infracciones clasificadas como "gravísimas" (multas hasta 20.000 UTM)
>   - Notificación directa a cada afectado en caso de brecha
> - **Recomendación:** el PRD debe PROHIBIR el uso de biometría para firmas en la plataforma y mandatar firma digital exclusivamente

**Notas de calidad:**
> La distinción persona natural / persona jurídica reduce masivamente el scope de cumplimiento. Solo los datos del representante legal (no de la empresa) están regulados. Pero la distinción firma digital vs firma biométrica es una bomba de relojería: un solo cambio técnico (agregar trazo dinámico de firma en tablet) elevaría instantáneamente el régimen regulatorio al nivel máximo.

---

### `DATO-EN-002` - Base de licitud para datos de representantes legales
**Estado:** ✅ RESUELTO (HALLAZGO INVIERTE LA PREMISA ORIGINAL DEL CHECK)
**Fuente:** Informe 4, sección 4.1 y 4.2
**Hallazgo textual:**

> **La checklist original preguntaba:** "Buscar la obligación de consentimiento explícito para datos de representantes legales"
>
> **El informe demuestra que la premisa del check es INCORRECTA.** El PRD debe especificar exactamente lo contrario:
>
> **NO hay obligación de consentimiento.** La base de licitud correcta es:
> **Art. 13, letra b) de la Ley 21.719:** *"Cuando el tratamiento sea necesario para la ejecución o el cumplimiento de una obligación legal o lo disponga la ley"*
>
> La Ley 20.920 (REP) exige trazabilidad ambiental ininterrumpida, lo que hace administrativamente ineludible identificar a las personas naturales que detentan la representación jurídica de los actores regulados.
>
> **El PRD debe:**
> 1. Declarar la base de licitud como "obligación legal" (Art. 13 b)
> 2. NO implementar checkboxes de consentimiento
> 3. Desplegar un Aviso de Privacidad informando tratamiento mandatorio
> 4. Documentar la relación Art. 13 b ↔ Ley 20.920
>
> **Excepción ÚNICA:** si el sistema usa firma biométrica (dato sensible), la base de "obligación legal" es insuficiente → se requiere consentimiento explícito para el componente biométrico (Art. 16 bis + Art. 16 ter). Esto refuerza la prohibición de biometría.

**Notas de calidad:**
> Este es el check que más cambia entre lo que la checklist asumía y lo que la ley realmente exige. La checklist redactada *antes* del research asumía que se necesitaría consentimiento. El research demuestra que solicitar consentimiento sería un *error estratégico*: crearía un vector de ataque jurídico (revocación) contra la cadena de custodia ambiental.

---

### Bonus Informe 4: Hallazgos no solicitados pero relevantes

#### Régimen Sancionatorio (Arts. 33-35)
**Relevancia:** SEGR-CE-001, SEGR-EN-001
> **3 estratos de infracciones:**
> | Estrato | Tipo | Ejemplos | Multa máxima |
> |---|---|---|---|
> | Leve (Art. 34 bis) | Negligencia formal | Falta de política de privacidad, incumplimiento de plazos ARCOP | 5.000 UTM |
> | Grave (Art. 34 ter) | Ataque al control de la información | Tratamiento sin base legal, ceder datos a terceros no autorizados | 10.000 UTM |
> | Gravísimo (Art. 34 quáter) | Vulneración extrema | Tratamiento fraudulento, procesar datos sensibles sin autorización, ocultar brechas | 20.000 UTM (>US$ 1 millón) |
>
> **Reincidencia (Art. 35) - INNOVACIÓN MÁXIMA:**
> - Solo para faltas graves/gravísimas de empresas NO PYMES
> - La Agencia puede abandonar los topes fijos UTM y aplicar multas proporcionales:
>   - Faltas graves: hasta **2% de ingresos anuales**
>   - Faltas gravísimas: hasta **4% de ingresos anuales** (modelo GDPR)

#### Mecanismo de Bloqueo como Patrón Arquitectónico
**Relevancia:** DATO-CE-002, SEGR-CE-002
> Cuando un representante legal solicita supresión de datos tras desvincularse de su empresa:
> 1. NO se procede a destrucción física del registro
> 2. Se aplica "bloqueo técnico": datos indisponibles para tratamiento general (marketing, envíos, perfilamiento)
> 3. Datos preservados pasivamente SOLO para autoridades competentes (SMA, tribunales, Agencia PDP)
> 4. El bloqueo tiene fecha de expiración vinculada a prescripción de responsabilidades REP
> 5. Tras expiración → supresión definitiva mandatoria
>
> Este patrón debe implementarse como arquitectura de datos desde el diseño del sistema.

---

## INFORME 5: Operativa de Reportabilidad NFU y Contexto Estratégico del Mercado

### Hallazgo Macro: Redefinición Arquitectónica
**Relevancia:** TODOS los checks de §4, §6, §7

> **El Informe 5 redefine la naturaleza del sistema.** TrazaAmbiental no es un software de logística con reportes - es un **middleware de cumplimiento normativo, ambiental y financiero** que opera como motor ETL entre tres sistemas estatales con diccionarios de datos completamente divergentes:
>
> | Sistema Estatal | Unidad de Medida | Taxonomía | Foco |
> |---|---|---|---|
> | Aduanas / SICEX | **Kilogramos Netos (KN)** | Arancel 4011.xxxx (Sistema Armonizado) | Ingreso a frontera |
> | MMA / SINADER | **Toneladas métricas** | Código LER Cap. 16 (ej. `16 01 03`) | Movimiento físico de residuos |
> | SMA / SISREP | **Unidades (SKU) → peso estimado** | Categoría A/B por pulgadas de aro | Cumplimiento de metas REP |
>
> **Implicancia arquitectónica mandatoria:** El núcleo del sistema debe ser un motor de equivalencia metrológica protegido que reconcilie KN ↔ toneladas ↔ SKU×peso_unitario sin intervención humana. Un error de conversión en Aduanas se propaga silenciosamente y explota años después en la auditoría SMA.

---

### Eje 1A: Plantillas SINADER - Estructura Completa
**Relevancia:** `INTG-CE-001`, `INTG-CE-002`, `INTG-EN-002`, `FUNC-CE-005`
**Fuente:** Manual Carga Masiva SINADER (https://vu.mma.gob.cl/manuals/sinader/MANUAL_CARGA_MASIVA_SINADER_MMA.pdf)

> **Formato Anual (Nacional) - 6 columnas obligatorias:**
>
> | Columna | Tipo | Reglas de validación |
> |---|---|---|
> | ID | Entero | Correlativo secuencial (1, 2, 3...) |
> | LER | String | Con espacios entre niveles: `16 01 03` (NO `160103`) |
> | RUT | String | Sin puntos, con guión y DV: `76237208-8` |
> | TRATAMIENTO | Entero (2 dígitos) | Código oficial del Estado (ver taxonomía abajo) |
> | CANTIDAD | Decimal | Toneladas métricas, coma como separador decimal (`,` NO `.`) |
> | ESTABLECIMIENTO | Entero | ID Ventanilla Única del recinto físico |
>
> **Formato Mensual (Región Metropolitana) - 9 columnas:**
> Las 6 anteriores + 3 columnas adicionales de trazabilidad logística:
> - `RUT TRANSPORTISTA` (string, sin puntos)
> - `PATENTE` (string, vehículo pre-autorizado por SEREMI de Salud)
> - `FECHA MOVIMIENTO` (date, formato `dd/mm/yyyy` forzado como máscara personalizada en celda Excel)
>
> **5 Reglas de Validación Críticas:**
> 1. Decimales con coma obligatoria - punto rechaza la matriz completa
> 2. Excel corrompe silenciosamente `dd/mm/yyyy` - forzar máscara personalizada en metadatos de celda
> 3. RUT sin puntos, con guión y DV
> 4. Validación cruzada semántica: el ESTABLECIMIENTO debe tener RCA vigente para el código de TRATAMIENTO declarado
> 5. Entidades no registradas en Ventanilla Única no pueden incluirse en carga masiva (rompe automatización)

---

### Eje 1A (cont.): Taxonomía de Códigos de Tratamiento NFU
**Relevancia:** `FUNC-CE-005`, `FUNC-CE-006`, `GLOS-EN-001`

> | Código SINADER | Operación | Descripción |
> |---|---|---|
> | **47** | Pretratamiento (Centro de Acopio) | Clasificación, acopio, remoción de aros, trozado preliminar |
> | **46** | Reciclaje de NFU | Granulación mecánica / trituración criogénica → caucho + acero + fibra |
> | **23** | Co-procesamiento | Valorización energética en hornos cementeros (TDF) |
> | **7** | Preparación para Reutilización | Recauchaje (reencauche) - extiende vida útil |
> | **11, 12, 14, 30** | Eliminación | Relleno sanitario / vertedero - NO suma a metas REP |
>
> Estos códigos son la clave para mapear eventos físicos de planta → taxonomía estatal. El PRD debe exigir que el sistema tenga una tabla paramétrica con estos códigos y sus requisitos de RCA.

---

### Eje 1B: Formatos SMA - Resolución Exenta 2.084
**Relevancia:** `INTG-CE-001`, `INTG-CE-002`, `INTG-PD-001`, `DATO-CE-001`, `DATO-CE-002`
**Fuente principal:** https://portal.sma.gob.cl/index.php/portal-regulados/instructivos-y-guias/ley-rep/

> **Calendario anual de cumplimiento:**
> - Reportes mensuales dentro de los primeros **10 días hábiles** de cada mes
> - Informe de avance: antes del **30 de septiembre**
> - Informe final auditado: antes del **31 de mayo del año subsiguiente**
> - Auditoría externa puede ser requerida por la SMA
>
> **"Anexo Neumáticos" (Sistemas de Gestión):**
> - URL directa: `https://transparencia.sma.gob.cl/doc/rep/REP_ConsolidadoNeumaticos.xlsx`
> - 3 pestañas/bases de datos obligatorias:
>   1. **Catálogo de SKU:** cada producto con descripción, Categoría A/B (por pulgadas), tabla de equivalencia SKU→peso como residuo
>   2. **Introducción al Mercado (Línea Base):** producto, unidades, fecha, identificación del comprador (+ calificación industrial si no es retail)
>   3. **Operaciones de Manejo:** fecha, tipo tratamiento (jerarquía D.S. 8), RUT del gestor, cantidad, **costo exacto en CLP**, **folio DTE del SII**
>
> **"Planilla Consumidores Industriales":**
> - URL directa: `https://transparencia.sma.gob.cl/doc/rep/REP_conind_neumaticos.xlsx`
> - Pestañas: Diccionario (glosario + reglas validación), General (metadata + SG vinculados como Neuvol/Valora Más)
> - Canal de entrega temporal: Google Forms cifrado (https://forms.gle/TKb8VnPrs8o5iUKh9)
>
> **HALLAZGO CRÍTICO - Fusión logístico-financiera:**
> La SMA exige "costo en pesos chilenos" + "código DTE" por cada movimiento de neumáticos. Esto convierte un problema logístico en un problema de **integración financiero-contable**. TrazaAmbiental debe poder vincularse con ERPs financieros (SAP, Oracle, Defontana) o con el SII para automatizar la relación factura↔tonelada.
>
> **Retención de datos: 6 AÑOS** (Art. 14, Res. Ex. 2.084). Incluye documentación de respaldo, registros digitales brutos y trazabilidad tributaria.
>
> **Regla de prevalencia:** ante discrepancia entre el informe narrativo y las planillas Excel, **prevalecen los datos de las planillas**.

---

### Eje 1C: Declaración de Importaciones - Aduanas / SICEX
**Relevancia:** `INTG-CE-003`, `FUNC-CE-003`, `FUNC-EN-001`

> **Partidas arancelarias NFU (Arancel 4011):**
> - `4011.1000` - Automóviles de turismo
> - `4011.2000` - Autobuses / camiones
> - `4011.3000` - Aeronaves
> - `4011.4000` - Motocicletas
> - `4011.7000` a `4011.8019` - Agrícola, forestal, construcción, minería
>
> **Declaración Jurada REP Neumáticos:**
> Formato oficial del SNA: https://www.aduana.cl/aduana/site/docs/20081010/20081010155624/djurada_rep_neumaticos.pdf
>
> Glosa mandatoria:
> *"Hago presente que los neumáticos objeto de esta Declaración, tienen un peso de ________ KN, correspondiente a la categoría ________, y se encuentran amparados en la DIPS/DIN N° ________ de fecha ________, emitido por la Aduana de ________, Factura Comercial N° ________ de fecha ________."*
>
> **Resoluciones que modifican el Compendio:** Res. Exenta N° 111 y 134 (enero 2023) - alteran Anexo 18 para incluir descriptores REP.
>
> **Fricción metrológica:** Aduanas opera en KN (kilogramos netos), pero la Categoría A/B se define por pulgadas de aro, no por peso ni por partida arancelaria. Se requiere tabla paramétrica de conversión partida arancelaria × pulgadas de aro → Categoría A/B.

---

### Eje 2A: Estructura del Mercado NFU Chileno (2024-2026)
**Relevancia:** `ACTR-EN-001`, `ACTR-EN-002`, §1 (diferenciación), sesión CEO

> **Sistemas de Gestión operativos confirmados:**
>
> | Sistema de Gestión | Nombre Legal | Modelo de Tarificación |
> |---|---|---|
> | **Neuvol** | Corporación Sistema Colectivo de Gestión de NFU Neuvol | $249,5 - $262,5 + IVA por kg |
> | **Valora Más** | Corporación de Sistema de Gestión de NFU Valora Más | Licitaciones públicas a transportistas y gestores |
>
> Fuente para listado actualizado: https://datosretc.mma.gob.cl/dataset/sistemas-de-gestion-aprobados
>
> **GRANSIC (Envases y Embalajes, no NFU):** ReSimple y GIRO operan como Grandes Sistemas Colectivos pero para envases. No gestionan neumáticos directamente.
>
> **Principales gestores/valorizadores:**
> - **Polambiente** y **Resur** - reciclaje mecánico (Código 46). Resur: ~350 ton/mes Cat. A
> - **Cementeras** - co-procesamiento (Código 23). Valorización energética TDF
> - **Arrigoni Ambiental NFU** - pirólisis (Cat. B, sector minero). Productos: negro de humo, acero, AANFU Oil
>
> **Datos de mercado:**
> - 6,6 millones de neumáticos/año consumidos (~140.000 ton residuos post-desgaste)
> - Pre-Ley REP: solo 17% gestionado racionalmente
> - Cat. B (minería): cumplimiento acelerado - Codelco El Teniente superó meta 2024 anticipadamente
> - Cat. A (automoción): problema atomizado - miles de puntos generadores (vulcanizaciones, talleres mecánicos, zonas rurales)
>
> **Insight estratégico para el PRD:**
> La micro-trazabilidad logística de Cat. A (orquestar retiro en miles de nodos con algoritmo de rutas) es el principal vector de valor diferencial de TrazaAmbiental para los SG que operan en el mercado automotriz urbano.

---

### Eje 2B: Referentes Internacionales
**Relevancia:** §1 (posicionamiento), §5 (máquina de estados), §7 (integraciones futuras)

> **Francia - Aliapur + Aliabase:**
> - 376.000 ton/año, 47 millones de neumáticos
> - **Aliabase:** extranet cloud que integra 40.000 talleres + 29 proveedores de transporte en tiempo real
> - Módulos de inventario y peso intersecan con el núcleo financiero-contable
> - **eAZyBox:** contenedores IoT con telemetría - disparan recolección automática al alcanzar ~1 ton
> - **Futuro:** Digital Product Passport (DPP) + RFID embebido en neumáticos (horizonte 2027-2029)
>
> **España - SIGNUS Ecovalor:**
> - 200.000+ ton/año, 25.820 talleres
> - **Ecomodulación tarifaria** (Real Decreto 712/2025): las tarifas ya no son planas por peso - varían según el impacto ambiental del compuesto del neumático y su reciclabilidad
> - Implicancia: el motor de facturación del ERP debe soportar tarificación paramétrica y asimétrica
>
> **Brasil - Reciclanip + SINIR:**
> - 379.000 ton/año, 1.100+ puntos de acopio
> - Pilar: **Certificado de Destinação Final (CDF)** - sin CDF emitido por planta + rubricado por autoridad, ninguna tonelada cuenta como valorizada
> - Equivalente chileno: el DTE del SII atado al pesaje validado
> - Arquitectura necesaria: "Bóveda Documental" que conecte trazablemente factura↔pesaje↔certificado
>
> **Australia - TSA (Tyre Stewardship Australia):**
> - Pre-intervención: 17% reciclado (idéntico a Chile pre-REP)
> - **Auditoría de inventarios intermedios (Stock Level):** las plantas reportan mensualmente el material en tránsito/espera (equivalente chileno: Código 47). Omitirlo causa discordancias de balance de masa
> - **EPU (Equivalent Passenger Unit):** unidad universal de trazabilidad donde todo se reduce a múltiplos de 1 neumático estándar de pasajero. Neumáticos OTR mineros: tope fijo de 400 EPU. Elimina debates metrológicos
> - **Implicancia para TrazaAmbiental:** considerar tabla paramétrica tipo EPU para armonizar Arancel 4011 ↔ Categoría A/B ↔ tonelaje SINADER

---

### Bonus Informe 5: Hallazgos que afectan checks existentes

#### Actualización de `FUNC-EN-001` (umbrales aritméticos)
**Estado anterior:** ⚠️ Parcial
**Estado actualizado:** ⚠️ Parcial (enriquecido)

> El Informe 5 aporta datos nuevos que enriquecen este check sin resolverlo completamente:
> - **Clasificación Cat. A/B:** confirmada por pulgadas de aro (no peso). Cat. A: <57" (excepto 45, 49, 51"). Cat. B: 45, 49, 51" + ≥57"
> - **Los umbrales de discrepancia 5%/20%** siguen sin aparecer en ninguna fuente legal o normativa. No están en la Res. Ex. 2.084 ni en el D.S. 8.
> - **Nuevo dato:** la SMA exige que la auditoría de cumplimiento sea verificable hasta el nivel de SKU individual con su peso específico como residuo. La discrepancia se calcularía entre unidades declaradas × peso_unitario_SKU vs. pesaje real en planta
> - **Conclusión:** Los umbrales de discrepancia son reglas operativas internas, no legales. Requiere definición del CEO.

#### Actualización de `INTG-CE-001` y `INTG-CE-002` (estrategia sin API)
**Estado anterior:** ✅ Resuelto (Informe 3)
**Estado actualizado:** ✅ Resuelto + ENRIQUECIDO con especificación exacta de formatos

> El Informe 3 estableció que no hay APIs. El Informe 5 entrega el contrato de interfaz completo: las 6/9 columnas SINADER, las 3 pestañas del Anexo Neumáticos SMA, y las reglas de validación. Esto transforma la abstracción "exportación algorítmica" en especificación técnica concreta.

#### Nuevo hallazgo: Retención de 6 años
**Relevancia:** `DATO-CE-001`, `DATO-CE-002`, `SEGR-CE-002`

> Art. 14 de la Res. Ex. 2.084 impone **6 años de retención obligatoria**. Esto define el parámetro exacto para:
> - `DATO-CE-001` (políticas de retención): mínimo legal = 6 años para toda la documentación de respaldo
> - `DATO-CE-002` (trazabilidad estricta): los registros deben ser protegidos durante los 6 años
> - `SEGR-CE-002` (trazabilidad estricta de certificados): los DTEs y pesajes validados son documentos probatorios
> - El "bloqueo técnico" del Informe 4 (datos de rep. legal) tiene fecha de expiración = prescripción REP, que probablemente calza con estos 6 años

#### Nuevo hallazgo: URLs de descarga de plantillas oficiales
**Para `docs/legal/`** - descargar manualmente:

> | Plantilla | URL |
> |---|---|
> | Manual Carga Masiva SINADER | https://vu.mma.gob.cl/manuals/sinader/MANUAL_CARGA_MASIVA_SINADER_MMA.pdf |
> | Instructivo SINADER (Greenrec) | https://greenrec.cl/wp-content/uploads/2022/04/Instructivo-Declaracion-en-SINADER.pdf |
> | Anexo Neumáticos (SG) | https://transparencia.sma.gob.cl/doc/rep/REP_ConsolidadoNeumaticos.xlsx |
> | Planilla Consumidores Industriales | https://transparencia.sma.gob.cl/doc/rep/REP_conind_neumaticos.xlsx |
> | Declaración Jurada REP Aduanas | https://www.aduana.cl/aduana/site/docs/20081010/20081010155624/djurada_rep_neumaticos.pdf |
> | SG Aprobados (Open Data) | https://datosretc.mma.gob.cl/dataset/sistemas-de-gestion-aprobados |

---

## INFORME 6: Cierre de Lagunas Documentales (Legal, Metrológico, Regulatorio)

### `NORM-DEF-001` - Definiciones legales faltantes (Ley 20.920, Art. 3)
**Estado:** ✅ RESUELTO
**Fuente:** Informe 6, Laguna 2 - Ley 20.920 Art. 3 + D.S. 22/2024 MINVU
**Hallazgo textual:**

> | Término | Definición textual | Norma | Estado |
> |---|---|---|---|
> | **Consumidor** | "Todo generador de un residuo de producto prioritario." | Ley 20.920, Art. 3, N° 6 | Definido formalmente |
> | **Generador** | *Sin definición propia aislada.* Se define circularmente a través de "Consumidor". | Ley 20.920, Art. 3 | NO definido formalmente |
> | **Transportista** | *Sin definición propia en normativa REP.* Se subordina a normas MTT y D.S. 148. | Ley 20.920 / D.S. 8 | NO definido formalmente |
> | **Recolección** | *Concepto operativo sin definición como entrada individual.* Se menciona referencialmente como "mecanismos de separación en origen y recolección selectiva". | Ley 20.920, Art. 3 | NO definido formalmente |
> | **Reciclaje** | *No posee definición independiente.* Subsumido como subconjunto de "Valorización", que comprende "la preparación para la reutilización, el reciclaje y la valorización energética". | Ley 20.920, Art. 3, N° 30 | NO definido formalmente |
> | **Almacenamiento** | "Acumulación de residuos en un lugar específico por un tiempo determinado." | Ley 20.920, Art. 3, N° 1 | Definido formalmente |
> | **Centro de Acopio** | *Término industrial sin nomenclatura legal explícita.* Término legal vinculante: "instalación de recepción y almacenamiento". | Ley 20.920, Art. 3 | NO definido formalmente |
> | **Consumidor Industrial** | "Todo establecimiento industrial, de acuerdo a la Ordenanza General de Urbanismo y Construcciones, que genere residuos de un producto prioritario." | Ley 20.920, Art. 3 / D.S. 22/2024 MINVU | Definido formalmente |
>
> **Implicancias arquitectónicas mandatorias:**
> 1. La entidad **Consumidor** = persona jurídica (RUT corporativo). El **Generador** = expresión física/geográfica del Consumidor (sucursales, faenas, puntos de venta). Vital para interactuar con SINADER (RUT maestro → múltiples códigos de establecimiento).
> 2. "Centro de Acopio" puede usarse como término UX en el frontend, pero el backend y los módulos de exportación deben etiquetar bajo `instalacion_recepcion_almacenamiento`.
> 3. "Reciclaje" debe eliminarse como categoría principal de tratamiento. La llave primaria es "Valorización"; reciclaje, recauchaje y co-procesamiento son llaves dependientes.

---

### `FUNC-EN-001` - Umbrales de discrepancia de peso (CERRADO)
**Estado anterior:** ⚠️ Parcial
**Estado actualizado:** ✅ RESUELTO
**Fuente:** Informe 6, Laguna 3 - OIML R76-1 (Non-automatic weighing instruments)
**Hallazgo textual:**

> **Marco metrológico legal:** Las romanas camioneras de plantas NFU son instrumentos Clase III (Exactitud Media) bajo OIML R76-1. La tolerancia NO es un porcentaje fijo; es una **función escalonada** basada en el rango de carga.
>
> Para una balanza de 60t con escalón de verificación e=20kg (3.000 divisiones):
>
> | Rango de carga | EMT verificación inicial | EMT en servicio |
> |---|---|---|
> | 0 a 10.000 kg | ±10 kg | ±20 kg |
> | 10.020 a 40.000 kg | ±20 kg | ±40 kg |
> | 40.020 a 60.000 kg | ±30 kg | ±60 kg |
>
> **Conclusión clave:** Para un camión de 40t, la divergencia máxima imputable a los instrumentos es ±40 kg por balanza, es decir **0.1% del peso** (no 5%). La suma de EMTs de dos balanzas = 0.2%.
>
> **Sistema de control de desviaciones multicapa propuesto:**
> 1. **Alerta Nivel 1 (Generador→Transportista):** Umbral 20%. Peso estimado sin balanza (talleres, mineras). Alerta informativa; el flujo avanza. El peso real de custodia lo determina el primer actor con balanza Clase III.
> 2. **Alerta Nivel 2 (Transportista→Planta):** Desviación aceptable = suma de EMTs en servicio de ambas balanzas. Para 40t = ±80 kg (0.2%).
> 3. **Alerta Nivel 3 - Bloqueo (>1% del bruto):** Si la desviación supera el 1% del total bruto (ej. 400 kg en 40.000 kg), el sistema bloquea como "Posible Fuga o Adulteración de Carga". Se requiere autorización manual de supervisor.
> 4. **Parámetro configurable:** `Tolerancia_Aceptable = Máx(Suma_EMTs_Balanzas, Umbral_Merma_Climática_Configurado)` - para factores como evaporación de humedad o adherencia de barro.
>
> **Los umbrales 5% y 20% del legacy NO tienen base legal ni metrológica.** Son reglas operativas configurables por el administrador del Sistema de Gestión.

---

### `NORM-RES-001` - Res. Ex. 2.279/2024 (Modificación de Res. Ex. 2.084)
**Estado:** ✅ NUEVO
**Fuente:** Informe 6, Laguna 5 - bcn.cl/leychile/navegar?idNorma=1209251
**Hallazgo textual:**

> La Res. Ex. 2.084 (dic. 2023) fue **modificada estructuralmente** por la Res. Ex. 2.279 (dic. 2024). Calendario de implementación reestructurado:
>
> | Fase | Fecha | Alcance |
> |---|---|---|
> | **Fase 1** | Enero 2025 | Catastro de Sistemas de Gestión en SISREP |
> | **Fase 2** | Abril 2025 | Reporte retroactivo de SG (ene-feb 2025), luego cadencia mensual regular |
> | **Fase 3** | Junio 2025 | Catastro y reporte obligatorio para Consumidores Industriales |
>
> **Reglas confirmadas:**
> - Ante discrepancia entre informe PDF y planillas Excel, **prevalecen los datos de las planillas**.
> - El reporte mensual corresponde al **penúltimo mes** contado desde la fecha del reporte.
> - El ERP debe implementar un **mecanismo de cierre de período** que consolide los datos del mes y prevenga alteraciones retroactivas. *(La Res. Ex. 2.279 exige reportes en plazo; la implementación técnica —write-locks, snapshots, flags de cierre— es decisión de arquitectura, no mandato legal.)*
>
> **Retención (actualización de DATO-CE-001):** La resolución exige conservación "hasta la remisión del informe final de cumplimiento al RETC" - no una cifra fija de 6 años, sino un evento. El mínimo legal práctico sigue siendo 6 años (Art. 14 Res. Ex. 2.084).

---

### `INTG-CE-002` - Anexo Neumáticos SMA (ENRIQUECIDO)
**Estado anterior:** ✅ Resuelto + ENRIQUECIDO
**Estado actualizado:** ✅ Resuelto + ENRIQUECIDO (Informe 6)
**Fuente:** Informe 6, Laguna 4
**Hallazgo adicional:**

> **Confirmación:** NO existe diccionario de datos público para REP_ConsolidadoNeumaticos.xlsx. Las reglas están embebidas como metadatos, macros y listas de validación dentro del propio archivo Excel.
>
> **Formato de SKU estándar del mercado:** `S.G - C - XXXX.XX` (propuesta técnica del mercado automotriz/aduanero). El ERP debe validar este formato con regex al registrar neumáticos en el maestro de materiales.
>
> **Motor de exportación .xlsx = núcleo de mayor criticidad del proyecto.** Cualquier desajuste estructural entre el Excel generado por el ERP y la matriz oficial de la SMA acarrea sanciones directas.

---

### `SEGR-CE-001` - Ley 21.719: Estado de la Agencia y cronograma (ENRIQUECIDO)
**Estado anterior:** ✅ Resuelto
**Estado actualizado:** ✅ Resuelto + ENRIQUECIDO (Informe 6)
**Fuente:** Informe 6, Laguna 6 - Guía Práctica Secretaría de Gobierno Digital
**Hallazgo adicional:**

> **Estado de la Agencia (abril 2026):** NO está operando plenamente ni tiene sitio web transaccional con capacidad fiscalizadora.
>
> **Cronograma de adecuación obligatorio:**
>
> | Hito | Plazo |
> |---|---|
> | Nombramiento DPO | Dic 2025 - Ene 2026 (fase activa) |
> | Levantamiento de información | Ene - Abr 2026 (en progreso) |
> | Catálogo de Datos Personales Tratados | May - Jun 2026 |
> | Política de Tratamiento de Datos | Jul 2026 |
> | Protocolos y Procedimientos | Ago - Nov 2026 (pre-vigencia plena) |
>
> **Base de licitud para TrazaAmbiental:** "Obligación Legal" (Art. 13 b, Ley 21.719), NO consentimiento. La captura de RUT, patente vehicular y datos de transportistas Se requiere del D.S. 8 y de las resoluciones SMA.
>
> **Requisito: Módulo de Inventariado Dinámico** - el sistema debe autogenerar el Catálogo de Datos Tratados (mayo/junio 2026).

---

### `SEGR-CONF-001` - Conflicto normativo: Ley REP (retención) vs. Ley 21.719 (supresión)
**Estado:** ✅ NUEVO
**Fuente:** Informe 6, Laguna 6
**Hallazgo textual:**

> Si un conductor independiente ejerce su "Derecho al Olvido" (supresión de datos, Ley 21.719), el ERP **NO puede ejecutar DELETE** si el transportista figura en un manifiesto de trazabilidad mensual de NFU. La Ley REP obliga a retener los respaldos auditables por años.
>
> **Resolución arquitectónica: Bloqueos Lógicos Duros (Hard Locks)**
> - Se purgan los datos comerciales del transportista.
> - Se preserva protegido su identificador en las tablas relacionales vinculadas a declaraciones ambientales presentadas ante el Estado.
> - Se aplica anonimización parcial cifrada cuando sea necesario.

---

### `INTG-CI-001` - Planilla de Consumidores Industriales: 3 rutas de acreditación
**Estado:** ✅ NUEVO
**Fuente:** Informe 6, Laguna 7 - REP_conind_neumaticos.xlsx
**Hallazgo textual:**

> La planilla de CI se bifurca en 3 rutas independientes de acreditación ambiental:
>
> | Ruta | Descripción | Crédito regulatorio |
> |---|---|---|
> | **CIA0** | CI entrega NFU físicamente a un Sistema de Gestión formal | Crédito va al SG receptor |
> | **CIB1** | CI valoriza por cuenta propia con plantas autorizadas | Crédito se distribuye **a prorrata** entre TODOS los SG del mercado |
> | **CIB2** | SG informa en nombre del CI mediante convenio legal | Crédito va exclusivamente al SG con convenio |
>
> **Diferencia clave:** Un SG traza un SKU desde su génesis comercial (importación) hasta su destrucción. Un CI ignora la introducción comercial y reporta exclusivamente la **generación física de pasivos ambientales** y su despeje por las 3 rutas.
>
> **Requisito no funcional:** El ERP no debe depender exclusivamente de integraciones automáticas con SISREP. Debe incluir un exportador que genere la planilla .xlsx para submit manual vía Google Forms cifrado (canal alterno confirmado activo).
>
> **Dato de mercado:** El número de CI inscritos en NFU no está disponible aún - el catastro obligatorio de CI inició en junio 2025 (Res. Ex. 2.279).

---

### `PROD-SC-002` - Decisión de scope: plataforma multi-módulo REP con prioridad NFU
**Estado:** ✅ NUEVO - Decisión del fundador
**Fuente:** Sesión de trabajo con fundador (2026-04-09)
**Hallazgo textual:**

> 1. **TrazaAmbiental abordará TODOS los residuos que exige la Ley REP**, conocidos internamente como "módulos".
> 2. **El primer módulo a implementar es NFU Categoría A y Categoría B**, por tres razones: (a) los NFU son fáciles de gestionar y en Chile son un problema real, (b) el CEO tiene amplia experiencia en plantas de pirólisis y quiere crear un centro de acopio en el norte de Chile, (c) existen contactos en minería para gestionar neumáticos de minería (Cat. B).
> 3. **Debe crearse un esqueleto mínimo para los otros tipos de residuos** (peligrosos y no peligrosos). Todos los módulos excepto NFU estarán **deshabilitados visualmente** en la interfaz.
> 4. **El PRD debe explicitar este scope**: NFU es el primer módulo a implementar, con la arquitectura diseñada para soportar la expansión a todos los productos prioritarios de la Ley REP.

---

## Tablero de Progreso

| Check ID | Estado | Informe |
|---|---|---|
| `NORM-PD-001` | ✅ Resuelto | 1 |
| `NORM-PD-002` | ✅ Resuelto | 1 |
| `NORM-PD-003` | ✅ Resuelto | 1 |
| `NORM-PD-004` | ✅ Resuelto | 4 |
| `NORM-CE-002` | ✅ Resuelto | 2 |
| `NORM-EN-001` | ✅ Resuelto | 1 |
| `NORM-EN-002` | ✅ Resuelto (completo) | 1+2+3 |
| `NORM-EN-003` | ✅ Resuelto | 1 |
| `PROP-EN-001` | ✅ Resuelto | 1 |
| `FUNC-EN-001` | ✅ RESUELTO - clasificación por pulgadas confirmada; umbrales 5%/20% NO tienen base legal ni metrológica (OIML R76-1 da 0.2%); sistema multicapa 3 niveles propuesto | 1+5+6 |
| `ACTR-EN-001` | ✅ Resuelto (6 actores + 2 SG confirmados: Neuvol + Valora Más) | 1+2+5 |
| `GLOS-EN-001` | ✅ Resuelto (enriquecido con códigos de tratamiento SINADER) | 1+5 |
| `GLOS-EN-002` | ✅ Resuelto | 2 |
| `INTG-PD-001` | ✅ Resuelto | 3 |
| `INTG-CE-001` | ✅ Resuelto + ENRIQUECIDO (formato SINADER completo: 6/9 columnas + reglas validación) | 3+5 |
| `INTG-CE-002` | ✅ Resuelto + ENRIQUECIDO (Anexo Neumáticos SMA: 3 pestañas + DTE obligatorio + formato SKU `S.G-C-XXXX.XX` + no existe diccionario público) | 3+5+6 |
| `INTG-CE-003` | ✅ Resuelto + ENRIQUECIDO (partidas 4011.xxxx + Declaración Jurada REP) | 3+5 |
| `INTG-EN-001` | ✅ Resuelto | 3 |
| `INTG-EN-002` | ✅ Resuelto + ENRIQUECIDO (reglas de validación SINADER especificadas) | 3+5 |
| `NOFN-EN-001` | ✅ Resuelto | 3 |
| `SEGR-CE-001` | ✅ Resuelto + ENRIQUECIDO (Agencia PDP no operativa; cronograma adecuación May-Nov 2026; módulo inventariado dinámico requerido) | 4+6 |
| `SEGR-EN-001` | ✅ Resuelto | 2 |
| `SEGR-EN-002` | ✅ Resuelto | 4 |
| `DATO-EN-001` | ✅ Resuelto | 4 |
| `DATO-EN-002` | ✅ Resuelto (INVIERTE premisa: NO consentimiento, sí obligación legal) | 4 |
| `DATO-CE-001` | ✅ ENRIQUECIDO - Retención mínima legal: 6 años prácticos (Art. 14 Res. Ex. 2.084), pero vinculada a evento: "hasta remisión del informe final al RETC" (Res. Ex. 2.279) | 5+6 |
| `DATO-CE-002` | ✅ ENRIQUECIDO - trazabilidad estricta de DTEs, pesajes y certificados durante 6 años | 5 |
| `NORM-TR-001` | ✅ NUEVO - Códigos SINADER tratamiento: 46 (reciclaje), 23 (co-procesamiento), 7 (reutilización), 47 (acopio) | 5+legacy |
| `NORM-CL-001` | ✅ NUEVO - NFU = residuo sólido NO peligroso (excepción: contaminación cruzada D.S. 148) | 2 |
| `NORM-PL-001` | ✅ NUEVO - Plazo DJA = 31 de marzo de cada año | 3+legacy |
| `NORM-FE-001` | ✅ NUEVO - FEA vigentes: Acepta, E-Sign, Certinet. TOC S.A. revocada. CertiSign no acreditada | 3 |
| `NORM-GD-001` | ✅ NUEVO - Guía de Despacho se emite al momento del despacho (salida), Art. 55 DFL 825 SII | brecha+SII |
| `NORM-RC-001` | ✅ NUEVO - RCA validada por SINADER en carga masiva (cruza código tratamiento vs. ficha establecimiento) | 5 |
| `INTL-EP-001` | ✅ NUEVO - Referente: modelo EPU australiano (Equivalent Passenger Unit) para tabla metrológica | 5 |
| `INTL-DP-001` | ✅ NUEVO - Referente: Digital Product Passport europeo (DPP/RFID, horizonte 2027-2029) | 5 |
| `PROD-UN-001` | ✅ NUEVO - Decisión ejecutada: unificación Generador/Productor en un solo dashboard | legacy |
| `PROD-SC-001` | ✅ NUEVO - Intención original: plataforma multi-producto prioritario con foco NFU | legacy+MASTER-SPEC |
| `ACTR-DOC-001` | ✅ NUEVO - Requisitos documentales por actor: Transportista (RETC + Res. Sanitaria + SINADER + Circulación + Rev.Técn.), Gestor (RETC + Res. Sanitaria + RCA por tratamiento + capacidad ton/año) | legacy+inf.2+inf.5 |
| `NORM-DEF-001` | ✅ NUEVO - 8 definiciones legales verbatim (Ley 20.920 Art. 3): Consumidor, Generador (no definido), Transportista (no definido), Recolección (no definido), Reciclaje (subconjunto Valorización), Almacenamiento, Centro de Acopio (no definido, término legal: instalación de recepción y almacenamiento), Consumidor Industrial | 6 |
| `NORM-RES-001` | ✅ NUEVO - Res. Ex. 2.279/2024 modifica Res. Ex. 2.084: calendario 3 fases (Ene 2025 catastro SG, Abr 2025 reporte SG, Jun 2025 catastro+reporte CI); prevalencia Excel sobre PDF; cierre de mes regulado | 6 |
| `SEGR-CONF-001` | ✅ NUEVO - Conflicto Ley REP (retención) vs. Ley 21.719 (supresión): resolución por bloqueos lógicos duros + anonimización parcial cifrada | 6 |
| `INTG-CI-001` | ✅ NUEVO - Planilla CI: 3 rutas CIA0 (entrega a SG), CIB1 (valoriza por cuenta propia, prorrata), CIB2 (SG informa por CI); Google Forms cifrado activo como canal alterno | 6 |
| `PROD-SC-002` | ✅ NUEVO - Decisión fundador: plataforma multi-módulo para TODOS los residuos REP; primer módulo NFU Cat A+B; esqueleto mínimo para otros módulos (deshabilitados visualmente) | sesión CEO |

---

## Anexo: Requisitos documentales por actor (extraído de legacy + informes)

### Transportista - Documentos necesarios para operar
| Documento | Fuente legal | Verificación |
|---|---|---|
| Inscripción RETC | Ley 20.920, Art. 37 | ID establecimiento en Ventanilla Única |
| Resolución Sanitaria SEREMI | Código Sanitario, DFL 725 | N° de resolución + vigencia |
| Inscripción SINADER | Módulo RETC | Perfil activo en Ventanilla Única |
| Permiso de Circulación del vehículo | MTT | Vigente año en curso |
| Revisión Técnica del vehículo | MTT | Al día |

**Nota:** El Transportista de NFU **NO** necesita Autorización Sanitaria de Transporte de Residuos Peligrosos (D.S. 148), porque los NFU son residuos sólidos no peligrosos (Informe 2, NORM-CL-001).

### Gestor/Valorizador - Documentos necesarios para operar
| Documento | Fuente legal | Verificación |
|---|---|---|
| Inscripción RETC | Ley 20.920, Art. 37 | ID establecimiento |
| Resolución Sanitaria SEREMI | Código Sanitario | N° de resolución + vigencia |
| RCA vinculada al código de tratamiento | SEIA + SINADER | Validación cruzada por SINADER en carga masiva |
| Capacidad autorizada (ton/año) | RCA + Res. Sanitaria | Límite operativo |
| Módulo REP activo (si aplica) | SMA/SISREP | Empadronamiento en SISREP |

**Nota:** El SINADER rechaza automáticamente transacciones si el establecimiento del Gestor no tiene la RCA para el código de tratamiento declarado (Informe 5, NORM-RC-001).

### Generador - Documentos necesarios para operar
| Documento | Fuente legal | Verificación |
|---|---|---|
| Inscripción RETC (como Generador Industrial si >12 ton/año) | Ley 20.920 + RETC | ID establecimiento |
| Adhesión a Sistema de Gestión | Ley 20.920, Art. 9 | Contrato con SG (Neuvol/Valora Más) |

**Nota:** Generadores pequeños (<12 ton/año) no requieren inscripción SINADER obligatoria, pero sí deben pertenecer a un SG.



## INFORME 07: DESARROLLO DE ÚLTIMA MILLA Y ESCLARECIMIENTO NORMATIVO FINAL

> **Convenio de Basilea y Exportación**
> - **Clasificación NFU:** B3140 (Anexo IX, Lista B, no peligroso). Los códigos Y48 y Y49 son erróneos para neumáticos.
> - **Enmienda de Prohibición:** Promulgada en Chile por D.S. N° 162/2019 (Ministerio de Relaciones Exteriores).
> - **Reglamento Transfronterizo:** D.S. N° 9/2017 del MMA (no D.S. 1/2013).

> **Aclaraciones Conceptuales (Ley Marco y D.S. 8)**
> - **Sistemas de Gestión vs. Comercializadores:** El Art. 15 del D.S. N° 8 impone obligaciones al Sistema de Gestión, no al Comercializador. Las obligaciones del Comercializador (recepción gratuita de NFU, entrega al SG sin costo) emanan directamente de la Ley 20.920.
> - **Facultades Municipales vs. Plan de Gestión:** El Art. 26 de la Ley 20.920 establece los contenidos del Plan de Gestión. El Art. 25 es el que confiere facultades a las Municipalidades para celebrar convenios con SG ("facilitadores de recolección").
> - **Consumidor:** Definido en Art. 3 de la Ley 20.920 ("todo generador de un residuo..."). Para Categoría A, constituye un vector atomizado minorista y no interactúa con SISREP ni Ventanilla Única.
> - **GRANSIC:** Es un neologismo gremial privado. Los municipios NO operan como GRANSIC en ninguna circunstancia legal ni de hecho.

> **Avances Tecnológicos Legislativos**
> - **Ley 21.719 (Ciberseguridad):** Obliga la instauración del RAT (Registro de Actividades de Tratamiento).
> - **APDP (Agencia Nacional):** No estará operativa funcionalmente e inspectivamente hasta el 1 de diciembre de 2026.
> - **SGD (Secretaría de Gobierno Digital):** Emite guía de 16 puntos para infraestructura del RAT.
> - **Rutas CIA0/CIB1/CIB2:** Definidas por la SMA para clasificación operativa de Consumidores Industriales.

---

## AXIOMAS DE LIMITACIÓN (Anti Scope Creep)

> **Propósito:** Blindar el eje documental contra la reinfección de Scope Creep. Cada axioma está respaldado por la auditoría cruzada cruzada de 8 informes de investigación independientes y codificado como restricción vinculante en `09-correcciones-auditabilidad.md`.

### `LIMIT-001` - El Estado recauda la transparencia, no el SaaS
**Fuente:** 09-correcciones-auditabilidad.md §2.1; Ley 20.285, Art. 2; Ley 20.920, Art. 37
**Axioma:** TrazaAmbiental es software privado operado por una persona jurídica privada sin fines de lucro. No está sujeto a las obligaciones de transparencia activa de la Ley 20.285. La consolidación y exposición de datos abiertos en formato CKAN es competencia exclusiva del MMA a través del RETC/SNIFA. Queda **prohibido** diseñar portales públicos, APIs de datos abiertos o datasets de lectura ciudadana.

---

### `LIMIT-002` - Las clausuras son con candados, no con código
**Fuente:** 09-correcciones-auditabilidad.md §2.2; 08-fixes.md, Hipótesis 2; Art. 174 Código Sanitario
**Axioma:** La SEREMI de Salud clausura instalaciones con candados, timbres y resolución sanitaria. Es un acto físico de la Autoridad Sanitaria, no una función de software. El Administrador del SG puede inhabilitar un establecimiento en el maestro de proveedores como gestión de riesgos interna (bloqueo lógico), pero **no se entrega un override, kill switch ni root de gobierno a organos del Estado** dentro del sistema.

---

### `LIMIT-003` - El sistema NO es un ERP de tributación
**Fuente:** 09-correcciones-auditabilidad.md §2.4; PRD §1.5 punto 6
**Axioma:** TrazaAmbiental no recauda Eco-Tasas, no factura, no liquida compensaciones a gestores ni calcula márgenes operativos. Esos procesos son competencia del ERP contable externo del SG (Defontana, Nubox, SAP). La única responsabilidad financiera del sistema es vincular cada movimiento de tonelaje ambiental a un folio DTE tributario procesado externamente, almacenando la referencia en el schema `ref_dte`.

---

### `LIMIT-004` - SKU es para el mercado, no para el patio
**Fuente:** 09-correcciones-auditabilidad.md §2.3; D.S. 8, Anexo Neumáticos Pestañas 1-2
**Axioma:** La tabla de equivalencias SKU↔peso aplica **exclusivamente** al submódulo de Introducción al Mercado (Productores/Importadores, Pestañas 1 y 2 del Anexo Neumáticos SISREP). Las interfaces móviles de pesaje de campo (Transportista, Gestor, Reciclador) operan con la tonelada métrica consolidada por Categoría A/B, medida en báscula certificada OIML R76-1 Clase III. Queda **prohibido** exponer el campo SKU en interfaces de terreno.

---

### `LIMIT-005` - FEA es para la firma del jefe, no del peón
**Fuente:** 09-correcciones-auditabilidad.md §2.5; Ley 19.799
**Axioma:** La Firma Electrónica Avanzada (FEA) se reserva para tres actos jurídicos específicos: (1) certificados de valorización emitidos por el Gestor, (2) mandatos de representación firmados por el Representante Legal, y (3) reportes anuales presentados a la SMA. Los operarios base (Delegados, coordinadores, jefes de planta) que ejecutan acciones operativas cotidianas se autentican con credenciales de plataforma + RBAC granular. Queda **prohibido** exigir FEA a usuarios que no firman actos jurídicos.

---

### `LIMIT-006` - Los workflows diplomáticos son del Estado, no del SaaS
**Fuente:** 09-correcciones-auditabilidad.md §2.6; D.S. N° 9/2017 (MMA); Convenio de Basilea
**Axioma:** Las comunicaciones del Procedimiento de Información y Consentimiento (PIC) del Convenio de Basilea operan de Estado a Estado a través de VUCE/SICEX. TrazaAmbiental no modela workflows diplomáticos interactivos. La única interfaz con Comercio Exterior es la recepción del PDF del «Certificado de Cierre o Eliminación» emitido por el país de destino. Queda **prohibido** implementar flujos PIC/SICEX nativos en el sistema.
