# 🚀 PrismaFi - Quick Integration Guide (5 Minutes)

## ✅ What's Ready

You now have:

- ✅ **Smart contract with bugs fixed** (PlaceBet + ClaimWinnings)
- ✅ **Solana Playground deployment guide** (`SOLANA_PLAYGROUND_DEPLOY.md`)
- ✅ **TypeScript integration module** (`src/lib/solana-integration.ts`)
- ✅ **React hook for components** (`src/hooks/usePredictionMarket.ts`)

---

## 📋 Next Steps (In Order)

### **Step 1: Deploy Smart Contract (5 min)**

Follow: `SOLANA_PLAYGROUND_DEPLOY.md`

1. Go to https://beta.solpg.io/
2. Copy your fixed `lib.rs` code
3. Build → Deploy → Get Program ID
4. Download IDL JSON

**You'll get:**

```
Program ID: 7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA
IDL: prediction_market.json
```

---

### **Step 2: Install Dependencies (2 min)**

Add these to your `package.json`:

```bash
npm install @solana/web3.js @project-serum/anchor js-sha256 @coral-xyz/anchor
```

Or if using yarn:

```bash
yarn add @solana/web3.js @project-serum/anchor js-sha256 @coral-xyz/anchor
```

---

### **Step 3: Update Program ID (30 seconds)**

1. Open `src/lib/solana-integration.ts`
2. Replace line 27:

```typescript
// BEFORE:
export const PROGRAM_ID = new PublicKey('11111111111111111111111111111111')

// AFTER (use your deployed Program ID):
export const PROGRAM_ID = new PublicKey(
  '7PZf8wZqG5t3H9xKvN4M8rY2wXq1Q3nC6sD9xJ2vL4kA'
)
```

---

### **Step 4: Add IDL File (1 min)**

1. Create directory: `src/idl/`
2. Save your downloaded IDL as: `src/idl/prediction_market.json`
3. Create `src/idl/index.ts`:

```typescript
import idl from './prediction_market.json'
import { Idl } from '@project-serum/anchor'

export const PREDICTION_MARKET_IDL = idl as Idl
```

---

### **Step 5: Update Components (5 min)**

#### **Example: Betting Component**

Replace your existing betting logic with:

```typescript
// src/components/MarketCard.tsx
import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'

export function MarketCard({ marketId }: { marketId: string }) {
  const { connected, placeBet, isPlacingBet, getUserPosition } =
    usePredictionMarket()

  const [amount, setAmount] = useState('1.0')
  const [outcome, setOutcome] = useState(true) // true = YES

  const handleBet = async () => {
    if (!connected) {
      alert('Connect wallet first')
      return
    }

    const signature = await placeBet({
      marketPubkey: new PublicKey(marketId),
      outcome,
      amount: parseFloat(amount),
    })

    if (signature) {
      console.log('Bet successful!', signature)
      // Refresh market data here
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Place Your Bet</h2>

      {/* Outcome Selector */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setOutcome(true)}
          className={`flex-1 py-3 rounded ${
            outcome ? 'bg-green-500 text-white' : 'bg-gray-100'
          }`}
        >
          YES
        </button>
        <button
          onClick={() => setOutcome(false)}
          className={`flex-1 py-3 rounded ${
            !outcome ? 'bg-red-500 text-white' : 'bg-gray-100'
          }`}
        >
          NO
        </button>
      </div>

      {/* Amount Input */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-3 border rounded mb-4"
        placeholder="Amount in SOL"
        step="0.1"
        min="0.1"
      />

      {/* Submit Button */}
      <button
        onClick={handleBet}
        disabled={!connected || isPlacingBet}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPlacingBet
          ? 'Placing Bet...'
          : `Bet ${amount} SOL on ${outcome ? 'YES' : 'NO'}`}
      </button>
    </div>
  )
}
```

#### **Example: Create Market Component**

```typescript
// src/components/CreateMarketForm.tsx
import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import { useState } from 'react'

export function CreateMarketForm() {
  const { createMarket, isCreatingMarket } = usePredictionMarket()

  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Politics')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const endTime = Math.floor(new Date(endDate).getTime() / 1000)

    const marketPDA = await createMarket({
      question,
      description,
      endTime,
      category,
    })

    if (marketPDA) {
      console.log('Market created at:', marketPDA.toString())
      // Reset form or redirect
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Market Question (max 200 chars)"
        maxLength={200}
        required
        className="w-full px-4 py-2 border rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (max 1000 chars)"
        maxLength={1000}
        required
        className="w-full px-4 py-2 border rounded h-32"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="Politics">Politics</option>
        <option value="Sports">Sports</option>
        <option value="Crypto">Crypto</option>
        <option value="Economics">Economics</option>
      </select>

      <input
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />

      <button
        type="submit"
        disabled={isCreatingMarket}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isCreatingMarket ? 'Creating Market...' : 'Create Market'}
      </button>
    </form>
  )
}
```

---

## 🎯 Testing Checklist

After integration, test these flows:

### **Flow 1: Create Market**

1. Connect wallet
2. Fill create market form
3. Submit → Approve transaction
4. Check Solana Explorer for market creation
5. Verify market appears in your UI

### **Flow 2: Place Bet**

1. Select a market
2. Choose YES or NO
3. Enter amount (try 0.5 SOL)
4. Submit → Approve transaction
5. Verify bet recorded on-chain

### **Flow 3: Resolve & Claim (Admin)**

1. Wait for market end time (or use past date for testing)
2. Call `resolveMarket` with winning outcome
3. Users with winning positions call `claimWinnings`
4. Verify SOL transferred back

---

## 🐛 Troubleshooting

### Error: "Wallet not connected"

**Solution:** Make sure Privy is initialized in `_app.tsx`:

```typescript
import { PrivyProvider } from '@privy-io/react-auth'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: 'solana', // ← Important!
        supportedChains: ['solana'],
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  )
}
```

### Error: "Cannot find module @project-serum/anchor"

**Solution:**

```bash
npm install @project-serum/anchor @coral-xyz/anchor
```

### Error: "Transaction simulation failed"

**Possible causes:**

1. Insufficient SOL for rent (need ~0.02 SOL)
2. Market already exists (same question hash)
3. Market expired (can't bet after end time)
4. Already claimed winnings

**Solution:** Check Solana Explorer logs for exact error

### Error: "sha256 is not a function"

**Solution:**

```bash
npm install js-sha256
```

Then in `solana-integration.ts`:

```typescript
import { sha256 } from 'js-sha256'
```

---

## 📊 Next Features to Add

Once basic integration works:

### **Phase 1: Data Fetching**

- [ ] Fetch all active markets (use `getProgramAccounts`)
- [ ] Display market odds (calculate from totalYes/totalNo)
- [ ] Show user's positions
- [ ] Real-time updates (polling or WebSocket)

### **Phase 2: UX Improvements**

- [ ] Transaction confirmation modals
- [ ] Loading states with progress
- [ ] Error handling with user-friendly messages
- [ ] Optimistic UI updates

### **Phase 3: Advanced Features**

- [ ] Market search and filters
- [ ] User portfolio page
- [ ] Leaderboard (top predictors)
- [ ] Market analytics graphs

---

## 🎬 Demo Script for Hackathon

### **1-Minute Demo Flow:**

1. **Show Landing Page** (5 sec)
   - "PrismaFi - Decentralized Prediction Markets on Solana"
2. **Connect Wallet** (5 sec)
   - Click "Connect" → Phantom popup → Connected
3. **Browse Markets** (10 sec)
   - Show 2-3 active markets
   - Display odds, volume, end time
4. **Place Bet** (15 sec)
   - Select market: "Will Argentina dollarize?"
   - Choose YES
   - Enter 0.5 SOL
   - Click Bet → Transaction confirms
   - Show Explorer link
5. **Show Smart Contract** (10 sec)
   - Open Solana Explorer
   - Show deployed program
   - Point to verified instructions
6. **Explain Value Prop** (15 sec)
   - "400ms finality, $0.00025 fees"
   - "Fully decentralized resolution"
   - "LATAM-focused use cases"

---

## 🎯 Success Metrics

After integration, you should have:

- ✅ Wallet connection working
- ✅ Create market functional (on Devnet)
- ✅ Place bet functional
- ✅ Real-time balance updates
- ✅ Explorer links working
- ✅ Error handling with toasts
- ✅ Loading states on buttons

---

## 📝 Final Checklist

Before demoing:

- [ ] Program deployed to Devnet
- [ ] Program ID updated in code
- [ ] IDL file added to project
- [ ] Dependencies installed
- [ ] Components using the hook
- [ ] Create 2-3 test markets
- [ ] Place test bets
- [ ] Test resolve + claim flow
- [ ] Screen recording done
- [ ] Pitch deck updated with Program ID

---

**Questions? Drop them in the hackathon Discord or open an issue!**

**Good luck! 🚀**


