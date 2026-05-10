# Guía de Despliegue de Traza Ambiental en Oracle Cloud

*(Instancia: 148.116.104.105, SO: Ubuntu)*

## 1. Conexión a la Instancia (SSH)
Antes de conectarte, tu clave debe estar estrictamente protegida contra lectura y escritura de terceros. Abre una terminal local en el directorio de Traza Ambiental (*diferente* a la consola donde tienes el `docker compose` corriendo) y ejecuta:

```bash
# Cambiamos los permisos para que la clave sea segura
chmod 400 ssh-key-2026-03-16.key

# Nos conectamos a la máquina virtual usando el usuario predeterminado de Ubuntu
ssh -i ssh-key-2026-03-16.key ubuntu@148.116.104.105
```

---
**Todos los comandos a partir de aquí deben ejecutarse adentro del servidor en Oracle Cloud.**
---

## 2. Actualización de Sistema e Instalación de Utilidades
Mantén el sistema en las últimas versiones disponibles e instala git:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git nano curl -y
```

## 3. Instalación de Docker y Docker Compose
Omitimos las descargas indirectas y extraemos directamente desde el repositorio oficial de Docker para Ubuntu:
```bash
# Dependencias previas
sudo apt-get install ca-certificates curl gnupg lsb-release -y

# Agregando clave GPG de Docker
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Configurar el repositorio
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar el ecosistema Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

Permitamos que tu usuario de sistema opere Docker sin requerir la palabra `sudo`:
```bash
sudo usermod -aG docker $USER
# Actualiza el subgrupo activo sin necesidad de forzar logout
newgrp docker
```

## 4. Clonado del Repositorio y Entorno
*Nota: Si tu repositorio de Github/Gitlab es privado, git te solicitará un Personal Access Token (PAT) como contraseña.*
```bash
git clone <LA_URL_HTTP_O_SSH_DE_TU_REPO> traza-ambiental
cd traza-ambiental
```
Construye las variables de entorno de producción:
```bash
nano .env.docker
# (Pega aquí todas las variables usando Ctrl+Shift+V o CMD+V)
# Guarda presionando Ctrl+O, Enter y luego sal con Ctrl+X
```

## 5. Exposición de Puertos en Oracle Cloud (Firewall Local e Iptables)
**CRÍTICO:** Oracle Cloud bloquea absolutamente todos los puertos mediante el firewall del SO (iptables) en Ubuntu por defecto. Si esto no se soluciona, jamás te cargará la página en el navegador.

Debemos liberar el puerto local `3000`:
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo netfilter-persistent save
```
> **Paso Adicional Web:** Obligatoriamente, ingresa a tu **Consola de Oracle Cloud** en internet → Ve a Virtual Cloud Networks (VCNs) → Clic en tu VCN → Security Lists → Default Security List para tu VCN → Selecciona **Add Ingress Rules**. 
Agrega lo siguiente:
> Source CIDR: `0.0.0.0/0`
> IP Protocol: `TCP`
> Destination Port Range: `3000`
> Clic en Save.

## 6. Levantar el Contenedor (Producción OCI)
Estás en condiciones de servir Traza Ambiental al internet:
```bash
docker compose up --build -d
```
> El argumento `-d` ("detached mode") impide que debas dejar abierta la ventana SSH eternamente; el servidor rodará en el plano posterior por su cuenta.

Podrás auditar tus servicios mediante:
```bash
# Ver estatus del entorno
docker compose ps

# Ver la consola interna de Next.js (logs de conexión BD o caídas)
docker logs traza-app -f
```

La plataforma estará lista en:
`http://148.116.104.105:3000`
