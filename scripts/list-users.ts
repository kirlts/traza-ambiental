/* eslint-disable */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { roles: { include: { role: true } } },
  });

  console.log("Usuarios encontrados:");
  users.forEach((u) => {
    const roles = u.roles.map((r: ReturnType<typeof JSON.parse>) => r.role.name).join(", ");
    console.log(`- ${u.name} (${u.email}): [${roles}]`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
