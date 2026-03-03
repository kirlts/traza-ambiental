import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type AdminUserInput = {
  email: string;
  password: string;
  name?: string;
  rut?: string;
};

const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

const DEFAULT_ADMIN_ROLE_NAME = "Administrador";

// Control de inicialización
// Solo se ejecuta si INITIALIZE_DB_AND_SEED_DATA=true
// En producción: solo primer deploy o cuando se quiera reinicializar
// En desarrollo: siempre que se quiera resetear la BD

const rolesData = [
  {
    name: "Administrador",
    description:
      "Acceso completo al sistema y todas sus funcionalidades. Puede gestionar usuarios, roles y configuraciones del sistema.",
  },
  {
    name: "Generador",
    description:
      "Generador e Importador de neumáticos. Responsable de la gestión integral (operativa y de cumplimiento) de los NFU generados por sus productos según la Ley REP.",
  },
  // El rol Productor ha sido unificado con Generador
  /*
  {
    name: 'Productor',
    description: 'Responsable del cumplimiento de la Ley REP como introductor de neumáticos al mercado nacional. Gestiona metas de recolección y valorización, reportes de cumplimiento y coordinación con sistemas de gestión.',
    user: {
      email: 'productor@trazambiental.com',
      name: 'Carmen Silva - Productor REP',
      password: 'productor123'
    }
  },
  */
  {
    name: "Transportista",
    description:
      "Responsable del transporte y logística de los Neumáticos Fuera de Uso (NFU) desde los puntos de recolección hasta los gestores.",
  },
  {
    name: "Gestor",
    description:
      "Encargado de la valorización y procesamiento final de los NFU. Emite certificados digitales de valorización y gestiona el tratamiento de residuos.",
  },
  {
    name: "Especialista Sistema Gestión",
    description:
      "Especialista en Sistema de Gestión REP. Monitorea cumplimiento de metas, genera reportes y optimiza procesos según normativa del MMA.",
  },
  {
    name: "Sistema de Gestión",
    description:
      "Sistema de Gestión Colectivo o Individual responsable de cumplir metas anuales de recolección y valorización de NFU en nombre de productores.",
  },
  {
    name: "Operador",
    description:
      "Puede gestionar registros de neumáticos y realizar operaciones básicas del día a día en el sistema.",
  },
  {
    name: "Supervisor",
    description:
      "Puede supervisar operaciones, revisar registros y generar reportes de actividades del sistema.",
  },
  {
    name: "Auditor",
    description:
      "Acceso de solo lectura para auditoría y revisión de cumplimiento normativo. Puede visualizar datos sin realizar cambios.",
  },
];

const testUsers = [
  {
    roleName: "Administrador",
    email: "admin@trazambiental.com",
    name: "Administrador Sistema",
    password: "admin123",
  },
  {
    roleName: "Generador",
    email: "generador@trazambiental.com",
    name: "Juan Pérez - Generador/Productor",
    password: "generador123",
  },
  {
    roleName: "Transportista",
    email: "transportista@trazambiental.com",
    name: "María González - Transportista",
    password: "transportista123",
  },
  {
    roleName: "Gestor",
    email: "gestor@trazambiental.com",
    name: "Carlos Rodríguez - Gestor",
    password: "gestor123",
  },
  {
    roleName: "Especialista Sistema Gestión",
    email: "especialista@trazambiental.com",
    name: "Ana Martínez - Especialista",
    password: "especialista123",
  },
  {
    roleName: "Sistema de Gestión",
    email: "sistema@trazambiental.com",
    name: "Sistema Gestión Neumáticos S.A.",
    password: "sistema123",
  },
  {
    roleName: "Operador",
    email: "operador@trazambiental.com",
    name: "Pedro Sánchez - Operador",
    password: "operador123",
  },
  {
    roleName: "Supervisor",
    email: "supervisor@trazambiental.com",
    name: "Laura Torres - Supervisor",
    password: "supervisor123",
  },
  {
    roleName: "Auditor",
    email: "auditor@trazambiental.com",
    name: "Roberto Díaz - Auditor",
    password: "auditor123",
  },
];

function isStrongPassword(password: string) {
  return password.length >= PASSWORD_MIN_LENGTH && PASSWORD_REGEX.test(password);
}

function parseAdminUsers(): AdminUserInput[] {
  const jsonValue = process.env.ADMIN_USERS_JSON;
  if (jsonValue) {
    const parsed = JSON.parse(jsonValue);
    if (!Array.isArray(parsed)) {
      throw new Error("ADMIN_USERS_JSON debe ser un arreglo de usuarios.");
    }

    return parsed.map((user) => ({
      email: String(user.email || "").trim(),
      password: String(user.password || ""),
      name: user.name ? String(user.name) : undefined,
      rut: user.rut ? String(user.rut) : undefined,
    }));
  }

  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    return [
      {
        email,
        password,
        name: process.env.ADMIN_NAME?.trim(),
        rut: process.env.ADMIN_RUT?.trim(),
      },
    ];
  }

  return [];
}

/**
 * Seed de roles y usuarios básicos
 */
async function seed() {
  console.log("👥 Creando roles y usuarios básicos...");

  const createdUsers: Array<{
    name: string | null;
    email: string;
    role: string;
    kind: "admin" | "test";
  }> = [];
  const adminUsers = parseAdminUsers();
  const roleIdByName: Record<string, string> = {};

  for (const roleData of rolesData) {
    // Crear o actualizar rol
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        description: roleData.description,
        active: true,
      },
      create: {
        name: roleData.name,
        description: roleData.description,
        active: true,
      },
    });

    console.log(`✅ Rol: ${role.name}`);
    roleIdByName[role.name] = role.id;
  }

  if (adminUsers.length > 0) {
    const adminRoleId = roleIdByName[DEFAULT_ADMIN_ROLE_NAME];
    if (!adminRoleId) {
      throw new Error(
        `No se encontró el rol ${DEFAULT_ADMIN_ROLE_NAME} para asignar administradores.`
      );
    }

    for (const adminUser of adminUsers) {
      if (!adminUser.email || !adminUser.password) {
        throw new Error("Cada administrador debe incluir email y password.");
      }

      if (!isStrongPassword(adminUser.password)) {
        throw new Error(`La contraseña para ${adminUser.email} no cumple requisitos mínimos.`);
      }

      // Verificar si el admin ya existe
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminUser.email },
      });

      let user;
      if (existingAdmin) {
        // Si existe, NO actualizar contraseña (preservar cambios del usuario)
        user = await prisma.user.update({
          where: { email: adminUser.email },
          data: {
            // Solo actualizar campos no sensibles
            active: true,
            cuentaAprobada: true,
          },
        });
        console.log(`   ↳ Admin ya existe, preservando contraseña: ${adminUser.email}`);
      } else {
        // Si no existe, crear con la contraseña proporcionada
        const hashedPassword = await bcrypt.hash(adminUser.password, 12);
        user = await prisma.user.create({
          data: {
            email: adminUser.email,
            name: adminUser.name || "Administrador",
            password: hashedPassword,
            emailVerified: new Date(),
            active: true,
            cuentaAprobada: true,
            rut: adminUser.rut || undefined,
            roles: {
              create: {
                roleId: adminRoleId,
              },
            },
          },
        });
        console.log(`   ↳ Admin creado: ${adminUser.email}`);
      }

      const hasRole = await prisma.userRole.findFirst({
        where: {
          userId: user.id,
          roleId: adminRoleId,
        },
      });

      if (!hasRole) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: adminRoleId,
          },
        });
      }

      createdUsers.push({
        name: user.name,
        email: user.email,
        role: DEFAULT_ADMIN_ROLE_NAME,
        kind: "admin",
      });

      console.log(`   ↳ Admin creado/actualizado: ${adminUser.email}`);
    }
  }

  // Crear usuarios de prueba cuando se inicializa la BD
  // En Vercel, NODE_ENV siempre es "production" durante el build
  // Por eso usamos INITIALIZE_DB_AND_SEED_DATA para controlar esto
  const shouldCreateTestUsers = process.env.INITIALIZE_DB_AND_SEED_DATA === "true";

  if (shouldCreateTestUsers) {
    console.log("\n🧪 Creando usuarios de prueba para desarrollo...");

    for (const testUser of testUsers) {
      const roleId = roleIdByName[testUser.roleName];
      if (!roleId) {
        console.log(`⚠️  Rol no encontrado para usuario de prueba: ${testUser.roleName}`);
        continue;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      if (existingUser) {
        console.log(`   ↳ Usuario de prueba ya existe: ${testUser.email}`);
      } else {
        const hashedPassword = await bcrypt.hash(testUser.password, 12);

        const newUser = await prisma.user.create({
          data: {
            email: testUser.email,
            name: testUser.name,
            password: hashedPassword,
            emailVerified: new Date(),
            active: true,
            cuentaAprobada: true,
            roles: {
              create: {
                roleId,
              },
            },
          },
        });

        createdUsers.push({
          name: newUser.name,
          email: newUser.email,
          role: testUser.roleName,
          kind: "test",
        });

        console.log(`   ↳ Usuario de prueba creado: ${testUser.email}`);
      }
    }
  } else {
    console.log("\nℹ️  Usuarios de prueba omitidos (INITIALIZE_DB_AND_SEED_DATA=false).");
  }

  // Resumen de usuarios creados
  if (createdUsers.length > 0) {
    console.log("\n═══════════════════════════════════════════════════════════════");
    console.log("📝 USUARIOS CREADOS/ACTUALIZADOS");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("");

    createdUsers.forEach((user) => {
      console.log(`👤 ${user.name}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Email: ${user.email}`);
      console.log("");
    });

    console.log("═══════════════════════════════════════════════════════════════");
    if (createdUsers.some((user) => user.kind === "test")) {
      console.log("⚠️  IMPORTANTE: Usuarios de prueba");
      console.log("   No uses estas cuentas en producción.");
      console.log("═══════════════════════════════════════════════════════════════");
    } else {
      console.log("✅ Usuarios de administración listos.");
      console.log("═══════════════════════════════════════════════════════════════");
    }
  } else {
    console.log("✅ Todos los usuarios ya existían en el sistema");
  }

  console.log("✅ Roles y usuarios completados");
}

// Exportar función principal
export { seed as main };
export default seed;

// Ejecutar si se llama directamente
if (require.main === module) {
  seed()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en el seed de roles:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
