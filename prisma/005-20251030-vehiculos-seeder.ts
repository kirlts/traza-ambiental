import { PrismaClient } from "@prisma/client";

const _unused = new PrismaClient();

async function main() {
  console.log("⚠️  Seed de vehículos omitido - Modelo Vehiculo no existe en schema actual");
  console.log("ℹ️  El campo vehiculoId en SolicitudRetiro está disponible para uso manual");
}

export default main;
