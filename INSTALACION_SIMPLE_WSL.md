# 🚀 Instalación Simplificada - Sin Problemas de Contraseña

## ✅ **Solución: Instalación Completa en Una Sola Sesión de Root**

Ya que tu contraseña está reseteada, vamos a hacer TODO como root de una sola vez.

---

## **Comando Único - Ejecuta desde PowerShell**

Copia y pega este comando completo en **PowerShell**:

```powershell
wsl -u root bash -c '
# Configurar PATH
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.cargo/bin:/root/.local/share/solana/install/active_release/bin"

echo "=================================================="
echo "  Instalación Automática de Solana Tools"
echo "=================================================="
echo ""

# 1. Actualizar sistema
echo "[1/5] Actualizando sistema..."
apt-get update -qq
apt-get upgrade -y -qq

# 2. Instalar dependencias
echo "[2/5] Instalando dependencias..."
apt-get install -y -qq build-essential pkg-config libudev-dev llvm libclang-dev protobuf-compiler libssl-dev curl git
echo "✓ Dependencias instaladas"

# 3. Instalar Rust
echo "[3/5] Instalando Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    echo "✓ Rust instalado"
else
    echo "✓ Rust ya instalado"
fi

# Actualizar PATH
export PATH="$HOME/.cargo/bin:$PATH"

# 4. Instalar Solana
echo "[4/5] Instalando Solana CLI..."
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo "✓ Solana instalado"

# 5. Instalar Anchor
echo "[5/5] Instalando Anchor (esto tomará 10-15 minutos)..."
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0
echo "✓ Anchor instalado"

# Configurar Solana
solana config set --url https://api.devnet.solana.com

echo ""
echo "=================================================="
echo "  ✓ Instalación Completada"
echo "=================================================="
echo ""
echo "Herramientas instaladas:"
rustc --version
cargo --version
solana --version
anchor --version
echo ""
echo "Listo para usar!"
'
```

---

## **Este comando hará TODO automáticamente:**

1. ✅ Actualiza el sistema
2. ✅ Instala dependencias
3. ✅ Instala Rust
4. ✅ Instala Solana CLI
5. ✅ Instala Anchor 0.29.0
6. ✅ Configura Solana para Devnet

**Tiempo total:** ~15-20 minutos

**NO necesitas hacer nada más**, solo esperar.

---

## **Después de que termine:**

### **1. Generar Wallet**

```powershell
wsl -u root bash -c "solana-keygen new"
```

Te pedirá si quieres passphrase, presiona Enter (sin passphrase está bien para Devnet).

### **2. Obtener SOL**

```powershell
wsl -u root bash -c "solana airdrop 2"
```

### **3. Navegar al Proyecto y Build**

```powershell
wsl -u root bash -c 'cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam" && yarn install && anchor build'
```

### **4. Deploy**

```powershell
wsl -u root bash -c 'cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam" && anchor deploy --provider.cluster devnet'
```

---

## **Verificar Program ID**

```powershell
wsl -u root bash -c 'cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam" && anchor keys list'
```

---

## **¿Prefieres Ejecutar Paso a Paso?**

Si prefieres ver cada paso:

### **Paso 1: Instalar Rust**

```powershell
wsl -u root bash -c 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source "$HOME/.cargo/env" && rustc --version'
```

### **Paso 2: Instalar Dependencias**

```powershell
wsl -u root bash -c 'apt-get update && apt-get install -y build-essential pkg-config libudev-dev llvm libclang-dev protobuf-compiler libssl-dev curl git'
```

### **Paso 3: Instalar Solana**

```powershell
wsl -u root bash -c 'sh -c "$(curl -sSfL https://release.solana.com/stable/install)" && export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH" && solana --version'
```

### **Paso 4: Instalar Anchor**

```powershell
wsl -u root bash -c 'export PATH="$HOME/.cargo/bin:$PATH" && cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && avm install 0.29.0 && avm use 0.29.0 && anchor --version'
```

---

**¿Qué prefieres?**

**A)** Ejecutar el comando único y esperar 15-20 min (recomendado)
**B)** Ejecutar paso a paso con comandos individuales

---

**¡Con este método NO necesitarás contraseña en ningún momento!** 🎉
