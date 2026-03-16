# syntax=docker/dockerfile:1

# --------- 1. Etapa Base (OS + Chromium) ---------
FROM node:20-bookworm-slim AS base
WORKDIR /app
# Instalar chromium y dependencias aquí ASEGURA QUE SE CACHEA PARA SIEMPRE
RUN apt-get update && apt-get install -y \
    chromium libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
    && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# --------- 2. Etapa de Dependencias ---------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
# Uso de BuildKit Cache
RUN --mount=type=cache,target=/root/.npm npm ci

# --------- 3. Etapa de Compilación ---------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --------- 4. Etapa de Producción (Runner Seguro) ---------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Seguridad: Usuario non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Herramientas globales para que el Docker Entrypoint pueda ejecutar las migraciones y seed
RUN npm install -g prisma@6.18.0 tsx && npm install bcryptjs @types/bcryptjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY scripts/docker-entrypoint.sh ./scripts/docker-entrypoint.sh

RUN chmod +x ./scripts/docker-entrypoint.sh
USER nextjs

EXPOSE 3000
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
