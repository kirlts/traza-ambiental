#!/bin/sh
/* eslint-disable */
set -e

echo "⏳ Esperando a PostgreSQL (El Healthcheck ya lo garantizó en Compose)..."
# Ejecutar deploy de Prisma. Este comando asume que el backend BD ya es íntegro, evitando wipes accidentales como 'db push' suele hacer.
echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

# Si tienes un archivo principal de semillas o datos maestros
echo "🌱 Ejecutando seed de base de datos si es necesario..."
npx tsx prisma/seed.ts || echo "Seed ignorado (datos ya existen o hubo error menor)"

echo "🚀 Iniciando Next.js Node Server..."
# Dependiendo de si es server.js o standalone, Node JS ejecuta la aplicación compilada de NextJS
node server.js
