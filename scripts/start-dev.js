#!/usr/bin/env node
/* eslint-disable */

/**
 * Script para iniciar el servidor de desarrollo y abrir el navegador automáticamente
 * Funciona en Windows, Linux y macOS
 */

const { spawn, execSync } = require("child_process");
const os = require("os");
const { checkIfConfigured, getHostsFilePath, DOMAIN } = require("./setup-local-domain.js");
const { syncPrisma } = require("./sync-prisma.js");

const PORT = process.env.PORT || 80;
const URL = `http://${DOMAIN}${PORT === 80 ? "" : ":" + PORT}`;

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function openBrowser(url) {
  const platform = os.platform();
  let command;

  try {
    if (platform === "win32") {
      // Windows - intentar con Chrome, luego Edge, luego navegador por defecto
      try {
        execSync(`start chrome "${url}"`, { stdio: "ignore" });
      } catch {
        try {
          execSync(`start msedge "${url}"`, { stdio: "ignore" });
        } catch {
          execSync(`start "" "${url}"`, { stdio: "ignore" });
        }
      }
    } else if (platform === "darwin") {
      // macOS - intentar con Chrome, luego Safari, luego navegador por defecto
      try {
        execSync(`open -a "Google Chrome" "${url}"`, { stdio: "ignore" });
      } catch {
        try {
          execSync(`open -a "Safari" "${url}"`, { stdio: "ignore" });
        } catch {
          execSync(`open "${url}"`, { stdio: "ignore" });
        }
      }
    } else {
      // Linux - intentar con Chrome, luego Firefox, luego navegador por defecto
      try {
        execSync(
          `google-chrome "${url}" 2>/dev/null || chromium "${url}" 2>/dev/null || xdg-open "${url}"`,
          {
            stdio: "ignore",
            shell: true,
          }
        );
      } catch {
        try {
          execSync(`firefox "${url}"`, { stdio: "ignore" });
        } catch {
          execSync(`xdg-open "${url}"`, { stdio: "ignore" });
        }
      }
    }

    log(`\n✅ Navegador abierto en: ${url}`, "green");
    return true;
  } catch (error) {
    log(`\n⚠️  No se pudo abrir el navegador automáticamente`, "yellow");
    log(`   Abre manualmente: ${url}\n`, "blue");
    return false;
  }
}

function waitForServer(url, maxAttempts = 30) {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = setInterval(() => {
      try {
        const http = require("http");
        const urlParsed = new URL(url);

        const req = http.get(
          {
            hostname: urlParsed.hostname,
            port: urlParsed.port,
            path: "/",
            timeout: 1000,
          },
          (res) => {
            clearInterval(check);
            resolve(true);
          }
        );

        req.on("error", () => {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(check);
            resolve(false);
          }
        });
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(check);
          resolve(false);
        }
      }
    }, 1000);
  });
}

async function main() {
  log("\n╔═══════════════════════════════════════════════════════════╗", "cyan");
  log("║  🚀 Iniciando Servidor de Desarrollo                    ║", "cyan");
  log("╚═══════════════════════════════════════════════════════════╝\n", "cyan");

  // Sincronizar base de datos con Prisma
  await syncPrisma();

  // Verificar si el dominio está configurado
  const hostsPath = getHostsFilePath();
  const isConfigured = checkIfConfigured(hostsPath);

  if (!isConfigured) {
    log("⚠️  El dominio local no está configurado.", "yellow");
    log("   Ejecutando configuración automática...\n", "yellow");

    try {
      // Ejecutar el script de setup como proceso separado
      const isWindows = os.platform() === "win32";
      const nodeCommand = isWindows ? "node.exe" : "node";

      const setupProcess = spawn(nodeCommand, ["scripts/setup-local-domain.js"], {
        stdio: "inherit",
        shell: true,
      });

      // Esperar a que termine la configuración
      const setupExitCode = await new Promise((resolve) => {
        setupProcess.on("exit", (code) => resolve(code));
        setupProcess.on("error", (error) => {
          log(`❌ Error al ejecutar la configuración: ${error.message}`, "red");
          resolve(1);
        });
      });

      if (setupExitCode !== 0) {
        log("\n❌ No se pudo completar la configuración automática", "red");
        log(
          "   Por favor, configura manualmente el archivo hosts siguiendo las instrucciones anteriores.\n",
          "yellow"
        );
        process.exit(1);
      }

      log("\n✅ Configuración completada. Continuando con el inicio del servidor...\n", "green");

      // Pequeña pausa para asegurar que los cambios se aplicaron
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      log(`\n❌ Error inesperado: ${error.message}`, "red");
      log(
        "   Verifica la documentación en: docs/guides/CONFIGURACION-DOMINIO-LOCAL.md\n",
        "yellow"
      );
      process.exit(1);
    }
  }

  log("🔧 Iniciando Next.js con Turbopack...", "blue");
  log(`🌐 URL: ${URL}\n`, "blue");

  // Determinar el comando según el sistema operativo
  const isWindows = os.platform() === "win32";

  // Para puerto 80 necesitamos permisos de administrador
  if (PORT === 80 || PORT < 1024) {
    log("🔒 Nota: El puerto 80 requiere permisos de administrador", "yellow");

    if (!isWindows && process.getuid && process.getuid() !== 0) {
      log("⚠️  Asegúrate de ejecutar con sudo: sudo npm run dev", "yellow");
    }
  }

  // Iniciar el servidor de desarrollo directamente con next
  const nextCommand = isWindows ? "next.cmd" : "next";
  const devServer = spawn(
    nextCommand,
    ["dev", "--turbopack", "-p", PORT.toString(), "--hostname", DOMAIN],
    {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        PORT: PORT.toString(),
      },
    }
  );

  // Esperar a que el servidor esté listo y abrir el navegador
  log("⏳ Esperando a que el servidor esté listo...\n", "yellow");

  setTimeout(async () => {
    const serverReady = await waitForServer(URL);

    if (serverReady) {
      log("✅ Servidor listo!\n", "green");
      openBrowser(URL);

      const paddedURL = URL.padEnd(40);
      log("\n╔═══════════════════════════════════════════════════════════╗", "green");
      log("║  ✨ ¡Servidor iniciado exitosamente!                   ║", "green");
      log("║                                                            ║", "green");
      log(`║  🌐 Aplicación: ${paddedURL} ║`, "green");
      log("║  🔥 Turbopack activado                                  ║", "green");
      log("║  ⚡ Puerto 80 (sin puerto en la URL)                   ║", "green");
      log("║                                                            ║", "green");
      log("║  Presiona Ctrl+C para detener el servidor                ║", "green");
      log("╚═══════════════════════════════════════════════════════════╝\n", "green");
    } else {
      log("⚠️  El servidor tardó más de lo esperado en iniciar", "yellow");
      log(`   Intenta abrir manualmente: ${URL}\n`, "blue");
    }
  }, 3000);

  // Manejar cierre graceful
  const cleanup = () => {
    log("\n\n🛑 Deteniendo servidor...", "yellow");
    devServer.kill();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  // Manejar errores del servidor
  devServer.on("error", (error) => {
    log(`\n❌ Error al iniciar el servidor: ${error.message}`, "red");
    process.exit(1);
  });

  devServer.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      log(`\n❌ El servidor se cerró con código: ${code}`, "red");
      process.exit(code);
    }
  });
}

main();
