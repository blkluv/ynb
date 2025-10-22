# 🚀 PrismaFi Smart Contract Deployment Guide

## 📋 Tabla de Contenidos
1. [Pre-requisitos](#pre-requisitos)
2. [Configuración Local](#configuración-local)
3. [Build y Tests](#build-y-tests)
4. [Deploy a Devnet](#deploy-a-devnet)
5. [Deploy a Mainnet](#deploy-a-mainnet)
6. [Verificación](#verificación)
7. [Integración con Frontend](#integración-con-frontend)

---

## Pre-requisitos

### Herramientas Necesarias

```bash
# 1. Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 2. Instalar Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# 3. Instalar Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 4. Instalar Node.js (v18+)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 5. Verificar instalación
solana --version
anchor --version
node --version
```

---

## Configuración Local

### 1. Clonar y configurar el proyecto

```bash
cd prediction-market-latam
npm install
# o yarn install
```

### 2. Configurar Solana CLI

```bash
# Configurar red (Devnet para desarrollo)
solana config set --url devnet

# Crear keypair local (si no existe)
solana-keygen new --outfile ~/.config/solana/id.json

# Ver tu dirección pública
solana address

# Solicitar airdrop de SOL (Devnet)
solana airdrop 2
```

### 3. Actualizar `Anchor.toml`

```toml
[features]
seeds = false
skip-lint = false

[programs.devnet]
prediction_market = "TU_PROGRAM_ID_AQUI"

[programs.mainnet]
prediction_market = "TU_PROGRAM_ID_MAINNET_AQUI"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"

[test.validator]
url = "https://api.devnet.solana.com"
```

---

## Build y Tests

### 1. Build del programa

```bash
# Build
anchor build

# Ver el Program ID generado
solana address -k target/deploy/prediction_market-keypair.json
```

### 2. Actualizar Program ID

Copia el Program ID generado y actualízalo en:

1. `Anchor.toml` → `[programs.devnet]`
2. `programs/prediction-market/src/lib.rs` → `declare_id!("TU_PROGRAM_ID");`
3. `sdk/index.ts` → `idl.metadata.address`

### 3. Re-build después de actualizar IDs

```bash
anchor build
```

### 4. Ejecutar Tests

```bash
# Tests unitarios (local validator)
anchor test

# Tests específicos
anchor test --skip-local-validator

# Con logs detallados
anchor test -- --nocapture
```

### Ejemplo de salida exitosa:

```
  prediction-market
    ✓ Initializes the program (1234ms)
    ✓ Creates a user profile (567ms)
    ✓ Creates a prediction market (789ms)
    ✓ Places a prediction (456ms)
    ✓ Adds liquidity to market (345ms)
    ✓ Sells position (234ms)
    ✓ Resolves market with oracle (123ms)
    ✓ Claims winnings (111ms)
    ✓ Removes liquidity (99ms)

  9 passing (4s)
```

---

## Deploy a Devnet

### 1. Verificar saldo

```bash
solana balance
# Si necesitas más SOL
solana airdrop 2
```

### 2. Deploy

```bash
# Deploy a Devnet
anchor deploy --provider.cluster devnet

# Verificar deploy
solana program show TU_PROGRAM_ID
```

### Salida esperada:

```
Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Authority: Tu_Wallet_Address
Last Deployed In Slot: 123456789
Data Length: 234567 (0x39447) bytes
Balance: 1.67890123 SOL
```

### 3. Inicializar el programa

```bash
# Crear script de inicialización
cat > scripts/initialize.ts << 'EOF'
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PredictionMarket } from "../target/types/prediction_market";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const program = anchor.workspace.PredictionMarket as Program<PredictionMarket>;
  
  const [globalStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("global_state")],
    program.programId
  );
  
  try {
    const tx = await program.methods
      .initialize()
      .accounts({
        globalState: globalStatePda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("✅ Program initialized:", tx);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
EOF

# Ejecutar inicialización
ts-node scripts/initialize.ts
```

---

## Deploy a Mainnet

⚠️ **IMPORTANTE: Mainnet es REAL. Verifica TODO antes de deployar.**

### Pre-checks:

```bash
# 1. Asegúrate de tener suficiente SOL
solana balance --url mainnet-beta
# Necesitas ~5 SOL para el deploy inicial

# 2. Cambia el cluster
solana config set --url mainnet-beta

# 3. Re-build para mainnet
anchor build

# 4. Actualiza Anchor.toml con el Program ID de mainnet
```

### Deploy:

```bash
# Deploy a Mainnet-Beta
anchor deploy --provider.cluster mainnet-beta

# ⚠️ CONFIRMA TODO antes de proceder
```

### Post-deploy:

```bash
# 1. Verificar programa
solana program show TU_PROGRAM_ID --url mainnet-beta

# 2. Transferir autoridad a multisig (CRÍTICO para producción)
solana program set-upgrade-authority \
  TU_PROGRAM_ID \
  --new-upgrade-authority MULTISIG_ADDRESS \
  --url mainnet-beta

# 3. Inicializar el programa
ts-node scripts/initialize.ts
```

---

## Verificación

### 1. Verificar programa en Explorer

- **Devnet**: https://explorer.solana.com/address/TU_PROGRAM_ID?cluster=devnet
- **Mainnet**: https://explorer.solana.com/address/TU_PROGRAM_ID

### 2. Verificar IDL

```bash
# Subir IDL a chain (opcional pero recomendado)
anchor idl init --filepath target/idl/prediction_market.json TU_PROGRAM_ID

# Verificar IDL
anchor idl fetch TU_PROGRAM_ID
```

### 3. Test manual con CLI

```bash
# Crear un mercado de prueba
ts-node scripts/create-test-market.ts

# Verificar en Explorer
# Busca la transaction signature que retorna el script
```

---

## Integración con Frontend

### 1. Instalar el SDK en tu proyecto frontend

```bash
cd ../prediction-market  # Tu proyecto frontend
npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token
```

### 2. Copiar archivos necesarios

```bash
# Copiar IDL
cp ../prediction-market-latam/target/idl/prediction_market.json \
   src/idl/

# Copiar SDK
cp -r ../prediction-market-latam/sdk src/
```

### 3. Configurar en el frontend

```typescript
// src/lib/prediction-market.ts
import { Connection, PublicKey } from "@solana/web3.js";
import { PredictionMarketSDK } from "./sdk";
import { useWallet } from "@solana/wallet-adapter-react";

// Program ID (actualiza con tu ID real)
export const PROGRAM_ID = new PublicKey(
  "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
);

// RPC endpoint
export const RPC_ENDPOINT = 
  process.env.NODE_ENV === "production"
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com";

// Hook personalizado
export function usePredictionMarket() {
  const wallet = useWallet();
  const connection = new Connection(RPC_ENDPOINT);
  
  const sdk = new PredictionMarketSDK(
    connection,
    wallet,
    PROGRAM_ID
  );
  
  return { sdk, connection, wallet };
}
```

### 4. Usar en componentes

```typescript
// src/components/CreateMarket.tsx
import { usePredictionMarket } from "@/lib/prediction-market";

export function CreateMarketForm() {
  const { sdk, wallet } = usePredictionMarket();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (data) => {
    if (!wallet.publicKey) return;
    
    setLoading(true);
    try {
      const tx = await sdk.createMarket(
        wallet.publicKey,
        {
          question: data.question,
          description: data.description,
          category: data.category,
          resolutionDate: data.resolutionDate,
          initialLiquidity: data.initialLiquidity * 1e6,
        },
        {
          minEvidenceCount: 3,
          requiredTypes: [],
          oracleRequired: true,
          scientificPeerReview: false,
          governmentSourceRequired: false,
        }
      );
      
      console.log("Market created:", tx);
      toast.success("Market created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create market");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Tu formulario aquí */}
    </form>
  );
}
```

---

## 🔒 Seguridad

### Auditoría de Código

Antes de deploy a mainnet:

1. **Revisar manualmente todo el código**
2. **Ejecutar linters y formatters**
   ```bash
   cargo clippy -- -D warnings
   cargo fmt --check
   ```
3. **Contratar auditoría profesional** (Halborn, OtterSec, etc.)
4. **Bug bounty program** después del launch

### Mejores Prácticas

- ✅ Usa multisig para upgrade authority en mainnet
- ✅ Implementa circuit breakers para emergencias
- ✅ Rate limiting en funciones críticas
- ✅ Comprehensive event logging
- ✅ Monitor transacciones on-chain
- ✅ Backup de keypairs en cold storage

---

## 📊 Monitoring

### Herramientas Recomendadas

1. **Helius** - RPC y webhooks
2. **QuickNode** - RPC robusto
3. **Metaplex** - NFT monitoring (si aplica)
4. **Jito** - MEV protection

### Script de monitoring

```typescript
// scripts/monitor.ts
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(RPC_ENDPOINT);
const PROGRAM_ID = new PublicKey("TU_PROGRAM_ID");

connection.onLogs(
  PROGRAM_ID,
  (logs) => {
    console.log("Transaction:", logs.signature);
    console.log("Logs:", logs.logs);
  },
  "confirmed"
);
```

---

## ❓ Troubleshooting

### Error: Insufficient funds

```bash
# Verifica balance
solana balance

# Airdrop (solo devnet)
solana airdrop 2
```

### Error: Program has already been deployed

```bash
# Actualiza el programa existente
anchor upgrade target/deploy/prediction_market.so \
  --program-id TU_PROGRAM_ID
```

### Error: Account already in use

Esto significa que el PDA ya existe. Verifica tu lógica de inicialización.

### Error: Custom program error: 0x0

Revisa los logs completos:
```bash
solana logs --program TU_PROGRAM_ID
```

---

## 📚 Recursos

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Program Library](https://spl.solana.com/)
- [PrismaFi Docs](https://docs.prismafi.io)

---

## ✅ Checklist Final

Antes de ir a mainnet:

- [ ] Tests passing (100% coverage)
- [ ] Código auditado
- [ ] Multisig configurado
- [ ] Circuit breakers implementados
- [ ] Monitoring activo
- [ ] Documentation completa
- [ ] Frontend integrado
- [ ] Bug bounty program listo
- [ ] Backup de keypairs seguros
- [ ] Plan de rollback documentado

---

**¡Éxito con tu deploy! 🚀**





























