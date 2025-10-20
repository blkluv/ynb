# 🎯 Guía Ejecutiva - Smart Contracts de Solana

## ✅ **Estado Actual**

### **Frontend:**

- ✅ **Deployado en Vercel** - https://[tu-proyecto].vercel.app
- ✅ **Build exitoso**
- ✅ **UI/UX completa**
- ⏳ **Funcionalidad mock** (esperando smart contracts)

### **Smart Contracts:**

- ✅ **Código completo** en `prediction-market-latam/`
- ✅ **Arquitectura definida**
- ⏳ **Pendiente: Instalación de herramientas**
- ⏳ **Pendiente: Build & Deploy**

---

## 🚀 **Tu Siguiente Paso: Deploy Smart Contracts**

### **Opción 1: Instalación Automática (Más Fácil)**

```powershell
# 1. Abre PowerShell como Administrador
# 2. Navega al directorio:
cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market-latam"

# 3. Ejecuta el script de instalación:
.\install-solana-tools.ps1
```

Este script instala todo automáticamente:

- Solana CLI
- Anchor Framework
- Dependencias necesarias

**Tiempo:** 10-15 minutos

---

### **Opción 2: Instalación Manual (Paso a Paso)**

Si prefieres instalar manualmente o el script falla:

#### **1. Instalar Rust** (5 min)

```powershell
# Descarga desde: https://rustup.rs/
# Ejecuta el instalador
# Reinicia PowerShell
```

#### **2. Instalar Solana CLI** (3 min)

```powershell
# Descarga:
https://github.com/solana-labs/solana/releases/latest

# Busca: solana-install-init-x86_64-pc-windows-msvc.exe
# Ejecuta el instalador
# Reinicia PowerShell

# Verifica:
solana --version
```

#### **3. Instalar Anchor** (10 min)

```powershell
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0

# Verifica:
anchor --version
```

---

## ⚙️ **Configuración Inicial (5 min)**

```bash
# 1. Configurar a Devnet:
solana config set --url https://api.devnet.solana.com

# 2. Generar wallet:
solana-keygen new
# ⚠️ GUARDA TU SEED PHRASE!

# 3. Obtener SOL de prueba:
solana airdrop 2

# Si falla el airdrop, usa: https://faucet.solana.com/

# 4. Verificar balance:
solana balance
```

---

## 🏗️ **Build & Deploy (5 min)**

```bash
# 1. Instalar dependencias:
cd prediction-market-latam
yarn install

# 2. Build:
anchor build

# 3. Ver tu Program ID:
anchor keys list

# 4. Actualizar Program ID en los archivos:
# - Anchor.toml -> [programs.devnet]
# - programs/prediction-market/src/lib.rs -> declare_id!()

# 5. Re-build:
anchor build

# 6. Deploy:
anchor deploy --provider.cluster devnet

# ✅ ¡Desplegado!
```

---

## 📦 **Integrar con el Frontend (10 min)**

### **1. Copiar IDL**

```bash
# Desde prediction-market-latam/:
cp target/idl/prediction_market.json ../src/lib/idl/
```

### **2. Instalar Dependencias de Solana**

```bash
cd ..
npm install @solana/web3.js @coral-xyz/anchor
```

### **3. Crear Helper de Conexión**

Crea `src/lib/solana/connection.ts`:

```typescript
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import idl from '../idl/prediction_market.json'

const PROGRAM_ID = new PublicKey('TU_PROGRAM_ID_AQUI')

export const getConnection = () => {
  return new Connection('https://api.devnet.solana.com', 'confirmed')
}

export const getProgram = (provider: AnchorProvider) => {
  return new Program(idl as any, PROGRAM_ID, provider)
}
```

### **4. Actualizar `marketService.ts`**

Reemplaza las funciones mock con llamadas reales al programa:

```typescript
import { getConnection, getProgram } from './solana/connection'

export class MarketService {
  static async getMarkets() {
    const connection = getConnection()
    const program = getProgram(provider) // Necesitas el provider de Privy

    // Fetch markets from program
    const markets = await program.account.predictionMarket.all()
    return markets.map((m) => transformMarketData(m))
  }

  // ... más métodos
}
```

---

## 📊 **Arquitectura de tu Programa**

Tu smart contract tiene estas funcionalidades principales:

### **Core Functions:**

- `initialize` - Inicializar el programa
- `create_market` - Crear nuevo mercado
- `place_prediction` - Hacer una predicción
- `claim_winnings` - Reclamar ganancias

### **Advanced Features:**

- `submit_evidence` - Enviar evidencia
- `vote_on_eligibility` - Votar en gobernanza
- `resolve_market_with_oracle` - Resolver con oráculo
- `update_reputation` - Actualizar reputación
- `add_liquidity` / `remove_liquidity` - LP
- `verify_human_identity` - Proof of Humanity

### **Accounts:**

- `PredictionMarket` - Datos del mercado
- `UserProfile` - Perfil de usuario
- `UserPosition` - Posiciones del usuario
- `Evidence` - Evidencia enviada
- `LiquidityPosition` - Posición de LP

---

## 🎯 **Timeline Completo**

| Paso                  | Tiempo      | Status       |
| --------------------- | ----------- | ------------ |
| Instalar tools        | 15 min      | ⏳ Pendiente |
| Configurar Solana     | 5 min       | ⏳ Pendiente |
| Build programa        | 2 min       | ⏳ Pendiente |
| Deploy a Devnet       | 2 min       | ⏳ Pendiente |
| Copiar IDL            | 1 min       | ⏳ Pendiente |
| Integrar con frontend | 10 min      | ⏳ Pendiente |
| Testing end-to-end    | 10 min      | ⏳ Pendiente |
| **TOTAL**             | **~45 min** |              |

---

## 📝 **Checklist de Deployment**

### **Pre-deployment:**

- [ ] Herramientas instaladas (Rust, Solana, Anchor)
- [ ] Wallet generado
- [ ] SOL de Devnet obtenido (mínimo 2 SOL)
- [ ] Dependencias instaladas (`yarn install`)

### **Build:**

- [ ] `anchor build` exitoso
- [ ] Program ID generado
- [ ] `Anchor.toml` actualizado
- [ ] `lib.rs` actualizado
- [ ] Re-build exitoso

### **Deploy:**

- [ ] `anchor deploy` exitoso
- [ ] Programa verificado en Explorer
- [ ] Logs funcionando

### **Integration:**

- [ ] IDL copiado al frontend
- [ ] Dependencias de Solana instaladas
- [ ] Connection helper creado
- [ ] `marketService.ts` actualizado
- [ ] Testing con Privy wallet

---

## 🆘 **¿Problemas?**

### **Error: comando no encontrado**

```bash
# Cierra y abre nueva terminal PowerShell
# Verifica la instalación:
solana --version
anchor --version
```

### **Error: Insufficient Funds**

```bash
# Solicita más SOL:
solana airdrop 2

# O usa el faucet: https://faucet.solana.com/
```

### **Error: Build failed**

```bash
anchor clean
cargo clean
anchor build
```

---

## 📚 **Documentación Disponible**

En `prediction-market-latam/`:

1. **`QUICK_START.md`** - Guía rápida de 15 minutos
2. **`SETUP_SMART_CONTRACTS.md`** - Guía completa y detallada
3. **`install-solana-tools.ps1`** - Script de instalación automática
4. **`DEPLOYMENT.md`** - Documentación de deployment
5. **`README.md`** - Arquitectura del proyecto

---

## 🎯 **Para el Hackathon**

### **Presentación Recomendada:**

**Slide 1: Problema**

- Mercados binarios (Yes/No) son limitados
- Dificultan predicciones precisas de valores numéricos

**Slide 2: Solución**

- **PrismaFi**: Scalar prediction markets en Solana
- Predice valores exactos (ej: CPI 2.4%)
- Payout proporcional a la precisión

**Slide 3: Tech Stack**

- **Frontend**: Next.js + Privy ✅ Deployado
- **Blockchain**: Solana (velocidad + bajos costos)
- **Smart Contracts**: Anchor Framework
- **Features**: Oracle integration, reputation, governance

**Slide 4: Traction**

- MVP funcional ✅
- UI/UX profesional ✅
- Smart contracts listos para deploy ⏳

**Slide 5: Roadmap**

- Devnet deployment (esta semana)
- Beta testing
- Mainnet launch

---

## 🚀 **¿Listo para Empezar?**

### **Opción A: Script Automático** (Recomendado)

```powershell
cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market-latam"
.\install-solana-tools.ps1
```

### **Opción B: Quick Start Manual**

Lee `prediction-market-latam/QUICK_START.md`

### **Opción C: Guía Detallada**

Lee `prediction-market-latam/SETUP_SMART_CONTRACTS.md`

---

**¿Cuál prefieres?** 🎯






