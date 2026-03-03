import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    // Verificar conexión y base de datos actual
    const dbName = await prisma.$queryRaw`SELECT current_database()`;
    const connectionInfo = await prisma.$queryRaw`SELECT inet_server_addr(), inet_server_port()`;

    // Verificar estructura de la tabla users
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `;

    return NextResponse.json({
      status: "ok",
      database: dbName,
      connection: connectionInfo,
      columns: columns,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
        stack: error instanceof Error ? (error as ReturnType<typeof JSON.parse>).stack : undefined,
      },
      { status: 500 }
    );
  }
}
