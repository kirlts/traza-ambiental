import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Importación dinámica de módulos pesados solo cuando se necesitan
          const { prisma } = await import("./prisma");
          const bcrypt = await import("bcryptjs");

          // Buscar usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
            include: {
              roles: {
                include: {
                  role: {
                    select: { name: true },
                  },
                },
              },
            },
          });

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          const roles = user.roles.map((ur: ReturnType<typeof JSON.parse>) => ur.role.name);
          const primaryRole = roles[0] || "USER"; // Rol por defecto

          // Asegurar que el rol sea ADMINISTRADOR (mayúsculas) para la comparación estricta
          const normalizedRole = primaryRole === "Administrador" ? "ADMINISTRADOR" : primaryRole;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            roles: roles,
            role: normalizedRole, // Mapeo crítico para compatibilidad
          };
        } catch (error: unknown) {
          console.error("[AUTH] Error en autorización:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as string[]) || [];
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Forzar redirección a localhost en desarrollo
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return url;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
