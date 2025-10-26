# ⏰ MIENTRAS EL SCRIPT CORRE

## 🔄 **QUÉ ESTÁ PASANDO AHORA:**

El script `setup-solana-local.sh` está ejecutándose en background.

**Tiempo estimado:** 2-5 minutos

### **Lo que está haciendo:**

1. ✅ Instalando Solana CLI en WSL
2. ✅ Configurando Devnet
3. ✅ Creando/verificando wallet
4. ✅ Solicitando 2 SOL de prueba (airdrop)
5. ⏳ **Building el contrato** (~2 minutos) ← Aquí toma más tiempo
6. ⏳ Deploying a Devnet
7. ⏳ Copiando IDL al frontend

---

## 📊 **CUANDO TERMINE VERÁS:**

```
==================================
✨ DEPLOYMENT EXITOSO ✨
==================================

📍 Program ID: AbCd1234...XyZ5678
🌐 Network: Devnet
👛 Wallet: Tu_Wallet_Address

🎯 PRÓXIMOS PASOS:
1. Actualiza el Program ID en src/lib/solana-integration.ts
2. Ejecuta el frontend: npm run dev
3. ¡Conecta tu wallet y prueba!
```

---

## ✅ **LO QUE DEBES HACER DESPUÉS:**

### **Paso 1: Actualizar Program ID** (30 segundos)

1. Copia el Program ID que apareció en la terminal
2. Abre: `src/lib/solana-integration.ts`
3. Línea ~7, reemplaza:
   ```typescript
   export const PROGRAM_ID = new PublicKey('TU_PROGRAM_ID_AQUI')
   ```
4. Guarda (Ctrl+S)

### **Paso 2: Verificar IDL** (10 segundos)

Verifica que existe:

```
src/idl/prediction_market.json
```

Si NO existe, cópialo manualmente:

```bash
cp prediction-market-contract/target/idl/prediction_market.json src/idl/
```

### **Paso 3: Instalar dependencias frontend** (si no lo hiciste)

```bash
npm install
```

### **Paso 4: Correr frontend** (30 segundos)

```bash
npm run dev
```

Abre: http://localhost:3000

### **Paso 5: Conectar Phantom Wallet** (1 minuto)

1. Abre Phantom
2. Cambia a **Devnet**:
   - Settings → Developer Settings → Testnet Mode → ON
   - Network → Devnet
3. Si no tienes SOL:
   - https://faucet.solana.com/
   - Pega tu wallet address
   - Solicita SOL

### **Paso 6: Crear tu primer market!** 🎉

1. Click "Create Market"
2. Llena el formulario:
   - Question: "¿Bitcoin llegará a $100k en 2025?"
   - Description: "Market de prueba"
   - Category: "Crypto"
   - End Time: (fecha futura)
3. Click "Create Market"
4. Firma la transacción en Phantom
5. **¡Listo!**

---

## 🆘 **SI EL SCRIPT FALLA:**

### Error: "Airdrop failed"

**No problem:** Usa https://faucet.solana.com/ para obtener SOL

### Error: "anchor build failed"

**Posible causa:** Versión de Rust desactualizada
**Solución:**

```bash
wsl rustup update
```

### Error: "deploy failed - insufficient funds"

**Solución:** Más SOL necesario

```bash
wsl solana airdrop 2
```

---

## 📞 **MONITOREAR EL PROGRESO:**

Para ver qué está pasando, abre una nueva terminal PowerShell y ejecuta:

```bash
wsl tail -f ~/setup-solana.log
```

(Si guardamos logs)

O simplemente espera 5 minutos y revisa si apareció el mensaje de éxito.

---

## 🎯 **DESPUÉS DEL DEPLOY:**

Verifica tu contrato en Solana Explorer:

```
https://explorer.solana.com/address/TU_PROGRAM_ID?cluster=devnet
```

Deberías ver:

- ✅ Program deployed
- ✅ Executable: Yes
- ✅ On Devnet

---

**El script debería terminar en ~3-5 minutos. ¡Espera!** ⏰
