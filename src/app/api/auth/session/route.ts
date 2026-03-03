import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: "No hay sesión activa",
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles || [],
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error al verificar sesión",
        details:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
