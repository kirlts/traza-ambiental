export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  categoria: string;
  medidas?: string;
  _count?: {
    inventarios: number;
  };
}

export interface MetaCumplimiento {
  id: string;
  anio: number;
  metaRecoleccion: number;
  metaValorizacion: number;
  [key: string]: unknown;
}

export interface ReporteAnual {
  id: string;
  folio: string;
  codigoVerificacion: string;
  anio: number;
  fechaGeneracion: Date;
  status: string;
  detalles?: Record<string, unknown>;
}

export interface LoteTratamiento {
  id: string;
  folio: string;
  pesoReal?: number;
  pesoRomana?: number;
  categoriaA_cantidad: number;
  categoriaB_cantidad: number;
  generador: {
    name: string;
  };
}
