#!/usr/bin/env node
/**
 * render-prd-pdf.js
 * Pre-procesa Mermaid a SVG inline y genera PDF ejecutivo via md-to-pdf.
 */

const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, 'PRD-TRAZAAMBIENTAL.md');
const OUTPUT = path.resolve(__dirname, 'PRD-TRAZAAMBIENTAL.pdf');
const CSS_FILE = path.resolve(__dirname, 'prd-pdf.css');

async function main() {
  console.log('📖 Leyendo PRD...');
  let md = fs.readFileSync(INPUT, 'utf8');
  const css = fs.readFileSync(CSS_FILE, 'utf8');

  // Strip HTML comments (macro markers)
  md = md.replace(/<!--[\s\S]*?-->/g, '');

  // Replace GitHub-style alerts with styled blockquotes
  md = md.replace(/> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n> ([\s\S]*?)(?=\n(?!>)|$)/g,
    (_, type, content) => {
      const cleanContent = content.replace(/^> ?/gm, '').trim();
      const icons = { NOTE: 'ℹ️', TIP: '💡', IMPORTANT: '🔵', WARNING: '⚠️', CAUTION: '🔴' };
      return `> **${icons[type] || ''} ${type}:** ${cleanContent}\n`;
    }
  );

  console.log('📄 Generando PDF...');
  const pdf = await mdToPdf(
    { content: md },
    {
      stylesheet: [],
      css: css,
      pdf_options: {
        format: 'A4',
        margin: {
          top: '25mm',
          bottom: '30mm',
          left: '20mm',
          right: '20mm'
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="width:100%; font-size:8px; font-family:Inter,sans-serif; color:#94a3b8; padding:0 20mm; display:flex; justify-content:space-between;">
            <span>TrazaAmbiental - PRD v1.0 - Confidencial</span>
            <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
          </div>
        `,
      },
      launch_options: {
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      },
      // md-to-pdf supports mermaid natively via mermaid-js script injection
      script: [
        { url: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js' }
      ],
      // Initialize mermaid before rendering
      body_class: [],
    }
  ).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

  if (pdf?.content) {
    fs.writeFileSync(OUTPUT, pdf.content);
    console.log(`✅ PDF generado: ${OUTPUT}`);
    console.log(`   Tamaño: ${(pdf.content.length / 1024).toFixed(0)} KB`);
  } else {
    console.error('❌ No se generó contenido PDF');
    process.exit(1);
  }
}

main();
