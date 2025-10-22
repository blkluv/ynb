# 🔮 PrismaFi - Scalar Prediction Markets on Solana

> **Hackathon Cypherpunk 2025** - Next-generation prediction markets with continuous scoring

## 🚀 Overview

PrismaFi is a scalar prediction market platform built on Solana that revolutionizes forecasting by rewarding **accuracy over binary outcomes**. Instead of simple yes/no bets, users predict exact values and are paid based on how close they are to the truth.

### ✨ Key Features

- **📊 Scalar Markets**: Predict exact numbers (CPI, NFP, asset prices, etc.)
- **🎯 Accuracy-Based Payouts**: Closer predictions = higher rewards
- **🔗 Solana Integration**: Fast, low-cost transactions on Devnet/Mainnet
- **💼 Phantom Wallet Support**: Seamless Web3 wallet connection
- **📈 Real-time Portfolio Tracking**: Monitor positions and performance
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare, etc.)

### Blockchain
- **Network**: Solana Devnet (Mainnet-Beta ready)
- **Smart Contract**: Anchor Framework (Rust)
- **Program ID**: `6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7`
- **IDL**: Full 11-instruction interface with governance and resolution

### Infrastructure
- **Hosting**: Vercel
- **RPC**: Public Solana endpoints (configurable)

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm or pnpm
Git
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Edgadafi/prismafi-prediction-market.git
cd prismafi-prediction-market
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

Add your configuration:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

---

## 📦 Project Structure

```
prismafi-prediction-market/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── markets/           # Browse markets
│   │   ├── create-market/     # Create new market
│   │   ├── portfolio/         # User positions
│   │   └── activity/          # Recent activity
│   ├── components/
│   │   ├── landing/           # Landing page sections
│   │   ├── layout/            # Header, Layout, WalletButton
│   │   └── wallet/            # Wallet connection UI
│   ├── hooks/
│   │   ├── useContract.ts     # Smart contract interaction
│   │   └── useSolanaWallet.ts # Wallet connection hook
│   ├── lib/
│   │   ├── solana/            # Solana integration
│   │   │   ├── contract.ts    # Contract functions
│   │   │   ├── idl.ts         # Program IDL
│   │   │   └── programId.ts   # Program configuration
│   │   └── mock/              # Mock data (demo mode)
│   └── providers/
│       └── WalletProvider.tsx # Solana Wallet Context
├── public/
│   └── images/                # Logos and assets
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 Smart Contract Integration

### Program Information
- **Program ID**: `6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7`
- **Network**: Solana Devnet
- **Framework**: Anchor 0.32.0

### Key Instructions
1. `initialize` - Initialize governance
2. `createMarket` - Create new prediction market
3. `placeBet` - Place a position
4. `resolveMarket` - Resolve with outcome
5. `claimWinnings` - Claim rewards
6. `submitEvidence` - Submit proof for resolution
7. `updateUserProfile` - Update user reputation
8. `cancelMarket` - Cancel market (admin)

### Usage Example
```typescript
import { useContract } from '@/hooks/useContract'

function MarketComponent() {
  const { createMarket, placeBet, loading } = useContract()
  
  const handleCreateMarket = async () => {
    await createMarket({
      question: "What will CPI be in March 2025?",
      description: "BLS CPI-U NSA at 08:30 ET",
      expiresAt: new Date('2025-03-15'),
      category: 'economics'
    })
  }
  
  return <button onClick={handleCreateMarket}>Create Market</button>
}
```

---

## 🎨 Features

### Landing Page
- Hero section with gradient logo
- Benefits overview (Speed, Fair, Profitable)
- How It Works section (3-step process)
- Call-to-action buttons

### Markets Page
- Browse all active markets
- Filter by category, status, date
- Search functionality
- Market cards with key stats

### Create Market
- Form with validation
- Category selection
- Date/time picker
- Resolution criteria editor

### Portfolio
- Active positions overview
- PnL tracking
- Performance metrics
- Position history

### Wallet Integration
- Multi-wallet support (Phantom, Solflare, etc.)
- Balance display
- Network indicator
- Transaction history

---

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation

# Deployment
npm run deploy       # Build + deploy to Vercel
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Configure build settings**:
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`
3. **Add environment variables**:
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   ```
4. **Deploy** 🚀

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

---

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network (devnet/mainnet-beta) | `devnet` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Custom RPC endpoint | `https://api.devnet.solana.com` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🏆 Hackathon Cypherpunk 2025

Built for the Cypherpunk Hackathon 2025 - showcasing the future of prediction markets with scalar outcomes and accuracy-based incentives.

### Team
- **Edgar Dafi** - Full-stack development, smart contracts, UI/UX

### Links
- **Live Demo**: https://prismafi-prediction-market.vercel.app
- **GitHub**: https://github.com/Edgadafi/prismafi-prediction-market
- **Solana Explorer**: [View Program](https://explorer.solana.com/address/6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7?cluster=devnet)

---

## 📞 Contact

For questions or collaboration:
- GitHub: [@Edgadafi](https://github.com/Edgadafi)
- Email: edgadafi@users.noreply.github.com

---

**Built with ❤️ on Solana**
