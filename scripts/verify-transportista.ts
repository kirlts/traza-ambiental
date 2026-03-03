/* eslint-disable */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Obtener email del argumento o usar uno por defecto
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Por favor proporciona el email del transportista como argumento.");
    console.error("Ejemplo: npx ts-node scripts/verify-transportista.ts transportista@ejemplo.com");
    process.exit(1);
  }

  console.log(`🔍 Buscando usuario con email: ${email}...`);

  // 2. Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });

  if (!user) {
    console.error("❌ Usuario no encontrado.");
    process.exit(1);
  }

  // 3. Verificar si es transportista
  const isTransportista = user.roles.some(
    (r: ReturnType<typeof JSON.parse>) => r.role.name.toLowerCase() === "transportista"
  );
  if (!isTransportista) {
    console.error("❌ El usuario no tiene el rol de 'transportista'.");
    process.exit(1);
  }

  console.log(`✅ Usuario encontrado: ${user.name} (${user.id})`);

  // 4. Crear o actualizar perfil legal
  const legalProfile = await prisma.carrierLegalProfile.upsert({
    where: { carrierId: user.id },
    create: {
      carrierId: user.id,
      status: "VERIFICADO",
      isRetcVerified: true,
      isResolutionVerified: true,
      isSinaderVerified: true,
      retcId: "VU-123456",
      sanitaryResolution: "RES-2025-001",
      baseOperations: "Santiago",
      verifiedAt: new Date(),
      verifiedBy: "system-script",
    },
    update: {
      status: "VERIFICADO",
      isRetcVerified: true,
      isResolutionVerified: true,
      isSinaderVerified: true,
      verifiedAt: new Date(),
      verifiedBy: "system-script",
    },
  });

  console.log("✅ Perfil legal actualizado a VERIFICADO:");
  console.log(legalProfile);

  // 5. También asegurar que el usuario esté verificado a nivel de cuenta
  await prisma.user.update({
    where: { id: user.id },
    data: {
      estadoVerificacion: "VERIFICADO",
      cuentaAprobada: true,
      fechaVerificacion: new Date(),
    },
  });

  console.log("✅ Cuenta de usuario marcada como VERIFICADO y APROBADA.");
}

main()
  .catch((e: ReturnType<typeof JSON.parse>) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
