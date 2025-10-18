# 🛠️ Comandos para Ejecutar Manualmente en WSL

## 📝 **Instrucciones**

Abre una terminal de WSL Ubuntu y ejecuta estos comandos **uno por uno**, en orden.

---

## **Paso 0: Configurar PATH**

```bash
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin"
echo 'export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin"' >> ~/.bashrc
```

---

## **Paso 1: Instalar Rust (2 minutos)**

```bash
# Instalar Rust:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Cargar Rust en la sesión actual:
source "$HOME/.cargo/env"

# Verificar:
rustc --version
cargo --version
```

**Output esperado:**
```
rustc 1.XX.X
cargo 1.XX.X
```

---

## **Paso 2: Actualizar Sistema e Instalar Dependencias (3 minutos)**

```bash
# Actualizar apt:
sudo apt-get update

# Instalar herramientas necesarias:
sudo apt-get install -y \
    build-essential \
    pkg-config \
    libudev-dev \
    llvm \
    libclang-dev \
    protobuf-compiler \
    libssl-dev \
    curl \
    git
```

**Output esperado:**
```
✓ Paquetes instalados correctamente
```

---

## **Paso 3: Instalar Solana CLI (3 minutos)**

```bash
# Instalar Solana:
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Agregar al PATH de la sesión actual:
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Agregar permanentemente al bashrc:
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Verificar:
solana --version
```

**Output esperado:**
```
solana-cli 1.XX.XX
```

---

## **Paso 4: Instalar Anchor 0.29.0 (10-15 minutos)**

```bash
# Asegurar que cargo esté en PATH:
export PATH="$HOME/.cargo/bin:$PATH"

# Instalar AVM (Anchor Version Manager):
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Esto tomará 10-15 minutos. Verás output como:
# Compiling...
# Building...
# Espera pacientemente...

# Una vez termine, instalar Anchor 0.29.0:
avm install 0.29.0
avm use 0.29.0

# Verificar:
anchor --version
```

**Output esperado:**
```
anchor-cli 0.29.0
```

---

## **Paso 5: Configurar Solana para Devnet**

```bash
# Configurar a Devnet:
solana config set --url https://api.devnet.solana.com

# Verificar configuración:
solana config get
```

**Output esperado:**
```
Config File: /home/edgar/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
```

---

## **Paso 6: Generar Wallet**

```bash
# Generar nueva keypair:
solana-keygen new

# Verás algo como:
# Generating a new keypair
# 
# For added security, enter a BIP39 passphrase
# 
# [Press Enter para sin passphrase o ingresa una]
#
# Wrote new keypair to /home/edgar/.config/solana/id.json
# ==================================================================
# pubkey: AbC123...XyZ789
# ==================================================================
# Save this seed phrase and your BIP39 passphrase to recover your new keypair:
# word1 word2 word3 ... word12
# ==================================================================

# ⚠️ IMPORTANTE: Guarda tu seed phrase en un lugar seguro!

# Ver tu dirección pública:
solana address
```

---

## **Paso 7: Obtener SOL de Devnet**

```bash
# Solicitar 2 SOL:
solana airdrop 2

# Si el airdrop falla, usa el faucet web:
# 1. Copia tu address: solana address
# 2. Ve a: https://faucet.solana.com/
# 3. Pega tu address y solicita SOL

# Verificar balance:
solana balance
```

**Output esperado:**
```
2 SOL
```

---

## **Paso 8: Navegar al Proyecto**

```bash
# Ir al directorio del proyecto:
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam"

# Verificar que estás en el lugar correcto:
ls -la
```

**Deberías ver:**
```
Anchor.toml
programs/
tests/
...
```

---

## **Paso 9: Instalar Dependencias de Node**

```bash
# Instalar dependencias:
yarn install

# O si no tienes yarn:
npm install
```

---

## **Paso 10: Build del Programa**

```bash
# Compilar el programa Anchor:
anchor build

# Esto tomará 5-10 minutos la primera vez
# Verás output como:
# Compiling prediction-market v0.1.0
# Building...
```

**Output esperado:**
```
✓ Built program: prediction_market.so
```

---

## **Paso 11: Ver Program ID**

```bash
# Ver tu Program ID:
anchor keys list

# Output mostrará algo como:
# prediction_market: 7xKx...9zYw
```

---

## **Paso 12: Actualizar Program ID en Archivos**

```bash
# Copiar el Program ID de arriba y actualizar estos archivos:

# 1. Editar Anchor.toml:
nano Anchor.toml
# Actualiza la línea:
# [programs.devnet]
# prediction_market = "PEGA_TU_PROGRAM_ID_AQUI"
# Ctrl+X para salir, Y para guardar

# 2. Editar lib.rs:
nano programs/prediction-market/src/lib.rs
# Actualiza la línea:
# declare_id!("PEGA_TU_PROGRAM_ID_AQUI");
# Ctrl+X para salir, Y para guardar
```

---

## **Paso 13: Re-build con Nuevo ID**

```bash
# Recompilar:
anchor build
```

---

## **Paso 14: Deploy a Devnet**

```bash
# Deploy del programa:
anchor deploy --provider.cluster devnet

# Esto tomará 1-2 minutos
```

**Output esperado:**
```
Deploying workspace: https://api.devnet.solana.com
Upgrade authority: <TU_WALLET>
Deploying program "prediction_market"...
Program Id: <PROGRAM_ID>

Deploy success
```

---

## **✅ Verificación Final**

```bash
# Ver info del programa deployado:
solana program show <TU_PROGRAM_ID> --url devnet

# Ver logs en tiempo real:
solana logs <TU_PROGRAM_ID> --url devnet
```

---

## **📦 Copiar IDL al Frontend**

```bash
# Copiar el IDL generado al frontend:
cp target/idl/prediction_market.json "../src/lib/idl/"

# Verificar que se copió:
ls -la "../src/lib/idl/"
```

---

## **🎉 ¡Listo!**

Tu programa está deployado en Devnet Solana.

**Program ID:** (el que obtuviste en el paso 11)  
**Explorer:** https://explorer.solana.com/?cluster=devnet

---

## **🆘 Si Algo Falla**

### **Error: Command not found**
```bash
# Recargar bashrc:
source ~/.bashrc
```

### **Error: Insufficient funds**
```bash
solana airdrop 2
# O usa: https://faucet.solana.com/
```

### **Error: Build failed**
```bash
anchor clean
cargo clean
anchor build
```

---

**Ejecuta estos comandos uno por uno en tu terminal de WSL Ubuntu. ¡Buena suerte! 🚀**

