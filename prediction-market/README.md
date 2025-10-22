# PrismaFi Frontend

Modern Next.js frontend for PrismaFi prediction markets platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
prediction-market/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── markets/             # Markets listing page
│   │   │   └── [id]/            # Individual market page
│   │   ├── portfolio/           # User portfolio page
│   │   ├── create-market/       # Market creation page
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── layout/              # Layout components
│   │   └── landing/             # Landing page sections
│   ├── hooks/                   # Custom React hooks
│   │   ├── useContract.ts       # Smart contract interactions
│   │   └── useSolanaWallet.ts   # Wallet management
│   ├── lib/                     # Utility libraries
│   │   ├── mock/                # Mock data for demo
│   │   └── solana/              # Solana integration
│   │       ├── contract.ts      # Contract methods
│   │       ├── idl.ts           # Program IDL
│   │       └── programId.ts     # Program ID config
│   └── providers/               # Context providers
│       └── WalletProvider.tsx   # Wallet context
├── public/                      # Static assets
│   └── images/                  # Images and icons
├── .env.local                   # Environment variables (local)
└── next.config.mjs              # Next.js configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the `prediction-market/` directory:

```env
# Solana RPC Endpoint
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com

# Program ID (replace with your deployed contract)
NEXT_PUBLIC_PROGRAM_ID=YourProgramIDHere

# Network (devnet/mainnet-beta)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### Smart Contract Integration

1. **Deploy your smart contract** to Solana
2. **Copy the Program ID** from deployment output
3. **Update** `src/lib/solana/programId.ts`:
```typescript
export const PROGRAM_ID = new PublicKey('YourProgramIDHere')
```
4. **Copy the IDL** from `target/idl/prediction_market.json`
5. **Update** `src/lib/solana/idl.ts` with the new IDL

## 📦 Dependencies

### Core
- **Next.js 14.2** - React framework
- **React 18** - UI library
- **TypeScript 5** - Type safety

### Solana
- **@solana/web3.js** - Solana JavaScript API
- **@solana/wallet-adapter-react** - Wallet integration
- **@coral-xyz/anchor** - Anchor framework client

### Styling
- **Tailwind CSS** - Utility-first CSS
- **PostCSS** - CSS processing

## 🎨 Features

### Current Features
- ✅ Browse prediction markets
- ✅ View market details and odds
- ✅ Place bets (YES/NO)
- ✅ Filter and search markets
- ✅ Wallet connection
- ✅ Demo mode with mock data

### Coming Soon
- 🚧 Portfolio tracking
- 🚧 Market creation form
- 🚧 Transaction history
- 🚧 Real-time updates
- 🚧 Mobile app

## 🔌 API Integration

### Fetching Markets

```typescript
import { fetchAllMarkets } from '@/lib/solana/contract'

const markets = await fetchAllMarkets(wallet)
```

### Placing a Bet

```typescript
import { placeBet } from '@/lib/solana/contract'

const signature = await placeBet(
  wallet,
  marketPubkey,
  true,        // true = YES, false = NO
  1.5          // Amount in SOL
)
```

### Creating a Market

```typescript
import { createMarket } from '@/lib/solana/contract'

const signature = await createMarket(
  wallet,
  "Will Bitcoin reach $100K?",
  "Market resolves YES if...",
  Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days
  "Crypto"
)
```

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set Root Directory to `prediction-market`
   - Add environment variables
   - Deploy

3. **Auto-deploy**
   - Every push to `main` triggers a new deployment

### Manual Build

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Wallet Not Connecting
- Ensure you have a Solana wallet extension installed (Phantom, Solflare)
- Check if you're on the correct network (Devnet/Mainnet)
- Clear browser cache and try again

### Contract Methods Failing
- Verify Program ID is correct
- Ensure IDL matches deployed contract
- Check RPC endpoint is responding
- Confirm wallet has enough SOL for transaction fees

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## 🤝 Contributing

See the main [README.md](../README.md) in the repository root for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.
