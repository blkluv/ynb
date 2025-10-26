# 🎨 Frontend Integration Guide

## ✅ Configuración Completa

### Archivos configurados:
- ✅ `src/lib/program/constants.ts` - Program ID y configuración
- ✅ `src/idl/prediction_market.json` - IDL del programa
- ✅ `src/lib/program/predictionMarket.ts` - Helper functions

---

## 🚀 Quick Start

### 1. Instalar dependencias (si no está hecho)

```bash
cd ~/cypherpunk-hackathon2025/prediction-market
npm install --legacy-peer-deps
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

---

## 📖 Uso del SDK

### Conectar Wallet y obtener programa

```typescript
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "@/lib/program/predictionMarket";

function MyComponent() {
  const wallet = useAnchorWallet();
  
  if (!wallet) {
    return <div>Conecta tu wallet</div>;
  }
  
  const program = getProgram(wallet);
  
  // Ahora puedes usar el programa...
}
```

### Crear un mercado

```typescript
import { createMarket } from "@/lib/program/predictionMarket";

async function handleCreateMarket() {
  const question = "¿Milei cumplirá su promesa X antes de fin de año?";
  const description = "Detalles de la promesa y criterios de resolución...";
  const endTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 días
  
  try {
    const { signature, marketPubkey } = await createMarket(
      program,
      question,
      description,
      endTime
    );
    
    console.log("Market created!");
    console.log("Transaction:", signature);
    console.log("Market address:", marketPubkey.toString());
  } catch (error) {
    console.error("Error creating market:", error);
  }
}
```

### Apostar en un mercado

```typescript
import { placeBet } from "@/lib/program/predictionMarket";
import { PublicKey } from "@solana/web3.js";

async function handlePlaceBet(marketAddress: string) {
  const marketPubkey = new PublicKey(marketAddress);
  const amount = 0.1; // 0.1 SOL
  const betYes = true; // true = YES, false = NO
  
  try {
    const signature = await placeBet(program, marketPubkey, amount, betYes);
    console.log("Bet placed! Transaction:", signature);
  } catch (error) {
    console.error("Error placing bet:", error);
  }
}
```

### Resolver un mercado (solo authority)

```typescript
import { resolveMarket } from "@/lib/program/predictionMarket";
import { PublicKey } from "@solana/web3.js";

async function handleResolveMarket(marketAddress: string) {
  const marketPubkey = new PublicKey(marketAddress);
  const outcome = true; // true = YES wins, false = NO wins
  
  try {
    const signature = await resolveMarket(program, marketPubkey, outcome);
    console.log("Market resolved! Transaction:", signature);
  } catch (error) {
    console.error("Error resolving market:", error);
  }
}
```

### Obtener información de un mercado

```typescript
import { fetchMarket, calculateOdds, formatSOL } from "@/lib/program/predictionMarket";
import { PublicKey } from "@solana/web3.js";

async function displayMarket(marketAddress: string) {
  const marketPubkey = new PublicKey(marketAddress);
  const market = await fetchMarket(program, marketPubkey);
  
  if (!market) {
    console.log("Market not found");
    return;
  }
  
  const odds = calculateOdds(market.yesAmount, market.noAmount);
  
  console.log("Question:", market.question);
  console.log("Description:", market.description);
  console.log("YES pool:", formatSOL(market.yesAmount), "SOL");
  console.log("NO pool:", formatSOL(market.noAmount), "SOL");
  console.log("YES odds:", odds.yesPercentage.toFixed(2), "%");
  console.log("NO odds:", odds.noPercentage.toFixed(2), "%");
  console.log("Resolved:", market.resolved);
  
  if (market.resolved) {
    console.log("Winner:", market.winningOutcome ? "YES" : "NO");
  }
}
```

### Listar todos los mercados

```typescript
import { fetchAllMarkets } from "@/lib/program/predictionMarket";

async function displayAllMarkets() {
  const markets = await fetchAllMarkets(program);
  
  console.log(`Found ${markets.length} markets`);
  
  markets.forEach(({ pubkey, account }) => {
    console.log("\n---");
    console.log("Address:", pubkey.toString());
    console.log("Question:", account.question);
    console.log("Resolved:", account.resolved);
  });
}
```

---

## 🎯 Demo Flow para Hackathon

### Flujo completo de ejemplo:

```typescript
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getProgram, createMarket, placeBet, resolveMarket, fetchMarket } from "@/lib/program/predictionMarket";
import { useState } from "react";

export default function DemoPage() {
  const wallet = useAnchorWallet();
  const [status, setStatus] = useState("");
  
  if (!wallet) {
    return <div>Conecta tu wallet para continuar</div>;
  }
  
  const program = getProgram(wallet);
  
  async function runDemo() {
    try {
      setStatus("1️⃣ Creando mercado...");
      const { marketPubkey } = await createMarket(
        program,
        "¿Argentina ganará la próxima Copa América?",
        "Mercado se resolverá basado en el resultado oficial del torneo.",
        Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 días
      );
      
      setStatus(`2️⃣ Mercado creado: ${marketPubkey.toString()}`);
      
      // Esperar confirmación
      await new Promise(r => setTimeout(r, 2000));
      
      setStatus("3️⃣ Usuario 1 apuesta YES con 0.1 SOL...");
      await placeBet(program, marketPubkey, 0.1, true);
      
      await new Promise(r => setTimeout(r, 2000));
      
      setStatus("4️⃣ Usuario 2 apuesta NO con 0.05 SOL...");
      await placeBet(program, marketPubkey, 0.05, false);
      
      await new Promise(r => setTimeout(r, 2000));
      
      setStatus("5️⃣ Mostrando estado del mercado...");
      const market = await fetchMarket(program, marketPubkey);
      
      if (market) {
        console.log("Pool YES:", market.yesAmount / 1e9, "SOL");
        console.log("Pool NO:", market.noAmount / 1e9, "SOL");
      }
      
      setStatus("✅ Demo completado!");
      
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Demo Prediction Market</h1>
      <button 
        onClick={runDemo}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Ejecutar Demo
      </button>
      <div className="mt-4">
        <p>{status}</p>
      </div>
    </div>
  );
}
```

---

## 🔗 Links Útiles

- **Program ID**: `9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka`
- **Explorer**: https://explorer.solana.com/address/9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka?cluster=devnet
- **RPC**: https://api.devnet.solana.com
- **Network**: Devnet

---

## 🐛 Troubleshooting

### Error: "Wallet not connected"
- Asegúrate de que el usuario haya conectado su wallet
- Usa `useAnchorWallet()` para obtener el wallet

### Error: "Insufficient funds"
- El usuario necesita SOL en Devnet
- Airdrop: `solana airdrop 2 --url devnet`

### Error: "Transaction simulation failed"
- Verifica que el mercado exista
- Verifica que el usuario tenga suficiente SOL
- Revisa que la apuesta sea >= 0.01 SOL

### Error: "Invalid authority"
- Solo el creador del mercado puede resolverlo
- Verifica que estés usando la wallet correcta

---

## 📱 Next Steps

- [ ] Crear componente `CreateMarketForm`
- [ ] Crear componente `MarketCard` para listar mercados
- [ ] Crear componente `BettingInterface` para apostar
- [ ] Crear página de resolución (admin)
- [ ] Agregar notificaciones de transacciones
- [ ] Agregar manejo de errores user-friendly

---

**Creado: 2025-10-25** ✅


