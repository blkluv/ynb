# 🚀 PRISMAFI - Deployment Guide (Solana Playground)

**Deadline: 30 Oct 2025**  
**Status: READY TO DEPLOY**

---

## ✅ PASO 1: Acceder a Solana Playground

1. Abre **https://beta.solpg.io/**
2. Conecta tu wallet (Phantom)
3. Confirma que tienes **~0.5 SOL en Devnet**

   🔑 Tu wallet actual:
   ```
   Address: CE9eV9nHiXzFPUQrC7G1Lzr2UvQd8Ks3wF2mN4jP6tL8
   Balance: 3.46 SOL (Devnet)
   ```

---

## ✅ PASO 2: Crear Proyecto Nuevo

1. Click en **"+ New"** (arriba izquierda)
2. Selecciona **"Anchor"** (Rust framework)
3. Nombre: `prismafi`
4. Template: **"Anchor (Rust)"**
5. Click **"Create"**

---

## ✅ PASO 3: Reemplazar Código

1. En el sidebar izquierdo, abre **`src/lib.rs`**
2. **BORRA TODO** el contenido
3. Abre el archivo **`PRISMAFI_SOLANA_PLAYGROUND.rs`** (en tu carpeta hackathon)
4. **COPIA TODO** el contenido
5. **PEGA** en `lib.rs` de Solana Playground

---

## ✅ PASO 4: Build (Compilar)

1. Click en el icono **🔨 Build** (arriba a la izquierda)
2. Espera **~2-3 minutos** (primera vez es lento)
3. Verás mensajes en la consola:
   ```
   Building...
   Build successful ✓
   Program ID: <NUEVO_ID_AQUI>
   ```
4. **COPIA el Program ID** que aparezca

---

## ✅ PASO 5: Deploy a Devnet

1. Asegúrate de que el selector de red diga **"Devnet"** (arriba derecha)
2. Click en **🚀 Deploy**
3. Confirma la transacción en Phantom
4. Espera ~30 segundos
5. Verás:
   ```
   Deploy successful ✓
   Program ID: <TU_PROGRAM_ID>
   Explorer: https://explorer.solana.com/address/<ID>?cluster=devnet
   ```

---

## ✅ PASO 6: Test (Probar Funciones)

### 6.1 Test Automático (Solana Playground)

1. Click en **Test** (icono de vaso de precipitados)
2. Esto ejecutará los tests básicos del programa
3. Si falla, es porque **NO hay tests** → **SKIP** y continúa

### 6.2 Test Manual (CLI en Playground)

En la terminal de Solana Playground, ejecuta:

```typescript
// En la pestaña "Test" de Solana Playground, copia esto:

const market = anchor.web3.Keypair.generate();
const endTime = Math.floor(Date.now() / 1000) + 86400; // +24 hrs

// Test 1: Create Market
const txCreate = await program.methods
  .createMarket(
    "Who wins World Cup 2026?",
    "Prediction market for FIFA World Cup winner",
    new anchor.BN(endTime),
    "Sports"
  )
  .accounts({
    market: market.publicKey,
    authority: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([market])
  .rpc();

console.log("✅ Market created:", txCreate);

// Test 2: Place Bet
const betAmount = new anchor.BN(1_000_000_000); // 1 SOL
const [marketVault] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), market.publicKey.toBuffer()],
  program.programId
);

const [position] = anchor.web3.PublicKey.findProgramAddressSync(
  [
    Buffer.from("position"),
    market.publicKey.toBuffer(),
    provider.wallet.publicKey.toBuffer(),
  ],
  program.programId
);

const txBet = await program.methods
  .placeBet(true, betAmount) // YES = true
  .accounts({
    market: market.publicKey,
    position,
    marketVault,
    user: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

console.log("✅ Bet placed:", txBet);
```

**Resultado esperado:**
```
✅ Market created: <TX_SIGNATURE>
✅ Bet placed: <TX_SIGNATURE>
```

---

## ✅ PASO 7: Integrar con Frontend

### 7.1 Copiar Program ID

El Program ID que obtuviste en el PASO 4, pégalo aquí:

**Archivo:** `prediction-market/src/lib/solana-config.ts`

```typescript
export const PROGRAM_ID = 'TU_PROGRAM_ID_AQUI'
```

### 7.2 Actualizar `idl.json`

1. En Solana Playground, click en **Download IDL** (icono de descarga)
2. Copia el archivo `idl.json` descargado
3. Reemplaza `prediction-market/src/idl/prediction_market.json` con el nuevo

### 7.3 Configurar Red (Devnet)

**Archivo:** `prediction-market/src/providers/WalletProvider.tsx`

```typescript
// Cambiar de Mainnet a Devnet temporalmente
const network = WalletAdapterNetwork.Devnet
```

---

## ✅ PASO 8: Test End-to-End (E2E)

1. En tu terminal local:
   ```bash
   cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market"
   npm run dev
   ```

2. Abre **http://localhost:3000**

3. Conecta Phantom (Devnet)

4. Prueba crear un mercado:
   - Question: "Test Market"
   - Description: "Testing deployment"
   - End Time: Selecciona mañana
   - Category: "Test"
   - Click **"Create Market"**

5. Confirma la transacción en Phantom

6. **VERIFICA EN EXPLORER:**
   ```
   https://explorer.solana.com/address/<PROGRAM_ID>?cluster=devnet
   ```

---

## ✅ PASO 9: Deploy a Mainnet (PRODUCCIÓN)

**⚠️ SOLO después de confirmar que TODO funciona en Devnet**

### 9.1 Cambiar a Mainnet en Solana Playground

1. Selector de red (arriba derecha) → **"Mainnet Beta"**
2. Asegúrate de tener **~0.5 SOL en Mainnet**
3. Click **🚀 Deploy**
4. Confirma transacción (será más cara que Devnet)

### 9.2 Actualizar Frontend

**Archivo:** `prediction-market/src/providers/WalletProvider.tsx`

```typescript
// Volver a Mainnet
const network = WalletAdapterNetwork.Mainnet
```

**Archivo:** `prediction-market/src/lib/solana-config.ts`

```typescript
export const PROGRAM_ID = 'TU_NUEVO_PROGRAM_ID_MAINNET'
```

### 9.3 Recompiliar IDL

Descarga el nuevo IDL de Mainnet y reemplaza:
```
prediction-market/src/idl/prediction_market.json
```

---

## ✅ PASO 10: Onboarding de Usuarios

### 10.1 Publicar App

```bash
cd prediction-market
npm run build
vercel deploy --prod  # O tu hosting preferido
```

### 10.2 Crear Contenido

1. **Tweet de lanzamiento:**
   ```
   🚀 PrismaFi ya está LIVE en Solana Mainnet!
   
   Mercados de predicción descentralizados.
   ✅ Sin custodia
   ✅ Instant settlement
   ✅ 100% on-chain
   
   Pruébalo: [tu-url]
   #Solana #PredictionMarkets #Web3
   ```

2. **Video Demo** (2 min):
   - Conectar wallet
   - Crear mercado
   - Hacer apuesta
   - Resolver y claim

3. **Landing Page:**
   - Hero: "Bet on the future with PrismaFi"
   - CTA: "Launch App"
   - Mostrar mercados activos

### 10.3 Primeros Usuarios

1. **Discord/Telegram:**
   - Comparte en grupos de Solana
   - Ofrece incentivo (ej: "First 100 users get 0.1 SOL airdrop")

2. **Product Hunt:**
   - Submit después de tener ~50 usuarios

3. **Hackathon Submission:**
   - URL: `<tu-prismafi-url>`
   - Demo Video: Link de YouTube
   - Traction: "X users, Y markets created, Z SOL in volume"

---

## 📊 Métricas de Tracción

**Antes de Oct 30:**

- [ ] ≥ 50 wallets conectadas
- [ ] ≥ 10 markets created
- [ ] ≥ 5 SOL en volumen
- [ ] ≥ 1 market resolved

---

## 🆘 Troubleshooting

### Error: "Transaction simulation failed"
- **Causa:** Insuficiente SOL para rent
- **Fix:** Airdrop más SOL: `solana airdrop 1`

### Error: "Account not found"
- **Causa:** Market no existe todavía
- **Fix:** Crear market primero

### Error: "Custom program error: 0x1770"
- **Causa:** End time es pasado
- **Fix:** Usar timestamp futuro

### Build falla en Solana Playground
- **Causa:** Sintaxis error
- **Fix:** Verifica que copiaste TODO el código

---

## ✅ CHECKLIST FINAL

- [ ] Smart contract deployado en Devnet
- [ ] Smart contract probado (create, bet, resolve, claim)
- [ ] Frontend integrado con Program ID correcto
- [ ] E2E test exitoso (crear market + hacer bet)
- [ ] Smart contract deployado en Mainnet
- [ ] Landing page live
- [ ] Video demo grabado
- [ ] Tweet de lanzamiento
- [ ] 50+ usuarios onboarded
- [ ] Hackathon submission enviado

---

## 🔗 Links Importantes

- **Solana Playground:** https://beta.solpg.io/
- **Solana Explorer (Devnet):** https://explorer.solana.com/?cluster=devnet
- **Solana Explorer (Mainnet):** https://explorer.solana.com/
- **Tu Wallet Address:** `CE9eV9nHiXzFPUQrC7G1Lzr2UvQd8Ks3wF2mN4jP6tL8`

---

## 📝 Notas

- **Costos:**
  - Build: Gratis
  - Deploy Devnet: ~0.1 SOL
  - Deploy Mainnet: ~0.3-0.5 SOL
  - Create Market: ~0.01 SOL
  - Place Bet: ~0.005 SOL

- **Tiempos:**
  - Build: 2-3 min
  - Deploy: 30 seg
  - Transaction: 1-2 seg

- **Backups:**
  - Siempre guarda el Program ID
  - Siempre descarga el IDL
  - Siempre guarda tu keypair

---

**🎯 OBJETIVO:** Deploy completo antes del **30 Oct 2025**

**💪 LETS GO! ESTAMOS A TIEMPO!**


