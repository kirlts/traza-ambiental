import { renderToBuffer } from "@react-pdf/renderer";
import ComprobantePDF, { DeclaracionData } from "./comprobante-declaracion";

export async function generarComprobantePDF(data: DeclaracionData): Promise<Buffer> {
  const buffer = await renderToBuffer(<ComprobantePDF data={data} />);
  return buffer;
}
