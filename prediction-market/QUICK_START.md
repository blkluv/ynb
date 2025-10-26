# 🚀 Quick Start - Testing Ready

**Status:** ✅ Servidor corriendo en http://localhost:3000

---

## ✅ Setup Completado

```
[✅] Smart Contract deployado a Devnet
[✅] Program ID: 9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka
[✅] Dependencias instaladas (1177 packages)
[✅] Next.js servidor corriendo
[✅] Frontend 100% integrado con smart contract
```

---

## 🎯 TESTING EN 3 PASOS

### Paso 1: Abre el Frontend (5 seg)

```
Abre tu navegador y ve a:
http://localhost:3000

Deberías ver:
- Landing page de Trepa
- "Accountability Markets for LATAM"
- Botón "Connect Wallet" arriba derecha
```

### Paso 2: Conecta tu Wallet (10 seg)

```
1. Click "Connect Wallet"
2. Selecciona Phantom o Solflare
3. Asegúrate de estar en Devnet
4. Aprueba la conexión
5. Tu address debería aparecer en el header
```

### Paso 3: Crea un Mercado (2 min)

```
1. Click "Create Market" en el navbar
2. Llena el formulario:

   Question:
   ¿Bitcoin superará $100,000 USD en 2025?

   Description:
   This market resolves YES if Bitcoin (BTC) reaches or 
   exceeds $100,000 USD on any major exchange before 
   December 31, 2025 23:59 UTC.

   Category: Crypto
   End Date: [30 días en el futuro]
   End Time: 23:59

3. Click "Create Market"
4. Aprueba en wallet (~0.01 SOL)
5. ✅ Verás un alert con transaction signature
6. ✅ Serás redirigido al market detail
```

---

## 📊 Test Completo (5 minutos)

```
✅ Paso 1: Create Market (completado arriba)

✅ Paso 2: Ver Markets
   • Click "Markets"
   • Tu mercado debería aparecer
   • Pool YES: 0.00 SOL
   • Pool NO: 0.00 SOL

✅ Paso 3: Apostar YES
   • Click en tu mercado
   • Selecciona YES (verde)
   • Ingresa 0.1 SOL
   • Click "Place YES Bet"
   • Aprueba en wallet
   • ✅ Pool YES = ~0.1 SOL

✅ Paso 4: Apostar NO (opcional)
   • Selecciona NO (rojo)
   • Ingresa 0.05 SOL
   • Click "Place NO Bet"
   • ✅ Pool NO = ~0.05 SOL
   • ✅ Odds = 67% YES / 33% NO

✅ Paso 5: Resolution (solo si expiró)
   • Solo visible para creator
   • Solo después de end_time
   • Selecciona YES WINS o NO WINS
   • Aprueba en wallet
   • ✅ Market marcado como "Resolved"
```

---

## 🔗 Links Importantes

- **Frontend**: http://localhost:3000
- **Program Explorer**: https://explorer.solana.com/address/9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka?cluster=devnet
- **Solana Explorer** (para ver transactions): https://explorer.solana.com/?cluster=devnet

---

## 💰 Balance Check

```bash
# Ver tu balance en Devnet
solana balance --url devnet

# Si necesitas más SOL
solana airdrop 1 --url devnet
```

Current balance: 0.35 SOL ✅ (suficiente para testing)

---

## 🐛 Troubleshooting Rápido

**Frontend no carga**
```bash
# Verifica que el servidor esté corriendo
curl http://localhost:3000

# Si no responde, reinicia:
cd ~/cypherpunk-hackathon2025/prediction-market
npm run dev
```

**Wallet no se conecta**
- Asegúrate de estar en Devnet (no Mainnet)
- Verifica que Phantom/Solflare estén actualizados
- Refresca la página

**Transaction fails**
- Verifica balance: `solana balance --url devnet`
- Revisa Console (F12) para error específico
- Asegúrate de que la wallet esté en Devnet

---

## 📸 Screenshots para Video

Captura estos momentos:
1. Landing page
2. Create Market form
3. Transaction success alert
4. Market en la lista
5. Betting interface
6. Pools actualizándose
7. Resolution interface

---

## 🎬 Video Demo

**Script rápido (3 min):**

```
[0:00-0:30] "Presentando Trepa - Accountability Markets"
[0:30-1:30] Demo: Crear mercado + apostar
[1:30-2:00] Mostrar transaction en Explorer
[2:00-2:30] Tech stack (Solana + Anchor + Next.js)
[2:30-3:00] Roadmap + call to action
```

---

## ✅ Ready to Test!

**Abre ahora:** http://localhost:3000

Sigue los 3 pasos arriba y cualquier problema revisa:
- Console del navegador (F12)
- `TESTING_GUIDE.md` para guía completa
- Terminal para logs del servidor

**¡Buena suerte!** 🚀


