# 🚀 Guía Completa de Deployment Web3 para PrismaFi

## ⚠️ Problema Actual
- No se puede compilar localmente por falta de `build-sbf` (Solana CLI incompleto)
- SSL/network issues en WSL2 impiden instalación de Solana CLI
- Necesitamos una solución alternativa

## ✅ Solución: Solana Playground + Manual Integration

---

## PARTE 1: Deployment del Smart Contract (Solana Playground)

### Paso 1: Preparar el Código

1. **Accede a Solana Playground:**
   ```
   https://beta.solpg.io
   ```

2. **Crea un nuevo proyecto Anchor:**
   - Click en "+ New Project"
   - Selecciona "Anchor (Rust)"
   - Nombre: `prismafi-prediction-market`

3. **Reemplaza el contenido de `lib.rs`:**
   - Abre: `src/lib.rs` en Playground
   - Copia TODO el contenido de: `prediction-market-contract/programs/prediction_market/src/lib.rs`
   - Pega en Playground

4. **Actualiza `Cargo.toml`:**
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

### Paso 2: Compilar en Playground

1. Click en "Build" (icono de martillo 🔨)
2. Espera a que compile (1-3 minutos)
3. Si hay errores, repórtalos para corregir

### Paso 3: Configurar Wallet

1. **Conecta Wallet:**
   - Click en el icono de wallet (arriba derecha)
   - Selecciona "Phantom" o "Import Keypair"

2. **Cambiar a Devnet:**
   - Click en el selector de red
   - Selecciona "Devnet"

3. **Obtener SOL:**
   ```
   Desde Playground: Click en "Airdrop" button
   O manualmente: https://faucet.solana.com
   ```
   - Necesitas ~2 SOL para deployment

### Paso 4: Deploy

1. Click en "Deploy" button (🚀)
2. Confirma la transacción en Phantom
3. Espera confirmación (10-30 segundos)
4. **GUARDA EL PROGRAM ID** (aparecerá en consola)

Ejemplo:
```
Program ID: Abc123...XyZ789
```

### Paso 5: Descargar IDL

1. Después del deploy, ve a la tab "IDL"
2. Click en "Download IDL"
3. Guarda el archivo `prismafi_prediction_market.json`

---

## PARTE 2: Integración con el Frontend

### Paso 6: Actualizar Program ID

1. **Edita: `prediction-market/src/lib/solana/programId.ts`**
   ```typescript
   import { PublicKey } from '@solana/web3.js';

   // ⚠️ ACTUALIZA ESTE ID CON EL TUYO DEL DEPLOYMENT
   export const PROGRAM_ID = new PublicKey(
     'TU_PROGRAM_ID_AQUI'  // Pega el Program ID de Solana Playground
   );

   export const DEVNET_RPC = 'https://api.devnet.solana.com';
   export const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';

   export function getCurrentRpcEndpoint(): string {
     const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
     return network === 'mainnet-beta' ? MAINNET_RPC : DEVNET_RPC;
   }
   ```

### Paso 7: Actualizar IDL

1. **Copia el IDL descargado a: `prediction-market/src/lib/solana/idl.ts`**
   ```typescript
   export const IDL = {
     // Pega aquí el contenido del JSON descargado
   };

   export type PredictionMarketIDL = typeof IDL;
   ```

### Paso 8: Instalar Dependencias

```bash
cd prediction-market
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @coral-xyz/anchor --legacy-peer-deps
```

### Paso 9: Verificar Variables de Entorno

**Crea/edita `.env.local`:**
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=TU_PROGRAM_ID_AQUI
```

---

## PARTE 3: Testing

### Paso 10: Test de Conexión

1. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Abre en navegador:**
   ```
   http://localhost:3000
   ```

3. **Conecta Phantom:**
   - Asegúrate que Phantom esté en Devnet
   - Click "Connect Wallet"
   - Aprueba la conexión

4. **Verifica que el wallet se conectó:**
   - Deberías ver tu address en la UI

### Paso 11: Test de Create Market

1. Ve a: `http://localhost:3000/create-market`
2. Llena el formulario:
   ```
   Question: ¿Bitcoin alcanzará $100k en 2025?
   Description: Precio según CoinGecko al 31 de diciembre
   Category: Crypto
   End Date: 2025-12-31
   ```
3. Click "Create Market"
4. Aprueba la transacción en Phantom
5. Espera confirmación

**Si funciona:** ✅ Market creado, transacción visible en Explorer
**Si falla:** Ver sección de Troubleshooting

### Paso 12: Test de Place Bet

1. Ve a: `http://localhost:3000/markets`
2. Selecciona un market
3. Click "Bet YES" o "Bet NO"
4. Ingresa un monto (ej: 0.1 SOL)
5. Confirma en Phantom
6. Verifica en Explorer

---

## PARTE 4: Verificación en Explorer

### Paso 13: Verificar el Program

```
https://explorer.solana.com/address/TU_PROGRAM_ID_AQUI?cluster=devnet
```

**Deberías ver:**
- Executable: Yes
- Owner: BPFLoaderUpgradeable...
- Balance: X SOL

### Paso 14: Verificar Transacciones

1. Copia transaction signature después de cada operación
2. Busca en Explorer:
   ```
   https://explorer.solana.com/tx/TRANSACTION_SIGNATURE?cluster=devnet
   ```

3. Revisa:
   - Status: Success ✅
   - Instructions: Ver detalles
   - Logs: Ver mensajes del programa

---

## 🛠️ Troubleshooting

### Error: "Transaction simulation failed"

**Causas:**
1. Insufficient funds (necesitas al menos 0.1 SOL)
2. Program ID incorrecto en el frontend
3. IDL no coincide con el deployed program
4. Market end date en el pasado

**Solución:**
```bash
# 1. Verifica balance
# En Phantom o: https://explorer.solana.com

# 2. Verifica Program ID
# En prediction-market/src/lib/solana/programId.ts

# 3. Re-descarga el IDL
# Desde Solana Playground después del deploy

# 4. Verifica end_date > Date.now()
```

### Error: "Program not found"

**Causa:** Program ID incorrecto

**Solución:**
1. Verifica el Program ID en Solana Playground después del deploy
2. Actualiza en `programId.ts`
3. Reinicia el servidor: `npm run dev`

### Error: "Wallet not connected"

**Solución:**
1. Phantom instalado y abierto
2. Cambia a Devnet en Phantom
3. Click "Connect Wallet" en la app
4. Aprueba en Phantom

### Error: "IDL parse error"

**Causa:** IDL desactualizado o malformado

**Solución:**
1. Re-descarga el IDL desde Solana Playground
2. Asegúrate de copiar el JSON completo
3. Verifica que sea JSON válido (no TypeScript)
4. Reinicia el servidor

---

## 📊 Checklist de Deployment

```
Smart Contract:
[ ] Código compilado en Solana Playground
[ ] Deployed a Devnet
[ ] Program ID guardado
[ ] IDL descargado
[ ] Verificado en Explorer

Frontend:
[ ] Program ID actualizado en código
[ ] IDL actualizado en código
[ ] Dependencies instaladas
[ ] Variables de entorno configuradas
[ ] Servidor corriendo

Testing:
[ ] Wallet conectada
[ ] Create Market funciona
[ ] Place Bet funciona
[ ] Transacciones en Explorer
[ ] Logs sin errores

---

## 🎯 Próximos Pasos después del Deployment

1. **Deploy a Mainnet:**
   - Repite el proceso pero en Mainnet
   - Necesitarás SOL REAL para deploy (~0.5-1 SOL)
   - Actualiza `.env.local` a `mainnet-beta`

2. **Deploy Frontend a Vercel:**
   ```bash
   cd prediction-market
   vercel
   ```

3. **Configurar Custom Domain:**
   - En Vercel dashboard
   - Settings > Domains

4. **Monitoring:**
   - Configurar alertas en Helius/QuickNode
   - Dashboard de analytics

---

## 📚 Recursos

- Solana Playground: https://beta.solpg.io
- Solana Explorer: https://explorer.solana.com
- Phantom Wallet: https://phantom.app
- Faucet: https://faucet.solana.com
- Anchor Docs: https://www.anchor-lang.com

---

## 🆘 Si Nada Funciona

**Opción 1: Usa Solana Playground completamente**
- Deploy allí
- Usa su built-in wallet
- Test en su interface

**Opción 2: Usa un RPC provider premium**
- Helius: https://helius.dev
- QuickNode: https://quicknode.com
- Ambos tienen free tiers

**Opción 3: Docker (para evitar WSL2 issues)**
```bash
# Dockerfile para el build
docker run --rm -v "$(pwd)":/workspace solanalabs/solana:v1.18.0 anchor build
```

---

**¿Listo para empezar?**

1. Abre Solana Playground
2. Crea el proyecto
3. Sigue los pasos 1-14
4. Reporta cualquier error para ayuda inmediata





