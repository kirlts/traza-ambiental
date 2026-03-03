# 04 - QA, ESTRATEGIA DE REMEDIACIÓN Y GLOSARIO TÉCNICO COMPLETO

> **Documento de Transición Técnico - Equipo Interno Traza Ambiental**
> **Versión Refactorizada:** 1.0 (Febrero 2026)
> **Contexto Operativo (Documentación Activa):** Este documento está redactado intencionalmente como una guía rápida y ejecutiva para orientar al nuevo equipo de desarrollo. Su objetivo es la legibilidad y estructura. **NO busca reemplazar ni destruir** la granularidad algorítmica y técnica creada por el proveedor original (OpenTech). Para consultar tablas completas de QA, diccionarios exhaustivos o reglas matemáticas granulares, diríjase al repositorio pasivo en `docs/archive-opentech/`.

---

## 1. Informe Forense de Pruebas QA (Caso Helper Auth Playwright)

### Resumen del Falso Positivo "61 Errores E2E"

En la recta final, el panel de testing unitario y extremo a extremo (E2E) de OpenTech estalló reportando 61 caídas en el pipeline. Tras auditar su causa de raíz, el diagnóstico es un **Falso Positivo Estructural por Multiplicación de Entornos**.

- **El Bug Real:** `1` test fallido.
- **La Dispersión:** Corriendo en $5$ navegadores paralelos (Chromium, Firefox, WebKit, Mobile Safari, Mobile Chrome) sobre la batería de 12 tests, el pipeline multiplicó el error único artificialmente.
- **El Origen del Bug:** El helper asíncrono ordenó: `await expect(page.locator("text=Juan Pérez - Generador")).toBeVisible();`. Esto pasó ileso en Desktop. Pero el `Topbar` en Tailwind estaba escrito: `hidden md:flex`. En las suites de tests Móviles y Mobile Safari, el selector estaba colapsado visualmente. El asertion `toBeVisible` colapsó los hilos móviles.
- **Estado Técnico Heredado y Solución:** Ya existe una corrección transaccional (mitigada comprobando `expect(page).toHaveURL(/\dashboard/generador/)`). Sin embargo, queda anotada como "Deuda Técnica": **Necesidad de poblar `data-testid` universales de Cypress/Playwright** que independicen las pruebas E2E de las clases visuales anidadas (`hidden`).

---

## 2. Deuda Técnica a Nivel General (Next Steps)

- **Lazy Loading Abundante:** Faltan heurísticas en ciertas tablas grandes del Admin. Lighthouse puntúa >90 hoy, pero con miles de filas la DB puede encallar sin paginación cursor-based `Prisma.fetch`.
- **API `CKAN` / RETC:** Implementación futura faltante de subrutinas de ingesta de datos públicos provenientes de los CSV de Ventanilla Única gubernamental (Actualmente se cargan mecánicamente y no vía WebHooks u ODATA).

---

## 3. Glosario Enciclopédico y Regulatorio REP

### 3.1 Marco Jurídico ("REP")

- **Ley REP (20.920):** Ley de Responsabilidad Extendida del Productor. Pilar matriz del software. Obliga al introductor del residuo al ecosistema nacional a costear su retiro y reciclaje final.
- **D.S N°8 / 2023 MMA:** La brújula matemática del sistema. Dictamina el $kilaje$ exacto o su ratio porcentual (%) que debe recuperar cada neumático por aro/familia hacia el año en curso.
- **SINADER / Ventanilla Única:** El receptor gubernamental principal (Sistema Nacional de Declaración de Residuos). Archivos CSV/Excel exportados del dashboard "Sistema de Gestión" de nuestra plataforma van como ingesta oficial hacia el estado ($Extrapolable$ en la UI como "Reporte Oficial").
- **D.D.A.R:** Documento central de transporte de residuos. En Traza Ambiental se materializa dentro de la "Guía de Despacho Inmutable".

### 3.2 Terminología Operacional y de Módulos ("TrazAmbiental.cl")

- **Productor Prioritario:** Usuario Nivel `Generador`. Paga la fiesta logística (Subsidia los retiros).
- **Categoría A y Categoría B:** División del volumen. C.A. son neumáticos transformables en gránulos/caucho re-comerciable. C.B. es valorización térmica (Se quema para hornos cementeros controlados).
- **Estado de Tensión / Discrepancia:** Módulo del Gestor. Sucede internamente en el backend si Transportista reporta transportar 10.000 Kgs, pero la balanza calibrada oficial del Gestor (Receptor) acusa recibir 8.500 Kgs ($>5$%). El sistema abre un Ticket Paralizante que obliga justificación formal auditable en Base de Datos.
- **Folio CERT-YYYY-000N:** Máquina de estado logístico clausurada. Certificado hermético firmado asíncronamente en S3 (Alojado en Cloud de TrazaAmbiental), con código QR incrustado para escaneo "On The Go" de fiscalizadores en terreno si cruzan la patente del camión o el rut de la empresa a la que se le dio servicio.
