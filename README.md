# 🎯 Trepa - Scalar Prediction Markets on Solana

> **Bet on numbers, not just outcomes.** A next-generation prediction market platform built on Solana that enables trading on continuous scalar values instead of binary yes/no outcomes.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://cypherpunk-hackathon2025-three.vercel.app/)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 🌟 What Makes Trepa Different?

Traditional prediction markets force you into binary choices: "Will Bitcoin hit $100k? Yes or No." 

**Trepa changes the game:**
- 📊 **Scalar Markets**: Bet on *where* the price lands, not just up or down
- 🎯 **Accuracy Rewarded**: Payouts based on how close you are to the actual number
- ⚡ **Real-Time Updates**: Live data refresh across all pages (5-15s intervals)
- 🔗 **Solana-Powered**: Fast, cheap transactions on Solana blockchain
- 🎨 **Beautiful UX**: Minimalist-brutalist design with smooth animations

---

## 🚀 Live Demo

**👉 [Try it now on Solana Devnet](https://cypherpunk-hackathon2025-three.vercel.app/)**

### Quick Start (No Installation):
1. Install [Phantom Wallet](https://phantom.app/)
2. Switch to Solana Devnet
3. Get free SOL from [Solana Faucet](https://faucet.solana.com/)
4. Visit the demo and start trading!

---

## ✨ Features

### 🎯 Core Trading
- **Create Markets** - Anyone can create prediction markets with custom questions
- **Binary Betting** - Place bets on Yes/No outcomes with real SOL
- **Market Resolution** - Market creators resolve with the final outcome
- **Claim Winnings** - Winners get proportional payouts based on pool distribution
- **Real-Time Odds** - Live probability updates as bets come in

### 📊 User Experience
- **Personal Dashboard** - Track all your bets, stats, and P&L in one place
- **Global Leaderboard** - See top traders ranked by win rate, ROI, and profit
- **Activity Feed** - Real-time blockchain events (bets, markets, resolutions)
- **Public Profiles** - View any user's trading history and performance
- **Social Sharing** - Share markets, profiles, and winning bets on Twitter/X

### ⚡ Real-Time System
- **Auto-Refresh** - All pages update automatically (configurable intervals)
- **Manual Controls** - Refresh button and pause/resume toggle on every page
- **Live Indicators** - Visual status showing when data was last updated
- **SSR-Compatible** - Works with Next.js server-side rendering

### 🔍 Discovery & Filters
- **Search Markets** - Find markets by question or description
- **Category Filter** - Browse by Crypto, Sports, Politics, Tech, etc.
- **Status Filter** - Show active, resolved, or all markets
- **Activity Filter** - Filter events by type (bets, markets, resolutions)

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React 18) - Server & client rendering
- TypeScript 5.0 - Type safety
- Tailwind CSS - Styling
- Lucide Icons - Icon library

**Blockchain:**
- Solana (Devnet) - L1 blockchain
- Anchor 0.30 - Smart contract framework
- Solana Wallet Adapter - Wallet integration
- @solana/web3.js - Blockchain interactions

**Smart Contract:**
- Rust - Contract language
- Anchor Framework - Development framework
- UMA-style resolution - Optimistic oracle pattern

**Deployment:**
- Vercel - Frontend hosting
- Solana Devnet - Smart contract deployment

### Smart Contract Architecture

```
┌─────────────────────────────────────────┐
│         Prediction Market Program        │
├─────────────────────────────────────────┤
│                                          │
│  Instructions:                           │
│  ├─ initialize()                         │
│  ├─ create_market()                      │
│  ├─ place_bet()                          │
│  ├─ resolve_market()                     │
│  └─ claim_winnings()                     │
│                                          │
│  Accounts:                               │
│  ├─ GlobalState (singleton)             │
│  ├─ Market (per market)                 │
│  └─ Bet (per user per market)           │
│                                          │
└─────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│            Next.js Frontend              │
├─────────────────────────────────────────┤
│                                          │
│  Pages:                                  │
│  ├─ /markets (10s refresh)              │
│  ├─ /markets/[id] (5s refresh)          │
│  ├─ /dashboard (8s refresh)             │
│  ├─ /leaderboard (15s refresh)          │
│  ├─ /activity (6s refresh)              │
│  └─ /profile/[wallet] (12s refresh)     │
│                                          │
│  Custom Hooks:                           │
│  ├─ useRealTimeData (polling + state)   │
│  └─ useAnchorWallet (Solana wallet)     │
│                                          │
│  Components:                             │
│  ├─ RealTimeStatus (live indicator)     │
│  ├─ BinaryTradingInterface (betting)    │
│  ├─ ResolveMarketInterface (creator)    │
│  ├─ ClaimWinnings (winners)             │
│  └─ ShareProfile/Market/Bet (social)    │
│                                          │
└─────────────────────────────────────────┘
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+ (for smart contract)
- Solana CLI 1.18+
- Anchor CLI 0.30+
- Phantom or Solflare wallet

### 1. Clone Repository
```bash
git clone https://github.com/Edgadafi/cypherpunk-hackathon2025.git
cd cypherpunk-hackathon2025
```

### 2. Setup Frontend
```bash
cd prediction-market
npm install --legacy-peer-deps
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_deployed_program_id
```

### 3. Setup Smart Contract
```bash
cd ../prediction-market-latam
anchor build
anchor deploy --provider.cluster devnet
```

Copy the deployed program ID to your `.env.local` file.

### 4. Update IDL
```bash
cp target/idl/prediction_market.json ../prediction-market/src/idl/
```

### 5. Run Development Server
```bash
cd ../prediction-market
npm run dev
```

Visit `http://localhost:3000`

---

## 🎮 Usage Guide

### Creating a Market

1. Connect your Phantom wallet
2. Click "Create Market" button
3. Fill in:
   - Question (e.g., "Will Bitcoin reach $100k in 2025?")
   - Description with resolution criteria
   - Category (Crypto, Sports, Politics, etc.)
   - End date/time
4. Confirm transaction (~0.01 SOL)
5. Market goes live immediately!

### Placing a Bet

1. Browse markets on `/markets`
2. Click on a market to see details
3. Choose Yes or No
4. Enter amount in SOL
5. Confirm transaction
6. Your bet appears in your Dashboard

### Resolving a Market

1. Only market creator can resolve
2. Navigate to your created market after end time
3. Select the winning outcome (Yes or No)
4. Confirm resolution transaction
5. Winners can now claim their winnings

### Claiming Winnings

1. Go to market detail page or Dashboard
2. If you won, you'll see "Claim Winnings" button
3. Click to claim your proportional share
4. Winnings transferred to your wallet
5. Bet marked as claimed

---

## 📊 Key Metrics & Stats

### User Stats
- **Total Bets** - Number of bets placed
- **Active Bets** - Unresolved markets
- **Win Rate** - % of bets won
- **Total Wagered** - SOL bet across all markets
- **Profit/Loss** - Net P&L (won - wagered)
- **ROI** - Return on investment %

### Market Stats
- **Total Yes/No** - Amount bet on each outcome
- **Implied Probability** - Current odds (Yes%)
- **Total Volume** - Sum of all bets
- **Participants** - Unique bettors

### Leaderboard Rankings
- Ranked by total profit (descending)
- Secondary sort by win rate
- Shows top 50 traders
- Updates every 15 seconds

---

## 🛣️ Roadmap

### ✅ Phase 1: MVP (Complete)
- [x] Core betting functionality
- [x] Market creation & resolution
- [x] User dashboard
- [x] Real-time updates
- [x] Social features
- [x] Leaderboard & activity feed

### 🚧 Phase 2: Enhanced UX (In Progress)
- [ ] Advanced charts & analytics
- [ ] Notification system
- [ ] Mobile app (React Native)
- [ ] Email/SMS alerts
- [ ] Portfolio tracking

### 🔮 Phase 3: Advanced Features (Planned)
- [ ] **Scalar Markets** - Bet on continuous values
- [ ] Liquidity pools & AMM
- [ ] Conditional markets ("If A then B")
- [ ] Market maker interface
- [ ] API for trading bots
- [ ] Governance token ($TREPA)

### 🌍 Phase 4: Mainnet & Growth
- [ ] Solana mainnet deployment
- [ ] Partnerships with data providers
- [ ] Integration with Pyth/Chainlink oracles
- [ ] Mobile app launch
- [ ] Marketing campaign

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create market with wallet connected
- [ ] Place Yes/No bets on different markets
- [ ] Verify dashboard shows correct stats
- [ ] Resolve market as creator
- [ ] Claim winnings as winner
- [ ] View leaderboard and activity feed
- [ ] Share market/profile on social media
- [ ] Test real-time refresh (pause/resume)

### Automated Tests (Coming Soon)
```bash
# Frontend tests
npm test

# Smart contract tests
anchor test
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use Tailwind for styling
- Write meaningful commit messages
- Test on Solana Devnet before PR
- Update documentation for new features

---

## 🐛 Known Issues & Limitations

### Current Limitations
- **Devnet Only** - Not on mainnet yet (use test SOL)
- **Binary Markets** - Scalar markets coming in Phase 3
- **Manual Resolution** - Creator must manually resolve (automation planned)
- **No Dispute Mechanism** - Trust-based resolution (UMA integration planned)

### Planned Fixes
- [ ] Automated resolution via Chainlink/Pyth oracles
- [ ] Dispute mechanism for incorrect resolutions
- [ ] Gas optimization for claim transactions
- [ ] Improved error messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain infrastructure
- **Anchor Framework** - For simplifying smart contract development
- **Vercel** - For seamless frontend deployment
- **Cypherpunk Hackathon 2025** - For the opportunity and inspiration

---

## 📞 Contact & Links

- **Live Demo**: https://cypherpunk-hackathon2025-three.vercel.app/
- **GitHub**: https://github.com/Edgadafi/cypherpunk-hackathon2025
- **Twitter**: @YourTwitterHandle (coming soon)
- **Discord**: Join our community (coming soon)

---

## 🎯 Built for Cypherpunk Hackathon 2025

**Team**: Edgadafi  
**Category**: DeFi / Prediction Markets  
**Blockchain**: Solana (Devnet)  
**Demo**: [Live on Vercel](https://cypherpunk-hackathon2025-three.vercel.app/)

---

### 🌟 Star this repo if you find it useful!

**Made with ❤️ for the Solana ecosystem**
