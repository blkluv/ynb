# 🐧 Guía de Uso de WSL para Desarrollo de Solana

## 🎯 **Qué es WSL**

WSL (Windows Subsystem for Linux) te permite ejecutar Linux directamente en Windows sin necesidad de una máquina virtual. Es perfecto para desarrollo de Solana.

---

## 🚀 **Comandos Básicos de WSL**

### **Abrir WSL**

```powershell
# Desde PowerShell o CMD:
wsl

# O abre "Ubuntu" desde el menú inicio
```

### **Salir de WSL**

```bash
exit
# O presiona Ctrl+D
```

### **Ejecutar un comando en WSL desde PowerShell**

```powershell
wsl ls -la
wsl pwd
wsl solana --version
```

---

## 📁 **Acceder a tus Archivos**

### **Desde WSL, acceder a archivos de Windows:**

```bash
# Tu disco C: está en:
cd /mnt/c/

# Tu proyecto está en:
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam"

# Tip: Usa comillas para espacios en nombres
```

### **Desde Windows, acceder a archivos de WSL:**

```powershell
# Abre el explorador de archivos:
explorer.exe \\wsl$\Ubuntu\home\edgar
```

---

## ⚙️ **Configuración Inicial (Ya se está ejecutando)**

La instalación automática está configurando:

1. ✅ Actualización del sistema
2. ✅ Dependencias necesarias
3. ✅ Rust y Cargo
4. ✅ Solana CLI
5. ✅ Anchor Framework

**Tiempo estimado:** 10-15 minutos

---

## 🔍 **Verificar Instalación**

Una vez que termine, verifica que todo esté instalado:

```bash
# Abrir WSL:
wsl

# Verificar instalaciones:
rustc --version
cargo --version
solana --version
anchor --version

# Ver configuración de Solana:
solana config get
```

---

## 🏗️ **Workflow de Desarrollo**

### **1. Abrir tu proyecto en WSL**

```bash
# Navegar al proyecto:
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam"

# Ver archivos:
ls -la
```

### **2. Generar Wallet**

```bash
# Generar nueva keypair:
solana-keygen new

# ⚠️ IMPORTANTE: Guarda tu seed phrase!

# Ver tu dirección:
solana address

# Ver balance:
solana balance
```

### **3. Obtener SOL de Devnet**

```bash
# Solicitar 2 SOL:
solana airdrop 2

# Si falla, usa: https://faucet.solana.com/
# Pega tu address (de solana address) y solicita SOL

# Verificar balance:
solana balance
```

### **4. Build & Deploy**

```bash
# Instalar dependencias (primera vez):
yarn install

# Build del programa:
anchor build

# Ver tu Program ID:
anchor keys list

# Deploy a Devnet:
anchor deploy --provider.cluster devnet

# Ver logs en tiempo real:
solana logs <TU_PROGRAM_ID> --url devnet
```

### **5. Testing**

```bash
# Tests locales:
anchor test

# Tests en Devnet:
anchor test --provider.cluster devnet
```

---

## 💡 **Tips y Trucos**

### **Crear Alias para tu Proyecto**

```bash
# Agregar al final de ~/.bashrc:
echo 'alias cdprediction="cd /mnt/c/Users/edgar/cypherpunk\ hackathon2025/prediction-market-latam"' >> ~/.bashrc

# Recargar:
source ~/.bashrc

# Ahora solo haz:
cdprediction
```

### **Ver Logs del Build**

```bash
# Si el build falla, ver logs detallados:
anchor build --verbose
```

### **Limpiar Cache**

```bash
# Si tienes problemas:
anchor clean
cargo clean
rm -rf target/
anchor build
```

### **Copiar Program ID al Clipboard**

```bash
# Después de anchor build:
anchor keys list | grep "prediction_market" | awk '{print $2}' | clip.exe
```

---

## 🔄 **Sincronizar con Frontend**

### **Copiar IDL al Frontend**

```bash
# Desde WSL, después de anchor build:
cp target/idl/prediction_market.json "/mnt/c/Users/edgar/cypherpunk hackathon2025/src/lib/idl/"

# Verificar que se copió:
ls -la "/mnt/c/Users/edgar/cypherpunk hackathon2025/src/lib/idl/"
```

### **Ver el Program ID y copiarlo**

```bash
# Ver Program ID:
anchor keys list

# Copiar al clipboard de Windows:
anchor keys list | grep "prediction_market" | awk '{print $2}' | clip.exe

# Ahora puedes pegar (Ctrl+V) en tu código
```

---

## 🆘 **Troubleshooting**

### **Error: Permission denied**

```bash
# Dar permisos de ejecución:
chmod +x script.sh
```

### **Error: Insufficient funds**

```bash
# Solicitar más SOL:
solana airdrop 2

# O usar: https://faucet.solana.com/
```

### **WSL muy lento**

```bash
# Reiniciar WSL desde PowerShell:
wsl --shutdown
wsl

# Limpiar cache:
sudo apt-get clean
sudo apt-get autoclean
```

### **No encuentra comando después de instalar**

```bash
# Recargar bashrc:
source ~/.bashrc

# O cerrar y abrir nueva terminal WSL
```

---

## 📊 **Comandos Útiles de WSL**

### **Desde PowerShell:**

```powershell
# Ver distribuciones instaladas:
wsl --list --verbose

# Reiniciar WSL:
wsl --shutdown
wsl

# Ver uso de recursos:
wsl --status

# Actualizar WSL:
wsl --update
```

### **Desde WSL:**

```bash
# Ver uso de disco:
df -h

# Ver memoria:
free -h

# Ver procesos:
top
# (Presiona 'q' para salir)
```

---

## 🎯 **Workflow Completo Resumido**

```bash
# 1. Abrir WSL:
wsl

# 2. Ir al proyecto:
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam"

# 3. Build:
anchor build

# 4. Deploy:
anchor deploy --provider.cluster devnet

# 5. Copiar IDL:
cp target/idl/prediction_market.json ../src/lib/idl/

# 6. Ver Program ID:
anchor keys list

# 7. Salir:
exit
```

---

## 🔗 **Recursos Útiles**

- **WSL Docs:** https://docs.microsoft.com/en-us/windows/wsl/
- **Solana Docs:** https://docs.solana.com/
- **Anchor Docs:** https://www.anchor-lang.com/
- **Devnet Explorer:** https://explorer.solana.com/?cluster=devnet

---

## ⏱️ **Checklist de Primera Vez**

Después de que termine la instalación:

- [ ] Abrir WSL: `wsl`
- [ ] Verificar herramientas: `solana --version`, `anchor --version`
- [ ] Generar wallet: `solana-keygen new`
- [ ] Guardar seed phrase ⚠️
- [ ] Obtener SOL: `solana airdrop 2`
- [ ] Navegar al proyecto: `cd /mnt/c/.../prediction-market-latam`
- [ ] Instalar deps: `yarn install`
- [ ] Build: `anchor build`
- [ ] Deploy: `anchor deploy --provider.cluster devnet`
- [ ] Copiar IDL al frontend

---

**¡La instalación está en progreso! Te notificaré cuando termine. ⏳**






