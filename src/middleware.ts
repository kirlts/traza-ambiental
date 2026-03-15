import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/login", "/register", "/registro-generador", "/test-hu009", "/demo"];
  const isPublicRoute = publicRoutes.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // Permitir acceso a rutas de API
  if (nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar sesión usando getToken
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;

  // Si no está logueado y no es ruta pública, redirigir a login
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const roles = (token?.roles as string[]) || [];

  // 1. Redirección raíz /dashboard
  if (nextUrl.pathname === "/dashboard") {
    if (roles.includes("Administrador") || token?.id === "1") {
      return NextResponse.redirect(new URL("/dashboard/admin", nextUrl));
    }
    if (roles.includes("Productor") || roles.includes("Generador")) {
      return NextResponse.redirect(new URL("/dashboard/generador", nextUrl));
    }
    if (roles.includes("Sistema de Gestión")) {
      return NextResponse.redirect(new URL("/dashboard/sistema-gestion", nextUrl));
    }
    if (roles.includes("Transportista")) {
      return NextResponse.redirect(new URL("/dashboard/transportista", nextUrl));
    }
    if (roles.includes("Gestor")) {
      return NextResponse.redirect(new URL("/dashboard/gestor", nextUrl));
    }
    if (roles.includes("Especialista Sistema Gestión")) {
      return NextResponse.redirect(new URL("/dashboard/especialista", nextUrl));
    }
  }

  // 2. Protección estricta de sub-rutas por rol
  const roleProtectedPaths = [
    { prefix: "/dashboard/admin", allowed: ["Administrador"] },
    { prefix: "/dashboard/generador", allowed: ["Generador", "Productor"] },
    {
      prefix: "/dashboard/sistema-gestion",
      allowed: ["Sistema de Gestión", "Especialista Sistema Gestión"],
    },
    { prefix: "/dashboard/transportista", allowed: ["Transportista"] },
    { prefix: "/dashboard/gestor", allowed: ["Gestor"] },
    { prefix: "/dashboard/especialista", allowed: ["Especialista Sistema Gestión"] },
  ];

  for (const { prefix, allowed } of roleProtectedPaths) {
    if (nextUrl.pathname.startsWith(prefix)) {
      const hasAccess =
        allowed.some((role) => roles.includes(role)) ||
        roles.includes("Administrador") ||
        token?.id === "1";
      if (!hasAccess) {
        // Redirigir a su propio dashboard si intenta entrar a otro
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};
