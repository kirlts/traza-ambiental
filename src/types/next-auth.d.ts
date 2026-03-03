import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[];
      role?: string;
      rut?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
    role?: string;
    rut?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles?: string[];
    role?: string;
    rut?: string;
  }
}
