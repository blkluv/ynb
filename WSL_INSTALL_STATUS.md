# 📊 Estado de Instalación en WSL

## ⚠️ **Situación Actual**

```
❌ Rust:   No instalado
❌ Cargo:  No instalado
❌ Solana: No instalado
⚠️ Anchor: Instalado pero versión incorrecta (0.31.0 en lugar de 0.29.0)
```

---

## 🚀 **Instalación Manual Paso a Paso (15 min)**

Vamos a instalar todo manualmente para tener control total:

### **Paso 1: Abrir WSL Ubuntu**

```powershell
# Desde PowerShell:
wsl
```

### **Paso 2: Instalar Rust**

Dentro de WSL, ejecuta:

```bash
# Instalar Rust:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Cargar Rust en la sesión actual:
source "$HOME/.cargo/env"

# Verificar:
rustc --version
cargo --version
```

### **Paso 3: Instalar Dependencias**

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
    libssl-dev
```

### **Paso 4: Instalar Solana CLI**

```bash
# Instalar Solana:
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Agregar al PATH:
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Verificar:
solana --version
```

### **Paso 5: Instalar Anchor 0.29.0**

```bash
# Desinstalar versión incorrecta si existe:
cargo uninstall avm 2>/dev/null

# Instalar AVM:
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Verificar que cargo/bin esté en PATH:
export PATH="$HOME/.cargo/bin:$PATH"

# Instalar Anchor 0.29.0:
avm install 0.29.0
avm use 0.29.0

# Verificar:
anchor --version
```

### **Paso 6: Configurar Solana**

```bash
# Configurar a Devnet:
solana config set --url https://api.devnet.solana.com

# Generar wallet:
solana-keygen new
# ⚠️ GUARDA TU SEED PHRASE!

# Obtener SOL:
solana airdrop 2

# Verificar balance:
solana balance
```

---

## ✅ **Verificación Final**

```bash
# Ejecuta para verificar todo:
echo "===================="
echo "Rust:   $(rustc --version)"
echo "Cargo:  $(cargo --version)"
echo "Solana: $(solana --version)"
echo "Anchor: $(anchor --version)"
echo "===================="
```

---

## 🎯 **Después de Instalar**

Una vez que todo esté instalado:

```bash
# 1. Navegar al proyecto:
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam"

# 2. Instalar dependencias de Node:
yarn install

# 3. Build:
anchor build

# 4. Deploy:
anchor deploy --provider.cluster devnet
```

---

**¿Quieres que te guíe comando por comando o prefieres ejecutar todo el script de una vez?**






