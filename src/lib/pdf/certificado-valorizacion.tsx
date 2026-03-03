import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Colores del logo TrazAmbiental
const colors = {
  primary: "#459e60",
  primaryDark: "#204d3c",
  secondary: "#44a15d",
  accent: "#f5792a",
  dark: "#2b3b4c",
  light: "#f6fcf3",
  white: "#ffffff",
};

// Estilos profesionales para el certificado
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  // Header
  header: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: `3 solid ${colors.primary}`,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primaryDark,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 9,
    color: colors.dark,
    textAlign: "center",
    marginBottom: 2,
  },
  headerLine: {
    fontSize: 8,
    color: colors.dark,
    textAlign: "center",
    opacity: 0.8,
  },
  // Título principal
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginVertical: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  // Folio destacado
  folioBox: {
    backgroundColor: colors.light,
    border: `2 solid ${colors.primary}`,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  folioSection: {
    width: "48%",
  },
  folioLabel: {
    fontSize: 7,
    color: colors.dark,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  folioValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  // Datos destacados
  highlightBox: {
    backgroundColor: "#f0fdf4",
    border: `1 solid ${colors.secondary}`,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  highlightColumn: {
    width: "48%",
  },
  highlightLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 3,
  },
  highlightValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  // Secciones
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    backgroundColor: colors.primary,
    padding: 6,
    marginBottom: 6,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionContent: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  // Filas de información
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingVertical: 2,
  },
  infoLabel: {
    width: "30%",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.dark,
  },
  infoValue: {
    width: "70%",
    fontSize: 9,
    color: colors.dark,
  },
  // Badges para categorías
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  badge: {
    backgroundColor: colors.accent,
    color: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 8,
    fontWeight: "bold",
    marginRight: 4,
    marginBottom: 4,
  },
  // Tabla de tratamientos
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.accent,
    padding: 5,
    borderRadius: 3,
    marginBottom: 2,
  },
  tableHeaderText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: "bold",
  },
  tableHeaderCol1: {
    width: "30%",
  },
  tableHeaderCol2: {
    width: "50%",
  },
  tableHeaderCol3: {
    width: "20%",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottom: `1 solid #e5e7eb`,
    backgroundColor: colors.white,
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 4,
    borderBottom: `1 solid #e5e7eb`,
    backgroundColor: "#fafafa",
  },
  tableCell: {
    fontSize: 7,
    color: colors.dark,
  },
  tableCol1: {
    width: "30%",
  },
  tableCol2: {
    width: "50%",
  },
  tableCol3: {
    width: "20%",
    textAlign: "right",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 8,
    borderTop: `2 solid ${colors.primary}`,
  },
  footerText: {
    fontSize: 6.5,
    color: colors.dark,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 3,
    lineHeight: 1.3,
  },
  footerUrl: {
    fontSize: 6.5,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 2,
  },
});

export interface CertificadoData {
  folio: string;
  fechaEmision: Date;
  pesoValorizado: number;
  cantidadUnidades: number;
  categorias: string[];
  tratamientos: Array<{
    tipo: string;
    descripcion?: string;
    porcentaje?: number;
  }>;
  generador: {
    name: string;
    rut: string;
    direccion?: string;
  };
  gestor?: {
    name: string;
    rut: string;
    autorizacion?: string;
  };
}

const CertificadoPDF = ({ data }: { data: CertificadoData }) => {
  const fechaFormateada = new Date(data.fechaEmision).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>TRAZAMBIENTAL</Text>
          <Text style={styles.headerSubtitle}>Sistema Nacional de Gestión de Neumáticos</Text>
          <Text style={styles.headerLine}>Ley REP - Responsabilidad Extendida del Productor</Text>
        </View>

        {/* Título Principal */}
        <Text style={styles.mainTitle}>Certificado de Valorización</Text>

        {/* Folio Box */}
        <View style={styles.folioBox}>
          <View style={styles.folioSection}>
            <Text style={styles.folioLabel}>NÚMERO DE CERTIFICADO</Text>
            <Text style={styles.folioValue}>{data.folio}</Text>
          </View>
          <View style={styles.folioSection}>
            <Text style={styles.folioLabel}>FECHA DE EMISIÓN</Text>
            <Text style={styles.folioValue}>{fechaFormateada}</Text>
          </View>
        </View>

        {/* Datos Destacados */}
        <View style={styles.highlightBox}>
          <View style={styles.highlightColumn}>
            <Text style={styles.highlightLabel}>Peso Total Valorizado</Text>
            <Text style={styles.highlightValue}>
              {data.pesoValorizado.toLocaleString("es-CL")} kg
            </Text>
          </View>
          <View style={styles.highlightColumn}>
            <Text style={styles.highlightLabel}>Unidades Valorizadas</Text>
            <Text style={styles.highlightValue}>
              {data.cantidadUnidades.toLocaleString("es-CL")}
            </Text>
          </View>
        </View>

        {/* Información del Generador */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Información del Generador</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Razón Social:</Text>
              <Text style={styles.infoValue}>{data.generador.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>RUT:</Text>
              <Text style={styles.infoValue}>{data.generador.rut}</Text>
            </View>
            {data.generador.direccion && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dirección:</Text>
                <Text style={styles.infoValue}>{data.generador.direccion}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías de Neumáticos</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.badgeContainer}>
              {data.categorias.map((cat, idx) => (
                <Text key={idx} style={styles.badge}>
                  {cat}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Tratamientos */}
        {data.tratamientos && data.tratamientos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tratamientos de Valorización Aplicados</Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.tableHeaderCol1]}>Tipo</Text>
                <Text style={[styles.tableHeaderText, styles.tableHeaderCol2]}>Descripción</Text>
                <Text style={[styles.tableHeaderText, styles.tableHeaderCol3]}>Porcentaje</Text>
              </View>
              {data.tratamientos.map((trat, idx) => (
                <View key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tableCell, styles.tableCol1]}>{trat.tipo}</Text>
                  <Text style={[styles.tableCell, styles.tableCol2]}>
                    {trat.descripcion || "Tratamiento de valorización"}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCol3]}>
                    {trat.porcentaje ? `${trat.porcentaje}%` : "N/A"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Gestor Autorizado */}
        {data.gestor && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gestor Autorizado</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Razón Social:</Text>
                <Text style={styles.infoValue}>{data.gestor.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>RUT:</Text>
                <Text style={styles.infoValue}>{data.gestor.rut}</Text>
              </View>
              {data.gestor.autorizacion && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Autorización:</Text>
                  <Text style={styles.infoValue}>{data.gestor.autorizacion}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Este certificado acredita que los neumáticos detallados fueron valorizados de acuerdo
            con el Decreto Supremo N°8 de Neumáticos, bajo el marco de la Ley REP (Ley 20.920).
          </Text>
          <Text style={styles.footerUrl}>
            Verificación Digital: {process.env.NEXTAUTH_URL || "https://traza-ambiental.com"}
            /verificar/{data.folio}
          </Text>
          <Text style={styles.footerText}>
            Documento generado electrónicamente - TrazAmbiental © {new Date().getFullYear()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CertificadoPDF;
