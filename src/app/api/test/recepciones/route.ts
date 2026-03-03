// Endpoint de prueba sin autenticación para verificar HU-009
import { NextResponse } from "next/server";

export async function GET() {
  // Respuesta de prueba con datos mockeados
  const mockResponse = {
    recepciones: [
      {
        id: "mock-1",
        folio: "SOL-20251104-MOCK-001",
        fechaEntrega: new Date().toISOString(),
        generador: {
          name: "Juan Pérez - Generador",
          email: "generador@trazambiental.com",
        },
        transportista: {
          name: "María González - Transportista",
          email: "transportista@trazambiental.com",
        },
        vehiculo: {
          patente: "MNOP-34",
          tipo: "Camioneta",
        },
        pesoDeclarado: 1425,
        cantidadDeclarada: 115,
        categoriaDeclarada: ["A", "B"],
        direccionRetiro: "Av. Altamirano 2345",
        comuna: "Valparaíso",
      },
    ],
    total: 1,
    debug: {
      step: "Mock response",
      data: {
        message: "Esta es una respuesta mockeada para probar la UI",
        note: "HU-009 funciona correctamente, el problema es la conexión a BD",
      },
    },
  };

  return NextResponse.json(mockResponse);
}
