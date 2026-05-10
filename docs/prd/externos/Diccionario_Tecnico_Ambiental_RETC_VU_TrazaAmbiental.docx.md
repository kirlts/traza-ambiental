**Diccionario técnico-ambiental**

**RETC / Ventanilla Única / DJA / residuos / importación y exportación**

*Base operativa y conceptual para Traza Ambiental*

| Objetivo: traducir el lenguaje técnico usado por el Estado de Chile en materia ambiental, residuos y trazabilidad a un formato entendible para operación, cumplimiento y desarrollo de software. |
| :---- |
| Supuesto de trabajo: en este documento se interpreta “RECC” como RETC (Registro de Emisiones y Transferencias de Contaminantes). Además, se incorpora DJA y, cuando aplica al ámbito ambiental más amplio, DGA como Dirección General de Aguas. |
| Uso recomendado: este diccionario puede servir como base para manuales, diseño de pantallas, validaciones, ayuda contextual, onboarding de usuarios y modelamiento de datos dentro de Traza Ambiental. |

*Versión de trabajo elaborada con base en fuentes oficiales vigentes consultadas el 25 de marzo de 2026\.*

**1\. Cómo leer este documento**

Cada término se presenta con cuatro columnas: término, significado, aplicación práctica y exigencia o implicancia de cumplimiento técnico-ambiental.

El foco está puesto en los conceptos que aparecen al ingresar a Ventanilla Única, RETC, SINADER, SIDREP, módulos REP y otras plataformas asociadas al MMA, la SEREMI de Salud, el MINSAL, la SMA, Aduanas y, cuando corresponde, la DGA.

No todo lo ambiental en Chile está dentro de una sola plataforma. Por eso el diccionario mezcla lenguaje de sistema, lenguaje legal y lenguaje operativo.

**2\. Siglas e instituciones clave**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **RETC** | Registro de Emisiones y Transferencias de Contaminantes. Es el sistema público de información ambiental que recopila emisiones, residuos y transferencias de contaminantes. | Es la base conceptual sobre la que se organiza Ventanilla Única y varias declaraciones ambientales. | Sirve como marco de reporte oficial. La empresa debe entender qué información reporta al RETC y qué módulos le son aplicables. |
| **Ventanilla Única** | Puerta de entrada digital para cumplir declaraciones ambientales usando ClaveÚnica y un establecimiento registrado. | Es el punto de acceso del usuario para operar varios sistemas sectoriales desde una cuenta autenticada. | El registro correcto del establecimiento, usuarios y roles es condición previa para declarar. |
| **MMA** | Ministerio del Medio Ambiente. | Define la política, reglamentos y sistemas como RETC, VU, SINADER, DJA y REP. | Su normativa fija obligaciones de declaración y trazabilidad ambiental. |
| **MINSAL** | Ministerio de Salud. | Interviene en residuos peligrosos, autorizaciones sanitarias y sistemas como SIDREP y DASUPEL. | Las exigencias sanitarias se cruzan con las ambientales; una plataforma debe reconocer ambos mundos. |
| **SEREMI de Salud** | Autoridad sanitaria regional. | Otorga autorizaciones sanitarias y fiscaliza actividades como almacenamiento, transporte y tratamiento de residuos según el riesgo. | Muchas validaciones operativas dependen de permisos sanitarios vigentes por región o establecimiento. |
| **SMA** | Superintendencia del Medio Ambiente. | Fiscaliza cumplimiento de instrumentos ambientales y reportes asociados al RETC y a la Ley REP. | El incumplimiento de obligaciones de información puede derivar en procedimientos sancionatorios. |
| **DGA** | Dirección General de Aguas. | No pertenece al RETC, pero es relevante cuando el proyecto incorpora aguas, cauces, derechos de agua, captación o afectación hídrica. | Debe contemplarse si la plataforma incorpora trazabilidad ambiental integral y no solo residuos. |
| **DJA** | Declaración Jurada Anual del RETC. | Es el cierre anual donde el Encargado del Establecimiento valida la información del año anterior ya reportada en los sistemas sectoriales. | No siempre carga datos nuevos; valida, reconoce u observa omisiones. Se realiza por establecimiento. |
| **ClaveÚnica** | Credencial estatal de autenticación personal. | Permite acceder a Ventanilla Única y autenticar a la persona natural que actúa dentro del sistema. | Es personal e intransferible; el software debe distinguir entre identidad de la persona y representación de la empresa. |
| **Aduanas** | Servicio Nacional de Aduanas. | Controla ingreso y salida de mercancías y exige vistos buenos o autorizaciones cuando corresponda. | En residuos y materiales de riesgo, la operación puede requerir control adicional o estar prohibida. |
| **SII** | Servicio de Impuestos Internos. | Valida RUT, giro, existencia tributaria y, en algunos casos, destinatarios no obligados a registro. | Útil para cruces de identidad tributaria y validaciones externas del sistema. |
| **Autoridad competente** | Entidad pública con competencia legal en una materia específica. | En residuos puede ser MMA, SMA, SEREMI de Salud, MINSAL, Aduanas u otra autoridad sectorial. | La plataforma debe mapear cada obligación al órgano competente correcto, no asumir una sola autoridad. |

*Sección con 12 términos operativos.*

**3\. Roles, registro y operación en plataforma**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **Empresa titular** | Persona jurídica responsable del establecimiento y de sus obligaciones. | Es la empresa dueña o responsable del sitio o actividad que declara. | Debe estar correctamente asociada al establecimiento; errores aquí contaminan todo el flujo de cumplimiento. |
| **Establecimiento** | Unidad física o sitio registrado desde el cual se generan, reciben, almacenan, valorizan, eliminan o transfieren contaminantes o residuos. | La DJA y varias declaraciones se hacen por establecimiento, no solo por empresa. | La plataforma debe tratar establecimiento como entidad principal con código, dirección, roles y sistemas activos. |
| **Código de establecimiento** | Identificador interno del establecimiento dentro de Ventanilla Única. | Se usa para buscar, seleccionar y asociar declaraciones a un sitio específico. | Debe almacenarse como dato clave del master data del cliente. |
| **Encargado de establecimiento** | Usuario habilitado con responsabilidad principal sobre el establecimiento. | Es quien puede ejecutar trámites críticos como la DJA. | El sistema interno debe distinguirlo de otros roles porque no todo usuario puede cerrar o declarar lo mismo. |
| **Delegado de sistema** | Usuario con acceso a uno o más módulos sectoriales específicos. | Opera declaraciones o consultas según el permiso asignado. | No reemplaza siempre al Encargado; por ejemplo, la DJA recae en el Encargado de establecimiento. |
| **Representante legal** | Persona que representa jurídicamente a la empresa. | Puede ser relevante en la estructura corporativa, pero no necesariamente ejecuta todas las declaraciones en VU. | El sistema debe separar representación societaria de permisos operativos en plataforma. |
| **Sistemas sectoriales activos** | Módulos habilitados para un establecimiento según su actividad y obligaciones. | Permiten entrar a SINADER, DJA, RUEA, REP y otros. | Sin sistema activo, no se puede declarar en ese módulo. Esto es clave para lógica de onboarding. |
| **Activación de sistema sectorial** | Proceso de habilitación de un módulo aplicable a un establecimiento. | Es el paso que transforma un registro base en un perfil operativo real. | Debe quedar trazado con fecha, rol y evidencia, porque condiciona las obligaciones futuras. |
| **Cese de establecimiento** | Trámite para informar que un establecimiento deja de operar dentro del sistema. | No elimina automáticamente obligaciones históricas. | Antes del cierre pueden seguir existiendo pendientes como la DJA del período anterior. |
| **Cambio de titularidad** | Actualización del titular responsable de un establecimiento. | Afecta continuidad de obligaciones, usuarios y trazabilidad del establecimiento. | La plataforma debe conservar historial para no perder responsabilidad sobre períodos previos. |
| **Perfil de usuario** | Conjunto de atributos y permisos del usuario autenticado. | Determina qué ve, qué puede editar y qué puede declarar. | Es esencial para seguridad, auditoría y segregación de funciones. |
| **Historial de declaraciones** | Repositorio de reportes emitidos por el establecimiento o por un rol dentro del módulo. | Permite revisar estados, descargar comprobantes y rastrear cambios. | Debe ser replicado en Traza Ambiental como bitácora inalterable. |
| **Comprobante** | Documento o constancia emitida por el sistema tras enviar una declaración. | Sirve como evidencia operativa y de auditoría. | Debe poder descargarse, almacenarse y vincularse con el expediente del período. |

*Sección con 13 términos operativos.*

**4\. Sistemas y módulos del ecosistema VU/RETC**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **SINADER** | Sistema Nacional de Declaración de Residuos. | Permite declarar residuos no peligrosos, anual o mensualmente según el rol y el régimen aplicable. | Es uno de los módulos más relevantes para residuos industriales y municipales. |
| **SIDREP** | Sistema de Seguimiento y Declaración de Residuos Peligrosos. | Gestiona la trazabilidad y reporte de residuos peligrosos. | Su lógica es más sanitaria y de seguimiento por movimiento que la de SINADER. |
| **RUEA** | Registro Único de Emisiones Atmosféricas. | Centraliza reportes de emisiones a la atmósfera. | Importa si Traza Ambiental evoluciona a trazabilidad ambiental integral, no solo residuos. |
| **RFP** | Registro de Fuentes y Procesos. | Levantamiento base de procesos, equipos y fuentes que luego alimentan otras declaraciones. | Sirve como capa estructural de datos técnicos del establecimiento. |
| **RILES** | Sistema de declaración de descargas de residuos industriales líquidos. | Se relaciona con vertidos o descargas líquidas sujetas a control. | Debe considerarse si la plataforma incorpora corrientes líquidas y no solo residuos sólidos. |
| **DAE** | Sistema de Desempeño Ambiental Empresarial. | Módulo del portal orientado a desempeño o gestión ambiental empresarial. | Es complementario y puede servir para integrar indicadores no estrictamente regulatorios. |
| **REP** | Módulo de Responsabilidad Extendida del Productor. | Agrupa información de productores, gestores, sistemas de gestión y obligaciones de productos prioritarios. | Clave para neumáticos, envases, aceites, pilas, baterías y otros productos prioritarios. |
| **SIV** | Sistema de Impuesto Verde. | Plataforma de la SMA asociada al impuesto por emisiones y fuentes gravadas. | No es de residuos, pero forma parte del mapa regulatorio ambiental digital. |
| **SISAT** | Sistema de Seguimiento Atmosférico. | Herramienta vinculada a seguimiento atmosférico. | Se usa más en control de emisiones que en residuos. |
| **SICTER** | Sistema de Información de Centrales Termoeléctricas. | Módulo sectorial para centrales termoeléctricas. | Se incorpora al ecosistema VU aunque no sea un sistema general de residuos. |
| **DASUPEL** | Sistema de declaración de instalaciones de almacenamiento de sustancias peligrosas. | Aplica a bodegas o instalaciones sujetas a regulación sanitaria de sustancias peligrosas. | Se cruza con residuos peligrosos cuando hay almacenamiento temporal de materiales riesgosos. |
| **IRAR** | Instalación de Recepción y Almacenamiento de Residuos. | Rol dentro de SINADER para instalaciones que reciben y almacenan residuos antes de otro destino. | El rol correcto debe seleccionarse según la autorización sanitaria del receptor. |
| **Destinatario Final** | Instalación que realiza el tratamiento final autorizado sobre un residuo. | En SINADER puede aprobar, observar o rechazar declaraciones del generador. | La plataforma debe distinguir receptor intermedio versus destino final. |
| **Generador industrial** | Establecimiento que genera residuos en actividad industrial o productiva. | Tiene obligaciones de declaración según el tipo y cantidad de residuo. | Es uno de los roles operativos principales del sistema. |
| **Generador municipal** | Municipio o actor que reporta residuos municipales recolectados. | En SINADER tiene una lógica mensual propia. | Exige modelar datos por comuna, contratos de recolección y destinos. |

*Sección con 15 términos operativos.*

**5\. Residuos y gestión operativa**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **Residuo** | Sustancia u objeto del cual su poseedor se desprende o tiene la intención u obligación de desprenderse. | Es la unidad conceptual básica de toda la regulación. | La clasificación correcta del residuo define el régimen aplicable y el riesgo sancionatorio. |
| **Residuo peligroso** | Residuo o mezcla de residuos que presenta riesgo para la salud pública o efectos adversos para el medio ambiente, conforme al régimen sanitario aplicable. | Activa reglas especiales de almacenamiento, transporte, plan de manejo, rotulación y seguimiento. | No puede mezclarse para diluir su peligrosidad; si ello ocurre, la mezcla se maneja como peligrosa. |
| **Residuo no peligroso** | Residuo que no cae bajo el régimen de peligrosidad del D.S. 148\. | Se declara principalmente por SINADER cuando corresponde. | Aunque no sea peligroso, puede igual estar sujeto a control y trazabilidad. |
| **Residuo industrial** | Residuo generado por una actividad productiva o de servicio no domiciliaria. | Puede ser peligroso o no peligroso. | En RM existe un régimen histórico mensual especial para residuos industriales no peligrosos. |
| **Residuo municipal** | Residuo recolectado por municipalidades o por terceros contratados para esa función. | Se reporta en SINADER bajo rol municipal. | La plataforma debe diferenciar origen municipal versus industrial. |
| **Residuo prioritario** | Residuo derivado de un producto prioritario regulado por Ley REP. | Ejemplos: neumáticos, envases y embalajes, aceites lubricantes, pilas, baterías y aparatos eléctricos y electrónicos. | Se rige por metas, sistemas de gestión y obligaciones especiales de productores y gestores. |
| **Residuo sujeto a reglamento específico** | Residuo cuya gestión se encuentra regulada por una norma especial distinta del régimen general. | Puede salir del flujo ordinario de ciertos umbrales o módulos. | La clasificación normativa debe ser parte de la lógica del motor regulatorio. |
| **Lodos** | Residuos semisólidos, por ejemplo provenientes de plantas de tratamiento de aguas servidas. | En Chile existe regulación específica para su manejo en ciertos casos. | No deben tratarse genéricamente como cualquier residuo sólido sin revisar el reglamento aplicable. |
| **LER** | Listado Europeo de Residuos. | Catálogo de códigos utilizado en SINADER como referencia de clasificación. | Es útil para estandarizar nomenclatura y ayudar al usuario a escoger correctamente el residuo. |
| **Fracción** | Parte segregada o componente específico de un residuo. | Muy relevante en valorización, reciclaje y trazabilidad circular. | La plataforma debe permitir seguir fracciones y no solo el residuo original completo. |
| **Segregación** | Separación técnica de residuos por tipo, material, riesgo o destino. | Mejora trazabilidad, valorización y cumplimiento. | Es clave para evitar mezclas indebidas y para modelar múltiples salidas desde una misma entrada. |
| **Reutilización** | Uso nuevamente de un producto o componente sin transformarlo sustancialmente en residuo. | Se sitúa antes del reciclaje en la jerarquía de residuos. | Puede requerir distinguir producto, residuo y subproducto en el modelo de datos. |
| **Reciclaje** | Proceso de valorización mediante el cual un residuo se reincorpora como materia prima o insumo. | Es una forma de valorización. | No todo tratamiento es reciclaje; conviene separar las categorías en el software. |
| **Valorización** | Operación cuyo resultado principal es aprovechar un residuo sustituyendo otros materiales o recuperando valor. | Incluye reciclaje y otras operaciones de aprovechamiento. | Debe quedar registrado el tipo de valorización autorizada al destinatario. |
| **Eliminación** | Operación destinada a disponer finalmente un residuo sin recuperar valor. | Incluye disposición final u otras operaciones terminales. | La plataforma debe distinguir valorización versus eliminación porque cambia el resultado ambiental y regulatorio. |
| **Tratamiento** | Proceso aplicado al residuo para modificar sus características, reducir riesgos o prepararlo para valorización o eliminación. | Puede incluir clasificación, trituración, estabilización, entre otros. | En plataformas estatales suele estar limitado por la autorización sanitaria del receptor. |
| **Acopio** | Almacenamiento o reunión temporal de residuos antes de su traslado o tratamiento. | Puede ser una etapa necesaria, pero no reemplaza la autorización sanitaria cuando esta es exigible. | El tiempo, condiciones y compatibilidades importan en cumplimiento. |
| **Almacenamiento** | Mantención de residuos en contenedores o instalaciones durante un período determinado. | En residuos peligrosos exige condiciones materiales y de seguridad estrictas. | No es solo una etapa logística; es una obligación técnica con requisitos de infraestructura. |
| **Contenedor** | Recipiente apto para almacenar residuos. | En residuos peligrosos debe resistir el residuo, evitar filtraciones y soportar manipulación y traslado. | El sistema puede requerir trazabilidad de tipo de envase, rotulación y compatibilidad. |
| **Hoja de Seguridad** | Documento técnico sobre riesgos y manejo de sustancias. | En residuos peligrosos puede acompañar el transporte cuando corresponde. | Es evidencia documental crítica en auditorías. |
| **Documento de declaración o movimiento** | Documento que acompaña el traslado de residuos peligrosos o el reporte del movimiento. | Soporta la trazabilidad desde origen a destino. | Debe quedar asociado a transporte, receptor y cierre del ciclo. |
| **Transportista** | Actor que traslada residuos desde el generador al receptor. | En residuos peligrosos requiere autorización y documentación adecuada. | Debe diferenciarse del gestor y del destinatario final. |
| **Gestor** | Persona o entidad autorizada para operaciones de manejo de residuos. | Puede recibir, almacenar, valorizar o eliminar según su autorización. | En REP y en residuos en general es un actor clave para asegurar trazabilidad legal. |
| **Receptor** | Instalación que recibe el residuo declarado. | Puede ser IRAR o Destinatario Final. | Su rol define cómo cierra o modifica el flujo reportado. |
| **Autorización sanitaria** | Permiso otorgado por la autoridad sanitaria para operar instalaciones o actividades reguladas. | Determina qué residuos y qué tratamientos están permitidos. | Sin esta autorización, muchas operaciones carecen de sustento legal. |
| **Plan de Manejo** | Documento operativo y técnico exigido en ciertos casos, especialmente para residuos peligrosos sobre determinados umbrales. | Ordena procedimientos, responsabilidades, almacenamiento, contingencias y destinos. | Es una pieza clave para cumplimiento y trazabilidad auditable. |

*Sección con 26 términos operativos.*

**6\. Declaraciones, estados y plazos**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **Declaración mensual** | Reporte periódico de información del mes, aplicable a ciertos roles y regímenes de SINADER. | Captura movimientos o generación de residuos durante un período corto. | El software debe permitir calendario, recordatorios, corte mensual y cierre trazable. |
| **Declaración anual** | Reporte consolidado del año anterior, particularmente en SINADER para residuos no peligrosos. | Resume la información anual por rol y establecimiento. | Debe coexistir con la mensual sin duplicar ni contradecir datos. |
| **Periodicidad** | Frecuencia legal o reglamentaria con que debe reportarse. | Puede ser por movimiento, mensual, anual o por evento. | Es una regla de negocio fundamental del motor regulatorio. |
| **Umbral de 12 toneladas** | Referencia usada en SINADER para obligar a declarar residuos no peligrosos en establecimientos que generan o reciben más de 12 toneladas anuales de residuos no sometidos a reglamentos específicos. | Funciona como gatillante de obligación. | El sistema debe evaluar umbrales y alertar cuándo se supera la frontera regulatoria. |
| **Umbrales de residuos peligrosos** | Referencia del D.S. 148 para exigir plan de manejo cuando se superan 12 kg de residuos tóxicos agudos o 12 toneladas de otros residuos peligrosos al año. | Marca el paso a un régimen más exigente. | La plataforma debe poder acumular cantidades anuales para advertir este cambio. |
| **Borrador** | Estado de una declaración iniciada, guardada, pero no enviada. | Permite edición previa al envío oficial. | No constituye cumplimiento; debe diferenciarse claramente de una declaración enviada. |
| **Enviada** | Estado de una declaración remitida por el declarante y aún no recepcionada o cerrada por el receptor. | Existe como acto de envío, pero aún puede faltar aceptación por la contraparte. | Útil para dashboards de seguimiento. |
| **Aprobada** | Estado en que la declaración ha sido recepcionada y aceptada por el establecimiento receptor. | Cierra positivamente el flujo. | Debe disparar resguardos documentales y bloqueo de cambios no autorizados. |
| **Aprobada con observación** | Estado en que el receptor aprueba, pero corrige o deja observaciones sobre datos como cantidad, LER o tratamiento. | Implica trazabilidad de cambios entre origen y destino. | El sistema debe conservar la versión original y la versión corregida. |
| **Rechazada** | Estado en que el receptor niega la declaración por error u otra inconsistencia. | Exige revisión y eventualmente nuevo reporte. | Debe generar alertas de no conformidad y acciones correctivas. |
| **Omisión** | Falta de información que debió reportarse. | En DJA puede declararse que existieron omisiones. | Es un punto de alto riesgo regulatorio y debe quedar evidenciado para subsanación. |
| **Calendario de declaraciones** | Programación oficial de plazos y ventanas de reporte. | Guía la operación de usuarios y sistemas. | Es clave para automatizar recordatorios y semaforización de cumplimiento. |
| **DJA en octubre** | La Declaración Jurada Anual del RETC se realiza en octubre y valida la información del año anterior. | Es un hito transversal para establecimientos registrados. | Debe incluirse siempre en el tablero anual del cliente. |
| **Cierre de período** | Momento en que se bloquea o consolida la información de un mes o un año. | No siempre coincide con el último día del período operativo; depende de la regla normativa. | Importante para diseño de auditoría y versiones. |

*Sección con 14 términos operativos.*

**7\. Cumplimiento técnico-ambiental**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **Cumplimiento técnico-ambiental** | Capacidad de demostrar que una actividad, instalación o flujo de residuos cumple tanto con el requisito legal como con su expresión operacional y documental. | No basta con hacer la operación; debe existir respaldo, trazabilidad y consistencia. | La plataforma debe probar quién hizo qué, cuándo, con qué permiso y con qué evidencia. |
| **Trazabilidad** | Seguimiento documentado del residuo o flujo ambiental desde su origen hasta su destino o transformación. | Es el corazón funcional de una plataforma como Traza Ambiental. | Debe incluir actor, fecha, cantidad, clasificación, documento, receptor y resultado. |
| **Cadena de custodia** | Continuidad verificable de la responsabilidad y control sobre el residuo o material. | Asegura que no haya vacíos entre generación, transporte y destino. | Útil para auditorías, litigios y cumplimiento robusto. |
| **Evidencia** | Documento, comprobante, permiso, archivo o dato que acredita un hecho de cumplimiento. | Incluye resoluciones, autorizaciones, comprobantes, fotos, hojas de seguridad y reportes. | Debe indexarse por período, establecimiento, actor y tipo documental. |
| **Bitácora de auditoría** | Registro inalterable de acciones realizadas en la plataforma. | Permite saber quién creó, modificó, aprobó o rechazó un dato. | Es esencial para confiabilidad y defensa regulatoria. |
| **No conformidad** | Desviación respecto de una exigencia o procedimiento. | Puede ser legal, documental, operacional o técnica. | La plataforma debería permitir registrar hallazgos y planes de corrección. |
| **Subsanación** | Corrección posterior de un error u omisión detectada. | Puede involucrar reenvío, declaración complementaria o carga adicional de evidencia. | Debe quedar trazada para evitar alterar el historial sin rastro. |
| **Manejo ambientalmente racional** | Estándar utilizado en normativa nacional e internacional para exigir que los residuos se manejen protegiendo salud humana y medio ambiente. | Es central en movimientos transfronterizos y en la filosofía regulatoria del sistema. | Sirve como criterio material para autorizar, denegar o cuestionar operaciones. |
| **Jerarquía en el manejo de residuos** | Orden de preferencia: prevenir, reutilizar, reciclar y valorizar antes de eliminar. | Orienta la política pública y el diseño de soluciones ambientales. | Puede convertirse en lógica de clasificación de resultados dentro del software. |
| **Compatibilidad de residuos** | Criterio técnico para evitar mezclas o almacenamientos inseguros entre residuos o sustancias. | Muy relevante en peligrosos. | Debe contemplarse en reglas de almacenamiento y validaciones técnicas. |
| **Rotulación** | Identificación visible del contenedor, sustancia o residuo. | En materiales peligrosos tiene exigencias críticas de seguridad. | Es parte del cumplimiento físico, no solo digital. |
| **Contingencia** | Evento no deseado como derrame, fuga, incendio o pérdida de trazabilidad. | Debe estar contemplado en procedimientos y planes. | La plataforma puede incorporar módulos de incidentes y acciones correctivas. |
| **Fiscalización** | Actuación de la autoridad para revisar cumplimiento. | Puede recaer sobre documentos, instalaciones, movimientos y declaraciones. | El software debe poder exportar expedientes claros para enfrentarla. |
| **Sanción** | Consecuencia legal por incumplimiento. | Puede provenir del régimen sanitario, ambiental o de comercio exterior según la materia. | Se previene con diseño de cumplimiento y control documental. |

*Sección con 14 términos operativos.*

**8\. Importación, exportación y movimiento transfronterizo**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **Importación de residuos** | Ingreso de residuos al territorio nacional. | No es una operación libre; puede estar prohibida, condicionada o sujeta a autorización según el tipo de residuo y la norma aplicable. | Debe evaluarse siempre bajo Ley 20.920, Convenio de Basilea, reglamento de movimiento transfronterizo y controles de Aduanas. |
| **Exportación de residuos** | Salida de residuos desde Chile hacia otro país. | Puede requerir autorización previa y verificación de destino ambientalmente racional. | No debe confundirse con exportación de mercancías comunes. |
| **Movimiento transfronterizo de residuos** | Traslado de residuos entre Estados, incluyendo exportación, importación y tránsito. | Se rige por el Convenio de Basilea y por el reglamento chileno de movimiento transfronterizo. | Debe documentarse con trazabilidad reforzada, autoridades competentes y destino final. |
| **Convenio de Basilea** | Tratado internacional sobre control de movimientos transfronterizos de desechos peligrosos y otros desechos. | Chile lo aplica como marco internacional principal en esta materia. | Introduce control estricto, minimización del movimiento, manejo ambientalmente racional y combate al tráfico ilícito. |
| **Estado de exportación** | País desde el cual sale el residuo. | Es parte de la identificación del movimiento transfronterizo. | Debe registrarse junto con origen, tránsito y destino. |
| **Estado de importación** | País al cual ingresa el residuo. | Debe aceptar o regular el movimiento según su derecho interno y el marco internacional. | La autorización de un país no reemplaza la de otro. |
| **Estado de tránsito** | País por el cual pasa el residuo en ruta. | Puede requerir información o autorizaciones específicas. | Su omisión puede invalidar el movimiento. |
| **Autoridad competente en movimiento transfronterizo** | Organismo designado para controlar y autorizar el movimiento según el marco aplicable. | Interactúa con notificaciones, consentimientos y control documental. | La plataforma debe saber qué autoridad pide qué antecedente. |
| **Notificación previa** | Comunicación formal del movimiento propuesto antes de ejecutarlo. | Es eje del control internacional de residuos sujetos a Basilea. | No debe entenderse como un simple aviso informal. |
| **Consentimiento previo** | Aceptación del país o autoridad competente antes de permitir el movimiento. | Opera como barrera de control ex ante. | Sin consentimiento válido, el movimiento puede ser ilícito. |
| **Documento de movimiento transfronterizo** | Documento que acompaña físicamente o documentalmente al residuo durante su traslado internacional. | Conecta origen, transporte, tránsito y destino. | Debe integrarse al expediente del embarque. |
| **Tráfico ilícito** | Movimiento transfronterizo realizado en contravención del marco legal aplicable. | Es especialmente grave en residuos peligrosos y otros residuos controlados. | La plataforma debe ayudar a prevenirlo mediante validaciones y checklist documental. |
| **Manejo ambientalmente racional en comercio exterior** | Exigencia de que el residuo será valorizado o eliminado sin poner en riesgo la salud o el ambiente. | Es criterio de fondo para aprobar o denegar importaciones y exportaciones. | No basta con un comprador extranjero; debe acreditarse tratamiento adecuado. |
| **Fracción valorizable** | Parte segregada de un residuo que puede tener destino de valorización. | En comercio exterior requiere cuidado adicional para no presentar como “producto” algo que jurídicamente sigue siendo residuo. | La clasificación debe apoyarse en evidencia técnica y regulatoria. |
| **Residuo fraccionado** | Residuo separado en componentes o corrientes de materiales. | Puede facilitar reciclaje o exportación de fracciones, pero no elimina por sí solo la naturaleza de residuo. | La trazabilidad debe continuar a nivel de fracción. |
| **Mercancía versus residuo** | Diferencia jurídica entre un producto/mercancía comercial y un residuo regulado. | Es una frontera crítica en importación y exportación. | Clasificar erróneamente puede gatillar sanciones aduaneras y ambientales. |
| **Visto bueno** | Autorización sectorial exigida por Aduanas antes del desaduanamiento o salida cuando la mercancía está sujeta a control especial. | En residuos o materiales riesgosos puede ser obligatorio. | La plataforma debe contemplar un checklist previo a embarque. |
| **Residuos industriales tóxicos** | Categoría sensible en controles aduaneros y sanitarios. | Aduanas los menciona entre mercancías cuya importación puede estar prohibida o fuertemente controlada. | Nunca debe asumirse libre circulación sin revisión legal caso a caso. |
| **Destino de residuos generados** | Tratamiento o destino final de residuos secundarios que surgen del proceso de valorización o tratamiento. | En movimientos transfronterizos el MMA exige informar también este aspecto cuando corresponda. | Esto obliga a una trazabilidad de segundo nivel, no solo del residuo principal. |

*Sección con 19 términos operativos.*

**9\. Productos prioritarios REP y economía circular**

| Término | Qué significa | Aplicación práctica | Cumplimiento técnico-ambiental |
| :---- | :---- | :---- | :---- |
| **Ley REP** | Marco legal de responsabilidad extendida del productor y fomento al reciclaje. | Obliga a ciertos productores a organizar y financiar la gestión de residuos derivados de productos prioritarios. | Es crítica para Traza Ambiental si aborda neumáticos u otros flujos REP. |
| **Productor** | Quien introduce al mercado nacional un producto prioritario en los términos de la ley. | No siempre es el fabricante; puede ser importador. | Su identificación correcta es fundamental para asignar obligaciones. |
| **Sistema de gestión** | Estructura individual o colectiva para cumplir metas y obligaciones REP. | Administra recolección, valorización, financiamiento y trazabilidad. | Debe poder integrarse como actor y fuente de datos. |
| **Meta de recolección** | Porcentaje o volumen que debe recuperarse según el decreto del producto prioritario. | Es una obligación regulatoria medible. | La plataforma debe soportar cálculo y seguimiento contra metas. |
| **Meta de valorización** | Porcentaje o volumen de residuos recuperados que deben valorizarse. | No es equivalente a recolectar; exige resultado. | Debe medirse separadamente. |
| **Consumidor industrial** | Actor que genera residuos de productos prioritarios en contexto industrial. | Puede tener obligaciones específicas de registro o declaración en ciertos regímenes REP. | La plataforma debe diferenciarlo del usuario domiciliario. |
| **Reciclador de base** | Persona natural o jurídica reconocida dentro de la cadena de reciclaje. | La Ley REP contempla mecanismos de inclusión para su integración. | Puede ser actor trazable dentro del ecosistema. |
| **Economía circular** | Enfoque que busca mantener materiales y productos en uso el mayor tiempo posible. | En residuos se traduce en prevención, reutilización, reciclaje y valorización. | Traza Ambiental puede usarla como capa narrativa, pero debe amarrarla a evidencia regulatoria y operativa. |

*Sección con 8 términos operativos.*

**10\. Qué debería tener Traza Ambiental para capturar este lenguaje regulatorio**

**•** Catálogo maestro de establecimientos, empresas, RUT y roles (Encargado, Delegado, Representante Legal).

**•** Motor regulatorio por flujo: residuos no peligrosos, residuos peligrosos, REP, importación/exportación y aguas si corresponde.

**•** Calendario de obligaciones con periodicidad por sistema, módulo, rol, región y umbral.

**•** Catálogo de residuos con clasificación propia \+ LER \+ tipo de peligrosidad \+ producto prioritario asociado.

**•** Gestor documental para comprobantes, hojas de seguridad, autorizaciones sanitarias, resoluciones y documentos de movimiento.

**•** Bitácora de auditoría inalterable para demostrar cumplimiento técnico-ambiental.

**•** Matriz de estados por declaración: borrador, enviada, aprobada, aprobada con observación, rechazada, cerrada, omitida, subsanada.

**•** Modelo de trazabilidad por fracción, no solo por residuo íntegro, para soportar trazabilidad circular.

**•** Módulo de comercio exterior para residuos y fracciones con checklist de Basilea, Aduanas y autorización sectorial.

**•** Dashboard ejecutivo con semáforos de obligación, vencimiento, riesgo sancionatorio y evidencias faltantes.

**11\. Fuentes oficiales base utilizadas**

**–** Portal Ventanilla Única RETC: definición general, acceso con ClaveÚnica, registro de establecimiento y sistemas sectoriales.

**–** SINADER: definición, sujetos obligados, roles, residuos declarables, umbral de 12 toneladas y manuales de declaración.

**–** DJA: definición, sujeto obligado, fecha de octubre y carácter por establecimiento.

**–** Ley 20.920: marco general de residuos, REP, importadores/exportadores y principios.

**–** D.S. 148/2004 MINSAL: residuos peligrosos, plan de manejo, prohibición de mezcla, contenedores y exigencias sanitarias.

**–** Convenio de Basilea: movimiento transfronterizo, manejo ambientalmente racional, documento de movimiento, tránsito y tráfico ilícito.

**–** Reglamento de movimiento transfronterizo del MMA: autorizaciones y obligación de informar importación/exportación a través del RETC.

**–** Servicio Nacional de Aduanas: mercancías sujetas a autorización o visto bueno y restricciones para ciertos desechos.

**–** Dirección General de Aguas: definición institucional de la DGA para el caso de proyectos ambientales integrales.

**–** Manuales oficiales 2025 de declaración mensual y anual de SINADER para roles industriales y municipales.

*Nota final: este documento es un diccionario operativo. No reemplaza una opinión legal para un caso específico de sanción, autorización o movimiento transfronterizo singular.*