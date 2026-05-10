# Diccionario de Términos de Dominio — TrazaAmbiental

> **Protocolo HITL:** Este documento solo puede alterarse con confirmación expresa del usuario humano responsable. Un LLM no tiene autorización para modificar, reinterpretar ni eliminar entradas sin instrucción directa.
>
> **Propósito:** Estandarización léxica de todo el vocabulario de dominio utilizado en el proyecto TrazaAmbiental. Contempla términos legales, regulatorios, institucionales, metrológicos, operativos y de mercado. No contiene terminología informática ni de implementación técnica.
>
> **Documento vivo:** Se expande conforme TrazaAmbiental extienda su alcance a nuevos módulos y productos prioritarios.

---

## I. Actores Operativos y Regulados

**[ACT-01] Generador:** Establecimiento físico (sucursal, faena, punto de venta) que genera un residuo de producto prioritario por desgaste operacional. Expresión geográfica del Consumidor. No posee definición formal aislada en la Ley 20.920; se define circularmente a través de "Consumidor" (Art. 3, num. 6). *(Ref: Ley 20.920, Art. 3)*

**[ACT-02] Transportista:** Actor logístico autorizado que traslada NFU desde el Generador hasta el Gestor. No requiere autorización de transporte de residuos peligrosos porque los NFU son residuo sólido no peligroso. Sin definición propia en normativa REP; subordinado a normas MTT y Código Sanitario. *(Ref: DFL 725, MTT)*

**[ACT-03] Gestor / Valorizador:** Persona natural o jurídica autorizada y registrada para ejecutar operaciones de manejo de residuos. Emisor del Certificado de Valorización. *(Ref: Art. 3, Ley 20.920)*

**[ACT-04] Sistema de Gestión (SG):** Corporación privada sin fines de lucro constituida para que los productores cumplan colectivamente las obligaciones REP. El término "GRANSIC" es un neologismo gremial privado; no designa ningún registro ni plataforma estatal. *(Ref: Art. 3, num. 27, Ley 20.920)*

**[ACT-05] Consumidor Industrial (CI):** Establecimiento industrial que genera NFU por consumo propio. Posee 3 rutas de acreditación ante SISREP (CIA0, CIB1, CIB2). *(Ref: Ley 20.920, Art. 3; D.S. 22/2024 MINVU)*

**[ACT-06] Importador / Comercializador Mayorista:** Productor que enajena o importa por primera vez neumáticos al mercado chileno. Financia el SG mediante el pago de Eco-Tasas. Debe acreditar pertenencia a un SG ante Aduanas. *(Ref: D.S. 8; Res. Ex. 134, SNA)*

**[ACT-07] Consumidor Final:** Persona natural que entrega NFU en puntos de recolección primarios. Vector atomizado que no interactúa con TrazaAmbiental. *(Ref: Ley 20.920, Art. 3)*

**[ACT-08] Municipalidad:** Entidad local que puede suscribir convenios con SG para facilitar la recolección domiciliaria. Rol de acopio primario provisorio. No opera como SG ni como Gestor. *(Ref: Art. 25, Ley 20.920)*

**[ACT-09] Comercializador de Última Milla:** Tiendas o talleres que reciben NFU gratuitamente del consumidor al vender un neumático nuevo de reemplazo. Primera interfaz de acopio de Categoría A. El Art. 15 D.S. 8 impone obligaciones al SG, no al Comercializador; las obligaciones de este último emanan directamente de la Ley 20.920. *(Ref: Art. 18, D.S. 8)*

**[ACT-10] Representante Legal (RL):** Persona natural que detenta la representación jurídica de una empresa regulada. Sus datos personales se rigen por licitud legal (Art. 13 b, Ley 21.719), no por consentimiento. *(Ref: Ley 21.719, Código Civil)*

**[ACT-11] Delegado:** Empleado operativo designado temporalmente por el RL para interactuar con TrazaAmbiental mediante permisos fraccionados y mandatos FES o FEA. *(Ref: Ley 19.799)*

**[ACT-12] Administrador del Sistema:** Entidad técnica interna encargada de la parametrización de constantes normativas y la intervención de último recurso en transacciones bloqueadas.

**[ACT-13] Fiscalizador (MMA/SMA):** Usuario gubernamental con vista de solo lectura que verifica la fidelidad de las operaciones. Competencia REP de fiscalización y sanción es monopolio de la SMA (Art. 34, Ley 20.920). *(Ref: Ley 20.417, Ley 20.920)*

**[ACT-14] Auditor Externo:** Persona jurídica o natural que dictamina la veracidad del Informe Final del SG, requerido antes del 31 de mayo del año subsiguiente. *(Ref: Res. Ex. 2.084, SMA)*

**[ACT-15] Entidad Certificadora (PSC):** Prestador externo acreditado por la Subsecretaría de Economía para expedir FEA o FES. *(Ref: Ley 19.799)*

---

## II. Entidades Materiales e Instrumentos

**[ENT-01] NFU Categoría A:** Neumáticos Fuera de Uso con diámetro de aro inferior a 57 pulgadas, con excepción de 45, 49 y 51 pulgadas. Sub-cuota cualitativa: 60% de la valorización debe ser materialidad (reciclaje mecánico o recauchaje), no coprocesamiento energético. *(Ref: D.S. 8)*

**[ENT-02] NFU Categoría B:** Neumáticos de 45, 49, 51 y ≥ 57 pulgadas (minería, OTR). Metas de recolección y valorización son numéricamente idénticas (regla de equivalencia). *(Ref: D.S. 8)*

**[ENT-03] Eco-Tasa:** Canon pagado por el Productor/Importador al SG para financiar la gestión de residuos. El monto varía por SG y por condiciones de mercado. No es un valor fijo universal. *(Ref: Oficio 606 SII; esquemas de mercado)*

**[ENT-04] Certificado de Valorización:** Documento digital emitido por el Gestor tras completar el tratamiento de un lote de NFU. Vincula tonelaje a código SINADER y folio DTE. *(Ref: Res. Ex. 2.084, SMA)*

**[ENT-05] Guía de Despacho:** Documento Tributario Electrónico emitido al momento del despacho (salida) de la carga. *(Ref: Art. 55, DFL 825, SII)*

**[ENT-06] Declaración Jurada REP:** Formulario presentado por el importador ante Aduanas, acreditando pertenencia a un SG y declarando peso en KN y categoría. *(Ref: Res. Ex. 134, SNA)*

**[ENT-07] Residuo:** Sustancia u objeto que su generador desecha o tiene la intención u obligación de desechar de acuerdo a la normativa vigente. *(Ref: Art. 3, num. 24, Ley 20.920)*

**[ENT-08] Residuo Peligroso:** Residuo que presenta riesgo para la salud o el medio ambiente conforme al D.S. 148. Los NFU no califican como peligrosos por regla general (caucho vulcanizado, polímero inerte), salvo contaminación cruzada accidental. *(Ref: D.S. 148/2004, MINSAL)*

**[ENT-09] Producto Prioritario:** Sustancia u objeto que, transformado en residuo, queda sujeto a las obligaciones REP por su volumen, peligrosidad o presencia de recursos aprovechables. *(Ref: Art. 3, num. 20, Ley 20.920)*

**[ENT-10] Autorización Sanitaria:** Permiso otorgado por la SEREMI de Salud para operar instalaciones o actividades reguladas. Determina qué residuos y qué tratamientos están permitidos en una instalación específica. *(Ref: Código Sanitario, DFL 725)*

**[ENT-11] Resolución de Calificación Ambiental (RCA):** Acto administrativo del SEIA que autoriza a un establecimiento a operar determinados tratamientos de residuos. SINADER valida cruzadamente la RCA contra el código de tratamiento declarado. *(Ref: SEIA, SINADER)*

---

## III. Plataformas Gubernamentales

**[PLAT-01] RETC (Registro de Emisiones y Transferencias de Contaminantes):** Base de datos estructural del Estado operada por el MMA. Todos los actores regulados interactúan a través de la Ventanilla Única. *(Ref: D.S. N° 1/2013 MMA)*

**[PLAT-02] SINADER (Sistema Nacional de Declaración de Residuos):** Submódulo ("sistema sectorial") incrustado dentro del RETC, no independiente. Acepta exclusivamente formato .xlsx para carga masiva; el CSV está explícitamente prohibido. Cadencia: mensual (mes vencido) y anual. *(Ref: Manual Carga Masiva SINADER MMA)*

**[PLAT-03] SISREP (Sistema de Reporte de la REP):** Plataforma de la SMA para reporte operativo de NFU. Formato "Anexo Neumáticos" con 3 pestañas (SKU, Introducción al Mercado, Operaciones de Manejo). Cada operación requiere folio DTE del SII. Creado por Res. Ex. 2.084, activación plena 1 de enero de 2025. *(Ref: Res. Ex. 2.084, SMA)*

**[PLAT-04] SICEX (Sistema Integrado de Comercio Exterior):** Plataforma de Aduanas donde se registran pesos brutos de importación en KN por partida arancelaria 4011.x. Integraciones son vía EDI cerrado; no tiene APIs públicas REST/SOAP. *(Ref: SNA)*

**[PLAT-05] SNIFA (Sistema Nacional de Información de Fiscalización Ambiental):** Repositorio público de la SMA que expone resoluciones sancionatorias, procedimientos, y cumplimiento regulatorio. *(Ref: SMA)*

**[PLAT-06] Ventanilla Única:** Portal web transaccional del RETC (portalvu.mma.gob.cl). Único punto de entrada validado mediante ClaveÚnica para reportabilidad ambiental. *(Ref: MMA)*

**[PLAT-07] DJA (Declaración Jurada Anual del RETC):** Validación anual en la que el Titular o Encargado ratifica la exactitud de los datos reportados el año anterior en los sistemas sectoriales de Ventanilla Única. *(Ref: RETC)*

**[PLAT-08] SIDREP (Sistema de Seguimiento y Declaración de Residuos Peligrosos):** Sistema sectorial de Ventanilla Única específico para D.S. 148 (residuos peligrosos). No aplica directamente a flujo primario de NFU salvo emergencia/contaminación cruzada. *(Ref: RETC)*

---

## IV. Operaciones y Tratamientos

**[OPE-01] Valorización:** Cualquier operación cuyo fin sea que el residuo sirva de manera útil, sustituyendo a otros materiales que se habrían utilizado de otra forma. Incluye reciclaje, preparación para reutilización y valorización energética (coprocesamiento). *(Ref: Art. 3, num. 30, Ley 20.920, Directiva 2008/98/CE)*

**[OPE-02] Reciclaje:** Proceso mecánico o físico-químico mediante el cual los residuos son transformados en nuevos productos o materias primas. Subconjunto jerárquico de la Valorización. *(Ref: Ley 20.920)*

**[OPE-03] Coprocesamiento (Valorización Energética):** Uso del residuo —en este caso, NFU triturado conocido como TDF— como combustible complementario en procesos industriales con alta demanda calórica, típicamente hornos cementeros. Código SINADER: 23. *(Ref: D.S. 8)*

**[OPE-04] Recauchaje (Rencauche):** Procedimiento de reparación y renovación de la banda de rodadura de un neumático, devolviéndole su estatus original como bien de uso prolongado. Código SINADER: 7. *(Ref: D.S. 8)*

**[OPE-05] Acopio / Pretratamiento:** Operaciones preparatorias (remoción de aro de acero libre, trozado primario, clasificación por desgaste) para facilitar el transporte hacia la planta valorizadora final. Código SINADER: 47. No imputable para cumplimiento de metas. *(Ref: RETC / SINADER)*

**[OPE-06] Eliminación (Disposición Final):** Destino último de residuos donde se depositan (pozos, vertederos controlados o rellenos sanitarios) sin valorización material ni energética. Códigos SINADER: 11, 12, 14, 30. Prohibido formalmente para NFU, no aporta a las metas. *(Ref: D.S. 189/2005, SINADER)*

**[OPE-07] Segregación de Origen:** Acción temprana de clasificación y separación en el punto de generación o en centros logísticos primarios, aislándose fracciones recuperables. Relevante en minería (Categoría B) o patios urbanos consolidados. *(Ref: D.S. 8, Manual REP)*

**[OPE-08] Trazabilidad Lineal:** Mapeo correlativo e irrompible (Generación → Flete Logístico → Recepción → Valorización), donde el residuo no sufre fragmentación conceptual que modifique su taxonomía. *(Ref: Brief Tecnológico P-21)*

**[OPE-09] Trazabilidad Circular / Ramificada:** Registro que modela desprendimientos (eje: recauchaje trunco revierte a reciclaje material, o mermas/extracción de acero durante pretratamiento). *(Ref: Brief Tecnológico P-21)*

---

## V. Métricas, Marcos y Estándares

**[DAT-01] Códigos de Tratamiento (SINADER):** Diccionario paramétrico. Esenciales para TrazaAmbiental NFU: 46 (Reciclaje NFU/criogénico), 23 (Coprocesamiento térmico), 7 (Preparación/Reutilización/Recauchaje), 47 (Pretratamiento/Acopio). *(Ref: Manual Carga Masiva SINADER)*

**[DAT-02] Código LER (Listado Europeo de Residuos):** Taxonomía obligada. NFU clasifica típicamente en `16 01 03` (o subordinados del capítulo 16 si existen mezclas). Requiere espacio interdigito explícito para su pase en Excel. *(Ref: RETC, Catálogo LER 2025)*

**[DAT-03] RAT (Registro de Actividades de Tratamiento):** Instrumento de bitácora exigido por Ley 21.719 en el que se consolida la metadata sobre tratamiento de Datos Personales (identidad del Representante Legal, etc.). *(Ref: Ley 21.719)*

**[DAT-04] Clase III (Exactitud Media), OIML R76-1:** Norma técnica para romanas camioneras de alto tonelaje. Desplaza los antiguos porcentajes estáticos de tolerancia (5%) de TrazaAmbiental, instanciándose según rango de carga metrológico (EMT). *(Ref: OIML)*

**[DAT-05] Kilogramo Neto (KN):** Métrica restrictiva del modelo aduanero nacional. Provoca roce sistémico contra las Toneladas Métricas de RETC. TrazaAmbiental operará como traductor ponderativo (KN → TM → SKU). *(Ref: SICEX)*

**[DAT-06] EPU (Equivalent Passenger Unit):** Índice paramétrico auxiliar de unificación. Modela todo peso bruto en múltiples estándar del "neumático referencial de pasajero", útil para conversiones simplificadas en reportes macro. *(Ref: TSA Australia, best practice)*

**[DAT-07] SKU Híbrido (Stock Keeping Unit):** Identificador serial tipo `SG-C-XXXX` exigido por las planillas SMA que asocia inyectivos comerciales con la huella métrica final (KGs). Principal nexo en Categoría A. *(Ref: Anexo Neumáticos, SMA)*

**[DAT-08] ClaveÚnica:** Verificador digital expedido por Registro Civil de Chile. Opera jurídicamente bajo los rangos de la Firma Electrónica Simple (FES). *(Ref: Ley 19.799, Segpres)*

**[DAT-09] CSV vs XLSX (Reglas de Carga):** Arquitecturalmente, todo módulo exportador REP en TrazaAmbiental está obligado a compilar archivos `.xlsx` nativos y formateados. `.csv` resulta en rechazo inmediato. *(Ref: Manual Carga Masiva SINADER)*

**[DAT-10] Plan de Gestión (Plan REP):** Expediente multianual (usualmente quinquenal) formulado por la Corporación SG que requiere la aprobación del MMA antes de inscribir empadronamientos SISREP. *(Ref: Ley 20.920 Art 26)*

**[DAT-11] Pulgada de Aro (Discriminador A/B):** Variable cualitativa madre del sistema REP de Neumáticos, por encima del peso. Dictamina si un pasivo tributa a metas Cat. A o Cat. B, e influencia la sub-cuota paralela del 60%. *(Ref: D.S. 8)*

**[DAT-12] Arancel 4011.X:** Diccionario Armonizado de Aduanas para neumáticos limpios (previo a residuo). Incluye sub-familias como turismo (.1000), camiones (.2000), mina/agrícola (.7000/8000). *(Ref: SNA)*

**[DAT-13] Establecimiento Físico (ID Ventanilla):** Entidad atómica en RETC. A diferencia del RUT (Entidad Jurídica), es aquí en este número geolocalizado donde recae la RCA. Las RCA autorizan al Establecimiento, no a la Razón Social matriz transversalmente. *(Ref: SINADER)*

**[DAT-14] Encargado vs Delegado de Establecimiento:** Rol de administración suprema por ID Ventanilla Única vs perfiles satélites restringidos para imputación de datos. *(Ref: RETC)*

**[DAT-15] Cadena de Custodia Legal:** Estructura que imposibilita matemáticamente saltos en un residuo o manipulaciones de estados sin el correlato documental adecuado (ID Lote, pesaje de origen, DTE transitorio, recepción y constancia de certificado). *(Ref: Principios SICEX, SMA)*

---

## VI. Entidades Institucionales de Supervisión

**[INST-01] MMA (Ministerio del Medio Ambiente):** Órgano rector político. Autoriza Planes de Gestión, establece los decretos de meta. Conserva el RETC y posee las claves originarias (pre-fiscalización, Art. 38). *(Ref: Ley 20.417, Ley 20.920)*

**[INST-02] SMA (Superintendencia del Medio Ambiente):** Único ente legalmente capacitado para iniciar procedimientos sancionatorios por Ley REP. Controla e inspecciona mediante SISREP y tiene derecho autónomo a las auditorías SG. *(Ref: Ley 20.417)*

**[INST-03] MINSAL / SEREMI de Salud:** Máximos reguladores del Código Sanitario (Libro X). Ejercen la autorización local mediante RCA Sanitarias. *(Ref: DFL 725)*

**[INST-04] SNA (Servicio Nacional de Aduanas):** Filtro importador. Exige a cada internador adherencia nominal a un Sistema de Gestión acreditado o Declaración Jurada. *(Ref: Ley General de Aduanas, Res. 134)*

**[INST-05] SII (Servicio de Impuestos Internos):** Fuente de verdad tributaria (giro 900090, folios DTE de despachos/recepciones ambientales, facturaciones, cobros). *(Ref: Subórdenes de Impuestos, Ord 606)*

**[INST-06] MTT (Ministerio de Transportes y Telecomunicaciones):** Custodio del transporte seguro en rutas nacionales para cargas primarias. *(Ref: Decreto Transporte Cargas, MOP/MTT)*

**[INST-07] APDP (Agencia de Protección de Datos Personales):** Nueva autoridad fiscalizadora (Ley 21.719, 21.806) focalizada en la legalidad del tratamiento de datos. Recurso directo frente a infracciones ARCOP y brechas en plataformas como TrazaAmbiental. Operativa plena Diciembre 2026. *(Ref: Ley 21.719)*

**[INST-08] Autoridad Competente / Jurisdicción:** Entidad fiscal con rol legal habilitado (competencias concurrentes). El registro factual y el diseño UI deberá atar visualmente cada métrica al portafolio de la autoridad respectiva, dado el ecosistema atomizado normativo. *(Ref: Diccionario Técnico RETC/VU)*
