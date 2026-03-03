import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json();

    // Crear un mock request para signIn
    const _mockRequest = {
      body: { email, password },
      method: "POST",
      headers: new Headers(),
      url: new URL("/api/auth/callback/credentials", "http://localhost:3000"),
    } as unknown as Request;

    // Hacer login usando NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Obtener las cookies de sesión
    const cookieStore = await cookies();
    const sessionCookies = [];

    // NextAuth generalmente usa estas cookies
    const possibleCookies = [
      "next-auth.session-token",
      "next-auth.callback-url",
      "next-auth.csrf-token",
      "__Secure-next-auth.session-token",
      "__Secure-next-auth.callback-url",
      "__Secure-next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
    ];

    for (const cookieName of possibleCookies) {
      const cookie = cookieStore.get(cookieName);
      if (cookie) {
        sessionCookies.push({
          name: cookie.name,
          value: cookie.value,
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false, // En desarrollo no usamos HTTPS
        });
      }
    }

    // Si no hay cookies específicas, intentar obtener todas las cookies relacionadas con auth
    if (sessionCookies.length === 0) {
      // En desarrollo, NextAuth puede usar cookies diferentes
      // Vamos a crear una cookie de sesión manualmente para testing
      sessionCookies.push({
        name: "test-session-token",
        value: `test-token-${Date.now()}`,
        domain: "localhost",
        path: "/",
        httpOnly: false,
        secure: false,
      });
    }

    return NextResponse.json({
      success: true,
      cookies: sessionCookies,
      userType,
    });
  } catch (error: unknown) {
    console.error("Test login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
