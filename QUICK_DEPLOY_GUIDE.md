# 🎯 DEPLOYMENT RÁPIDO - PRISMAFI WEB3

## OPCIÓN 1: Solana Playground (RECOMENDADO - 10 minutos)

### 📝 Paso a Paso Detallado

#### 1. Abrir Solana Playground
```
https://beta.solpg.io
```

#### 2. Conectar Wallet
- Click en icono de wallet (esquina superior derecha)
- Selecciona "Phantom"
- Aprueba la conexión
- Verifica que diga "Devnet" (selector de red)

#### 3. Crear Proyecto
- Click "+ New Project"
- Nombre: `prismafi-prediction-market`
- Template: "Anchor (Rust)"

#### 4. Copiar el Smart Contract
- Abre el archivo: `prediction-market-contract/SOLANA_PLAYGROUND_VERSION.rs`
- Copia TODO el contenido
- En Playground, abre `src/lib.rs`
- **Borra** todo el contenido existente
- **Pega** el código de PrismaFi

#### 5. Actualizar Cargo.toml
En Playground, abre `Cargo.toml` y reemplaza con:
```toml
[package]
name = "prismafi-prediction-market"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "prismafi_prediction_market"

[features]
default = []

[dependencies]
anchor-lang = "0.30.1"
```

#### 6. Obtener SOL de Devnet
- En Phantom, verifica que estés en "Devnet"
- En Playground, click botón "Airdrop" (💰)
- O visita: https://faucet.solana.com
- Necesitas ~2 SOL para deployment

#### 7. Build
- Click en botón "Build" (🔨)
- Espera 1-3 minutos
- Verifica que diga "Build successful"

**Si hay error:** Reporta el mensaje exacto

#### 8. Deploy
- Click en botón "Deploy" (🚀)
- **MUY IMPORTANTE:** Se abrirá popup de Phantom
- Verifica el costo (~0.5-1 SOL)
- Click "Approve"
- Espera confirmación (10-30 segundos)

#### 9. Copiar Program ID
**Después del deploy exitoso**, verás en la consola:
```
Program Id: ABC123XYZ...
```

**🔴 GUARDA ESTE ID - LO NECESITAS PARA EL FRONTEND**

Ejemplo: `6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7`

#### 10. Descargar IDL
- En Playground, click en tab "IDL"
- Click botón "Download"
- Guarda como `prismafi_prediction_market.json`

---

## PARTE 2: Conectar Frontend (5 minutos)

### 1. Actualizar Program ID

**Archivo:** `prediction-market/src/lib/solana/programId.ts`

```typescript
import { PublicKey } from '@solana/web3.js';

// 🔴 PEGA TU PROGRAM ID AQUÍ
export const PROGRAM_ID = new PublicKey(
  'PEGA_TU_PROGRAM_ID_AQUI'  // Ejemplo: 6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7
);

export const DEVNET_RPC = 'https://api.devnet.solana.com';
export const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';

export function getCurrentRpcEndpoint(): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  return network === 'mainnet-beta' ? MAINNET_RPC : DEVNET_RPC;
}
```

### 2. Actualizar IDL

**Archivo:** `prediction-market/src/lib/solana/idl.ts`

Abre el `prismafi_prediction_market.json` que descargaste y:

```typescript
// Copia el contenido del JSON descargado
export const IDL = {
  // PEGA AQUÍ EL CONTENIDO DEL JSON
} as const;

export type PredictionMarketIDL = typeof IDL;
```

### 3. Variables de Entorno

**Archivo:** `prediction-market/.env.local`

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=TU_PROGRAM_ID_AQUI
```

### 4. Instalar Dependencias

```bash
cd prediction-market
npm install --legacy-peer-deps
```

### 5. Iniciar Servidor

```bash
npm run dev
```

O usa el script:
```bash
.\START_PRISMAFI_SERVER.bat
```

---

## PARTE 3: Testing (5 minutos)

### Test 1: Conectar Wallet

1. Abre: `http://localhost:3000`
2. Click "Connect Wallet"
3. Selecciona Phantom
4. Aprueba
5. ✅ Deberías ver tu address

### Test 2: Verificar Program en Explorer

```
https://explorer.solana.com/address/TU_PROGRAM_ID?cluster=devnet
```

Deberías ver:
- Executable: Yes
- Owner: BPFLoaderUpgradeable...
- Balance: X SOL

### Test 3: Create Market

1. Ve a: `http://localhost:3000/create-market`
2. Llena el formulario:
   ```
   Question: ¿Bitcoin llegará a $100k en 2025?
   Description: Precio según CoinGecko al 31/12/2025
   Category: Crypto
   End Date: 2025-12-31
   ```
3. Click "Create Market"
4. Aprueba en Phantom
5. Espera confirmación
6. ✅ Verifica transaction en Explorer

### Test 4: Place Bet

1. Ve a Markets
2. Selecciona tu market
3. Click "Bet YES"
4. Monto: 0.1 SOL
5. Aprueba en Phantom
6. ✅ Verifica en Explorer

---

## 🎉 SI TODO FUNCIONA

**Deployment Exitoso!** 🚀

Ahora tienes:
- ✅ Smart contract deployado en Devnet
- ✅ Frontend conectado y funcionando
- ✅ Transacciones funcionando
- ✅ Wallet integration activa

### Siguiente Paso: Deploy Frontend a Vercel

```bash
cd prediction-market
npm install -g vercel
vercel
```

Sigue los prompts y tu app estará en:
```
https://tu-proyecto.vercel.app
```

---

## ❌ TROUBLESHOOTING

### "Build failed in Playground"

**Error común:** Versión de Anchor incorrecta

**Solución:**
1. Verifica que `Cargo.toml` tenga `anchor-lang = "0.30.1"`
2. Intenta con `"0.29.0"` si falla
3. Reporta el error exacto

### "Deploy failed - insufficient funds"

**Solución:**
1. Verifica balance en Phantom
2. Solicita más SOL: https://faucet.solana.com
3. Necesitas ~2 SOL para deployment seguro

### "Transaction simulation failed"

**Causas:**
- Program ID incorrecto en frontend
- IDL no actualizado
- Wallet en Mainnet (debe estar en Devnet)

**Solución:**
1. Verifica Program ID en `programId.ts`
2. Re-descarga IDL desde Playground
3. Verifica Phantom en Devnet

### "Cannot find module @solana/web3.js"

**Solución:**
```bash
cd prediction-market
npm install @solana/web3.js @coral-xyz/anchor --legacy-peer-deps
```

---

## 📊 CHECKLIST FINAL

```
Smart Contract:
[ ] Deployed en Solana Playground
[ ] Program ID guardado
[ ] Verificado en Explorer
[ ] IDL descargado

Frontend:
[ ] Program ID actualizado
[ ] IDL actualizado
[ ] Dependencies instaladas
[ ] Servidor corriendo
[ ] Wallet conectada

Testing:
[ ] Connect wallet funciona
[ ] Create market funciona
[ ] Place bet funciona
[ ] Transacciones visibles en Explorer
```

---

## 🆘 NECESITAS AYUDA?

1. **Pega el error exacto** que estás viendo
2. **Indica en qué paso** estás
3. **Screenshot** si es posible

**Recursos:**
- Solana Explorer: https://explorer.solana.com
- Faucet: https://faucet.solana.com
- Playground: https://beta.solpg.io

---

**Tiempo estimado total: 20-30 minutos** ⏱️

