# 🚀 Próximos Pasos: Smart Contracts

## ⏳ **Estado Actual**

**Instalación en progreso (~15-20 min):**

- 🔄 Rust (rustc + cargo)
- 🔄 Anchor CLI (avm + anchor 0.29.0)
- 🔄 Configuración de PATH

---

## ✅ **Una vez termine la instalación**

### **Paso 1: Verificar instalación exitosa**

Deberías ver al final del output:

```bash
=========================================
✅ INSTALACIÓN COMPLETADA
=========================================

rustc 1.xx.x
cargo 1.xx.x
solana-cli 3.0.3
anchor-cli 0.29.0
```

---

### **Paso 2: Compilar el programa Anchor**

```bash
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor build"
```

**Duración:** ~5-10 minutos (primera vez)

**Output esperado:**

```bash
Compiling prediction-market v0.1.0
Compiling spl-token v4.0.0
...
Finished release [optimized] target(s) in 8m 32s
✅ Build successful!
```

**Genera:**

- `target/deploy/prediction_market.so` (programa compilado)
- `target/idl/prediction_market.json` (IDL para frontend)

---

### **Paso 3: Configurar Solana Devnet**

```bash
# Configurar cluster a Devnet
wsl bash -c "source ~/.cargo/env && solana config set --url https://api.devnet.solana.com"

# Generar keypair si no existe
wsl bash -c "source ~/.cargo/env && solana-keygen new --outfile ~/.config/solana/id.json"

# Airdrop SOL para deploy (puede requerir varios intentos)
wsl bash -c "source ~/.cargo/env && solana airdrop 2"
```

---

### **Paso 4: Ejecutar tests locales (opcional pero recomendado)**

```bash
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor test"
```

**Duración:** ~10-15 minutos

**Qué hace:**

- Inicia un validador local de Solana
- Deploya el programa al validador local
- Ejecuta todos los tests en `tests/prediction-market.ts`
- Verifica que la lógica funciona correctamente

---

### **Paso 5: Deploy a Solana Devnet**

```bash
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor deploy --provider.cluster devnet"
```

**Duración:** ~2-3 minutos

**Output esperado:**

```bash
Deploying workspace: https://explorer.solana.com/address/...?cluster=devnet
Upgrade authority: ~/.config/solana/id.json
Deploying program "prediction-market"...
Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

Deploy success ✅
```

**Importante:** Guarda el **Program ID** que aparece!

---

### **Paso 6: Actualizar el Program ID en el código**

Una vez tengas el Program ID del deploy, actualízalo en:

**A) `Anchor.toml`:**

```toml
[programs.devnet]
prediction_market = "TU_PROGRAM_ID_AQUI"
```

**B) `programs/prediction-market/src/lib.rs`:**

```rust
declare_id!("TU_PROGRAM_ID_AQUI");
```

**C) Recompilar:**

```bash
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor build"
```

---

### **Paso 7: Copiar IDL al frontend**

```bash
# Crear directorio para IDL en frontend
mkdir -p src/lib/idl

# Copiar IDL generado
cp prediction-market-latam/target/idl/prediction_market.json src/lib/idl/
```

---

### **Paso 8: Integrar con el frontend**

Crear archivo de integración: `src/lib/solana/predictionMarket.ts`

```typescript
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import idl from '@/lib/idl/prediction_market.json'

const PROGRAM_ID = new PublicKey('TU_PROGRAM_ID_AQUI')
const DEVNET_URL = 'https://api.devnet.solana.com'

export const getPredictionMarketProgram = (wallet: any) => {
  const connection = new Connection(DEVNET_URL, 'confirmed')
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })

  return new Program(idl as any, PROGRAM_ID, provider)
}

// Ejemplo: Crear mercado
export const createMarket = async (
  wallet: any,
  question: string,
  endTime: number
) => {
  const program = getPredictionMarketProgram(wallet)

  const [marketPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('market'), wallet.publicKey.toBuffer()],
    program.programId
  )

  const tx = await program.methods
    .createMarket(question, new BN(endTime))
    .accounts({
      market: marketPda,
      creator: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc()

  return { marketPda, signature: tx }
}
```

---

## 📋 **Checklist Completo**

### **Instalación:**

- [ ] ✅ Rust instalado
- [ ] ✅ Anchor CLI instalado
- [ ] ✅ Solana CLI configurado
- [ ] ✅ PATH configurado

### **Build & Test:**

- [ ] ⏳ `anchor build` exitoso
- [ ] ⏳ IDL generado
- [ ] ⏳ `anchor test` pasa (opcional)

### **Deploy:**

- [ ] ⏳ Solana keypair generado
- [ ] ⏳ Airdrop de SOL recibido
- [ ] ⏳ `anchor deploy` exitoso
- [ ] ⏳ Program ID obtenido

### **Integración:**

- [ ] ⏳ Program ID actualizado en código
- [ ] ⏳ IDL copiado al frontend
- [ ] ⏳ Funciones de integración creadas
- [ ] ⏳ Frontend conectado al programa

---

## ⏱️ **Timeline Completo**

```
Ahora - Instalación corriendo (15-20 min)
  ↓
+15-20 min - Instalación completa
  ↓
+5-10 min - anchor build
  ↓
+2 min - Configurar Devnet + keypair
  ↓
+2 min - Airdrop SOL
  ↓
+10-15 min - anchor test (opcional)
  ↓
+3 min - anchor deploy
  ↓
+5 min - Actualizar Program ID + IDL
  ↓
+15 min - Integración con frontend

TOTAL: ~60-75 minutos desde ahora
```

---

## 🎯 **Objetivo Final**

```
✅ Frontend desplegado en Vercel
✅ Smart contracts desplegados en Solana Devnet
✅ Frontend integrado con smart contracts
✅ Wallet connection funcional
✅ Demo completo funcionando

→ LISTO PARA EL HACKATHON! 🚀
```

---

## 🐛 **Troubleshooting Común**

### **Si `anchor build` falla:**

```bash
# Verificar versiones
wsl bash -c "source ~/.cargo/env && rustc --version && solana --version && anchor --version"

# Limpiar y rebuild
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor clean && anchor build"
```

### **Si airdrop falla:**

```bash
# Intentar con 1 SOL en vez de 2
wsl bash -c "source ~/.cargo/env && solana airdrop 1"

# O usar faucet web
# https://faucet.solana.com/
```

### **Si deploy falla por fondos insuficientes:**

```bash
# Verificar balance
wsl bash -c "source ~/.cargo/env && solana balance"

# Necesitas ~2 SOL para deploy
wsl bash -c "source ~/.cargo/env && solana airdrop 2"
```

---

**Mientras esperamos la instalación, ¿tienes alguna pregunta sobre el proceso o quieres que prepare algo más?**
