import { NextResponse } from "next/server";

export async function GET() {
  // Devolver una respuesta simple para evitar el error 500
  return NextResponse.json(
    { message: "Favicon handled" },
    {
      status: 200,
      headers: {
        "Content-Type": "image/x-icon",
        "Cache-Control": "public, max-age=31536000",
      },
    }
  );
}
