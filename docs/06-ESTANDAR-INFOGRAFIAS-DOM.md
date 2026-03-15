# Estándar Kairós: Infografías y Visualización para Cliente Final (Dino)

Este documento establece la metodología y los principios rectores (axiomas) para la generación de recursos visuales, infografías y diagramas de negocio dirigidos a *Stakeholders* no técnicos. Se abandona la representación esquemática cruda en favor de la precisión estética "Pixel-Perfect".

## 1. El Problema de las Herramientas Declarativas
Los lenguajes de "Diagrama como Código" clásicos (Mermaid, PlantUML e incluso herramientas de nueva generación como D2) están diseñados para *ingenieros comunicándose con ingenieros*. Su motor de renderizado presenta bloqueos inherentes al tratar con flujos de texto reales de negocio:
-  Calculan mal los *bounding boxes* ("cajas de colisión").
-  Truncan textos forzando una sintaxis artificial.
-  Imposibilitan el alineamiento riguroso 1:1 con la marca visual del frontend.

## 2. La Solución: DOM-Rendering 

Para superar estas limitaciones, Traza Ambiental y el IDE Antigravity implementan una arquitectura de renderizado por HTML/DOM utilizando un agente **Headless (Puppeteer)**. 

El modelo mental cambia: **Ya no dibujas nodos y flechas, desarrollas Componentes Funcionales visuales** (similar a React o páginas Next.js estáticas) inyectados con Tailwind CSS, y tomas una "fotografía" de altísima resolución.

---

## 3. Axiomas de Diseño de Infografías (El Norte Visual)

### Axioma 1: El Diagrama es una Pre-Visualización del Frontend
Un diagrama para el negocio no es un boceto, es un vistazo real al ambiente de la aplicación. Todo diagrama **DEBE** importar explícitamente y heredar los mismos tokens (colores, sombras, radios) del `globals.css` base del proyecto. Las infografías no tienen una paleta "propia", tienen la paleta de **Traza Ambiental**.

### Axioma 2: Legibilidad Sobre Todas las Cosas (Auto-Ajuste)
Queda estrictamente prohibido entregar assets visuales con el texto truncado o cortado por falta de espacio en los nodos. Usando CSS (Flexbox / Grid), los nodos de texto en el script de renderizado crecen orgánicamente para ajustarse a su contenido de la misma forma que lo hacen en la web real. 

### Axioma 3: Erradicación de Abstracciones Genéricas
Se prohíbe la jerga que aleja al lector del producto real. En lugar de conceptos ambiguos y técnicos como "Universos" u "Objetos", los diagramas deben utilizar el lenguaje de dominio formal (Ej: "Perfil Generador", "Flujo de Logística Inversa", "Visión Panóptica").

### Axioma 4: Control Absoluto del Canvas y Retina Display
Los resultados deben ser de calidad óptima y aptos para presentaciones ejecutivas o impresión.
El script de renderizado (Puppeteer) debe operar bajo la configuración `deviceScaleFactor: 2` (Resolución Retina) y enmascarar dinámicamente el Viewport para ajustarse de forma precisa a las verdaderas dimensiones del contenedor (`#capture-zone`), erradicando bordes en blanco indeseados.

### Axioma 5: Automatización y Control de Versiones Constante
Las infografías no son JPEGs muertos guardados en un disco. Su motor fuente (.js y template .html) viven en el repositorio (`docs/diagramas-demo/render_diagrams.js`). Corregir una coma o un color en un flujograma es un proceso determinista de 1 segundo mediante comando.

---

## 4. Guía Táctica de Ejecución (Node + Puppeteer)

Para crear o modificar nuevas representaciones visuales:

1. **Editar el archivo motor:** Todas las configuraciones estructurales ocurren en `docs/diagramas-demo/render_diagrams.js`.
2. **Construir usando TailwindCSS:** Cada diagrama se inyecta como una porción de template String HTML usando las clases estándar de Tailwind.
3. **Controlar Iconografía:** Usa `<svg>` SVG tag en línea para iconografía vectorial escalable (Heroicons es un buen estándar por defecto para la inyección).
4. **Regenerar imagen sintética:**
   ```bash
   cd docs/diagramas-demo
   node render_diagrams.js
   ```
5. Esto pisará cualquier imagen anterior generada, sin pérdida de resolución.
