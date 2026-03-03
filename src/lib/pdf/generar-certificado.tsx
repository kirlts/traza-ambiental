import { renderToBuffer } from "@react-pdf/renderer";
import CertificadoPDF, { CertificadoData } from "./certificado-valorizacion";

export async function generarCertificadoPDF(data: CertificadoData): Promise<Buffer> {
  const buffer = await renderToBuffer(<CertificadoPDF data={data} />);
  return buffer;
}
