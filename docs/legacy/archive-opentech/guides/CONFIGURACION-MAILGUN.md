# Configuración de Mailgun para Envío de Correos

## 📧 ¿Por qué Mailgun?

Se ha migrado de `nodemailer` a `mailgun.js` por las siguientes razones:

- **Sin conflictos de dependencias**: Elimina el conflicto con `@auth/core`
- **Más confiable**: Servicio especializado en envío de emails transaccionales
- **Mejor entregabilidad**: Mayor probabilidad de llegar a la bandeja de entrada
- **Métricas incluidas**: Dashboard con estadísticas de emails enviados, abiertos, clicks, etc.
- **Sandbox gratuito**: 100 emails/día gratis para desarrollo

---

## 🚀 Configuración Paso a Paso

### 1. Crear Cuenta en Mailgun

1. Ve a [https://signup.mailgun.com/new/signup](https://signup.mailgun.com/new/signup)
2. Crea una cuenta gratuita (no requiere tarjeta de crédito para desarrollo)
3. Verifica tu email

### 2. Obtener Credenciales

#### Dominio Sandbox (Para Desarrollo)

1. Inicia sesión en [https://app.mailgun.com](https://app.mailgun.com)
2. Ve a **Sending** → **Domains**
3. Verás un dominio sandbox como: `sandboxXXXXX.mailgun.org`
4. **Importante**: El dominio sandbox solo envía emails a direcciones autorizadas

#### API Key

1. Ve a **Settings** → **API Keys**
2. Copia tu **Private API key** (comienza con `key-...`)
3. **Nunca compartas esta key** ni la subas a repositorios públicos

### 3. Configurar Variables de Entorno

Copia estas variables a tu archivo `.env`:

```bash
# Mailgun Configuration
MAILGUN_API_KEY="key-tu-api-key-aqui"
MAILGUN_DOMAIN="sandboxXXXXX.mailgun.org"  # Tu dominio sandbox
MAILGUN_API_URL="https://api.mailgun.net"   # Para US
# MAILGUN_API_URL="https://api.eu.mailgun.net"  # Para EU

# Email Settings
FROM_EMAIL="noreply@sandboxXXXXX.mailgun.org"
FROM_NAME="TrazAmbiental"
```

### 4. Autorizar Emails en Sandbox (Solo Desarrollo)

El dominio sandbox **solo puede enviar emails a direcciones autorizadas**:

1. Ve a **Sending** → **Domains** → Tu dominio sandbox
2. Haz clic en **Authorized Recipients**
3. Agrega los emails que quieres usar para pruebas
4. Los destinatarios recibirán un email de confirmación

---

## 🎯 Uso en Producción

### Opción 1: Dominio Propio (Recomendado)

Para producción, necesitas usar tu propio dominio:

1. **Agregar Dominio**:
   - Ve a **Sending** → **Domains** → **Add New Domain**
   - Ingresa tu dominio: `mg.trazambiental.com` (recomendado usar subdominio)

2. **Configurar DNS**:
   - Mailgun te dará registros DNS para agregar:
     - 2 registros TXT (SPF y DKIM)
     - 1 registro MX
     - 1 registro CNAME
   - Agrega estos registros en tu proveedor de DNS

3. **Verificar Dominio**:
   - Espera 24-48 horas (normalmente solo minutos)
   - Mailgun verificará automáticamente los registros
   - Estado debe cambiar a "Active"

4. **Actualizar `.env`**:

```bash
MAILGUN_DOMAIN="mg.trazambiental.com"
FROM_EMAIL="noreply@mg.trazambiental.com"
```

### Opción 2: Dominio Verificado de Mailgun

Si no tienes dominio propio, puedes usar un plan de pago de Mailgun.

---

## 🔍 Verificar Configuración

Para verificar que Mailgun está configurado correctamente:

```typescript
import { verifyEmailConfig } from "@/lib/emails/send";

// En una ruta API o función
const isValid = await verifyEmailConfig();
if (!isValid) {
  console.error("Configuración de Mailgun incorrecta");
}
```

---

## 📨 Enviar Email de Prueba

```typescript
import { sendEmail } from "@/lib/emails/send";

// Template de prueba
const template = {
  subject: "Email de Prueba",
  html: "<h1>Hola Mundo</h1><p>Este es un email de prueba desde TrazAmbiental.</p>",
  text: "Hola Mundo\n\nEste es un email de prueba desde TrazAmbiental.",
};

// Enviar (debe estar en lista de autorizados si usas sandbox)
const success = await sendEmail("tu-email@ejemplo.com", template);
console.log(success ? "Email enviado ✓" : "Error al enviar email ✗");
```

---

## 📊 Monitorear Emails

1. **Dashboard de Mailgun**:
   - Ve a **Sending** → **Logs**
   - Verás todos los emails enviados con su estado

2. **Estados posibles**:
   - `accepted`: Mailgun recibió el email
   - `delivered`: Email entregado exitosamente
   - `failed`: Error al enviar
   - `opened`: Destinatario abrió el email (si tracking habilitado)
   - `clicked`: Destinatario hizo click en un link

---

## ⚠️ Errores Comunes

### Error: "API key is not valid"

- **Causa**: API key incorrecta o no configurada
- **Solución**: Verifica que `MAILGUN_API_KEY` esté correcta en `.env`

### Error: "Domain is not verified"

- **Causa**: El dominio no está activo en Mailgun
- **Solución**: Verifica que el dominio esté verificado en el dashboard

### Email no llega al destinatario

- **Sandbox**: Verifica que el email esté en la lista de autorizados
- **Producción**: Revisa los logs en Mailgun dashboard
- **Spam**: El email puede estar en spam (normal en sandbox)

### Error: "Forbidden"

- **Causa**: Intentando enviar a email no autorizado con dominio sandbox
- **Solución**: Autoriza el email en **Authorized Recipients**

---

## 💰 Límites y Pricing

### Plan Gratuito (Trial)

- **5,000 emails/mes** durante 3 meses
- Solo con dominio verificado
- Incluye todas las funciones

### Sandbox (Desarrollo)

- **100 emails/día**
- Solo a emails autorizados
- Perfecto para desarrollo y testing
- Gratis, sin límite de tiempo

### Plans de Pago

- **Foundation**: $35/mes - 50,000 emails
- **Growth**: $80/mes - 100,000 emails
- **Scale**: Custom pricing

Más info: [https://www.mailgun.com/pricing/](https://www.mailgun.com/pricing/)

---

## 🔐 Seguridad

1. **Nunca expongas tu API key**:
   - No la incluyas en código frontend
   - No la subas a Git
   - Usa variables de entorno

2. **Rota las keys periódicamente**:
   - Mailgun permite generar múltiples keys
   - Rota las keys cada 6 meses

3. **Usa webhook signing**:
   - Para validar webhooks de Mailgun
   - Configura `MAILGUN_WEBHOOK_SIGNING_KEY`

---

## 📚 Recursos

- [Documentación oficial de Mailgun](https://documentation.mailgun.com/)
- [API Reference](https://documentation.mailgun.com/docs/mailgun/api-reference/intro/)
- [mailgun.js en GitHub](https://github.com/mailgun/mailgun-js)
- [Best Practices](https://documentation.mailgun.com/docs/mailgun/user-manual/best-practices/)

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en Mailgun Dashboard
2. Verifica las variables de entorno
3. Consulta la documentación oficial
4. Contacta soporte de Mailgun: [https://help.mailgun.com](https://help.mailgun.com)

---

**Última actualización**: Noviembre 2024
