# Índice Maestro de Fuentes Documentales (TrazaAmbiental)

> **Propósito:** Repositorio centralizado, estructurado (MECE) y escalable de toda la documentación legal, técnica, de mercado y procedimental relevante para TrazaAmbiental. Agrupa las URLs extraídas durante la fase de *Deep Research* como referencias inmutables para la redacción del PRD y como herramienta de consulta rápida para todos los colaboradores del proyecto.

---

## 1. Marco Regulatorio Medioambiental (Ley REP)
*Legislación y reglamentación obligatoria dictada por el Estado para neumáticos.*

| Referencia | Documento y Enlace | Foco / Impacto Operativo |
| :--- | :--- | :--- |
| **Ley Base** | [Ley 20.920 (Gestión de Residuos, REP)](https://www.bcn.cl/leychile/navegar?idNorma=1090894) | Marco estructural y ley fundamental del ecosistema REP. |
| **Metas NFU** | [Decreto Supremo 8](https://www.bcn.cl/leychile/navegar?idNorma=1154847) | Dicta las metas obligatorias de recolección y valorización de Categorías A y B. |
| **Reportabilidad** | [Res. Exenta 2.084 (SMA)](https://portal.sma.gob.cl/index.php/portal-regulados/instructivos-y-guias/ley-rep/) | Instrucción general sobre cómo, dónde y cuándo estructurar los reportes NFU. |
| **Supervisión** | [SG Aprobados (Datos Abiertos MMA)](https://datosretc.mma.gob.cl/dataset/sistemas-de-gestion-aprobados) | Permite validar actores y Sistemas de Gestión autorizados. |
| **Logística Trans.** | [D.S. N° 9/2017 (MMA)](https://www.bcn.cl/leychile/navegar?idNorma=1107579) | Regula penalmente el movimiento transfronterizo de residuos. |
| **Doctrina Int.** | [Convenio de Basilea - Anexos](http://www.basel.int/TheConvention/Overview/TextoftheConvention/tabid/1275/Default.aspx) | Clasificación aduanera/internacional de residuos (Código B3140 Lista B). |
| **Doctrina Chile** | [D.S. N° 162/2019 (RREE)](https://www.bcn.cl/leychile/navegar?idNorma=1140026) | Promulgación nacional soberana de la Enmienda de Prohibición. |
| **Análisis Jurídico** | [Revista Justicia Ambiental (2022)](http://www.revistajusticiaambiental.cl/wp-content/uploads/2022/12/LOS-SISTEMAS-DE-GESTION-DE-LA-LEY-No-20.920.pdf) | Estudio doctrinal profundo sobre el rol funcional de los SG bajo la Ley 20.920. |

---

## 2. Plataformas del Estado y Formatos Operativos
*Interfaces oficiales y planillas estandarizadas obligatorias para la ingesta estatal (APIs offline).*

### 2.1. Ministerio del Medio Ambiente (MMA) – Ventanilla Única / SINADER
| Tipo | Archivo / Portal | Relevancia Operativa |
| :---: | :--- | :--- |
| 🗂️ **Mandatorio** | [Manual Carga Masiva SINADER (.pdf)](https://vu.mma.gob.cl/manuals/sinader/MANUAL_CARGA_MASIVA_SINADER_MMA.pdf) | **Base BBDD:** Define obligatoriamente los `.csv/.xlsx` (6 o 9 cols), validación `M/D/Y` y formato decímal por coma. |
| 📘 **Guía** | [Instructivo SINADER (Greenrec)](https://greenrec.cl/wp-content/uploads/2022/04/Instructivo-Declaracion-en-SINADER.pdf) | Guía práctica de usuario para asimilación de interface por actor. |
| 🔗 **Portal** | [Ventanilla Única (MMA)](https://ventanillaunica.mma.gob.cl/) | Acceso oficial al portal matriz del gobierno. |
| 🔗 **Portal** | [RETC (Registro de Emisiones)](https://retc.mma.gob.cl/) | Acceso al historial forense de emisiones. |

### 2.2. Superintendencia del Medio Ambiente (SMA) – SISREP
| Tipo | Archivo / Portal | Relevancia Operativa |
| :---: | :--- | :--- |
| 🗂️ **Docs SG** | [Plantilla Anexo Neumáticos (.xlsx)](https://transparencia.sma.gob.cl/doc/rep/REP_ConsolidadoNeumaticos.xlsx) | Impone la validación forense mediante Folio DTE. *Pestañas: SKU, Introducción al Mercado, y Operaciones de Manejo*. |
| 🗂️ **Industria** | [Planilla Consumidores Ind. (.xlsx)](https://transparencia.sma.gob.cl/doc/rep/REP_conind_neumaticos.xlsx) | Archivo exigido para la carga masiva de los consumidores industriales. |
| 🔗 **Portal** | [SNIFA (Fiscalización SMA)](https://snifa.sma.gob.cl/) | Punto regulatorio de contraste para expedientes sancionatorios públicos. |

### 2.3. Aduanas y Comercio Exterior
| Tipo | Archivo / Portal | Relevancia Operativa |
| :---: | :--- | :--- |
| 🗂️ **Importación** | [Declaración Jurada REP (.pdf)](https://www.aduana.cl/aduana/site/docs/20081010/20081010155624/djurada_rep_neumaticos.pdf) | Fija el dogma de conversión metrológica a **Kilogramo Neto (KN)**. |
| 🔗 **Portal** | [SICEX](https://www.sicexchile.cl/) | Sistema Integrado de Comercio Exterior. |

---

## 3. Ciberseguridad, Privacidad y Derechos Digitales
*Gobernanza de datos personales sujetos al rigor del estándar penal digital.*

| Dimensión | Fuente Normativa | Impacto Arquitectónico |
| :--- | :--- | :--- |
| **Ley Base** | [Ley 21.719 - Datos Personales (2024)](https://www.bcn.cl/leychile/navegar?idNorma=1209272) | Reforma integral que bloquea el tráfico de `RUTses` y exige trazar el ciclo de vida de todo archivo. |
| **Gobierno** | [Creación Agencia de PDP (.pdf)](https://www.minsegpres.gob.cl/wp-content/uploads/2025/11/Minuta-AGPD.pdf) | Estructura punitiva de la inminente Agencia de Protección de Datos (fiscalizador directo). |
| **Visión Minuta** | [Informe BCN 12/25 (.pdf)](https://www.bcn.cl/obtienearchivo?id=repositorio/10221/37137/1/Informe_12_25_Ley_Datos_Personales_rev.pdf) | Compendio analítico del poder legislativo sobre la hermenéutica de la Ley 21.719. |
| **Estándar RAT** | [Guía Técnica SGD - RAT](https://guias.digital.gob.cl/) | Obligatoriedad arquitectónica del Registro de Actividades de Tratamiento. |
| **Conflicto Biometría** | [ECIJA: Uso de Biometría](https://www.ecija.com/actualidad-insights/el-uso-de-biometria-y-la-proteccion-de-datos-lecciones-de-la-aepd-que-hacen-eco-en-chile/) | Define que capturar biometría / geolocalización permanente es una violación punible. |
| **Impacto Laboral** | [ResearchGate: Implicancias Ley 21.719](https://www.researchgate.net/publication/395431700_La_proteccion_de_datos_personales_tras_la_Ley_21719_Implicancias_regulatorias_y_proyecciones_para_las_empresas_en_las_relaciones_laborales) | Expone los riesgos contractuales por exposición digital a los sujetos (ej. Choferes/Transportistas). |
| **Legado Histórico** | [Balance BCN de Ley 21.719](https://www.bcn.cl/balance-legislativo/detalle/ficha_LEY_21719_2024-12-13) | Tramitación y fundamentaciones del debate legislativo nacional. |

---

## 4. Firmas e Infraestructura de Conectividad
*Tecnologías habilitantes y limitaciones ineludibles para la operación en zonas oscuras del territorio nacional.*

| Eje Tecnológico | Fuente Estructural | Resolución Obligatoria |
| :--- | :--- | :--- |
| **Rutas Criptográficas** | [Reglamento Ley 19.799](https://www.esign-la.com/documentos/repositorios/Reglamento_Ley_19799.pdf) | Condiciona legalmente el valor probatorio exigiendo umbrales mínimos (Firma Simple / FEA). |
| **Agente Regulador** | [Subsecretaría de Economía](https://www.entidadacreditadora.gob.cl/) | Entidad Acreditadora que certifica a las agrupaciones PKI de sellos temporales. |
| 📡 **Conectividad** | [Informe SUBTEL Jun25 (.pdf)](https://www.subtel.gob.cl/wp-content/uploads/2025/09/Informe_del_Sector_Telecomunicaciones_Jun25.pdf) | **MANDATO ESTRUCTURAL:** Justifica estadísticamente la ceguera y necesidad de arquitectura **Offline-First** dados los latentes descensos de cobertura móvil 3G/4G en ruralidades. |

---

## 5. El Ecosistema de Mercado NFU (Benchmarking)
*Identificación competitiva de actores e integración de lecciones en mercados pioneros maduros.*

| Macroentorno | Actor / Caso | Utilidad Operativa Adquirida |
| :--- | :--- | :--- |
| 🇨🇱 **Chile / Generador** | [Codelco: El Teniente (2024)](https://www.codelco.com/el-teniente-anticipa-cumplimiento-de-meta-2024-para-el-reciclaje-de) | Perfila el poder y asimetría de la "gran minería" (Actor masivo en NFU Categoría B). |
| 🇨🇱 **Chile / Gestor** | [Resur (Reciclaje Mecánico)](https://www.resur.cl/) | Demostración final estructural de la trituración, destino final del NFU. |
| 🇨🇱 **Chile / SG** | [Valora Más](https://www.paiscircular.cl/tag/corporacion-de-sistema-de-gestion-de-neumaticos-fuera-de-uso-valora-mas/) | Demarcación del modelo corporativo y alcance de representatividad sobre metas nacionales. |
| 🇫🇷 **Francia / Hardware** | [Aliapur: The RFID Chip](https://www.syndicatdupneu.org/the-rfid-chip-a-revolution-for-the-tire-industry/) | Avance hacia el Pasaporte Digital - modelo inspirador futuro (`EazyBox`). |
| 🇪🇸 **España / Finanzas** | [SIGNUS: Tarifas 2024/25](https://www.residuosprofesional.com/signus-2024-tarifas-gestion-neumaticos-usados/) | Validación de mecanismos compensatorios monetarios y Ecomodulación. |
| 🇦🇺 **Australia / Medida** | [TSA: Tyre Product Guidelines (.pdf)](https://www.nepc.gov.au/sites/default/files/2022-09/tyre-product-stewardship-guidelines.pdf) | Creación e imposición estandarizadora del parámetro internacional **EPU** (*Equivalent Passenger Unit*). |
| 🇧🇷 **Brasil / Trazabilidad**| [Reciclanip: SIGOR](https://www.reciclanip.org.br/formas-de-destinacao/principais-destinacoes/) | Ejemplos explícitos de integración aduanera y tributaria con Certificados DTE. |

---

## 6. Auditoría Forense Interna (Kairós)
*Documentos depurativos y marcos de contención del scope técnico contra el expansionismo irreal.*

| Doc Interno | Propósito Específico en TrazaAmbiental |
| :--- | :--- |
| 🛡️ [`08-fixes.md`](./informes/08-fixes.md) | **Filtro Retrospectivo:** Analiza discrepancias de las premisas arquitectónicas vs. la base legal, identificando alucinaciones del antiguo marco. |
| ⚖️ [`09-enmiendas...md`](./informes/09-enmiendas-forenses.md) | **Veredicto:** Sentencia penal de limpieza. Elimina los monstruos de deuda técnica como CKAN, extrapolaciones o integraciones de ERP, atando la plataforma al minimalismo mandatorio. |
