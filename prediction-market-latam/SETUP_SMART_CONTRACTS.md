# 🛠️ Setup de Smart Contracts - Solana & Anchor

## 📋 **Pre-requisitos**

### **1. Instalar Rust**

```powershell
# Descarga e instala desde:
https://www.rust-lang.org/tools/install

# O usa rustup en PowerShell:
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe

# Verifica la instalación:
rustc --version
cargo --version
```

### **2. Instalar Solana CLI**

```powershell
# Opción 1: Usando instalador oficial
# Descarga de: https://github.com/solana-labs/solana/releases

# Opción 2: Usando comandos (en PowerShell Admin):
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Agregar a PATH:
$env:PATH += ";C:\Users\$env:USERNAME\.local\share\solana\install\active_release\bin"

# Verificar:
solana --version
```

### **3. Instalar Anchor Framework**

```powershell
# Instalar Anchor CLI:
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Instalar versión específica de Anchor:
avm install 0.29.0
avm use 0.29.0

# Verificar:
anchor --version
```

### **4. Instalar Node.js & Yarn** (si no lo tienes)

```powershell
# Descarga Node.js desde:
https://nodejs.org/

# Instala Yarn globalmente:
npm install -g yarn

# Verificar:
node --version
yarn --version
```

---

## 🔧 **Configuración Inicial**

### **1. Configurar Solana CLI**

```bash
# Configurar a Devnet:
solana config set --url https://api.devnet.solana.com

# Verificar configuración:
solana config get

# Output esperado:
# Config File: C:\Users\<tu-usuario>\.config\solana\cli\config.yml
# RPC URL: https://api.devnet.solana.com
# WebSocket URL: wss://api.devnet.solana.com/ (computed)
# Keypair Path: C:\Users\<tu-usuario>\.config\solana\id.json
```

### **2. Generar Keypair (Wallet)**

```bash
# Generar nueva keypair:
solana-keygen new --outfile ~/.config/solana/id.json

# Ver tu dirección pública:
solana address

# Verificar balance:
solana balance
```

### **3. Obtener SOL de Devnet (Airdrop)**

```bash
# Solicitar 2 SOL para Devnet:
solana airdrop 2

# Verificar balance:
solana balance

# Si el airdrop falla, usa el faucet web:
https://faucet.solana.com/
```

---

## 🚀 **Build & Deploy**

### **Paso 1: Instalar Dependencias**

```bash
cd prediction-market-latam

# Instalar dependencias de Node:
yarn install

# O con npm:
npm install
```

### **Paso 2: Build del Programa**

```bash
# Compilar el programa Anchor:
anchor build

# Esto genera:
# - target/deploy/prediction_market.so (programa compilado)
# - target/idl/prediction_market.json (Interface Definition Language)
```

**Output esperado:**

```
Compiling prediction-market v0.1.0
Finished release [optimized] target(s) in XX.XXs
✓ Built program: prediction_market.so
```

### **Paso 3: Generar Program ID**

```bash
# Generar un nuevo Program ID:
solana-keygen new --outfile target/deploy/prediction_market-keypair.json

# Ver el Program ID:
solana address -k target/deploy/prediction_market-keypair.json

# Copiar el Program ID y actualizarlo en:
# 1. Anchor.toml -> [programs.devnet]
# 2. lib.rs -> declare_id!("...")
```

### **Paso 4: Actualizar Program ID**

Edita estos archivos con tu nuevo Program ID:

**1. `Anchor.toml`:**

```toml
[programs.devnet]
prediction_market = "TU_PROGRAM_ID_AQUI"
```

**2. `programs/prediction-market/src/lib.rs`:**

```rust
declare_id!("TU_PROGRAM_ID_AQUI");
```

### **Paso 5: Re-build con el nuevo ID**

```bash
# Recompilar después de actualizar el ID:
anchor build
```

### **Paso 6: Ejecutar Tests (Opcional)**

```bash
# Tests locales (usa validator local):
anchor test

# Tests en Devnet:
anchor test --provider.cluster devnet
```

### **Paso 7: Deploy a Devnet**

```bash
# Deploy del programa a Devnet:
anchor deploy --provider.cluster devnet

# Verificar el deployment:
solana program show <TU_PROGRAM_ID>
```

**Output esperado:**

```
Deploying workspace: https://api.devnet.solana.com
Upgrade authority: <TU_WALLET_ADDRESS>
Deploying program "prediction_market"...
Program Id: <PROGRAM_ID>

Deploy success
```

---

## 📦 **Generar IDL para Frontend**

```bash
# El IDL se genera automáticamente durante el build:
# target/idl/prediction_market.json

# Copiar al frontend:
cp target/idl/prediction_market.json ../src/lib/idl/

# O crear symlink:
# (PowerShell Admin)
New-Item -ItemType SymbolicLink -Path "../src/lib/idl/prediction_market.json" -Target "target/idl/prediction_market.json"
```

---

## 🧪 **Testing**

### **Test Local (Validator Local)**

```bash
# Inicia validator local en otra terminal:
solana-test-validator

# En la terminal principal:
anchor test
```

### **Test en Devnet**

```bash
anchor test --provider.cluster devnet
```

### **Test Individual**

```bash
# Ejecutar un test específico:
anchor test -- --tests test_create_market
```

---

## 🔍 **Verificar Deployment**

### **1. En Solana Explorer**

Abre: https://explorer.solana.com/?cluster=devnet

Busca tu Program ID o address de wallet.

### **2. Ver Program Info**

```bash
# Ver detalles del programa:
solana program show <PROGRAM_ID> --url devnet

# Ver balance del programa:
solana balance <PROGRAM_ID> --url devnet
```

### **3. Ver Logs**

```bash
# Ver logs en tiempo real:
solana logs <PROGRAM_ID> --url devnet
```

---

## 📝 **Troubleshooting**

### **Error: Insufficient Funds**

```bash
# Solicitar más SOL:
solana airdrop 2

# O usar el faucet web:
https://faucet.solana.com/
```

### **Error: Program ID mismatch**

- Asegúrate de que el ID en `Anchor.toml` y `lib.rs` coincidan
- Recompila después de actualizar: `anchor build`

### **Error: Anchor not found**

```bash
# Reinstalar Anchor:
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0
```

### **Error: Build failed**

```bash
# Limpiar y rebuild:
anchor clean
cargo clean
anchor build
```

---

## 📊 **Costos Estimados (Devnet)**

- **Airdrop:** Gratis (2 SOL máximo por request)
- **Deploy:** ~2-5 SOL (depende del tamaño del programa)
- **Transactions:** ~0.000005 SOL por transacción

**Nota:** En Devnet todo es gratuito (SOL de prueba).

---

## 🎯 **Next Steps Después del Deploy**

1. ✅ **Copiar Program ID** al frontend
2. ✅ **Generar TypeScript SDK** (opcional, Anchor lo hace automáticamente)
3. ✅ **Actualizar `marketService.ts`** para usar el programa real
4. ✅ **Configurar `@solana/web3.js`** en el frontend
5. ✅ **Testing end-to-end** con Privy + Programa

---

## 🔗 **Links Útiles**

- **Anchor Docs:** https://www.anchor-lang.com/
- **Solana Docs:** https://docs.solana.com/
- **Solana Cookbook:** https://solanacookbook.com/
- **Devnet Explorer:** https://explorer.solana.com/?cluster=devnet
- **Devnet Faucet:** https://faucet.solana.com/

---

## 📄 **Checklist Completo**

- [ ] Rust instalado
- [ ] Solana CLI instalado
- [ ] Anchor CLI instalado
- [ ] Node.js & Yarn instalados
- [ ] Keypair generada
- [ ] SOL de Devnet obtenido (2 SOL mínimo)
- [ ] Dependencias instaladas (`yarn install`)
- [ ] Program ID generado
- [ ] `Anchor.toml` actualizado
- [ ] `lib.rs` actualizado
- [ ] `anchor build` exitoso
- [ ] `anchor test` pasando
- [ ] `anchor deploy` exitoso
- [ ] Program verificado en Explorer
- [ ] IDL copiado al frontend

---

**¿Listo para comenzar?** Sigue los pasos en orden y estarás deployado en Devnet en ~30-60 minutos. 🚀






