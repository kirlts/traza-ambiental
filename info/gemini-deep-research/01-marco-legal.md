# **Informe de Investigación Exhaustiva: Marco Legal Chileno de la Responsabilidad Extendida del Productor (REP) para Neumáticos Fuera de Uso (NFU) y su Traducción a Requisitos de Software**

## **1\. Contexto Estratégico y Propósito del Documento**

El presente informe de investigación constituye un análisis exhaustivo y riguroso del marco legal chileno que regula la Responsabilidad Extendida del Productor (REP), con un enfoque específico en la gestión de Neumáticos Fuera de Uso (NFU). Este documento ha sido estructurado con el objetivo singular de servir como el insumo factual, jurídico y arquitectónico fundamental para la redacción de un Documento de Requisitos de Producto (PRD, por sus siglas en inglés) orientado al desarrollo de un sistema informático de trazabilidad ambiental.

La transición desde una economía lineal hacia un modelo de economía circular en Chile no se sostiene únicamente en declaraciones de principios, sino en un entramado regulatorio altamente coercitivo y tecnificado. Para que una plataforma de software logre dar soporte a las empresas reguladas, su diseño no puede basarse en aproximaciones logísticas estándar; debe ser un reflejo exacto y algorítmico de los cuerpos legales vigentes. En este sentido, la ingeniería de software y el modelado de bases de datos deben subordinarse a la ontología jurídica dictada por el Estado.

Este reporte explora cuatro pilares normativos fundamentales, derivados estrictamente de los hallazgos documentales en repositorios oficiales:

1. La **Ley 20.920**, que establece la arquitectura institucional, las definiciones operativas fundamentales y las obligaciones ineludibles de los actores del mercado.  
2. El **Decreto Supremo N.° 8**, que parametriza cuantitativamente el esfuerzo exigido a la industria mediante tablas de metas específicas para los NFU y dicta las reglas de categorización de la materialidad.  
3. La **Ley 20.417**, que rige el accionar de la Superintendencia del Medio Ambiente (SMA) y dimensiona el riesgo financiero y sancionatorio al que se exponen los usuarios del sistema ante fallas de reporte o incumplimiento.  
4. La **Ley 19.799**, que establece los estándares de criptografía legal y firma electrónica requeridos para dotar de valor probatorio a los certificados de trazabilidad generados por la plataforma.

A través de un análisis de segundo y tercer orden, los datos extraídos de las fuentes oficiales serán traducidos en implicancias directas para la arquitectura del sistema, definiendo cómo las leyes moldean los roles de usuario, los motores de validación, las alertas de cumplimiento y las integraciones criptográficas del futuro software.

## ---

**2\. La Ley 20.920: Marco Institucional y Ontología del Sistema**

La piedra angular del ecosistema de trazabilidad ambiental en Chile es la legislación que instaura la Responsabilidad Extendida del Productor. Este cuerpo normativo no solo declara intenciones, sino que establece un vocabulario técnico vinculante que debe ser adoptado como el diccionario de datos maestro de cualquier sistema de software que pretenda operar en este dominio.

### **2.1. Identificación Oficial de la Ley**

Para efectos de referenciación en la documentación técnica del PRD y en los manuales de cumplimiento de la plataforma, los metadatos exactos de esta normativa, según los repositorios oficiales de la Biblioteca del Congreso Nacional (BCN) y el Diario Oficial, son los siguientes:

* **Nombre oficial completo:** Ley N° 20.920 "Establece Marco Para La Gestión De Residuos, La Responsabilidad Extendida Del Productor Y Fomento Al Reciclaje".1  
* **Número de la Ley:** Ley 20.920.4  
* **Fecha exacta de publicación:** 1 de junio de 2016\.1  
* **Institución emisora:** Ministerio del Medio Ambiente.4

El hecho de que esta ley haya sido publicada a mediados de 2016 2 demuestra que el Estado chileno ha otorgado un período de maduración institucional significativo antes de la entrada en vigencia de las metas coercitivas sectoriales. Para el desarrollo del software, esto implica que las autoridades ambientales (como el Ministerio del Medio Ambiente y la Superintendencia del Medio Ambiente) ya cuentan con plataformas base, como el Registro de Emisiones y Transferencias de Contaminantes (RETC) 6, con las cuales el nuevo sistema de trazabilidad deberá interactuar de manera obligatoria.

### **2.2. Diccionario de Datos: Definiciones del Artículo 3**

El modelado de bases de datos relacionales requiere entidades claramente definidas. El Artículo 3 de la Ley 20.920 provee esta taxonomía. A continuación, se extraen textualmente las definiciones solicitadas, acompañadas de un análisis de sus implicancias para el diseño del producto de software.

| Concepto Legal | Definición Textual Extraída del Artículo 3 | Implicancias para la Arquitectura del Software (PRD) |
| :---- | :---- | :---- |
| **Producto Prioritario** | *"Sustancia u objeto que una vez transformado en residuo, por su volumen, peligrosidad o presencia de recursos aprovechables, queda sujeto a las obligaciones de la responsabilidad extendida del productor”* (Artículo 3, numeral 20).2 | La base de datos de inventario no puede tratar a los NFU como simples ítems (SKUs). El sistema debe poseer un atributo booleano o etiqueta (is\_prioritario \= true) que desencadene flujos de trabajo (workflows) específicos de cumplimiento y reporte que no aplican a la mercadería regular. |
| **Residuo** | *"Sustancia u objeto que su generador desecha o tiene la intención u obligación de desechar de acuerdo a la normativa vigente"* (Artículo 3, letra n / numeral 24).8 | El software debe gestionar el ciclo de vida del ítem. Un neumático pasa de ser un activo comercial a un "residuo" en el momento en que se declara la intención de desecho. Esto requiere una máquina de estados (state machine) en el backend que bloquee ciertas transacciones comerciales una vez que el ítem cambia a estado "residuo". |
| **Valorización** | *"Conjunto de acciones cuyo objetivo es recuperar un residuo, uno o varios de los materiales que lo componen y,o el poder calorífico de los mismos. La valorización comprende la preparación para la reutilización, el reciclaje y la valorización energética"* (Artículo 3, numeral 30).9 | Este es el estado final de éxito en el sistema. El módulo de cierre de ciclo debe ofrecer al usuario opciones categorizadas (reutilización, reciclaje material, valorización energética) para certificar el destino final, ya que, como se verá más adelante, la ley discrimina qué tipos de valorización son válidos para ciertas metas. |
| **Gestor** | *"Persona natural o jurídica, pública o privada, que realiza cualquiera de las operaciones de manejo de residuos y que se encuentra autorizada y registrada en conformidad a la normativa vigente"*.2 | En el sistema de control de accesos (RBAC), el rol "Gestor" debe estar condicionado a la validación de sus credenciales. El software debe impedir que un gestor sin autorización sanitaria o ambiental vigente pueda emitir certificados de valorización en la plataforma. |
| **Sistema de Gestión** | *"Mecanismo instrumental para que los productores, individual o colectivamente, den cumplimiento a las obligaciones establecidas en el marco de la responsabilidad extendida del productor, a través de la implementación de un plan de gestión"* (Artículo 3, numeral 27).2 | Entidad agrupadora central en la plataforma B2B. Los productores no reportan individualmente al vacío; se afilian a esta entidad. El software debe soportar relaciones de base de datos de uno-a-muchos (un sistema colectivo agrupa a múltiples productores) y proveer interfaces analíticas agregadas a nivel de "Sistema de Gestión". |
| **Productor** | *"Todas aquellas personas, que independientemente de la técnica de comercialización; i) enajenan un producto prioritario por primera vez en el mercado nacional; ii) enajenan bajo marca propia un producto prioritario adquirido de un tercero que no es el primer distribuidor; o iii) importan un producto prioritario para su propio uso profesional"* (Artículo 3, numeral 21).2 | El módulo de registro de usuarios o empresas (Onboarding) debe contener un cuestionario lógico que evalúe estas tres condiciones (enajenación primaria, marca propia, importación directa). Si un usuario cumple cualquiera de las tres, el sistema le asigna obligatoriamente el perfil "Productor", activando los módulos de pago de tarifas REP y cumplimiento de metas. |

#### **2.2.1. Conceptos No Encontrados Textualmente en el Artículo 3**

En estricto apego a la metodología de descubrimiento de este informe, se reportan las siguientes ausencias de definiciones literales en el articulado solicitado:

* **Reciclaje:**. Si bien el término es ampliamente utilizado en las fuentes y se menciona expresamente como una de las acciones que componen la "valorización" 9, su definición autónoma, aislada y literal dentro de los numerales del Artículo 3 no figuró en la documentación obtenida.  
* **Recolección:**. Al igual que el concepto anterior, las fuentes discuten profusamente las "metas de recolección y valorización" 11 y listan la recolección como parte de las operaciones de manejo de residuos 2, pero una definición semántica jurídica propia dentro de este artículo no fue hallada.  
* **Generador:**. La normativa hace referencias indirectas al término, indicando por ejemplo que un "Consumidor" es "Todo generador de un residuo de producto prioritario" 9, y regulando extensamente la figura del "Consumidor industrial" como el establecimiento que genera dichos residuos.6 Sin embargo, la definición aislada de "generador" como entrada de glosario en el Artículo 3 no arrojó resultados.

Desde la perspectiva del diseño de producto (PRD), la falta de definiciones atómicas para "Recolección" y "Reciclaje" dentro del Artículo 3 implica que el software deberá basarse en los estándares industriales o en definiciones reglamentarias secundarias (como las del Ministerio de Salud o decretos específicos) para trazar los límites físicos de estas operaciones (por ejemplo, determinar en qué exacto momento un neumático transportado se considera "recolectado").

### **2.3. Obligaciones Específicas de los Productores (Artículo 9\)**

Si el Artículo 3 define "quiénes" están en el sistema, el Artículo 9 de la Ley 20.920 establece imperativamente el "qué deben hacer". Las obligaciones que recaen sobre los productores de productos prioritarios son intransferibles y determinan los módulos funcionales de cumplimiento normativo (Compliance Modules) que el software de trazabilidad deberá proveer de forma automatizada.

El texto legal impone las siguientes exigencias literales a los productores:

1. **Registro Institucional Obligatorio:** Se les exige *"a) Inscribirse en el registro establecido en el artículo 37"*.2 Esto hace referencia al Registro de Emisiones y Transferencias de Contaminantes (RETC).  
   * *Impacto en el PRD:* El software privado de trazabilidad no exime a las empresas de este registro estatal. El sistema debe, como mínimo, permitir a los productores almacenar su comprobante de inscripción RETC en sus perfiles, y en una fase avanzada, conectarse mediante Interfaces de Programación de Aplicaciones (API) al Ministerio del Medio Ambiente para sincronizar este estado registral.  
2. **Organización y Financiamiento a través de Sistemas de Gestión:** Se les exige *"b) Organizar y financiar la recolección de los residuos de los productos prioritarios en todo el territorio nacional, así como su almacenamiento, transporte y tratamiento en conformidad a la ley, a través de alguno de los sistemas de gestión a que se refiere el párrafo 3º de este título..."*.2  
   * *Impacto en el PRD:* La ley prohíbe tácitamente la acción individual informal. Obliga a la articulación *"a través de alguno de los sistemas de gestión"*. Por tanto, el software B2B debe funcionar como un ecosistema de liquidación financiera (clearinghouse). El módulo financiero del sistema debe calcular el costo proporcional que cada productor debe pagar al Sistema de Gestión por la logística de recolección y tratamiento, basándose en los volúmenes de neumáticos introducidos al mercado.  
3. **Responsabilidad sobre Metas Cuantitativas:** Se les exige *"c) Cumplir con las metas y otras obligaciones asociadas, en los plazos, proporción y condiciones establecidos en el respectivo decreto supremo"*.2  
   * *Impacto en el PRD:* Este es el núcleo duro de la trazabilidad. El sistema debe contar con tableros de control (dashboards) en tiempo real que comparen la cantidad de neumáticos comercializados (el pasivo ambiental creado) frente a la cantidad certificadamente valorizada. Se requieren algoritmos de advertencia temprana que notifiquen a los administradores si la "proporción" de cumplimiento está por debajo de la meta establecida en la línea de tiempo.  
4. **Trazabilidad hacia Actores Regulados:** Se les exige *"d) Asegurar que la gestión de los residuos de los productos prioritarios se realice por gestores autorizados y registrados"*.2  
   * *Impacto en el PRD:* La responsabilidad del productor no termina al desechar el neumático, sino que se extiende hasta su disposición final. El sistema de software debe implementar una validación estricta de la cadena de custodia (Chain of Custody). No se puede computar una tonelada como "cumplida" si la entidad de destino final no posee una bandera digital de "Gestor Autorizado" en la base de datos.

En síntesis, el Artículo 9 transforma a los productores de meros fabricantes a responsables financieros y logísticos del fin de vida de sus productos. El software debe ser la herramienta que materialice y audite esta responsabilidad extendida.

## ---

**3\. El Decreto Supremo N.° 8: Metodología y Metas Cuantitativas para Neumáticos Fuera de Uso (NFU)**

Para operativizar las obligaciones generales de la Ley 20.920, el Ministerio del Medio Ambiente emite reglamentos sectoriales. Para el mercado de neumáticos, el instrumento vinculante es el Decreto Supremo N.° 8\. Este documento es vital para los ingenieros de software, ya que entrega los parámetros matemáticos y las reglas de negocio exactas que el sistema de trazabilidad debe calcular.

### **3.1. Identificación y Propósito del Decreto**

De acuerdo con el análisis de los repositorios de la BCN y el Diario Oficial, los detalles formales del decreto son:

* **Número exacto:** Decreto Supremo Nº 8\.12  
* **Fecha de publicación:** 20 de enero de 2021 (indicada en la versión única del cuerpo normativo).13 Es importante notar que el decreto tuvo una promulgación previa el 28 de mayo de 2019, pero su publicación y entrada al corpus activo se registra en 2021\.13  
* **Texto fundacional que establece las metas:** El descubrimiento documental arroja la siguiente declaración de propósitos literal: *"El presente decreto tiene por objeto establecer metas de recolección y valorización y otras obligaciones asociadas al producto prioritario neumáticos, a fin de prevenir la generación de tales residuos y fomentar su reutilización, reciclaje u otro tipo de valorización"*.11

### **3.2. Criterios de Clasificación de la Materialidad (Diferenciación de Categorías)**

Una instrucción crítica para la estructuración de la base de datos del sistema de trazabilidad es comprender cómo la ley separa físicamente los tipos de neumáticos. La consulta inicial planteó la hipótesis de que el Decreto Supremo 8 podría definir umbrales de peso (ej. 100 kg, 150 kg) para diferenciar las categorías.

* **¿Define el D.S. 8 umbrales de peso para diferenciar la Categoría A de la Categoría B?**  
  .

**Análisis Jurídico y Corrección de Reglas de Negocio:** La búsqueda exhaustiva demuestra que la presunción de clasificación por peso en kilogramos es incorrecta a la luz del texto oficial. El Decreto Supremo N.° 8 categoriza los neumáticos basándose estrictamente en las **dimensiones geométricas del aro interior**, expresadas en pulgadas (inches).12 El texto oficial extraído dictamina la siguiente regla de categorización inmutable:

* **Categoría A:** *"Neumáticos que tengan un aro inferior a 57 pulgadas, con excepción de los que tengan un aro igual a 45 pulgadas, a 49 pulgadas y a 51 pulgadas"*.12  
* **Categoría B:** *"Neumáticos que tengan un aro igual a 45 pulgadas, a 49 pulgadas, a 51 pulgadas y aros iguales o mayores a 57 pulgadas"*.12

(Nota adicional: El decreto menciona de forma separada a los neumáticos de bicicletas y de sillas de ruedas como entidades distintas debido a su composición y peso, pero el núcleo industrial se divide en A y B por pulgadas 12).

**Implicancia Arquitectónica para el PRD:** El Maestro de Materiales (Item Master Data) del sistema ERP/Trazabilidad no debe utilizar el peso como llave primaria de categorización lógica. Cada SKU de neumático ingresado al sistema debe tener un campo obligatorio llamado diametro\_aro\_pulgadas. Un script en el backend debe evaluar automáticamente este valor contra las reglas del D.S. 8 (ej. IF aro \< 57 AND aro NOT IN (45,49,51) THEN categoria \= 'A') para asignar la meta de cumplimiento correcta. Si un sistema se basa en peso, calculará erróneamente las responsabilidades del productor, exponiéndolo a multas gravísimas.

### **3.3. Tablas de Metas de Recolección y Valorización**

El Decreto Supremo 8 impone un régimen de escalabilidad temporal severo. Los productores, a través de sus sistemas de gestión, están obligados a recolectar y valorizar porcentajes específicos calculados sobre el volumen total de neumáticos que introducen al mercado nacional.

Las metas extraídas del Modelo de Economía Circular del Ministerio del Medio Ambiente 14 configuran las siguientes exigencias año a año:

**Tabla 1: Metas Normativas para Neumáticos Categoría A**

| Año de Implementación | Meta de Recolección Obligatoria | Meta de Valorización Obligatoria |
| :---- | :---- | :---- |
| **Año 1** | 50% | 25% |
| **Año 2** | \- | 30% |
| **Año 3** | *(Inician otras metas colectivas)* | 35% |
| **Año 4** | 80% | 60% |
| **Año 6** | \- | 80% |
| **Año 8** | 90% | 90% |

*Condición restrictiva de trazabilidad (Regla de Oro):* Para la Categoría A, alcanzar el porcentaje general de valorización no es suficiente para asegurar el cumplimiento legal. El texto estipula una restricción cualitativa profunda: **"El 60%, como mínimo, deberá corresponder a neumáticos fuera de uso sometidos a reciclaje material o de rencauche"**.14

* *Traducción algorítmica para el software:* El dashboard de cumplimiento no solo debe sumar toneladas valorizadas vs. introducidas. Debe segmentar las toneladas por *tipo de valorización*. Si un Sistema de Gestión alcanza el 90% de valorización en el Año 8, pero utilizó co-procesamiento en cementeras para la totalidad de la masa, el sistema de software debe emitir una **alerta roja de incumplimiento normativo**, ya que no satisfizo el piso mínimo del 60% en reciclaje material o rencauche.

**Tabla 2: Metas Normativas para Neumáticos Categoría B (Minería y Gran Maquinaria)**

| Año de Implementación | Meta de Recolección | Meta de Valorización Obligatoria |
| :---- | :---- | :---- |
| **Año 1** | *(Dato de recolección no explícito)* | 25% |
| **Año 5** | *(Dato de recolección no explícito)* | 75% |
| **Año 8** | *(Dato de recolección no explícito)* | 100% |

*Nota metodológica:* En las fuentes consultadas 14, el énfasis para los neumáticos Categoría B se concentra en los porcentajes de valorización. Los porcentajes aislados de recolección para esta categoría no figuraron explícitamente en el recorte documental.

#### **3.3.1. Análisis de la Gradualidad Normativa**

La progresión de estas tablas revela el principio jurídico de "gradualidad" inmerso en la política pública chilena, imponiendo una presión regulatoria creciente. La arquitectura del sistema de trazabilidad debe estar preparada para soportar una asimetría temporal en el estrés transaccional.

Para la **Categoría A** (neumáticos de mercado automotriz masivo), la curva de esfuerzo exigida por el D.S. 8 es sostenida, partiendo con una exigencia de recolección del 50% en el Año 1, escalando agresivamente al 80% en el Año 4, y culminando en una absorción casi total del impacto con un 90% de recolección y valorización para el Año 8\.

Por otro lado, la **Categoría B** (neumáticos gigantes para la gran minería) exhibe saltos normativos mucho más pronunciados. Si bien inicia con un 25% de valorización exigida en el Año 1, da un salto monumental al 75% en el Año 5\. Lo más crítico es la meta final: el decreto impone la obligación absoluta de valorizar el **100%** de los neumáticos Categoría B introducidos al mercado nacional hacia el octavo año.

Para el Documento de Requisitos de Producto (PRD), esta gradualidad dicta que las alertas del sistema no pueden ser estáticas. El motor de reglas (Rule Engine) del software debe actualizar automáticamente los "umbrales de éxito" cada primero de enero, modificando los indicadores de desempeño (KPIs) de verde a rojo si las tasas de procesamiento de los gestores no se aceleran al mismo ritmo que dictan los hitos temporales (Años 1, 2, 3, 4, 5, 6 y 8\) del Decreto Supremo N.° 8\.

## ---

**4\. Gestión de Riesgos y Régimen Sancionatorio: Superintendencia del Medio Ambiente (Ley 20.417)**

La efectividad de un sistema de trazabilidad B2B pagado por privados depende de la percepción de riesgo asociada al incumplimiento. Si no hay riesgo, no hay incentivo para adoptar la plataforma tecnológica. En Chile, la Superintendencia del Medio Ambiente (SMA) actúa como el brazo fiscalizador y punitivo del ecosistema REP. Su accionar está delimitado por la Ley 20.417, que crea la SMA y el Servicio de Evaluación Ambiental.

La comprensión del régimen sancionatorio es vital para diseñar los módulos de advertencia y los registros de auditoría inalterables (Audit Trails) dentro del software, ya que un simple error de reporte en la plataforma puede desencadenar consecuencias financieras corporativas devastadoras.

### **4.1. Taxonomía de Infracciones Ambientales**

El marco penal administrativo requiere clasificar la severidad de las faltas. Según los hallazgos documentales:

* **¿Qué artículo específico clasifica las infracciones?** La taxonomía legal de los incumplimientos está consagrada en el **Artículo 36** de la Ley 20.417.15 Este articulado determina explícitamente: *"Para los efectos del ejercicio de la potestad sancionadora que corresponde a la Superintendencia, las infracciones de su competencia se clasificarán en gravísimas, graves y leves"*.15  
* Como complemento descriptivo, el Artículo 35 (en conjunto con el 36\) estipula que serán consideradas infracciones *leves* aquellos actos u omisiones que contravengan cualquier precepto y que, por descarte legal, "no constituyan infracción gravísima o grave".18

### **4.2. Exposición Financiera Máxima: Las Infracciones Gravísimas**

Al diseñar los modelos de riesgo en el Documento de Requisitos de Producto, los Product Managers deben dimensionar el límite superior de responsabilidad económica al que se exponen los Productores o los Sistemas de Gestión si el software falla en reportar correctamente sus metas REP.

* **Monto máximo de multa en UTA:** El Artículo 39 de la ley orgánica de la SMA dicta que la sanción pecuniaria para **infracciones gravísimas** contempla un límite máximo de multas de hasta **10.000 Unidades Tributarias Anuales (UTA)**.19  
* Este monto extraordinariamente alto (aproximadamente equivalente a decenas de millones de dólares dependiendo del valor fluctuante de la UTA) convierte al software de trazabilidad en un sistema de misión crítica. Una discrepancia de datos que impida a una empresa demostrar su cumplimiento de metas la expone a este rango de penalización.  
* **Consecuencias adicionales:** Además de la multa de 10.000 UTA, la ley faculta a la autoridad para ejecutar la clausura temporal o definitiva de operaciones y la revocación de la Resolución de Calificación Ambiental (RCA).19

Como factor de riesgo añadido para los Sistemas de Gestión Colectivos (entidades conformadas por agrupaciones de empresas 22), el marco legal les obliga a constituir cauciones (seguros o fianzas) para garantizar el cumplimiento de las metas del D.S. 8\. La Tesorería General de la República posee la potestad de proceder al "cobro de la garantía" cuando la obligación de pago de una multa impuesta por la SMA sea exigible. La ley fija un "Factor de Riesgo de Incumplimiento" mínimo del 15% sobre el total caucionado.23

### **4.3. Precedentes Jurisprudenciales en el Mercado REP**

Para justificar la adopción inmediata de plataformas de trazabilidad, el PRD debe responder una pregunta fundamental sobre la realidad del mercado: ¿El organismo fiscalizador ejerce estas facultades, o son meramente teóricas?

* **¿Existen precedentes de multas efectivamente aplicadas por incumplimiento de metas REP?** De acuerdo con los reportes oficiales revisados de la SMA, la entidad ha **iniciado activamente los primeros procedimientos sancionatorios**, demostrando una voluntad persecutoria real. Sin embargo, a la fecha de la documentación recabada, **no existen precedentes de multas económicas efectivamente aplicadas y cobradas** de forma definitiva en última instancia administrativa.17

El estado procesal actual se enmarca en la etapa de "Formulación de Cargos", donde los imputados gozan de plazos legales ampliados (22 días hábiles) para presentar sus defensas o Programas de Cumplimiento.17 Los precedentes que marcarán la jurisprudencia para los sistemas de software B2B son:

1. **Caso Insacomex (Expediente F-013-2025):** Este precedente es crucial para la ingeniería del software. Insacomex, una empresa comercializadora de neumáticos Categoría A conformada como Sistema Individual de Gestión, fue imputada no por un derrame tóxico, sino por un **fallo informático y de reportería**. La SMA formuló cargos porque la empresa no informó las toneladas introducidas al mercado nacional en 2022 y omitió reportar sus operaciones de manejo de residuos (valorización) de 2023\.17 Agravando la situación, la empresa no respondió a dos requerimientos formales de información de la autoridad, lo que tipifica la conducta como "Grave".17  
   * *Lección para el PRD:* El software debe poseer APIs robustas y alertas proactivas. Si un cliente ignora la notificación mensual de subida de reportes al RETC, el sistema debe escalar la alerta a la gerencia general para evitar el silencio administrativo que detonó el caso Insacomex.  
2. **Caso Huawei (Expediente D-140-2025):** La SMA formuló un cargo "Gravísimo" basado en el Artículo 36 letra b de la LOSMA contra esta transnacional tecnológica. La infracción consistió en introducir masivamente "envases y embalajes" al país (2022-2024) **sin contar con un Sistema de Gestión autorizado** para cumplir sus metas operativas desde septiembre de 2023\.17  
   * *Lección para el PRD:* La clandestinidad o el desconocimiento corporativo no eximen de responsabilidad. La formulación de cargos gravísimos por simple omisión registral valida la necesidad de plataformas tecnológicas que auditen el estado de autorización del cliente antes de permitirle operar en el mercado.

La estrategia fiscalizadora declarada por la SMA se fundamenta abiertamente en *"el desarrollo de herramientas informáticas para la reportabilidad y trazabilidad de residuos"* y la *"identificación de empresas que eventualmente reúnen las condiciones \[...\] y que no lo han hecho"*.17 El Estado está cruzando datos aduaneros masivamente; el sector privado requiere sistemas de software con igual o mayor capacidad de procesamiento de datos para defenderse.

## ---

**5\. Trazabilidad Probatoria y Criptografía Legal (Ley 19.799)**

La arquitectura de un software de trazabilidad ambiental se basa en la transferencia de responsabilidad. Cuando un "Productor" transfiere el residuo a un "Gestor", y este último certifica que la tonelada de neumáticos ha sido valorizada según las cuotas del D.S. 8, se genera un documento digital (Certificado de Disposición Final). Dada la amenaza de una multa de 10.000 UTA 20, este documento digital no puede ser un simple archivo PDF autogenerado; debe ser una evidencia jurídica irrefutable frente a un tribunal ambiental o la SMA.

En Chile, la validez probatoria de las interacciones en plataformas de software está subyugada a la **Ley 19.799**, "Sobre Documentos Electrónicos, Firma Electrónica y Servicios de Certificación de Dicha Firma".24

### **5.1. Taxonomía de la Firma Electrónica y Valor Probatorio**

La regulación tecnológica chilena opera bajo el principio de neutralidad tecnológica y establece la **"equivalencia del soporte electrónico al soporte papel"**.26 Para ejecutar esto, la legislación reconoce dos tipologías funcionales de firma electrónica, las cuales impactan profundamente los costos de implementación de un sistema de software:

1. **Firma Electrónica Simple (FES):** Herramienta que permite la identificación de la entidad firmante en un entorno digital o red cerrada. Su barrera de entrada es baja. La ley dictamina que las empresas o plataformas que proveen este tipo de firma no están obligadas a certificarse ni acreditarse ante las autoridades del Estado.26  
2. **Firma Electrónica Avanzada (FEA):** Protocolo criptográfico estricto que permite identificar de manera indiscutible y fehaciente al autor de la firma, pero, más importante aún, *"garantiza la integridad del mismo, lo que lo hace irrepudiable"*.26  
* **Equivalencia jurídica y mandato para el PRD:** ¿Cuál de estas firmas iguala el peso de una firma hecha a mano ante notario? La normativa es tajante al señalar que la **Firma Electrónica Avanzada (FEA)** posee un reconocimiento y protección jurídica equivalente a los actos celebrados en papel con **firma manuscrita**, minimizando el riesgo de falsificación a niveles prácticamente nulos.26  
* *Traducción Arquitectónica:* Si el diseño del producto contempla que los Gestores certifiquen operaciones de reciclaje material o rencauche que sumarán al porcentaje de cumplimiento del 60% exigido por la ley 14, el flujo de validación del software **debe exigir Firma Electrónica Avanzada**. Una FES podría ser repudiada por el Gestor en un litigio por multas, argumentando que su contraseña fue vulnerada. La FEA traslada el peso de la prueba de manera definitiva.

### **5.2. Requisitos Operativos para un Prestador de Servicios de Certificación (PSC)**

Si los ingenieros del sistema de trazabilidad deciden que la plataforma no solo consumirá firmas de terceros, sino que buscará integrarse y operar como una entidad emisora de fe pública para agilizar el flujo de sus clientes, deberán cumplir como **Prestador de Servicios de Certificación (PSC)**.

El Reglamento de la Ley 19.799 (Decreto N° 181 de Economía) 27 impone una carga regulatoria monumental sobre los PSC, especialmente si desean emitir firmas avanzadas (convirtiéndose en un PSC Acreditado). El descubrimiento factual arroja los siguientes requerimientos ineludibles:

* **Naturaleza Corporativa y Domicilio:** Los prestadores pueden ser entidades públicas o privadas, chilenas o extranjeras, pero siempre personas jurídicas. Sin embargo, para operar como prestador *acreditado* (único facultado para la FEA), la ley impone la exigencia obligatoria de estar domiciliado en territorio chileno.27  
* **Monopolio de Acreditación Institucional:** Solo la Subsecretaría de Economía y Empresas de Menor Tamaño (actuando como Entidad Acreditadora) está facultada legalmente para otorgar la acreditación para emitir Firmas Electrónicas Avanzadas. El proceso no aplica para las firmas simples.26  
* **Prácticas de Certificación y Seguridad Lógica:** El Artículo 6 del reglamento obliga a los prestadores a formular e implementar reglas de negocio públicas y transparentes (escritas en castellano).27 El PSC debe poseer protocolos auditables sobre cómo identifica fehacientemente a los usuarios antes de emitir un certificado (lo cual generalmente requiere comprobación presencial o integración con bases de datos del Registro Civil 27). Deben adoptar normas técnicas internacionales rígidas, como la estructura de certificados X.509 v3 y las especificaciones del European Telecommunications Standards Institute (ETSI) para el sellado de tiempo (Time stamping) y la validación a largo plazo.27 Además, está estrictamente prohibido que el PSC guarde copias de los datos de creación de firma una vez entregados al titular.27  
* **Continuidad de Negocio y Retención de Datos:** La infraestructura de base de datos no puede ser efímera. El Artículo 11 impone que los registros de los titulares de certificados deben ser conservados por el PSC durante un período mínimo de **seis años** contados desde su emisión inicial.27 Si el PSC cesa sus actividades (quiebra o cierre voluntario), el Artículo 11 y el Artículo 16 de la Ley prohíben la destrucción de los datos; estos deben ser traspasados forzosamente a otro prestador acreditado o a una empresa de custodia autorizada.27  
* **Garantía de Solvencia Financiera (Seguros):** Para blindar el ecosistema de comercio electrónico frente a negligencias, la ley exige a los prestadores acreditados mantener vigente una póliza de seguro de responsabilidad civil para cubrir daños a terceros. Esta póliza no permite deducibles y debe contemplar una suma asegurada base de, al menos, **5.000 Unidades de Fomento (UF)**.27

La vastedad de estas regulaciones sugiere una directriz clara para el desarrollo del PRD: a menos que el modelo de negocio del software de trazabilidad incluya convertirse en un certificador criptográfico a nivel nacional, la ruta tecnológica de menor fricción y riesgo legal es **integrarse vía API de consumo con un PSC ya acreditado** en Chile, externalizando el cumplimiento de la Ley 19.799 mientras se asegura la irrepudiabilidad de los certificados REP.

## ---

**6\. Síntesis y Requerimientos Críticos para el PRD**

La integración de la Ley 20.920, el Decreto Supremo N.° 8, la Ley 20.417 y la Ley 19.799 articula un entorno operativo donde el incumplimiento logístico se convierte rápidamente en una catástrofe financiera corporativa. El software de trazabilidad debe diseñarse como una herramienta de mitigación de riesgo legal y no meramente como un sistema de inventarios.

A partir del descubrimiento fáctico realizado, se formulan las siguientes directrices estructurales inmutables que deben gobernar la redacción del Documento de Requisitos de Producto (PRD):

1. **Arquitectura de Datos basada en Geometría, no en Masa:** La clasificación primaria en el Maestro de Materiales para neumáticos no debe basarse en umbrales de peso (100 kg, 150 kg), hipótesis que queda descartada al no tener fundamento en la ley vigente. El atributo clasificador del esquema relacional debe ser el **perímetro del aro en pulgadas**. Todo neumático menor a 57 pulgadas (con excepciones de 45, 49 y 51\) deberá activar el flujo de cumplimiento para la Categoría A, mientras que las maquinarias pesadas activarán los flujos correspondientes a la Categoría B.12  
2. **Motor de Reglas de Cumplimiento Dinámico (Rule Engine):** El sistema debe evaluar automáticamente las proporciones de éxito dictadas por las tablas del D.S. 8\.14 Los *dashboards* deben calibrar la barra de progreso exigiendo hasta un 90% de recolección y valorización para Categoría A hacia el octavo año, y un drástico 100% de valorización para Categoría B. De manera crítica, la plataforma debe alertar si las certificaciones de la Categoría A no cumplen con el sub-umbral cualitativo del 60% mínimo de destino hacia reciclaje material o rencauche.14  
3. **Roles y Accesos Supeditados a Estatus Institucional:** La creación de usuarios debe replicar las entidades de la Ley 20.920.2 Los perfiles de "Productor" deben asociarse obligatoriamente a "Sistemas de Gestión". Además, el perfil de "Gestor" debe poseer un bloqueo lógico de sistema (Soft Lock); si la empresa no acredita estar autorizada por la institucionalidad ambiental o de salud correspondiente, la plataforma debe inhabilitarla para emitir certificados de disposición final.  
4. **Automatización Preventiva de Reportes frente a la SMA:** Dados los precedentes de formulación de cargos de la SMA (ej. caso Insacomex) motivados por la omisión de reporte de toneladas ingresadas y la falta de respuesta a oficios 17, el software debe proveer integraciones API directas con el RETC estatal o, en su defecto, módulos de alerta temprana automatizados. La evasión de estas responsabilidades de información califica el acto como infracción grave, lo cual pavimenta el camino hacia multas de hasta 10.000 UTA si la conducta evoluciona o se reitera de forma gravísima.20  
5. **Adopción Obligatoria de Criptografía Legal Avanzada:** Para neutralizar la capacidad de repudio de los actores sobre las toneladas declaradas, el módulo de cierre y certificación de disposición final debe encriptarse utilizando **Firma Electrónica Avanzada (FEA)**.26 La estrategia de desarrollo recomendada es la integración mediante protocolos de terceros (API) con Prestadores de Servicios de Certificación Acreditados, evitando que el desarrollo asuma los costos fijos inmensos de retención de datos por 6 años y fianzas por 5.000 UF exigidas por la Ley 19.799.27

El riguroso cumplimiento de estos lineamientos factualmente comprobables garantizará que la plataforma de software posea una base arquitectónica robusta, legalmente blindada y alineada a las expectativas fiscalizadoras del Estado de Chile.

#### **Obras citadas**

1. Ley Chile \- Ley 20920 \- Biblioteca del Congreso Nacional \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/Navegar?idNorma=1090894](https://www.bcn.cl/leychile/Navegar?idNorma=1090894)  
2. Nuevos estándares y obligaciones de los gestores de residuos consagrados en la Ley 20.920 \- Repositorio Académico \- Universidad de Chile, fecha de acceso: abril 9, 2026, [https://repositorio.uchile.cl/bitstream/handle/2250/191855/Nuevos-estandares-y-obligaciones-de-los-gestores-de-residuos-consagrados-en-la-ley-20920.pdf?sequence=1](https://repositorio.uchile.cl/bitstream/handle/2250/191855/Nuevos-estandares-y-obligaciones-de-los-gestores-de-residuos-consagrados-en-la-ley-20920.pdf?sequence=1)  
3. Ley N° 20.920 que establece Marco para la Gestión de Residuos, la Responsabilidad Extendida del Productor y Fomento al Recicla \- BCN, fecha de acceso: abril 9, 2026, [https://obtienearchivo.bcn.cl/obtienearchivo?id=repositorio/10221/24861/2/Resumen\_Ley\_20920\_REP\_y\_Reciclaje\_2017.pdf](https://obtienearchivo.bcn.cl/obtienearchivo?id=repositorio/10221/24861/2/Resumen_Ley_20920_REP_y_Reciclaje_2017.pdf)  
4. Ley 20920 ESTABLECE MARCO PARA LA GESTIÓN DE RESIDUOS, LA RESPONSABILIDAD EXTENDIDA DEL PRODUCTOR Y FOMENTO AL RECICLAJE \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/Navegar/imprimir?idNorma=1090894\&idParte=9705088](https://www.bcn.cl/leychile/Navegar/imprimir?idNorma=1090894&idParte=9705088)  
5. Ley 20920 ESTABLECE MARCO PARA LA GESTIÓN DE RESIDUOS, LA RESPONSABILIDAD EXTENDIDA DEL PRODUCTOR Y FOMENTO AL RECICLAJE \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/Consulta/nav\_vinc\_concordancia?idNorma=1090894\&fechaVigencia=2016-06-01\&clase\_vinculacion=CONCORDANCIA](https://www.bcn.cl/leychile/Consulta/nav_vinc_concordancia?idNorma=1090894&fechaVigencia=2016-06-01&clase_vinculacion=CONCORDANCIA)  
6. Ley Rep \- Economía Circular \- Ministerio del Medio Ambiente, fecha de acceso: abril 9, 2026, [https://economiacircular.mma.gob.cl/ley-rep/](https://economiacircular.mma.gob.cl/ley-rep/)  
7. Ley de Fomento al Reciclaje: Hacia la Responsabilidad Extendida del Productor \- Revista Justicia Ambiental, fecha de acceso: abril 9, 2026, [http://www.revistajusticiaambiental.cl/wp-content/uploads/2018/03/art\_07\_02-1.pdf](http://www.revistajusticiaambiental.cl/wp-content/uploads/2018/03/art_07_02-1.pdf)  
8. CONSULTA PÚBLICA \- FORMULARIO DE OBSERVACIONES Proyecto Reglamento Art. 35 Ley 20.920 (REP) \- Sofofa, fecha de acceso: abril 9, 2026, [https://web.sofofa.cl/wp-content/uploads/2019/11/Jun2018\_Observaciones-Reglamento-Autorizaci%C3%B3n-Sanitaria-REP.pdf](https://web.sofofa.cl/wp-content/uploads/2019/11/Jun2018_Observaciones-Reglamento-Autorizaci%C3%B3n-Sanitaria-REP.pdf)  
9. Ley 20920 \- Biblioteca del Congreso Nacional de Chile \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/navegar?idNorma=1090894](https://www.bcn.cl/leychile/navegar?idNorma=1090894)  
10. Diagnóstico sectorial “Economía Circular en Textiles”, fecha de acceso: abril 9, 2026, [https://economiacircular.mma.gob.cl/wp-content/uploads/2023/11/DIAGNOSTICO\_SECTORIAL\_ECONOMIA\_CIRCULAR\_EN\_TEXTILES.pdf](https://economiacircular.mma.gob.cl/wp-content/uploads/2023/11/DIAGNOSTICO_SECTORIAL_ECONOMIA_CIRCULAR_EN_TEXTILES.pdf)  
11. fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/navegar?idNorma=1154847\#:\~:text=El%20presente%20decreto%20tiene%20por,u%20otro%20tipo%20de%20valorizaci%C3%B3n.](https://www.bcn.cl/leychile/navegar?idNorma=1154847#:~:text=El%20presente%20decreto%20tiene%20por,u%20otro%20tipo%20de%20valorizaci%C3%B3n.)  
12. Ley Chile \- Decreto 8 (20-ene-2021) M. del Medio Ambiente \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/navegar?idNorma=1154847](https://www.bcn.cl/leychile/navegar?idNorma=1154847)  
13. Decreto 8 ESTABLECE METAS DE RECOLECCIÓN Y VALORIZACIÓN Y OTRAS OBLIGACIONES ASOCIADAS DE NEUMÁTICOS \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/Navegar?idNorma=1154847\&idVersion=2021-01-20](https://www.bcn.cl/leychile/Navegar?idNorma=1154847&idVersion=2021-01-20)  
14. Modelamiento de los efectos macroeconómicos de la transición a la economía circular para Latinoamérica, fecha de acceso: abril 9, 2026, [https://cop25ue.mma.gob.cl/wp-content/uploads/2022/03/Modelo-Economia-Circular.pdf](https://cop25ue.mma.gob.cl/wp-content/uploads/2022/03/Modelo-Economia-Circular.pdf)  
15. MAT.: 1\) Presenta Programa de Cumplimiento 2\) Acompaña Documentos. REF: Expediente Sancionatorio Rol D-289-2024. ADJUN. \- SNIFA, fecha de acceso: abril 9, 2026, [https://snifa.sma.gob.cl/General/Descargar/20602078888](https://snifa.sma.gob.cl/General/Descargar/20602078888)  
16. MENSAJE DE S.E. EL PRESIDENTE DE LA REPÚBLICA CON EL QUE INICIA UN PROYECTO DE LEY QUE FORTALECE Y MEJORA LA EFICACIA DE LA FIS \- DOE, fecha de acceso: abril 9, 2026, [https://www.doe.cl/alerta/25012024/202401253007](https://www.doe.cl/alerta/25012024/202401253007)  
17. Fiscalización Ley REP: SMA inicia los primeros procedimientos sancionatorios por incumplimientos de obligaciones – Superintendencia Del Medio Ambiente, fecha de acceso: abril 9, 2026, [https://portal.sma.gob.cl/index.php/fiscalizacion-ley-rep-sma-inicia-los-primeros-procedimientos-sancionatorios-por-incumplimientos-de-obligaciones/](https://portal.sma.gob.cl/index.php/fiscalizacion-ley-rep-sma-inicia-los-primeros-procedimientos-sancionatorios-por-incumplimientos-de-obligaciones/)  
18. Ley 20417 CREA EL MINISTERIO, EL SERVICIO DE EVALUACIÓN AMBIENTAL Y LA SUPERINTENDENCIA DEL MEDIO AMBIENTE \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/Navegar/imprimir?idNorma=1010459\&idParte=8848126](https://www.bcn.cl/leychile/Navegar/imprimir?idNorma=1010459&idParte=8848126)  
19. A propósito de Hidroaysén: notas sobre el \- fraccionamiento de proyectos en el Siste, fecha de acceso: abril 9, 2026, [https://derecho.udd.cl/actualidad-juridica/files/2021/01/AJ-Num-27-P279.pdf](https://derecho.udd.cl/actualidad-juridica/files/2021/01/AJ-Num-27-P279.pdf)  
20. Bases metodologicas para la determinacion de sanciones ambientales 2017-v2.0.pdf \- SMA, fecha de acceso: abril 9, 2026, [https://portal.sma.gob.cl/wp-content/uploads/download-manager-files/Bases%20metodologicas%20para%20la%20determinacion%20de%20sanciones%20ambientales%202017-v2.0.pdf](https://portal.sma.gob.cl/wp-content/uploads/download-manager-files/Bases%20metodologicas%20para%20la%20determinacion%20de%20sanciones%20ambientales%202017-v2.0.pdf)  
21. Entrada en operaciones de la Superintendencia del Medio Ambiente \- Carey Abogados, fecha de acceso: abril 9, 2026, [https://www.carey.cl/entrada-en-operaciones-de-la-superintendencia-del-medio-ambiente](https://www.carey.cl/entrada-en-operaciones-de-la-superintendencia-del-medio-ambiente)  
22. los sistemas de gestión de la ley nº 20.920 \- Revista Justicia Ambiental, fecha de acceso: abril 9, 2026, [http://www.revistajusticiaambiental.cl/wp-content/uploads/2022/12/LOS-SISTEMAS-DE-GESTION-DE-LA-LEY-No-20.920.pdf](http://www.revistajusticiaambiental.cl/wp-content/uploads/2022/12/LOS-SISTEMAS-DE-GESTION-DE-LA-LEY-No-20.920.pdf)  
23. Ley Chile \- Resolución 863 Exenta (04-oct-2021) M. del Medio Ambiente \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/navegar?idNorma=1166033](https://www.bcn.cl/leychile/navegar?idNorma=1166033)  
24. Ley 19.799: Sobre Documentos Electrónicos, Firma Electrónica y Servicios de Certificación de Dicha Firma. \- Regulación, fecha de acceso: abril 9, 2026, [https://digital.gob.cl/biblioteca/regulacion/ley-19799-sobre-documentos-electronicos-firma-electronica-y-servicios-de-certificacion-de-dicha-firma/](https://digital.gob.cl/biblioteca/regulacion/ley-19799-sobre-documentos-electronicos-firma-electronica-y-servicios-de-certificacion-de-dicha-firma/)  
25. Decreto 181 APRUEBA REGLAMENTO DE LA LEY 19.799 SOBRE DOCUMENTOS ELECTRONICOS, FIRMA ELECTRONICA Y LA CERTIFICACION DE DICHA FIRMA \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/Navegar?idNorma=201668](https://www.bcn.cl/leychile/Navegar?idNorma=201668)  
26. Preguntas Frecuentes \- Entidad Acreditadora, fecha de acceso: abril 9, 2026, [https://www.entidadacreditadora.gob.cl/preguntas-frecuentes/](https://www.entidadacreditadora.gob.cl/preguntas-frecuentes/)  
27. Reglamento de la Ley 19.799 sobre documentos electrónicos, firma electrónica y la certificación de dicha firma. \- ESign, fecha de acceso: abril 9, 2026, [https://www.esign-la.com/documentos/repositorios/Reglamento\_Ley\_19799.pdf](https://www.esign-la.com/documentos/repositorios/Reglamento_Ley_19799.pdf)  
28. Ley Chile \- dto 181 (17-ago-2002) M. de Economía; Fomento y Reconstruccion; Subsecretaria de Economia \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/navegar?idNorma=201668](https://www.bcn.cl/leychile/navegar?idNorma=201668)  
29. Ley 19799 \- Biblioteca del Congreso Nacional de Chile \- BCN, fecha de acceso: abril 9, 2026, [https://www.bcn.cl/leychile/navegar?idNorma=196640](https://www.bcn.cl/leychile/navegar?idNorma=196640)