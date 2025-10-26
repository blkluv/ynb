# ✅ Deploy Checklist - Sigue Estos Pasos

## 🎯 OBJETIVO
Deployar smart contract a Devnet y conectarlo al frontend en **15-20 minutos**.

---

## 📍 ANTES DE EMPEZAR

- [ ] Tengo Chrome o Firefox abierto
- [ ] Tengo mi wallet Solana (Phantom/Solflare) instalada
- [ ] Tengo al menos 2 SOL en Devnet (usa faucet si no)
- [ ] Tengo `DEPLOY_TO_DEVNET_NOW.md` abierto como guía

---

## 🚀 FASE 1: DEPLOY EN PLAYGROUND (10 min)

### Paso 1: Preparación
- [ ] Abrir https://beta.solpg.io/
- [ ] Conectar wallet
- [ ] Verificar que estoy en **Devnet** (arriba a la derecha)
- [ ] Solicitar 2 SOL del faucet si necesito

### Paso 2: Crear Proyecto
- [ ] Click "Create a new project"
- [ ] Nombre: `prismafi-prediction-market`
- [ ] Template: Anchor (Rust)

### Paso 3: Copiar Código
- [ ] Abrir `src/lib.rs` en Playground
- [ ] Seleccionar TODO (Ctrl+A)
- [ ] Borrar todo
- [ ] Abrir `PRISMAFI_SIMPLE_PLAYGROUND.rs` local
- [ ] Copiar TODO el contenido
- [ ] Pegar en Playground
- [ ] Verificar: ~285 líneas

### Paso 4: Build
- [ ] Click en "Build" 🔨
- [ ] Esperar mensaje: "✓ Build successful!"
- [ ] Copiar el **Program ID** generado
- [ ] Guardar Program ID en notepad: `_________________`

### Paso 5: Deploy
- [ ] Click en "Deploy" 🚀
- [ ] Aprobar transacción en wallet
- [ ] Esperar mensaje: "✓ Program deployed successfully!"
- [ ] Copiar **Transaction URL** del explorer
- [ ] Guardar TX URL: `_________________`

### Paso 6: Descargar IDL
- [ ] Click en "Export" o "Download"
- [ ] Descargar `prediction_market.json`
- [ ] Abrir el archivo y copiar TODO el contenido
- [ ] Tenerlo listo para pegar

---

## 💻 FASE 2: ACTUALIZAR FRONTEND (8 min)

### Paso 7: Actualizar Program ID (Automático)
```bash
# Ejecutar este comando con TU Program ID:
node update-program-id.js TU_PROGRAM_ID_AQUI
```

- [ ] Ejecutar comando
- [ ] Ver mensaje: "✅ Program ID actualizado exitosamente"

### Paso 8: Actualizar IDL (Manual)
- [ ] Abrir: `prediction-market/src/lib/solana/idl.ts`
- [ ] Seleccionar TODO (Ctrl+A)
- [ ] Borrar todo
- [ ] Pegar el IDL que copiaste en Paso 6
- [ ] Agregar al inicio:
```typescript
export type PredictionMarket = typeof IDL;
```
- [ ] Agregar al final:
```typescript
export { IDL };
```
- [ ] Guardar archivo

### Paso 9: Verificar RPC Endpoint
- [ ] Abrir: `prediction-market/src/lib/solana/programId.ts`
- [ ] Verificar línea con `getCurrentRpcEndpoint()`
- [ ] Debe decir: `'https://api.devnet.solana.com'`
- [ ] Si no, cambiarlo

### Paso 10: Probar Localmente
```bash
cd prediction-market
npm run dev
```

- [ ] Ejecutar comandos
- [ ] Abrir http://localhost:3000
- [ ] Conectar wallet (cambiar a Devnet en wallet)
- [ ] Ver si la página carga sin errores
- [ ] Revisar consola del navegador (F12): sin errores rojos

---

## 🧪 FASE 3: TESTING (5 min)

### Paso 11: Probar Crear Mercado (Opcional si hay UI)
- [ ] Click en "Create Market"
- [ ] Llenar formulario:
  - Question: "Test market?"
  - Description: "Testing deployment"
  - End Time: Mañana
  - Category: "Test"
- [ ] Submit
- [ ] Ver transacción en wallet
- [ ] Aprobar
- [ ] Ver confirmación

### Paso 12: Verificar en Explorer
- [ ] Ir a https://explorer.solana.com/?cluster=devnet
- [ ] Buscar tu Program ID
- [ ] Ver que existe y tiene transacciones

---

## 🚀 FASE 4: DEPLOY A PRODUCCIÓN (5 min)

### Paso 13: Commit y Push
```bash
git add -A
git commit -m "feat: Connect to deployed smart contract on Devnet"
git push origin main
```

- [ ] Ejecutar comandos
- [ ] Ver confirmación de push

### Paso 14: Verificar Vercel
- [ ] Ir a https://vercel.com/edgadafis-projects/cypherpunk-hackathon2025
- [ ] Esperar build (~2 min)
- [ ] Ver status: "Ready" ✅

### Paso 15: Probar Sitio Live
- [ ] Abrir: https://cypherpunk-hackathon2025.vercel.app/
- [ ] Conectar wallet (Devnet)
- [ ] Verificar que funciona
- [ ] Intentar crear un mercado

---

## 🎉 FASE 5: LIMPIAR UI (Opcional, 3 min)

### Paso 16: Quitar Banner DEMO MODE
- [ ] Abrir: `prediction-market/src/app/markets/page.tsx`
- [ ] Buscar: `{/* Demo Mode Banner */}`
- [ ] Comentar o borrar ese div completo
- [ ] Guardar

### Paso 17: Push Final
```bash
git add -A
git commit -m "feat: Remove DEMO MODE banner"
git push origin main
```

- [ ] Ejecutar comandos
- [ ] Esperar Vercel rebuild
- [ ] Verificar sitio live

---

## ✅ VERIFICACIÓN FINAL

### Checklist de Éxito
- [ ] Smart contract deployado en Devnet
- [ ] Program ID: `_________________`
- [ ] Transaction visible en Explorer
- [ ] Frontend conectado a Devnet
- [ ] Sitio live funciona: https://cypherpunk-hackathon2025.vercel.app/
- [ ] Puedo conectar wallet
- [ ] Puedo crear mercados (o está en progreso)
- [ ] Sin errores en consola del navegador

---

## 📋 INFORMACIÓN PARA LA PRESENTACIÓN

```
🌐 Sitio Live:
https://cypherpunk-hackathon2025.vercel.app/

🔍 Smart Contract (Devnet):
https://explorer.solana.com/address/[TU_PROGRAM_ID]?cluster=devnet

📦 Código Fuente:
https://github.com/Edgadafi/cypherpunk-hackathon2025

📄 Transaction del Deploy:
[URL que guardaste en Paso 5]
```

---

## 🆘 SI ALGO FALLA

### ❌ Build error en Playground
→ Refresca la página
→ Intenta en otro navegador (Chrome/Firefox)
→ Verifica que copiaste el código completo

### ❌ Deploy error en Playground
→ Verifica que tienes SOL en Devnet
→ Intenta de nuevo (puede ser network issue)
→ Cambia a otro RPC en Playground settings

### ❌ Frontend no conecta
→ Verifica Program ID
→ Verifica IDL
→ Revisa consola del navegador (F12)
→ Asegúrate de estar en Devnet en tu wallet

### ❌ Vercel build falla
→ Verifica que compile localmente: `npm run build`
→ Revisa errores de TypeScript
→ Confirma que IDL tiene el formato correcto

---

## 🎯 TIEMPO TOTAL ESTIMADO

- ✅ Fase 1 (Playground): **10 min**
- ✅ Fase 2 (Frontend): **8 min**
- ✅ Fase 3 (Testing): **5 min**
- ✅ Fase 4 (Deploy): **5 min**
- ✅ Fase 5 (Limpiar): **3 min**

**TOTAL: ~30 minutos**

---

## 🚀 ¡EMPECEMOS!

**Dime cuando hayas completado cada fase y te guiaré en la siguiente.**

✅ = Completado
🔄 = En progreso
⏸️ = Pausado
❌ = Error

