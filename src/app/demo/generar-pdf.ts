"use client";

import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PDFData {
  certificadoId: string;
  generador: { nombre: string; rut: string };
  transportista: { nombre: string; patente: string };
  gestor: { nombre: string; planta: string };
  tonelaje: number;
  fechaEmision: string;
}

export function generateCertificadoPDF(data: PDFData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, "F");

  // Logo Placeholder / Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("TRAZA AMBIENTAL", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Certificado Legal de Valorización Ley REP", pageWidth - 80, 25);

  // Cert ID
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`CERTIFICADO Nº: ${data.certificadoId}`, 20, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(
    `Fecha de Emisión: ${format(new Date(data.fechaEmision), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })} hrs`,
    20,
    62
  );

  // Line separator
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(20, 68, pageWidth - 20, 68);

  // Content
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("I. DECLARACIÓN DE ORIGEN", 20, 80);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Razón Social Productor: ${data.generador.nombre}`, 20, 90);
  doc.text(`RUT: ${data.generador.rut}`, 20, 96);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("II. DETALLE DEL RESIDUO (NFU)", 20, 110);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Tipo de Residuo: Neumáticos Fuera de Uso (Categoría A/B)`, 20, 120);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Valorizado: ${data.tonelaje} Toneladas Métricas`, 20, 126);
  doc.setFont("helvetica", "normal");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("III. TRAZABILIDAD LOGÍSTICA", 20, 140);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Transportista Autorizado: ${data.transportista.nombre}`, 20, 150);
  doc.text(`Patente PPU: ${data.transportista.patente}`, 20, 156);
  doc.text(`Gestor Destino (Planta): ${data.gestor.nombre} - ${data.gestor.planta}`, 20, 162);

  // Footer / Seals
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(20, 180, pageWidth - 40, 40, "F");

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  const footerText = `El presente documento ha sido emitido electrónicamente por el autómata del sistema Traza Ambiental.
El tonelaje estipulado ha sido verificado mediante romana calibrada y se encuentra legalmente amparado
por la Ley 20.920 de Responsabilidad Extendida del Productor.`;
  doc.text(footerText, 25, 190);

  // Fake Hash/QR representation
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text(`HASH SHA-256: 0x${Math.random().toString(16).substring(2, 15)}...`, 25, 212);

  // Save the PDF
  doc.save(`${data.certificadoId}.pdf`);
}
