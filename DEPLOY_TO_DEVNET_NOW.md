# 🚀 Deploy a Devnet - Guía Paso a Paso (Garantizada)

## ⏱️ Tiempo Estimado: 15-20 minutos

---

## 📋 PASO 1: Abrir Solana Playground (2 min)

### 1.1 Abre el navegador (Chrome o Firefox recomendado)
```
https://beta.solpg.io/
```

### 1.2 Conecta tu wallet
- Click en "Connect Wallet" (arriba a la derecha)
- Selecciona Phantom, Solflare, o cualquier wallet
- Aprueba la conexión
- **IMPORTANTE**: Asegúrate de estar en **Devnet** (se muestra arriba)

### 1.3 Solicita SOL de Devnet (si no tienes)
- Click en "Airdrop" o el ícono de grifo 💧
- Solicita 2-3 SOL (suficiente para deploy)
- Espera confirmación (~5 segundos)

---

## 📋 PASO 2: Crear Proyecto Nuevo (1 min)

### 2.1 Crear proyecto
- Click en "Create a new project" o el ícono "+"
- Nombre: **"prismafi-prediction-market"**
- Template: **Anchor (Rust)**
- Click "Create"

### 2.2 Verificar estructura
Deberías ver:
```
prismafi-prediction-market/
├── src/
│   └── lib.rs  ← ESTE es el archivo que vamos a editar
└── Cargo.toml
```

---

## 📋 PASO 3: Copiar el Código (3 min)

### 3.1 Abrir lib.rs
- En el explorador de archivos de Playground
- Click en `src/lib.rs`
- Verás código de ejemplo

### 3.2 Reemplazar TODO el código
- **Selecciona TODO** (Ctrl+A o Cmd+A)
- **Borra** todo el código existente
- **Copia** el contenido completo de `PRISMAFI_SIMPLE_PLAYGROUND.rs`
- **Pega** en el editor

### 3.3 Verificar que pegó correctamente
- Scroll al inicio: debe decir `use anchor_lang::prelude::*;`
- Scroll al final: debe decir enum `PredictionMarketError`
- Total: ~285 líneas

---

## 📋 PASO 4: Build del Programa (3 min)

### 4.1 Click en "Build" (ícono de martillo 🔨)
- Ubicado en la barra superior
- O usa atajo: `Ctrl+S` / `Cmd+S`

### 4.2 Espera la compilación
Verás en la terminal:
```
Building...
✓ Build successful!
Program ID: AbcD...xYz (se genera automáticamente)
```

**SI FALLA EL BUILD:**
- ❌ Error: "cargo not found" → Refresca la página e intenta de nuevo
- ❌ Error: "syntax error" → Verifica que copiaste el código completo
- ❌ Error: "unknown" → Cambia de navegador (usa Chrome/Firefox)
- ❌ Error persistente → Avísame y cambio estrategia

### 4.3 Copiar Program ID
- Cuando el build sea exitoso, verás el Program ID en la terminal
- **COPIA** este Program ID (ejemplo: `7xKX...g2CW`)
- **GUÁRDALO** en un notepad temporalmente

---

## 📋 PASO 5: Deploy a Devnet (2 min)

### 5.1 Click en "Deploy" (ícono de cohete 🚀)
- Ubicado al lado del botón "Build"
- Confirma que estás en **Devnet** (no Mainnet)

### 5.2 Aprobar transacción en wallet
- Tu wallet (Phantom/Solflare) abrirá un popup
- Revisa: "Deploy program to Devnet"
- Click "Approve"

### 5.3 Espera la confirmación
Verás en la terminal:
```
Deploying...
✓ Program deployed successfully!
Program ID: 7xKX...g2CW
Transaction: https://explorer.solana.com/tx/...?cluster=devnet
```

**¡ÉXITO!** 🎉 Tu smart contract está en Devnet.

### 5.4 Verificar en Solana Explorer
- Click en el link del transaction
- Deberías ver: "Transaction successful" ✅
- Copia la URL del explorer para la presentación

---

## 📋 PASO 6: Descargar IDL (2 min)

### 6.1 Obtener el IDL
En Solana Playground:
- Click en el ícono de "Export" o "Download"
- Busca "Download IDL"
- Guarda el archivo `prediction_market.json`

**ALTERNATIVA** (si no hay botón de download):
- En el terminal de Playground, copia todo el JSON que aparece
- Pégalo en un notepad temporalmente

### 6.2 Copiar el contenido del IDL
- Abre el archivo `prediction_market.json` descargado
- Selecciona TODO el contenido
- Cópialo

---

## 📋 PASO 7: Actualizar Frontend (5 min)

Ahora vamos a conectar el frontend con tu smart contract deployado.

### 7.1 Actualizar Program ID
```typescript
// Archivo: prediction-market/src/lib/solana/programId.ts
export const PROGRAM_ID = new PublicKey('TU_PROGRAM_ID_AQUI')
//                                       ^^^^^^^^^^^^^^^^^^^^
//                                       Pega el Program ID del Paso 4.3
```

### 7.2 Actualizar IDL
```typescript
// Archivo: prediction-market/src/lib/solana/idl.ts
// Reemplaza TODO el contenido con el IDL del Paso 6.2
```

### 7.3 Cambiar RPC a Devnet
```typescript
// Archivo: prediction-market/src/lib/solana/programId.ts
export function getCurrentRpcEndpoint(): string {
  return 'https://api.devnet.solana.com'  // ← Verifica que diga "devnet"
}
```

---

## 📋 PASO 8: Probar Localmente (3 min)

### 8.1 Iniciar servidor local
```bash
cd prediction-market
npm run dev
```

### 8.2 Abrir en navegador
```
http://localhost:3000
```

### 8.3 Conectar wallet a Devnet
- En tu wallet (Phantom/Solflare)
- Cambia la red a **Devnet**
- Conecta wallet en el sitio

### 8.4 Intentar crear un mercado
- Click en "Create Market" (si la página lo permite)
- Llena el formulario con un mercado simple:
  - Question: "Test?"
  - Description: "Test market"
  - End Time: Mañana
  - Category: "Test"
- Submit

**SI FUNCIONA:** ✅ ¡Perfecto! Continúa al siguiente paso.
**SI FALLA:** ⚠️ Revisa la consola del navegador (F12) y avísame el error.

---

## 📋 PASO 9: Deploy a Vercel (3 min)

### 9.1 Commit y push
```bash
git add -A
git commit -m "feat: Connect to deployed smart contract on Devnet"
git push origin main
```

### 9.2 Espera Vercel auto-deploy
- Ve a https://vercel.com/edgadafis-projects/cypherpunk-hackathon2025
- Espera que el build complete (~2 min)
- Status debe cambiar a "Ready" ✅

### 9.3 Verificar sitio live
```
https://cypherpunk-hackathon2025.vercel.app/
```

---

## 📋 PASO 10: Quitar Banner "DEMO MODE" (Opcional, 2 min)

Si el deploy fue exitoso, puedes quitar el banner de demo.

### 10.1 Editar markets page
```typescript
// Archivo: prediction-market/src/app/markets/page.tsx
// Elimina o comenta las líneas del banner "DEMO MODE":

{/* Demo Mode Banner */}
{/* <div className="mb-6 bg-gradient-to-r from-yellow-500/20...">
  ...
</div> */}
```

### 10.2 Commit y push de nuevo
```bash
git add -A
git commit -m "feat: Remove DEMO MODE banner - connected to Devnet"
git push origin main
```

---

## ✅ CHECKLIST FINAL

Antes de presentar, verifica:

- [ ] Smart contract deployado en Devnet ✅
- [ ] Program ID copiado y guardado ✅
- [ ] IDL descargado ✅
- [ ] Frontend actualizado con Program ID real ✅
- [ ] RPC apunta a Devnet ✅
- [ ] Sitio live en Vercel ✅
- [ ] Puedes crear mercados desde el sitio ✅
- [ ] Transaction visible en Solana Explorer ✅
- [ ] Banner "DEMO MODE" removido (opcional) ✅

---

## 🎯 URLs Para la Presentación

```
🌐 Sitio Live:
https://cypherpunk-hackathon2025.vercel.app/

🔍 Smart Contract en Devnet:
https://explorer.solana.com/address/[TU_PROGRAM_ID]?cluster=devnet

📦 Repositorio:
https://github.com/Edgadafi/cypherpunk-hackathon2025

📄 Transaction del Deploy:
[URL del explorer que obtuviste en Paso 5.3]
```

---

## 🆘 SI ALGO FALLA

### Playground no funciona
→ Avísame y usamos estrategia alternativa (deploy local)

### Build error en Playground
→ Refresca página y prueba de nuevo
→ Cambia de navegador (Chrome → Firefox)

### Frontend no conecta
→ Verifica Program ID
→ Verifica RPC endpoint
→ Revisa consola del navegador (F12)

### Vercel build falla
→ Revisa que el código TypeScript compile localmente primero

---

## 🚀 ¡VAMOS A HACERLO!

**Estoy listo para guiarte paso a paso. Dime cuando estés en Solana Playground y empezamos.**

