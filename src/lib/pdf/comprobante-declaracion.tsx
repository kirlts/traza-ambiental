import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #16a34a",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 3,
  },
  folioBox: {
    backgroundColor: "#f0fdf4",
    border: "1 solid #16a34a",
    padding: 10,
    marginVertical: 15,
    borderRadius: 4,
  },
  folioText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#166534",
    textAlign: "center",
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    width: "40%",
    fontWeight: "bold",
    color: "#4b5563",
  },
  infoValue: {
    width: "60%",
    color: "#1f2937",
  },
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    padding: 8,
    color: "#ffffff",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    padding: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottom: "1 solid #e5e7eb",
    padding: 8,
  },
  tableCol1: {
    width: "15%",
  },
  tableCol2: {
    width: "45%",
  },
  tableCol3: {
    width: "20%",
  },
  tableCol4: {
    width: "20%",
  },
  totalsBox: {
    backgroundColor: "#dbeafe",
    border: "1 solid #3b82f6",
    padding: 10,
    marginVertical: 10,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalsLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  totalsValue: {
    fontSize: 11,
    color: "#1e40af",
  },
  metasBox: {
    backgroundColor: "#fef3c7",
    border: "1 solid #f59e0b",
    padding: 10,
    marginVertical: 10,
  },
  metasTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 8,
    textAlign: "center",
  },
  metasRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  metasLabel: {
    fontSize: 10,
    color: "#92400e",
  },
  metasValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#b45309",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1 solid #e5e7eb",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 3,
  },
  legalText: {
    fontSize: 7,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 5,
  },
});

export interface CategoriaDeclarada {
  tipo: string;
  nombre: string;
  descripcion: string | null;
  cantidadUnidades: number;
  pesoToneladas: number;
}

export interface DeclaracionData {
  folio: string;
  anio: number;
  fechaDeclaracion: Date;
  totalUnidades: number;
  totalToneladas: number;
  categorias: CategoriaDeclarada[];
  productor: {
    name: string;
    email: string;
  };
  metas?: {
    anioMeta: number;
    metaRecoleccion: number;
    metaValorizacion: number;
    porcentajeRecoleccion: number;
    porcentajeValorizacion: number;
  };
}

export default function ComprobantePDF({ data }: { data: DeclaracionData }) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>COMPROBANTE DE DECLARACIÓN ANUAL</Text>
          <Text style={styles.subtitle}>Sistema de Gestión de Neumáticos - Ley REP N° 20.920</Text>
          <Text style={styles.subtitle}>TrazAmbiental - Plataforma de Trazabilidad</Text>
        </View>

        {/* Folio */}
        <View style={styles.folioBox}>
          <Text style={styles.folioText}>FOLIO: {data.folio}</Text>
        </View>

        {/* Información del Productor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL PRODUCTOR</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre/Razón Social:</Text>
            <Text style={styles.infoValue}>{data.productor.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{data.productor.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Año Declarado:</Text>
            <Text style={styles.infoValue}>{data.anio}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de Declaración:</Text>
            <Text style={styles.infoValue}>{formatDate(data.fechaDeclaracion)}</Text>
          </View>
        </View>

        {/* Tabla de Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLE DE NEUMÁTICOS INTRODUCIDOS AL MERCADO</Text>

          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableCol1}>Tipo</Text>
              <Text style={styles.tableCol2}>Categoría</Text>
              <Text style={styles.tableCol3}>Unidades</Text>
              <Text style={styles.tableCol4}>Toneladas</Text>
            </View>

            {/* Rows */}
            {data.categorias.map((cat, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={styles.tableCol1}>{cat.tipo}</Text>
                <Text style={styles.tableCol2}>{cat.nombre}</Text>
                <Text style={styles.tableCol3}>{cat.cantidadUnidades.toLocaleString("es-CL")}</Text>
                <Text style={styles.tableCol4}>{formatNumber(cat.pesoToneladas)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totales */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>TOTAL UNIDADES DECLARADAS:</Text>
            <Text style={styles.totalsValue}>
              {data.totalUnidades.toLocaleString("es-CL")} unidades
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>TOTAL TONELADAS DECLARADAS:</Text>
            <Text style={styles.totalsValue}>{formatNumber(data.totalToneladas)} toneladas</Text>
          </View>
        </View>

        {/* Metas Calculadas */}
        {data.metas && (
          <View style={styles.metasBox}>
            <Text style={styles.metasTitle}>
              METAS DE CUMPLIMIENTO REP GENERADAS PARA EL AÑO {data.metas.anioMeta}
            </Text>
            <View style={styles.metasRow}>
              <Text style={styles.metasLabel}>
                Meta de Recolección ({data.metas.porcentajeRecoleccion}%):
              </Text>
              <Text style={styles.metasValue}>{formatNumber(data.metas.metaRecoleccion)} ton</Text>
            </View>
            <View style={styles.metasRow}>
              <Text style={styles.metasLabel}>
                Meta de Valorización ({data.metas.porcentajeValorizacion}%):
              </Text>
              <Text style={styles.metasValue}>{formatNumber(data.metas.metaValorizacion)} ton</Text>
            </View>
          </View>
        )}

        {/* Información Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN IMPORTANTE</Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 3 }}>
            • Esta declaración corresponde a los neumáticos introducidos al mercado nacional durante
            el año {data.anio}.
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 3 }}>
            • Las metas de recolección y valorización deberán cumplirse durante el año{" "}
            {data.metas?.anioMeta || data.anio + 1}.
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 3 }}>
            • Este comprobante tiene validez legal según lo establecido en la Ley REP N° 20.920 y el
            Decreto Supremo N° 8.
          </Text>
          <Text style={{ fontSize: 9, color: "#374151" }}>
            • Para consultas o modificaciones, contacte a la autoridad competente o a través de la
            plataforma TrazAmbiental.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Documento generado electrónicamente por TrazAmbiental el {formatDate(new Date())}
          </Text>
          <Text style={styles.footerText}>
            Folio: {data.folio} | Año Declarado: {data.anio}
          </Text>
          <Text style={styles.legalText}>
            Este documento es válido sin firma autógrafa de conformidad con la Ley N° 19.799 sobre
            Documentos Electrónicos, Firma Electrónica y Servicios de Certificación.
          </Text>
          <Text style={styles.legalText}>
            TrazAmbiental - Sistema de Gestión de Residuos de Neumáticos | www.trazambiental.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
