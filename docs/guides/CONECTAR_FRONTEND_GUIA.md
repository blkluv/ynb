# 🔗 Guía Completa: Conectar Frontend con Smart Contract

## Pre-requisitos

✅ Ya deployaste el contrato en Solana Playground (siguiendo `GUIA_SOLANA_PLAYGROUND_DEPLOY.md`)  
✅ Tienes el **Program ID** (ej: `7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA`)  
✅ Tienes el **IDL JSON** descargado/copiado

---

## PASO 1: Actualizar Program ID (2 min)

### 1.1 Ubicación del Archivo

```
📁 prediction-market/src/lib/solana/programId.ts
```

### 1.2 Reemplazar el Program ID

Abre el archivo y **actualiza la línea 23**:

```typescript
// ANTES (Program ID de ejemplo)
export const PROGRAM_ID = new PublicKey(
  '7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA'
)

// DESPUÉS (tu Program ID real de Playground)
export const PROGRAM_ID = new PublicKey(
  'TU_PROGRAM_ID_AQUI' // ← Pega el que te dio Solana Playground
)
```

**Guarda el archivo** (Ctrl+S)

---

## PASO 2: Actualizar el IDL (3 min)

### 2.1 Ubicación del Archivo

```
📁 prediction-market/src/lib/solana/idl.ts
```

### 2.2 Reemplazar el IDL completo

1. Abre `prediction-market/src/lib/solana/idl.ts`
2. En Solana Playground, ve al tab **"IDL"**
3. **Copia TODO el JSON** que aparece en Playground
4. **Reemplaza** el objeto `IDL` en el archivo (desde la línea 10)

**Estructura esperada:**

```typescript
export const IDL = {
  version: '0.1.0',
  name: 'prediction_market',
  instructions: [
    // ... (todo lo que copiaste de Playground)
  ],
  accounts: [
    // ...
  ],
  events: [
    // ...
  ],
  errors: [
    // ...
  ],
} as const
```

**Guarda el archivo** (Ctrl+S)

---

## PASO 3: Instalar Dependencias (si faltan) (3 min)

Desde la carpeta `prediction-market/`:

```bash
cd prediction-market
npm install @coral-xyz/anchor @solana/web3.js
```

**Nota:** Si ya las tienes instaladas, puedes saltar este paso.

---

## PASO 4: Verificar la Integración (5 min)

### 4.1 Crear un Componente de Prueba

Crea: `prediction-market/src/app/test-contract/page.tsx`

```tsx
'use client'

import { useContract } from '@/hooks/useContract'
import { useWallet } from '@solana/wallet-adapter-react'

export default function TestContractPage() {
  const { connected } = useWallet()
  const { markets, loading, error, fetchMarkets } = useContract()

  if (!connected) {
    return <div className="p-8">Por favor conecta tu wallet primero</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Contract Integration</h1>

      <button
        onClick={fetchMarkets}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-6"
      >
        {loading ? 'Loading...' : 'Fetch Markets'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Markets Found: {markets.length}
        </h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(markets, null, 2)}
        </pre>
      </div>
    </div>
  )
}
```

### 4.2 Probar en el Navegador

1. Inicia tu servidor de desarrollo:

   ```bash
   npm run dev
   ```

2. Ve a: `http://localhost:3000/test-contract`

3. **Conecta tu wallet** (Phantom, Solflare, etc.)

4. Click en **"Fetch Markets"**

5. **Resultado esperado:**
   - Si hay markets: Verás el JSON con la data
   - Si no hay markets: Verás `Markets Found: 0` (esto es normal al principio)
   - Si hay error: Revisa que el Program ID y el RPC endpoint sean correctos

---

## PASO 5: Usar en tus Páginas Reales (10 min)

### 5.1 Ejemplo: Markets Page

Actualiza `prediction-market/src/app/markets/page.tsx`:

```tsx
'use client'

import { useContract } from '@/hooks/useContract'
import { useWallet } from '@solana/wallet-adapter-react'

export default function MarketsPage() {
  const { connected } = useWallet()
  const { markets, loading } = useContract()

  if (!connected) {
    return (
      <div className="container mx-auto p-8">
        <p>Conecta tu wallet para ver los mercados</p>
      </div>
    )
  }

  if (loading) {
    return <div className="container mx-auto p-8">Loading markets...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Active Markets</h1>

      {markets.length === 0 ? (
        <p>No markets found. Create one!</p>
      ) : (
        <div className="grid gap-4">
          {markets.map((market) => (
            <div
              key={market.publicKey.toString()}
              className="border p-4 rounded-lg"
            >
              <h2 className="text-xl font-semibold">{market.question}</h2>
              <p className="text-gray-600">{market.description}</p>
              <div className="mt-4 flex gap-4">
                <div>
                  <span className="font-medium">YES:</span>{' '}
                  {market.totalYesAmount.toString()} lamports
                </div>
                <div>
                  <span className="font-medium">NO:</span>{' '}
                  {market.totalNoAmount.toString()} lamports
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Status: {market.resolved ? 'Resolved' : 'Active'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 5.2 Ejemplo: Create Market Page

Actualiza `prediction-market/src/app/create-market/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useContract } from '@/hooks/useContract'
import { useWallet } from '@solana/wallet-adapter-react'

export default function CreateMarketPage() {
  const { connected } = useWallet()
  const { createMarket, loading } = useContract()

  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('crypto')
  const [durationDays, setDurationDays] = useState(7)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question || !description) {
      alert('Please fill all fields')
      return
    }

    try {
      const endTime = Math.floor(Date.now() / 1000) + durationDays * 86400

      const tx = await createMarket({
        question,
        description,
        endTime,
        category,
      })

      alert(`Market created! TX: ${tx}`)

      // Reset form
      setQuestion('')
      setDescription('')
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (!connected) {
    return <div className="p-8">Connect wallet to create markets</div>
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Create New Market</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={200}
            className="w-full border rounded-lg p-3"
            placeholder="Will Bitcoin reach $100k by December 2024?"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full border rounded-lg p-3"
            placeholder="Detailed resolution criteria..."
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="crypto">Crypto</option>
            <option value="politics">Politics</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Duration (days)</label>
          <input
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(parseInt(e.target.value))}
            min={1}
            max={365}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Market'}
        </button>
      </form>
    </div>
  )
}
```

---

## PASO 6: Configurar Variables de Entorno (2 min)

En `prediction-market/.env.local`:

```bash
# Solana Network (devnet or mainnet-beta)
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# RPC Endpoint (opcional, usa el default si no tienes uno custom)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

**Guarda el archivo.**

---

## ✅ Checklist Final

- [ ] Program ID actualizado en `programId.ts`
- [ ] IDL actualizado en `idl.ts`
- [ ] Dependencias instaladas (`@coral-xyz/anchor`, `@solana/web3.js`)
- [ ] Página de test creada y probada
- [ ] Wallet conectada correctamente
- [ ] `fetchMarkets()` funciona sin errores
- [ ] Variables de entorno configuradas
- [ ] `npm run dev` corre sin errores

---

## 🎯 Métodos Disponibles en `useContract()`

```typescript
const {
  // State
  markets, // Array de todos los mercados
  userPositions, // Array de posiciones del usuario
  loading, // Boolean de loading state
  error, // String de error (null si no hay error)

  // Actions
  createMarket, // (params) => Promise<string> - Crea un mercado
  placeBet, // (params) => Promise<string> - Coloca una apuesta
  resolveMarket, // (marketId, outcome) => Promise<string> - Resuelve mercado
  claimWinnings, // (marketId) => Promise<string> - Reclama ganancias

  // Queries
  fetchMarkets, // () => Promise<void> - Refresca todos los mercados
  fetchUserPositions, // () => Promise<void> - Refresca posiciones del usuario
  fetchMarket, // (marketId) => Promise<Market | null> - Obtiene 1 mercado
  fetchUserPosition, // (marketId) => Promise<Position | null> - Obtiene 1 posición

  // Utils
  isConnected, // Boolean
  publicKey, // PublicKey | null
  utils: {
    lamportsToSOL, // (lamports) => number
    solToLamports, // (sol) => BN
    calculateYesPrice, // (yesAmount, noAmount) => number
    formatTimestamp, // (timestamp) => string
    isMarketExpired, // (endTime) => boolean
  },
} = useContract()
```

---

## 🆘 Troubleshooting

### Error: "Program ID not found"

**Solución:** Verifica que el Program ID en `programId.ts` sea exactamente el que te dio Solana Playground.

### Error: "IDL doesn't match"

**Solución:** Re-copia el IDL completo desde Playground al archivo `idl.ts`.

### Error: "Wallet not connected"

**Solución:** Asegúrate de conectar tu wallet (Phantom) antes de llamar métodos del contrato.

### Error: "Insufficient funds"

**Solución:** Necesitas SOL en Devnet. Ve a https://faucet.solana.com/ y solicita 1-2 SOL.

### Markets array está vacío

**Solución:** Esto es normal si acabas de deployar. Usa la página de Create Market para crear el primer mercado.

---

## 🎉 ¡Listo!

Ahora tu frontend está 100% conectado al smart contract deployado en Solana Devnet.

**Próximos pasos:**

1. Crea tu primer mercado desde la UI
2. Coloca apuestas de prueba
3. Resuelve el mercado (después de que expire)
4. Reclama las ganancias

---

## 📚 Archivos Creados

```
prediction-market/
├── src/
│   ├── lib/
│   │   └── solana/
│   │       ├── programId.ts    ← Program ID + RPC config
│   │       ├── idl.ts          ← Interface del contrato
│   │       └── contract.ts     ← Métodos de interacción
│   └── hooks/
│       └── useContract.ts      ← React hook para usar en componentes
```

**Todos estos archivos YA están creados. Solo necesitas:**

1. Actualizar el Program ID
2. Actualizar el IDL
3. Empezar a usar `useContract()` en tus componentes

---

**¡Buena suerte con tu hackathon! 🚀**















