#!/usr/bin/env node
/* eslint-disable */

/**
 * Script multiplataforma para configurar el dominio local traza-ambiental.local
 * Funciona en Windows, Linux y macOS
 *
 * Uso: node scripts/setup-local-domain.js
 */

const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");

const DOMAIN = "traza-ambiental.local";
const HOST_ENTRY = `127.0.0.1    ${DOMAIN}`;

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getHostsFilePath() {
  const platform = os.platform();

  if (platform === "win32") {
    return "C:\\Windows\\System32\\drivers\\etc\\hosts";
  } else {
    // Linux y macOS
    return "/etc/hosts";
  }
}

function checkIfConfigured(hostsPath) {
  try {
    const hostsContent = fs.readFileSync(hostsPath, "utf8");
    return hostsContent.includes(DOMAIN);
  } catch (error) {
    return false;
  }
}

function addHostEntry(hostsPath) {
  const platform = os.platform();

  try {
    if (platform === "win32") {
      // Windows - requiere elevación
      log("\n🔒 Configurando el archivo hosts en Windows...", "yellow");
      log("Se requieren permisos de administrador.\n", "yellow");

      // Crear un script temporal PowerShell
      const psScript = `
        $hostsPath = "${hostsPath}"
        $entry = "${HOST_ENTRY}"
        $hosts = Get-Content $hostsPath
        if ($hosts -notcontains $entry) {
          Add-Content -Path $hostsPath -Value $entry
          Write-Host "✅ Entrada agregada exitosamente" -ForegroundColor Green
        } else {
          Write-Host "✅ El dominio ya está configurado" -ForegroundColor Green
        }
      `;

      const tempScript = "temp-hosts-setup.ps1";
      fs.writeFileSync(tempScript, psScript);

      try {
        execSync(`powershell -ExecutionPolicy Bypass -File ${tempScript}`, {
          stdio: "inherit",
          shell: true,
        });
        fs.unlinkSync(tempScript);
      } catch (error) {
        fs.unlinkSync(tempScript);
        throw error;
      }
    } else {
      // Linux y macOS
      log("\n🔒 Configurando el archivo hosts...", "yellow");
      log("Se requieren permisos de administrador (sudo).\n", "yellow");

      // Verificar si ya existe
      const hostsContent = fs.readFileSync(hostsPath, "utf8");
      if (hostsContent.includes(DOMAIN)) {
        log("✅ El dominio ya está configurado en el archivo hosts", "green");
        return true;
      }

      // Agregar entrada usando sudo
      const command = `echo "${HOST_ENTRY}" | sudo tee -a ${hostsPath} > /dev/null`;
      execSync(command, { stdio: "inherit" });

      // Limpiar caché DNS en macOS
      if (platform === "darwin") {
        log("\n🔄 Limpiando caché DNS en macOS...", "blue");
        try {
          execSync("sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder", {
            stdio: "pipe",
          });
          log("✅ Caché DNS limpiado", "green");
        } catch (error) {
          log("⚠️  No se pudo limpiar el caché DNS, pero no es crítico", "yellow");
        }
      }

      // Limpiar caché DNS en Linux (systemd-resolved)
      if (platform === "linux") {
        try {
          execSync(
            "sudo systemd-resolve --flush-caches 2>/dev/null || sudo resolvectl flush-caches 2>/dev/null || true",
            {
              stdio: "pipe",
            }
          );
          log("✅ Caché DNS limpiado", "green");
        } catch (error) {
          // Ignorar errores en Linux, no todos los sistemas usan systemd-resolved
        }
      }
    }

    return true;
  } catch (error) {
    log(`\n❌ Error al configurar el archivo hosts: ${error.message}`, "red");
    return false;
  }
}

function createEnvLocal() {
  const envLocalPath = ".env.local";

  // Si ya existe, no sobrescribir
  if (fs.existsSync(envLocalPath)) {
    log("\n✅ El archivo .env.local ya existe", "green");

    // Verificar si contiene la URL correcta
    const envContent = fs.readFileSync(envLocalPath, "utf8");
    if (!envContent.includes(`NEXTAUTH_URL=http://${DOMAIN}:3000`)) {
      log(`\n⚠️  Asegúrate de que tu .env.local contenga:`, "yellow");
      log(`   NEXTAUTH_URL=http://${DOMAIN}:3000\n`, "blue");
    }
    return;
  }

  const envTemplate = `# URL de la aplicación para desarrollo local
NEXTAUTH_URL=http://${DOMAIN}:3000

# Secret para NextAuth (generar uno seguro en producción)
# Puedes generar uno con: openssl rand -base64 32
NEXTAUTH_SECRET=tu-secret-super-seguro-cambiame

# Base de datos (SQLite local por defecto)
DATABASE_URL="file:./prisma/dev.db"

# Configuración de email (opcional para desarrollo)
# EMAIL_FROM=noreply@${DOMAIN}
# MAILGUN_API_KEY=tu-api-key
# MAILGUN_DOMAIN=tu-dominio

# AWS S3 (opcional)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=tu-access-key
# AWS_SECRET_ACCESS_KEY=tu-secret-key
# AWS_BUCKET_NAME=tu-bucket
`;

  fs.writeFileSync(envLocalPath, envTemplate);
  log("\n✅ Archivo .env.local creado", "green");
  log("⚠️  Revisa y actualiza las variables de entorno según sea necesario\n", "yellow");
}

function main() {
  log("\n╔═══════════════════════════════════════════════════════════╗", "blue");
  log("║  🌐 Configurador de Dominio Local - Traza Ambiental    ║", "blue");
  log("╚═══════════════════════════════════════════════════════════╝\n", "blue");

  const hostsPath = getHostsFilePath();
  log(`📁 Ruta del archivo hosts: ${hostsPath}`, "blue");
  log(`🌐 Dominio a configurar: ${DOMAIN}\n`, "blue");

  const isConfigured = checkIfConfigured(hostsPath);

  if (isConfigured) {
    log("✅ El dominio ya está configurado en el archivo hosts", "green");
  } else {
    log("⚙️  El dominio no está configurado. Configurando...", "yellow");
    const success = addHostEntry(hostsPath);

    if (success) {
      log("\n✅ ¡Configuración completada exitosamente!", "green");
    } else {
      log("\n❌ No se pudo completar la configuración", "red");
      log("\n📝 Configuración manual:", "yellow");
      log(`   1. Abre el archivo: ${hostsPath}`, "blue");
      log(`   2. Agrega esta línea al final: ${HOST_ENTRY}`, "blue");
      log(`   3. Guarda el archivo con permisos de administrador\n`, "blue");
      process.exit(1);
    }
  }

  // Crear .env.local si no existe
  createEnvLocal();

  log("╔═══════════════════════════════════════════════════════════╗", "green");
  log("║  ✅ ¡Todo listo! Puedes iniciar el servidor con:       ║", "green");
  log("║     sudo npm run dev                                     ║", "green");
  log("║                                                            ║", "green");
  log(`║  🌐 Tu aplicación estará disponible en:                 ║`, "green");
  log(`║     http://${DOMAIN}                          ║`, "green");
  log("║     (puerto 80 - sin puerto en la URL)                  ║", "green");
  log("╚═══════════════════════════════════════════════════════════╝\n", "green");
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { checkIfConfigured, getHostsFilePath, DOMAIN };
